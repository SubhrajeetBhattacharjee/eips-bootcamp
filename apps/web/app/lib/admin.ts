// apps/web/app/lib/admin.ts
import { currentUser } from '@clerk/nextjs/server';

export interface KPIMetric {
  value: string;
  change: number;
  previousValue?: string;
}

export interface AdminAnalyticsData {
  totalUsers: KPIMetric;
  activeLearnersMonth: KPIMetric;
  modulesCompleted: KPIMetric;
  xpAwarded: KPIMetric;
  rewardsDistributed: KPIMetric;
  pendingCAPApplications: KPIMetric;
}

export interface GrowthChartData {
  date: string;
  users: number;
  activeLearnersCount: number;
  xpAwarded: number;
}

export interface ActivityFeed {
  id: string;
  type: 'user_registered' | 'cap_application' | 'module_completed' | 'reward_redeemed' | 'referral_joined' | 'top_performer';
  title: string;
  description: string;
  timestamp: Date;
  icon?: string;
  color?: string;
}

export interface TopUser {
  rank: number;
  id: string;
  name: string;
  username: string;
  avatar?: string;
  xpEarned: number;
  modulesCompleted: number;
  streak: number;
  joinDate: Date;
}

export interface SystemMetrics {
  serverStatus: 'operational' | 'degraded' | 'offline';
  databaseStatus: 'healthy' | 'warning' | 'critical';
  apiResponseTime: number;
  activeSessions: number;
  courseCompletionRate: number;
  capApprovalRate: number;
}

export interface PlatformHealthData {
  userGrowth: number[];
  retentionRate: number;
  referralConversion: number;
}

export interface CAPAnalyticsData {
  applications: number;
  approved: number;
  rejected: number;
  pending: number;
}

export interface ReferralPerformanceData {
  totalReferrals: number;
  conversionRate: number;
  xpGenerated: number;
}

// Verify admin role
export async function verifyAdminRole() {
  try {
    const user = await currentUser();
    
    if (!user) return false;
    
    // Check for admin role in user metadata or custom claims
    const isAdmin = user.publicMetadata?.role === 'ADMIN' || 
                   user.privateMetadata?.role === 'ADMIN';
    
    return isAdmin;
  } catch (error) {
    console.error('Error verifying admin role:', error);
    return false;
  }
}

// Mock data generators for development
export function generateMockAnalyticsData(): AdminAnalyticsData {
  return {
    totalUsers: { value: '12,845', change: 16.8 },
    activeLearnersMonth: { value: '8,732', change: 22.4 },
    modulesCompleted: { value: '24,591', change: 16.3 },
    xpAwarded: { value: '1.24M', change: 28.7 },
    rewardsDistributed: { value: '345.67', change: 15.2 },
    pendingCAPApplications: { value: '156', change: -8.4 }
  };
}

export function generateMockGrowthData(): GrowthChartData[] {
  const data: GrowthChartData[] = [];
  const start = new Date(2024, 4, 1); // May 1, 2024
  
  for (let i = 0; i <= 30; i++) {
    const date = new Date(start);
    date.setDate(date.getDate() + i);
    
    data.push({
      date: `May ${date.getDate()}`,
      users: Math.floor(9000 + i * 130 + Math.random() * 200),
      activeLearnersCount: Math.floor(6000 + i * 90 + Math.random() * 150),
      xpAwarded: Math.floor(3000 + i * 40 + Math.random() * 100)
    });
  }
  
  return data;
}

export function generateMockActivityFeed(): ActivityFeed[] {
  return [
    {
      id: '1',
      type: 'user_registered',
      title: 'New user registered',
      description: 'priya.sharma@example.com',
      timestamp: new Date(Date.now() - 2 * 60000),
      color: 'emerald'
    },
    {
      id: '2',
      type: 'cap_application',
      title: 'New CAP application submitted',
      description: 'by 0xf4A3...702C',
      timestamp: new Date(Date.now() - 10 * 60000),
      color: 'amber'
    },
    {
      id: '3',
      type: 'module_completed',
      title: 'Module completed',
      description: 'Smart Contract Basics',
      timestamp: new Date(Date.now() - 15 * 60000),
      color: 'blue'
    },
    {
      id: '4',
      type: 'top_performer',
      title: 'New top performer',
      description: 'Ashish Hazir - ranked #1',
      timestamp: new Date(Date.now() - 22 * 60000),
      color: 'emerald'
    },
    {
      id: '5',
      type: 'reward_redeemed',
      title: 'Rewards distributed',
      description: '2.45 to 18 learners',
      timestamp: new Date(Date.now() - 30 * 60000),
      color: 'violet'
    }
  ];
}

export function generateMockTopUsers(): TopUser[] {
  return [
    {
      rank: 1,
      id: '1',
      name: 'Aarav Mehta',
      username: '@aaravmehta',
      xpEarned: 32450,
      modulesCompleted: 24,
      streak: 45,
      joinDate: new Date('2024-02-12')
    },
    {
      rank: 2,
      id: '2',
      name: 'Priya Sharma',
      username: '@priyasharma',
      xpEarned: 28750,
      modulesCompleted: 21,
      streak: 32,
      joinDate: new Date('2024-03-03')
    },
    {
      rank: 3,
      id: '3',
      name: 'Rohit Verma',
      username: '@rohitverma',
      xpEarned: 26180,
      modulesCompleted: 20,
      streak: 28,
      joinDate: new Date('2024-02-28')
    },
    {
      rank: 4,
      id: '4',
      name: 'Sneha Reddy',
      username: '@snehareddy',
      xpEarned: 24980,
      modulesCompleted: 19,
      streak: 26,
      joinDate: new Date('2024-03-10')
    },
    {
      rank: 5,
      id: '5',
      name: 'Divyansh Patel',
      username: '@divyanshpatel',
      xpEarned: 22670,
      modulesCompleted: 18,
      streak: 24,
      joinDate: new Date('2024-03-15')
    }
  ];
}

export function generateMockSystemMetrics(): SystemMetrics {
  return {
    serverStatus: 'operational',
    databaseStatus: 'healthy',
    apiResponseTime: 120,
    activeSessions: 2392,
    courseCompletionRate: 68.4,
    capApprovalRate: 76.3
  };
}

export function generateMockPlatformHealth(): PlatformHealthData {
  return {
    userGrowth: [45, 52, 48, 61, 55, 67, 72, 68, 75, 82],
    retentionRate: 78.5,
    referralConversion: 12.3
  };
}

export function generateMockCAPAnalytics(): CAPAnalyticsData {
  return {
    applications: 342,
    approved: 261,
    rejected: 81,
    pending: 156
  };
}

export function generateMockReferralPerformance(): ReferralPerformanceData {
  return {
    totalReferrals: 1205,
    conversionRate: 34.8,
    xpGenerated: 45230
  };
}

// API calling functions (replace with real API calls when backend is ready)
export async function fetchAdminAnalytics() {
  try {
    const response = await fetch('http://localhost:4000/analytics/admin', {
      cache: 'no-store'
    });
    if (!response.ok) throw new Error('Failed to fetch analytics');
    return await response.json();
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return generateMockAnalyticsData();
  }
}

export async function fetchGrowthData() {
  try {
    const response = await fetch('http://localhost:4000/analytics/growth', {
      cache: 'no-store'
    });
    if (!response.ok) throw new Error('Failed to fetch growth data');
    return await response.json();
  } catch (error) {
    console.error('Error fetching growth data:', error);
    return generateMockGrowthData();
  }
}

export async function fetchActivityFeed() {
  try {
    const response = await fetch('http://localhost:4000/activities/recent', {
      cache: 'no-store'
    });
    if (!response.ok) throw new Error('Failed to fetch activity feed');
    return await response.json();
  } catch (error) {
    console.error('Error fetching activity feed:', error);
    return generateMockActivityFeed();
  }
}

export async function fetchTopUsers() {
  try {
    const response = await fetch('http://localhost:4000/referrals/leaderboard/all', {
      cache: 'no-store'
    });
    if (!response.ok) throw new Error('Failed to fetch top users');
    return await response.json();
  } catch (error) {
    console.error('Error fetching top users:', error);
    return generateMockTopUsers();
  }
}