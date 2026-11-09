import { apiFetch } from './api';

export type LeagueTier = 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' | 'DIAMOND' | 'MASTER';

export interface LeagueStandingUser {
  rank: number;
  memberId: string;
  userId: string;
  name: string;
  username: string;
  avatarUrl?: string;
  weeklyXp: number;
  isCurrentUser: boolean;
  zone: 'PROMOTION' | 'SAFE' | 'DEMOTION';
}

export interface WeekTimeInfo {
  weekNumber: number;
  year: number;
  startDate: string;
  endDate: string;
  remainingSeconds: number;
}

export interface UserLeagueData {
  hasJoinedThisWeek: boolean;
  tier: LeagueTier;
  cohortIndex?: number;
  leagueId?: string;
  weekInfo: WeekTimeInfo;
  userRank?: number | null;
  weeklyXp: number;
  promotionThresholdRank?: number;
  demotionThresholdRank?: number | null;
  totalMembers?: number;
  message?: string;
  standings: LeagueStandingUser[];
}

export const TIER_CONFIG: Record<
  LeagueTier,
  {
    name: string;
    icon: string;
    badgeColor: string;
    textColor: string;
    borderColor: string;
    description: string;
    minXpToStay: number;
  }
> = {
  BRONZE: {
    name: 'Bronze Division',
    icon: '🥉',
    badgeColor: 'bg-amber-700/15 dark:bg-amber-700/25',
    textColor: 'text-amber-800 dark:text-amber-300',
    borderColor: 'border-amber-700/30',
    description: 'Starting league for all campus developers.',
    minXpToStay: 0,
  },
  SILVER: {
    name: 'Silver Division',
    icon: '🥈',
    badgeColor: 'bg-slate-400/15 dark:bg-slate-400/25',
    textColor: 'text-slate-700 dark:text-slate-300',
    borderColor: 'border-slate-400/30',
    description: 'For dedicated learners building their smart contract fundamentals.',
    minXpToStay: 100,
  },
  GOLD: {
    name: 'Gold Division',
    icon: '🥇',
    badgeColor: 'bg-amber-400/15 dark:bg-amber-400/25',
    textColor: 'text-amber-600 dark:text-amber-300',
    borderColor: 'border-amber-400/30',
    description: 'Top student developers shipping protocol features weekly.',
    minXpToStay: 250,
  },
  PLATINUM: {
    name: 'Platinum Division',
    icon: '💎',
    badgeColor: 'bg-cyan-500/15 dark:bg-cyan-500/25',
    textColor: 'text-cyan-600 dark:text-cyan-300',
    borderColor: 'border-cyan-500/30',
    description: 'High-momentum builders diving deep into EVM execution and blobs.',
    minXpToStay: 500,
  },
  DIAMOND: {
    name: 'Diamond Division',
    icon: '💠',
    badgeColor: 'bg-blue-500/15 dark:bg-blue-500/25',
    textColor: 'text-blue-600 dark:text-blue-300',
    borderColor: 'border-blue-500/30',
    description: 'Elite protocol contributors preparing for fellowship credentials.',
    minXpToStay: 800,
  },
  MASTER: {
    name: 'Master Division',
    icon: '👑',
    badgeColor: 'bg-purple-500/15 dark:bg-purple-500/25',
    textColor: 'text-purple-600 dark:text-purple-300',
    borderColor: 'border-purple-500/30',
    description: 'The pinnacle of ETHShala. Top architects across all campuses.',
    minXpToStay: 1200,
  },
};

export const ORDERED_TIERS: LeagueTier[] = [
  'BRONZE',
  'SILVER',
  'GOLD',
  'PLATINUM',
  'DIAMOND',
  'MASTER',
];

export async function fetchUserLeague(userId: string): Promise<UserLeagueData | null> {
  try {
    return await apiFetch<UserLeagueData>(`/leagues/current/${userId}`);
  } catch (err) {
    console.error('Failed to fetch user league:', err);
    return null;
  }
}

