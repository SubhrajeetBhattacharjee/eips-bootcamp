'use server';

import { prisma } from '@/app/lib/prisma';
import { auth } from '@/app/lib/auth';
import { headers } from 'next/headers';

export async function getUpcomingDeadlines() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) return [];

    const dbUser = await prisma.user.findFirst({ where: { id: session.user.id } });
    if (!dbUser) return [];

    // Find assignments the user hasn't completed yet
    const completedSubmissions = await prisma.assignmentSubmission.findMany({
      where: { userId: dbUser.id, status: 'COMPLETED' },
      select: { assignmentId: true }
    });
    
    const completedAssignmentIds = completedSubmissions.map(s => s.assignmentId);

    const upcoming = await prisma.assignment.findMany({
      where: {
        id: { notIn: completedAssignmentIds }
      },
      orderBy: { createdAt: 'desc' },
      take: 2
    });

    return upcoming;
  } catch (e) {
    console.error('Error fetching deadlines', e);
    return [];
  }
}

export async function getLearningProgress() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) return null;

    const dbUser = await prisma.user.findFirst({ where: { id: session.user.id } });
    if (!dbUser) return null;

    // Latest in progress submission
    const inProgress = await prisma.assignmentSubmission.findFirst({
      where: { userId: dbUser.id, status: 'IN_PROGRESS' },
      include: { assignment: true },
      orderBy: { updatedAt: 'desc' }
    });

    if (inProgress) {
      return {
        type: 'assignment',
        title: inProgress.assignment.title,
        id: inProgress.assignmentId
      };
    }

    // Latest module viewed? 
    // Wait, let's just return the newest assignment if nothing in progress
    const latest = await prisma.assignment.findFirst({
      orderBy: { createdAt: 'desc' }
    });

    if (latest) {
      return {
        type: 'assignment',
        title: latest.title,
        id: latest.id
      };
    }

    return null;
  } catch (e) {
    console.error('Error fetching learning progress', e);
    return null;
  }
}
