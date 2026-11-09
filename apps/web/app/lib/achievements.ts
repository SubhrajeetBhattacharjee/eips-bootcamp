import { apiFetch } from './api';

export type AchievementCategory = 'LEARNING' | 'COMPETITION' | 'LEAGUE' | 'ENGAGEMENT';
export type AchievementRarity = 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';

export interface AchievementItem {
  id: string;
  code: string;
  title: string;
  description: string;
  category: AchievementCategory;
  rarity: AchievementRarity;
  icon: string;
  xpReward: number;
  maxProgress: number;
  progress: number;
  isUnlocked: boolean;
  unlockedAt: string | null;
}

export interface AchievementStats {
  totalUnlocked: number;
  totalAchievements: number;
  completionPercentage: number;
  totalXpFromAchievements: number;
}

export interface UserAchievementsData {
  stats: AchievementStats;
  newlyUnlocked: Array<{
    code: string;
    title: string;
    xpReward: number;
    icon: string;
    rarity: string;
  }>;
  achievements: AchievementItem[];
}

export async function fetchUserAchievements(
  userId: string,
): Promise<UserAchievementsData | null> {
  try {
    return await apiFetch<UserAchievementsData>(`/achievements/user/${userId}`);
  } catch (err) {
    console.error('Failed to fetch user achievements:', err);
    return null;
  }
}

