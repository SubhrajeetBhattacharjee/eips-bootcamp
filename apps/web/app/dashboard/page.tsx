'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/app/lib/auth-client';
import { DashboardShell } from '@/app/components/dashboard/DashboardShell';
import LoadingScreen from '@/app/components/ui/LoadingScreen';
import { CampusCommandHub } from '@/app/components/dashboard/CampusCommandHub';
import { CampusArena } from '@/app/components/dashboard/CampusArena';
import { linkReferral } from '@/app/actions/referrals';
import { AlertCircle, RefreshCw } from 'lucide-react';
import type { DashboardData } from '@/app/lib/dashboard';

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const isSignedIn = !!user;
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userId = user?.id;

  const loadDashboard = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);

    try {
      // Link referral non-blockingly so it doesn't delay dashboard initialization
      linkReferral().catch((e) => console.warn('Referral link check:', e));

      const res = await fetch(`/api/dashboard?userId=${encodeURIComponent(userId)}`, {
        cache: 'no-store',
      });

      if (!res.ok) {
        throw new Error(`Failed to load dashboard: ${res.status}`);
      }

      const data = (await res.json()) as DashboardData;
      setDashboard(data);
    } catch (err: any) {
      console.error('Dashboard load error:', err);
      setError(err?.message || 'Failed to load dashboard data');
      setDashboard(null);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (isPending) return;

    if (!isSignedIn || !userId) {
      router.replace('/sign-in');
      return;
    }

    loadDashboard();
  }, [isPending, isSignedIn, router, userId, loadDashboard]);

  if (isPending || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <LoadingScreen text="INITIALIZING DASHBOARD..." />
      </div>
    );
  }

  if (error || !dashboard) {
    return (
      <DashboardShell>
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center">
            <AlertCircle size={32} />
          </div>
          <h2 className="text-2xl font-black text-foreground">Could Not Load Dashboard</h2>
          <p className="text-muted-foreground text-sm max-w-md">
            We encountered an issue syncing with the campus protocol state. Please retry to reconnect.
          </p>
          <button
            onClick={() => loadDashboard()}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-xs hover:bg-primary/90 transition-all cursor-pointer"
          >
            <RefreshCw size={14} />
            <span>Retry Connection</span>
          </button>
        </div>
      </DashboardShell>
    );
  }

  const validSessionName = user?.name && user.name.toLowerCase() !== 'learner' && user.name.toLowerCase() !== 'explorer' ? user.name : null;
  const validDashboardUser = dashboard.user.username && dashboard.user.username.toLowerCase() !== 'learner' && dashboard.user.username.toLowerCase() !== 'explorer' ? dashboard.user.username : null;
  const emailPrefix = user?.email ? user.email.split('@')[0] : null;
  const displayName = validDashboardUser || validSessionName || emailPrefix || 'Explorer';

  return (
    <DashboardShell>
      <div className="space-y-6">
        <CampusCommandHub
          user={{
            username: displayName,
            role: dashboard.user.role || 'Student Builder',
          }}
          xp={dashboard.xp}
          referralsCount={dashboard.referralsCount}
          capStatus={dashboard.capStatus}
          rank={dashboard.rank}
          streak={dashboard.streak ?? 0}
          streakDays={dashboard.streakDays || []}
          referralCode={dashboard.referralCode}
        />

        <CampusArena
          referralCode={dashboard.referralCode}
          referralsCount={dashboard.referralsCount}
          referralXp={dashboard.referralXp}
          xp={dashboard.xp}
          leaderboard={dashboard.leaderboard}
          recentActivity={dashboard.recentActivity}
          progressPercent={dashboard.progressPercent}
          activeModule={dashboard.activeModule}
          upcomingEvents={dashboard.upcomingEvents}
        />
      </div>
    </DashboardShell>
  );
}
