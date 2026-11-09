import { apiFetch } from './api';

export interface DailyQuestItem {
  id: string;
  userId: string;
  date: string;
  questKey: string;
  title: string;
  description: string;
  targetCount: number;
  currentCount: number;
  xpReward: number;
  isCompleted: boolean;
  isClaimed: boolean;
  completedAt: string | null;
  claimedAt: string | null;
}

export interface DailyQuestsResponse {
  quests: DailyQuestItem[];
  date: string;
  resetInSeconds: number;
  allCompleted: boolean;
}

export interface StreakMilestone {
  days: number;
  rewardXp: number;
  title: string;
  reached: boolean;
}

export interface StreakDayItem {
  day: string;
  fullDay: string;
  active: boolean;
  xp: number;
  date: string;
}

export interface UserStreakResponse {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
  isActiveToday: boolean;
  streakFreezesAvailable: number;
  streakFreezeUsedToday: boolean;
  streakDays: StreakDayItem[];
  milestones: StreakMilestone[];
}

export async function fetchDailyQuests(
  userId: string,
): Promise<DailyQuestsResponse> {
  try {
    return await apiFetch<DailyQuestsResponse>(`/quests/daily/${userId}`);
  } catch (err) {
    console.error('Failed to fetch daily quests:', err);
    return {
      quests: [],
      date: new Date().toISOString().slice(0, 10),
      resetInSeconds: 86400,
      allCompleted: false,
    };
  }
}

export async function claimQuestReward(
  questId: string,
  userId: string,
): Promise<DailyQuestItem> {
  return await apiFetch<DailyQuestItem>(`/quests/claim/${questId}`, {
    method: 'POST',
    body: JSON.stringify({ userId }),
  });
}

export async function fetchUserStreak(
  userId: string,
): Promise<UserStreakResponse> {
  try {
    return await apiFetch<UserStreakResponse>(`/quests/streak/${userId}`);
  } catch (err) {
    console.error('Failed to fetch user streak:', err);
    return {
      currentStreak: 1,
      longestStreak: 1,
      lastActiveDate: new Date().toISOString().slice(0, 10),
      isActiveToday: true,
      streakFreezesAvailable: 1,
      streakFreezeUsedToday: false,
      streakDays: [],
      milestones: [],
    };
  }
}

