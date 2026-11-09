'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession } from '@/app/lib/auth-client';
import { DashboardShell } from '@/app/components/dashboard/DashboardShell';
import LoadingScreen from '@/app/components/ui/LoadingScreen';
import { LeagueHero } from '@/app/components/leagues/LeagueHero';
import { LeagueTierRoadmap } from '@/app/components/leagues/LeagueTierRoadmap';
import { LeagueStandingsTable } from '@/app/components/leagues/LeagueStandingsTable';
import { LeagueRulesCard } from '@/app/components/leagues/LeagueRulesCard';
import { UserLeagueData } from '@/app/lib/leagues';
import { RefreshCw, BookOpen, Layers } from 'lucide-react';

export default function LeaguesPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const isSignedIn = !!user;

  const [leagueData, setLeagueData] = useState<UserLeagueData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeagues = useCallback(async (userId: string) => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/leagues?userId=${encodeURIComponent(userId)}`, {
        cache: 'no-store',
      });
      if (!res.ok) {
        throw new Error(`Failed to load league data: ${res.status}`);
      }
      const data: UserLeagueData = await res.json();
      setLeagueData(data);
    } catch (err) {
      console.error(err);
      setError('Unable to load league standings. Please try again.');
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

    fetchLeagues(user.id);
  }, [isPending, isSignedIn, user?.id, router, fetchLeagues]);

  if (isPending || (loading && !leagueData)) {
    return <LoadingScreen text="Assembling division cohorts and standings..." />;
  }

  if (error || !leagueData) {
    return (
      <DashboardShell>
        <div className="w-full py-16 flex flex-col items-center justify-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center text-2xl mb-4">
            ⚠️
          </div>
          <h2 className="text-xl font-bold text-foreground">
            {error || 'League data unavailable'}
          </h2>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">
            Could not retrieve your weekly cohort. Please refresh or check back shortly.
          </p>
          <button
            onClick={() => user?.id && fetchLeagues(user.id)}
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
        {/* Hero Banner with Clock and Current Division */}
        <LeagueHero data={leagueData} />

        {/* Tier Roadmap Progression */}
        <LeagueTierRoadmap currentTier={leagueData.tier} />

        {/* Main Grid: Standings Table & Side Information */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Cohort Leaderboard (2 cols on large screens) */}
          <div className="lg:col-span-2">
            <LeagueStandingsTable
              standings={leagueData.standings}
              currentTier={leagueData.tier}
              promotionThresholdRank={leagueData.promotionThresholdRank || 7}
              demotionThresholdRank={leagueData.demotionThresholdRank}
              hasJoinedThisWeek={leagueData.hasJoinedThisWeek}
            />
          </div>

          {/* Sidebar Cards */}
          <div className="space-y-6">
            {/* Rules & Rollover explanation */}
            <LeagueRulesCard />

            {/* Quick Action card */}
            <div className="rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 p-5 sm:p-6 shadow-xs">
              <h3 className="text-sm font-bold text-foreground">
                Earn More Weekly XP
              </h3>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Advance through lessons and submit assignments to climb the promotion zone before Sunday&apos;s rollover.
              </p>

              <div className="mt-4 flex flex-col gap-2">
                <Link
                  href="/dashboard/my-modules"
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold transition-colors shadow-xs"
                >
                  <Layers size={14} />
                  <span>Resume Learning</span>
                </Link>

                <Link
                  href="/dashboard/assignments"
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-card hover:bg-accent text-foreground text-xs font-semibold border border-border/80 transition-colors"
                >
                  <BookOpen size={14} />
                  <span>View Assignments</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
