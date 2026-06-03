import { Controller, Get, Post, Put, Delete, Param, Body, NotFoundException } from '@nestjs/common';
import { BootcampService } from './bootcamp.service';

@Controller('bootcamp')
export class BootcampController {
  constructor(private readonly bootcampService: BootcampService) {}

  @Get('modules/:userId')
  async getModules(@Param('userId') userId: string) {
    return this.bootcampService.getModules(userId);
  }

  @Get('my-modules/:userId')
  async getMyModules(@Param('userId') userId: string) {
    return this.bootcampService.getMyModules(userId);
  }

  @Post('modules/:moduleId/subscribe')
  async subscribeToModule(
    @Param('moduleId') moduleId: string,
    @Body('userId') userId: string
  ) {
    if (!userId) {
      throw new NotFoundException('User ID is required');
    }
    return this.bootcampService.subscribeToModule(userId, moduleId);
  }

  @Post('modules/:lessonId/complete')
  async completeLesson(
    @Param('lessonId') lessonId: string,
    @Body('userId') userId: string
  ) {
    if (!userId) {
      throw new NotFoundException('User ID is required');
    }
    return this.bootcampService.completeLesson(userId, lessonId);
  }

  @Post('modules')
  async createModule(@Body() data: any) {
    return this.bootcampService.createModule(data);
  }

  @Put('modules/:id')
  async updateModule(@Param('id') id: string, @Body() data: any) {
    return this.bootcampService.updateModule(id, data);
  }

  @Post('modules/:moduleId/lessons')
  async createLesson(
    @Param('moduleId') moduleId: string,
    @Body() data: any
  ) {
    return this.bootcampService.createLesson(moduleId, data);
  }

  @Put('lessons/:id')
  async updateLesson(@Param('id') id: string, @Body() data: any) {
    return this.bootcampService.updateLesson(id, data);
  }

  @Delete('modules/:moduleId')
  async deleteModule(@Param('moduleId') moduleId: string) {
    return this.bootcampService.deleteModule(moduleId);
  }

  @Delete('lessons/:lessonId')
  async deleteLesson(@Param('lessonId') lessonId: string) {
    return this.bootcampService.deleteLesson(lessonId);
  }
}
