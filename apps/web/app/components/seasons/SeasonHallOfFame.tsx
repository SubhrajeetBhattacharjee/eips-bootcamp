'use client';

import React from 'react';
import { Crown, Trophy, Sparkles } from 'lucide-react';
import type { SeasonalLeaderboardEntry } from '@/app/lib/seasons';

interface SeasonHallOfFameProps {
  topThree: SeasonalLeaderboardEntry[];
}

export function SeasonHallOfFame({ topThree }: SeasonHallOfFameProps) {
  if (!topThree || topThree.length === 0) return null;

  // Order for visual podium: 2nd place (left), 1st place (center), 3rd place (right)
  const first = topThree.find((p) => p.rank === 1) || topThree[0];
  const second = topThree.find((p) => p.rank === 2) || topThree[1];
  const third = topThree.find((p) => p.rank === 3) || topThree[2];

  return (
    <div className="p-6 rounded-2xl bg-card border border-border/70 space-y-6 shadow-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
            <Trophy size={18} />
          </div>
          <div>
            <h3 className="font-bold text-sm sm:text-base text-foreground flex items-center gap-2">
              <span>Season Hall of Fame</span>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Podium
              </span>
            </h3>
            <p className="text-[11px] text-muted-foreground">
              Top builders leading the seasonal protocol hierarchy
            </p>
          </div>
        </div>

        <span className="text-xs font-mono text-muted-foreground hidden sm:inline">
          Seasonal Grand Champions
        </span>
      </div>

      {/* 3-Tier Podium */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 items-end">
        {/* 2nd Place (Silver) */}
        {second && (
          <div className="flex flex-col items-center order-2 sm:order-1 p-4 rounded-xl bg-muted/20 border border-slate-400/30 text-center space-y-2">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-slate-400/10 border-2 border-slate-300 text-slate-300 flex items-center justify-center font-bold text-lg overflow-hidden shadow-md">
                {second.image ? (
                  <img
                    src={second.image}
                    alt={second.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  second.name.slice(0, 2).toUpperCase()
                )}
              </div>
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[10px] font-black bg-slate-300 text-black border border-slate-400">
                #2
              </span>
            </div>

            <div className="pt-1">
              <h4 className="font-bold text-xs sm:text-sm text-foreground line-clamp-1">
                {second.name}
              </h4>
              <p className="text-[10px] text-muted-foreground font-mono">
                @{second.username}
              </p>
            </div>

            <div className="pt-1">
              <span className="text-xs sm:text-sm font-black text-slate-300">
                {second.seasonalXp.toLocaleString()} XP
              </span>
              <p className="text-[10px] text-muted-foreground">
                {second.contestsCompleted} Contests
              </p>
            </div>
          </div>
        )}

        {/* 1st Place (Gold / Champion) */}
        {first && (
          <div className="flex flex-col items-center order-1 sm:order-2 p-5 rounded-xl bg-amber-500/10 border-2 border-amber-500/40 text-center space-y-2.5 shadow-lg relative -mt-3">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-amber-500 text-black text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md">
              <Crown size={12} />
              Grand Champion
            </div>

            <div className="relative mt-2">
              <div className="w-20 h-20 rounded-full bg-amber-500/20 border-2 border-amber-400 text-amber-300 flex items-center justify-center font-black text-xl overflow-hidden shadow-xl">
                {first.image ? (
                  <img
                    src={first.image}
                    alt={first.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  first.name.slice(0, 2).toUpperCase()
                )}
              </div>
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-400 text-black border border-amber-500">
                #1
              </span>
            </div>

            <div className="pt-1">
              <h4 className="font-bold text-sm sm:text-base text-foreground line-clamp-1">
                {first.name}
              </h4>
              <p className="text-[11px] text-muted-foreground font-mono">
                @{first.username}
              </p>
            </div>

            <div className="pt-1">
              <span className="text-sm sm:text-base font-black text-amber-400 flex items-center justify-center gap-1">
                <Sparkles size={13} />
                {first.seasonalXp.toLocaleString()} XP
              </span>
              <p className="text-[10px] text-muted-foreground">
                {first.contestsCompleted} Contests Completed
              </p>
            </div>
          </div>
        )}

        {/* 3rd Place (Bronze) */}
        {third && (
          <div className="flex flex-col items-center order-3 p-4 rounded-xl bg-muted/20 border border-amber-700/30 text-center space-y-2">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-amber-700/10 border-2 border-amber-600 text-amber-500 flex items-center justify-center font-bold text-lg overflow-hidden shadow-md">
                {third.image ? (
                  <img
                    src={third.image}
                    alt={third.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  third.name.slice(0, 2).toUpperCase()
                )}
              </div>
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-600 text-white border border-amber-700">
                #3
              </span>
            </div>

            <div className="pt-1">
              <h4 className="font-bold text-xs sm:text-sm text-foreground line-clamp-1">
                {third.name}
              </h4>
              <p className="text-[10px] text-muted-foreground font-mono">
                @{third.username}
              </p>
            </div>

            <div className="pt-1">
              <span className="text-xs sm:text-sm font-black text-amber-500">
                {third.seasonalXp.toLocaleString()} XP
              </span>
              <p className="text-[10px] text-muted-foreground">
                {third.contestsCompleted} Contests
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

