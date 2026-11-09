import { Controller, Get, Post, Param, Body, Query } from '@nestjs/common';
import { CommunityChallengesService } from './community-challenges.service';

@Controller('community-challenges')
export class CommunityChallengesController {
  constructor(
    private readonly communityChallengesService: CommunityChallengesService,
  ) {}

  @Get()
  async getAllChallenges(@Query('userId') userId?: string) {
    return this.communityChallengesService.getAllChallenges(userId);
  }

  @Post('join/:challengeId')
  async joinChallenge(
    @Param('challengeId') challengeId: string,
    @Body('userId') userId: string,
  ) {
    return this.communityChallengesService.joinChallenge(userId, challengeId);
  }

  @Post('claim/:challengeId')
  async claimChallengeReward(
    @Param('challengeId') challengeId: string,
    @Body('userId') userId: string,
  ) {
    return this.communityChallengesService.claimChallengeReward(
      userId,
      challengeId,
    );
  }
}

