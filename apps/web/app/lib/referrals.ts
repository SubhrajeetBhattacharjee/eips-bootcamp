// Referrals lib — types, API helpers, mock fallbacks

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

const BASE_URL = "http://localhost:4000";

async function fetchApi<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${BASE_URL}${path}`, { cache: "no-store" });
    if (!res.ok) return null;
    return res.json() as Promise<T>;
  } catch {
    return null;
  }
}

export async function resolveDbUser(clerkId: string): Promise<{ id: string } | null> {
  return fetchApi<{ id: string }>(`/users/clerk/${clerkId}`);
}

export async function fetchReferralStats(userId: string): Promise<ReferralStats | null> {
  return fetchApi<ReferralStats>(`/referrals/${userId}`);
}

export async function fetchLeaderboard(): Promise<LeaderboardEntry[] | null> {
  return fetchApi<LeaderboardEntry[]>("/referrals/leaderboard/all");
}

export async function generateReferralCode(userId: string): Promise<{ code: string } | null> {
  try {
    const res = await fetch(`${BASE_URL}/referrals/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export const MOCK_REFERRAL_STATS: ReferralStats = {
  referralCode: "EIPS2024SJ",
  referralLink: "https://eipsinsight.xyz/ref/EIPS2024SJ",
  totalClicks: 128,
  totalReferrals: 42,
  pendingJoins: 7,
  successfulSignups: 35,
  xpEarned: 2450,
  leaderboardRank: 8,
  leaderboardPercentile: "Top 12%",
  monthlyGrowth: {
    totalReferrals: 18,
    pendingJoins: 12,
    successfulSignups: 16,
    xpEarned: 22,
  },
  peopleInspired: 42,
  communitiesReached: 8,
};

export const MOCK_ACTIVITY: ReferralActivity[] = [
  {
    id: "1",
    name: "Aarav Mehta",
    action: "joined",
    timestamp: "2 hours ago",
    xpEarned: 50,
    status: "Joined",
  },
  {
    id: "2",
    name: "Priya Sharma",
    action: "joined",
    timestamp: "1 day ago",
    xpEarned: 50,
    status: "Joined",
  },
  {
    id: "3",
    name: "Rohit Verma",
    action: "completed_onboarding",
    timestamp: "2 days ago",
    xpEarned: 100,
    status: "Completed",
  },
  {
    id: "4",
    name: "Sneha Reddy",
    action: "joined",
    timestamp: "3 days ago",
    xpEarned: 50,
    status: "Joined",
  },
  {
    id: "5",
    name: "Divyansh",
    action: "completed_onboarding",
    timestamp: "5 days ago",
    xpEarned: 100,
    status: "Completed",
  },
];

export const XP_REWARDS = [
  { label: "Friend joins using your code", xp: 50 },
  { label: "Friend completes onboarding", xp: 100 },
  { label: "Friend completes a module", xp: 150 },
  { label: "Friend submits an assignment", xp: 200 },
  { label: "Friend attends a live session", xp: 100 },
];