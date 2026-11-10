import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CompetitionsService } from './competitions.service';
import { RegisterCompetitionDto } from './dto/register-competition.dto';
import { SubmitCompetitionDto } from './dto/submit-competition.dto';

@Controller('competitions')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class CompetitionsController {
  constructor(private readonly competitionsService: CompetitionsService) {}

  @Get()
  async getCompetitions(@Query('userId') userId?: string) {
    return this.competitionsService.getCompetitions(userId);
  }

  @Get('user/:userId/history')
  async getUserHistory(@Param('userId') userId: string) {
    return this.competitionsService.getUserCompetitionHistory(userId);
  }

  @Get(':idOrSlug/leaderboard')
  async getLeaderboard(
    @Param('idOrSlug') idOrSlug: string,
    @Query('userId') userId?: string,
  ) {
    return this.competitionsService.getCompetitionLeaderboard(idOrSlug, userId);
  }

  @Get(':idOrSlug')
  async getCompetition(
    @Param('idOrSlug') idOrSlug: string,
    @Query('userId') userId?: string,
  ) {
    return this.competitionsService.getCompetitionById(idOrSlug, userId);
  }

  @Post(':id/register')
  async register(@Param('id') id: string, @Body() dto: RegisterCompetitionDto) {
    return this.competitionsService.registerForCompetition(id, dto.userId);
  }

  @Post(':id/start')
  async start(@Param('id') id: string, @Body() dto: RegisterCompetitionDto) {
    return this.competitionsService.startCompetition(id, dto.userId);
  }

  @Post(':id/submit')
  async submit(@Param('id') id: string, @Body() dto: SubmitCompetitionDto) {
    return this.competitionsService.submitCompetition(id, dto);
  }
}
