import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CertificateType, ParticipantStatus } from '@prisma/client';
import * as crypto from 'crypto';

@Injectable()
export class CertificatesService {
  private readonly logger = new Logger(CertificatesService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Helper to generate unique verified certificate number
   * e.g. ETHS-ARENA-EVMMAS-7A2F9B
   */
  private generateCertificateNumber(slug: string, userId: string): string {
    const cleanSlug = slug
      .replace(/[^a-zA-Z0-9]/g, '')
      .substring(0, 6)
      .toUpperCase();
    const hash = crypto
      .createHash('sha256')
      .update(`${slug}-${userId}-${Date.now()}`)
      .digest('hex')
      .substring(0, 6)
      .toUpperCase();

    return `ETHS-ARENA-${cleanSlug}-${hash}`;
  }

  /**
   * Determine certificate type based on score, totalPoints, and rank
   */
  private determineCertificateType(
    score: number,
    totalPoints: number,
    rank: number | null,
  ): CertificateType {
    if (rank === 1) {
      return CertificateType.CHAMPION;
    }
    if (rank !== null && rank <= 3) {
      return CertificateType.PODIUM;
    }
    const ratio = totalPoints > 0 ? score / totalPoints : 0;
    if (ratio >= 0.8) {
      return CertificateType.DISTINCTION;
    }
    return CertificateType.COMPLETION;
  }

  /**
   * Issue verified competition certificate for a participant
   */
  async issueCertificate(userId: string, competitionId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });
    if (!user) throw new NotFoundException('User not found');

    const comp = await this.prisma.competition.findUnique({
      where: { id: competitionId },
    });
    if (!comp) throw new NotFoundException('Competition not found');

    const participant = await this.prisma.competitionParticipant.findUnique({
      where: {
        competitionId_userId: { competitionId, userId },
      },
    });

    if (!participant || participant.status !== ParticipantStatus.SUBMITTED) {
      throw new BadRequestException(
        'Participant must complete and submit the competition before certificate issuance.',
      );
    }

    // Check if certificate already issued
    const existing = await this.prisma.competitionCertificate.findUnique({
      where: {
        userId_competitionId: { userId, competitionId },
      },
    });

    const certType = this.determineCertificateType(
      participant.score,
      comp.totalPoints,
      participant.rank,
    );

    const recipientName =
      user.profile?.fullName || user.name || user.username || 'Student Builder';

    if (existing) {
      // Refresh rank or type if changed
      return this.prisma.competitionCertificate.update({
        where: { id: existing.id },
        data: {
          score: participant.score,
          rank: participant.rank,
          timeTakenSeconds: participant.timeTakenSeconds,
          type: certType,
          recipientName,
        },
        include: { competition: true },
      });
    }

    const certificateNumber = this.generateCertificateNumber(comp.slug, userId);

    return this.prisma.competitionCertificate.create({
      data: {
        certificateNumber,
        userId,
        competitionId,
        type: certType,
        recipientName,
        title: comp.title,
        score: participant.score,
        totalPoints: comp.totalPoints,
        rank: participant.rank,
        timeTakenSeconds: participant.timeTakenSeconds,
        metadata: {
          difficulty: comp.difficulty,
          issuedBy: 'ETHShala Protocol Learning Committee',
          verificationStandard: 'EIP-ACADEMIC-V1',
        },
      },
      include: {
        competition: true,
      },
    });
  }

  /**
   * Get all certificates earned by a user (auto-issues for any completed competitions)
   */
  async getUserCertificates(userId: string) {
    // Auto-issue for any submitted competitions without a certificate record
    const submittedParticipations =
      await this.prisma.competitionParticipant.findMany({
        where: { userId, status: ParticipantStatus.SUBMITTED },
        select: { competitionId: true },
      });

    for (const p of submittedParticipations) {
      const existing = await this.prisma.competitionCertificate.findUnique({
        where: {
          userId_competitionId: {
            userId,
            competitionId: p.competitionId,
          },
        },
      });
      if (!existing) {
        try {
          await this.issueCertificate(userId, p.competitionId);
        } catch (err) {
          this.logger.warn(`Could not auto-issue certificate: ${err}`);
        }
      }
    }

    const certificates = await this.prisma.competitionCertificate.findMany({
      where: { userId },
      orderBy: { issuedAt: 'desc' },
      include: {
        competition: {
          select: {
            id: true,
            title: true,
            slug: true,
            difficulty: true,
            totalPoints: true,
            durationMinutes: true,
          },
        },
      },
    });

    return certificates.map((c) => ({
      id: c.id,
      certificateNumber: c.certificateNumber,
      type: c.type,
      recipientName: c.recipientName,
      title: c.title,
      score: c.score,
      totalPoints: c.totalPoints,
      rank: c.rank,
      timeTakenSeconds: c.timeTakenSeconds,
      issuedAt: c.issuedAt.toISOString(),
      competition: c.competition,
    }));
  }

  /**
   * Public verification endpoint by ID or certificate number
   */
  async getCertificateByIdOrNumber(idOrNumber: string) {
    const cert = await this.prisma.competitionCertificate.findFirst({
      where: {
        OR: [{ id: idOrNumber }, { certificateNumber: idOrNumber }],
      },
      include: {
        competition: {
          select: {
            id: true,
            title: true,
            slug: true,
            difficulty: true,
            totalPoints: true,
            durationMinutes: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
            walletAddress: true,
            profile: {
              select: {
                college: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });

    if (!cert) {
      throw new NotFoundException('Certificate not found or verification invalid.');
    }

    return {
      isValid: true,
      id: cert.id,
      certificateNumber: cert.certificateNumber,
      type: cert.type,
      recipientName: cert.recipientName,
      title: cert.title,
      score: cert.score,
      totalPoints: cert.totalPoints,
      rank: cert.rank,
      timeTakenSeconds: cert.timeTakenSeconds,
      issuedAt: cert.issuedAt.toISOString(),
      metadata: cert.metadata,
      issuer: {
        name: 'ETHShala Protocol Learning Committee',
        authority: 'Ethereum Protocol Educational Standards',
        network: 'Ethereum Mainnet & L2 Ecosystem',
      },
      competition: cert.competition,
      recipient: {
        username: cert.user.username,
        college: cert.user.profile?.college || 'Campus Chapter',
        walletAddress: cert.user.walletAddress || null,
      },
    };
  }
}
