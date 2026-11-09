"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Trophy, BookOpen } from "lucide-react";

interface Props {
  rank: number;
  nextRankXp?: number;
  currentXp: number;
  percentile?: number;
  totalUsers?: number;
  userName?: string;
}

export default function RankProgressCard({
  rank,
  nextRankXp = 2500,
  currentXp,
  percentile,
  totalUsers = 12,
  userName = "Builder",
}: Props) {
  const targetXp = Math.max(nextRankXp, currentXp + 500);
  const progress = Math.min(100, Math.round((currentXp / targetXp) * 100));

  return (
    <div className="rounded-2xl p-5 border border-border/80 bg-card/95 backdrop-blur-md shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
          Your Standing
        </span>
        {rank > 0 && (
          <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-primary/10 text-primary dark:text-emerald-400 border border-primary/20">
            Top {percentile ?? 10}%
          </span>
        )}
      </div>

      <div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-foreground tracking-tight">
            {rank > 0 ? `#${rank}` : "Unranked"}
          </span>
          <span className="text-xs text-muted-foreground font-semibold">
            of {totalUsers} student builders
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">
          {userName} · <span className="font-bold text-primary dark:text-emerald-400 font-mono">{currentXp.toLocaleString()} XP</span>
        </p>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5 pt-1">
        <div className="flex justify-between text-[11px] font-mono text-muted-foreground">
          <span>Cohort Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
          <div
            style={{ width: `${Math.max(4, progress)}%` }}
            className="h-full bg-gradient-to-r from-primary to-emerald-400 rounded-full transition-all duration-500"
          />
        </div>
      </div>

      <Link
        href="/dashboard/my-modules"
        className="w-full py-2.5 px-3 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer group"
      >
        <BookOpen size={13} />
        <span>Complete Labs to Climb</span>
        <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
      </Link>
    </div>
  );
}

export { RankProgressCard };
