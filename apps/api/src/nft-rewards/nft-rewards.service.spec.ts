import { Test, TestingModule } from '@nestjs/testing';
import { NftRewardsService } from './nft-rewards.service';
import { PrismaService } from '../prisma/prisma.service';
import {
  NftRewardType,
  NftRewardStatus,
  ParticipantStatus,
  LeagueTier,
} from '@prisma/client';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('NftRewardsService', () => {
  let service: NftRewardsService;

  const mockPrisma = {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    nftReward: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NftRewardsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<NftRewardsService>(NftRewardsService);
    jest.clearAllMocks();
  });

  describe('syncEligibleRewards', () => {
    it('should create ARENA_CHAMPION reward for rank 1 and PODIUM_FINISHER for rank 2', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        currentLeagueTier: LeagueTier.BRONZE,
        competitionParticipations: [
          {
            competitionId: 'comp-1',
            rank: 1,
            status: ParticipantStatus.SUBMITTED,
            competition: { id: 'comp-1', title: 'EVM Gas Arena' },
          },
          {
            competitionId: 'comp-2',
            rank: 2,
            status: ParticipantStatus.SUBMITTED,
            competition: { id: 'comp-2', title: 'Solidity Security' },
          },
        ],
        competitionCertificates: [],
        xpTransactions: [],
      });

      mockPrisma.nftReward.findMany.mockResolvedValue([]);
      mockPrisma.nftReward.create.mockImplementation(({ data }) =>
        Promise.resolve({ id: 'reward-1', ...data }),
      );

      await service.syncEligibleRewards('user-1');

      expect(mockPrisma.nftReward.create).toHaveBeenCalledTimes(2);
      expect(mockPrisma.nftReward.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            userId: 'user-1',
            type: NftRewardType.ARENA_CHAMPION,
            tier: 'MYTHIC',
            competitionId: 'comp-1',
          }),
        }),
      );
      expect(mockPrisma.nftReward.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            userId: 'user-1',
            type: NftRewardType.PODIUM_FINISHER,
            tier: 'LEGENDARY',
            competitionId: 'comp-2',
          }),
        }),
      );
    });

    it('should create DIVISION_TITAN reward for Master league tier', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user-2',
        currentLeagueTier: LeagueTier.MASTER,
        competitionParticipations: [],
        competitionCertificates: [],
        xpTransactions: [],
      });

      mockPrisma.nftReward.findMany.mockResolvedValue([]);
      mockPrisma.nftReward.create.mockImplementation(({ data }) =>
        Promise.resolve({ id: 'reward-2', ...data }),
      );

      await service.syncEligibleRewards('user-2');

      expect(mockPrisma.nftReward.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            userId: 'user-2',
            type: NftRewardType.DIVISION_TITAN,
            tier: 'MYTHIC',
          }),
        }),
      );
    });

    it('should not recreate reward if already exists', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user-3',
        currentLeagueTier: LeagueTier.BRONZE,
        competitionParticipations: [
          {
            competitionId: 'comp-1',
            rank: 1,
            status: ParticipantStatus.SUBMITTED,
            competition: { id: 'comp-1', title: 'EVM Gas Arena' },
          },
        ],
        competitionCertificates: [],
        xpTransactions: [],
      });

      mockPrisma.nftReward.findMany.mockResolvedValue([
        {
          id: 'existing-1',
          type: NftRewardType.ARENA_CHAMPION,
          competitionId: 'comp-1',
        },
      ]);

      await service.syncEligibleRewards('user-3');

      expect(mockPrisma.nftReward.create).not.toHaveBeenCalled();
    });
  });

  describe('claimReward', () => {
    it('should reject invalid wallet address', async () => {
      await expect(
        service.claimReward('user-1', 'reward-1', 'invalid-wallet'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should reject unauthorized user claim', async () => {
      mockPrisma.nftReward.findUnique.mockResolvedValue({
        id: 'reward-1',
        userId: 'other-user',
        status: NftRewardStatus.ELIGIBLE,
      });

      await expect(
        service.claimReward(
          'user-1',
          'reward-1',
          '0x71C84183267ab555453504151B1E6B74447c728c',
        ),
      ).rejects.toThrow(BadRequestException);
    });

    it('should mint reward and store ERC-721 metadata and tx hash', async () => {
      const validWallet = '0x71C84183267ab555453504151B1E6B74447c728c';
      mockPrisma.nftReward.findUnique.mockResolvedValue({
        id: 'reward-1',
        userId: 'user-1',
        title: 'EVM Gas Grand Champion NFT',
        description: 'Verifiable Champion NFT',
        badgeImage: '/badges/nft-champion.svg',
        type: NftRewardType.ARENA_CHAMPION,
        tier: 'MYTHIC',
        status: NftRewardStatus.ELIGIBLE,
        competitionId: 'comp-1',
        user: { id: 'user-1', name: 'Satoshi Builder', walletAddress: null },
        competition: { title: 'EVM Gas Arena' },
      });

      mockPrisma.user.update.mockResolvedValue({ id: 'user-1', walletAddress: validWallet });
      mockPrisma.nftReward.update.mockImplementation(({ data }) =>
        Promise.resolve({
          id: 'reward-1',
          ...data,
        }),
      );

      const result = await service.claimReward('user-1', 'reward-1', validWallet);

      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        data: { walletAddress: validWallet },
      });
      expect(mockPrisma.nftReward.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'reward-1' },
          data: expect.objectContaining({
            status: NftRewardStatus.MINTED,
            walletAddress: validWallet,
            tokenId: expect.any(String),
            txHash: expect.stringMatching(/^0x[a-f0-9]{64}$/),
            claimedAt: expect.any(Date),
            metadata: expect.objectContaining({
              name: 'EVM Gas Grand Champion NFT',
            }),
          }),
        }),
      );
      expect(result.status).toBe(NftRewardStatus.MINTED);
    });
  });

  describe('getRewardById', () => {
    it('should throw NotFoundException if reward does not exist', async () => {
      mockPrisma.nftReward.findUnique.mockResolvedValue(null);

      await expect(service.getRewardById('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
