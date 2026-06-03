import { Controller, Post, Get, Delete, Param, Body } from '@nestjs/common';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  async createEvent(@Body() data: any) {
    return this.eventsService.createEvent(data);
  }

  @Get()
  async getAllEvents() {
    return this.eventsService.getAllEvents();
  }

  @Get('upcoming/:userId')
  async getUpcomingEvents(@Param('userId') userId: string) {
    return this.eventsService.getUpcomingEvents(userId);
  }

  @Delete(':id')
  async deleteEvent(@Param('id') id: string) {
    return this.eventsService.deleteEvent(id);
  }
}
