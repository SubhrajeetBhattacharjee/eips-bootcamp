'use server';

import { prisma } from '@/app/lib/prisma';
import { auth } from '@/app/lib/auth';
import { headers } from 'next/headers';

export async function getUserTotalXp() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) return 0;
    
    // Find db user
    const dbUser = await prisma.user.findFirst({ where: { id: session.user.id } });
    if (!dbUser) return 0;

    const xpAgg = await prisma.xPTransaction.aggregate({
      where: { userId: dbUser.id },
      _sum: { amount: true }
    });

    return xpAgg._sum.amount || 0;
  } catch (error) {
    console.error('Error fetching user XP:', error);
    return 0;
  }
}

export interface AppNotification {
  id: string;
  title: string;
  type: 'ASSIGNMENT' | 'MODULE';
  createdAt: Date;
}

export async function getRecentNotifications(): Promise<AppNotification[]> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) return [];

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const recentAssignments = await prisma.assignment.findMany({
      where: { createdAt: { gte: sevenDaysAgo } },
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    const recentModules = await prisma.module.findMany({
      where: { createdAt: { gte: sevenDaysAgo } },
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    const notifications: AppNotification[] = [
      ...recentAssignments.map(a => ({
        id: `assn_${a.id}`,
        title: `New Assignment Posted: ${a.title}`,
        type: 'ASSIGNMENT' as const,
        createdAt: a.createdAt
      })),
      ...recentModules.map(m => ({
        id: `mod_${m.id}`,
        title: `New Module Posted: ${m.title}`,
        type: 'MODULE' as const,
        createdAt: m.createdAt
      }))
    ];

    return notifications.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 5);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
}
