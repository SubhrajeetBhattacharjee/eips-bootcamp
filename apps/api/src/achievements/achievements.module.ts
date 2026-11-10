import { Module } from '@nestjs/common';
import { AchievementsService } from './achievements.service';
import { AchievementsController } from './achievements.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { XpModule } from '../xp/xp.module';

@Module({
  imports: [PrismaModule, XpModule],
  controllers: [AchievementsController],
  providers: [AchievementsService],
  exports: [AchievementsService],
})
export class AchievementsModule {}
