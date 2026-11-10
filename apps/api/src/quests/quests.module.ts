import { Module } from '@nestjs/common';
import { QuestsController } from './quests.controller';
import { QuestsService } from './quests.service';
import { PrismaModule } from '../prisma/prisma.module';
import { XpModule } from '../xp/xp.module';

@Module({
  imports: [PrismaModule, XpModule],
  controllers: [QuestsController],
  providers: [QuestsService],
  exports: [QuestsService],
})
export class QuestsModule {}
