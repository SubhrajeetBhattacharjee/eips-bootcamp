import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AssignmentsService {
  constructor(private prisma: PrismaService) {}

  async getAssignmentsForUser(userId: string) {
    const assignments = await this.prisma.assignment.findMany({
      include: {
        submissions: {
          where: { userId },
        },
      },
    });

    const mapped = assignments.map((a) => {
      const sub = a.submissions[0];
      return {
        id: a.id,
        title: a.title,
        module: a.module,
        description: a.description,
        difficulty: a.difficulty,
        xpReward: a.xpReward,
        deadline: a.deadline.toISOString(),
        estimatedTime: a.estimatedTime,
        status: sub ? this.mapStatus(sub.status) : 'Not Started',
        progress: sub ? sub.progress : 0,
        tags: a.tags,
      };
    });

    // Also get stats for the user
    const submissions = await this.prisma.assignmentSubmission.findMany({
      where: { userId },
      include: { assignment: true },
    });

    const completed = submissions.filter((s) => s.status === 'COMPLETED');
    const pendingReview = submissions.filter((s) => s.status === 'SUBMITTED' || s.status === 'UNDER_REVIEW');
    const totalXpEarned = completed.reduce((acc, sub) => acc + (sub.score || sub.assignment.xpReward), 0);

    const stats = {
      totalAssignments: assignments.length,
      completedAssignments: completed.length,
      pendingReview: pendingReview.length,
      totalXpEarned,
    };

    return { assignments: mapped, stats };
  }

  async submitAssignment(userId: string, assignmentId: string, content: string) {
    const submission = await this.prisma.assignmentSubmission.upsert({
      where: {
        userId_assignmentId: { userId, assignmentId },
      },
      update: {
        content,
        status: 'SUBMITTED',
        progress: 100,
        submittedAt: new Date(),
      },
      create: {
        userId,
        assignmentId,
        content,
        status: 'SUBMITTED',
        progress: 100,
        submittedAt: new Date(),
      },
    });

    return { success: true, message: 'Assignment submitted successfully! Your submission is under review.' };
  }

  private mapStatus(status: string) {
    switch(status) {
      case 'NOT_STARTED': return 'Not Started';
      case 'IN_PROGRESS': return 'In Progress';
      case 'SUBMITTED': return 'Submitted';
      case 'UNDER_REVIEW': return 'Under Review';
      case 'COMPLETED': return 'Completed';
      case 'OVERDUE': return 'Overdue';
      default: return 'Not Started';
    }
  }
}
