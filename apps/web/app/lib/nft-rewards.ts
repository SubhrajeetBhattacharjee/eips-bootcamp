import { apiFetch } from './api';

export type NftRewardType =
  | 'ARENA_CHAMPION'
  | 'PODIUM_FINISHER'
  | 'DIVISION_TITAN'
  | 'PROTOCOL_ARCHITECT'
  | 'SEASON_HONOR';

export type NftRewardStatus = 'ELIGIBLE' | 'CLAIMING' | 'MINTED' | 'FAILED';

export interface NftRewardItem {
  id: string;
  userId: string;
  title: string;
  description: string;
  badgeImage: string;
  type: NftRewardType;
  status: NftRewardStatus;
  tier: 'MYTHIC' | 'LEGENDARY' | 'EPIC' | 'RARE' | string;
  contractAddress: string | null;
  tokenId: string | null;
  txHash: string | null;
  walletAddress: string | null;
  claimedAt: string | null;
  createdAt: string;
  metadata?: any;
  competition?: {
    id: string;
    title: string;
    slug: string;
    totalPoints: number;
  } | null;
}

export interface NftRewardsResponse {
  rewards: NftRewardItem[];
  stats: {
    total: number;
    eligible: number;
    minted: number;
    mythic: number;
    legendary: number;
    epic: number;
  };
}

export async function fetchUserNftRewards(
  userId: string,
): Promise<NftRewardsResponse> {
  try {
    return await apiFetch<NftRewardsResponse>(`/nft-rewards/user/${userId}`);
  } catch (err) {
    console.error('Failed to fetch user NFT rewards:', err);
    return {
      rewards: [],
      stats: {
        total: 0,
        eligible: 0,
        minted: 0,
        mythic: 0,
        legendary: 0,
        epic: 0,
      },
    };
  }
}

export async function claimNftReward(
  rewardId: string,
  userId: string,
  walletAddress: string,
): Promise<NftRewardItem> {
  return await apiFetch<NftRewardItem>(`/nft-rewards/claim/${rewardId}`, {
    method: 'POST',
    body: JSON.stringify({ userId, walletAddress }),
  });
}

export async function fetchNftRewardById(
  rewardId: string,
): Promise<NftRewardItem | null> {
  try {
    return await apiFetch<NftRewardItem>(`/nft-rewards/${rewardId}`);
  } catch (err) {
    console.error('Failed to fetch NFT reward details:', err);
    return null;
  }
}

