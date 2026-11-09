import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { QuestsService } from './quests.service';

@Controller('quests')
export class QuestsController {
  constructor(private readonly questsService: QuestsService) {}

  @Get('daily/:userId')
  async getDailyQuests(@Param('userId') userId: string) {
    return this.questsService.getDailyQuests(userId);
  }

  @Post('claim/:questId')
  async claimQuestReward(
    @Param('questId') questId: string,
    @Body('userId') userId: string,
  ) {
    return this.questsService.claimQuestReward(userId, questId);
  }

  @Get('streak/:userId')
  async getUserStreak(@Param('userId') userId: string) {
    return this.questsService.getUserStreak(userId);
  }

  @Post('streak/freeze')
  async refillStreakFreeze(@Body('userId') userId: string) {
    return this.questsService.refillStreakFreeze(userId);
  }
}

