// apps/web/app/lib/leaderboard.ts

// ─── Types ────────────────────────────────────────────────────────────────────

export type CAPStatusValue = "Approved" | "Applied" | "Pending" | "None";
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
  streak: number; // days
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
  weeklyGrowth: number; // percentage
  sparkline: number[]; // normalised 0-1 values for the mini chart
}

export interface ImpactStats {
  activeLearners: number;
  activeLearnersDelta: number;
  campusAmbassadors: number;
  campusAmbassadorsDelta: number;
  communities: number;
  communitiesDelta: number;
}

export interface DBUser {
  id: string;
  clerkId: string;
  name: string;
  handle: string;
  avatarUrl?: string;
  xp: number;
  streak: number;
  referrals: number;
  capStatus: CAPStatusValue;
  rank: number;
}

const MOCK_IMPACT: ImpactStats = {
  activeLearners: 12450,
  activeLearnersDelta: 18,
  campusAmbassadors: 320,
  campusAmbassadorsDelta: 22,
  communities: 98,
  communitiesDelta: 15,
};

// ─── API helpers ─────────────────────────────────────────────────────────────

async function apiFetch<T>(path: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(`/api/proxy?path=${encodeURIComponent(path)}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()) as T;
  } catch {
    return fallback;
  }
}

// ─── Public fetchers ──────────────────────────────────────────────────────────

export async function fetchLeaderboard(
  _period: FilterPeriod = "all"
): Promise<LeaderboardUser[]> {
  const raw = await apiFetch<LeaderboardUser[]>("/referrals/leaderboard/all", []);

  return raw.map((r, i) => ({
    rank: r.rank ?? i + 1,
    userId: r.userId ?? String(i),
    name: r.name ?? "Unknown",
    handle: r.handle ?? "",
    avatarUrl: r.avatarUrl,
    xp: r.xp ?? 0,
    referrals: r.referrals ?? 0,
    capStatus: r.capStatus ?? "None",
    streak: r.streak ?? 0,
  }));
}

export async function fetchDBUser(clerkId: string): Promise<DBUser | null> {
  return apiFetch<DBUser | null>(`/users/clerk/${clerkId}`, null);
}

export async function fetchCAPStatus(
  userId: string
): Promise<CAPStatusValue> {
  const res = await apiFetch<{ status: CAPStatusValue } | null>(
    `/cap/status/${userId}`,
    null
  );
  return res?.status ?? "None";
}

export async function fetchImpactStats(): Promise<ImpactStats> {
  const data = await apiFetch<any>("/cap/analytics/admin", null);
  if (!data) return MOCK_IMPACT;

  if (data.totalUsers !== undefined) {
    return {
      activeLearners: data.totalUsers,
      activeLearnersDelta: 12,
      campusAmbassadors: data.approvedAmbassadors || 0,
      campusAmbassadorsDelta: 5,
      communities: data.totalReferrals > 0 ? Math.ceil(data.totalReferrals / 10) : 1,
      communitiesDelta: 2,
    };
  }
  return data as ImpactStats;
}

export function getFeaturedContributor(
  leaderboard: LeaderboardUser[]
): FeaturedContributor | null {
  const top = leaderboard[0];
  if (!top) return null;
  return {
    userId: top.userId,
    name: top.name,
    handle: top.handle,
    avatarUrl: top.avatarUrl,
    badges: ["Top Contributor"],
    description: "Leading the way in Ethereum education and ecosystem growth.",
    xp: top.xp,
    streak: top.streak,
    rank: top.rank,
    weeklyGrowth: 24,
    sparkline: [0.3, 0.4, 0.35, 0.5, 0.45, 0.6, 0.55, 0.7, 0.65, 0.8, 0.75, 0.9, 0.85, 1.0],
  };
}

export const XP_WAYS = [
  { label: "Refer a friend", xp: 500, icon: "👥" },
  { label: "Complete a module", xp: 100, icon: "📖" },
  { label: "Submit an assignment", xp: 150, icon: "📝" },
  { label: "Attend a live session", xp: 100, icon: "🎥" },
  { label: "Community contribution", xp: 200, icon: "🌐" },
] as const;
