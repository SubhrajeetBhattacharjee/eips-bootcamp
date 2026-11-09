import { Module } from '@nestjs/common';
import { XpService } from './xp.service';
import { XpController } from './xp.controller';
import { LeaguesModule } from '../leagues/leagues.module';

@Module({
  imports: [LeaguesModule],
  controllers: [XpController],
  providers: [XpService],
  exports: [XpService],
})
export class XpModule {}
