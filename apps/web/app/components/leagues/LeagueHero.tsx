'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Shield, Sparkles, Clock, ArrowUpRight, Flame, BookOpen } from 'lucide-react';
import {
  UserLeagueData,
  TIER_CONFIG,
  ORDERED_TIERS,
  LeagueTier,
} from '@/app/lib/leagues';

interface LeagueHeroProps {
  data: UserLeagueData;
}

export function LeagueHero({ data }: LeagueHeroProps) {
  const [secondsLeft, setSecondsLeft] = useState(
    data.weekInfo?.remainingSeconds || 0,
  );

  useEffect(() => {
    setSecondsLeft(data.weekInfo?.remainingSeconds || 0);
    const interval = setInterval(() => {
      setSecondsLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [data.weekInfo?.remainingSeconds]);

  const days = Math.floor(secondsLeft / (24 * 3600));
  const hours = Math.floor((secondsLeft % (24 * 3600)) / 3600);
  const minutes = Math.floor((secondsLeft % 3600) / 60);
  const seconds = secondsLeft % 60;

  const currentTier = data.tier || 'BRONZE';
  const tierConfig = TIER_CONFIG[currentTier] || TIER_CONFIG.BRONZE;

  const currentTierIndex = ORDERED_TIERS.indexOf(currentTier);
  const nextTier: LeagueTier | null =
    currentTierIndex < ORDERED_TIERS.length - 1
      ? ORDERED_TIERS[currentTierIndex + 1]
      : null;

  return (
    <section className="relative w-full pt-2 pb-6">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute -top-12 left-1/3 w-[500px] h-60 rounded-full bg-primary/10 dark:bg-emerald-500/10 blur-[130px]" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-border/60">
        
        {/* Left: Division Badge & Header */}
        <div className="flex items-start gap-4 sm:gap-5">
          <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border ${tierConfig.borderColor} ${tierConfig.badgeColor} flex flex-col items-center justify-center text-3xl sm:text-4xl shadow-md shrink-0`}>
            <span>{tierConfig.icon}</span>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-primary/10 text-primary dark:text-emerald-400 border border-primary/20">
                Week {data.weekInfo?.weekNumber || 1} · {data.weekInfo?.year || 2026}
              </span>

              {data.cohortIndex && (
                <span className="text-[10px] font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                  Cohort #{data.cohortIndex} (30 Builders)
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight">
              {tierConfig.name}
            </h1>

            <p className="text-sm text-muted-foreground mt-1 max-w-xl leading-relaxed">
              {tierConfig.description}
            </p>
          </div>
        </div>

        {/* Right: Rollover Countdown Clock */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 lg:self-center shrink-0">
          <div className="p-3.5 sm:p-4 rounded-2xl bg-card border border-border/80 shadow-xs flex items-center gap-3">
            <Clock size={20} className="text-primary dark:text-emerald-400 shrink-0" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Weekly Rollover In
              </p>
              <div className="flex items-center gap-1.5 font-mono font-black text-lg sm:text-xl text-foreground">
                <span>{days}d</span>
                <span className="text-muted-foreground">:</span>
                <span>{String(hours).padStart(2, '0')}h</span>
                <span className="text-muted-foreground">:</span>
                <span>{String(minutes).padStart(2, '0')}m</span>
                <span className="text-muted-foreground">:</span>
                <span className="text-primary dark:text-emerald-400">
                  {String(seconds).padStart(2, '0')}s
                </span>
              </div>
            </div>
          </div>

          {!data.hasJoinedThisWeek && (
            <Link
              href="/dashboard/my-modules"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <BookOpen size={15} />
              <span>Enter League</span>
            </Link>
          )}
        </div>

      </div>

      {/* User's Current League Position Banner */}
      {data.hasJoinedThisWeek ? (
        <div className="mt-6 p-4 rounded-2xl bg-accent/50 border border-border/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-card flex items-center justify-center font-black font-mono text-base border border-border shadow-xs text-foreground">
              #{data.userRank || 1}
            </div>

            <div>
              <p className="text-xs font-bold text-foreground flex items-center gap-2">
                <span>Your Current Standing</span>
                <span className="text-[10px] text-muted-foreground font-mono">
                  ({data.weeklyXp.toLocaleString()} XP earned this week)
                </span>
              </p>

              <p className="text-xs text-muted-foreground mt-0.5">
                {data.userRank &&
                data.promotionThresholdRank &&
                data.userRank <= data.promotionThresholdRank ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <Sparkles size={13} />
                    <span>
                      In Promotion Zone! Advancing to{' '}
                      {nextTier ? TIER_CONFIG[nextTier].name : 'Master'} on Sunday.
                    </span>
                  </span>
                ) : data.demotionThresholdRank &&
                  data.userRank &&
                  data.userRank >= data.demotionThresholdRank ? (
                  <span className="text-amber-600 dark:text-amber-400 font-semibold">
                    ⚠️ In Demotion Zone! Earn more XP to stay in {tierConfig.name}.
                  </span>
                ) : (
                  <span className="text-primary dark:text-emerald-400 font-medium">
                    🛡️ Safe Zone · Maintaining {tierConfig.name} next week.
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            <span>Promotion Cutoff:</span>
            <span className="font-mono font-bold text-foreground">
              Top {data.promotionThresholdRank || 7}
            </span>
          </div>
        </div>
      ) : (
        <div className="mt-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-800 dark:text-amber-300 text-xs">
          <div className="flex items-center gap-2">
            <Flame size={16} className="text-amber-500 fill-amber-500 shrink-0" />
            <span>
              <strong>Not in a cohort yet!</strong> Complete any lesson, quiz, or
              assignment to claim your spot in this week&apos;s division cohort.
            </span>
          </div>
          <Link
            href="/dashboard/my-modules"
            className="font-bold underline hover:no-underline shrink-0"
          >
            Start Learning →
          </Link>
        </div>
      )}
    </section>
  );
}

