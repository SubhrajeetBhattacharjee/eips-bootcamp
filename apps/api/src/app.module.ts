import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { ProfilesModule } from './profiles/profiles.module';
import { CapModule } from './cap/cap.module';
import { ReferralsModule } from './referrals/referrals.module';
import { AuthModule } from './auth/auth.module';
import { XpModule } from './xp/xp.module';
import { BootcampModule } from './bootcamp/bootcamp.module';
import { AssignmentsModule } from './assignments/assignments.module';
import { RewardsModule } from './rewards/rewards.module';
import { ApiKeyGuard } from './auth/api-key.guard';

@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100,
    }]),
    PrismaModule,
    UsersModule,
    ProfilesModule,
    CapModule,
    ReferralsModule,
    AuthModule,
    XpModule,
    BootcampModule,
    AssignmentsModule,
    RewardsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ApiKeyGuard,
    },
  ],
})
export class AppModule {}