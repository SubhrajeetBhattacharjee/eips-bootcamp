import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCapApplicationDto } from './dto/create-cap-application.dto';
import { UpdateCapStatusDto } from './dto/update-cap-status.dto';

@Injectable()
export class CapService {
  constructor(private prisma: PrismaService) {}

  apply(createCapApplicationDto: CreateCapApplicationDto) {
    return this.prisma.cAPApplication.create({
      data: createCapApplicationDto,
    });
  }

  getStatus(userId: string) {
    return this.prisma.cAPApplication.findUnique({
      where: { userId },
      include: {
        user: true,
      },
    });
  }

  async getAllApplications() {
    const applications = await this.prisma.cAPApplication.findMany({
      include: {
        user: {
          include: {
            profile: true,
            referralCode: {
              include: { referrals: true },
            },
            xpTransactions: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return applications.map((app) => {
      const user = app.user;
      const xp = user.xpTransactions.reduce((acc, tx) => acc + tx.amount, 0);
      const referralCount = user.referralCode?.referrals.length || 0;

      let linkedin = '';
      let twitter = '';
      let github = '';
      if (app.socialLinks) {
        if (app.socialLinks.includes('linkedin')) linkedin = app.socialLinks;
        else if (
          app.socialLinks.includes('twitter') ||
          app.socialLinks.includes('x.com')
        )
          twitter = app.socialLinks;
        else if (app.socialLinks.includes('github')) github = app.socialLinks;
        else linkedin = app.socialLinks;
      }

      return {
        id: app.id,
        name: app.fullName,
        email: user.email,
        college: app.college,
        city: app.city,
        track: 'Smart Contract',
        batch: `Batch ${app.graduationYear}`,
        status: app.status.toLowerCase(),
        appliedDate: app.createdAt.toISOString(),
        avatar:
          user.profile?.avatarUrl || user.image ||
          `https://api.dicebear.com/7.x/avataaars/svg?seed=${app.fullName}`,
        referralCount,
        xp,
        leaderboardRank: 0,
        linkedin,
        twitter,
        github,
        whyJoinCAP: app.whyJoin,
        communityExperience: app.communityExperience || '',
      };
    });
  }

  async updateStatus(id: string, updateCapStatusDto: UpdateCapStatusDto) {
    const application = await this.prisma.cAPApplication.update({
      where: { id },
      data: {
        status: updateCapStatusDto.status,
      },
    });

    if (updateCapStatusDto.status === 'APPROVED') {
      const user = await this.prisma.user.findUnique({
        where: { id: application.userId },
      });
      if (user && user.role !== 'ADMIN') {
        await this.prisma.user.update({
          where: {
            id: application.userId,
          },
          data: {
            role: 'AMBASSADOR',
          },
        });
      }

      await this.prisma.xPTransaction.create({
        data: {
          userId: application.userId,
          amount: 500,
          reason: 'CAP Application Approved',
        },
      });
    }

    return application;
  }

  async revokeApplication(id: string) {
    const application = await this.prisma.cAPApplication.findUnique({
      where: { id },
    });

    if (!application) {
      throw new Error('Application not found');
    }

    // Downgrade user role only if they are not an ADMIN
    const user = await this.prisma.user.findUnique({
      where: { id: application.userId },
    });
    if (user && user.role !== 'ADMIN') {
      await this.prisma.user.update({
        where: { id: application.userId },
        data: { role: 'STUDENT' },
      });
    }

    // Delete the application so they can apply again
    return this.prisma.cAPApplication.delete({
      where: { id },
    });
  }

  async getAnalytics() {
    const totalUsers = await this.prisma.user.count();

    const totalApplicants = await this.prisma.cAPApplication.count();

    const approvedAmbassadors = await this.prisma.user.count({
      where: {
        role: 'AMBASSADOR',
      },
    });

    const totalReferrals = await this.prisma.referral.count();

    return {
      totalUsers,
      totalApplicants,
      approvedAmbassadors,
      totalReferrals,
    };
  }
}
