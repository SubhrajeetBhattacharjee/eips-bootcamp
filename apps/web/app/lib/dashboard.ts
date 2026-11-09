import { prisma } from './prisma';

export type User = {
  id: string;
  email: string;
  username: string;
  name?: string | null;
  role: string;
  profile?: {
    fullName?: string | null;
  } | null;
  capApplication?: {
    status: string;
  } | null;
  referralCode?: {
    code: string;
    referrals: any[];
  } | null;
  xpTransactions?: { amount: number; reason: string; createdAt: Date | string; category?: string }[];
};

export type ActivityItem = {
  id: string;
  title: string;
  description: string;
  time: string;
  icon: 'xp' | 'cap' | 'referral' | 'profile';
};

export type LeaderboardEntry = {
  rank: number;
  userId: string;
  name: string;
  handle: string;
  avatarUrl?: string | null;
  xp: number;
  referrals: number;
  capStatus: string;
  streak: number;
};

export type StreakDay = {
  day: string;
  fullDay: string;
  active: boolean;
  xp: number;
  date: string;
};

export type ActiveModuleInfo = {
  id: string;
  title: string;
  description: string;
  progressPercent: number;
  completedLessons: number;
  totalLessons: number;
  isSubscribed: boolean;
  nextLesson?: {
    id: string;
    title: string;
    orderIndex: number;
  } | null;
};

export type EventItem = {
  id: string;
  title: string;
  description?: string | null;
  link: string;
  date: string;
  module?: { title: string } | null;
};

export type DashboardData = {
  user: User;
  xp: number;
  referralsCount: number;
  referralCode: string;
  referralXp: number;
  capStatus: string;
  rank: number | null;
  streak: number;
  streakDays: StreakDay[];
  leaderboard: LeaderboardEntry[];
  recentActivity: ActivityItem[];
  leagueTier?: string;
  leagueRank?: number | null;
  activeModule?: ActiveModuleInfo | null;
  upcomingEvents?: EventItem[];
  progressPercent: number;
};

// 30-second in-memory cache for global cohort leaderboard to avoid repeated heavy full-table scans
let cachedGlobalLeaderboard: { entries: LeaderboardEntry[]; timestamp: number } | null = null;
const LEADERBOARD_CACHE_MS = 30 * 1000;

async function getGlobalLeaderboard(): Promise<LeaderboardEntry[]> {
  const now = Date.now();
  if (cachedGlobalLeaderboard && now - cachedGlobalLeaderboard.timestamp < LEADERBOARD_CACHE_MS) {
    return cachedGlobalLeaderboard.entries;
  }

  try {
    const allUsers = await prisma.user.findMany({
      include: {
        profile: true,
        capApplication: true,
        streak: true,
        referralCode: {
          include: { referrals: true },
        },
        xpTransactions: true,
      },
    });

    const mappedLeaderboard: LeaderboardEntry[] = allUsers.map((u) => {
      const uXp = (u.xpTransactions || []).reduce((acc, curr) => acc + curr.amount, 0);
      const isPlaceholder = u.email && u.email.includes('@placeholder');
      const uCleanName =
        (u.name && u.name.toLowerCase() !== 'learner' && u.name.toLowerCase() !== 'explorer' && u.name) ||
        u.profile?.fullName ||
        (u.username && u.username.toLowerCase() !== 'learner' && u.username) ||
        (!isPlaceholder && u.email ? u.email.split('@')[0] : 'Student');

      return {
        rank: 0,
        userId: u.id,
        name: uCleanName,
        handle: `@${(u.username || uCleanName).toLowerCase().replace(/\s+/g, '')}`,
        avatarUrl: u.image || u.profile?.avatarUrl,
        xp: uXp,
        referrals: u.referralCode?.referrals?.length || 0,
        capStatus: u.capApplication?.status || 'NOT APPLIED',
        streak: u.streak?.currentStreak || 0,
      };
    });

    mappedLeaderboard.sort((a, b) => b.xp - a.xp);
    mappedLeaderboard.forEach((item, idx) => {
      item.rank = idx + 1;
    });

    cachedGlobalLeaderboard = {
      entries: mappedLeaderboard,
      timestamp: now,
    };

    return mappedLeaderboard;
  } catch (err) {
    console.error('Error fetching global leaderboard:', err);
    return [];
  }
}

function createFallbackDashboardData(userId: string): DashboardData {
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const streakDays: StreakDay[] = [];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(now.getDate() - i);
    streakDays.push({
      day: dayLabels[d.getDay()][0],
      fullDay: dayLabels[d.getDay()],
      active: false,
      xp: 0,
      date: d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    });
  }

  return {
    user: {
      id: userId,
      email: '',
      username: 'Explorer',
      role: 'Student Builder',
    },
    xp: 0,
    referralsCount: 0,
    referralCode: userId.slice(-6).toUpperCase(),
    referralXp: 0,
    capStatus: 'NOT APPLIED',
    rank: null,
    streak: 0,
    streakDays,
    leaderboard: [],
    recentActivity: [],
    leagueTier: 'BRONZE',
    leagueRank: null,
    activeModule: null,
    upcomingEvents: [],
    progressPercent: 0,
  };
}

export async function getDashboardData(userId: string): Promise<DashboardData> {
  try {
    // Parallelize all primary queries for maximum performance
    const [dbUser, subscriptions, dbEvents, leagueMember, globalLeaderboard] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        include: {
          profile: true,
          capApplication: true,
          referralCode: {
            include: {
              referrals: true,
            },
          },
          xpTransactions: {
            orderBy: { createdAt: 'desc' },
          },
          streak: true,
        },
      }),
      prisma.moduleSubscription
        .findMany({
          where: { userId },
          include: {
            module: {
              include: {
                lessons: {
                  orderBy: { orderIndex: 'asc' },
                  include: {
                    progress: {
                      where: { userId },
                    },
                  },
                },
              },
            },
          },
        })
        .catch(() => []),
      prisma.event
        .findMany({
          where: { date: { gte: new Date() } },
          orderBy: { date: 'asc' },
          take: 3,
          include: {
            module: {
              select: { title: true },
            },
          },
        })
        .catch(() => []),
      prisma.leagueMember
        .findFirst({
          where: {
            userId,
            league: { status: 'ACTIVE' },
          },
          include: {
            league: true,
          },
        })
        .catch(() => null),
      getGlobalLeaderboard(),
    ]);

    if (!dbUser) {
      return createFallbackDashboardData(userId);
    }

    // Auto-provision referral code if missing
    let referralCode = dbUser.referralCode?.code;
    let referrals = dbUser.referralCode?.referrals || [];
    if (!referralCode) {
      const generatedCode = dbUser.id.slice(-6).toUpperCase();
      try {
        const createdCode = await prisma.referralCode.create({
          data: {
            userId: dbUser.id,
            code: generatedCode,
          },
          include: {
            referrals: true,
          },
        });
        referralCode = createdCode.code;
        referrals = createdCode.referrals;
      } catch {
        referralCode = generatedCode;
      }
    }

    const referralsCount = referrals.length;

    // Calculate XP
    const xp = (dbUser.xpTransactions || []).reduce((acc, curr) => acc + curr.amount, 0);

    // Calculate Referral-specific XP
    const referralXp =
      (dbUser.xpTransactions || [])
        .filter(
          (tx) =>
            tx.category === 'REFERRAL' ||
            (tx.reason && tx.reason.toLowerCase().includes('referral')),
        )
        .reduce((sum, tx) => sum + tx.amount, 0) || referralsCount * 500;

    const capStatus = dbUser.capApplication?.status || 'NOT APPLIED';

    // Display Name calculation
    const validName =
      dbUser.name &&
      dbUser.name.toLowerCase() !== 'learner' &&
      dbUser.name.toLowerCase() !== 'explorer'
        ? dbUser.name
        : null;
    const validUsername =
      dbUser.username &&
      dbUser.username.toLowerCase() !== 'learner' &&
      dbUser.username.toLowerCase() !== 'explorer'
        ? dbUser.username
        : null;
    const isPlaceholderEmail = dbUser.email && dbUser.email.includes('@placeholder');
    const emailPrefix = !isPlaceholderEmail && dbUser.email ? dbUser.email.split('@')[0] : null;
    const displayName =
      validName || dbUser.profile?.fullName || validUsername || emailPrefix || 'Explorer';

    const userObj: User = {
      id: dbUser.id,
      email: dbUser.email,
      username: displayName,
      name: dbUser.name,
      role: dbUser.role || 'Student Builder',
      profile: dbUser.profile ? { fullName: dbUser.profile.fullName || '' } : null,
      capApplication: dbUser.capApplication ? { status: dbUser.capApplication.status } : null,
      referralCode: {
        code: referralCode,
        referrals,
      },
      xpTransactions: dbUser.xpTransactions || [],
    };

    // 2. Real-Time Activity Feed
    let recentActivity: ActivityItem[] = [];
    if (dbUser.xpTransactions && dbUser.xpTransactions.length > 0) {
      recentActivity = dbUser.xpTransactions.slice(0, 4).map((tx, idx) => ({
        id: `xp-${idx}`,
        title: `Earned ${tx.amount} XP`,
        description: tx.reason,
        time: new Date(tx.createdAt).toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
        }),
        icon: 'xp',
      }));
    }

    if (dbUser.capApplication) {
      recentActivity.push({
        id: 'cap-status',
        title: 'CAP Application',
        description: `Status: ${capStatus}`,
        time: 'Recent',
        icon: 'cap',
      });
    }
    recentActivity = recentActivity.slice(0, 4);

    // 3. Accurate 7-Day Builder Streak History & Real-Time Sync
    const txByDate = new Map<string, number>();
    for (const tx of dbUser.xpTransactions || []) {
      const d = new Date(tx.createdAt).toDateString();
      txByDate.set(d, (txByDate.get(d) || 0) + tx.amount);
    }

    const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const streakDays: StreakDay[] = [];
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const dateStr = d.toDateString();
      const xpOnDay = txByDate.get(dateStr) || 0;
      streakDays.push({
        day: dayLabels[d.getDay()][0],
        fullDay: dayLabels[d.getDay()],
        active: xpOnDay > 0,
        xp: xpOnDay,
        date: d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      });
    }

    // Accurately compute active streak
    let calculatedStreak = 0;
    const todayStr = now.toDateString();
    const hasActivityToday = (txByDate.get(todayStr) || 0) > 0;

    const checkDate = new Date();
    if (!hasActivityToday) {
      // If no activity yet today, check starting from yesterday
      checkDate.setDate(checkDate.getDate() - 1);
    }

    for (let i = 0; i < 60; i++) {
      const dStr = checkDate.toDateString();
      if ((txByDate.get(dStr) || 0) > 0) {
        calculatedStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    const streak = calculatedStreak;

    // Asynchronously synchronize UserStreak table in Postgres if outdated
    if (!dbUser.streak || dbUser.streak.currentStreak !== streak) {
      prisma.userStreak
        .upsert({
          where: { userId: dbUser.id },
          create: {
            userId: dbUser.id,
            currentStreak: streak,
            longestStreak: Math.max(dbUser.streak?.longestStreak || 0, streak),
            lastActiveDate: hasActivityToday
              ? now.toISOString().slice(0, 10)
              : dbUser.streak?.lastActiveDate || now.toISOString().slice(0, 10),
          },
          update: {
            currentStreak: streak,
            longestStreak: Math.max(dbUser.streak?.longestStreak || 0, streak),
            lastActiveDate: hasActivityToday ? now.toISOString().slice(0, 10) : undefined,
          },
        })
        .catch(() => null);
    }

    // 4. Real Active Module Subscription and Progress
    let activeModule: ActiveModuleInfo | null = null;
    if (subscriptions.length > 0) {
      let targetSub = subscriptions.find((sub) => {
        const completed = sub.module.lessons.filter((l) => l.progress.length > 0).length;
        return completed < sub.module.lessons.length;
      });
      if (!targetSub) {
        targetSub = subscriptions[0];
      }

      const mod = targetSub.module;
      const totalLessons = mod.lessons.length;
      const completedLessons = mod.lessons.filter((l) => l.progress.length > 0).length;
      const progressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
      const nextLesson = mod.lessons.find((l) => l.progress.length === 0) || mod.lessons[0] || null;

      activeModule = {
        id: mod.id,
        title: mod.title,
        description: mod.description,
        progressPercent,
        completedLessons,
        totalLessons,
        isSubscribed: true,
        nextLesson: nextLesson
          ? {
              id: nextLesson.id,
              title: nextLesson.title,
              orderIndex: nextLesson.orderIndex,
            }
          : null,
      };
    } else {
      // Fallback: query first module in catalog
      const firstModule = await prisma.module
        .findFirst({
          orderBy: { orderIndex: 'asc' },
          include: {
            lessons: {
              orderBy: { orderIndex: 'asc' },
            },
          },
        })
        .catch(() => null);

      if (firstModule) {
        const firstLesson = firstModule.lessons[0] || null;
        activeModule = {
          id: firstModule.id,
          title: firstModule.title,
          description: firstModule.description,
          progressPercent: 0,
          completedLessons: 0,
          totalLessons: firstModule.lessons.length,
          isSubscribed: false,
          nextLesson: firstLesson
            ? {
                id: firstLesson.id,
                title: firstLesson.title,
                orderIndex: firstLesson.orderIndex,
              }
            : null,
        };
      }
    }

    // 5. Real Upcoming Events
    const upcomingEvents: EventItem[] = dbEvents.map((evt) => ({
      id: evt.id,
      title: evt.title,
      description: evt.description,
      link: evt.link,
      date: evt.date.toISOString(),
      module: evt.module,
    }));

    // 6. Real Leaderboard & Cohort Rank
    const topTenLeaderboard = globalLeaderboard.slice(0, 10);
    const userEntry = globalLeaderboard.find((entry) => entry.userId === dbUser.id);
    const rank = userEntry ? userEntry.rank : null;

    // 7. Weekly League Data
    let leagueTier = 'BRONZE';
    let leagueRank: number | null = null;
    if (leagueMember) {
      leagueTier = String(leagueMember.league.tier);
      leagueRank = leagueMember.weeklyXp > 0 ? leagueMember.initialRank ?? null : null;
    }

    const overallProgressPercent = activeModule
      ? activeModule.progressPercent
      : Math.min(100, Math.round((xp / 2500) * 100));

    return {
      user: userObj,
      xp,
      referralsCount,
      referralCode,
      referralXp,
      capStatus,
      rank,
      streak,
      streakDays,
      leaderboard: topTenLeaderboard,
      recentActivity,
      leagueTier,
      leagueRank,
      activeModule,
      upcomingEvents,
      progressPercent: overallProgressPercent,
    };
  } catch (err) {
    console.error('getDashboardData error:', err);
    return createFallbackDashboardData(userId);
  }
}
