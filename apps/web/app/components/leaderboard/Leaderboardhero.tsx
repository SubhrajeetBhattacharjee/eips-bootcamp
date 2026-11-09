"use client";

import React from "react";
import FilterTabs from "./Filtertabs";
import { FilterPeriod } from "@/app/lib/leaderboard";
import { Trophy, Sparkles } from "lucide-react";

interface Props {
  filter: FilterPeriod;
  onFilterChange: (v: FilterPeriod) => void;
  totalBuilders?: number;
}

export default function LeaderboardHero({ filter, onFilterChange, totalBuilders = 12 }: Props) {
  return (
    <div className="relative overflow-hidden border-b border-border/60 pb-6 pt-4">
      {/* Soft Ambient Background Glow */}
      <div className="pointer-events-none absolute -top-12 left-1/3 w-[450px] h-48 rounded-full bg-primary/10 dark:bg-emerald-500/10 blur-[120px]" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          {/* Subtle Track Label */}
          <div className="flex items-center gap-2 mb-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary dark:bg-emerald-400" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary dark:text-emerald-400">
              Campus Chapter Standings // Cohort Leaderboard
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight flex items-center gap-3">
            <Trophy className="text-amber-500 shrink-0" size={32} />
            <span>Top Campus Builders</span>
          </h1>

          <p className="text-muted-foreground text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
            Real-time protocol achievements, course module completions, and verified peer mentorship across all university cohorts.
          </p>

          {/* Time Filter Tabs */}
          <div className="mt-5 flex items-center gap-3">
            <FilterTabs active={filter} onChange={onFilterChange} />
          </div>
        </div>

        {/* Live Cohort Status Pill */}
        <div className="hidden lg:flex flex-col items-end shrink-0 gap-1.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/70 dark:bg-accent/40 border border-border text-xs font-semibold text-foreground">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-primary dark:text-emerald-400 font-bold">{totalBuilders} Builders Active</span>
          </div>
          <span className="text-[11px] font-mono text-muted-foreground">Rankings update in real-time</span>
        </div>
      </div>
    </div>
  );
}

export { LeaderboardHero };
