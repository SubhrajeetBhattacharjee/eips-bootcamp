'use server';

import { prisma } from '@/app/lib/prisma';
import { auth } from '@/app/lib/auth';
import { headers } from 'next/headers';

export interface StudentFeedback {
  id: string;
  assignmentTitle: string;
  mentor: string;
  status: 'positive' | 'neutral' | 'critical';
  snippet: string;
}

export async function getStudentFeedback(): Promise<StudentFeedback[]> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) return [];
    
    const dbUser = await prisma.user.findFirst({ where: { id: session.user.id } });
    if (!dbUser) return [];

    const submissions = await prisma.assignmentSubmission.findMany({
      where: { 
        userId: dbUser.id,
        feedback: { not: null }
      },
      include: {
        assignment: true
      },
      orderBy: { submittedAt: 'desc' },
      take: 5
    });

    return submissions.map(sub => {
      let status: 'positive' | 'neutral' | 'critical' = 'neutral';
      if (sub.status === 'COMPLETED') status = 'positive';
      if (sub.status === 'OVERDUE') status = 'critical';

      return {
        id: sub.id,
        assignmentTitle: sub.assignment?.title || 'Unknown Assignment',
        mentor: 'Admin', // In the future, could track graderId
        status,
        snippet: sub.feedback || 'No remarks provided.'
      };
    });
  } catch (error) {
    console.error('Error fetching student feedback:', error);
    return [];
  }
}
