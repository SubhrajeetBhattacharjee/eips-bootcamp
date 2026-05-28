// apps/web/app/lib/leaderboard.ts

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:4000";

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

// ─── Mock fallbacks ───────────────────────────────────────────────────────────

const MOCK_LEADERBOARD: LeaderboardUser[] = [
  { rank: 1, userId: "u1", name: "Arjun.eth", handle: "@arjun_eth", xp: 12450, referrals: 42, capStatus: "Approved", streak: 18 },
  { rank: 2, userId: "u2", name: "Priya Sharma", handle: "@priya_web3", xp: 9850, referrals: 38, capStatus: "Approved", streak: 15 },
  { rank: 3, userId: "u3", name: "0xKartik", handle: "@kartik_builds", xp: 8230, referrals: 32, capStatus: "Approved", streak: 14 },
  { rank: 4, userId: "u4", name: "Harsh Patel", handle: "@harsh_eth", xp: 7420, referrals: 28, capStatus: "Approved", streak: 13 },
  { rank: 5, userId: "u5", name: "Sneha Reddy", handle: "@sneha_web3", xp: 6890, referrals: 21, capStatus: "Approved", streak: 11 },
  { rank: 6, userId: "u6", name: "Divyansh", handle: "@divy_eth", xp: 6120, referrals: 17, capStatus: "Applied", streak: 9 },
  { rank: 7, userId: "u7", name: "Ananya Singh", handle: "@ananya_codes", xp: 5780, referrals: 15, capStatus: "Approved", streak: 9 },
  { rank: 8, userId: "u8", name: "Subhrajeet", handle: "@subhrajeet", xp: 2450, referrals: 10, capStatus: "Applied", streak: 7 },
];

const MOCK_FEATURED: FeaturedContributor = {
  userId: "u1",
  name: "Arjun.eth",
  handle: "@arjun_eth",
  badges: ["CAP Ambassador", "Researcher", "Educator", "Community Builder"],
  description: "Leading the way in Ethereum education and ecosystem growth.",
  xp: 12450,
  streak: 18,
  rank: 1,
  weeklyGrowth: 24,
  sparkline: [0.3, 0.4, 0.35, 0.5, 0.45, 0.6, 0.55, 0.7, 0.65, 0.8, 0.75, 0.9, 0.85, 1.0],
};

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
    const res = await fetch(`${API_BASE}${path}`, {
      next: { revalidate: 60 },
    });
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
  const raw = await apiFetch<
    Array<{
      rank: number;
      userId: string;
      name: string;
      handle: string;
      avatarUrl?: string;
      xp: number;
      referrals: number;
      capStatus: CAPStatusValue;
      streak: number;
    }>
  >("/referrals/leaderboard/all", MOCK_LEADERBOARD);

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
  return apiFetch<ImpactStats>("/cap/analytics/admin", MOCK_IMPACT);
}

export function getFeaturedContributor(
  leaderboard: LeaderboardUser[]
): FeaturedContributor {
  const top = leaderboard[0];
  if (!top) return MOCK_FEATURED;
  return {
    ...MOCK_FEATURED,
    userId: top.userId,
    name: top.name,
    handle: top.handle,
    avatarUrl: top.avatarUrl,
    xp: top.xp,
    streak: top.streak,
    rank: top.rank,
  };
}

export const XP_WAYS = [
  { label: "Refer a friend", xp: 500, icon: "👥" },
  { label: "Complete a module", xp: 100, icon: "📖" },
  { label: "Submit an assignment", xp: 150, icon: "📝" },
  { label: "Attend a live session", xp: 100, icon: "🎥" },
  { label: "Community contribution", xp: 200, icon: "🌐" },
] as const;