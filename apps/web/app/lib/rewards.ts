// apps/web/app/lib/rewards.ts

export interface Reward {
  id: string;
  title: string;
  description: string;
  cost: number;
  category: 'certificates' | 'community' | 'experiences' | 'merchandise' | 'nfts';
  badge: string;
  image: string;
  available: boolean;
}

export interface UserReward {
  rewardId: string;
  title: string;
  xpSpent: number;
  redeemedAt: Date;
}

export interface UserXPData {
  currentXP: number;
  totalXPEarned: number;
  rewardsRedeemed: number;
  totalValueUnlocked: number;
  nextRewardUnlock: number;
  progressPercentage: number;
}

export interface XPActivity {
  activity: string;
  xpValue: number;
}

export const REWARDS_DATA: Reward[] = [
  {
    id: 'hoodie',
    title: 'EIPsInsight Hoodie',
    description: 'Premium hoodie for true Ethereum builders.',
    cost: 1200,
    category: 'merchandise',
    badge: 'MERCH',
    image: '🎽',
    available: true,
  },
  {
    id: 'genesis-nft',
    title: 'Genesis Role NFT',
    description: 'Exclusive NFT for early EIPsInsight contributors.',
    cost: 2000,
    category: 'nfts',
    badge: 'NFT',
    image: '◆',
    available: true,
  },
  {
    id: 'pro-pass',
    title: 'EIPsInsight Pro Pass',
    description: 'Unlock premium courses and exclusive content.',
    cost: 1500,
    category: 'experiences',
    badge: 'ACCESS',
    image: '🔑',
    available: true,
  },
  {
    id: 'cap',
    title: 'EIPsInsight Cap',
    description: 'Limited edition cap representing your journey.',
    cost: 800,
    category: 'merchandise',
    badge: 'MERCH',
    image: '🧢',
    available: true,
  },
  {
    id: 'live-session',
    title: 'Live Workshop Access',
    description: 'Join exclusive live sessions with Ethereum experts.',
    cost: 1000,
    category: 'experiences',
    badge: 'EXPERIENCE',
    image: '🎤',
    available: true,
  },
  {
    id: 'og-nft',
    title: 'OG Contributor NFT',
    description: 'Special NFT for top contributors.',
    cost: 3000,
    category: 'nfts',
    badge: 'NFT',
    image: '◆',
    available: true,
  },
  {
    id: 'discord-role',
    title: 'Private Discord Role',
    description: 'Get exclusive Discord role in our community.',
    cost: 600,
    category: 'community',
    badge: 'ACCESS',
    image: '💬',
    available: true,
  },
  {
    id: 'mug',
    title: 'EIPsInsight Mug',
    description: 'Sip your coffee in style with our branded mug.',
    cost: 500,
    category: 'merchandise',
    badge: 'MERCH',
    image: '☕',
    available: true,
  },
];

export const MOCK_USER_XP: UserXPData = {
  currentXP: 2450,
  totalXPEarned: 5890,
  rewardsRedeemed: 3,
  totalValueUnlocked: 215,
  nextRewardUnlock: 550,
  progressPercentage: 81,
};

export const XP_ACTIVITIES: XPActivity[] = [
  { activity: 'Refer a friend', xpValue: 500 },
  { activity: 'Complete a module', xpValue: 100 },
  { activity: 'Submit an assignment', xpValue: 150 },
  { activity: 'Attend a live session', xpValue: 100 },
  { activity: 'Community contribution', xpValue: 200 },
];

export const MOCK_REWARDS_HISTORY: UserReward[] = [
  {
    rewardId: 'cap',
    title: 'EIPsInsight Cap',
    xpSpent: 800,
    redeemedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    rewardId: 'live-session',
    title: 'Live Workshop Access',
    xpSpent: 1000,
    redeemedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    rewardId: 'discord-role',
    title: 'Private Discord Role',
    xpSpent: 600,
    redeemedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
  },
];

export const REWARD_CATEGORIES = [
  'All Rewards',
  'Certificates',
  'Community',
  'Experiences',
  'Merchandise',
  'NFTs',
] as const;

export type RewardCategory = typeof REWARD_CATEGORIES[number];