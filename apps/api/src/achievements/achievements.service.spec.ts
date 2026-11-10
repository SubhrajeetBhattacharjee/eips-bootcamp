import { Test, TestingModule } from '@nestjs/testing';
import { AchievementsService } from './achievements.service';
import { PrismaService } from '../prisma/prisma.service';
import { XpService } from '../xp/xp.service';
import {
  AchievementCategory,
  AchievementRarity,
  LeagueTier,
} from '@prisma/client';

describe('AchievementsService', () => {
  let service: AchievementsService;

  const mockPrisma = {
    achievement: {
      count: jest.fn(),
      upsert: jest.fn(),
      findMany: jest.fn(),
    },
    userAchievement: {
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
    lessonProgress: {
      count: jest.fn(),
    },
    competitionParticipant: {
      count: jest.fn(),
    },
    leagueMember: {
      count: jest.fn(),
    },
  };

  const mockXpService = {
    awardXp: jest.fn().mockResolvedValue({ success: true, xpAwarded: 50 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AchievementsService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: XpService, useValue: mockXpService },
      ],
    }).compile();

    service = module.get<AchievementsService>(AchievementsService);
    jest.clearAllMocks();
  });

  describe('evaluateUserAchievements', () => {
    it('should unlock FIRST_LESSON and award XP when user completes 1 lesson', async () => {
      mockPrisma.achievement.count.mockResolvedValue(1);
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        role: 'STUDENT',
        currentLeagueTier: LeagueTier.BRONZE,
        referralCode: { referrals: [] },
      });

      mockPrisma.achievement.findMany.mockResolvedValue([
        {
          id: 'ach-1',
          code: 'FIRST_LESSON',
          title: 'Genesis Block',
          category: AchievementCategory.LEARNING,
          rarity: AchievementRarity.COMMON,
          icon: '🌱',
          xpReward: 50,
          maxProgress: 1,
        },
      ]);

      mockPrisma.userAchievement.findMany.mockResolvedValue([]);
      mockPrisma.lessonProgress.count.mockResolvedValue(1);
      mockPrisma.competitionParticipant.count.mockResolvedValue(0);
      mockPrisma.leagueMember.count.mockResolvedValue(0);

      const newlyUnlocked = await service.evaluateUserAchievements('user-1');

      expect(newlyUnlocked).toHaveLength(1);
      expect(newlyUnlocked[0].code).toBe('FIRST_LESSON');
      expect(mockPrisma.userAchievement.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: 'user-1',
          achievementId: 'ach-1',
          isUnlocked: true,
          progress: 1,
        }),
      });
      expect(mockXpService.awardXp).toHaveBeenCalledWith({
        userId: 'user-1',
        amount: 50,
        reason: 'Achievement Unlocked: Genesis Block',
        category: 'ACHIEVEMENT',
        referenceId: 'ACHIEVEMENT_FIRST_LESSON',
      });
    });

    it('should not award XP again if achievement is already unlocked', async () => {
      mockPrisma.achievement.count.mockResolvedValue(1);
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        role: 'STUDENT',
        currentLeagueTier: LeagueTier.BRONZE,
        referralCode: { referrals: [] },
      });

      mockPrisma.achievement.findMany.mockResolvedValue([
        {
          id: 'ach-1',
          code: 'FIRST_LESSON',
          title: 'Genesis Block',
          category: AchievementCategory.LEARNING,
          rarity: AchievementRarity.COMMON,
          icon: '🌱',
          xpReward: 50,
          maxProgress: 1,
        },
      ]);

      mockPrisma.userAchievement.findMany.mockResolvedValue([
        {
          id: 'ua-1',
          userId: 'user-1',
          achievementId: 'ach-1',
          isUnlocked: true,
          progress: 1,
        },
      ]);
      mockPrisma.lessonProgress.count.mockResolvedValue(1);
      mockPrisma.competitionParticipant.count.mockResolvedValue(0);
      mockPrisma.leagueMember.count.mockResolvedValue(0);

      const newlyUnlocked = await service.evaluateUserAchievements('user-1');
      expect(newlyUnlocked).toHaveLength(0);
      expect(mockXpService.awardXp).not.toHaveBeenCalled();
    });
  });

  describe('getUserAchievements', () => {
    it('should return completion statistics and achievement cards', async () => {
      mockPrisma.achievement.count.mockResolvedValue(1);
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        role: 'STUDENT',
        currentLeagueTier: LeagueTier.BRONZE,
        referralCode: { referrals: [] },
      });

      mockPrisma.achievement.findMany.mockResolvedValue([
        {
          id: 'ach-1',
          code: 'FIRST_LESSON',
          title: 'Genesis Block',
          description: 'Desc',
          category: AchievementCategory.LEARNING,
          rarity: AchievementRarity.COMMON,
          icon: '🌱',
          xpReward: 50,
          maxProgress: 1,
          users: [
            {
              id: 'ua-1',
              isUnlocked: true,
              progress: 1,
              unlockedAt: new Date(),
            },
          ],
        },
      ]);
      mockPrisma.userAchievement.findMany.mockResolvedValue([
        {
          id: 'ua-1',
          userId: 'user-1',
          achievementId: 'ach-1',
          isUnlocked: true,
          progress: 1,
        },
      ]);
      mockPrisma.lessonProgress.count.mockResolvedValue(1);
      mockPrisma.competitionParticipant.count.mockResolvedValue(0);
      mockPrisma.leagueMember.count.mockResolvedValue(0);

      const result = await service.getUserAchievements('user-1');
      expect(result.stats.totalUnlocked).toBe(1);
      expect(result.stats.totalAchievements).toBe(1);
      expect(result.stats.completionPercentage).toBe(100);
      expect(result.stats.totalXpFromAchievements).toBe(50);
      expect(result.achievements[0].isUnlocked).toBe(true);
    });
  });
});
