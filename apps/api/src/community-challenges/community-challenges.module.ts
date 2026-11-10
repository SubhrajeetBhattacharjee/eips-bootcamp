import { Module } from '@nestjs/common';
import { CommunityChallengesController } from './community-challenges.controller';
import { CommunityChallengesService } from './community-challenges.service';
import { PrismaModule } from '../prisma/prisma.module';
import { XpModule } from '../xp/xp.module';

@Module({
  imports: [PrismaModule, XpModule],
  controllers: [CommunityChallengesController],
  providers: [CommunityChallengesService],
  exports: [CommunityChallengesService],
})
export class CommunityChallengesModule {}
