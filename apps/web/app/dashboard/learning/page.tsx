// apps/web/app/learning/page.tsx

'use client';

import { useSession } from '@/app/lib/auth-client';
import { DashboardShell } from '@/app/components/dashboard/DashboardShell';
import { LearningHero } from '@/app/components/learning/LearningHero';
import { LearningStatsGrid } from '@/app/components/learning/LearningStatsGrid';
import { ContinueLearningCard } from '@/app/components/learning/ContinueLearningCard';
import { LearningProgressWidget } from '@/app/components/learning/LearningProgressWidget';
import { LearningTimeline } from '@/app/components/learning/LearningTimeline';
import { RecommendedNextStep } from '@/app/components/learning/RecommendedNextStep';
import { LearningActivityFeed } from '@/app/components/learning/LearningActivityFeed';
import { UpcomingDeadlines } from '@/app/components/learning/UpcomingDeadlines';
import { AchievementBadges } from '@/app/components/learning/AchievementBadges';
import { SkillAnalytics } from '@/app/components/learning/SkillAnalytics';
import { LearningStreak } from '@/app/components/learning/LearningStreak';

export default function LearningPage() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full border-2 border-emerald-500/30 border-t-emerald-400 animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Loading learning page...</p>
          </div>
        </div>
      </DashboardShell>
    );
  }

  const displayName = session?.user?.name || 'User';

  return (
    <DashboardShell>
      <div className="space-y-5">
        {/* Hero Section */}
        <LearningHero userName={displayName} />

        {/* Learning Stats Grid */}
        <LearningStatsGrid />

        {/* Continue Learning Featured Card */}
        <ContinueLearningCard />

        {/* Progress + Timeline + Next Step */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <LearningProgressWidget />
          <LearningTimeline />
          <RecommendedNextStep />
        </div>

        {/* Activity + Deadlines */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <LearningActivityFeed />
          <UpcomingDeadlines />
        </div>

        {/* Achievements + Skills */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <AchievementBadges />
          <SkillAnalytics />
        </div>

        {/* Learning Streak */}
        <LearningStreak />
      </div>
    </DashboardShell>
  );
}