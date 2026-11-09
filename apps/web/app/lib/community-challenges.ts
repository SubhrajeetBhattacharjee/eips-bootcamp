import { apiFetch } from './api';

export type ChallengeCategory =
  | 'LEARNING'
  | 'COMPETITION'
  | 'ASSIGNMENT'
  | 'COMMUNITY';

export type ChallengeStatus =
  | 'UPCOMING'
  | 'ACTIVE'
  | 'COMPLETED'
  | 'EXPIRED';

export interface TopContributor {
  userId: string;
  name: string;
  image?: string | null;
  contributionCount: number;
}

export interface UserParticipation {
  isJoined: boolean;
  contributionCount: number;
  isClaimed: boolean;
  isEligibleToClaim: boolean;
}

export interface CommunityChallengeItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: ChallengeCategory;
  status: ChallengeStatus;
  targetCount: number;
  currentCount: number;
  minContribution: number;
  xpReward: number;
  rewardBadge: string | null;
  bannerImage: string | null;
  startDate: string;
  endDate: string;
  progressPercent: number;
  remainingSeconds: number;
  participantsCount: number;
  userParticipation: UserParticipation;
  topContributors: TopContributor[];
}

export interface CommunityChallengesResponse {
  challenges: CommunityChallengeItem[];
  stats: {
    total: number;
    active: number;
    completed: number;
  };
}

export async function fetchCommunityChallenges(
  userId?: string,
): Promise<CommunityChallengesResponse> {
  try {
    const url = userId
      ? `/community-challenges?userId=${encodeURIComponent(userId)}`
      : `/community-challenges`;
    return await apiFetch<CommunityChallengesResponse>(url);
  } catch (err) {
    console.error('Failed to fetch community challenges:', err);
    return {
      challenges: [],
      stats: { total: 0, active: 0, completed: 0 },
    };
  }
}

export async function joinCommunityChallenge(
  challengeId: string,
  userId: string,
): Promise<any> {
  return await apiFetch<any>(`/community-challenges/join/${challengeId}`, {
    method: 'POST',
    body: JSON.stringify({ userId }),
  });
}

export async function claimCommunityChallengeReward(
  challengeId: string,
  userId: string,
): Promise<any> {
  return await apiFetch<any>(`/community-challenges/claim/${challengeId}`, {
    method: 'POST',
    body: JSON.stringify({ userId }),
  });
}

