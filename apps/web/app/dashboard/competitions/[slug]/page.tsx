'use client';

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession } from '@/app/lib/auth-client';
import { DashboardShell } from '@/app/components/dashboard/DashboardShell';
import LoadingScreen from '@/app/components/ui/LoadingScreen';
import { CompetitionArena } from '@/app/components/competitions/CompetitionArena';
import {
  CompetitionDetail,
  fetchCompetitionDetail,
} from '@/app/lib/competitions';
import {
  Trophy,
  Clock,
  Award,
  AlertTriangle,
  ArrowLeft,
  Play,
  CheckCircle2,
  BookOpen,
  Zap,
} from 'lucide-react';

export default function CompetitionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const router = useRouter();
  const { slug } = use(params);
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const isSignedIn = !!user;

  const [competition, setCompetition] = useState<CompetitionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDetail = async (userId?: string) => {
    try {
      setLoading(true);
      setError(null);
      const query = userId ? `?userId=${encodeURIComponent(userId)}` : '';
      const res = await fetch(`/api/competitions/${slug}${query}`, {
        cache: 'no-store',
      });
      if (!res.ok) {
        throw new Error(`Failed to load contest: ${res.status}`);
      }
      const data: CompetitionDetail = await res.json();
      setCompetition(data);
    } catch (err) {
      console.error(err);
      setError('Competition details unavailable. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isPending) return;
    if (!isSignedIn || !user?.id) {
      router.replace('/sign-in');
      return;
    }

    loadDetail(user.id);
  }, [isPending, isSignedIn, user?.id, slug]);

  const handleStartContest = async () => {
    if (!competition || starting) return;
    try {
      setStarting(true);
      const res = await fetch(`/api/competitions/${competition.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'start' }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to start arena');
      }

      const updated: CompetitionDetail = await res.json();
      setCompetition(updated);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to start contest';
      alert(msg);
    } finally {
      setStarting(false);
    }
  };

  if (isPending || (loading && !competition)) {
    return <LoadingScreen text="Loading competition arena..." />;
  }

  if (error || !competition) {
    return (
      <DashboardShell>
        <div className="w-full py-16 text-center space-y-3">
          <p className="text-destructive font-bold">{error || 'Contest not found'}</p>
          <Link
            href="/dashboard/competitions"
            className="text-xs text-primary underline"
          >
            ← Back to all competitions
          </Link>
        </div>
      </DashboardShell>
    );
  }

  const isSubmitted = competition.userParticipation?.isSubmitted;
  const isInProgress = competition.userParticipation?.isInProgress;

  return (
    <DashboardShell>
      <div className="space-y-6 pb-12">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
          <Link
            href="/dashboard/competitions"
            className="hover:text-foreground flex items-center gap-1 transition-colors"
          >
            <ArrowLeft size={13} />
            <span>All Competitions</span>
          </Link>
          <span>/</span>
          <span className="text-foreground truncate max-w-xs">{competition.title}</span>
        </div>

        {/* Condition 1: IN_PROGRESS -> Mount the Live Contest Arena */}
        {isInProgress && user?.id ? (
          <CompetitionArena competition={competition} userId={user.id} />
        ) : isSubmitted ? (
          /* Condition 2: SUBMITTED -> Show Full Solution Review and Score Report */
          <div className="space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    Contest Completed
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight mt-2">
                    {competition.title}
                  </h1>
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    href={`/dashboard/competitions/${competition.slug}/leaderboard`}
                    className="px-4 py-2.5 rounded-xl bg-card hover:bg-accent border border-border text-foreground text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Trophy size={14} className="text-amber-500" />
                    <span>View Leaderboard</span>
                  </Link>

                  <div className="text-right">
                    <p className="text-[10px] font-mono uppercase text-muted-foreground">Your Score</p>
                    <p className="text-2xl font-black text-foreground font-mono">
                      {competition.userParticipation?.score}{' '}
                      <span className="text-xs font-normal text-muted-foreground">/ {competition.totalPoints}</span>
                    </p>
                  </div>
                  {competition.userParticipation?.rank && (
                    <div className="px-3.5 py-2 rounded-xl bg-accent border border-border text-center">
                      <p className="text-[10px] font-mono uppercase text-muted-foreground">Rank</p>
                      <p className="text-xl font-black text-primary dark:text-emerald-400 font-mono">
                        #{competition.userParticipation.rank}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Problem Review Breakdown */}
              <div className="mt-6 space-y-4">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <BookOpen size={16} className="text-primary dark:text-emerald-400" />
                  <span>Problem Explanations & Solutions</span>
                </h3>

                <div className="space-y-3">
                  {competition.problems.map((prob, idx) => (
                    <div
                      key={prob.id}
                      className="p-4 sm:p-5 rounded-2xl bg-accent/30 border border-border text-xs space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 font-bold text-foreground text-sm">
                          {prob.userSubmission?.isCorrect ? (
                            <CheckCircle2 size={16} className="text-emerald-500" />
                          ) : (
                            <span className="text-rose-500 font-mono">✕</span>
                          )}
                          <span>Problem #{idx + 1}: {prob.title}</span>
                        </div>
                        <span className="font-mono font-bold text-foreground">
                          {prob.userSubmission?.scoreEarned || 0} / {prob.points} pts
                        </span>
                      </div>

                      <p className="text-muted-foreground leading-relaxed">
                        {prob.description}
                      </p>

                      <div className="flex flex-wrap gap-4 font-mono text-[11px] pt-1 border-t border-border/50">
                        <span>Your Answer: <strong>{prob.userSubmission?.answer || 'None'}</strong></span>
                        <span>Correct Answer: <strong className="text-emerald-600 dark:text-emerald-400">{prob.correctOption}</strong></span>
                      </div>

                      {prob.explanation && (
                        <div className="p-3 rounded-xl bg-card border border-border/70 text-[11px] text-muted-foreground leading-relaxed">
                          💡 <strong>Protocol Logic:</strong> {prob.explanation}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        ) : (
          /* Condition 3: NOT STARTED -> Show Briefing and "Start" button */
          <div className="max-w-3xl mx-auto rounded-3xl bg-card border border-border/80 shadow-xs p-6 sm:p-10 space-y-8">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary dark:text-emerald-400 border border-primary/20 flex items-center justify-center text-3xl mx-auto shadow-sm">
                🏆
              </div>

              <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-accent text-foreground border border-border">
                Competition Briefing
              </span>

              <h1 className="text-2xl sm:text-4xl font-black text-foreground tracking-tight">
                {competition.title}
              </h1>

              <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
                {competition.description}
              </p>
            </div>

            {/* Spec Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3.5 rounded-xl bg-accent/40 border border-border/70">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Window</p>
                <p className="text-lg font-black text-foreground font-mono mt-0.5">{competition.durationMinutes} Mins</p>
              </div>

              <div className="p-3.5 rounded-xl bg-accent/40 border border-border/70">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Problems</p>
                <p className="text-lg font-black text-foreground font-mono mt-0.5">{competition.problems.length} Questions</p>
              </div>

              <div className="p-3.5 rounded-xl bg-accent/40 border border-border/70">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Points</p>
                <p className="text-lg font-black text-foreground font-mono mt-0.5">{competition.totalPoints} Pts</p>
              </div>

              <div className="p-3.5 rounded-xl bg-accent/40 border border-border/70">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">XP Reward</p>
                <p className="text-lg font-black text-primary dark:text-emerald-400 font-mono mt-0.5">+{competition.xpReward} XP</p>
              </div>
            </div>

            {/* Competition Rules */}
            <div className="p-5 rounded-2xl bg-muted/40 border border-border/70 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                <AlertTriangle size={14} className="text-amber-500" />
                <span>Contest Regulations</span>
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {competition.rules ||
                  '1. Timer begins the moment you click "Start Arena".\n2. Server-side grading evaluates all answers upon completion.\n3. Ties are resolved by shortest submission time.'}
              </p>
            </div>

            {/* Start Button */}
            <div className="text-center pt-2">
              <button
                onClick={handleStartContest}
                disabled={starting}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm flex items-center justify-center gap-2 mx-auto shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                <Play size={16} />
                <span>{starting ? 'Initializing Arena Timer...' : 'Start Contest Arena Now'}</span>
              </button>
              <p className="text-[11px] text-muted-foreground mt-2">
                Your {competition.durationMinutes}-minute countdown will begin immediately.
              </p>
            </div>

          </div>
        )}
      </div>
    </DashboardShell>
  );
}

