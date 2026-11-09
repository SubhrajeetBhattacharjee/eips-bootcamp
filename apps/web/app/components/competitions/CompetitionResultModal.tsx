'use client';

import React from 'react';
import Link from 'next/link';
import {
  Trophy,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  ArrowRight,
  BookOpen,
  Award,
} from 'lucide-react';
import { SubmitCompetitionResult } from '@/app/lib/competitions';

interface CompetitionResultModalProps {
  result: SubmitCompetitionResult;
  competitionTitle: string;
  competitionSlug?: string;
  onClose?: () => void;
}

export function CompetitionResultModal({
  result,
  competitionTitle,
  competitionSlug,
  onClose,
}: CompetitionResultModalProps) {
  const minutes = Math.floor(result.timeTakenSeconds / 60);
  const seconds = result.timeTakenSeconds % 60;
  const percentage = Math.round((result.score / result.totalPoints) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl p-6 sm:p-8 my-8 max-h-[90vh] overflow-y-auto">
        
        {/* Celebration Header */}
        <div className="text-center pb-6 border-b border-border">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center justify-center text-3xl sm:text-4xl mx-auto mb-4 shadow-sm animate-bounce">
            🏆
          </div>

          <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-primary/10 text-primary dark:text-emerald-400 border border-primary/20">
            Contest Submitted
          </span>

          <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight mt-2">
            {competitionTitle}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Official server-side score and tiebreak calculation complete.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
          <div className="p-3.5 rounded-xl bg-accent/40 border border-border/70 text-center">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Final Score
            </p>
            <p className="text-2xl font-black text-foreground mt-0.5">
              {result.score}{' '}
              <span className="text-xs font-normal text-muted-foreground">
                / {result.totalPoints}
              </span>
            </p>
            <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">
              {percentage}% Accuracy
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-accent/40 border border-border/70 text-center">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Contest Rank
            </p>
            <p className="text-2xl font-black text-foreground mt-0.5">
              #{result.rank}
            </p>
            <p className="text-[11px] font-semibold text-primary dark:text-emerald-400 mt-0.5">
              Global Leaderboard
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-accent/40 border border-border/70 text-center">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Time Taken
            </p>
            <p className="text-2xl font-black font-mono text-foreground mt-0.5">
              {minutes}m {seconds}s
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Tiebreak Metric
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-accent/40 border border-border/70 text-center">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              XP Earned
            </p>
            <p className="text-2xl font-black text-primary dark:text-emerald-400 mt-0.5">
              +{result.xpAwarded}
            </p>
            <p className="text-[11px] font-semibold text-primary dark:text-emerald-400 mt-0.5">
              Protocol XP
            </p>
          </div>
        </div>

        {/* Detailed Solutions Breakdown */}
        <div className="space-y-4 mb-6">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <BookOpen size={16} className="text-primary dark:text-emerald-400" />
            <span>Problem Review & Protocol Explanations</span>
          </h3>

          <div className="space-y-3">
            {result.problemResults.map((pr, idx) => (
              <div
                key={pr.problemId}
                className={`p-4 rounded-xl border text-xs leading-relaxed transition-all ${
                  pr.isCorrect
                    ? 'border-emerald-500/30 bg-emerald-500/5'
                    : 'border-rose-500/30 bg-rose-500/5'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 font-bold">
                    {pr.isCorrect ? (
                      <CheckCircle2
                        size={16}
                        className="text-emerald-600 dark:text-emerald-400"
                      />
                    ) : (
                      <XCircle size={16} className="text-rose-600 dark:text-rose-400" />
                    )}
                    <span className="text-foreground">Problem #{idx + 1}</span>
                  </div>

                  <span className="font-mono font-bold text-foreground">
                    {pr.scoreEarned} pts
                  </span>
                </div>

                <div className="flex flex-wrap gap-4 text-xs font-mono mb-2 text-muted-foreground">
                  <span>
                    Your Answer:{' '}
                    <strong className="text-foreground">
                      {pr.answer || 'Unanswered'}
                    </strong>
                  </span>
                  <span>
                    Correct Answer:{' '}
                    <strong className="text-emerald-600 dark:text-emerald-400">
                      {pr.correctOption}
                    </strong>
                  </span>
                </div>

                {pr.explanation && (
                  <p className="text-muted-foreground bg-card/60 p-2.5 rounded-lg border border-border/50 text-[11px]">
                    💡 <strong>Protocol Logic:</strong> {pr.explanation}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-border">
          <Link
            href="/dashboard/competitions"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-card hover:bg-accent border border-border text-foreground text-xs font-semibold text-center transition-colors cursor-pointer"
          >
            Back to Competitions
          </Link>

          <Link
            href={
              competitionSlug
                ? `/dashboard/competitions/${competitionSlug}/leaderboard`
                : '/dashboard/competitions'
            }
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <span>View Contest Leaderboard</span>
            <ArrowRight size={14} />
          </Link>
        </div>

      </div>
    </div>
  );
}

