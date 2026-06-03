import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AssignmentsService {
  constructor(private prisma: PrismaService) {}

  async getAssignmentsForUser(userId: string) {
    // 1. Get user's module subscriptions
    const subscriptions = await this.prisma.moduleSubscription.findMany({
      where: { userId },
      select: { moduleId: true }
    });
    const subscribedModuleIds = subscriptions.map(s => s.moduleId);

    // 2. Fetch assignments only for subscribed modules
    const assignments = await this.prisma.assignment.findMany({
      where: {
        module: { in: subscribedModuleIds }
      },
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
        questionFileUrl: a.questionFileUrl,
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
    const assignment = await this.prisma.assignment.findUnique({
      where: { id: assignmentId },
    });

    if (!assignment) {
      throw new NotFoundException('Assignment not found');
    }

    const existingSubmission = await this.prisma.assignmentSubmission.findUnique({
      where: {
        userId_assignmentId: { userId, assignmentId },
      },
    });

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

    // Award XP only on the first submission
    if (!existingSubmission) {
      await this.prisma.xPTransaction.create({
        data: {
          userId,
          amount: assignment.xpReward,
          reason: `Submitted Assignment: ${assignment.title}`,
        },
      });
    }

    return { success: true, message: 'Assignment submitted successfully! Your submission is under review.', xpAwarded: !existingSubmission ? assignment.xpReward : 0 };
  }

  async createAssignment(data: any) {
    let deadlineDate = new Date(data.deadline);
    if (isNaN(deadlineDate.getTime())) {
      deadlineDate = new Date();
      deadlineDate.setDate(deadlineDate.getDate() + 7); // Default to 7 days from now
    }

    return this.prisma.assignment.create({
      data: {
        title: data.title,
        module: data.module,
        description: data.description,
        difficulty: data.difficulty,
        xpReward: Number(data.xpReward) || 0,
        deadline: deadlineDate,
        estimatedTime: Number(data.estimatedTime) || 0,
        tags: data.tags || [],
        questionFileUrl: data.questionFileUrl,
      },
    });
  }

  async updateAssignment(assignmentId: string, data: any) {
    const assignment = await this.prisma.assignment.findUnique({ where: { id: assignmentId } });
    if (!assignment) throw new NotFoundException('Assignment not found');
    
    let deadlineDate = new Date(data.deadline);
    if (isNaN(deadlineDate.getTime())) {
      deadlineDate = assignment.deadline; // Fallback to existing deadline
    }

    return this.prisma.assignment.update({
      where: { id: assignmentId },
      data: {
        title: data.title,
        module: data.module,
        description: data.description,
        difficulty: data.difficulty,
        xpReward: Number(data.xpReward) || 0,
        deadline: deadlineDate,
        estimatedTime: Number(data.estimatedTime) || 0,
        tags: data.tags || [],
        questionFileUrl: data.questionFileUrl,
      },
    });
  }

  async deleteAssignment(assignmentId: string) {
    const assignment = await this.prisma.assignment.findUnique({ where: { id: assignmentId } });
    if (!assignment) throw new NotFoundException('Assignment not found');
    
    // AssignmentSubmission has `assignmentId` which might need to cascade delete.
    // Assuming schema is setup with cascade delete on the relation. 
    // If not, we might need to delete submissions first. Let's assume Prisma handles it.
    await this.prisma.assignment.delete({ where: { id: assignmentId } });
    return { success: true };
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
