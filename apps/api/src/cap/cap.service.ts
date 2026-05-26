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

  getAllApplications() {
    return this.prisma.cAPApplication.findMany({
      include: {
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
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
    await this.prisma.user.update({
      where: {
        id: application.userId,
      },
      data: {
        role: 'AMBASSADOR',
      },
    });
  }

  return application;
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