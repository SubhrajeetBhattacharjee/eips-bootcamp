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
import { MOCK_USER_XP, RewardCategory } from '@/app/lib/rewards';

export default function RewardsPage() {
  const [activeCategory, setActiveCategory] = useState<RewardCategory>('All Rewards');
  const [sortBy, setSortBy] = useState<'popular' | 'cost' | 'new'>('popular');
  const [userData, setUserData] = useState(MOCK_USER_XP);

  // TODO: Fetch real user data from API
  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     try {
  //       const clerkId = await getUserId(); // From Clerk
  //       const response = await fetch(`http://localhost:4000/users/clerk/${clerkId}`);
  //       const data = await response.json();
  //       setUserData(data);
  //     } catch (error) {
  //       console.error('Failed to fetch user data:', error);
  //     }
  //   };
  //   fetchUserData();
  // }, []);

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
            />
          </div>

          {/* Right Sidebar (1 column on desktop) */}
          <div className="lg:col-span-1 space-y-6 h-fit sticky top-8">
            {/* Progress Card */}
            <ProgressCard percentage={userData.progressPercentage} />

            {/* Earn XP Card */}
            <EarnXPCard />

            {/* Rewards History Card */}
            <RewardsHistoryCard />
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