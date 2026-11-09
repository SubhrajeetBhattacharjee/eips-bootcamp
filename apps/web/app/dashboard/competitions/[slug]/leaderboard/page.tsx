'use client';

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession } from '@/app/lib/auth-client';
import { DashboardShell } from '@/app/components/dashboard/DashboardShell';
import LoadingScreen from '@/app/components/ui/LoadingScreen';
import { CompetitionLeaderboardHero } from '@/app/components/competitions/CompetitionLeaderboardHero';
import { CompetitionLeaderboardTable } from '@/app/components/competitions/CompetitionLeaderboardTable';
import {
  CompetitionLeaderboardData,
  fetchCompetitionLeaderboard,
} from '@/app/lib/competitions';
import { ArrowLeft, RefreshCw } from 'lucide-react';

export default function CompetitionLeaderboardPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const router = useRouter();
  const { slug } = use(params);
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const isSignedIn = !!user;

  const [data, setData] = useState<CompetitionLeaderboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async (userId?: string) => {
    try {
      setLoading(true);
      setError(null);
      const query = userId ? `?userId=${encodeURIComponent(userId)}` : '';
      const res = await fetch(`/api/competitions/${slug}/leaderboard${query}`, {
        cache: 'no-store',
      });
      if (!res.ok) {
        throw new Error(`Failed to load leaderboard: ${res.status}`);
      }
      const json: CompetitionLeaderboardData = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
      setError('Unable to load leaderboard. Please try again.');
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

    loadData(user.id);
  }, [isPending, isSignedIn, user?.id, slug]);

  if (isPending || (loading && !data)) {
    return <LoadingScreen text="Calculating contest rankings and tiebreaks..." />;
  }

  if (error || !data) {
    return (
      <DashboardShell>
        <div className="w-full py-16 text-center space-y-4">
          <p className="text-destructive font-bold">{error || 'Leaderboard unavailable'}</p>
          <div className="flex items-center justify-center gap-3">
            <Link
              href="/dashboard/competitions"
              className="text-xs text-primary underline"
            >
              ← Back to Competitions
            </Link>
            <button
              onClick={() => user?.id && loadData(user.id)}
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
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
          <Link
            href="/dashboard/competitions"
            className="hover:text-foreground flex items-center gap-1 transition-colors"
          >
            <ArrowLeft size={13} />
            <span>All Arenas</span>
          </Link>
          <span>/</span>
          <Link
            href={`/dashboard/competitions/${slug}`}
            className="hover:text-foreground transition-colors truncate max-w-xs"
          >
            {data.competition.title}
          </Link>
          <span>/</span>
          <span className="text-foreground">Official Standings</span>
        </div>

        {/* Hero Banner with User HUD */}
        <CompetitionLeaderboardHero data={data} />

        {/* Standings & Tiebreaker Grid */}
        <CompetitionLeaderboardTable data={data} />
      </div>
    </DashboardShell>
  );
}

