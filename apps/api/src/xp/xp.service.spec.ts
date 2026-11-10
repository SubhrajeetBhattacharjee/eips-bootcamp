import { Test, TestingModule } from '@nestjs/testing';
import { XpService, calculateLevel } from './xp.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('XpService & Level Calculation', () => {
  let service: XpService;
  let prisma: {
    user: { findUnique: jest.Mock };
    xPTransaction: {
      findUnique: jest.Mock;
      create: jest.Mock;
      aggregate: jest.Mock;
      groupBy: jest.Mock;
      findMany: jest.Mock;
      count: jest.Mock;
    };
  };

  beforeEach(async () => {
    prisma = {
      user: { findUnique: jest.fn() },
      xPTransaction: {
        findUnique: jest.fn(),
        create: jest.fn(),
        aggregate: jest.fn(),
        groupBy: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        XpService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    service = module.get<XpService>(XpService);
  });

  describe('calculateLevel', () => {
    it('should return level 1 for 0 XP', () => {
      const info = calculateLevel(0);
      expect(info.level).toBe(1);
      expect(info.title).toBe('Novice Builder');
      expect(info.progressPercent).toBe(0);
    });

    it('should calculate level 2 at 300 XP', () => {
      const info = calculateLevel(300);
      expect(info.level).toBe(2);
      expect(info.title).toBe('Apprentice Coder');
    });

    it('should calculate level 5 for 3000 XP', () => {
      const info = calculateLevel(3000);
      expect(info.level).toBe(5);
      expect(info.title).toBe('Core Contributor');
    });
  });

  describe('awardXp', () => {
    it('should throw NotFoundException if user does not exist', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.awardXp({
          userId: 'non-existent',
          amount: 100,
          reason: 'Test',
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should award XP normally and create an XPTransaction', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'user-1' });
      prisma.xPTransaction.create.mockResolvedValue({
        id: 'tx-1',
        userId: 'user-1',
        amount: 100,
        reason: 'Lesson complete',
        category: 'LESSON',
        referenceId: 'lesson-1',
      });

      const result = await service.awardXp({
        userId: 'user-1',
        amount: 100,
        reason: 'Lesson complete',
        category: 'LESSON',
        referenceId: 'lesson-1',
      });

      expect(result.success).toBe(true);
      expect(result.alreadyAwarded).toBe(false);
      expect(result.xpAwarded).toBe(100);
      expect(prisma.xPTransaction.create).toHaveBeenCalledWith({
        data: {
          userId: 'user-1',
          amount: 100,
          reason: 'Lesson complete',
          category: 'LESSON',
          referenceId: 'lesson-1',
        },
      });
    });

    it('should apply multiplier boost correctly (e.g. 1.5x streak)', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'user-1' });
      prisma.xPTransaction.create.mockImplementation(({ data }) =>
        Promise.resolve({ id: 'tx-1', ...data }),
      );

      const result = await service.awardXp({
        userId: 'user-1',
        amount: 100,
        reason: 'Lesson complete',
        multiplier: 1.5,
      });

      expect(result.xpAwarded).toBe(150);
    });

    it('should prevent duplicate awarding if referenceId already exists', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'user-1' });
      prisma.xPTransaction.findUnique.mockResolvedValue({
        id: 'tx-existing',
        userId: 'user-1',
        referenceId: 'lesson-1',
        amount: 100,
      });

      const result = await service.awardXp({
        userId: 'user-1',
        amount: 100,
        reason: 'Repeat lesson complete',
        referenceId: 'lesson-1',
      });

      expect(result.success).toBe(true);
      expect(result.alreadyAwarded).toBe(true);
      expect(result.xpAwarded).toBe(0);
      expect(prisma.xPTransaction.create).not.toHaveBeenCalled();
    });
  });

  describe('getUserXp', () => {
    it('should return aggregated XP, level info, and category breakdown', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'user-1' });
      prisma.xPTransaction.aggregate.mockResolvedValue({
        _sum: { amount: 1250 },
      });
      prisma.xPTransaction.groupBy.mockResolvedValue([
        { category: 'LESSON', _sum: { amount: 500 } },
        { category: 'ASSIGNMENT', _sum: { amount: 750 } },
      ]);
      prisma.xPTransaction.findMany.mockResolvedValue([]);

      const result = await service.getUserXp('user-1');

      expect(result.totalXp).toBe(1250);
      expect(result.levelInfo.level).toBe(4);
      expect(result.categoryBreakdown).toEqual({
        LESSON: 500,
        ASSIGNMENT: 750,
      });
    });
  });
});
