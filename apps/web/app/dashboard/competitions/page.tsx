'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession } from '@/app/lib/auth-client';
import { DashboardShell } from '@/app/components/dashboard/DashboardShell';
import LoadingScreen from '@/app/components/ui/LoadingScreen';
import { CompetitionsList } from '@/app/components/competitions/CompetitionsList';
import { CompetitionItem } from '@/app/lib/competitions';
import { Trophy, Swords, Zap, RefreshCw } from 'lucide-react';

export default function CompetitionsPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const isSignedIn = !!user;

  const [competitions, setCompetitions] = useState<CompetitionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCompetitions = useCallback(async (userId?: string) => {
    try {
      setLoading(true);
      setError(null);
      const query = userId ? `?userId=${encodeURIComponent(userId)}` : '';
      const res = await fetch(`/api/competitions${query}`, { cache: 'no-store' });
      if (!res.ok) {
        throw new Error(`Failed to load competitions: ${res.status}`);
      }
      const data: CompetitionItem[] = await res.json();
      setCompetitions(data);
    } catch (err) {
      console.error(err);
      setError('Unable to load weekly competitions. Please try again.');
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

    loadCompetitions(user.id);
  }, [isPending, isSignedIn, user?.id, router, loadCompetitions]);

  if (isPending || (loading && competitions.length === 0)) {
    return <LoadingScreen text="Loading weekly competitive arenas..." />;
  }

  if (error) {
    return (
      <DashboardShell>
        <div className="w-full py-16 flex flex-col items-center justify-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center text-2xl mb-4">
            ⚠️
          </div>
          <h2 className="text-xl font-bold text-foreground">{error}</h2>
          <button
            onClick={() => user?.id && loadCompetitions(user.id)}
            className="mt-4 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold flex items-center gap-2 hover:bg-primary/90 transition-colors cursor-pointer"
          >
            <RefreshCw size={14} /> Retry
          </button>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="space-y-6 pb-12">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/60">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground">
                Competitive Learning // CodeChef Style
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
              Weekly Arenas
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 max-w-xl leading-relaxed">
              Timed Ethereum protocol challenges testing EVM execution, smart contract security, and EIP standards.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/competitions/history"
              className="px-3.5 py-2 rounded-xl bg-card hover:bg-accent border border-border text-foreground font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Trophy size={14} className="text-amber-500" />
              <span>My History</span>
            </Link>

            <Link
              href="/dashboard/leagues"
              className="px-3.5 py-2 rounded-xl bg-card hover:bg-accent border border-border text-foreground font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <span>Weekly Leagues</span>
              <span>🛡️</span>
            </Link>
          </div>
        </div>

        {/* Competitions List */}
        <CompetitionsList
          competitions={competitions}
          userId={user?.id}
        />
      </div>
    </DashboardShell>
  );
}

