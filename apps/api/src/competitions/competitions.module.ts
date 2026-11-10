import { Module } from '@nestjs/common';
import { CompetitionsService } from './competitions.service';
import { CompetitionsController } from './competitions.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { XpModule } from '../xp/xp.module';

@Module({
  imports: [PrismaModule, XpModule],
  controllers: [CompetitionsController],
  providers: [CompetitionsService],
  exports: [CompetitionsService],
})
export class CompetitionsModule {}
