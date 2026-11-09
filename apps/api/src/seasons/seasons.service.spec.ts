import { Test, TestingModule } from '@nestjs/testing';
import { SeasonsService } from './seasons.service';
import { PrismaService } from '../prisma/prisma.service';
import { XpService } from '../xp/xp.service';
import { SeasonStatus } from '@prisma/client';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('SeasonsService', () => {
  let service: SeasonsService;

  const mockPrisma = {
    season: {
      count: jest.fn(),
      create: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
    seasonUserSnapshot: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    user: {
      findMany: jest.fn(),
    },
  };

  const mockXpService = {
    awardXp: jest.fn().mockResolvedValue({ success: true, amount: 500 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SeasonsService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: XpService, useValue: mockXpService },
      ],
    }).compile();

    service = module.get<SeasonsService>(SeasonsService);
    jest.clearAllMocks();
  });

  describe('seedDefaultSeasons', () => {
    it('should seed default seasons if table count is 0', async () => {
      mockPrisma.season.count.mockResolvedValue(0);
      mockPrisma.season.create.mockImplementation(({ data }) =>
        Promise.resolve({ id: 's-1', ...data }),
      );

      await service.seedDefaultSeasons();

      expect(mockPrisma.season.create).toHaveBeenCalledTimes(3);
    });

    it('should skip seeding if seasons exist', async () => {
      mockPrisma.season.count.mockResolvedValue(3);

      await service.seedDefaultSeasons();

      expect(mockPrisma.season.create).not.toHaveBeenCalled();
    });
  });

  describe('getCurrentSeason', () => {
    it('should return active season details and compute live leaderboard', async () => {
      const now = new Date();
      mockPrisma.season.findFirst.mockResolvedValue({
        id: 'season-alpha-id',
        slug: 'season-alpha',
        name: 'Season Alpha: Protocol Renaissance',
        status: SeasonStatus.ACTIVE,
        startDate: new Date(now.getTime() - 1000000),
        endDate: new Date(now.getTime() + 1000000),
      });

      mockPrisma.season.findUnique.mockResolvedValue({
        id: 'season-alpha-id',
        slug: 'season-alpha',
        name: 'Season Alpha: Protocol Renaissance',
        status: SeasonStatus.ACTIVE,
        startDate: new Date(now.getTime() - 1000000),
        endDate: new Date(now.getTime() + 1000000),
      });

      mockPrisma.seasonUserSnapshot.findMany.mockResolvedValue([]);
      mockPrisma.user.findMany.mockResolvedValue([
        {
          id: 'user-1',
          name: 'Vitalik Builder',
          username: 'vitalikb',
          image: null,
          xpTransactions: [{ amount: 400 }, { amount: 350 }],
          competitionParticipations: [{ id: 'p-1' }],
        },
        {
          id: 'user-2',
          name: 'Satoshi Coder',
          username: 'satoshic',
          image: null,
          xpTransactions: [{ amount: 500 }],
          competitionParticipations: [],
        },
      ]);

      const result = await service.getCurrentSeason('user-1');

      expect(result.season.slug).toBe('season-alpha');
      expect(result.leaderboard.length).toBe(2);
      expect(result.leaderboard[0].userId).toBe('user-1'); // 750 seasonal XP > 500 seasonal XP
      expect(result.leaderboard[0].rank).toBe(1);
      expect(result.leaderboard[0].tier).toBe('GRAND_CHAMPION');
      expect(result.currentUserStanding?.rank).toBe(1);
    });
  });

  describe('claimSeasonReward', () => {
    it('should reject claim if season is not concluded', async () => {
      const future = new Date(Date.now() + 1000000);
      mockPrisma.season.findUnique.mockResolvedValue({
        id: 'season-alpha-id',
        status: SeasonStatus.ACTIVE,
        endDate: future,
      });

      await expect(
        service.claimSeasonReward('user-1', 'season-alpha-id'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should award XP and mark snapshot claimed if concluded', async () => {
      const past = new Date(Date.now() - 1000000);
      mockPrisma.season.findUnique.mockResolvedValue({
        id: 'season-0-id',
        name: 'Season 0',
        status: SeasonStatus.ARCHIVED,
        endDate: past,
      });

      mockPrisma.seasonUserSnapshot.findUnique.mockResolvedValue({
        id: 'snap-1',
        seasonId: 'season-0-id',
        userId: 'user-1',
        rank: 2,
        rewardClaimed: false,
      });

      mockPrisma.seasonUserSnapshot.update.mockResolvedValue({
        id: 'snap-1',
        rewardClaimed: true,
        rewardXp: 500,
      });

      const res = await service.claimSeasonReward('user-1', 'season-0-id');

      expect(mockXpService.awardXp).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 'user-1',
          amount: 500,
          category: 'ACHIEVEMENT',
          referenceId: 'SEASON-REWARD-season-0-id-user-1',
        }),
      );
      expect(res.rewardClaimed).toBe(true);
    });
  });
});

