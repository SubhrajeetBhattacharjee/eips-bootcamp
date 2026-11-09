'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession } from '@/app/lib/auth-client';
import { DashboardShell } from '@/app/components/dashboard/DashboardShell';
import LoadingScreen from '@/app/components/ui/LoadingScreen';
import { CompetitionHistoryStats } from '@/app/components/competitions/CompetitionHistoryStats';
import { CompetitionHistoryTimeline } from '@/app/components/competitions/CompetitionHistoryTimeline';
import {
  UserCompetitionHistoryData,
  fetchUserCompetitionHistory,
} from '@/app/lib/competitions';
import { Trophy, ArrowLeft, Swords, RefreshCw } from 'lucide-react';

export default function CompetitionHistoryPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const isSignedIn = !!user;

  const [data, setData] = useState<UserCompetitionHistoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadHistory = useCallback(async (userId: string) => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/competitions/history?userId=${encodeURIComponent(userId)}`, {
        cache: 'no-store',
      });
      if (!res.ok) {
        throw new Error(`Failed to load history: ${res.status}`);
      }
      const json: UserCompetitionHistoryData = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
      setError('Unable to load competition history. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isPending) return;
    if (!isSignedIn || !user?.id) {
      router.replace('/sign-in');
      return;
    }

    loadHistory(user.id);
  }, [isPending, isSignedIn, user?.id, router, loadHistory]);

  if (isPending || (loading && !data)) {
    return <LoadingScreen text="Loading your competition track record..." />;
  }

  if (error || !data) {
    return (
      <DashboardShell>
        <div className="w-full py-16 text-center space-y-4">
          <p className="text-destructive font-bold">{error || 'History unavailable'}</p>
          <div className="flex items-center justify-center gap-3">
            <Link
              href="/dashboard/competitions"
              className="text-xs text-primary underline"
            >
              ← Back to Competitions
            </Link>
            <button
              onClick={() => user?.id && loadHistory(user.id)}
              className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-bold flex items-center gap-1.5"
            >
              <RefreshCw size={12} /> Retry
            </button>
          </div>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="space-y-6 pb-12">
        {/* Navigation Breadcrumb & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/60">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground mb-1">
              <Link
                href="/dashboard/competitions"
                className="hover:text-foreground flex items-center gap-1 transition-colors"
              >
                <ArrowLeft size={13} />
                <span>All Arenas</span>
              </Link>
              <span>/</span>
              <span className="text-foreground">Personal History</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
              Competition Track Record
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 max-w-xl leading-relaxed">
              Your historical performance across weekly arenas, accuracy percentages, and podium finishes.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <Link
              href="/dashboard/competitions"
              className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs flex items-center gap-2 transition-colors shadow-xs"
            >
              <Swords size={14} />
              <span>Enter Active Arenas</span>
            </Link>
          </div>
        </div>

        {/* Aggregate Stats Matrix */}
        <CompetitionHistoryStats stats={data.stats} />

        {/* Timeline of Past Arenas */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <Trophy size={18} className="text-amber-500" />
              <span>Contest Timeline</span>
            </h2>
            <span className="text-xs font-mono text-muted-foreground">
              {data.history.length} {data.history.length === 1 ? 'Contest' : 'Contests'} Recorded
            </span>
          </div>

          <CompetitionHistoryTimeline history={data.history} />
        </div>
      </div>
    </DashboardShell>
  );
}

