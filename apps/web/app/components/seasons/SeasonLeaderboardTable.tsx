'use client';

import React, { useState } from 'react';
import { Search, Trophy, Medal, Crown, Sparkles } from 'lucide-react';
import type { SeasonalLeaderboardEntry } from '@/app/lib/seasons';

interface SeasonLeaderboardTableProps {
  entries: SeasonalLeaderboardEntry[];
}

export function SeasonLeaderboardTable({ entries }: SeasonLeaderboardTableProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = entries.filter(
    (e) =>
      e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.username.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'GRAND_CHAMPION':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
            Grand Champion
          </span>
        );
      case 'PODIUM':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/15 text-sky-400 border border-sky-500/30">
            Podium Finisher
          </span>
        );
      case 'DIAMOND':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/15 text-purple-400 border border-purple-500/30">
            Diamond Builder
          </span>
        );
      case 'GOLD':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-yellow-500/15 text-yellow-500 border border-yellow-500/30">
            Gold Builder
          </span>
        );
      case 'SILVER':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-400/15 text-slate-300 border border-slate-400/30">
            Silver Builder
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            Bronze Builder
          </span>
        );
    }
  };

  const getRankIndicator = (rank: number) => {
    if (rank === 1) return <span className="font-bold text-amber-400 flex items-center gap-1"><Crown size={14} /> #1</span>;
    if (rank === 2) return <span className="font-bold text-slate-300 flex items-center gap-1"><Medal size={14} /> #2</span>;
    if (rank === 3) return <span className="font-bold text-amber-600 flex items-center gap-1"><Medal size={14} /> #3</span>;
    return <span className="font-mono text-muted-foreground font-bold">#{rank}</span>;
  };

  return (
    <div className="rounded-2xl bg-card border border-border/70 overflow-hidden shadow-xs space-y-4 p-5 sm:p-6">
      {/* Search & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-bold text-base sm:text-lg text-foreground">
            Seasonal Standings
          </h3>
          <p className="text-xs text-muted-foreground">
            Ranked by total XP earned across protocols and weekly arenas during this season
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            placeholder="Search builders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-muted/20 border border-border/50 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-border/50 text-[11px] font-mono text-muted-foreground uppercase tracking-wider">
              <th className="py-3 px-3">Rank</th>
              <th className="py-3 px-3">Builder</th>
              <th className="py-3 px-3">Seasonal Tier</th>
              <th className="py-3 px-3 text-center">Contests</th>
              <th className="py-3 px-3 text-right">Seasonal XP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {filtered.length > 0 ? (
              filtered.map((entry) => (
                <tr
                  key={entry.userId}
                  className={`transition-colors ${
                    entry.isCurrentUser
                      ? 'bg-primary/10 hover:bg-primary/15 font-semibold'
                      : 'hover:bg-muted/20'
                  }`}
                >
                  <td className="py-3.5 px-3">
                    {getRankIndicator(entry.rank)}
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-primary/10 border border-border/50 text-primary flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden">
                        {entry.image ? (
                          <img
                            src={entry.image}
                            alt={entry.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          entry.name.slice(0, 2).toUpperCase()
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-foreground truncate max-w-[150px] sm:max-w-[200px]">
                            {entry.name}
                          </span>
                          {entry.isCurrentUser && (
                            <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-primary text-primary-foreground">
                              YOU
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          @{entry.username}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-3">
                    {getTierBadge(entry.tier)}
                  </td>
                  <td className="py-3.5 px-3 text-center font-mono">
                    {entry.contestsCompleted}
                  </td>
                  <td className="py-3.5 px-3 text-right font-black font-mono text-primary dark:text-emerald-400 text-sm">
                    {entry.seasonalXp.toLocaleString()} XP
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-8 text-center text-muted-foreground">
                  No builders found matching &ldquo;{searchTerm}&rdquo;
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

