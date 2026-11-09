import { Controller, Get, Post, Param, Body, Query } from '@nestjs/common';
import { SeasonsService } from './seasons.service';

@Controller('seasons')
export class SeasonsController {
  constructor(private readonly seasonsService: SeasonsService) {}

  @Get('current')
  async getCurrentSeason(@Query('userId') userId?: string) {
    return this.seasonsService.getCurrentSeason(userId);
  }

  @Get()
  async getAllSeasons() {
    return this.seasonsService.getAllSeasons();
  }

  @Get(':slug')
  async getSeasonBySlug(
    @Param('slug') slug: string,
    @Query('userId') userId?: string,
  ) {
    return this.seasonsService.getSeasonBySlug(slug, userId);
  }

  @Post('claim/:seasonId')
  async claimSeasonReward(
    @Param('seasonId') seasonId: string,
    @Body('userId') userId: string,
  ) {
    return this.seasonsService.claimSeasonReward(userId, seasonId);
  }
}

