'use client';

import React from 'react';
import { Award, Zap, Sparkles, CheckCircle2, Shield, Trophy } from 'lucide-react';
import { AchievementStats } from '@/app/lib/achievements';

interface AchievementsHeroProps {
  stats: AchievementStats;
}

export function AchievementsHero({ stats }: AchievementsHeroProps) {
  return (
    <div className="relative rounded-3xl bg-gradient-to-br from-card via-card to-accent/40 border border-border/80 p-6 sm:p-8 shadow-xs overflow-hidden">
      {/* Ambient Glow */}
      <div className="pointer-events-none absolute -top-12 -right-12 w-80 h-80 rounded-full bg-amber-500/10 dark:bg-amber-400/10 blur-3xl" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        
        {/* Left: Overview */}
        <div className="max-w-xl space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/25 flex items-center gap-1.5">
              <Award size={13} className="text-amber-500" />
              <span>Campus Milestone Showcase</span>
            </span>
            <span className="text-xs font-mono text-muted-foreground">
              {stats.completionPercentage}% Unlocked
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-foreground tracking-tight">
            Badges & Achievements
          </h1>

          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Commemorate protocol milestones, weekly arena podiums, and division promotions.
            Each badge rewards genuine server-verified Protocol XP.
          </p>
        </div>

        {/* Right: Metrics HUD */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 shrink-0">
          <div className="p-4 rounded-2xl bg-card border border-border/80 text-center shadow-xs">
            <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
              Badges Unlocked
            </p>
            <p className="text-2xl sm:text-3xl font-black text-foreground font-mono mt-0.5">
              {stats.totalUnlocked}
              <span className="text-xs font-normal text-muted-foreground"> / {stats.totalAchievements}</span>
            </p>
            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${stats.completionPercentage}%` }}
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-card border border-border/80 text-center shadow-xs">
            <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
              Achievement XP
            </p>
            <p className="text-2xl sm:text-3xl font-black text-primary dark:text-emerald-400 font-mono mt-0.5">
              +{stats.totalXpFromAchievements}
            </p>
            <p className="text-[11px] text-muted-foreground mt-1">
              Earned Towards Levels
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-card border border-border/80 text-center shadow-xs col-span-2 sm:col-span-1">
            <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
              Mastery Rate
            </p>
            <p className="text-2xl sm:text-3xl font-black text-amber-500 font-mono mt-0.5">
              {stats.completionPercentage}%
            </p>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
              {stats.completionPercentage >= 75 ? 'Elite Scholar' : stats.completionPercentage >= 40 ? 'Active Builder' : 'Rising Builder'}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

