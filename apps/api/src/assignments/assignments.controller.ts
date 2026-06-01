import { Controller, Get, Post, Body, Param, NotFoundException } from '@nestjs/common';
import { AssignmentsService } from './assignments.service';

@Controller('assignments')
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Get(':userId')
  async getAssignments(@Param('userId') userId: string) {
    return this.assignmentsService.getAssignmentsForUser(userId);
  }

  @Post(':id/submit')
  async submitAssignment(
    @Param('id') assignmentId: string,
    @Body('userId') userId: string,
    @Body('content') content: string
  ) {
    if (!userId) {
      throw new NotFoundException('User ID required');
    }
    return this.assignmentsService.submitAssignment(userId, assignmentId, content);
  }
}
