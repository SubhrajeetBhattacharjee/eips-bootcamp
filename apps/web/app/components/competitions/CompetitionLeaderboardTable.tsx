'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Trophy,
  Search,
  Clock,
  CheckCircle2,
  XCircle,
  GraduationCap,
  Sparkles,
  Zap,
} from 'lucide-react';
import {
  CompetitionLeaderboardData,
  CompetitionLeaderboardEntry,
} from '@/app/lib/competitions';

interface CompetitionLeaderboardTableProps {
  data: CompetitionLeaderboardData;
}

export function CompetitionLeaderboardTable({
  data,
}: CompetitionLeaderboardTableProps) {
  const { competition, leaderboard } = data;
  const problems = competition.problems || [];
  const [search, setSearch] = useState('');

  const filtered = leaderboard.filter((entry) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      entry.name.toLowerCase().includes(q) ||
      entry.username.toLowerCase().includes(q) ||
      entry.college.toLowerCase().includes(q)
    );
  });

  const medalDisplay = (rank: number) => {
    if (rank === 1) return <span className="text-xl">🥇</span>;
    if (rank === 2) return <span className="text-xl">🥈</span>;
    if (rank === 3) return <span className="text-xl">🥉</span>;
    return (
      <span className="font-mono font-bold text-xs text-muted-foreground">
        #{rank}
      </span>
    );
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${String(secs).padStart(2, '0')}s`;
  };

  return (
    <div className="w-full rounded-2xl bg-card border border-border/80 shadow-xs overflow-hidden">
      
      {/* Header and Search Bar */}
      <div className="p-5 sm:p-6 border-b border-border/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
            <Trophy size={18} className="text-amber-500" />
            <span>Standings & Tiebreaker Grid</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Ranked by total score, then lowest completion time as tiebreaker.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search builder or campus..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-accent/40 border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Standings Table */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center text-muted-foreground space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-muted/50 border border-border flex items-center justify-center text-2xl mx-auto">
            🏆
          </div>
          <p className="text-sm font-bold text-foreground">
            {search ? 'No builders found' : 'No Submissions Yet'}
          </p>
          <p className="text-xs max-w-sm mx-auto">
            {search
              ? `No participant matching "${search}".`
              : 'Be the first student builder to complete this weekly arena and claim Rank #1!'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border/60 bg-muted/30 text-muted-foreground font-mono text-[10px] uppercase tracking-wider">
                <th className="py-3 px-4 text-center w-14">Rank</th>
                <th className="py-3 px-4">Builder</th>
                <th className="py-3 px-4 hidden md:table-cell">Campus</th>
                {problems.map((p, idx) => (
                  <th key={p.id} className="py-3 px-3 text-center hidden sm:table-cell">
                    P{idx + 1} ({p.points})
                  </th>
                ))}
                <th className="py-3 px-4 text-right">Score</th>
                <th className="py-3 px-4 text-right">Time</th>
                <th className="py-3 px-4 text-right hidden lg:table-cell">XP</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border/40">
              {filtered.map((entry) => (
                <tr
                  key={entry.participantId}
                  className={`transition-colors hover:bg-accent/40 ${
                    entry.isCurrentUser
                      ? 'bg-primary/10 dark:bg-emerald-950/20 border-l-4 border-l-primary'
                      : ''
                  }`}
                >
                  {/* Rank */}
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    {medalDisplay(entry.rank)}
                  </td>

                  {/* Builder Info */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="relative w-8 h-8 rounded-full bg-muted flex items-center justify-center font-bold text-xs text-foreground overflow-hidden border border-border shrink-0">
                        {entry.avatarUrl ? (
                          <Image
                            src={entry.avatarUrl}
                            alt={entry.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <span>
                            {(entry.name || entry.username || 'B')
                              .slice(0, 2)
                              .toUpperCase()}
                          </span>
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="font-bold text-foreground truncate max-w-[140px] sm:max-w-none">
                            {entry.name}
                          </p>
                          {entry.isCurrentUser && (
                            <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-primary text-primary-foreground shadow-xs">
                              YOU
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] font-mono text-muted-foreground truncate">
                          @{entry.username}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Campus */}
                  <td className="py-3.5 px-4 hidden md:table-cell whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground font-medium">
                      <GraduationCap size={13} className="shrink-0" />
                      <span className="truncate max-w-[150px]">{entry.college}</span>
                    </span>
                  </td>

                  {/* Problem Scores */}
                  {problems.map((p) => {
                    const probScore = entry.problemScores[p.id];
                    const isCorrect = probScore?.isCorrect;

                    return (
                      <td
                        key={p.id}
                        className="py-3.5 px-3 text-center whitespace-nowrap hidden sm:table-cell font-mono text-[11px]"
                      >
                        {probScore ? (
                          isCorrect ? (
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                              +{probScore.score}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">0</span>
                          )
                        ) : (
                          <span className="text-muted-foreground/40">-</span>
                        )}
                      </td>
                    );
                  })}

                  {/* Total Score */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap font-mono font-black text-foreground">
                    <span>{entry.score}</span>
                    <span className="text-[10px] font-normal text-muted-foreground ml-0.5">
                      /{competition.totalPoints}
                    </span>
                  </td>

                  {/* Time Elapsed (Tiebreak) */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap font-mono text-muted-foreground">
                    <span className="inline-flex items-center gap-1 text-foreground">
                      <Clock size={11} className="text-muted-foreground" />
                      <span>{formatTime(entry.timeTakenSeconds)}</span>
                    </span>
                  </td>

                  {/* XP */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap font-mono font-bold text-primary dark:text-emerald-400 hidden lg:table-cell">
                    +{entry.xpAwarded} XP
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}

