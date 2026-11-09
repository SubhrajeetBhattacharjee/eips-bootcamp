import { Module } from '@nestjs/common';
import { NftRewardsController } from './nft-rewards.controller';
import { NftRewardsService } from './nft-rewards.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [NftRewardsController],
  providers: [NftRewardsService],
  exports: [NftRewardsService],
})
export class NftRewardsModule {}

