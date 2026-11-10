import { Test, TestingModule } from '@nestjs/testing';
import { CertificatesService } from './certificates.service';
import { PrismaService } from '../prisma/prisma.service';
import { CertificateType, ParticipantStatus } from '@prisma/client';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('CertificatesService', () => {
  let service: CertificatesService;

  const mockPrisma = {
    user: {
      findUnique: jest.fn(),
    },
    competition: {
      findUnique: jest.fn(),
    },
    competitionParticipant: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
    competitionCertificate: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CertificatesService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<CertificatesService>(CertificatesService);
    jest.clearAllMocks();
  });

  describe('issueCertificate', () => {
    it('should reject issuance if participant has not submitted', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: 'user-1' });
      mockPrisma.competition.findUnique.mockResolvedValue({ id: 'comp-1' });
      mockPrisma.competitionParticipant.findUnique.mockResolvedValue({
        status: ParticipantStatus.IN_PROGRESS,
      });

      await expect(
        service.issueCertificate('user-1', 'comp-1'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should issue CHAMPION certificate when participant achieves rank 1', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        name: 'Vitalik Builder',
        username: 'vitalikb',
        profile: { fullName: 'Vitalik Builder' },
      });
      mockPrisma.competition.findUnique.mockResolvedValue({
        id: 'comp-1',
        title: 'Weekly Arena #1',
        slug: 'weekly-arena-1',
        totalPoints: 300,
        difficulty: 'INTERMEDIATE',
      });
      mockPrisma.competitionParticipant.findUnique.mockResolvedValue({
        userId: 'user-1',
        competitionId: 'comp-1',
        status: ParticipantStatus.SUBMITTED,
        score: 300,
        rank: 1,
        timeTakenSeconds: 600,
      });
      mockPrisma.competitionCertificate.findUnique.mockResolvedValue(null);
      mockPrisma.competitionCertificate.create.mockImplementation((args) =>
        Promise.resolve({ id: 'cert-1', ...args.data }),
      );

      const cert = await service.issueCertificate('user-1', 'comp-1');
      expect(cert.type).toBe(CertificateType.CHAMPION);
      expect(cert.recipientName).toBe('Vitalik Builder');
      expect(cert.certificateNumber).toMatch(/^ETHS-ARENA-WEEKLY-/);
      expect(cert.score).toBe(300);
      expect(cert.rank).toBe(1);
    });

    it('should issue PODIUM certificate when rank is 2 or 3', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user-2',
        username: 'silverbuilder',
      });
      mockPrisma.competition.findUnique.mockResolvedValue({
        id: 'comp-1',
        title: 'Weekly Arena #1',
        slug: 'weekly-arena-1',
        totalPoints: 300,
      });
      mockPrisma.competitionParticipant.findUnique.mockResolvedValue({
        userId: 'user-2',
        competitionId: 'comp-1',
        status: ParticipantStatus.SUBMITTED,
        score: 250,
        rank: 2,
        timeTakenSeconds: 700,
      });
      mockPrisma.competitionCertificate.findUnique.mockResolvedValue(null);
      mockPrisma.competitionCertificate.create.mockImplementation((args) =>
        Promise.resolve({ id: 'cert-2', ...args.data }),
      );

      const cert = await service.issueCertificate('user-2', 'comp-1');
      expect(cert.type).toBe(CertificateType.PODIUM);
    });

    it('should issue DISTINCTION certificate when score >= 80% outside podium', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user-4',
        username: 'sharpbuilder',
      });
      mockPrisma.competition.findUnique.mockResolvedValue({
        id: 'comp-1',
        title: 'Weekly Arena #1',
        slug: 'weekly-arena-1',
        totalPoints: 300,
      });
      mockPrisma.competitionParticipant.findUnique.mockResolvedValue({
        userId: 'user-4',
        competitionId: 'comp-1',
        status: ParticipantStatus.SUBMITTED,
        score: 270, // 90%
        rank: 5,
        timeTakenSeconds: 1200,
      });
      mockPrisma.competitionCertificate.findUnique.mockResolvedValue(null);
      mockPrisma.competitionCertificate.create.mockImplementation((args) =>
        Promise.resolve({ id: 'cert-4', ...args.data }),
      );

      const cert = await service.issueCertificate('user-4', 'comp-1');
      expect(cert.type).toBe(CertificateType.DISTINCTION);
    });
  });

  describe('getCertificateByIdOrNumber', () => {
    it('should return valid credential details for public verification', async () => {
      mockPrisma.competitionCertificate.findFirst.mockResolvedValue({
        id: 'cert-1',
        certificateNumber: 'ETHS-ARENA-TEST-123456',
        type: CertificateType.CHAMPION,
        recipientName: 'Vitalik Builder',
        title: 'Weekly Arena #1',
        score: 300,
        totalPoints: 300,
        rank: 1,
        timeTakenSeconds: 600,
        issuedAt: new Date('2026-11-08T12:00:00Z'),
        metadata: { issuedBy: 'ETHShala' },
        competition: { id: 'c1', title: 'Arena 1', slug: 'arena-1' },
        user: {
          id: 'u1',
          name: 'Vitalik',
          username: 'vitalikb',
          walletAddress: '0x123',
          profile: { college: 'ETH India Chapter', avatarUrl: null },
        },
      });

      const res = await service.getCertificateByIdOrNumber(
        'ETHS-ARENA-TEST-123456',
      );
      expect(res.isValid).toBe(true);
      expect(res.certificateNumber).toBe('ETHS-ARENA-TEST-123456');
      expect(res.recipient.college).toBe('ETH India Chapter');
      expect(res.issuer.name).toBe('ETHShala Protocol Learning Committee');
    });

    it('should throw NotFoundException if certificate does not exist', async () => {
      mockPrisma.competitionCertificate.findFirst.mockResolvedValue(null);
      await expect(
        service.getCertificateByIdOrNumber('NON-EXISTENT'),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
