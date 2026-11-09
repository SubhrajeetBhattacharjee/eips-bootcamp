import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LeagueTier } from '@prisma/client';

export const COHORT_CAPACITY = 30;

export const TIER_ORDER: LeagueTier[] = [
  LeagueTier.BRONZE,
  LeagueTier.SILVER,
  LeagueTier.GOLD,
  LeagueTier.PLATINUM,
  LeagueTier.DIAMOND,
  LeagueTier.MASTER,
];

export interface WeekTimeInfo {
  weekNumber: number;
  year: number;
  startDate: Date;
  endDate: Date;
  remainingSeconds: number;
}

export function getWeekTimeInfo(referenceDate = new Date()): WeekTimeInfo {
  const date = new Date(referenceDate);
  // Normalize to UTC
  const day = date.getUTCDay(); // 0 is Sunday, 1 is Monday...
  const diffToMonday = (day + 6) % 7;

  const startDate = new Date(date);
  startDate.setUTCDate(date.getUTCDate() - diffToMonday);
  startDate.setUTCHours(0, 0, 0, 0);

  const endDate = new Date(startDate);
  endDate.setUTCDate(startDate.getUTCDate() + 6);
  endDate.setUTCHours(23, 59, 59, 999);

  // Calculate ISO week number
  const target = new Date(date.valueOf());
  const dayNr = (date.getUTCDay() + 6) % 7;
  target.setUTCDate(target.getUTCDate() - dayNr + 3);
  const firstThursday = target.valueOf();
  target.setUTCMonth(0, 1);
  if (target.getUTCDay() !== 4) {
    target.setUTCMonth(0, 1 + ((4 - target.getUTCDay() + 7) % 7));
  }
  const weekNumber =
    1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
  const year = date.getUTCFullYear();

  const now = new Date();
  const remainingSeconds = Math.max(
    0,
    Math.floor((endDate.getTime() - now.getTime()) / 1000),
  );

  return {
    weekNumber,
    year,
    startDate,
    endDate,
    remainingSeconds,
  };
}

@Injectable()
export class LeaguesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Returns next tier up
   */
  getNextTier(current: LeagueTier): LeagueTier {
    const idx = TIER_ORDER.indexOf(current);
    if (idx >= 0 && idx < TIER_ORDER.length - 1) {
      return TIER_ORDER[idx + 1];
    }
    return current;
  }

  /**
   * Returns previous tier down
   */
  getPrevTier(current: LeagueTier): LeagueTier {
    const idx = TIER_ORDER.indexOf(current);
    if (idx > 0) {
      return TIER_ORDER[idx - 1];
    }
    return current;
  }

  /**
   * Finds or creates an active cohort with capacity (< 30) for the given tier & week
   */
  async getOrCreateActiveCohort(tier: LeagueTier, weekInfo: WeekTimeInfo) {
    // 1. Try finding an existing active cohort that is not full
    const activeLeagues = await this.prisma.weeklyLeague.findMany({
      where: {
        tier,
        weekNumber: weekInfo.weekNumber,
        year: weekInfo.year,
        status: 'ACTIVE',
      },
      include: {
        _count: {
          select: { members: true },
        },
      },
      orderBy: { cohortIndex: 'asc' },
    });

    for (const league of activeLeagues) {
      if (league._count.members < COHORT_CAPACITY) {
        return league;
      }
    }

    // 2. All existing cohorts full or none exists -> create next cohortIndex
    const nextIndex = activeLeagues.length + 1;

    try {
      return await this.prisma.weeklyLeague.create({
        data: {
          tier,
          cohortIndex: nextIndex,
          weekNumber: weekInfo.weekNumber,
          year: weekInfo.year,
          startDate: weekInfo.startDate,
          endDate: weekInfo.endDate,
          status: 'ACTIVE',
        },
      });
    } catch {
      // In case of race condition, re-fetch
      return await this.prisma.weeklyLeague.findFirst({
        where: {
          tier,
          weekNumber: weekInfo.weekNumber,
          year: weekInfo.year,
          status: 'ACTIVE',
        },
        orderBy: { cohortIndex: 'desc' },
      });
    }
  }

  /**
   * Synchronizes newly earned XP into the user's active weekly league cohort
   */
  async recordUserXp(userId: string, xpAmount: number) {
    if (xpAmount <= 0) return null;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, currentLeagueTier: true },
    });

    if (!user) return null;

    const weekInfo = getWeekTimeInfo();

    // Check if user already belongs to an active league member record this week
    let member = await this.prisma.leagueMember.findFirst({
      where: {
        userId,
        league: {
          weekNumber: weekInfo.weekNumber,
          year: weekInfo.year,
          status: 'ACTIVE',
        },
      },
    });

    if (member) {
      // Increment weekly XP
      return await this.prisma.leagueMember.update({
        where: { id: member.id },
        data: { weeklyXp: { increment: xpAmount } },
      });
    }

    // Otherwise, assign to a cohort
    const cohort = await this.getOrCreateActiveCohort(
      user.currentLeagueTier,
      weekInfo,
    );
    if (!cohort) return null;

    return await this.prisma.leagueMember.create({
      data: {
        leagueId: cohort.id,
        userId,
        weeklyXp: xpAmount,
      },
    });
  }

  /**
   * Retrieves the user's current league cohort standings, zone thresholds, and countdown
   */
  async getUserCurrentLeague(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const weekInfo = getWeekTimeInfo();

    // Check for active membership
    const member = await this.prisma.leagueMember.findFirst({
      where: {
        userId,
        league: {
          weekNumber: weekInfo.weekNumber,
          year: weekInfo.year,
          status: 'ACTIVE',
        },
      },
      include: {
        league: {
          include: {
            members: {
              include: {
                user: {
                  include: { profile: true },
                },
              },
              orderBy: { weeklyXp: 'desc' },
            },
          },
        },
      },
    });

    const tier = user.currentLeagueTier;

    if (!member) {
      // User has not earned XP yet this week
      return {
        hasJoinedThisWeek: false,
        tier,
        weekInfo,
        message: 'Complete any lesson, quiz, or lab to join this week’s League!',
        standings: [],
        userRank: null,
        weeklyXp: 0,
      };
    }

    const league = member.league;
    const membersList = league.members;
    const totalMembers = membersList.length;

    // Promotion zone: top 20% (min 1, max 7)
    const promoCount = Math.min(7, Math.max(1, Math.ceil(totalMembers * 0.2)));
    // Demotion zone: bottom 20% (min 1, max 5) if tier is not Bronze
    const demoCount =
      tier === LeagueTier.BRONZE
        ? 0
        : Math.min(5, Math.max(1, Math.ceil(totalMembers * 0.2)));
    const demotionCutoffRank = totalMembers - demoCount + 1;

    let userRank = 1;

    const standings = membersList.map((m, index) => {
      const rank = index + 1;
      if (m.userId === userId) {
        userRank = rank;
      }

      let zone: 'PROMOTION' | 'SAFE' | 'DEMOTION' = 'SAFE';
      if (rank <= promoCount) {
        zone = 'PROMOTION';
      } else if (demoCount > 0 && rank >= demotionCutoffRank) {
        zone = 'DEMOTION';
      }

      const displayName =
        m.user.name ||
        m.user.profile?.fullName ||
        m.user.username ||
        m.user.email?.split('@')[0] ||
        'Student Builder';

      return {
        rank,
        memberId: m.id,
        userId: m.userId,
        name: displayName,
        username: m.user.username || displayName.toLowerCase().replace(/\s+/g, ''),
        avatarUrl: m.user.image || m.user.profile?.avatarUrl,
        weeklyXp: m.weeklyXp,
        isCurrentUser: m.userId === userId,
        zone,
      };
    });

    return {
      hasJoinedThisWeek: true,
      tier: league.tier,
      cohortIndex: league.cohortIndex,
      leagueId: league.id,
      weekInfo,
      userRank,
      weeklyXp: member.weeklyXp,
      promotionThresholdRank: promoCount,
      demotionThresholdRank: demoCount > 0 ? demotionCutoffRank : null,
      totalMembers,
      standings,
    };
  }

  /**
   * Finalizes expired weekly leagues, calculates promotions/demotions, and updates users
   */
  async rolloverWeeklyLeagues() {
    const now = new Date();
    const expiredLeagues = await this.prisma.weeklyLeague.findMany({
      where: {
        status: 'ACTIVE',
        endDate: { lt: now },
      },
      include: {
        members: {
          orderBy: { weeklyXp: 'desc' },
        },
      },
    });

    const summary = {
      leaguesFinalized: 0,
      totalPromotions: 0,
      totalDemotions: 0,
    };

    for (const league of expiredLeagues) {
      const members = league.members;
      const total = members.length;
      if (total === 0) {
        await this.prisma.weeklyLeague.update({
          where: { id: league.id },
          data: { status: 'FINALIZED' },
        });
        summary.leaguesFinalized++;
        continue;
      }

      const promoCount = Math.min(7, Math.max(1, Math.ceil(total * 0.2)));
      const demoCount =
        league.tier === LeagueTier.BRONZE
          ? 0
          : Math.min(5, Math.max(1, Math.ceil(total * 0.2)));
      const demotionCutoff = total - demoCount + 1;

      for (let i = 0; i < members.length; i++) {
        const m = members[i];
        const rank = i + 1;
        let isPromoted = false;
        let isDemoted = false;

        if (rank <= promoCount && m.weeklyXp > 0) {
          isPromoted = true;
          const nextTier = this.getNextTier(league.tier);
          await this.prisma.user.update({
            where: { id: m.userId },
            data: { currentLeagueTier: nextTier },
          });
          summary.totalPromotions++;
        } else if (demoCount > 0 && rank >= demotionCutoff) {
          isDemoted = true;
          const prevTier = this.getPrevTier(league.tier);
          await this.prisma.user.update({
            where: { id: m.userId },
            data: { currentLeagueTier: prevTier },
          });
          summary.totalDemotions++;
        }

        await this.prisma.leagueMember.update({
          where: { id: m.id },
          data: {
            finalRank: rank,
            promoted: isPromoted,
            demoted: isDemoted,
          },
        });
      }

      await this.prisma.weeklyLeague.update({
        where: { id: league.id },
        data: { status: 'FINALIZED' },
      });
      summary.leaguesFinalized++;
    }

    return summary;
  }
}

