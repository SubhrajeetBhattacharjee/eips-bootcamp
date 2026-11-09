import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { XpService } from '../xp/xp.service';
import { SeasonStatus, ParticipantStatus } from '@prisma/client';

export interface SeasonalLeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  username: string;
  image?: string | null;
  seasonalXp: number;
  contestsCompleted: number;
  tier: string; // GRAND_CHAMPION, PODIUM, DIAMOND, GOLD, SILVER
  isCurrentUser?: boolean;
}

@Injectable()
export class SeasonsService implements OnModuleInit {
  private readonly logger = new Logger(SeasonsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly xpService: XpService,
  ) {}

  async onModuleInit() {
    await this.seedDefaultSeasons();
  }

  /**
   * Seed default seasons (Archived Season 0, Active Season Alpha, Upcoming Season 1)
   */
  async seedDefaultSeasons() {
    try {
      const count = await this.prisma.season.count();
      if (count === 0) {
        this.logger.log('Seeding default seasons...');
        const now = new Date();

        // 1. Season 0: Genesis Foundation (Archived)
        const season0Start = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        const season0End = new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000);

        await this.prisma.season.create({
          data: {
            slug: 'season-0',
            name: 'Season 0: Genesis Foundation',
            description:
              'The inaugural bootcamp phase establishing Ethereum core protocols and smart contract foundations.',
            status: SeasonStatus.ARCHIVED,
            startDate: season0Start,
            endDate: season0End,
            xpMultiplier: 1.0,
          },
        });

        // 2. Season Alpha: Protocol Renaissance (Active)
        const seasonAlphaStart = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
        const seasonAlphaEnd = new Date(now.getTime() + 45 * 24 * 60 * 60 * 1000);

        await this.prisma.season.create({
          data: {
            slug: 'season-alpha',
            name: 'Season Alpha: Protocol Renaissance',
            description:
              'Current seasonal competition. Compete in Weekly Arenas, master EIP-4844 blob mechanics, and climb the seasonal ladder.',
            status: SeasonStatus.ACTIVE,
            startDate: seasonAlphaStart,
            endDate: seasonAlphaEnd,
            xpMultiplier: 1.25,
          },
        });

        // 3. Season 1: ZK Scaling Odyssey (Upcoming)
        const season1Start = new Date(now.getTime() + 46 * 24 * 60 * 60 * 1000);
        const season1End = new Date(now.getTime() + 120 * 24 * 60 * 60 * 1000);

        await this.prisma.season.create({
          data: {
            slug: 'season-1',
            name: 'Season 1: ZK Scaling Odyssey',
            description:
              'Upcoming season focused on zero-knowledge circuits, account abstraction (ERC-4337), and modular rollups.',
            status: SeasonStatus.UPCOMING,
            startDate: season1Start,
            endDate: season1End,
            xpMultiplier: 1.5,
          },
        });

        this.logger.log('Default seasons successfully seeded.');
      }
    } catch (err) {
      this.logger.error('Failed to seed default seasons:', err);
    }
  }

  /**
   * Determine seasonal tier based on rank and total participants
   */
  private determineTier(rank: number, total: number): string {
    if (rank === 1) return 'GRAND_CHAMPION';
    if (rank <= 3) return 'PODIUM';
    if (rank <= 10) return 'DIAMOND';
    if (total > 0 && rank / total <= 0.25) return 'GOLD';
    if (total > 0 && rank / total <= 0.5) return 'SILVER';
    return 'BRONZE';
  }

  /**
   * Get active season with live seasonal leaderboard
   */
  async getCurrentSeason(userId?: string) {
    let season = await this.prisma.season.findFirst({
      where: { status: SeasonStatus.ACTIVE },
    });

    if (!season) {
      season = await this.prisma.season.findFirst({
        where: { slug: 'season-alpha' },
      });
    }

    if (!season) {
      throw new NotFoundException('No active season found');
    }

    return this.getSeasonDetails(season.id, userId);
  }

  /**
   * Get details and leaderboard for a season by slug
   */
  async getSeasonBySlug(slug: string, userId?: string) {
    const season = await this.prisma.season.findUnique({
      where: { slug },
    });

    if (!season) {
      throw new NotFoundException(`Season with slug ${slug} not found`);
    }

    return this.getSeasonDetails(season.id, userId);
  }

  /**
   * Internal helper to compute seasonal leaderboard and user standing
   */
  private async getSeasonDetails(seasonId: string, userId?: string) {
    const season = await this.prisma.season.findUnique({
      where: { id: seasonId },
    });

    if (!season) {
      throw new NotFoundException(`Season with ID ${seasonId} not found`);
    }

    const now = new Date();
    const timeRemainingSeconds = Math.max(
      0,
      Math.floor((season.endDate.getTime() - now.getTime()) / 1000),
    );

    // If season is ARCHIVED and has snapshot records, return snapshots
    const snapshots = await this.prisma.seasonUserSnapshot.findMany({
      where: { seasonId },
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
      orderBy: { rank: 'asc' },
    });

    let leaderboard: SeasonalLeaderboardEntry[] = [];

    if (snapshots.length > 0) {
      leaderboard = snapshots.map((s) => ({
        rank: s.rank,
        userId: s.userId,
        name: s.user.name || s.user.username || 'Student Builder',
        username: s.user.username || s.user.id.slice(0, 8),
        image: s.user.image,
        seasonalXp: s.seasonalXp,
        contestsCompleted: s.contestsCompleted,
        tier: s.tier,
        isCurrentUser: userId ? s.userId === userId : false,
      }));
    } else {
      // Compute live seasonal leaderboard from XP transactions within season timeframe
      const users = await this.prisma.user.findMany({
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
          xpTransactions: {
            where: {
              createdAt: {
                gte: season.startDate,
                lte: season.endDate,
              },
            },
            select: { amount: true },
          },
          competitionParticipations: {
            where: {
              status: ParticipantStatus.SUBMITTED,
              startedAt: {
                gte: season.startDate,
                lte: season.endDate,
              },
            },
            select: { id: true },
          },
        },
      });

      // Calculate total seasonal XP for each user
      const computedUsers = users
        .map((u) => {
          const seasonalXp = u.xpTransactions.reduce((acc, curr) => acc + curr.amount, 0);
          return {
            userId: u.id,
            name: u.name || u.username || 'Student Builder',
            username: u.username || u.id.slice(0, 8),
            image: u.image,
            seasonalXp,
            contestsCompleted: u.competitionParticipations.length,
          };
        })
        .sort((a, b) => b.seasonalXp - a.seasonalXp);

      const total = computedUsers.length;
      leaderboard = computedUsers.map((u, idx) => {
        const rank = idx + 1;
        return {
          rank,
          userId: u.userId,
          name: u.name,
          username: u.username,
          image: u.image,
          seasonalXp: u.seasonalXp,
          contestsCompleted: u.contestsCompleted,
          tier: this.determineTier(rank, total),
          isCurrentUser: userId ? u.userId === userId : false,
        };
      });
    }

    const currentUserEntry = userId
      ? leaderboard.find((e) => e.userId === userId) || null
      : null;

    return {
      season,
      leaderboard: leaderboard.slice(0, 50),
      totalParticipants: leaderboard.length,
      currentUserStanding: currentUserEntry
        ? {
            rank: currentUserEntry.rank,
            seasonalXp: currentUserEntry.seasonalXp,
            tier: currentUserEntry.tier,
            percentile:
              leaderboard.length > 0
                ? Math.round((currentUserEntry.rank / leaderboard.length) * 100)
                : 100,
          }
        : null,
      timeRemainingSeconds,
    };
  }

  /**
   * Get all seasons for Hall of Fame & Archives
   */
  async getAllSeasons() {
    const seasons = await this.prisma.season.findMany({
      orderBy: { startDate: 'desc' },
      include: {
        snapshots: {
          take: 3,
          orderBy: { rank: 'asc' },
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
      },
    });

    const now = new Date();
    return seasons.map((s) => ({
      id: s.id,
      slug: s.slug,
      name: s.name,
      description: s.description,
      status: s.status,
      startDate: s.startDate,
      endDate: s.endDate,
      xpMultiplier: s.xpMultiplier,
      isActive: s.status === SeasonStatus.ACTIVE,
      isConcluded: s.status === SeasonStatus.ARCHIVED || now > s.endDate,
      podium: s.snapshots.map((p) => ({
        rank: p.rank,
        userId: p.userId,
        name: p.user.name || p.user.username || 'Builder',
        image: p.user.image,
        seasonalXp: p.seasonalXp,
        tier: p.tier,
      })),
    }));
  }

  /**
   * Claim seasonal Grand Champion / Podium honor reward
   */
  async claimSeasonReward(userId: string, seasonId: string) {
    const season = await this.prisma.season.findUnique({
      where: { id: seasonId },
    });

    if (!season) {
      throw new NotFoundException(`Season with ID ${seasonId} not found`);
    }

    if (season.status !== SeasonStatus.ARCHIVED && new Date() <= season.endDate) {
      throw new BadRequestException('Season has not yet concluded');
    }

    let snapshot = await this.prisma.seasonUserSnapshot.findUnique({
      where: {
        seasonId_userId: { seasonId, userId },
      },
    });

    if (!snapshot) {
      throw new BadRequestException('No seasonal ranking record found for this season');
    }

    if (snapshot.rewardClaimed) {
      return snapshot;
    }

    // Determine reward XP based on rank
    let rewardXp = 100;
    if (snapshot.rank === 1) rewardXp = 1000;
    else if (snapshot.rank <= 3) rewardXp = 500;
    else if (snapshot.rank <= 10) rewardXp = 250;

    await this.xpService.awardXp({
      userId,
      amount: rewardXp,
      reason: `Seasonal Honor: ${season.name} (Rank #${snapshot.rank})`,
      category: 'ACHIEVEMENT',
      referenceId: `SEASON-REWARD-${season.id}-${userId}`,
    });

    const updated = await this.prisma.seasonUserSnapshot.update({
      where: { id: snapshot.id },
      data: {
        rewardClaimed: true,
        rewardXp,
      },
    });

    this.logger.log(
      `Awarded +${rewardXp} XP to user ${userId} for ${season.name} Rank #${snapshot.rank}`,
    );

    return updated;
  }
}

