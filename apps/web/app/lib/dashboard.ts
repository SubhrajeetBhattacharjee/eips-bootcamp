import { apiFetch } from './api';

export type User = {
  id: string;
  email: string;
  clerkId: string;
  username: string;
  name?: string;
  role: string;
  profile?: {
    fullName: string;
  } | null;
  capApplication?: {
    status: string;
  } | null;
  referralCode?: {
    code: string;
    referrals: any[];
  } | null;
  xpTransactions?: { amount: number; reason: string; createdAt: string }[];
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
  avatarUrl?: string;
  xp: number;
  referrals: number;
  capStatus: string;
  streak: number;
};

export type DashboardData = {
  user: User;
  xp: number;
  referralsCount: number;
  referralCode: string;
  capStatus: string;
  rank: number | null;
  leaderboard: LeaderboardEntry[];
  recentActivity: ActivityItem[];
};

function createFallbackDashboardData(clerkId: string): DashboardData {
  return {
    user: {
      id: clerkId,
      email: '',
      clerkId,
      username: 'Explorer',
      role: 'Student',
    },
    xp: 0,
    referralsCount: 0,
    referralCode: clerkId.slice(-6).toUpperCase(),
    capStatus: 'NOT APPLIED',
    rank: null,
    leaderboard: [],
    recentActivity: [],
  };
}

export async function getDashboardData(clerkId: string) {
  try {
    const user = await apiFetch<User>(`/users/clerk/${clerkId}`);

    if (!user?.id) {
      return createFallbackDashboardData(clerkId);
    }

    const leaderboard = await apiFetch<LeaderboardEntry[]>(`/referrals/leaderboard/all`);

    const rank = leaderboard.findIndex(
      (entry) => entry.userId === user.id
    ) + 1;

    const xp = user.xpTransactions?.reduce((acc, curr) => acc + curr.amount, 0) || 0;
    const referralsCount = user.referralCode?.referrals?.length || 0;
    const capStatus = user.capApplication?.status || 'NOT APPLIED';
    
    // Determine display name
    const displayName = user.name || user.profile?.fullName || user.username || user.email.split('@')[0] || 'Explorer';
    user.username = displayName;

    // Generate recent activity
    let recentActivity: ActivityItem[] = [];
    if (user.xpTransactions) {
      recentActivity = user.xpTransactions.map((tx, idx) => ({
        id: `xp-${idx}`,
        title: `Earned ${tx.amount} XP`,
        description: tx.reason,
        time: new Date(tx.createdAt).toLocaleDateString(),
        icon: 'xp',
      }));
    }
    
    if (user.capApplication) {
      recentActivity.push({
        id: 'cap-status',
        title: 'CAP Application',
        description: `Status: ${capStatus}`,
        time: 'Recent',
        icon: 'cap',
      });
    }
    
    // Sort and slice top 4 activities
    recentActivity = recentActivity.slice(0, 4);

    return {
      user,
      xp,
      referralsCount,
      referralCode: user.referralCode?.code || user.id.slice(-6).toUpperCase(),
      capStatus,
      rank: rank || null,
      leaderboard,
      recentActivity,
    };
  } catch {
    return createFallbackDashboardData(clerkId);
  }
}