'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/app/lib/auth-client';
import { DashboardShell } from '@/app/components/dashboard/DashboardShell';
import LoadingScreen from '@/app/components/ui/LoadingScreen';
import { AchievementsHero } from '@/app/components/achievements/AchievementsHero';
import { AchievementsGrid } from '@/app/components/achievements/AchievementsGrid';
import { UserAchievementsData } from '@/app/lib/achievements';
import { RefreshCw } from 'lucide-react';

export default function AchievementsPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const isSignedIn = !!user;

  const [data, setData] = useState<UserAchievementsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAchievements = useCallback(async (userId: string) => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/achievements?userId=${encodeURIComponent(userId)}`, {
        cache: 'no-store',
      });
      if (!res.ok) {
        throw new Error(`Failed to load achievements: ${res.status}`);
      }
      const json: UserAchievementsData = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
      setError('Unable to load achievements. Please try again.');
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

    loadAchievements(user.id);
  }, [isPending, isSignedIn, user?.id, router, loadAchievements]);

  if (isPending || (loading && !data)) {
    return <LoadingScreen text="Synchronizing protocol achievements..." />;
  }

  if (error || !data) {
    return (
      <DashboardShell>
        <div className="w-full py-16 text-center space-y-4">
          <p className="text-destructive font-bold">{error || 'Achievements unavailable'}</p>
          <button
            onClick={() => user?.id && loadAchievements(user.id)}
            className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold inline-flex items-center gap-2 hover:bg-primary/90 transition-colors cursor-pointer"
          >
            <RefreshCw size={14} /> Retry
          </button>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="space-y-8 pb-12">
        {/* Achievements Summary Hero */}
        <AchievementsHero stats={data.stats} />

        {/* Filterable Badge Showcase Grid */}
        <AchievementsGrid achievements={data.achievements} />
      </div>
    </DashboardShell>
  );
}

