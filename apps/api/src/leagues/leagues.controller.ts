import { Controller, Get, Param, Post } from '@nestjs/common';
import { LeaguesService, TIER_ORDER } from './leagues.service';

@Controller('leagues')
export class LeaguesController {
  constructor(private readonly leaguesService: LeaguesService) {}

  @Get('tiers')
  getTiers() {
    return {
      tiers: TIER_ORDER.map((tier, index) => ({
        tier,
        level: index + 1,
        title: `${tier.charAt(0) + tier.slice(1).toLowerCase()} League`,
      })),
    };
  }

  @Get('current/:userId')
  getUserCurrentLeague(@Param('userId') userId: string) {
    return this.leaguesService.getUserCurrentLeague(userId);
  }

  @Post('rollover')
  rolloverWeeklyLeagues() {
    return this.leaguesService.rolloverWeeklyLeagues();
  }
}

