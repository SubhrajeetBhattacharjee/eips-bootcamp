import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async createEvent(data: any) {
    const module = await this.prisma.module.findUnique({
      where: { id: data.moduleId }
    });
    
    if (!module) {
      throw new NotFoundException('Module not found');
    }

    return this.prisma.event.create({
      data: {
        title: data.title,
        description: data.description,
        link: data.link,
        date: new Date(data.date),
        moduleId: data.moduleId,
      }
    });
  }

  async getUpcomingEvents(userId: string) {
    // 1. Get modules the user is subscribed to
    const subscriptions = await this.prisma.moduleSubscription.findMany({
      where: { userId },
      select: { moduleId: true }
    });
    const moduleIds = subscriptions.map(s => s.moduleId);

    // 2. Fetch upcoming events for those modules
    return this.prisma.event.findMany({
      where: {
        moduleId: { in: moduleIds },
        date: { gte: new Date() } // upcoming only
      },
      orderBy: { date: 'asc' },
      include: {
        module: {
          select: { title: true }
        }
      }
    });
  }

  async getAllEvents() {
    return this.prisma.event.findMany({
      orderBy: { date: 'asc' },
      include: {
        module: {
          select: { title: true }
        }
      }
    });
  }

  async deleteEvent(eventId: string) {
    await this.prisma.event.delete({
      where: { id: eventId }
    });
    return { success: true };
  }
}
