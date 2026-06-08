"use client";
import React from "react";

interface Props {
  rank: number;
  nextRankXp: number;
  currentXp: number;
  percentile?: number;
  totalUsers?: number;
}

export default function RankProgressCard({ rank, nextRankXp, currentXp, percentile, totalUsers }: Props) {
  const progress = Math.min(100, Math.round((currentXp / nextRankXp) * 100));
  return (
    <div className="rounded-xl p-4 border border-border" style={{ background: "rgba(255,255,255,0.03)", }}>
      <div className="text-xs text-foreground/40">Current Rank</div>
      <div className="text-2xl font-bold text-foreground">#{rank}</div>
      {typeof percentile === 'number' && (
        <div className="text-xs text-foreground/40">Top {percentile}% of {totalUsers ?? 'learners'}</div>
      )}
      <div className="mt-3 h-2 w-full bg-foreground/6 rounded-full overflow-hidden">
        <div style={{ width: `${progress}%` }} className="h-full bg-emerald-400" />
      </div>
      <div className="mt-2 text-xs text-foreground/40">{currentXp.toLocaleString()} / {nextRankXp.toLocaleString()} XP</div>
    </div>
  );
}
