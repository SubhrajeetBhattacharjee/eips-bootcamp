import { Controller, Post, Body, Get, Param } from '@nestjs/common';
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
}
