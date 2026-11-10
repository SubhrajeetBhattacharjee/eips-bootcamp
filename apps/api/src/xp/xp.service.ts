import { Injectable, NotFoundException, Optional } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AwardXpDto } from './dto/award-xp.dto';
import { LeaguesService } from '../leagues/leagues.service';

export interface XpLevelInfo {
  level: number;
  title: string;
  currentLevelXp: number;
  nextLevelXp: number;
  progressPercent: number;
}

export function calculateLevel(totalXp: number): XpLevelInfo {
  const thresholds = [
    { level: 1, xp: 0, title: 'Novice Builder' },
    { level: 2, xp: 250, title: 'Apprentice Coder' },
    { level: 3, xp: 600, title: 'Protocol Explorer' },
    { level: 4, xp: 1200, title: 'EIP Developer' },
    { level: 5, xp: 2500, title: 'Core Contributor' },
    { level: 6, xp: 5000, title: 'Protocol Architect' },
  ];

  let currentTier = thresholds[0];
  let nextTier = thresholds[1];

  for (let i = 0; i < thresholds.length; i++) {
    if (totalXp >= thresholds[i].xp) {
      currentTier = thresholds[i];
      nextTier = thresholds[i + 1] || {
        level: currentTier.level + 1,
        xp: currentTier.xp + 3000,
        title: 'Master Protocol Fellow',
      };
    }
  }

  const range = nextTier.xp - currentTier.xp;
  const progress = Math.min(
    100,
    Math.max(0, Math.round(((totalXp - currentTier.xp) / range) * 100)),
  );

  return {
    level: currentTier.level,
    title: currentTier.title,
    currentLevelXp: currentTier.xp,
    nextLevelXp: nextTier.xp,
    progressPercent: progress,
  };
}

@Injectable()
export class XpService {
  constructor(
    private readonly prisma: PrismaService,
    @Optional() private readonly leaguesService?: LeaguesService,
  ) {}

  /**
   * Centralized, idempotent XP awarding method with anti-farming protection
   */
  async awardXp(awardXpDto: AwardXpDto) {
    const { userId, amount, reason, category, referenceId, multiplier } =
      awardXpDto;

    // Verify user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Anti-farming check: prevent duplicate awarding if referenceId is provided
    if (referenceId) {
      const existing = await this.prisma.xPTransaction.findUnique({
        where: {
          userId_referenceId: { userId, referenceId },
        },
      });

      if (existing) {
        return {
          success: true,
          transaction: existing,
          alreadyAwarded: true,
          xpAwarded: 0,
          message: 'XP already awarded for this activity',
        };
      }
    }

    // Apply multiplier (e.g. streak boost 1.5x)
    const effectiveMultiplier = multiplier && multiplier > 0 ? multiplier : 1.0;
    const finalAmount = Math.max(1, Math.round(amount * effectiveMultiplier));

    // Create the transaction
    const transaction = await this.prisma.xPTransaction.create({
      data: {
        userId,
        amount: finalAmount,
        reason,
        category: category || 'GENERAL',
        referenceId: referenceId || null,
      },
    });

    // Synchronize to weekly league cohort
    if (this.leaguesService) {
      await this.leaguesService
        .recordUserXp(userId, finalAmount)
        .catch((err) => {
          console.error('Failed to sync league XP:', err);
        });
    }

    return {
      success: true,
      transaction,
      alreadyAwarded: false,
      xpAwarded: finalAmount,
    };
  }

  /**
   * Retrieves aggregated XP, level info, and category breakdown for a user
   */
  async getUserXp(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const [aggregate, categoryGroup, recentTransactions] = await Promise.all([
      this.prisma.xPTransaction.aggregate({
        where: { userId },
        _sum: { amount: true },
      }),
      this.prisma.xPTransaction.groupBy({
        by: ['category'],
        where: { userId },
        _sum: { amount: true },
      }),
      this.prisma.xPTransaction.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
    ]);

    const totalXp = aggregate._sum.amount ?? 0;
    const levelInfo = calculateLevel(totalXp);

    const categoryBreakdown: Record<string, number> = {};
    for (const group of categoryGroup) {
      categoryBreakdown[group.category] = group._sum.amount ?? 0;
    }

    return {
      userId,
      totalXp,
      levelInfo,
      categoryBreakdown,
      transactions: recentTransactions,
      recentTransactions,
    };
  }

  /**
   * Retrieves paginated XP transaction history with optional category filtering
   */
  async getXpHistory(
    userId: string,
    options?: { page?: number; limit?: number; category?: string },
  ) {
    const page = Math.max(1, options?.page || 1);
    const limit = Math.min(50, Math.max(1, options?.limit || 20));
    const skip = (page - 1) * limit;

    const where: Prisma.XPTransactionWhereInput = { userId };
    if (options?.category) {
      where.category = options.category;
    }

    const [total, transactions] = await Promise.all([
      this.prisma.xPTransaction.count({ where }),
      this.prisma.xPTransaction.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    return {
      userId,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      transactions,
    };
  }
}
