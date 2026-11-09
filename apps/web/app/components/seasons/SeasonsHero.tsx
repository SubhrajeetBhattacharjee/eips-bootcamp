'use client';

import React, { useState, useEffect } from 'react';
import { Trophy, Clock, Sparkles, Shield, Flame, Award } from 'lucide-react';
import type { SeasonInfo } from '@/app/lib/seasons';

interface SeasonsHeroProps {
  season: SeasonInfo;
  timeRemainingSeconds: number;
  totalParticipants: number;
  currentUserStanding?: {
    rank: number;
    seasonalXp: number;
    tier: string;
    percentile: number;
  } | null;
}

export function SeasonsHero({
  season,
  timeRemainingSeconds: initialTime,
  totalParticipants,
  currentUserStanding,
}: SeasonsHeroProps) {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const formatCountdown = (totalSecs: number) => {
    if (totalSecs <= 0) return 'Season Concluded';
    const days = Math.floor(totalSecs / 86400);
    const hours = Math.floor((totalSecs % 86400) / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${days}d ${hours}h ${mins}m ${secs}s`;
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border border-amber-500/30 bg-amber-500/10 text-amber-400">
              <Trophy size={14} />
              {season.status === 'ACTIVE' ? 'Active Season' : season.status}
            </span>

            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
              <Sparkles size={12} />
              {season.xpMultiplier}x Multiplier Active
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
            {season.name}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-2xl leading-relaxed">
            {season.description}
          </p>
        </div>

        {/* Ticking Season Countdown */}
        <div className="p-4 rounded-2xl bg-card border border-border/70 shadow-xs space-y-1 self-start lg:self-center shrink-0 min-w-[220px]">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
            <Clock size={13} className="text-primary" />
            <span>Time Remaining</span>
          </div>
          <p className="text-lg sm:text-xl font-black font-mono text-foreground tracking-tight">
            {formatCountdown(timeLeft)}
          </p>
        </div>
      </div>

      {/* Seasonal Metrics & Standing HUD */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-y border-border/40">
        <div className="space-y-0.5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Your Season Rank
          </p>
          <p className="text-xl sm:text-2xl font-black text-foreground">
            {currentUserStanding?.rank ? `#${currentUserStanding.rank}` : 'Unranked'}
          </p>
          <p className="text-[11px] text-muted-foreground">
            {currentUserStanding?.percentile ? `Top ${currentUserStanding.percentile}%` : 'Earn XP to rank'}
          </p>
        </div>

        <div className="space-y-0.5 sm:border-l sm:border-border/30 sm:pl-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Your Seasonal XP
          </p>
          <p className="text-xl sm:text-2xl font-black text-primary dark:text-emerald-400">
            {currentUserStanding?.seasonalXp?.toLocaleString() || 0} XP
          </p>
          <p className="text-[11px] text-muted-foreground">In Current Season</p>
        </div>

        <div className="space-y-0.5 sm:border-l sm:border-border/30 sm:pl-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Seasonal Tier
          </p>
          <p className="text-xl sm:text-2xl font-black text-amber-400 capitalize">
            {currentUserStanding?.tier ? currentUserStanding.tier.replace('_', ' ').toLowerCase() : 'Bronze'}
          </p>
          <p className="text-[11px] text-muted-foreground">Standing Status</p>
        </div>

        <div className="space-y-0.5 sm:border-l sm:border-border/30 sm:pl-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Active Competitors
          </p>
          <p className="text-xl sm:text-2xl font-black text-foreground">
            {totalParticipants}
          </p>
          <p className="text-[11px] text-muted-foreground">Builders in Season</p>
        </div>
      </div>
    </div>
  );
}

