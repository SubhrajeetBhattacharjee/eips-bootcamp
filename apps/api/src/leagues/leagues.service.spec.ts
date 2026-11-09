import { Test, TestingModule } from '@nestjs/testing';
import {
  LeaguesService,
  getWeekTimeInfo,
  COHORT_CAPACITY,
} from './leagues.service';
import { PrismaService } from '../prisma/prisma.service';
import { LeagueTier } from '@prisma/client';

describe('LeaguesService', () => {
  let service: LeaguesService;
  let prisma: {
    weeklyLeague: {
      findMany: jest.Mock;
      findFirst: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
    };
    leagueMember: {
      findFirst: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
    };
    user: {
      findUnique: jest.Mock;
      update: jest.Mock;
    };
  };

  beforeEach(async () => {
    prisma = {
      weeklyLeague: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      leagueMember: {
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      user: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LeaguesService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    service = module.get<LeaguesService>(LeaguesService);
  });

  describe('getWeekTimeInfo', () => {
    it('should calculate valid week info with positive remaining seconds', () => {
      const info = getWeekTimeInfo();
      expect(info.weekNumber).toBeGreaterThan(0);
      expect(info.year).toBeGreaterThanOrEqual(2025);
      expect(info.startDate.getUTCDay()).toBe(1); // Monday in UTC
      expect(info.endDate.getUTCDay()).toBe(0); // Sunday in UTC
    });
  });

  describe('getNextTier / getPrevTier', () => {
    it('should promote Bronze to Silver, and Gold to Platinum', () => {
      expect(service.getNextTier(LeagueTier.BRONZE)).toBe(LeagueTier.SILVER);
      expect(service.getNextTier(LeagueTier.GOLD)).toBe(LeagueTier.PLATINUM);
      expect(service.getNextTier(LeagueTier.MASTER)).toBe(LeagueTier.MASTER);
    });

    it('should demote Gold to Silver, and keep Bronze at Bronze', () => {
      expect(service.getPrevTier(LeagueTier.GOLD)).toBe(LeagueTier.SILVER);
      expect(service.getPrevTier(LeagueTier.BRONZE)).toBe(LeagueTier.BRONZE);
    });
  });

  describe('recordUserXp', () => {
    it('should increment weekly XP if member already exists in active cohort', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        currentLeagueTier: LeagueTier.BRONZE,
      });

      prisma.leagueMember.findFirst.mockResolvedValue({
        id: 'member-1',
        weeklyXp: 100,
      });

      prisma.leagueMember.update.mockResolvedValue({
        id: 'member-1',
        weeklyXp: 150,
      });

      const res = await service.recordUserXp('user-1', 50);

      expect(prisma.leagueMember.update).toHaveBeenCalledWith({
        where: { id: 'member-1' },
        data: { weeklyXp: { increment: 50 } },
      });
      expect(res?.weeklyXp).toBe(150);
    });

    it('should assign user to active cohort if not yet joined this week', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        currentLeagueTier: LeagueTier.BRONZE,
      });

      prisma.leagueMember.findFirst.mockResolvedValue(null);

      // Existing cohort with 5 members (has space)
      prisma.weeklyLeague.findMany.mockResolvedValue([
        {
          id: 'league-1',
          tier: LeagueTier.BRONZE,
          cohortIndex: 1,
          _count: { members: 5 },
        },
      ]);

      prisma.leagueMember.create.mockResolvedValue({
        id: 'member-new',
        leagueId: 'league-1',
        userId: 'user-1',
        weeklyXp: 50,
      });

      const res = await service.recordUserXp('user-1', 50);

      expect(prisma.leagueMember.create).toHaveBeenCalledWith({
        data: {
          leagueId: 'league-1',
          userId: 'user-1',
          weeklyXp: 50,
        },
      });
      expect(res?.id).toBe('member-new');
    });
  });

  describe('getUserCurrentLeague', () => {
    it('should indicate user has not joined if no member record exists yet', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        currentLeagueTier: LeagueTier.GOLD,
      });

      prisma.leagueMember.findFirst.mockResolvedValue(null);

      const res = await service.getUserCurrentLeague('user-1');

      expect(res.hasJoinedThisWeek).toBe(false);
      expect(res.tier).toBe(LeagueTier.GOLD);
      expect(res.standings).toEqual([]);
    });

    it('should partition members into PROMOTION, SAFE, and DEMOTION zones', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        currentLeagueTier: LeagueTier.SILVER,
      });

      // 10 members: top 2 promo, bottom 2 demo
      const members = Array.from({ length: 10 }, (_, i) => ({
        id: `m-${i + 1}`,
        userId: `user-${i + 1}`,
        weeklyXp: (10 - i) * 100,
        user: {
          name: `User ${i + 1}`,
          username: `user${i + 1}`,
          email: `user${i + 1}@eth.edu`,
          profile: { fullName: `User ${i + 1}`, avatarUrl: null },
        },
      }));

      prisma.leagueMember.findFirst.mockResolvedValue({
        id: 'm-1',
        userId: 'user-1',
        weeklyXp: 1000,
        league: {
          id: 'league-silver-1',
          tier: LeagueTier.SILVER,
          cohortIndex: 1,
          members,
        },
      });

      const res = await service.getUserCurrentLeague('user-1');

      expect(res.hasJoinedThisWeek).toBe(true);
      expect(res.userRank).toBe(1);
      expect(res.standings[0].zone).toBe('PROMOTION');
      expect(res.standings[1].zone).toBe('PROMOTION');
      expect(res.standings[4].zone).toBe('SAFE');
      expect(res.standings[9].zone).toBe('DEMOTION');
    });
  });

  describe('rolloverWeeklyLeagues', () => {
    it('should promote top rankers and update User currentLeagueTier', async () => {
      const expiredLeagues = [
        {
          id: 'exp-1',
          tier: LeagueTier.BRONZE,
          status: 'ACTIVE',
          members: [
            { id: 'm-1', userId: 'u-1', weeklyXp: 500 },
            { id: 'm-2', userId: 'u-2', weeklyXp: 100 },
          ],
        },
      ];

      prisma.weeklyLeague.findMany.mockResolvedValue(expiredLeagues);
      prisma.user.update.mockResolvedValue({});
      prisma.leagueMember.update.mockResolvedValue({});
      prisma.weeklyLeague.update.mockResolvedValue({});

      const summary = await service.rolloverWeeklyLeagues();

      expect(summary.leaguesFinalized).toBe(1);
      expect(summary.totalPromotions).toBe(1);
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'u-1' },
        data: { currentLeagueTier: LeagueTier.SILVER },
      });
    });
  });
});
