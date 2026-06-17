'use server';

import { prisma } from '@/app/lib/prisma';
import { auth } from '@/app/lib/auth';
import { headers } from 'next/headers';
import {
  InProgressModule,
  TimelineItem,
  ActivityItem,
  DeadlineItem,
  SkillItem,
  StreakItem
} from '@/app/lib/bootcamp.types';

export interface LearningData {
  stats: {
    totalXp: number;
    rank: number;
    modulesCompleted: number;
    activeAssignments: number;
    totalModules: number;
  };
  inProgress: InProgressModule | null;
  nextStep: InProgressModule | null;
  timeline: TimelineItem[];
  activity: ActivityItem[];
  deadlines: DeadlineItem[];
  skills: SkillItem[];
  streak: StreakItem[];
}

export async function getLearningData(): Promise<LearningData | null> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) return null;

    const dbUser = await prisma.user.findFirst({ where: { id: session.user.id } });
    if (!dbUser) return null;

    // 1. Fetch raw data
    const allModules = await prisma.module.findMany({ orderBy: { orderIndex: 'asc' } });
    const allAssignments = await prisma.assignment.findMany({ orderBy: { createdAt: 'asc' } });
    const userSubmissions = await prisma.assignmentSubmission.findMany({
      where: { userId: dbUser.id },
      include: { assignment: true },
      orderBy: { submittedAt: 'desc' }
    });
    const xpTxs = await prisma.xPTransaction.findMany({
      where: { userId: dbUser.id },
      orderBy: { createdAt: 'desc' }
    });

    // Rank calculation (simple approximation: how many users have more XP)
    const userTotalXp = xpTxs.reduce((sum, tx) => sum + tx.amount, 0);
    const usersWithMoreXpCount = await prisma.xPTransaction.groupBy({
      by: ['userId'],
      _sum: { amount: true },
      having: {
        amount: {
          _sum: {
            gt: userTotalXp
          }
        }
      }
    });
    const rank = usersWithMoreXpCount.length + 1;

    // 2. Stats
    const activeAssignments = userSubmissions.filter(s => s.status === 'IN_PROGRESS' || s.status === 'NOT_STARTED').length;
    
    // Calculate modules completed: A module is complete if all its assignments are COMPLETED.
    let modulesCompleted = 0;
    const moduleStatusMap = new Map<string, string>(); // 'COMPLETED', 'IN_PROGRESS', 'NOT_STARTED'
    
    for (const mod of allModules) {
      const modAssignments = allAssignments.filter(a => a.module === mod.id);
      if (modAssignments.length === 0) {
        moduleStatusMap.set(mod.id, 'NOT_STARTED');
        continue;
      }
      
      let completedCount = 0;
      let startedCount = 0;
      for (const a of modAssignments) {
        const sub = userSubmissions.find(s => s.assignmentId === a.id);
        if (sub?.status === 'COMPLETED') completedCount++;
        if (sub) startedCount++;
      }
      
      if (completedCount === modAssignments.length) {
        modulesCompleted++;
        moduleStatusMap.set(mod.id, 'COMPLETED');
      } else if (startedCount > 0) {
        moduleStatusMap.set(mod.id, 'IN_PROGRESS');
      } else {
        moduleStatusMap.set(mod.id, 'NOT_STARTED');
      }
    }

    const stats = {
      totalXp: userTotalXp,
      rank,
      modulesCompleted,
      activeAssignments,
      totalModules: allModules.length
    };

    // 3. In Progress (Continue Learning)
    let inProgress = null;
    const latestInProgress = userSubmissions.find(s => s.status === 'IN_PROGRESS');
    if (latestInProgress) {
      const mod = allModules.find(m => m.id === latestInProgress.assignment.module);
      inProgress = {
        title: latestInProgress.assignment.title,
        moduleName: mod?.title || 'General',
        progress: latestInProgress.progress || 50,
        id: latestInProgress.assignmentId
      };
    } else {
      // Find first module not completed
      const firstIncompleteMod = allModules.find(m => moduleStatusMap.get(m.id) !== 'COMPLETED');
      if (firstIncompleteMod) {
        const firstAssignment = allAssignments.find(a => a.module === firstIncompleteMod.id);
        inProgress = {
          title: firstAssignment?.title || firstIncompleteMod.title,
          moduleName: firstIncompleteMod.title,
          progress: 0,
          id: firstAssignment?.id || ''
        };
      }
    }

    // 4. Timeline
    const timeline = allModules.map(mod => {
      const status = moduleStatusMap.get(mod.id) || 'NOT_STARTED';
      return {
        id: mod.id,
        title: mod.title,
        description: mod.description,
        status,
        duration: mod.duration || '2 weeks',
        xpReward: mod.xpReward || 0
      };
    });

    // 5. Next Step
    const nextStep = inProgress; // Simplify by making next step the in progress item

    // 6. Activity
    const activity = [
      ...userSubmissions.map(s => ({
        id: s.id,
        title: `Submitted ${s.assignment.title}`,
        time: s.submittedAt || s.createdAt,
        type: 'assignment',
        xp: s.score || 0
      })),
      ...xpTxs.filter(tx => tx.reason.includes('Graded')).map(tx => ({
        id: tx.id,
        title: tx.reason,
        time: tx.createdAt,
        type: 'achievement',
        xp: tx.amount
      }))
    ].sort((a, b) => b.time.getTime() - a.time.getTime()).slice(0, 5).map(a => ({
      ...a,
      time: a.time.toLocaleDateString()
    }));

    // 7. Deadlines
    const completedAssignmentIds = userSubmissions.filter(s => s.status === 'COMPLETED').map(s => s.assignmentId);
    const deadlines = allAssignments
      .filter(a => !completedAssignmentIds.includes(a.id))
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) // Assuming no actual deadline field, using creation order or mock deadline
      .slice(0, 3)
      .map(a => ({
        id: a.id,
        title: a.title,
        module: allModules.find(m => m.id === a.module)?.title || 'General',
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString() // mock 7 days from now
      }));

    // 8. Skills
    // Calculate skills based on tags of completed assignments
    const tagCounts: Record<string, number> = {};
    for (const sub of userSubmissions) {
      if (sub.status === 'COMPLETED') {
        const tagsStr = sub.assignment.tags as unknown as string;
        let tags: string[] = [];
        try {
          if (typeof tagsStr === 'string') {
            tags = JSON.parse(tagsStr);
          } else if (Array.isArray(tagsStr)) {
            tags = tagsStr;
          }
        } catch(e) {}
        
        for (const tag of tags) {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        }
      }
    }
    
    // Map tags to skill categories
    const technical = ['solidity', 'smart-contracts', 'web3', 'blockchain', 'ethereum'];
    const soft = ['analysis', 'design', 'architecture', 'writing'];
    
    const skills = [
      { name: 'Smart Contracts', progress: Math.min(100, (tagCounts['solidity'] || 0) * 20), category: 'technical' },
      { name: 'Web3 Integration', progress: Math.min(100, (tagCounts['web3'] || 0) * 20), category: 'technical' },
      { name: 'System Design', progress: Math.min(100, (tagCounts['architecture'] || 0) * 20), category: 'technical' },
      { name: 'Technical Writing', progress: Math.min(100, (tagCounts['writing'] || 0) * 20), category: 'soft' },
      { name: 'Security Analysis', progress: Math.min(100, (tagCounts['analysis'] || 0) * 20), category: 'soft' }
    ];

    // 9. Streak Heatmap
    // Just map xpTx dates to intensity
    const streak = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 56; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const txsOnDay = xpTxs.filter(tx => {
        const txDate = new Date(tx.createdAt);
        return txDate.getDate() === date.getDate() && 
               txDate.getMonth() === date.getMonth() && 
               txDate.getFullYear() === date.getFullYear();
      });
      
      let intensity = 0;
      if (txsOnDay.length > 0) {
        const xpEarned = txsOnDay.reduce((sum, tx) => sum + tx.amount, 0);
        if (xpEarned > 1000) intensity = 4;
        else if (xpEarned > 500) intensity = 3;
        else if (xpEarned > 100) intensity = 2;
        else intensity = 1;
      }
      
      streak.push({ date, intensity });
    }

    return {
      stats,
      inProgress,
      nextStep,
      timeline,
      activity,
      deadlines,
      skills,
      streak
    };

  } catch (error) {
    console.error('Error fetching learning data:', error);
    return null;
  }
}
