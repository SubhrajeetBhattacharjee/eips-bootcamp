'use client';

import React from 'react';
import Link from 'next/link';
import {
  Trophy,
  Clock,
  Award,
  Users2,
  CheckCircle2,
  Zap,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { CompetitionLeaderboardData } from '@/app/lib/competitions';

interface CompetitionLeaderboardHeroProps {
  data: CompetitionLeaderboardData;
}

export function CompetitionLeaderboardHero({
  data,
}: CompetitionLeaderboardHeroProps) {
  const { competition, currentUserStanding } = data;

  const minutes = currentUserStanding
    ? Math.floor(currentUserStanding.timeTakenSeconds / 60)
    : 0;
  const seconds = currentUserStanding
    ? currentUserStanding.timeTakenSeconds % 60
    : 0;

  return (
    <div className="relative rounded-3xl bg-gradient-to-br from-card via-card to-accent/40 border border-border/80 p-6 sm:p-8 shadow-xs overflow-hidden">
      {/* Ambient Glow */}
      <div className="pointer-events-none absolute -top-12 -right-12 w-80 h-80 rounded-full bg-amber-500/10 dark:bg-amber-400/10 blur-3xl" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        
        {/* Left: Competition Title & Overview */}
        <div className="max-w-2xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/25 flex items-center gap-1.5">
              <Trophy size={12} className="text-amber-500" />
              <span>Official Contest Leaderboard</span>
            </span>

            <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md bg-muted text-muted-foreground border border-border">
              {competition.difficulty}
            </span>

            {competition.status === 'ACTIVE' && (
              <span className="text-[10px] font-mono font-bold uppercase text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                Live Arena
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-foreground tracking-tight leading-tight">
            {competition.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-muted-foreground pt-1">
            <span className="flex items-center gap-1.5 text-foreground font-bold">
              <Award size={14} className="text-amber-500" />
              {competition.totalPoints} Total Points
            </span>
            <span>·</span>
            <span className="flex items-center gap-1.5 text-foreground font-bold">
              <Users2 size={14} className="text-primary dark:text-emerald-400" />
              {competition.totalSubmitted} Submissions
            </span>
            <span>·</span>
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Clock size={14} />
              {competition.durationMinutes}m Time Window
            </span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="shrink-0 flex items-center gap-3">
          <Link
            href={`/dashboard/competitions/${competition.slug}`}
            className="px-5 py-2.5 rounded-xl bg-card hover:bg-accent border border-border text-foreground font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>View Arena</span>
            <ArrowRight size={14} />
          </Link>
        </div>

      </div>

      {/* User's Standings HUD (if submitted) */}
      {currentUserStanding && (
        <div className="mt-6 p-4 rounded-2xl bg-primary/10 dark:bg-emerald-950/20 border border-primary/25 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center font-mono font-black text-base text-foreground shadow-xs">
              #{currentUserStanding.rank || '-'}
            </div>

            <div>
              <p className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Sparkles size={14} className="text-primary dark:text-emerald-400" />
                <span>Your Official Competition Standing</span>
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Ranked by points ({currentUserStanding.score} / {competition.totalPoints}) and tiebreaker time ({minutes}m {seconds}s).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="px-3 py-1 rounded-lg bg-card border border-border font-bold text-foreground">
              {currentUserStanding.score} pts
            </span>
            <span className="text-primary dark:text-emerald-400 font-bold">
              +{currentUserStanding.xpAwarded} XP
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

