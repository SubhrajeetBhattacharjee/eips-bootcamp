import { prisma } from '@/app/lib/prisma';

export interface ReferralStats {
  referralCode: string;
  referralLink: string;
  totalClicks: number;
  totalReferrals: number;
  pendingJoins: number;
  successfulSignups: number;
  xpEarned: number;
  leaderboardRank: number;
  leaderboardPercentile: string;
  monthlyGrowth: {
    totalReferrals: number;
    pendingJoins: number;
    successfulSignups: number;
    xpEarned: number;
  };
  peopleInspired: number;
  communitiesReached: number;
}

export interface ReferralActivity {
  id: string;
  avatarUrl?: string;
  name: string;
  action: "joined" | "completed_onboarding" | "completed_module" | "submitted_assignment" | "attended_session";
  timestamp: string;
  xpEarned: number;
  status: "Joined" | "Completed" | "Pending" | "Submitted";
}

export interface LeaderboardEntry {
  userId: string;
  name: string;
  referrals: number;
  xp: number;
  rank: number;
}

export async function resolveDbUser(clerkId: string): Promise<{ id: string } | null> {
  const user = await prisma.user.findFirst({
    where: { id: clerkId }
  });
  return user ? { id: user.id } : null;
}

export async function fetchReferralStats(userId: string): Promise<ReferralStats | null> {
  const code = await prisma.referralCode.findUnique({
    where: { userId },
    include: { referrals: true }
  });

  if (!code) return null;

  const totalReferrals = code.referrals.length;
  const successfulSignups = code.referrals.filter(r => r.status === 'ONBOARDED').length;
  const pendingJoins = totalReferrals - successfulSignups;
  
  // Calculate XP earned from these referrals (500 per ONBOARDED as defined in admin.ts)
  const xpEarned = successfulSignups * 500;

  return {
    referralCode: code.code,
    referralLink: `https://eips-bootcamp.com/join?ref=${code.code}`,
    totalClicks: code.clicks,
    totalReferrals,
    pendingJoins,
    successfulSignups,
    xpEarned,
    leaderboardRank: 0, // Calculated later
    leaderboardPercentile: "",
    monthlyGrowth: {
      totalReferrals, // Simplify for now
      pendingJoins,
      successfulSignups,
      xpEarned,
    },
    peopleInspired: totalReferrals,
    communitiesReached: 1,
  };
}

export async function fetchLeaderboard(): Promise<LeaderboardEntry[] | null> {
  try {
    const xpGroups = await prisma.xPTransaction.groupBy({
      by: ['userId'],
      _sum: { amount: true },
      orderBy: { _sum: { amount: 'desc' } },
      take: 50
    });
    
    const users = await prisma.user.findMany({
      where: { id: { in: xpGroups.map(g => g.userId) } }
    });
    
    return xpGroups.map((group, i) => {
      const u = users.find(u => u.id === group.userId)!;
      return {
        userId: u.id,
        name: u.name || 'Unknown User',
        referrals: 0, // Requires complex grouping to get exact referral count per user on leaderboard
        xp: group._sum.amount || 0,
        rank: i + 1
      };
    });
  } catch (e) {
    return null;
  }
}

export async function fetchReferralActivity(userId: string): Promise<ReferralActivity[]> {
  const code = await prisma.referralCode.findUnique({
    where: { userId },
    include: {
      referrals: {
        include: { referredUser: true },
        orderBy: { createdAt: 'desc' },
        take: 10
      }
    }
  });

  if (!code) return [];

  return code.referrals.map(r => ({
    id: r.id,
    avatarUrl: r.referredUser.image || undefined,
    name: r.referredUser.name || 'New User',
    action: r.status === 'ONBOARDED' ? 'completed_onboarding' : 'joined',
    timestamp: r.createdAt.toISOString(),
    xpEarned: r.status === 'ONBOARDED' ? 500 : 0,
    status: r.status === 'ONBOARDED' ? 'Completed' : 'Joined'
  }));
}

export async function generateReferralCode(userId: string): Promise<{ code: string } | null> {
  try {
    const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const newCode = await prisma.referralCode.create({
      data: {
        code: randomCode,
        userId: userId,
        clicks: 0
      }
    });
    return { code: newCode.code };
  } catch (e) {
    console.error("Failed to generate code:", e);
    return null;
  }
}

export function createEmptyReferralStats(): ReferralStats {
  return {
    referralCode: "",
    referralLink: "",
    totalClicks: 0,
    totalReferrals: 0,
    pendingJoins: 0,
    successfulSignups: 0,
    xpEarned: 0,
    leaderboardRank: 0,
    leaderboardPercentile: "",
    monthlyGrowth: {
      totalReferrals: 0,
      pendingJoins: 0,
      successfulSignups: 0,
      xpEarned: 0,
    },
    peopleInspired: 0,
    communitiesReached: 0,
  };
}

export const XP_REWARDS = [
  { label: "Friend joins using your code", xp: 50 },
  { label: "Friend completes onboarding", xp: 100 },
  { label: "Friend completes a module", xp: 150 },
  { label: "Friend submits an assignment", xp: 200 },
  { label: "Friend attends a live session", xp: 100 },
];