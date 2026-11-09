import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { XpService } from '../xp/xp.service';
import {
  AchievementCategory,
  AchievementRarity,
  LeagueTier,
  ParticipantStatus,
} from '@prisma/client';

export interface DefaultAchievementSeed {
  code: string;
  title: string;
  description: string;
  category: AchievementCategory;
  rarity: AchievementRarity;
  icon: string;
  xpReward: number;
  maxProgress: number;
}

const DEFAULT_ACHIEVEMENTS: DefaultAchievementSeed[] = [
  // LEARNING
  {
    code: 'FIRST_LESSON',
    title: 'Genesis Block',
    description: 'Complete your first hands-on protocol lesson on ETHShala.',
    category: AchievementCategory.LEARNING,
    rarity: AchievementRarity.COMMON,
    icon: '🌱',
    xpReward: 50,
    maxProgress: 1,
  },
  {
    code: 'LESSONS_5',
    title: 'Protocol Apprentice',
    description: 'Complete 5 protocol lessons across any learning track.',
    category: AchievementCategory.LEARNING,
    rarity: AchievementRarity.COMMON,
    icon: '📜',
    xpReward: 100,
    maxProgress: 5,
  },
  {
    code: 'LESSONS_10',
    title: 'Smart Contract Scribe',
    description: 'Complete 10 protocol lessons diving into execution and state.',
    category: AchievementCategory.LEARNING,
    rarity: AchievementRarity.RARE,
    icon: '⚡',
    xpReward: 200,
    maxProgress: 10,
  },
  {
    code: 'MODULE_COMPLETED',
    title: 'Full Node Graduate',
    description: 'Complete all lessons and exercises in an educational track.',
    category: AchievementCategory.LEARNING,
    rarity: AchievementRarity.RARE,
    icon: '🎓',
    xpReward: 250,
    maxProgress: 1,
  },

  // COMPETITION
  {
    code: 'ARENA_CONTENDER',
    title: 'Arena Contender',
    description: 'Submit verified answers to your first weekly competitive arena.',
    category: AchievementCategory.COMPETITION,
    rarity: AchievementRarity.COMMON,
    icon: '⚔️',
    xpReward: 100,
    maxProgress: 1,
  },
  {
    code: 'ARENA_PODIUM',
    title: 'Podium Ascendant',
    description: 'Finish in the Top 3 podium of any weekly arena competition.',
    category: AchievementCategory.COMPETITION,
    rarity: AchievementRarity.EPIC,
    icon: '🥈',
    xpReward: 300,
    maxProgress: 1,
  },
  {
    code: 'ARENA_CHAMPION',
    title: 'Campus Grandmaster',
    description: 'Finish Rank #1 on the official weekly arena leaderboard.',
    category: AchievementCategory.COMPETITION,
    rarity: AchievementRarity.LEGENDARY,
    icon: '👑',
    xpReward: 500,
    maxProgress: 1,
  },
  {
    code: 'SPEED_DEMON',
    title: 'Bytecode Speedrunner',
    description: 'Complete a weekly arena in under 15 minutes with >75% accuracy.',
    category: AchievementCategory.COMPETITION,
    rarity: AchievementRarity.EPIC,
    icon: '⚡',
    xpReward: 250,
    maxProgress: 1,
  },

  // LEAGUE
  {
    code: 'LEAGUE_SILVER',
    title: 'Silver Vanguard',
    description: 'Earn enough weekly XP to advance to the Silver Division.',
    category: AchievementCategory.LEAGUE,
    rarity: AchievementRarity.COMMON,
    icon: '🥈',
    xpReward: 100,
    maxProgress: 1,
  },
  {
    code: 'LEAGUE_GOLD',
    title: 'Gold Architect',
    description: 'Advance to the elite Gold Division cohort.',
    category: AchievementCategory.LEAGUE,
    rarity: AchievementRarity.RARE,
    icon: '🥇',
    xpReward: 200,
    maxProgress: 1,
  },
  {
    code: 'LEAGUE_MASTER',
    title: 'Master of Ethereum',
    description: 'Reach the pinnacle of ETHShala: The Master Division.',
    category: AchievementCategory.LEAGUE,
    rarity: AchievementRarity.LEGENDARY,
    icon: '👑',
    xpReward: 500,
    maxProgress: 1,
  },
  {
    code: 'PROMOTION_HERO',
    title: 'Sunday Promotion',
    description: 'Finish in your cohort’s promotion zone upon weekly rollover.',
    category: AchievementCategory.LEAGUE,
    rarity: AchievementRarity.RARE,
    icon: '🚀',
    xpReward: 150,
    maxProgress: 1,
  },

  // ENGAGEMENT
  {
    code: 'COMMUNITY_BUILDER',
    title: 'Peer Beacon',
    description: 'Invite your first peer to ETHShala using your referral link.',
    category: AchievementCategory.ENGAGEMENT,
    rarity: AchievementRarity.COMMON,
    icon: '🤝',
    xpReward: 100,
    maxProgress: 1,
  },
  {
    code: 'NETWORK_EXPANDER',
    title: 'Campus Catalyst',
    description: 'Successfully onboard 3 peers to your campus chapter.',
    category: AchievementCategory.ENGAGEMENT,
    rarity: AchievementRarity.RARE,
    icon: '🌐',
    xpReward: 250,
    maxProgress: 3,
  },
  {
    code: 'CAMPUS_AMBASSADOR',
    title: 'Campus Fellow',
    description: 'Appointed as an official ETHShala Campus Ambassador.',
    category: AchievementCategory.ENGAGEMENT,
    rarity: AchievementRarity.EPIC,
    icon: '🏛️',
    xpReward: 400,
    maxProgress: 1,
  },
];

@Injectable()
export class AchievementsService {
  private readonly logger = new Logger(AchievementsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly xpService: XpService,
  ) {}

  /**
   * Seed default achievements if none exist
   */
  async seedDefaultAchievements() {
    const count = await this.prisma.achievement.count();
    if (count > 0) return;

    this.logger.log('Seeding initial curated achievements...');
    for (const ach of DEFAULT_ACHIEVEMENTS) {
      await this.prisma.achievement.upsert({
        where: { code: ach.code },
        create: ach,
        update: ach,
      });
    }
    this.logger.log(`Seeded ${DEFAULT_ACHIEVEMENTS.length} default achievements.`);
  }

  /**
   * Evaluate all achievement criteria for a user against real activity in DB
   */
  async evaluateUserAchievements(userId: string) {
    await this.seedDefaultAchievements();

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        referralCode: {
          include: {
            referrals: true,
          },
        },
      },
    });
    if (!user) throw new NotFoundException('User not found');

    const allAchievements = await this.prisma.achievement.findMany();
    const userAchievements = await this.prisma.userAchievement.findMany({
      where: { userId },
    });

    const userAchMap = new Map(userAchievements.map((ua) => [ua.achievementId, ua]));

    // Query User Progress Metrics
    const lessonCount = await this.prisma.lessonProgress.count({
      where: { userId },
    });

    const completedArenaCount = await this.prisma.competitionParticipant.count({
      where: { userId, status: ParticipantStatus.SUBMITTED },
    });

    const arenaPodiumCount = await this.prisma.competitionParticipant.count({
      where: {
        userId,
        status: ParticipantStatus.SUBMITTED,
        rank: { lte: 3, not: null },
      },
    });

    const arenaChampionCount = await this.prisma.competitionParticipant.count({
      where: {
        userId,
        status: ParticipantStatus.SUBMITTED,
        rank: 1,
      },
    });

    const speedDemonCount = await this.prisma.competitionParticipant.count({
      where: {
        userId,
        status: ParticipantStatus.SUBMITTED,
        timeTakenSeconds: { lte: 900 },
        score: { gt: 0 },
      },
    });

    const leaguePromotionsCount = await this.prisma.leagueMember.count({
      where: { userId, promoted: true },
    });

    const referralsCount = user.referralCode?.referrals?.length || 0;

    const silverAndAbove: LeagueTier[] = [
      LeagueTier.SILVER,
      LeagueTier.GOLD,
      LeagueTier.PLATINUM,
      LeagueTier.DIAMOND,
      LeagueTier.MASTER,
    ];
    const isSilverOrHigher = silverAndAbove.includes(user.currentLeagueTier);

    const goldAndAbove: LeagueTier[] = [
      LeagueTier.GOLD,
      LeagueTier.PLATINUM,
      LeagueTier.DIAMOND,
      LeagueTier.MASTER,
    ];
    const isGoldOrHigher = goldAndAbove.includes(user.currentLeagueTier);

    const isMaster = user.currentLeagueTier === LeagueTier.MASTER;

    const newlyUnlocked: Array<{
      code: string;
      title: string;
      xpReward: number;
      icon: string;
      rarity: string;
    }> = [];

    // Evaluate each achievement
    for (const ach of allAchievements) {
      let currentProgress = 0;

      switch (ach.code) {
        case 'FIRST_LESSON':
          currentProgress = lessonCount >= 1 ? 1 : 0;
          break;
        case 'LESSONS_5':
          currentProgress = Math.min(ach.maxProgress, lessonCount);
          break;
        case 'LESSONS_10':
          currentProgress = Math.min(ach.maxProgress, lessonCount);
          break;
        case 'MODULE_COMPLETED':
          currentProgress = lessonCount >= 5 ? 1 : 0;
          break;

        case 'ARENA_CONTENDER':
          currentProgress = completedArenaCount >= 1 ? 1 : 0;
          break;
        case 'ARENA_PODIUM':
          currentProgress = arenaPodiumCount >= 1 ? 1 : 0;
          break;
        case 'ARENA_CHAMPION':
          currentProgress = arenaChampionCount >= 1 ? 1 : 0;
          break;
        case 'SPEED_DEMON':
          currentProgress = speedDemonCount >= 1 ? 1 : 0;
          break;

        case 'LEAGUE_SILVER':
          currentProgress = isSilverOrHigher ? 1 : 0;
          break;
        case 'LEAGUE_GOLD':
          currentProgress = isGoldOrHigher ? 1 : 0;
          break;
        case 'LEAGUE_MASTER':
          currentProgress = isMaster ? 1 : 0;
          break;
        case 'PROMOTION_HERO':
          currentProgress = leaguePromotionsCount >= 1 ? 1 : 0;
          break;

        case 'COMMUNITY_BUILDER':
          currentProgress = referralsCount >= 1 ? 1 : 0;
          break;
        case 'NETWORK_EXPANDER':
          currentProgress = Math.min(ach.maxProgress, referralsCount);
          break;
        case 'CAMPUS_AMBASSADOR':
          currentProgress = user.role === 'AMBASSADOR' ? 1 : 0;
          break;

        default:
          currentProgress = 0;
          break;
      }

      const isCriteriaMet = currentProgress >= ach.maxProgress;
      const existingUA = userAchMap.get(ach.id);

      if (!existingUA) {
        // Create initial record
        await this.prisma.userAchievement.create({
          data: {
            userId,
            achievementId: ach.id,
            progress: currentProgress,
            isUnlocked: isCriteriaMet,
            unlockedAt: isCriteriaMet ? new Date() : null,
          },
        });

        if (isCriteriaMet) {
          // Award XP via centralized service (handles idempotency & leveling)
          await this.xpService.awardXp({
            userId,
            amount: ach.xpReward,
            reason: `Achievement Unlocked: ${ach.title}`,
            category: 'ACHIEVEMENT',
            referenceId: `ACHIEVEMENT_${ach.code}`,
          });

          newlyUnlocked.push({
            code: ach.code,
            title: ach.title,
            xpReward: ach.xpReward,
            icon: ach.icon,
            rarity: ach.rarity,
          });
        }
      } else if (!existingUA.isUnlocked && isCriteriaMet) {
        // Unlock achievement
        await this.prisma.userAchievement.update({
          where: { id: existingUA.id },
          data: {
            progress: currentProgress,
            isUnlocked: true,
            unlockedAt: new Date(),
          },
        });

        await this.xpService.awardXp({
          userId,
          amount: ach.xpReward,
          reason: `Achievement Unlocked: ${ach.title}`,
          category: 'ACHIEVEMENT',
          referenceId: `ACHIEVEMENT_${ach.code}`,
        });

        newlyUnlocked.push({
          code: ach.code,
          title: ach.title,
          xpReward: ach.xpReward,
          icon: ach.icon,
          rarity: ach.rarity,
        });
      } else if (!existingUA.isUnlocked && currentProgress !== existingUA.progress) {
        // Update partial progress
        await this.prisma.userAchievement.update({
          where: { id: existingUA.id },
          data: { progress: currentProgress },
        });
      }
    }

    return newlyUnlocked;
  }

  /**
   * Get user achievements with stats, rarity grouping, and progress
   */
  async getUserAchievements(userId: string) {
    const newlyUnlocked = await this.evaluateUserAchievements(userId);

    const achievements = await this.prisma.achievement.findMany({
      orderBy: [{ rarity: 'desc' }, { xpReward: 'desc' }],
      include: {
        users: {
          where: { userId },
        },
      },
    });

    let totalUnlocked = 0;
    let totalXpFromAchievements = 0;

    const mapped = achievements.map((ach) => {
      const userRecord = ach.users[0] || null;
      const isUnlocked = userRecord?.isUnlocked || false;
      const progress = userRecord?.progress || 0;

      if (isUnlocked) {
        totalUnlocked++;
        totalXpFromAchievements += ach.xpReward;
      }

      return {
        id: ach.id,
        code: ach.code,
        title: ach.title,
        description: ach.description,
        category: ach.category,
        rarity: ach.rarity,
        icon: ach.icon,
        xpReward: ach.xpReward,
        maxProgress: ach.maxProgress,
        progress,
        isUnlocked,
        unlockedAt: userRecord?.unlockedAt?.toISOString() || null,
      };
    });

    const totalAchievements = mapped.length;
    const completionPercentage =
      totalAchievements > 0
        ? Math.round((totalUnlocked / totalAchievements) * 100)
        : 0;

    return {
      stats: {
        totalUnlocked,
        totalAchievements,
        completionPercentage,
        totalXpFromAchievements,
      },
      newlyUnlocked,
      achievements: mapped,
    };
  }
}
