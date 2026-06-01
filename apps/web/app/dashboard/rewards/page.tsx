// apps/web/app/dashboard/rewards/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { DashboardShell } from '@/app/components/dashboard/DashboardShell';
import { RewardsHero } from '@/app/components/rewards/RewardsHero';
import { XPOverviewCard } from '@/app/components/rewards/XPOverviewCard';
import { RewardsTabs } from '@/app/components/rewards/RewardsTabs';
import { RewardsGrid } from '@/app/components/rewards/RewardsGrid';
import { ProgressCard } from '@/app/components/rewards/ProgressCard';
import { EarnXPCard } from '@/app/components/rewards/EarnXPCard';
import { RewardsHistoryCard } from '@/app/components/rewards/RewardsHistoryCard';
import { RewardCategory, Reward, UserReward } from '@/app/lib/rewards';
import { useUser } from '@clerk/nextjs';

export default function RewardsPage() {
  const { user } = useUser();
  const [activeCategory, setActiveCategory] = useState<RewardCategory>('All Rewards');
  const [sortBy, setSortBy] = useState<'popular' | 'cost' | 'new'>('popular');
  const [userData, setUserData] = useState({
    currentXP: 0,
    totalXPEarned: 0,
    rewardsRedeemed: 0,
    totalValueUnlocked: 0,
    nextRewardUnlock: 500,
    progressPercentage: 0,
  });
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [history, setHistory] = useState<UserReward[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRewardsData = async () => {
    if (!user?.id) return;
    try {
      const response = await fetch(`/api/rewards?clerkId=${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setUserData(data.userData);
        setRewards(data.rewards);
        setHistory(data.history);
      }
    } catch (error) {
      console.error('Failed to fetch rewards data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRewardsData();
  }, [user?.id]);

  const handleRedeem = async (rewardId: string) => {
    if (!user?.id) return;
    try {
      const response = await fetch('/api/rewards/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clerkId: user.id, rewardId }),
      });
      if (response.ok) {
        await fetchRewardsData(); // Refresh everything
      } else {
        const err = await response.json();
        alert(err.message || 'Failed to redeem reward');
      }
    } catch (error) {
      console.error('Failed to redeem reward:', error);
      alert('Failed to redeem reward');
    }
  };

  return (
    <DashboardShell>
    <div className="min-h-screen bg-black">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Page Layout: Main Content + Right Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 px-4 lg:px-8 py-8">
          {/* Main Content Area (3 columns on desktop) */}
          <div className="lg:col-span-3 space-y-8">
            {/* Hero Section */}
            <RewardsHero />

            {/* XP Overview Card */}
            <XPOverviewCard data={userData} />

            {/* Rewards Tabs and Sorting */}
            <RewardsTabs
              onCategoryChange={setActiveCategory}
              onSortChange={setSortBy}
            />

            {/* Rewards Grid */}
            <RewardsGrid
              activeCategory={activeCategory}
              sortBy={sortBy}
              userXP={userData.currentXP}
              rewards={rewards}
              onRedeem={handleRedeem}
            />
          </div>

          {/* Right Sidebar (1 column on desktop) */}
          <div className="lg:col-span-1 space-y-6 h-fit sticky top-8">
            {/* Progress Card */}
            <ProgressCard percentage={userData.progressPercentage} />

            {/* Earn XP Card */}
            <EarnXPCard />

            {/* Rewards History Card */}
            <RewardsHistoryCard history={history} />
          </div>
        </div>
      </div>

      {/* Mobile Responsive: Stack on smaller screens */}
      <style jsx>{`
        @media (max-width: 1024px) {
          .sticky {
            position: static;
          }
        }
      `}</style>
    </div>
    </DashboardShell>
  );
}