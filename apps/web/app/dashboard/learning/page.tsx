'use client';

import { useSession } from '@/app/lib/auth-client';
import { DashboardShell } from '@/app/components/dashboard/DashboardShell';
import LoadingScreen from '@/app/components/ui/LoadingScreen';
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
import { useEffect, useState } from 'react';
import { getLearningData, type LearningData } from '@/app/actions/learning';

export default function LearningPage() {
  const { data: session, isPending } = useSession();
  const [learningData, setLearningData] = useState<LearningData | null>(null);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!isPending && session?.user) {
      getLearningData().then(data => {
        setLearningData(data);
        setDataLoading(false);
      });
    } else if (!isPending) {
      setDataLoading(false);
    }
  }, [isPending, session]);

  if (isPending || dataLoading) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center h-96">
          <div className="w-full flex items-center justify-center py-20">
            <LoadingScreen text="LOADING LEARNING MODULE..." fullScreen={false} />
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
        <LearningHero userName={displayName} stats={learningData?.stats} streakData={learningData?.streak} />

        {/* Learning Stats Grid */}
        <LearningStatsGrid stats={learningData?.stats} />

        {/* Continue Learning Featured Card */}
        <ContinueLearningCard inProgress={learningData?.inProgress} />

        {/* Progress + Timeline + Next Step */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <LearningProgressWidget stats={learningData?.stats} />
          <LearningTimeline timeline={learningData?.timeline} />
          <RecommendedNextStep nextStep={learningData?.nextStep} />
        </div>

        {/* Activity + Deadlines */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <LearningActivityFeed activity={learningData?.activity} />
          <UpcomingDeadlines deadlines={learningData?.deadlines} />
        </div>

        {/* Achievements + Skills */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <AchievementBadges stats={learningData?.stats} />
          <SkillAnalytics skills={learningData?.skills} />
        </div>

        {/* Learning Streak */}
        <LearningStreak streakData={learningData?.streak} />
      </div>
    </DashboardShell>
  );
}