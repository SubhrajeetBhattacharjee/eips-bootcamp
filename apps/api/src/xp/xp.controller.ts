import { Controller, Post, Body, Get, Param, Query } from '@nestjs/common';
import { XpService } from './xp.service';
import { AwardXpDto } from './dto/award-xp.dto';

@Controller('xp')
export class XpController {
  constructor(private readonly xpService: XpService) {}

  @Post('award')
  awardXp(@Body() awardXpDto: AwardXpDto) {
    return this.xpService.awardXp(awardXpDto);
  }

  @Get(':userId')
  getUserXp(@Param('userId') userId: string) {
    return this.xpService.getUserXp(userId);
  }

  @Get(':userId/history')
  getXpHistory(
    @Param('userId') userId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('category') category?: string,
  ) {
    return this.xpService.getXpHistory(userId, {
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
      category,
    });
  }
}
