import { apiFetch } from './api';

export type SeasonStatus = 'UPCOMING' | 'ACTIVE' | 'ARCHIVED';

export interface SeasonalLeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  username: string;
  image?: string | null;
  seasonalXp: number;
  contestsCompleted: number;
  tier: string;
  isCurrentUser?: boolean;
}

export interface SeasonInfo {
  id: string;
  slug: string;
  name: string;
  description: string;
  status: SeasonStatus;
  startDate: string;
  endDate: string;
  xpMultiplier: number;
}

export interface SeasonResponse {
  season: SeasonInfo;
  leaderboard: SeasonalLeaderboardEntry[];
  totalParticipants: number;
  currentUserStanding?: {
    rank: number;
    seasonalXp: number;
    tier: string;
    percentile: number;
  } | null;
  timeRemainingSeconds: number;
}

export interface SeasonListItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  status: SeasonStatus;
  startDate: string;
  endDate: string;
  xpMultiplier: number;
  isActive: boolean;
  isConcluded: boolean;
  podium: Array<{
    rank: number;
    userId: string;
    name: string;
    image?: string | null;
    seasonalXp: number;
    tier: string;
  }>;
}

export async function fetchCurrentSeason(
  userId?: string,
): Promise<SeasonResponse> {
  const url = userId
    ? `/seasons/current?userId=${encodeURIComponent(userId)}`
    : `/seasons/current`;
  return await apiFetch<SeasonResponse>(url);
}

export async function fetchAllSeasons(): Promise<SeasonListItem[]> {
  try {
    return await apiFetch<SeasonListItem[]>('/seasons');
  } catch (err) {
    console.error('Failed to fetch all seasons:', err);
    return [];
  }
}

export async function fetchSeasonBySlug(
  slug: string,
  userId?: string,
): Promise<SeasonResponse> {
  const url = userId
    ? `/seasons/${slug}?userId=${encodeURIComponent(userId)}`
    : `/seasons/${slug}`;
  return await apiFetch<SeasonResponse>(url);
}

export async function claimSeasonReward(
  seasonId: string,
  userId: string,
): Promise<any> {
  return await apiFetch<any>(`/seasons/claim/${seasonId}`, {
    method: 'POST',
    body: JSON.stringify({ userId }),
  });
}

