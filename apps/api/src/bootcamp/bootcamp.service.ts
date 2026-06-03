import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BootcampService {
  constructor(private prisma: PrismaService) {}

  async getModules(userId: string) {
    const modules = await this.prisma.module.findMany({
      include: {
        lessons: {
          orderBy: { orderIndex: 'asc' },
          include: {
            progress: {
              where: { userId },
            },
          },
        },
        subscriptions: {
          where: { userId },
        },
      },
      orderBy: { orderIndex: 'asc' },
    });

    return modules.map((module) => {
      let completedLessons = 0;
      
      const mappedLessons = module.lessons.map((lesson) => {
        const isCompleted = lesson.progress.length > 0;
        if (isCompleted) completedLessons++;
        return {
          id: lesson.id,
          title: lesson.title,
          duration: lesson.duration,
          description: lesson.description,
          content: lesson.content,
          completed: isCompleted,
          orderIndex: lesson.orderIndex,
        };
      });

      return {
        id: module.id,
        title: module.title,
        description: module.description,
        xpReward: module.xpReward,
        duration: module.duration,
        color: module.color,
        thumbnailUrl: module.thumbnailUrl,
        section: module.orderIndex.toString(),
        isPremium: module.isPremium,
        price: module.price,
        category: module.category,
        isSubscribed: module.subscriptions.length > 0,
        lessons: mappedLessons.length,
        completed: completedLessons,
        mappedLessons, // returning the detailed lessons array inside
      };
    });
  }

  async getMyModules(userId: string) {
    const modules = await this.getModules(userId);
    return modules.filter(m => m.isSubscribed);
  }

  async subscribeToModule(userId: string, moduleId: string) {
    const module = await this.prisma.module.findUnique({ where: { id: moduleId } });
    if (!module) throw new NotFoundException('Module not found');

    const existing = await this.prisma.moduleSubscription.findUnique({
      where: { userId_moduleId: { userId, moduleId } },
    });

    if (existing) {
      throw new BadRequestException('Already subscribed');
    }

    return this.prisma.moduleSubscription.create({
      data: {
        userId,
        moduleId,
      },
    });
  }

  async completeLesson(userId: string, lessonId: string) {
    // Check if already completed
    const existing = await this.prisma.lessonProgress.findUnique({
      where: {
        userId_lessonId: { userId, lessonId },
      },
    });

    if (existing) {
      throw new BadRequestException('Lesson already completed');
    }

    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { module: true },
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    // Mark completed
    const progress = await this.prisma.lessonProgress.create({
      data: {
        userId,
        lessonId,
      },
    });

    // Award piecemeal XP: 50 XP per lesson
    const lessonXP = 50;
    await this.prisma.xPTransaction.create({
      data: {
        userId,
        amount: lessonXP,
        reason: `Completed Lesson: ${lesson.title}`,
      },
    });

    // Check if entire module is completed
    const allModuleLessons = await this.prisma.lesson.findMany({
      where: { moduleId: lesson.moduleId },
    });

    const completedModuleLessons = await this.prisma.lessonProgress.count({
      where: {
        userId,
        lessonId: { in: allModuleLessons.map((l) => l.id) },
      },
    });

    let moduleCompleted = false;
    let awardedModuleXP = 0;

    if (completedModuleLessons === allModuleLessons.length) {
      // Entire module completed, award the module XP bonus
      awardedModuleXP = lesson.module.xpReward;
      moduleCompleted = true;
      await this.prisma.xPTransaction.create({
        data: {
          userId,
          amount: awardedModuleXP,
          reason: `Completed Module: ${lesson.module.title}`,
        },
      });
    }

    return {
      success: true,
      lessonXP,
      awardedModuleXP,
      moduleCompleted,
      progress,
    };
  }

  async createModule(data: any) {
    return this.prisma.module.create({
      data: {
        title: data.title,
        description: data.description,
        xpReward: Number(data.xpReward),
        duration: data.duration,
        color: data.color,
        thumbnailUrl: data.thumbnailUrl,
        orderIndex: Number(data.orderIndex),
      },
    });
  }

  async updateModule(id: string, data: any) {
    const module = await this.prisma.module.findUnique({ where: { id } });
    if (!module) throw new NotFoundException('Module not found');
    
    return this.prisma.module.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        xpReward: Number(data.xpReward),
        duration: data.duration,
        color: data.color,
        thumbnailUrl: data.thumbnailUrl,
        orderIndex: Number(data.orderIndex),
      },
    });
  }

  async createLesson(moduleId: string, data: any) {
    const moduleExists = await this.prisma.module.findUnique({
      where: { id: moduleId },
    });
    
    if (!moduleExists) {
      throw new NotFoundException('Module not found');
    }

    return this.prisma.lesson.create({
      data: {
        moduleId,
        title: data.title,
        description: data.description,
        duration: data.duration,
        content: data.content,
        orderIndex: Number(data.orderIndex),
      },
    });
  }

  async updateLesson(id: string, data: any) {
    const lesson = await this.prisma.lesson.findUnique({ where: { id } });
    if (!lesson) throw new NotFoundException('Lesson not found');
    
    return this.prisma.lesson.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        duration: data.duration,
        content: data.content,
        orderIndex: Number(data.orderIndex),
      },
    });
  }

  async deleteModule(moduleId: string) {
    const module = await this.prisma.module.findUnique({ where: { id: moduleId } });
    if (!module) throw new NotFoundException('Module not found');
    
    await this.prisma.module.delete({ where: { id: moduleId } });
    return { success: true };
  }

  async deleteLesson(lessonId: string) {
    const lesson = await this.prisma.lesson.findUnique({ where: { id: lessonId } });
    if (!lesson) throw new NotFoundException('Lesson not found');
    
    await this.prisma.lesson.delete({ where: { id: lessonId } });
    return { success: true };
  }
}
