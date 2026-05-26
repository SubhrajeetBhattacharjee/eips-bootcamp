import { Controller, Post, Body, Get, Param, Patch } from '@nestjs/common';
import { CapService } from './cap.service';
import { CreateCapApplicationDto } from './dto/create-cap-application.dto';
import { UpdateCapStatusDto } from './dto/update-cap-status.dto';

@Controller('cap')
export class CapController {
  constructor(private readonly capService: CapService) {}

  @Post('apply')
  apply(@Body() createCapApplicationDto: CreateCapApplicationDto) {
    return this.capService.apply(createCapApplicationDto);
  }

  @Get('status/:userId')
  getStatus(@Param('userId') userId: string) {
    return this.capService.getStatus(userId);
  }

  @Get('applications')
  getAllApplications() {
    return this.capService.getAllApplications();
  }

  @Get('analytics/admin')
  getAnalytics() {
    return this.capService.getAnalytics();
  }

  @Patch(':id')
  updateStatus(
    @Param('id') id: string,
    @Body() updateCapStatusDto: UpdateCapStatusDto,
  ) {
    return this.capService.updateStatus(id, updateCapStatusDto);
  }
}