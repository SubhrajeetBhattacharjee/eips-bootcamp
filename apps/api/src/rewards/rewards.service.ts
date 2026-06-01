import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { XpService } from '../xp/xp.service';

@Injectable()
export class RewardsService {
  constructor(
    private prisma: PrismaService,
    private xpService: XpService,
  ) {}

  async getRewardsData(userId: string) {
    const rewards = await this.prisma.reward.findMany();
    const history = await this.prisma.rewardRedemption.findMany({
      where: { userId },
      include: { reward: true },
      orderBy: { redeemedAt: 'desc' },
    });

    const xpTransactions = await this.prisma.xPTransaction.findMany({
      where: { userId },
    });

    const totalXPEarned = xpTransactions
      .filter((t) => t.amount > 0)
      .reduce((acc, t) => acc + t.amount, 0);

    const xpSpent = history.reduce((acc, h) => acc + h.xpSpent, 0);
    const currentXP = totalXPEarned - xpSpent;
    
    // We can define next unlocks at intervals of 1000 for display
    const nextRewardUnlock = (Math.floor(totalXPEarned / 1000) + 1) * 1000;
    const progressPercentage = Math.min(100, Math.max(0, Math.floor((totalXPEarned / nextRewardUnlock) * 100)));

    const userData = {
      currentXP,
      totalXPEarned,
      rewardsRedeemed: history.length,
      totalValueUnlocked: xpSpent,
      nextRewardUnlock,
      progressPercentage,
    };

    return {
      rewards,
      history: history.map((h) => ({
        rewardId: h.rewardId,
        title: h.reward.title,
        xpSpent: h.xpSpent,
        redeemedAt: h.redeemedAt.toISOString(),
      })),
      userData,
    };
  }

  async redeemReward(userId: string, rewardId: string) {
    const reward = await this.prisma.reward.findUnique({
      where: { id: rewardId },
    });

    if (!reward || !reward.available) {
      throw new BadRequestException('Reward not available');
    }

    const { userData } = await this.getRewardsData(userId);

    if (userData.currentXP < reward.cost) {
      throw new BadRequestException('Not enough XP to redeem this reward');
    }

    // Process redemption
    const redemption = await this.prisma.rewardRedemption.create({
      data: {
        userId,
        rewardId,
        xpSpent: reward.cost,
      },
    });

    // Deduct XP via transaction
    await this.xpService.awardXp({ userId, amount: -reward.cost, reason: `Redeemed ${reward.title}` });

    return { success: true, message: 'Reward redeemed successfully!' };
  }
}
