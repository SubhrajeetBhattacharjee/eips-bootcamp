import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { XpService } from '../xp/xp.service';
import { SubmitCompetitionDto } from './dto/submit-competition.dto';
import {
  CompetitionStatus,
  CompetitionDifficulty,
  ParticipantStatus,
} from '@prisma/client';

@Injectable()
export class CompetitionsService {
  private readonly logger = new Logger(CompetitionsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly xpService: XpService,
  ) {}

  /**
   * Seed default competitions and challenges if database is empty
   */
  async seedDefaultCompetitions() {
    const count = await this.prisma.competition.count();
    if (count > 0) return;

    this.logger.log('Seeding initial weekly competitions...');

    const now = new Date();
    // Active competition: started 2 days ago, ends in 5 days
    const activeStart = new Date(now.getTime() - 2 * 24 * 3600 * 1000);
    const activeEnd = new Date(now.getTime() + 5 * 24 * 3600 * 1000);

    // Upcoming competition: starts in 6 days
    const upcomingStart = new Date(now.getTime() + 6 * 24 * 3600 * 1000);
    const upcomingEnd = new Date(now.getTime() + 13 * 24 * 3600 * 1000);

    // Past completed competition: ended 3 days ago
    const pastStart = new Date(now.getTime() - 10 * 24 * 3600 * 1000);
    const pastEnd = new Date(now.getTime() - 3 * 24 * 3600 * 1000);

    // 1. Active Arena #1
    await this.prisma.competition.create({
      data: {
        title: 'Weekly Arena #1: EVM Opcode Mastery & Gas Optimization',
        slug: 'weekly-arena-1-evm-gas-optimization',
        description:
          'Test your protocol engineering intuition on EIP-1559 base fees, EIP-1153 transient storage, and gas-efficient smart contract assembly.',
        difficulty: CompetitionDifficulty.INTERMEDIATE,
        status: CompetitionStatus.ACTIVE,
        startTime: activeStart,
        endTime: activeEnd,
        durationMinutes: 60,
        totalPoints: 300,
        xpReward: 250,
        rules:
          '1. Timed 60-minute window once started.\n2. No external assistance or AI code generation allowed.\n3. Tie-breaker is shortest completion time.',
        problems: {
          create: [
            {
              orderIndex: 1,
              title: 'EIP-1559 Base Fee Elasticity',
              type: 'MULTIPLE_CHOICE',
              points: 50,
              description:
                'Under EIP-1559, if the gas used in block N is exactly equal to the target gas limit (15,000,000 gas), what happens to the base fee for block N+1?',
              options: [
                { id: 'A', text: 'The base fee increases by 12.5%' },
                { id: 'B', text: 'The base fee remains unchanged' },
                { id: 'C', text: 'The base fee decreases by 12.5%' },
                { id: 'D', text: 'The base fee resets to the genesis minimum' },
              ],
              correctOption: 'B',
              explanation:
                'EIP-1559 adjusts the base fee dynamically based on whether actual gas used exceeds or falls short of the 15M target. When actual gas equals target gas, the base fee delta is zero, so it stays unchanged.',
            },
            {
              orderIndex: 2,
              title: 'Transient Storage (EIP-1153) Gas Semantics',
              type: 'MULTIPLE_CHOICE',
              points: 100,
              description:
                'How does EIP-1153 TSTORE opcode differ fundamentally from standard SSTORE regarding gas and lifespan?',
              codeSnippet: `// Cancun Hardfork: EIP-1153
assembly {
    tstore(0, 1) // Transient store
    sstore(0, 1) // State store
}`,
              options: [
                {
                  id: 'A',
                  text: 'TSTORE costs 100 gas and values are cleared at the end of the transaction',
                },
                {
                  id: 'B',
                  text: 'TSTORE costs 2,100 gas and values persist for exactly 256 blocks',
                },
                {
                  id: 'C',
                  text: 'TSTORE is only callable by block builders during block proposal',
                },
                {
                  id: 'D',
                  text: 'TSTORE refunds 100% of gas upon contract suicide',
                },
              ],
              correctOption: 'A',
              explanation:
                'EIP-1153 introduced TSTORE and TLOAD for transient storage. TSTORE costs a flat 100 gas (warm read/write) and its storage is completely cleared at the end of the transaction execution.',
            },
            {
              orderIndex: 3,
              title: 'ERC-4337 Bundler Validation & UserOperation Verification',
              type: 'MULTIPLE_CHOICE',
              points: 150,
              description:
                'During the ERC-4337 verification loop, why are smart accounts prohibited from accessing mutable environmental opcodes like TIMESTAMP, BLOCKHASH, or non-contract balance in validateUserOp?',
              options: [
                {
                  id: 'A',
                  text: 'Because ERC-4337 requires all accounts to be stateless EOAs',
                },
                {
                  id: 'B',
                  text: 'To prevent DoS attacks on bundlers where a valid UserOperation becomes invalid without state changes on-chain',
                },
                {
                  id: 'C',
                  text: 'Because the EVM cannot execute TIMESTAMP in view functions',
                },
                {
                  id: 'D',
                  text: 'Because paymasters only support fixed gas prices',
                },
              ],
              correctOption: 'B',
              explanation:
                'Bundlers simulate validateUserOp off-chain before submitting bundled transactions on-chain. If accounts could depend on unpredictable environment opcodes like TIMESTAMP or block variables, attackers could invalidate cached bundles without paying gas, exhausting bundler resources.',
            },
          ],
        },
      },
    });

    // 2. Upcoming Arena #2
    await this.prisma.competition.create({
      data: {
        title: 'Weekly Arena #2: Layer-2 Blobs & EIP-4844 Scaling',
        slug: 'weekly-arena-2-l2-blobs-eip-4844',
        description:
          'Deep dive into Proto-Danksharding, blob gas markets, KZG polynomial commitments, and rollup data availability.',
        difficulty: CompetitionDifficulty.ADVANCED,
        status: CompetitionStatus.UPCOMING,
        startTime: upcomingStart,
        endTime: upcomingEnd,
        durationMinutes: 60,
        totalPoints: 300,
        xpReward: 300,
        rules:
          '1. Timed 60-minute contest.\n2. Protocol questions and blob gas price calculation.\n3. Top 3 receive distinction honors.',
        problems: {
          create: [
            {
              orderIndex: 1,
              title: 'Blob Transaction Maximums',
              type: 'MULTIPLE_CHOICE',
              points: 100,
              description:
                'Under EIP-4844 (Cancun), what is the target and maximum number of 128 KB blobs per Ethereum block?',
              options: [
                { id: 'A', text: 'Target: 3 blobs, Maximum: 6 blobs' },
                { id: 'B', text: 'Target: 6 blobs, Maximum: 12 blobs' },
                { id: 'C', text: 'Target: 1 blob, Maximum: 2 blobs' },
                { id: 'D', text: 'Target: 8 blobs, Maximum: 16 blobs' },
              ],
              correctOption: 'A',
              explanation:
                'EIP-4844 set target blobs per block at 3 (~384 KB) and maximum at 6 (~768 KB) to balance node bandwidth and storage.',
            },
          ],
        },
      },
    });

    // 3. Completed Arena #0
    await this.prisma.competition.create({
      data: {
        title: 'Weekly Arena #0: Solidity Foundations & Memory Layout',
        slug: 'weekly-arena-0-solidity-foundations',
        description:
          'Introductory challenge covering storage slot packing, memory vs calldata, and ERC-20 invariants.',
        difficulty: CompetitionDifficulty.BEGINNER,
        status: CompetitionStatus.COMPLETED,
        startTime: pastStart,
        endTime: pastEnd,
        durationMinutes: 45,
        totalPoints: 200,
        xpReward: 150,
        rules: 'Standard competition rules.',
        problems: {
          create: [
            {
              orderIndex: 1,
              title: 'Solidity Storage Packing',
              type: 'MULTIPLE_CHOICE',
              points: 100,
              description:
                'How many 32-byte storage slots will the following Solidity contract occupy?\n\nuint128 a;\nuint64 b;\nuint64 c;\nuint256 d;',
              options: [
                { id: 'A', text: '4 storage slots' },
                { id: 'B', text: '2 storage slots' },
                { id: 'C', text: '3 storage slots' },
                { id: 'D', text: '1 storage slot' },
              ],
              correctOption: 'B',
              explanation:
                'uint128 (16B) + uint64 (8B) + uint64 (8B) = 32 bytes, which packs perfectly into Slot 0. uint256 d takes 32 bytes and occupies Slot 1. Total: 2 slots.',
            },
          ],
        },
      },
    });

    this.logger.log('Initial weekly competitions seeded successfully.');
  }

  /**
   * List all competitions with user participant context
   */
  async getCompetitions(userId?: string) {
    await this.seedDefaultCompetitions();

    // Auto-update statuses based on current time
    const now = new Date();

    const competitions = await this.prisma.competition.findMany({
      orderBy: [{ status: 'asc' }, { startTime: 'desc' }],
      include: {
        _count: {
          select: {
            problems: true,
            participants: true,
          },
        },
        participants: userId
          ? {
              where: { userId },
              select: {
                id: true,
                status: true,
                score: true,
                rank: true,
                registeredAt: true,
                startedAt: true,
                submittedAt: true,
                timeTakenSeconds: true,
                xpAwarded: true,
              },
            }
          : false,
      },
    });

    return competitions.map((comp) => {
      // Dynamic status calculation
      let computedStatus = comp.status;
      if (now < comp.startTime) {
        computedStatus = CompetitionStatus.UPCOMING;
      } else if (now >= comp.startTime && now <= comp.endTime) {
        computedStatus = CompetitionStatus.ACTIVE;
      } else {
        computedStatus = CompetitionStatus.COMPLETED;
      }

      const userParticipant =
        userId &&
        Array.isArray(comp.participants) &&
        comp.participants.length > 0
          ? comp.participants[0]
          : null;

      return {
        id: comp.id,
        title: comp.title,
        slug: comp.slug,
        description: comp.description,
        difficulty: comp.difficulty,
        status: computedStatus,
        startTime: comp.startTime.toISOString(),
        endTime: comp.endTime.toISOString(),
        durationMinutes: comp.durationMinutes,
        totalPoints: comp.totalPoints,
        xpReward: comp.xpReward,
        problemCount: comp._count.problems,
        participantCount: comp._count.participants,
        userParticipation: userParticipant
          ? {
              participantId: userParticipant.id,
              status: userParticipant.status,
              score: userParticipant.score,
              rank: userParticipant.rank,
              startedAt: userParticipant.startedAt?.toISOString() || null,
              submittedAt: userParticipant.submittedAt?.toISOString() || null,
              timeTakenSeconds: userParticipant.timeTakenSeconds,
              xpAwarded: userParticipant.xpAwarded,
              isRegistered: true,
              isSubmitted:
                userParticipant.status === ParticipantStatus.SUBMITTED,
              isInProgress:
                userParticipant.status === ParticipantStatus.IN_PROGRESS,
            }
          : {
              isRegistered: false,
              isSubmitted: false,
              isInProgress: false,
            },
      };
    });
  }

  /**
   * Get single competition details and problems
   */
  async getCompetitionById(idOrSlug: string, userId?: string) {
    await this.seedDefaultCompetitions();

    const comp = await this.prisma.competition.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
      include: {
        problems: {
          orderBy: { orderIndex: 'asc' },
        },
        _count: {
          select: { participants: true },
        },
      },
    });

    if (!comp) {
      throw new NotFoundException('Competition not found');
    }

    const participant = userId
      ? await this.prisma.competitionParticipant.findUnique({
          where: {
            competitionId_userId: { competitionId: comp.id, userId },
          },
          include: {
            submissions: true,
          },
        })
      : null;

    const isSubmitted = participant?.status === ParticipantStatus.SUBMITTED;
    const isCompleted = comp.status === CompetitionStatus.COMPLETED;

    // Sanitize problems: only reveal correctOption and explanation if participant has submitted OR competition is completed
    const sanitizedProblems = comp.problems.map((problem) => {
      const submission = participant?.submissions?.find(
        (s) => s.problemId === problem.id,
      );

      return {
        id: problem.id,
        title: problem.title,
        orderIndex: problem.orderIndex,
        description: problem.description,
        codeSnippet: problem.codeSnippet,
        type: problem.type,
        options: problem.options,
        points: problem.points,
        // Concealed during test:
        correctOption:
          isSubmitted || isCompleted ? problem.correctOption : undefined,
        explanation:
          isSubmitted || isCompleted ? problem.explanation : undefined,
        userSubmission: submission
          ? {
              answer: submission.answer,
              isCorrect:
                isSubmitted || isCompleted ? submission.isCorrect : undefined,
              scoreEarned:
                isSubmitted || isCompleted ? submission.scoreEarned : undefined,
            }
          : null,
      };
    });

    return {
      id: comp.id,
      title: comp.title,
      slug: comp.slug,
      description: comp.description,
      difficulty: comp.difficulty,
      status: comp.status,
      startTime: comp.startTime.toISOString(),
      endTime: comp.endTime.toISOString(),
      durationMinutes: comp.durationMinutes,
      totalPoints: comp.totalPoints,
      xpReward: comp.xpReward,
      rules: comp.rules,
      participantCount: comp._count.participants,
      problems: sanitizedProblems,
      userParticipation: participant
        ? {
            participantId: participant.id,
            status: participant.status,
            score: participant.score,
            rank: participant.rank,
            startedAt: participant.startedAt?.toISOString() || null,
            submittedAt: participant.submittedAt?.toISOString() || null,
            timeTakenSeconds: participant.timeTakenSeconds,
            xpAwarded: participant.xpAwarded,
            isRegistered: true,
            isSubmitted,
            isInProgress: participant.status === ParticipantStatus.IN_PROGRESS,
          }
        : {
            isRegistered: false,
            isSubmitted: false,
            isInProgress: false,
          },
    };
  }

  /**
   * Register a user for a competition
   */
  async registerForCompetition(competitionId: string, userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const comp = await this.prisma.competition.findUnique({
      where: { id: competitionId },
    });
    if (!comp) throw new NotFoundException('Competition not found');

    const existing = await this.prisma.competitionParticipant.findUnique({
      where: {
        competitionId_userId: { competitionId, userId },
      },
    });

    if (existing) {
      return {
        success: true,
        participant: existing,
        message: 'Already registered',
      };
    }

    const participant = await this.prisma.competitionParticipant.create({
      data: {
        competitionId,
        userId,
        status: ParticipantStatus.REGISTERED,
      },
    });

    return {
      success: true,
      participant,
      message: 'Successfully registered for weekly competition',
    };
  }

  /**
   * Start competition: sets startedAt timestamp and enters test window
   */
  async startCompetition(competitionId: string, userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const comp = await this.prisma.competition.findUnique({
      where: { id: competitionId },
    });
    if (!comp) throw new NotFoundException('Competition not found');

    let participant = await this.prisma.competitionParticipant.findUnique({
      where: { competitionId_userId: { competitionId, userId } },
    });

    if (!participant) {
      participant = await this.prisma.competitionParticipant.create({
        data: {
          competitionId,
          userId,
          status: ParticipantStatus.IN_PROGRESS,
          startedAt: new Date(),
        },
      });
    } else if (participant.status === ParticipantStatus.SUBMITTED) {
      throw new BadRequestException(
        'You have already submitted this competition.',
      );
    } else if (participant.status === ParticipantStatus.REGISTERED) {
      participant = await this.prisma.competitionParticipant.update({
        where: { id: participant.id },
        data: {
          status: ParticipantStatus.IN_PROGRESS,
          startedAt: new Date(),
        },
      });
    }

    return this.getCompetitionById(competitionId, userId);
  }

  /**
   * Submit complete contest: server-side grading, time calculation, XP award
   */
  async submitCompetition(competitionId: string, dto: SubmitCompetitionDto) {
    const { userId, answers } = dto;

    const comp = await this.prisma.competition.findUnique({
      where: { id: competitionId },
      include: {
        problems: true,
      },
    });
    if (!comp) throw new NotFoundException('Competition not found');

    const participant = await this.prisma.competitionParticipant.findUnique({
      where: { competitionId_userId: { competitionId, userId } },
    });
    if (!participant) {
      throw new BadRequestException(
        'Participant not found. Start the competition first.',
      );
    }
    if (participant.status === ParticipantStatus.SUBMITTED) {
      throw new ConflictException(
        'You have already submitted this competition.',
      );
    }

    const now = new Date();
    const startedAt = participant.startedAt || now;
    const timeTakenSeconds = Math.max(
      1,
      Math.round((now.getTime() - startedAt.getTime()) / 1000),
    );

    // Evaluate answers server-side
    let totalScore = 0;
    const problemResults: Array<{
      problemId: string;
      answer: string;
      correctOption: string;
      isCorrect: boolean;
      scoreEarned: number;
      explanation: string | null;
    }> = [];

    for (const problem of comp.problems) {
      const submittedAns = answers.find((a) => a.problemId === problem.id);
      const answerVal = submittedAns
        ? submittedAns.answer.trim().toUpperCase()
        : '';
      const isCorrect =
        answerVal.length > 0 &&
        answerVal === problem.correctOption.trim().toUpperCase();

      const scoreEarned = isCorrect ? problem.points : 0;
      totalScore += scoreEarned;

      // Upsert submission record
      await this.prisma.competitionSubmission.upsert({
        where: {
          participantId_problemId: {
            participantId: participant.id,
            problemId: problem.id,
          },
        },
        create: {
          participantId: participant.id,
          problemId: problem.id,
          answer: answerVal,
          isCorrect,
          scoreEarned,
          submittedAt: now,
        },
        update: {
          answer: answerVal,
          isCorrect,
          scoreEarned,
          submittedAt: now,
        },
      });

      problemResults.push({
        problemId: problem.id,
        answer: answerVal,
        correctOption: problem.correctOption,
        isCorrect,
        scoreEarned,
        explanation: problem.explanation,
      });
    }

    // Performance-based XP calculation (Minimum 50 XP for participation + score ratio)
    const scoreRatio = comp.totalPoints > 0 ? totalScore / comp.totalPoints : 0;
    const performanceXp = Math.round(comp.xpReward * scoreRatio);
    const totalXpAwarded = Math.max(50, performanceXp);

    // Update participant
    const updatedParticipant = await this.prisma.competitionParticipant.update({
      where: { id: participant.id },
      data: {
        status: ParticipantStatus.SUBMITTED,
        submittedAt: now,
        timeTakenSeconds,
        score: totalScore,
        xpAwarded: totalXpAwarded,
      },
    });

    // Award XP through centralized XpService (handles multiplier, level calculation, idempotency)
    await this.xpService.awardXp({
      userId,
      amount: totalXpAwarded,
      reason: `Completed ${comp.title}`,
      category: 'COMPETITION',
      referenceId: comp.id,
    });

    // Compute live rank in competition
    const higherRankCount = await this.prisma.competitionParticipant.count({
      where: {
        competitionId,
        status: ParticipantStatus.SUBMITTED,
        OR: [
          { score: { gt: totalScore } },
          {
            score: totalScore,
            timeTakenSeconds: { lt: timeTakenSeconds },
          },
        ],
      },
    });

    const userRank = higherRankCount + 1;
    await this.prisma.competitionParticipant.update({
      where: { id: participant.id },
      data: { rank: userRank },
    });

    return {
      success: true,
      participantId: updatedParticipant.id,
      score: totalScore,
      totalPoints: comp.totalPoints,
      rank: userRank,
      timeTakenSeconds,
      xpAwarded: totalXpAwarded,
      problemResults,
    };
  }

  /**
   * Get official competition leaderboard with tiebreaking (score DESC, time ASC)
   */
  async getCompetitionLeaderboard(idOrSlug: string, userId?: string) {
    await this.seedDefaultCompetitions();

    const comp = await this.prisma.competition.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
      include: {
        problems: {
          select: {
            id: true,
            title: true,
            orderIndex: true,
            points: true,
          },
          orderBy: { orderIndex: 'asc' },
        },
        _count: {
          select: {
            participants: true,
          },
        },
      },
    });

    if (!comp) {
      throw new NotFoundException('Competition not found');
    }

    const participants = await this.prisma.competitionParticipant.findMany({
      where: {
        competitionId: comp.id,
        status: ParticipantStatus.SUBMITTED,
      },
      orderBy: [
        { score: 'desc' },
        { timeTakenSeconds: 'asc' },
        { submittedAt: 'asc' },
      ],
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
            profile: {
              select: {
                fullName: true,
                college: true,
                avatarUrl: true,
              },
            },
          },
        },
        submissions: {
          select: {
            problemId: true,
            scoreEarned: true,
            isCorrect: true,
          },
        },
      },
    });

    let currentUserRank: number | null = null;
    let currentUserScore = 0;
    let currentUserTimeTaken = 0;
    let currentUserXp = 0;
    let hasCurrentUserEntry = false;

    const leaderboard = participants.map((p, index) => {
      const rank = index + 1;
      const isCurrentUser = userId ? p.userId === userId : false;

      const problemScores: Record<
        string,
        { score: number; isCorrect: boolean }
      > = {};
      for (const s of p.submissions) {
        problemScores[s.problemId] = {
          score: s.scoreEarned,
          isCorrect: s.isCorrect,
        };
      }

      const entry = {
        rank,
        participantId: p.id,
        userId: p.userId,
        name:
          p.user?.profile?.fullName ||
          p.user?.name ||
          p.user?.username ||
          'Builder',
        username: p.user?.username || 'builder',
        avatarUrl: p.user?.image || p.user?.profile?.avatarUrl || null,
        college: p.user?.profile?.college || 'Campus Chapter',
        score: p.score,
        timeTakenSeconds: p.timeTakenSeconds,
        xpAwarded: p.xpAwarded,
        submittedAt: p.submittedAt?.toISOString() || null,
        isCurrentUser,
        problemScores,
      };

      if (isCurrentUser) {
        currentUserRank = rank;
        currentUserScore = p.score;
        currentUserTimeTaken = p.timeTakenSeconds;
        currentUserXp = p.xpAwarded;
        hasCurrentUserEntry = true;
      }

      return entry;
    });

    return {
      competition: {
        id: comp.id,
        title: comp.title,
        slug: comp.slug,
        difficulty: comp.difficulty,
        status: comp.status,
        startTime: comp.startTime.toISOString(),
        endTime: comp.endTime.toISOString(),
        totalPoints: comp.totalPoints,
        durationMinutes: comp.durationMinutes,
        participantCount: comp._count.participants,
        totalSubmitted: participants.length,
        problems: comp.problems,
      },
      currentUserStanding: hasCurrentUserEntry
        ? {
            rank: currentUserRank,
            score: currentUserScore,
            timeTakenSeconds: currentUserTimeTaken,
            xpAwarded: currentUserXp,
            isSubmitted: true,
          }
        : null,
      leaderboard,
    };
  }

  /**
   * Get complete personal competition history, aggregate stats, and track record
   */
  async getUserCompetitionHistory(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, username: true },
    });
    if (!user) throw new NotFoundException('User not found');

    const participations = await this.prisma.competitionParticipant.findMany({
      where: { userId },
      orderBy: { registeredAt: 'desc' },
      include: {
        competition: {
          include: {
            _count: {
              select: {
                participants: true,
                problems: true,
              },
            },
          },
        },
        submissions: {
          select: {
            problemId: true,
            isCorrect: true,
            scoreEarned: true,
          },
        },
      },
    });

    const completed = participations.filter(
      (p) => p.status === ParticipantStatus.SUBMITTED,
    );

    const totalParticipated = participations.length;
    const contestsCompleted = completed.length;

    let bestRank: number | null = null;
    let podiumFinishes = 0;
    let totalScoreEarned = 0;
    let totalPossibleScore = 0;
    let totalXpEarned = 0;
    let totalTimeTakenSeconds = 0;

    for (const p of completed) {
      if (p.rank) {
        if (bestRank === null || p.rank < bestRank) {
          bestRank = p.rank;
        }
        if (p.rank <= 3) {
          podiumFinishes++;
        }
      }
      totalScoreEarned += p.score;
      totalPossibleScore += p.competition.totalPoints;
      totalXpEarned += p.xpAwarded;
      totalTimeTakenSeconds += p.timeTakenSeconds;
    }

    const averageAccuracy =
      totalPossibleScore > 0
        ? Math.round((totalScoreEarned / totalPossibleScore) * 100)
        : 0;

    const averageTimeTakenSeconds =
      contestsCompleted > 0
        ? Math.round(totalTimeTakenSeconds / contestsCompleted)
        : 0;

    const history = participations.map((p) => {
      const solvedProblems = p.submissions.filter((s) => s.isCorrect).length;
      const totalProblems = p.competition._count.problems;
      const percentage =
        p.competition.totalPoints > 0
          ? Math.round((p.score / p.competition.totalPoints) * 100)
          : 0;

      return {
        participantId: p.id,
        competitionId: p.competition.id,
        title: p.competition.title,
        slug: p.competition.slug,
        difficulty: p.competition.difficulty,
        status: p.status,
        competitionStatus: p.competition.status,
        score: p.score,
        totalPoints: p.competition.totalPoints,
        percentage,
        rank: p.rank,
        totalParticipants: p.competition._count.participants,
        timeTakenSeconds: p.timeTakenSeconds,
        xpAwarded: p.xpAwarded,
        submittedAt: p.submittedAt?.toISOString() || null,
        registeredAt: p.registeredAt.toISOString(),
        solvedProblems,
        totalProblems,
      };
    });

    return {
      stats: {
        totalParticipated,
        contestsCompleted,
        bestRank,
        podiumFinishes,
        totalScoreEarned,
        totalPossibleScore,
        averageAccuracy,
        totalXpEarned,
        averageTimeTakenSeconds,
      },
      history,
    };
  }
}
