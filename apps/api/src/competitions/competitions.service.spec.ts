import { Test, TestingModule } from '@nestjs/testing';
import { CompetitionsService } from './competitions.service';
import { PrismaService } from '../prisma/prisma.service';
import { XpService } from '../xp/xp.service';
import {
  CompetitionStatus,
  CompetitionDifficulty,
  ParticipantStatus,
} from '@prisma/client';
import { BadRequestException } from '@nestjs/common';

describe('CompetitionsService', () => {
  let service: CompetitionsService;

  const mockPrisma = {
    competition: {
      count: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    competitionProblem: {
      findMany: jest.fn(),
    },
    competitionParticipant: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
    competitionSubmission: {
      upsert: jest.fn(),
      findMany: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
  };

  const mockXpService = {
    awardXp: jest.fn().mockResolvedValue({ success: true, xpAwarded: 200 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompetitionsService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: XpService, useValue: mockXpService },
      ],
    }).compile();

    service = module.get<CompetitionsService>(CompetitionsService);
    jest.clearAllMocks();
  });

  describe('Problem sanitization in getCompetitionById', () => {
    it('should conceal correctOption and explanation if participant has not submitted', async () => {
      mockPrisma.competition.count.mockResolvedValue(1);
      mockPrisma.competition.findFirst.mockResolvedValue({
        id: 'comp-1',
        slug: 'weekly-arena-1',
        title: 'Weekly Arena #1',
        description: 'EVM test',
        difficulty: CompetitionDifficulty.INTERMEDIATE,
        status: CompetitionStatus.ACTIVE,
        startTime: new Date(Date.now() - 3600000),
        endTime: new Date(Date.now() + 3600000),
        durationMinutes: 60,
        totalPoints: 100,
        xpReward: 100,
        rules: 'Standard',
        _count: { participants: 5 },
        problems: [
          {
            id: 'prob-1',
            orderIndex: 1,
            title: 'EIP-1559',
            description: 'Gas test',
            codeSnippet: null,
            type: 'MULTIPLE_CHOICE',
            options: [{ id: 'A', text: 'Option A' }],
            points: 100,
            correctOption: 'A',
            explanation: 'Detailed explanation of EIP-1559',
          },
        ],
      });

      mockPrisma.competitionParticipant.findUnique.mockResolvedValue({
        id: 'part-1',
        userId: 'user-1',
        status: ParticipantStatus.IN_PROGRESS,
        score: 0,
        rank: null,
        startedAt: new Date(),
        submittedAt: null,
        timeTakenSeconds: 0,
        xpAwarded: 0,
        submissions: [],
      });

      const res = await service.getCompetitionById('comp-1', 'user-1');
      expect(res.problems[0].correctOption).toBeUndefined();
      expect(res.problems[0].explanation).toBeUndefined();
    });

    it('should reveal correctOption and explanation if participant has submitted', async () => {
      mockPrisma.competition.count.mockResolvedValue(1);
      mockPrisma.competition.findFirst.mockResolvedValue({
        id: 'comp-1',
        slug: 'weekly-arena-1',
        title: 'Weekly Arena #1',
        description: 'EVM test',
        difficulty: CompetitionDifficulty.INTERMEDIATE,
        status: CompetitionStatus.ACTIVE,
        startTime: new Date(Date.now() - 3600000),
        endTime: new Date(Date.now() + 3600000),
        durationMinutes: 60,
        totalPoints: 100,
        xpReward: 100,
        rules: 'Standard',
        _count: { participants: 5 },
        problems: [
          {
            id: 'prob-1',
            orderIndex: 1,
            title: 'EIP-1559',
            description: 'Gas test',
            codeSnippet: null,
            type: 'MULTIPLE_CHOICE',
            options: [{ id: 'A', text: 'Option A' }],
            points: 100,
            correctOption: 'A',
            explanation: 'Detailed explanation of EIP-1559',
          },
        ],
      });

      mockPrisma.competitionParticipant.findUnique.mockResolvedValue({
        id: 'part-1',
        userId: 'user-1',
        status: ParticipantStatus.SUBMITTED,
        score: 100,
        rank: 1,
        startedAt: new Date(Date.now() - 600000),
        submittedAt: new Date(),
        timeTakenSeconds: 600,
        xpAwarded: 100,
        submissions: [
          {
            problemId: 'prob-1',
            answer: 'A',
            isCorrect: true,
            scoreEarned: 100,
          },
        ],
      });

      const res = await service.getCompetitionById('comp-1', 'user-1');
      expect(res.problems[0].correctOption).toBe('A');
      expect(res.problems[0].explanation).toBe(
        'Detailed explanation of EIP-1559',
      );
    });
  });

  describe('startCompetition', () => {
    it('should reject starting if already submitted', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: 'user-1' });
      mockPrisma.competition.findUnique.mockResolvedValue({ id: 'comp-1' });
      mockPrisma.competitionParticipant.findUnique.mockResolvedValue({
        id: 'part-1',
        status: ParticipantStatus.SUBMITTED,
      });

      await expect(
        service.startCompetition('comp-1', 'user-1'),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('submitCompetition', () => {
    it('should evaluate answers server-side, calculate score, and award XP', async () => {
      const now = new Date();
      const startedAt = new Date(now.getTime() - 120000); // 2 minutes ago

      mockPrisma.competition.findUnique.mockResolvedValue({
        id: 'comp-1',
        title: 'Weekly Arena #1',
        totalPoints: 100,
        xpReward: 200,
        problems: [
          {
            id: 'prob-1',
            points: 100,
            correctOption: 'B',
            explanation: 'Exp',
          },
        ],
      });

      mockPrisma.competitionParticipant.findUnique.mockResolvedValue({
        id: 'part-1',
        userId: 'user-1',
        competitionId: 'comp-1',
        status: ParticipantStatus.IN_PROGRESS,
        startedAt,
      });

      mockPrisma.competitionSubmission.upsert.mockResolvedValue({});
      mockPrisma.competitionParticipant.update.mockResolvedValue({
        id: 'part-1',
        score: 100,
        status: ParticipantStatus.SUBMITTED,
      });
      mockPrisma.competitionParticipant.count.mockResolvedValue(0);

      const result = await service.submitCompetition('comp-1', {
        userId: 'user-1',
        answers: [{ problemId: 'prob-1', answer: 'B' }],
      });

      expect(result.score).toBe(100);
      expect(result.rank).toBe(1);
      expect(result.xpAwarded).toBe(200);
      expect(mockXpService.awardXp).toHaveBeenCalledWith({
        userId: 'user-1',
        amount: 200,
        reason: 'Completed Weekly Arena #1',
        category: 'COMPETITION',
        referenceId: 'comp-1',
      });
    });
  });

  describe('getCompetitionLeaderboard', () => {
    it('should return ranked participants with tiebreak by timeTakenSeconds', async () => {
      mockPrisma.competition.count.mockResolvedValue(1);
      mockPrisma.competition.findFirst.mockResolvedValue({
        id: 'comp-1',
        slug: 'weekly-arena-1',
        title: 'Weekly Arena #1',
        difficulty: CompetitionDifficulty.INTERMEDIATE,
        status: CompetitionStatus.ACTIVE,
        startTime: new Date(),
        endTime: new Date(),
        totalPoints: 300,
        durationMinutes: 60,
        problems: [{ id: 'p1', title: 'P1', orderIndex: 1, points: 100 }],
        _count: { participants: 2 },
      });

      mockPrisma.competitionParticipant.findMany.mockResolvedValue([
        {
          id: 'part-faster',
          userId: 'user-fast',
          score: 300,
          timeTakenSeconds: 300, // 5 mins
          xpAwarded: 250,
          submittedAt: new Date(),
          user: {
            name: 'Fast Builder',
            username: 'fastcoder',
            image: null,
            profile: {
              fullName: 'Fast Builder',
              college: 'IIT Bombay',
              avatarUrl: null,
            },
          },
          submissions: [{ problemId: 'p1', scoreEarned: 100, isCorrect: true }],
        },
        {
          id: 'part-slower',
          userId: 'user-slow',
          score: 300,
          timeTakenSeconds: 600, // 10 mins
          xpAwarded: 250,
          submittedAt: new Date(),
          user: {
            name: 'Slow Builder',
            username: 'slowcoder',
            image: null,
            profile: {
              fullName: 'Slow Builder',
              college: 'BITS Pilani',
              avatarUrl: null,
            },
          },
          submissions: [{ problemId: 'p1', scoreEarned: 100, isCorrect: true }],
        },
      ]);

      const res = await service.getCompetitionLeaderboard(
        'comp-1',
        'user-fast',
      );
      expect(res.leaderboard).toHaveLength(2);
      expect(res.leaderboard[0].username).toBe('fastcoder');
      expect(res.leaderboard[0].rank).toBe(1);
      expect(res.leaderboard[0].isCurrentUser).toBe(true);
      expect(res.leaderboard[1].username).toBe('slowcoder');
      expect(res.leaderboard[1].rank).toBe(2);
      expect(res.currentUserStanding?.rank).toBe(1);
    });
  });

  describe('getUserCompetitionHistory', () => {
    it('should aggregate statistics and return timeline history', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        name: 'Tester',
        username: 'tester',
      });

      mockPrisma.competitionParticipant.findMany.mockResolvedValue([
        {
          id: 'part-1',
          userId: 'user-1',
          status: ParticipantStatus.SUBMITTED,
          score: 250,
          rank: 2,
          timeTakenSeconds: 900,
          xpAwarded: 200,
          submittedAt: new Date('2026-11-01T12:00:00Z'),
          registeredAt: new Date('2026-11-01T11:00:00Z'),
          competition: {
            id: 'c-1',
            title: 'Arena #1',
            slug: 'arena-1',
            difficulty: CompetitionDifficulty.INTERMEDIATE,
            status: CompetitionStatus.COMPLETED,
            totalPoints: 300,
            _count: { participants: 20, problems: 3 },
          },
          submissions: [
            { problemId: 'p1', isCorrect: true, scoreEarned: 100 },
            { problemId: 'p2', isCorrect: true, scoreEarned: 150 },
            { problemId: 'p3', isCorrect: false, scoreEarned: 0 },
          ],
        },
        {
          id: 'part-2',
          userId: 'user-1',
          status: ParticipantStatus.SUBMITTED,
          score: 100,
          rank: 1,
          timeTakenSeconds: 300,
          xpAwarded: 100,
          submittedAt: new Date('2026-10-25T12:00:00Z'),
          registeredAt: new Date('2026-10-25T11:00:00Z'),
          competition: {
            id: 'c-0',
            title: 'Arena #0',
            slug: 'arena-0',
            difficulty: CompetitionDifficulty.BEGINNER,
            status: CompetitionStatus.COMPLETED,
            totalPoints: 100,
            _count: { participants: 15, problems: 1 },
          },
          submissions: [{ problemId: 'p0', isCorrect: true, scoreEarned: 100 }],
        },
      ]);

      const res = await service.getUserCompetitionHistory('user-1');
      expect(res.stats.totalParticipated).toBe(2);
      expect(res.stats.contestsCompleted).toBe(2);
      expect(res.stats.bestRank).toBe(1);
      expect(res.stats.podiumFinishes).toBe(2);
      expect(res.stats.totalScoreEarned).toBe(350);
      expect(res.stats.totalPossibleScore).toBe(400);
      expect(res.stats.averageAccuracy).toBe(88); // 350 / 400 = 87.5% -> 88%
      expect(res.stats.totalXpEarned).toBe(300);

      expect(res.history).toHaveLength(2);
      expect(res.history[0].title).toBe('Arena #1');
      expect(res.history[0].solvedProblems).toBe(2);
      expect(res.history[0].totalProblems).toBe(3);
    });
  });
});
