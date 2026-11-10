import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { NftRewardsService } from './nft-rewards.service';

@Controller('nft-rewards')
export class NftRewardsController {
  constructor(private readonly nftRewardsService: NftRewardsService) {}

  @Get('user/:userId')
  async getUserRewards(@Param('userId') userId: string) {
    return this.nftRewardsService.getUserRewards(userId);
  }

  @Get(':rewardId')
  async getRewardById(@Param('rewardId') rewardId: string) {
    return this.nftRewardsService.getRewardById(rewardId);
  }

  @Post('claim/:rewardId')
  async claimReward(
    @Param('rewardId') rewardId: string,
    @Body('userId') userId: string,
    @Body('walletAddress') walletAddress: string,
  ) {
    return this.nftRewardsService.claimReward(userId, rewardId, walletAddress);
  }
}
