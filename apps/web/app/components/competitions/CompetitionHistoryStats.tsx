'use client';

import React from 'react';
import {
  Trophy,
  Award,
  Clock,
  Target,
  Zap,
  Medal,
  CheckCircle2,
} from 'lucide-react';
import { CompetitionHistoryStats as StatsType } from '@/app/lib/competitions';

interface CompetitionHistoryStatsProps {
  stats: StatsType;
}

export function CompetitionHistoryStats({ stats }: CompetitionHistoryStatsProps) {
  const avgMins = Math.floor(stats.averageTimeTakenSeconds / 60);
  const avgSecs = stats.averageTimeTakenSeconds % 60;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
      
      {/* 1. Contests Completed */}
      <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-muted-foreground mb-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider">
            Completed
          </span>
          <CheckCircle2 size={15} className="text-primary dark:text-emerald-400" />
        </div>
        <div>
          <p className="text-2xl sm:text-3xl font-black text-foreground font-mono">
            {stats.contestsCompleted}
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            of {stats.totalParticipated} Joined
          </p>
        </div>
      </div>

      {/* 2. Best Rank */}
      <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-muted-foreground mb-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider">
            Best Rank
          </span>
          <Trophy size={15} className="text-amber-500" />
        </div>
        <div>
          <p className="text-2xl sm:text-3xl font-black text-foreground font-mono">
            {stats.bestRank ? `#${stats.bestRank}` : '-'}
          </p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
            {stats.bestRank === 1
              ? '🥇 Champion'
              : stats.bestRank && stats.bestRank <= 3
              ? 'Podium Tier'
              : 'Personal Best'}
          </p>
        </div>
      </div>

      {/* 3. Podium Finishes */}
      <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-muted-foreground mb-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider">
            Podiums
          </span>
          <Medal size={15} className="text-amber-400" />
        </div>
        <div>
          <p className="text-2xl sm:text-3xl font-black text-foreground font-mono">
            {stats.podiumFinishes}
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Top 3 Finishes
          </p>
        </div>
      </div>

      {/* 4. Accuracy */}
      <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-muted-foreground mb-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider">
            Accuracy
          </span>
          <Target size={15} className="text-purple-500" />
        </div>
        <div>
          <p className="text-2xl sm:text-3xl font-black text-foreground font-mono">
            {stats.averageAccuracy}%
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {stats.totalScoreEarned} / {stats.totalPossibleScore} Pts
          </p>
        </div>
      </div>

      {/* 5. Total Protocol XP */}
      <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-muted-foreground mb-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider">
            Contest XP
          </span>
          <Zap size={15} className="text-amber-500 fill-amber-500" />
        </div>
        <div>
          <p className="text-2xl sm:text-3xl font-black text-primary dark:text-emerald-400 font-mono">
            +{stats.totalXpEarned}
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Level Progress
          </p>
        </div>
      </div>

      {/* 6. Average Time */}
      <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-muted-foreground mb-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider">
            Avg Speed
          </span>
          <Clock size={15} className="text-muted-foreground" />
        </div>
        <div>
          <p className="text-2xl sm:text-3xl font-black text-foreground font-mono">
            {avgMins}m
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {avgSecs}s Average Solve
          </p>
        </div>
      </div>

    </div>
  );
}

