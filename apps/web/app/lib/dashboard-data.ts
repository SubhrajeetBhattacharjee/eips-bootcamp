// ─────────────────────────────────────────────
// EIPsInsight Dashboard — typed mock data
// Replace fetch calls with real API endpoints
// ─────────────────────────────────────────────

export interface StatCard {
  id: string;
  label: string;
  value: string | number;
  change: string;
  changePositive: boolean;
  sub?: string;
  color: 'emerald' | 'blue' | 'purple' | 'amber';
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  xp: number;
  avatar?: string;
  medal?: 'gold' | 'silver' | 'bronze';
}

export interface ActivityItem {
  id: string;
  icon: 'profile' | 'referral' | 'xp' | 'cap';
  title: string;
  description: string;
  time: string;
}

export interface LearningModule {
  id: string;
  title: string;
  progress: number;
  status: 'in-progress' | 'completed' | 'locked';
  thumbnail?: string;
}

export interface UpcomingEvent {
  id: string;
  title: string;
  platform: string;
  time: string;
  month: string;
  day: string;
}

export const mockStats: StatCard[] = [
  {
    id: 'xp',
    label: 'XP Earned',
    value: '2,450',
    change: '+120 this week',
    changePositive: true,
    color: 'emerald',
  },
  {
    id: 'referrals',
    label: 'Referrals',
    value: 23,
    change: '+5 this week',
    changePositive: true,
    color: 'emerald',
  },
  {
    id: 'cap',
    label: 'CAP Status',
    value: 'Approved',
    change: 'Active Ambassador',
    changePositive: true,
    color: 'emerald',
  },
  {
    id: 'rank',
    label: 'Leaderboard Rank',
    value: '#12',
    change: 'Top 5% of ambassadors',
    changePositive: true,
    color: 'purple',
  },
];

export const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, username: '0xArjun.eth', xp: 3450, medal: 'gold' },
  { rank: 2, username: 'Web3_Warrior', xp: 3120, medal: 'silver' },
  { rank: 3, username: 'DeFi_Dynamo', xp: 2890, medal: 'bronze' },
  { rank: 4, username: 'BlockchainBoy', xp: 2760 },
  { rank: 5, username: 'Satoshi_Slayer', xp: 2540 },
];

export const mockActivity: ActivityItem[] = [
  {
    id: '1',
    icon: 'profile',
    title: 'Profile updated',
    description: 'You updated your college information',
    time: '2h ago',
  },
  {
    id: '2',
    icon: 'referral',
    title: 'New referral joined',
    description: 'Aarav from Delhi University joined',
    time: '5h ago',
  },
  {
    id: '3',
    icon: 'xp',
    title: 'XP earned',
    description: 'You earned 50 XP for referral',
    time: '1d ago',
  },
  {
    id: '4',
    icon: 'cap',
    title: 'CAP application approved',
    description: 'Welcome to the ambassador program!',
    time: '2d ago',
  },
];

export const mockLearningModule: LearningModule = {
  id: 'eth-dev',
  title: 'Ethereum Developer Path',
  progress: 65,
  status: 'in-progress',
};

export const mockEvents: UpcomingEvent[] = [
  {
    id: '1',
    title: 'Smart Contract Workshop',
    platform: 'Live on Zoom',
    time: '7:00 PM IST',
    month: 'MAY',
    day: '30',
  },
  {
    id: '2',
    title: 'Web3 Career Panel',
    platform: 'Live on Discord',
    time: '6:00 PM IST',
    month: 'JUN',
    day: '4',
  },
];

export const mockReferral = {
  code: 'EIPS24-SUBHRA',
  totalReferrals: 23,
  weeklyReferrals: 5,
  xpEarned: 1150,
};

export const mockOverallProgress = 68;
