import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { XpService } from '../xp/xp.service';
import { ChallengeCategory, ChallengeStatus } from '@prisma/client';

export interface SeedChallengeDef {
  slug: string;
  title: string;
  description: string;
  category: ChallengeCategory;
  targetCount: number;
  initialCount: number;
  minContribution: number;
  xpReward: number;
  rewardBadge: string;
  bannerImage: string;
  daysDuration: number;
}

export const DEFAULT_CHALLENGES: SeedChallengeDef[] = [
  {
    slug: 'eip-4844-blob-harvest',
    title: 'The Great Blob Harvest (EIP-4844)',
    description:
      'Collectively complete 1,000 Blob Space & L2 scaling lessons across the campus network to optimize rollup data availability.',
    category: ChallengeCategory.LEARNING,
    targetCount: 1000,
    initialCount: 680,
    minContribution: 1,
    xpReward: 150,
    rewardBadge: 'Blob Space Pioneer',
    bannerImage: '/badges/challenge-blobs.svg',
    daysDuration: 7,
  },
  {
    slug: 'zk-crucible-arena',
    title: 'Zero-Knowledge Crucible',
    description:
      'Solve 300 Arena contest problems and zk-SNARK verification challenges across all student builder chapters.',
    category: ChallengeCategory.COMPETITION,
    targetCount: 300,
    initialCount: 215,
    minContribution: 1,
    xpReward: 200,
    rewardBadge: 'ZK Synthesizer',
    bannerImage: '/badges/challenge-zk.svg',
    daysDuration: 14,
  },
  {
    slug: 'smart-contract-guild',
    title: 'Campus Smart Contract Guild',
    description:
      'Submit 150 Solidity smart contract exercises with verified gas optimization and security audits.',
    category: ChallengeCategory.ASSIGNMENT,
    targetCount: 150,
    initialCount: 95,
    minContribution: 1,
    xpReward: 250,
    rewardBadge: 'Gas Master Guild',
    bannerImage: '/badges/challenge-guild.svg',
    daysDuration: 21,
  },
];

@Injectable()
export class CommunityChallengesService implements OnModuleInit {
  private readonly logger = new Logger(CommunityChallengesService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly xpService: XpService,
  ) {}

  async onModuleInit() {
    await this.seedDefaultChallenges();
  }

  /**
   * Seed default challenges if the table is empty
   */
  async seedDefaultChallenges() {
    try {
      const count = await this.prisma.communityChallenge.count();
      if (count === 0) {
        this.logger.log('Seeding default community challenges...');
        const now = new Date();

        for (const item of DEFAULT_CHALLENGES) {
          const endDate = new Date(
            now.getTime() + item.daysDuration * 24 * 60 * 60 * 1000,
          );

          await this.prisma.communityChallenge.create({
            data: {
              slug: item.slug,
              title: item.title,
              description: item.description,
              category: item.category,
              targetCount: item.targetCount,
              currentCount: item.initialCount,
              minContribution: item.minContribution,
              xpReward: item.xpReward,
              rewardBadge: item.rewardBadge,
              bannerImage: item.bannerImage,
              status: ChallengeStatus.ACTIVE,
              startDate: now,
              endDate,
            },
          });
        }
        this.logger.log('Default community challenges seeded.');
      }
    } catch (err) {
      this.logger.error('Failed to seed default challenges:', err);
    }
  }

  /**
   * Synchronize challenges status based on counts and dates
   */
  async syncChallengesProgress() {
    const activeChallenges = await this.prisma.communityChallenge.findMany({
      where: { status: ChallengeStatus.ACTIVE },
    });

    const now = new Date();
    for (const ch of activeChallenges) {
      if (ch.currentCount >= ch.targetCount) {
        await this.prisma.communityChallenge.update({
          where: { id: ch.id },
          data: { status: ChallengeStatus.COMPLETED },
        });
      } else if (now > ch.endDate) {
        await this.prisma.communityChallenge.update({
          where: { id: ch.id },
          data: { status: ChallengeStatus.EXPIRED },
        });
      }
    }
  }

  /**
   * Get all community challenges with user-specific participation details
   */
  async getAllChallenges(userId?: string) {
    await this.syncChallengesProgress();

    const challenges = await this.prisma.communityChallenge.findMany({
      include: {
        participants: {
          take: 5,
          orderBy: { contributionCount: 'desc' },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                username: true,
                image: true,
              },
            },
          },
        },
        _count: {
          select: { participants: true },
        },
      },
      orderBy: [{ status: 'asc' }, { endDate: 'asc' }],
    });

    let userParticipations: Record<
      string,
      {
        isJoined: boolean;
        contributionCount: number;
        isClaimed: boolean;
        isEligibleToClaim: boolean;
      }
    > = {};

    if (userId) {
      const records = await this.prisma.communityChallengeParticipant.findMany({
        where: { userId },
      });

      for (const rec of records) {
        const ch = challenges.find((c) => c.id === rec.challengeId);
        const isEligible =
          ch?.status === ChallengeStatus.COMPLETED &&
          rec.contributionCount >= (ch?.minContribution || 1);

        userParticipations[rec.challengeId] = {
          isJoined: true,
          contributionCount: rec.contributionCount,
          isClaimed: rec.isClaimed,
          isEligibleToClaim: isEligible && !rec.isClaimed,
        };
      }
    }

    const now = new Date();
    const mapped = challenges.map((ch) => {
      const progressPercent = Math.min(
        100,
        Math.round((ch.currentCount / ch.targetCount) * 100),
      );
      const remainingSeconds = Math.max(
        0,
        Math.floor((ch.endDate.getTime() - now.getTime()) / 1000),
      );

      const userState = userParticipations[ch.id] || {
        isJoined: false,
        contributionCount: 0,
        isClaimed: false,
        isEligibleToClaim: false,
      };

      return {
        ...ch,
        progressPercent,
        remainingSeconds,
        participantsCount: ch._count.participants,
        userParticipation: userState,
        topContributors: ch.participants.map((p) => ({
          userId: p.user.id,
          name: p.user.name || p.user.username || 'Builder',
          image: p.user.image,
          contributionCount: p.contributionCount,
        })),
      };
    });

    const activeCount = mapped.filter((c) => c.status === ChallengeStatus.ACTIVE).length;
    const completedCount = mapped.filter((c) => c.status === ChallengeStatus.COMPLETED).length;

    return {
      challenges: mapped,
      stats: {
        total: mapped.length,
        active: activeCount,
        completed: completedCount,
      },
    };
  }

  /**
   * User joins a community challenge
   */
  async joinChallenge(userId: string, challengeId: string) {
    const challenge = await this.prisma.communityChallenge.findUnique({
      where: { id: challengeId },
    });

    if (!challenge) {
      throw new NotFoundException(`Challenge with ID ${challengeId} not found`);
    }

    if (challenge.status !== ChallengeStatus.ACTIVE) {
      throw new BadRequestException('Can only join active challenges');
    }

    const participant = await this.prisma.communityChallengeParticipant.upsert({
      where: {
        challengeId_userId: { challengeId, userId },
      },
      update: {},
      create: {
        challengeId,
        userId,
        contributionCount: 0,
        isClaimed: false,
      },
    });

    return participant;
  }

  /**
   * Records a user contribution towards an active challenge
   */
  async recordContribution(
    userId: string,
    category: ChallengeCategory,
    count: number = 1,
  ) {
    const activeChallenges = await this.prisma.communityChallenge.findMany({
      where: {
        category,
        status: ChallengeStatus.ACTIVE,
      },
    });

    for (const ch of activeChallenges) {
      // Upsert participant
      await this.prisma.communityChallengeParticipant.upsert({
        where: {
          challengeId_userId: { challengeId: ch.id, userId },
        },
        update: {
          contributionCount: { increment: count },
        },
        create: {
          challengeId: ch.id,
          userId,
          contributionCount: count,
          isClaimed: false,
        },
      });

      // Increment challenge total
      const updatedTotal = ch.currentCount + count;
      const isCompleted = updatedTotal >= ch.targetCount;

      await this.prisma.communityChallenge.update({
        where: { id: ch.id },
        data: {
          currentCount: updatedTotal,
          status: isCompleted ? ChallengeStatus.COMPLETED : ch.status,
        },
      });

      this.logger.log(
        `Recorded contribution of +${count} to challenge ${ch.title} by user ${userId}`,
      );
    }
  }

  /**
   * Claim XP reward for a completed community challenge
   */
  async claimChallengeReward(userId: string, challengeId: string) {
    const challenge = await this.prisma.communityChallenge.findUnique({
      where: { id: challengeId },
    });

    if (!challenge) {
      throw new NotFoundException(`Challenge with ID ${challengeId} not found`);
    }

    if (challenge.status !== ChallengeStatus.COMPLETED) {
      throw new BadRequestException('This challenge has not yet reached its completion goal');
    }

    const participant = await this.prisma.communityChallengeParticipant.findUnique({
      where: {
        challengeId_userId: { challengeId, userId },
      },
    });

    if (!participant) {
      throw new BadRequestException('You did not participate in this community challenge');
    }

    if (participant.contributionCount < challenge.minContribution) {
      throw new BadRequestException(
        `Minimum contribution of ${challenge.minContribution} is required to claim the community reward`,
      );
    }

    if (participant.isClaimed) {
      return participant;
    }

    // Award XP reward idempotently
    await this.xpService.awardXp({
      userId,
      amount: challenge.xpReward,
      reason: `Community Challenge Completed: ${challenge.title}`,
      category: 'ACHIEVEMENT',
      referenceId: `COMMUNITY-CHALLENGE-${challenge.id}-${userId}`,
    });

    const updated = await this.prisma.communityChallengeParticipant.update({
      where: { id: participant.id },
      data: {
        isClaimed: true,
        claimedAt: new Date(),
      },
    });

    this.logger.log(
      `User ${userId} claimed +${challenge.xpReward} XP for community challenge ${challenge.title}`,
    );

    return updated;
  }
}

