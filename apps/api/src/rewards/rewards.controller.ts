import { Controller, Get, Post, Body, Param, NotFoundException } from '@nestjs/common';
import { RewardsService } from './rewards.service';

@Controller('rewards')
export class RewardsController {
  constructor(private readonly rewardsService: RewardsService) {}

  @Get(':userId')
  async getRewardsData(@Param('userId') userId: string) {
    return this.rewardsService.getRewardsData(userId);
  }

  @Post('redeem')
  async redeemReward(
    @Body('userId') userId: string,
    @Body('rewardId') rewardId: string
  ) {
    if (!userId || !rewardId) {
      throw new NotFoundException('User ID and Reward ID required');
    }
    return this.rewardsService.redeemReward(userId, rewardId);
  }
}
