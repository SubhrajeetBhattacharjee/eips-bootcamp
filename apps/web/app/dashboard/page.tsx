import { DashboardShell } from '@/app/components/dashboard/DashboardShell';
import { WelcomeHero } from '@/app/components/dashboard/WelcomeHero';
import { StatsGrid } from '@/app/components/dashboard/StatsGrid';
import { ReferralCard } from '@/app/components/dashboard/ReferralCard';
import { LeaderboardPreview } from '@/app/components/dashboard/LeaderboardPreview';
import { ActivityFeed } from '@/app/components/dashboard/ActivityFeed';
import { LearningProgress } from '@/app/components/dashboard/LearningProgress';
import { EventsCard } from '@/app/components/dashboard/EventsCard';
import { ProgressWidget } from '@/app/components/dashboard/ProgressWidget';

export default function DashboardPage() {
  return (
    <DashboardShell>
      <div className="space-y-5">
        {/* Section 1 — Hero */}
        <WelcomeHero />

        {/* Section 2 — Stats Grid */}
        <StatsGrid />

        {/* Section 3 — Referral | Leaderboard | Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <ReferralCard />
          <LeaderboardPreview />
          <ActivityFeed />
        </div>

        {/* Section 4 — Learning | Events | Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <LearningProgress />
          <EventsCard />
          <ProgressWidget />
        </div>
      </div>
    </DashboardShell>
  );
}