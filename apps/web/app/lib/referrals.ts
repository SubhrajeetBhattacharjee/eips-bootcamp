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

const BASE_URL = "http://127.0.0.1:4000";

async function fetchApi<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${BASE_URL}${path}`, { 
      cache: "no-store",
      headers: {
        'x-api-key': 'dev-secret-key'
      }
    });
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

export async function fetchReferralActivity(userId: string): Promise<ReferralActivity[]> {
  const data = await fetchApi<ReferralActivity[]>(`/referrals/activity/${userId}`);
  return data || [];
}

export async function generateReferralCode(userId: string): Promise<{ code: string } | null> {
  try {
    const res = await fetch(`${BASE_URL}/referrals/generate`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        'x-api-key': 'dev-secret-key'
      },
      body: JSON.stringify({ userId }),
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
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