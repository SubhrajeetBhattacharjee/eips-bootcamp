/**
 * Mock Bootcamp Data
 * Replace with API calls when backend is ready
 */

import { Module, Lesson } from './bootcamp.types';

/**
 * Mock modules data
 */
export const mockModules: Module[] = [
  {
    id: '1',
    section: '1',
    title: 'Introduction to EIPs',
    description: 'Learn the fundamentals of Ethereum Improvement Proposals and their role in the ecosystem.',
    lessons: 3,
    completed: 3,
    xpReward: 150,
    duration: '45 min',
    color: 'from-emerald-500/20 to-emerald-600/10',
  },
  {
    id: '2',
    section: '2',
    title: 'EIP Structure & Components',
    description: 'Master the anatomy of a well-written EIP including all required sections and formatting standards.',
    lessons: 4,
    completed: 2,
    xpReward: 200,
    duration: '1 hour',
    color: 'from-cyan-500/20 to-cyan-600/10',
  },
  {
    id: '3',
    section: '3',
    title: 'Writing Clear Specifications',
    description: 'Develop the skills to write precise and unambiguous technical specifications that meet EIP standards.',
    lessons: 5,
    completed: 1,
    xpReward: 250,
    duration: '1.5 hours',
    color: 'from-blue-500/20 to-blue-600/10',
  },
  {
    id: '4',
    section: '4',
    title: 'EIP Review Process',
    description: 'Understand the peer review cycle, community feedback, and the path to EIP acceptance.',
    lessons: 3,
    completed: 0,
    xpReward: 200,
    duration: '1 hour',
    color: 'from-violet-500/20 to-violet-600/10',
  },
  {
    id: '5',
    section: '5',
    title: 'Real-World EIP Examples',
    description: 'Analyze successful EIPs across different categories and learn from best practices.',
    lessons: 4,
    completed: 0,
    xpReward: 300,
    duration: '2 hours',
    color: 'from-pink-500/20 to-pink-600/10',
  },
  {
    id: '6',
    section: '6',
    title: 'Advanced Topics & Security',
    description: 'Explore advanced EIP concepts including security considerations and consensus mechanisms.',
    lessons: 5,
    completed: 0,
    xpReward: 350,
    duration: '2.5 hours',
    color: 'from-orange-500/20 to-orange-600/10',
  },
];

/**
 * Mock lessons data organized by module
 */
export const mockLessonsByModule: Record<string, Lesson[]> = {
  '1': [
    {
      id: '1.1',
      title: 'What is an EIP?',
      duration: '12 min',
      completed: true,
      description: 'Understand the definition and purpose of Ethereum Improvement Proposals and how they fit into the broader Ethereum governance structure.',
    },
    {
      id: '1.2',
      title: 'EIP Categories and Types',
      duration: '15 min',
      completed: true,
      description: 'Explore different types of EIPs: Core, Networking, Interface, and Application. Learn the differences and use cases for each category.',
    },
    {
      id: '1.3',
      title: 'Why EIPs Matter',
      duration: '18 min',
      completed: true,
      description: 'Learn how EIPs shape the future of Ethereum, drive innovation, and represent the community consensus on protocol changes.',
    },
  ],
  '2': [
    {
      id: '2.1',
      title: 'Required Sections Overview',
      duration: '14 min',
      completed: true,
      description: 'Understand all required sections in an EIP document and why each one is important for the review process.',
    },
    {
      id: '2.2',
      title: 'Header and Metadata',
      duration: '16 min',
      completed: true,
      description: 'Learn how to properly format EIP headers and YAML metadata to ensure your proposal is correctly indexed and tracked.',
    },
    {
      id: '2.3',
      title: 'Motivation and Specification',
      duration: '20 min',
      completed: false,
      description: 'Write compelling motivation sections that clearly articulate the problem and detailed technical specifications.',
    },
    {
      id: '2.4',
      title: 'Rationale and Implementation',
      duration: '18 min',
      completed: false,
      description: 'Document your design decisions and provide implementation guidance for developers and client teams.',
    },
  ],
  '3': [
    {
      id: '3.1',
      title: 'Abstract Best Practices',
      duration: '13 min',
      completed: true,
      description: 'Learn to write concise and effective abstracts that capture the essence of your proposal in a few sentences.',
    },
    {
      id: '3.2',
      title: 'Motivation: Tell the Story',
      duration: '15 min',
      completed: false,
      description: 'Craft a compelling narrative that explains the problem, its impact, and why your solution is necessary.',
    },
    {
      id: '3.3',
      title: 'Technical Precision',
      duration: '17 min',
      completed: false,
      description: 'Write unambiguous technical specifications that developers can implement without additional clarification.',
    },
    {
      id: '3.4',
      title: 'Rationale: Explain Why',
      duration: '16 min',
      completed: false,
      description: 'Document alternative approaches you considered and explain why your chosen solution is optimal.',
    },
    {
      id: '3.5',
      title: 'Security Considerations',
      duration: '20 min',
      completed: false,
      description: 'Thoroughly address potential security implications, edge cases, and how your proposal mitigates these risks.',
    },
  ],
  '4': [
    {
      id: '4.1',
      title: 'Submitting an EIP',
      duration: '14 min',
      completed: false,
      description: 'Navigate the submission process, understand requirements, and prepare your EIP for community review.',
    },
    {
      id: '4.2',
      title: 'Community Feedback',
      duration: '18 min',
      completed: false,
      description: 'Learn how to respond to community comments, incorporate feedback, and engage in constructive discussions.',
    },
    {
      id: '4.3',
      title: 'From Draft to Final',
      duration: '16 min',
      completed: false,
      description: 'Understand the EIP lifecycle, milestone transitions, and the path to final approval and implementation.',
    },
  ],
  '5': [
    {
      id: '5.1',
      title: 'Analyzing EIP-1559',
      duration: '22 min',
      completed: false,
      description: 'Deep dive into EIP-1559, a major EIP that changed Ethereum\'s transaction fee mechanism. Understand its impact and implementation.',
    },
    {
      id: '5.2',
      title: 'Token Standards: EIP-20 & EIP-721',
      duration: '25 min',
      completed: false,
      description: 'Learn from the most successful EIPs in the ecosystem. Understand how ERC-20 and ERC-721 shaped Web3 standards.',
    },
    {
      id: '5.3',
      title: 'Case Study: Protocol Upgrades',
      duration: '20 min',
      completed: false,
      description: 'Examine EIPs that drove major protocol changes and upgrades, including consensus changes and scaling solutions.',
    },
    {
      id: '5.4',
      title: 'Case Study: Standards & Extensions',
      duration: '18 min',
      completed: false,
      description: 'Study standards and extensions that shaped the Web3 ecosystem beyond core Ethereum protocol.',
    },
  ],
  '6': [
    {
      id: '6.1',
      title: 'Consensus and Finality',
      duration: '24 min',
      completed: false,
      description: 'Advanced understanding of consensus mechanisms in EIPs, finality guarantees, and network security implications.',
    },
    {
      id: '6.2',
      title: 'Security Analysis Deep Dive',
      duration: '28 min',
      completed: false,
      description: 'Comprehensive security analysis frameworks, threat modeling, and validation strategies for protocol changes.',
    },
    {
      id: '6.3',
      title: 'Formal Verification',
      duration: '26 min',
      completed: false,
      description: 'Mathematical proofs and formal verification techniques to ensure EIP specifications are correct and complete.',
    },
    {
      id: '6.4',
      title: 'Performance & Scalability',
      duration: '22 min',
      completed: false,
      description: 'Optimize EIPs for network efficiency, analyze gas costs, and consider scalability implications.',
    },
    {
      id: '6.5',
      title: 'Contributing to Ethereum',
      duration: '20 min',
      completed: false,
      description: 'Your path forward as an EIP contributor. Next steps, community involvement, and career opportunities.',
    },
  ],
};

/**
 * Mock user statistics
 */
export const mockUserStats = {
  totalXpEarned: 1250,
  currentStreak: 7,
  leaderboardRank: 142,
  modulesCompleted: 1,
  modulesInProgress: 1,
  totalLessonsCompleted: 6,
  registeredDate: new Date('2024-01-15'),
};

/**
 * Mock leaderboard data
 */
export const mockLeaderboard = [
  {
    rank: 1,
    name: 'Sarah Mitchell',
    xp: 4250,
    modulesCompleted: 5,
    avatar: 'SM',
  },
  {
    rank: 2,
    name: 'Alex Chen',
    xp: 3980,
    modulesCompleted: 5,
    avatar: 'AC',
  },
  {
    rank: 3,
    name: 'Jordan Rodriguez',
    xp: 3650,
    modulesCompleted: 4,
    avatar: 'JR',
  },
  {
    rank: 4,
    name: 'Casey Williams',
    xp: 3420,
    modulesCompleted: 4,
    avatar: 'CW',
  },
  {
    rank: 5,
    name: 'Morgan Lee',
    xp: 3100,
    modulesCompleted: 3,
    avatar: 'ML',
  },
];

/**
 * Mock referral data
 */
export const mockReferralData = {
  referralCode: 'ALEX2024',
  totalReferrals: 12,
  successfulReferrals: 8,
  xpFromReferrals: 640,
  pendingReferrals: 4,
};

/**
 * Mock activity feed
 */
export const mockActivityFeed = [
  {
    id: 1,
    type: 'lesson_completed',
    user: 'You',
    action: 'completed lesson',
    target: 'Motivation: Tell the Story',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    xpReward: 50,
  },
  {
    id: 2,
    type: 'module_completed',
    user: 'Sarah Mitchell',
    action: 'completed module',
    target: 'Real-World EIP Examples',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    xpReward: 300,
  },
  {
    id: 3,
    type: 'referral_success',
    user: 'You',
    action: 'referred',
    target: 'Jordan Rodriguez',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    xpReward: 100,
  },
  {
    id: 4,
    type: 'achievement_unlocked',
    user: 'You',
    action: 'unlocked achievement',
    target: 'Learning Streak - 7 Days',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    xpReward: 0,
  },
];

/**
 * API fetch functions (to be replaced with real API calls)
 */
export async function fetchModules(): Promise<Module[]> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  return mockModules;
}

export async function fetchLessonsByModule(moduleId: string): Promise<Lesson[]> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 200));
  return mockLessonsByModule[moduleId] || [];
}

export async function fetchUserStats() {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 250));
  return mockUserStats;
}

export async function fetchLeaderboard() {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  return mockLeaderboard;
}

export async function markLessonComplete(lessonId: string): Promise<{ success: boolean; xpReward: number }> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 200));
  return { success: true, xpReward: 50 };
}

export async function markModuleComplete(moduleId: string): Promise<{ success: boolean; xpReward: number }> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 200));
  return { success: true, xpReward: 250 };
}