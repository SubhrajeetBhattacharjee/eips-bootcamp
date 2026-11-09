import { Controller, Get, Post, Param } from '@nestjs/common';
import { AchievementsService } from './achievements.service';

@Controller('achievements')
export class AchievementsController {
  constructor(private readonly achievementsService: AchievementsService) {}

  @Get('user/:userId')
  async getUserAchievements(@Param('userId') userId: string) {
    return this.achievementsService.getUserAchievements(userId);
  }

  @Post('evaluate/:userId')
  async evaluateUser(@Param('userId') userId: string) {
    return this.achievementsService.evaluateUserAchievements(userId);
  }
}

