// apps/web/app/lib/leaderboard.ts

export type CAPStatusValue =
  | "APPROVED"
  | "Approved"
  | "APPLIED"
  | "Applied"
  | "PENDING"
  | "Pending"
  | "None"
  | string;

export type FilterPeriod = "all" | "month" | "week";

export interface LeaderboardUser {
  rank: number;
  userId: string;
  name: string;
  handle: string;
  avatarUrl?: string;
  xp: number;
  referrals: number;
  capStatus: CAPStatusValue;
  streak: number;
  modulesCompleted?: number;
  isCurrentUser?: boolean;
}

export interface FeaturedContributor {
  userId: string;
  name: string;
  handle: string;
  avatarUrl?: string;
  badges: string[];
  description: string;
  xp: number;
  streak: number;
  rank: number;
  weeklyGrowth: number;
  sparkline: number[];
}

export interface ImpactStats {
  activeLearners: number;
  activeLearnersDelta: number;
  campusAmbassadors: number;
  campusAmbassadorsDelta: number;
  communities: number;
  communitiesDelta: number;
}

export interface LeaderboardApiResponse {
  leaderboard: LeaderboardUser[];
  featured: FeaturedContributor | null;
  impact: ImpactStats;
  currentUser: LeaderboardUser | null;
}

export const XP_WAYS = [
  { label: "Refer a campus peer", xp: 500, icon: "👥" },
  { label: "Complete a protocol module", xp: 500, icon: "📖" },
  { label: "Complete an interactive lesson", xp: 50, icon: "⚡" },
  { label: "Submit an assignment", xp: 150, icon: "📝" },
  { label: "Attend a live campus workshop", xp: 100, icon: "🎥" },
] as const;

export async function fetchLeaderboardData(
  period: FilterPeriod = "all"
): Promise<LeaderboardApiResponse> {
  try {
    const res = await fetch(`/api/leaderboard?filter=${period}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Failed to load leaderboard: ${res.status}`);
    }

    const data: LeaderboardApiResponse = await res.json();
    return data;
  } catch (err) {
    console.error("Leaderboard fetch error:", err);
    return {
      leaderboard: [],
      featured: null,
      impact: {
        activeLearners: 0,
        activeLearnersDelta: 0,
        campusAmbassadors: 0,
        campusAmbassadorsDelta: 0,
        communities: 0,
        communitiesDelta: 0,
      },
      currentUser: null,
    };
  }
}
