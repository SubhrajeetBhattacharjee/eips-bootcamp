import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ReferralsService } from './referrals.service';
import { GenerateReferralDto } from './dto/generate-referral.dto';
import { UseReferralDto } from './dto/use-referral.dto';

@Controller('referrals')
export class ReferralsController {
  constructor(private readonly referralsService: ReferralsService) {}

  @Post('generate')
  generate(@Body() generateReferralDto: GenerateReferralDto) {
    return this.referralsService.generate(generateReferralDto);
  }

  @Post('use')
  useReferral(@Body() useReferralDto: UseReferralDto) {
    return this.referralsService.useReferral(useReferralDto);
  }

  @Post('click/:code')
  trackClick(@Param('code') code: string) {
    return this.referralsService.trackClick(code);
  }

  @Get('leaderboard/all')
  getLeaderboard() {
    return this.referralsService.getLeaderboard();
  }

  @Get(':userId')
  getReferralStats(@Param('userId') userId: string) {
    return this.referralsService.getReferralStats(userId);
  }

  @Get('activity/:userId')
  getActivity(@Param('userId') userId: string) {
    return this.referralsService.getActivity(userId);
  }
}