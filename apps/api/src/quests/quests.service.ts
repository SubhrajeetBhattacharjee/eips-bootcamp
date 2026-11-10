import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { XpService } from '../xp/xp.service';

export interface DailyQuestDefinition {
  questKey: string;
  title: string;
  description: string;
  targetCount: number;
  xpReward: number;
}

export const DEFAULT_DAILY_QUESTS: DailyQuestDefinition[] = [
  {
    questKey: 'DAILY_LESSON',
    title: 'Daily Scholar',
    description: 'Complete at least 1 lesson module step today',
    targetCount: 1,
    xpReward: 30,
  },
  {
    questKey: 'XP_GOAL',
    title: 'XP Sprint',
    description: 'Earn 50 XP across ETHShala today',
    targetCount: 50,
    xpReward: 25,
  },
  {
    questKey: 'ARENA_PRACTICE',
    title: 'Protocol Practice',
    description: 'Enter an Arena contest or submit an assignment today',
    targetCount: 1,
    xpReward: 40,
  },
];

export const STREAK_MILESTONES = [
  { days: 3, rewardXp: 50, title: '3-Day Momentum' },
  { days: 7, rewardXp: 150, title: 'Weekly Champion' },
  { days: 14, rewardXp: 300, title: 'Fortnight Titan' },
  { days: 30, rewardXp: 1000, title: 'Monthly Sovereign' },
];

@Injectable()
export class QuestsService {
  private readonly logger = new Logger(QuestsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly xpService: XpService,
  ) {}

  /**
   * Returns current UTC date string YYYY-MM-DD
   */
  getTodayUtcDate(): string {
    return new Date().toISOString().slice(0, 10);
  }

  /**
   * Returns remaining seconds until UTC midnight reset
   */
  getSecondsUntilMidnightUtc(): number {
    const now = new Date();
    const tomorrow = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate() + 1,
        0,
        0,
        0,
      ),
    );
    return Math.max(0, Math.floor((tomorrow.getTime() - now.getTime()) / 1000));
  }

  /**
   * Generates or retrieves today's 3 daily quests and synchronizes current progress
   */
  async getDailyQuests(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const todayStr = this.getTodayUtcDate();
    let existingQuests = await this.prisma.userDailyQuest.findMany({
      where: { userId, date: todayStr },
      orderBy: { createdAt: 'asc' },
    });

    // Create daily quests if none exist for today
    if (existingQuests.length === 0) {
      for (const def of DEFAULT_DAILY_QUESTS) {
        await this.prisma.userDailyQuest.create({
          data: {
            userId,
            date: todayStr,
            questKey: def.questKey,
            title: def.title,
            description: def.description,
            targetCount: def.targetCount,
            currentCount: 0,
            xpReward: def.xpReward,
            isCompleted: false,
            isClaimed: false,
          },
        });
      }

      existingQuests = await this.prisma.userDailyQuest.findMany({
        where: { userId, date: todayStr },
        orderBy: { createdAt: 'asc' },
      });
    }

    // Sync progress for today
    const now = new Date();
    const startOfTodayUtc = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        0,
        0,
        0,
      ),
    );

    // 1. Check lesson completions today
    const lessonCount = await this.prisma.lessonProgress.count({
      where: {
        userId,
        completedAt: { gte: startOfTodayUtc },
      },
    });

    // 2. Check XP earned today (excluding achievement bonus claims to prevent feedback loops)
    const xpTransactionsToday = await this.prisma.xPTransaction.findMany({
      where: {
        userId,
        createdAt: { gte: startOfTodayUtc },
        NOT: {
          referenceId: {
            startsWith: 'DAILY-QUEST-',
          },
        },
      },
    });
    const xpTotalToday = xpTransactionsToday.reduce(
      (sum, tx) => sum + tx.amount,
      0,
    );

    // 3. Check arena or assignment activity today
    const arenaCount = await this.prisma.competitionParticipant.count({
      where: {
        userId,
        startedAt: { gte: startOfTodayUtc },
      },
    });
    const assignmentCount = await this.prisma.assignmentSubmission.count({
      where: {
        userId,
        createdAt: { gte: startOfTodayUtc },
      },
    });
    const practiceActivity = arenaCount + assignmentCount;

    // Update quest progress in database
    for (const quest of existingQuests) {
      let currentVal = quest.currentCount;
      if (quest.questKey === 'DAILY_LESSON') {
        currentVal = Math.min(quest.targetCount, lessonCount);
      } else if (quest.questKey === 'XP_GOAL') {
        currentVal = Math.min(quest.targetCount, xpTotalToday);
      } else if (quest.questKey === 'ARENA_PRACTICE') {
        currentVal = Math.min(quest.targetCount, practiceActivity);
      }

      const isCompleted = currentVal >= quest.targetCount;
      if (
        currentVal !== quest.currentCount ||
        isCompleted !== quest.isCompleted
      ) {
        await this.prisma.userDailyQuest.update({
          where: { id: quest.id },
          data: {
            currentCount: currentVal,
            isCompleted,
            completedAt:
              isCompleted && !quest.completedAt
                ? new Date()
                : quest.completedAt,
          },
        });
      }
    }

    // Fetch freshly updated quests
    const updatedQuests = await this.prisma.userDailyQuest.findMany({
      where: { userId, date: todayStr },
      orderBy: { createdAt: 'asc' },
    });

    const resetInSeconds = this.getSecondsUntilMidnightUtc();
    const allCompleted = updatedQuests.every((q) => q.isCompleted);

    return {
      quests: updatedQuests,
      date: todayStr,
      resetInSeconds,
      allCompleted,
    };
  }

  /**
   * Claim XP reward for a completed daily quest
   */
  async claimQuestReward(userId: string, questId: string) {
    const quest = await this.prisma.userDailyQuest.findUnique({
      where: { id: questId },
    });

    if (!quest) {
      throw new NotFoundException(`Daily Quest with ID ${questId} not found`);
    }

    if (quest.userId !== userId) {
      throw new BadRequestException('You do not own this quest');
    }

    if (!quest.isCompleted) {
      throw new BadRequestException(
        'Quest objective has not been completed yet',
      );
    }

    if (quest.isClaimed) {
      return quest;
    }

    // Award XP with idempotent anti-farming reference ID
    await this.xpService.awardXp({
      userId,
      amount: quest.xpReward,
      reason: `Daily Quest Reward: ${quest.title}`,
      category: 'ACHIEVEMENT',
      referenceId: `DAILY-QUEST-${quest.id}`,
    });

    const updated = await this.prisma.userDailyQuest.update({
      where: { id: questId },
      data: {
        isClaimed: true,
        claimedAt: new Date(),
      },
    });

    this.logger.log(
      `Awarded ${quest.xpReward} XP to user ${userId} for completing quest ${quest.title}`,
    );
    return updated;
  }

  /**
   * Retrieves and updates user streak, checks freezes, awards milestone bonuses
   */
  async getUserStreak(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { xpTransactions: true, streak: true },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const todayStr = this.getTodayUtcDate();
    const now = new Date();
    const startOfTodayUtc = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        0,
        0,
        0,
      ),
    );

    // Calculate yesterday UTC date string
    const yesterday = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate() - 1,
        0,
        0,
        0,
      ),
    );
    const yesterdayStr = yesterday.toISOString().slice(0, 10);

    // Check if user has recorded activity today
    const activityTodayCount = await this.prisma.xPTransaction.count({
      where: {
        userId,
        createdAt: { gte: startOfTodayUtc },
      },
    });
    const hasActivityToday = activityTodayCount > 0;

    let userStreak = user.streak;

    if (!userStreak) {
      userStreak = await this.prisma.userStreak.create({
        data: {
          userId,
          currentStreak: hasActivityToday ? 1 : 0,
          longestStreak: hasActivityToday ? 1 : 0,
          lastActiveDate: hasActivityToday ? todayStr : yesterdayStr,
          streakFreezesAvailable: 1,
          streakFreezeUsedToday: false,
        },
      });
    } else if (hasActivityToday) {
      // Activity recorded today
      if (userStreak.lastActiveDate === yesterdayStr) {
        // Consecutive day! Increment streak
        const newCurrent = userStreak.currentStreak + 1;
        const newLongest = Math.max(userStreak.longestStreak, newCurrent);

        userStreak = await this.prisma.userStreak.update({
          where: { userId },
          data: {
            currentStreak: newCurrent,
            longestStreak: newLongest,
            lastActiveDate: todayStr,
            streakFreezeUsedToday: false,
          },
        });
      } else if (userStreak.lastActiveDate !== todayStr) {
        // Gap detected
        const lastActive = new Date(userStreak.lastActiveDate + 'T00:00:00Z');
        const diffDays = Math.round(
          (startOfTodayUtc.getTime() - lastActive.getTime()) /
            (1000 * 60 * 60 * 24),
        );

        if (diffDays === 2 && userStreak.streakFreezesAvailable > 0) {
          // 1-day missed gap protected by streak freeze!
          const newCurrent = userStreak.currentStreak + 1;
          userStreak = await this.prisma.userStreak.update({
            where: { userId },
            data: {
              currentStreak: newCurrent,
              longestStreak: Math.max(userStreak.longestStreak, newCurrent),
              lastActiveDate: todayStr,
              streakFreezesAvailable: userStreak.streakFreezesAvailable - 1,
              streakFreezeUsedToday: true,
            },
          });
          this.logger.log(
            `Protected streak for user ${userId} using streak freeze!`,
          );
        } else if (diffDays > 1) {
          // Streak broke; restart at 1
          userStreak = await this.prisma.userStreak.update({
            where: { userId },
            data: {
              currentStreak: 1,
              lastActiveDate: todayStr,
              streakFreezeUsedToday: false,
            },
          });
        }
      }
    }

    // Evaluate streak milestone bonuses
    for (const milestone of STREAK_MILESTONES) {
      if (userStreak.currentStreak >= milestone.days) {
        await this.xpService
          .awardXp({
            userId,
            amount: milestone.rewardXp,
            reason: `Streak Milestone reached: ${milestone.title} (${milestone.days} days)`,
            category: 'ACHIEVEMENT',
            referenceId: `STREAK-MILESTONE-${milestone.days}-${userId}`,
          })
          .catch(() => null);
      }
    }

    // Build 7-day builder history ending today
    const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const streakDays: Array<{
      day: string;
      fullDay: string;
      active: boolean;
      xp: number;
      date: string;
    }> = [];

    // Map user transactions by UTC date
    const txByDate = new Map<string, number>();
    for (const tx of user.xpTransactions) {
      const dStr = new Date(tx.createdAt).toISOString().slice(0, 10);
      txByDate.set(dStr, (txByDate.get(dStr) || 0) + tx.amount);
    }

    for (let i = 6; i >= 0; i--) {
      const d = new Date(
        Date.UTC(
          now.getUTCFullYear(),
          now.getUTCMonth(),
          now.getUTCDate() - i,
          0,
          0,
          0,
        ),
      );
      const dStr = d.toISOString().slice(0, 10);
      const xpOnDay = txByDate.get(dStr) || 0;
      const isToday = i === 0;

      streakDays.push({
        day: dayLabels[d.getUTCDay()][0],
        fullDay: dayLabels[d.getUTCDay()],
        active: xpOnDay > 0 || (isToday && hasActivityToday),
        xp: xpOnDay,
        date: d.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          timeZone: 'UTC',
        }),
      });
    }

    const milestones = STREAK_MILESTONES.map((m) => ({
      ...m,
      reached: userStreak.currentStreak >= m.days,
    }));

    return {
      currentStreak: userStreak.currentStreak,
      longestStreak: userStreak.longestStreak,
      lastActiveDate: userStreak.lastActiveDate,
      isActiveToday: hasActivityToday,
      streakFreezesAvailable: userStreak.streakFreezesAvailable,
      streakFreezeUsedToday: userStreak.streakFreezeUsedToday,
      streakDays,
      milestones,
    };
  }

  /**
   * Refills or purchases a streak freeze shield
   */
  async refillStreakFreeze(userId: string) {
    const streak = await this.prisma.userStreak.findUnique({
      where: { userId },
    });

    if (!streak) {
      throw new NotFoundException(`Streak record not found for user ${userId}`);
    }

    const updated = await this.prisma.userStreak.update({
      where: { userId },
      data: {
        streakFreezesAvailable: Math.min(3, streak.streakFreezesAvailable + 1),
      },
    });

    return updated;
  }
}
