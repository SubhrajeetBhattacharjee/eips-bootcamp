import { Controller, Get, Post, Param, Body, NotFoundException } from '@nestjs/common';
import { BootcampService } from './bootcamp.service';

@Controller('bootcamp')
export class BootcampController {
  constructor(private readonly bootcampService: BootcampService) {}

  @Get('modules/:userId')
  async getModules(@Param('userId') userId: string) {
    return this.bootcampService.getModules(userId);
  }

  @Post('lessons/:lessonId/complete')
  async completeLesson(
    @Param('lessonId') lessonId: string,
    @Body('userId') userId: string
  ) {
    if (!userId) {
      throw new NotFoundException('User ID is required');
    }
    return this.bootcampService.completeLesson(userId, lessonId);
  }
}
