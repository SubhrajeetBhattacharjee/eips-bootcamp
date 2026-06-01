import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GenerateReferralDto } from './dto/generate-referral.dto';
import { UseReferralDto } from './dto/use-referral.dto';

@Injectable()
export class ReferralsService {
  constructor(private prisma: PrismaService) {}

  async generate(generateReferralDto: GenerateReferralDto) {
    const { userId, username } = generateReferralDto;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) throw new BadRequestException('User not found');
    if (user.role !== 'AMBASSADOR') {
      throw new BadRequestException('Only ambassadors can generate referral codes');
    }

    const existingCode = await this.prisma.referralCode.findUnique({
      where: { userId },
    });

    if (existingCode) return { code: existingCode.code };

    const randomNumber = Math.floor(100 + Math.random() * 900);
    const code = `${username.toUpperCase()}${randomNumber}`;

    const newCode = await this.prisma.referralCode.create({
      data: {
        code,
        userId,
      },
    });
    return { code: newCode.code };
  }

  async useReferral(useReferralDto: UseReferralDto) {
    const { referralCode, referredUserId } = useReferralDto;

    const refCode = await this.prisma.referralCode.findUnique({
      where: { code: referralCode },
    });

    if (!refCode) throw new BadRequestException('Invalid referral code');
    if (refCode.userId === referredUserId) throw new BadRequestException('Cannot refer yourself');

    const existingRef = await this.prisma.referral.findUnique({
      where: { referredUserId },
    });

    if (existingRef) throw new BadRequestException('User already referred');

    const newReferral = await this.prisma.referral.create({
      data: {
        referralCodeId: refCode.id,
        referredUserId,
        status: 'JOINED',
      },
    });

    await this.prisma.xPTransaction.create({
      data: {
        userId: refCode.userId,
        amount: 50,
        reason: 'Referral Joined',
      },
    });

    return newReferral;
  }

  async getReferralStats(userId: string) {
    const refCode = await this.prisma.referralCode.findUnique({
      where: { userId },
      include: { referrals: true },
    });

    if (!refCode) return null;

    const totalClicks = refCode.clicks;
    const totalReferrals = refCode.referrals.length;
    const pendingJoins = refCode.referrals.filter((r) => r.status === 'JOINED').length;
    const successfulSignups = refCode.referrals.filter((r) => r.status === 'ONBOARDED').length;

    const xp = await this.prisma.xPTransaction.aggregate({
      where: {
        userId,
        reason: { startsWith: 'Referral' },
      },
      _sum: { amount: true },
    });

    return {
      referralCode: refCode.code,
      referralLink: `https://eipsinsight.xyz/ref/${refCode.code}`,
      totalClicks,
      totalReferrals,
      pendingJoins,
      successfulSignups,
      xpEarned: xp._sum.amount || 0,
      monthlyGrowth: {
        totalReferrals: Math.round(totalReferrals * 0.4),
        pendingJoins: Math.round(pendingJoins * 0.4),
        successfulSignups: Math.round(successfulSignups * 0.4),
        xpEarned: Math.round((xp._sum.amount || 0) * 0.4),
      },
      peopleInspired: totalReferrals,
      communitiesReached: 1,
    };
  }

  async getActivity(userId: string) {
    const refCode = await this.prisma.referralCode.findUnique({
      where: { userId },
      include: {
        referrals: {
          include: { referredUser: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!refCode) return [];

    return refCode.referrals.map((r) => ({
      id: r.id,
      name: r.referredUser?.username || 'Anonymous',
      action: r.status === 'JOINED' ? 'joined' : 'completed_onboarding',
      timestamp: r.createdAt.toISOString(),
      xpEarned: r.status === 'JOINED' ? 50 : 100,
      status: r.status === 'JOINED' ? 'Joined' : 'Completed',
    }));
  }

  async trackClick(code: string) {
    const refCode = await this.prisma.referralCode.findUnique({
      where: { code },
    });
    if (refCode) {
      await this.prisma.referralCode.update({
        where: { id: refCode.id },
        data: { clicks: refCode.clicks + 1 },
      });
    }
    return { success: true };
  }

  async getLeaderboard() {
    const users = await this.prisma.user.findMany({
      include: {
        profile: true,
        capApplication: true,
        xpTransactions: true,
        referralCode: {
          include: { referrals: true },
        },
      },
    });

    const leaderboard = users.map((user) => {
      const xp = user.xpTransactions.reduce((sum, tx) => sum + tx.amount, 0);
      const referralsCount = user.referralCode?.referrals?.length || 0;
      return {
        userId: user.id,
        name: user.profile?.fullName || user.username || (user.email ? user.email.split('@')[0] : 'Unknown'),
        handle: `@${user.username || user.id.substring(0, 5)}`,
        avatarUrl: user.profile?.avatarUrl,
        xp,
        referrals: referralsCount,
        capStatus: user.capApplication?.status || 'None',
        streak: 0,
      };
    });

    leaderboard.sort((a, b) => b.xp - a.xp);

    return leaderboard.map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));
  }
}