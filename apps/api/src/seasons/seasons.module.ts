import { Module } from '@nestjs/common';
import { SeasonsController } from './seasons.controller';
import { SeasonsService } from './seasons.service';
import { PrismaModule } from '../prisma/prisma.module';
import { XpModule } from '../xp/xp.module';

@Module({
  imports: [PrismaModule, XpModule],
  controllers: [SeasonsController],
  providers: [SeasonsService],
  exports: [SeasonsService],
})
export class SeasonsModule {}

