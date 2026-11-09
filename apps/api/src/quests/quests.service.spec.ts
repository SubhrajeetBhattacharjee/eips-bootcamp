import { Test, TestingModule } from '@nestjs/testing';
import { QuestsService, DEFAULT_DAILY_QUESTS } from './quests.service';
import { PrismaService } from '../prisma/prisma.service';
import { XpService } from '../xp/xp.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('QuestsService', () => {
  let service: QuestsService;

  const mockPrisma = {
    user: {
      findUnique: jest.fn(),
    },
    userDailyQuest: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    userStreak: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    lessonProgress: {
      count: jest.fn(),
    },
    xPTransaction: {
      findMany: jest.fn(),
      count: jest.fn(),
    },
    competitionParticipant: {
      count: jest.fn(),
    },
    assignmentSubmission: {
      count: jest.fn(),
    },
  };

  const mockXpService = {
    awardXp: jest.fn().mockResolvedValue({ success: true, amount: 30 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuestsService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: XpService, useValue: mockXpService },
      ],
    }).compile();

    service = module.get<QuestsService>(QuestsService);
    jest.clearAllMocks();
  });

  describe('getDailyQuests', () => {
    it('should generate default daily quests if none exist for today', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: 'user-1' });
      // First call returns empty, second call returns created quests
      mockPrisma.userDailyQuest.findMany
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce(
          DEFAULT_DAILY_QUESTS.map((q, idx) => ({
            id: `quest-${idx}`,
            userId: 'user-1',
            date: service.getTodayUtcDate(),
            ...q,
            currentCount: 0,
            isCompleted: false,
            isClaimed: false,
          })),
        )
        .mockResolvedValueOnce(
          DEFAULT_DAILY_QUESTS.map((q, idx) => ({
            id: `quest-${idx}`,
            userId: 'user-1',
            date: service.getTodayUtcDate(),
            ...q,
            currentCount: 0,
            isCompleted: false,
            isClaimed: false,
          })),
        );

      mockPrisma.lessonProgress.count.mockResolvedValue(0);
      mockPrisma.xPTransaction.findMany.mockResolvedValue([]);
      mockPrisma.competitionParticipant.count.mockResolvedValue(0);
      mockPrisma.assignmentSubmission.count.mockResolvedValue(0);

      const result = await service.getDailyQuests('user-1');

      expect(mockPrisma.userDailyQuest.create).toHaveBeenCalledTimes(3);
      expect(result.quests.length).toBe(3);
      expect(result.date).toBe(service.getTodayUtcDate());
      expect(result.resetInSeconds).toBeGreaterThan(0);
    });

    it('should sync lesson progress to complete DAILY_LESSON quest', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: 'user-1' });
      const initialQuests = [
        {
          id: 'quest-lesson',
          userId: 'user-1',
          date: service.getTodayUtcDate(),
          questKey: 'DAILY_LESSON',
          title: 'Daily Scholar',
          targetCount: 1,
          currentCount: 0,
          xpReward: 30,
          isCompleted: false,
          isClaimed: false,
        },
      ];

      mockPrisma.userDailyQuest.findMany
        .mockResolvedValueOnce(initialQuests)
        .mockResolvedValueOnce([
          {
            ...initialQuests[0],
            currentCount: 1,
            isCompleted: true,
          },
        ]);

      mockPrisma.lessonProgress.count.mockResolvedValue(2);
      mockPrisma.xPTransaction.findMany.mockResolvedValue([]);
      mockPrisma.competitionParticipant.count.mockResolvedValue(0);
      mockPrisma.assignmentSubmission.count.mockResolvedValue(0);

      await service.getDailyQuests('user-1');

      expect(mockPrisma.userDailyQuest.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'quest-lesson' },
          data: expect.objectContaining({
            currentCount: 1,
            isCompleted: true,
          }),
        }),
      );
    });
  });

  describe('claimQuestReward', () => {
    it('should reject claim if quest is not completed', async () => {
      mockPrisma.userDailyQuest.findUnique.mockResolvedValue({
        id: 'quest-1',
        userId: 'user-1',
        isCompleted: false,
        isClaimed: false,
      });

      await expect(service.claimQuestReward('user-1', 'quest-1')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should reject claim if not owned by user', async () => {
      mockPrisma.userDailyQuest.findUnique.mockResolvedValue({
        id: 'quest-1',
        userId: 'other-user',
        isCompleted: true,
        isClaimed: false,
      });

      await expect(service.claimQuestReward('user-1', 'quest-1')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should award XP and mark quest as claimed', async () => {
      mockPrisma.userDailyQuest.findUnique.mockResolvedValue({
        id: 'quest-1',
        userId: 'user-1',
        title: 'Daily Scholar',
        xpReward: 30,
        isCompleted: true,
        isClaimed: false,
      });

      mockPrisma.userDailyQuest.update.mockResolvedValue({
        id: 'quest-1',
        isClaimed: true,
        claimedAt: new Date(),
      });

      const result = await service.claimQuestReward('user-1', 'quest-1');

      expect(mockXpService.awardXp).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 'user-1',
          amount: 30,
          category: 'ACHIEVEMENT',
          referenceId: 'DAILY-QUEST-quest-1',
        }),
      );
      expect(result.isClaimed).toBe(true);
    });
  });

  describe('getUserStreak', () => {
    it('should initialize streak if none exists', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        streak: null,
        xpTransactions: [],
      });

      mockPrisma.xPTransaction.count.mockResolvedValue(1);
      mockPrisma.userStreak.create.mockImplementation(({ data }) =>
        Promise.resolve({ id: 'streak-1', ...data }),
      );

      const result = await service.getUserStreak('user-1');

      expect(result.currentStreak).toBe(1);
      expect(result.streakFreezesAvailable).toBe(1);
      expect(result.streakDays.length).toBe(7);
    });

    it('should increment streak when consecutive active day occurs', async () => {
      const now = new Date();
      const yesterday = new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 1, 0, 0, 0),
      );
      const yesterdayStr = yesterday.toISOString().slice(0, 10);

      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        streak: {
          currentStreak: 3,
          longestStreak: 5,
          lastActiveDate: yesterdayStr,
          streakFreezesAvailable: 1,
          streakFreezeUsedToday: false,
        },
        xpTransactions: [],
      });

      mockPrisma.xPTransaction.count.mockResolvedValue(1);
      mockPrisma.userStreak.update.mockResolvedValue({
        currentStreak: 4,
        longestStreak: 5,
        lastActiveDate: service.getTodayUtcDate(),
        streakFreezesAvailable: 1,
        streakFreezeUsedToday: false,
      });

      const result = await service.getUserStreak('user-1');

      expect(result.currentStreak).toBe(4);
      expect(mockPrisma.userStreak.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            currentStreak: 4,
            lastActiveDate: service.getTodayUtcDate(),
          }),
        }),
      );
    });
  });
});

