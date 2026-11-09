'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Trophy,
  Flame,
  Calendar,
  Clock,
  Award,
  ArrowRight,
  CheckCircle2,
  Lock,
  Layers,
  Sparkles,
  Zap,
} from 'lucide-react';
import { CompetitionItem } from '@/app/lib/competitions';

interface CompetitionsListProps {
  competitions: CompetitionItem[];
  userId?: string;
  onRegister?: (competitionId: string) => void;
}

export function CompetitionsList({
  competitions,
  userId,
  onRegister,
}: CompetitionsListProps) {
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'UPCOMING' | 'COMPLETED'>('ALL');

  const activeContest = competitions.find((c) => c.status === 'ACTIVE');
  const filteredContests = competitions.filter((c) => {
    if (filter === 'ALL') return true;
    return c.status === filter;
  });

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'BEGINNER':
        return (
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            Beginner Track
          </span>
        );
      case 'ADVANCED':
        return (
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
            Advanced Track
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            Intermediate Track
          </span>
        );
    }
  };

  return (
    <div className="w-full space-y-8">
      
      {/* Active Competition Spotlight Hero */}
      {activeContest && (
        <div className="relative rounded-3xl bg-gradient-to-br from-card via-card to-accent/40 border border-border/80 p-6 sm:p-8 shadow-sm overflow-hidden">
          {/* Ambient Glow */}
          <div className="pointer-events-none absolute -top-12 -right-12 w-80 h-80 rounded-full bg-primary/10 dark:bg-emerald-500/15 blur-3xl" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            
            <div className="max-w-2xl space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-black uppercase tracking-widest">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  Live Weekly Arena
                </span>
                {getDifficultyBadge(activeContest.difficulty)}
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-foreground tracking-tight leading-tight">
                {activeContest.title}
              </h2>

              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {activeContest.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-muted-foreground pt-2">
                <span className="flex items-center gap-1.5 text-foreground font-bold">
                  <Clock size={14} className="text-primary dark:text-emerald-400" />
                  {activeContest.durationMinutes} Minutes Window
                </span>
                <span>·</span>
                <span className="flex items-center gap-1.5 text-foreground font-bold">
                  <Award size={14} className="text-amber-500" />
                  {activeContest.totalPoints} Contest Points
                </span>
                <span>·</span>
                <span className="flex items-center gap-1.5 text-primary dark:text-emerald-400 font-bold">
                  <Zap size={14} />
                  +{activeContest.xpReward} XP Reward
                </span>
              </div>
            </div>

            {/* Action CTA Box */}
            <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href={`/dashboard/competitions/${activeContest.slug}/leaderboard`}
                  className="px-4 py-3.5 rounded-xl bg-card hover:bg-accent border border-border text-foreground font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                >
                  <Trophy size={14} className="text-amber-500" />
                  <span>Standings</span>
                </Link>

                {activeContest.userParticipation?.isSubmitted ? (
                  <Link
                    href={`/dashboard/competitions/${activeContest.slug}`}
                    className="px-5 py-3.5 rounded-xl bg-accent hover:bg-accent/80 border border-border text-foreground font-bold text-xs transition-colors shadow-xs"
                  >
                    Review Answers ({activeContest.userParticipation.score}/{activeContest.totalPoints}) →
                  </Link>
                ) : activeContest.userParticipation?.isInProgress ? (
                  <Link
                    href={`/dashboard/competitions/${activeContest.slug}`}
                    className="px-6 py-3.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all animate-pulse"
                  >
                    <span>Resume Arena</span>
                    <ArrowRight size={16} />
                  </Link>
                ) : (
                  <Link
                    href={`/dashboard/competitions/${activeContest.slug}`}
                    className="px-6 py-3.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md hover:shadow-primary/20 transition-all cursor-pointer group"
                  >
                    <Flame size={16} className="text-amber-400" />
                    <span>Enter Contest Arena</span>
                    <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Arena Hub Filters & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <div>
          <h3 className="text-lg font-black text-foreground tracking-tight flex items-center gap-2">
            <Trophy size={20} className="text-amber-500" />
            <span>Weekly Competitive Arenas</span>
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Test your EVM mastery under timed conditions. Scores power seasonal trophies.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl self-start sm:self-auto">
          {(['ALL', 'ACTIVE', 'UPCOMING', 'COMPLETED'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filter === tab
                  ? 'bg-card text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab === 'ALL'
                ? 'All'
                : tab === 'ACTIVE'
                ? 'Live'
                : tab === 'UPCOMING'
                ? 'Upcoming'
                : 'Past'}
            </button>
          ))}
        </div>
      </div>

      {/* Competitions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredContests.map((comp) => {
          const isSubmitted = comp.userParticipation?.isSubmitted;
          const isInProgress = comp.userParticipation?.isInProgress;
          const isLive = comp.status === 'ACTIVE';
          const isUpcoming = comp.status === 'UPCOMING';

          return (
            <div
              key={comp.id}
              className={`rounded-2xl bg-card border border-border/80 p-5 sm:p-6 shadow-xs flex flex-col justify-between transition-all hover:border-primary/40 group ${
                isLive ? 'ring-1 ring-primary/30' : ''
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  {getDifficultyBadge(comp.difficulty)}

                  {isLive ? (
                    <span className="text-[10px] font-mono font-bold uppercase text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                      Live
                    </span>
                  ) : isUpcoming ? (
                    <span className="text-[10px] font-mono text-muted-foreground flex items-center gap-1">
                      <Calendar size={11} /> Upcoming
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-muted-foreground">
                      Concluded
                    </span>
                  )}
                </div>

                <h4 className="text-base font-bold text-foreground group-hover:text-primary dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
                  {comp.title}
                </h4>

                <p className="text-xs text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
                  {comp.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-border/60 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
                  <span>{comp.durationMinutes} mins · {comp.problemCount} problems</span>
                  <span className="font-bold text-foreground">{comp.totalPoints} pts</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    {isSubmitted ? (
                      <Link
                        href={`/dashboard/competitions/${comp.slug}`}
                        className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-accent hover:bg-accent/80 text-foreground font-bold text-xs transition-colors"
                      >
                        <CheckCircle2 size={13} className="text-emerald-500" />
                        <span>Score: {comp.userParticipation.score}/{comp.totalPoints}</span>
                      </Link>
                    ) : isInProgress ? (
                      <Link
                        href={`/dashboard/competitions/${comp.slug}`}
                        className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs transition-colors animate-pulse"
                      >
                        <span>Continue Arena</span>
                        <ArrowRight size={13} />
                      </Link>
                    ) : isLive ? (
                      <Link
                        href={`/dashboard/competitions/${comp.slug}`}
                        className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs transition-colors shadow-xs"
                      >
                        <span>Start Arena</span>
                        <ArrowRight size={13} />
                      </Link>
                    ) : (
                      <Link
                        href={`/dashboard/competitions/${comp.slug}`}
                        className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-card hover:bg-accent border border-border text-foreground font-semibold text-xs transition-colors"
                      >
                        <span>View Details</span>
                        <ArrowRight size={13} />
                      </Link>
                    )}
                  </div>

                  <Link
                    href={`/dashboard/competitions/${comp.slug}/leaderboard`}
                    title="View Leaderboard"
                    className="p-2 rounded-xl bg-card hover:bg-accent border border-border text-muted-foreground hover:text-foreground transition-colors shrink-0"
                  >
                    <Trophy size={14} className="text-amber-500" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}

