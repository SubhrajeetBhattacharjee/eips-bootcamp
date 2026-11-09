'use client';

import React from 'react';
import Link from 'next/link';
import {
  Trophy,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  Calendar,
  AlertTriangle,
  Award,
} from 'lucide-react';
import { CompetitionHistoryItem } from '@/app/lib/competitions';

interface CompetitionHistoryTimelineProps {
  history: CompetitionHistoryItem[];
}

export function CompetitionHistoryTimeline({
  history,
}: CompetitionHistoryTimelineProps) {
  if (history.length === 0) {
    return (
      <div className="w-full rounded-2xl bg-card border border-border/80 p-8 sm:p-12 text-center shadow-xs">
        <div className="w-16 h-16 rounded-2xl bg-muted/60 border border-border flex items-center justify-center text-3xl mx-auto mb-4">
          ⚔️
        </div>
        <h3 className="text-lg font-bold text-foreground">
          No Competitive Contests Yet
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto mt-2 leading-relaxed">
          You haven&apos;t participated in any weekly arenas yet. Test your protocol intuition under
          timed conditions and claim your spot on the arena leaderboard!
        </p>
        <div className="mt-6">
          <Link
            href="/dashboard/competitions"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold transition-all shadow-xs"
          >
            <Trophy size={14} />
            <span>Explore Active Arenas</span>
          </Link>
        </div>
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${String(secs).padStart(2, '0')}s`;
  };

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'BEGINNER':
        return (
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            Beginner
          </span>
        );
      case 'ADVANCED':
        return (
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
            Advanced
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            Intermediate
          </span>
        );
    }
  };

  return (
    <div className="w-full space-y-4">
      {history.map((item) => {
        const isSubmitted = item.status === 'SUBMITTED';
        const isInProgress = item.status === 'IN_PROGRESS';
        const formattedDate = new Date(
          item.submittedAt || item.registeredAt,
        ).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });

        return (
          <div
            key={item.participantId}
            className="rounded-2xl bg-card border border-border/80 p-5 sm:p-6 shadow-xs hover:border-border transition-all flex flex-col md:flex-row md:items-center justify-between gap-5"
          >
            {/* Left: Metadata & Title */}
            <div className="space-y-2 max-w-xl">
              <div className="flex flex-wrap items-center gap-2">
                {getDifficultyBadge(item.difficulty)}

                {isSubmitted ? (
                  <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                    <CheckCircle2 size={11} /> Completed
                  </span>
                ) : isInProgress ? (
                  <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 animate-pulse">
                    In Progress
                  </span>
                ) : (
                  <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md bg-muted text-muted-foreground border border-border">
                    Registered
                  </span>
                )}

                <span className="text-[11px] font-mono text-muted-foreground flex items-center gap-1">
                  <Calendar size={12} /> {formattedDate}
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-foreground">
                {item.title}
              </h3>

              {/* Progress Bar & Stats */}
              {isSubmitted && (
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-muted-foreground">
                      Score: <strong className="text-foreground">{item.score}</strong> / {item.totalPoints} pts
                    </span>
                    <span className="text-foreground font-bold">{item.percentage}%</span>
                  </div>

                  <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Right: Metrics & Actions */}
            <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-start sm:items-center md:items-end lg:items-center gap-4 shrink-0">
              
              {/* Score / Rank metrics */}
              {isSubmitted && (
                <div className="flex items-center gap-4 text-xs font-mono">
                  {item.rank && (
                    <div className="text-center sm:text-right">
                      <p className="text-[10px] uppercase text-muted-foreground">Rank</p>
                      <p className="text-base font-black text-foreground">
                        {item.rank === 1 ? '🥇 #1' : item.rank === 2 ? '🥈 #2' : item.rank === 3 ? '🥉 #3' : `#${item.rank}`}
                      </p>
                    </div>
                  )}

                  <div className="text-center sm:text-right">
                    <p className="text-[10px] uppercase text-muted-foreground">Time</p>
                    <p className="text-base font-black text-muted-foreground flex items-center gap-1">
                      <Clock size={12} />
                      <span>{formatTime(item.timeTakenSeconds)}</span>
                    </p>
                  </div>

                  <div className="text-center sm:text-right">
                    <p className="text-[10px] uppercase text-muted-foreground">XP Earned</p>
                    <p className="text-base font-black text-primary dark:text-emerald-400">
                      +{item.xpAwarded}
                    </p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                {isSubmitted && item.rank && item.rank <= 3 && (
                  <Link
                    href="/dashboard/nft-rewards"
                    title="Claim or View On-Chain NFT Reward"
                    className="px-3 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-500 dark:text-amber-400 text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer shadow-xs"
                  >
                    <span>✨</span>
                    <span className="hidden lg:inline">NFT Reward</span>
                  </Link>
                )}

                {isSubmitted && (
                  <Link
                    href="/dashboard/certificates"
                    title="View Certificate"
                    className="px-3 py-2 rounded-xl bg-card hover:bg-accent border border-border text-foreground text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer shadow-xs"
                  >
                    <span>📜</span>
                    <span className="hidden lg:inline">Certificate</span>
                  </Link>
                )}

                <Link
                  href={`/dashboard/competitions/${item.slug}/leaderboard`}
                  className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-card hover:bg-accent border border-border text-foreground font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <Trophy size={13} className="text-amber-500" />
                  <span>Leaderboard</span>
                </Link>

                <Link
                  href={`/dashboard/competitions/${item.slug}`}
                  className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <span>{isSubmitted ? 'Review' : 'Continue'}</span>
                  <ArrowRight size={13} />
                </Link>
              </div>

            </div>

          </div>
        );
      })}
    </div>
  );
}

