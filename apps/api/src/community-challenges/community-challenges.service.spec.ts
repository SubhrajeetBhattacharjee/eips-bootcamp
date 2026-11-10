import { Test, TestingModule } from '@nestjs/testing';
import { CommunityChallengesService } from './community-challenges.service';
import { PrismaService } from '../prisma/prisma.service';
import { XpService } from '../xp/xp.service';
import { ChallengeStatus } from '@prisma/client';
import { BadRequestException } from '@nestjs/common';

describe('CommunityChallengesService', () => {
  let service: CommunityChallengesService;

  const mockPrisma = {
    communityChallenge: {
      count: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    communityChallengeParticipant: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      upsert: jest.fn(),
      update: jest.fn(),
    },
  };

  const mockXpService = {
    awardXp: jest.fn().mockResolvedValue({ success: true, amount: 150 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommunityChallengesService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: XpService, useValue: mockXpService },
      ],
    }).compile();

    service = module.get<CommunityChallengesService>(
      CommunityChallengesService,
    );
    jest.clearAllMocks();
  });

  describe('seedDefaultChallenges', () => {
    it('should seed default challenges when table count is 0', async () => {
      mockPrisma.communityChallenge.count.mockResolvedValue(0);
      mockPrisma.communityChallenge.create.mockImplementation(({ data }) =>
        Promise.resolve({ id: 'ch-1', ...data }),
      );

      await service.seedDefaultChallenges();

      expect(mockPrisma.communityChallenge.create).toHaveBeenCalledTimes(3);
    });

    it('should not seed if challenges already exist', async () => {
      mockPrisma.communityChallenge.count.mockResolvedValue(3);

      await service.seedDefaultChallenges();

      expect(mockPrisma.communityChallenge.create).not.toHaveBeenCalled();
    });
  });

  describe('joinChallenge', () => {
    it('should join active challenge', async () => {
      mockPrisma.communityChallenge.findUnique.mockResolvedValue({
        id: 'ch-1',
        status: ChallengeStatus.ACTIVE,
      });

      mockPrisma.communityChallengeParticipant.upsert.mockResolvedValue({
        id: 'p-1',
        challengeId: 'ch-1',
        userId: 'user-1',
        contributionCount: 0,
        isClaimed: false,
      });

      const res = await service.joinChallenge('user-1', 'ch-1');
      expect(res.userId).toBe('user-1');
      expect(
        mockPrisma.communityChallengeParticipant.upsert,
      ).toHaveBeenCalled();
    });

    it('should reject joining non-active challenge', async () => {
      mockPrisma.communityChallenge.findUnique.mockResolvedValue({
        id: 'ch-2',
        status: ChallengeStatus.COMPLETED,
      });

      await expect(service.joinChallenge('user-1', 'ch-2')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('claimChallengeReward', () => {
    it('should reject claim if challenge is not completed', async () => {
      mockPrisma.communityChallenge.findUnique.mockResolvedValue({
        id: 'ch-1',
        status: ChallengeStatus.ACTIVE,
      });

      await expect(
        service.claimChallengeReward('user-1', 'ch-1'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should reject claim if user has not met minimum contribution', async () => {
      mockPrisma.communityChallenge.findUnique.mockResolvedValue({
        id: 'ch-1',
        status: ChallengeStatus.COMPLETED,
        minContribution: 2,
        xpReward: 150,
      });

      mockPrisma.communityChallengeParticipant.findUnique.mockResolvedValue({
        id: 'p-1',
        challengeId: 'ch-1',
        userId: 'user-1',
        contributionCount: 1, // Below minContribution (2)
        isClaimed: false,
      });

      await expect(
        service.claimChallengeReward('user-1', 'ch-1'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should award XP and mark reward claimed when eligible', async () => {
      mockPrisma.communityChallenge.findUnique.mockResolvedValue({
        id: 'ch-1',
        title: 'Blob Space Mission',
        status: ChallengeStatus.COMPLETED,
        minContribution: 1,
        xpReward: 150,
      });

      mockPrisma.communityChallengeParticipant.findUnique.mockResolvedValue({
        id: 'p-1',
        challengeId: 'ch-1',
        userId: 'user-1',
        contributionCount: 5,
        isClaimed: false,
      });

      mockPrisma.communityChallengeParticipant.update.mockResolvedValue({
        id: 'p-1',
        isClaimed: true,
        claimedAt: new Date(),
      });

      const res = await service.claimChallengeReward('user-1', 'ch-1');

      expect(mockXpService.awardXp).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 'user-1',
          amount: 150,
          category: 'ACHIEVEMENT',
          referenceId: 'COMMUNITY-CHALLENGE-ch-1-user-1',
        }),
      );
      expect(res.isClaimed).toBe(true);
    });
  });
});
