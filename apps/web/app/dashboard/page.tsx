'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { DashboardShell } from '@/app/components/dashboard/DashboardShell';
import { WelcomeHero } from '@/app/components/dashboard/WelcomeHero';
import { StatsGrid } from '@/app/components/dashboard/StatsGrid';
import { ReferralCard } from '@/app/components/dashboard/ReferralCard';
import { LeaderboardPreview } from '@/app/components/dashboard/LeaderboardPreview';
import { ActivityFeed } from '@/app/components/dashboard/ActivityFeed';
import { LearningProgress } from '@/app/components/dashboard/LearningProgress';
import { EventsCard } from '@/app/components/dashboard/EventsCard';
import { ProgressWidget } from '@/app/components/dashboard/ProgressWidget';
import type { DashboardData } from '@/app/lib/dashboard';

export default function DashboardPage() {
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      router.replace('/sign-in');
      return;
    }

    const userId = user?.id;
    if (!userId) {
      router.replace('/sign-in');
      return;
    }

    let active = true;

    async function loadDashboard() {
      setLoading(true);

      try {
        const res = await fetch(`/api/dashboard?clerkId=${encodeURIComponent(userId)}`, {
          cache: 'no-store',
        });

        if (!res.ok) {
          throw new Error(`Failed to load dashboard: ${res.status}`);
        }

        const data = (await res.json()) as DashboardData;
        if (active) {
          setDashboard(data);
        }
      } catch {
        if (active) {
          setDashboard(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      active = false;
    };
  }, [isLoaded, isSignedIn, router, user?.id]);

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#080808] text-white">
        Loading dashboard...
      </div>
    );
  }

  if (!dashboard) {
    return null;
  }

  const displayName = dashboard.user.username !== 'Explorer' ? dashboard.user.username : (user?.fullName || user?.firstName || 'Explorer');

  return (
    <DashboardShell>
      <div className="space-y-5">
        <WelcomeHero
          user={{
            username: displayName,
            role: dashboard.user.role,
          }}
        />

        <StatsGrid
          xp={dashboard.xp}
          referralsCount={dashboard.referralsCount}
          capStatus={dashboard.capStatus}
          rank={dashboard.rank}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <ReferralCard
            referralsCount={dashboard.referralsCount}
            xp={dashboard.xp}
            referralCode={dashboard.referralCode}
          />

          <LeaderboardPreview leaderboard={dashboard.leaderboard} />

          <ActivityFeed activities={dashboard.recentActivity} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <LearningProgress />
          <EventsCard />
          <ProgressWidget />
        </div>
      </div>
    </DashboardShell>
  );
}