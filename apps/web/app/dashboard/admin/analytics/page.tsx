// apps/web/app/dashboard/admin/page.tsx
import React from 'react';
import { redirect } from 'next/navigation';
import { DashboardShell } from '@/app/components/dashboard/DashboardShell';
import { AdminHero } from '@/app/components/admin/AdminHero';
import { KPIGrid } from '@/app/components/admin/KPIGrid';
import { GrowthChart } from '@/app/components/admin/GrowthChart';
import { RecentActivity } from '@/app/components/admin/RecentActivity';
import { TopUsersTable } from '@/app/components/admin/TopUsersTable';
import { SystemOverview } from '@/app/components/admin/SystemOverview';
import { PlatformHealthCard } from '@/app/components/admin/PlatformHealthCard';
import { CapAnalyticsCard } from '@/app/components/admin/CapAnalyticsCard';
import { ReferralAnalyticsCard } from '@/app/components/admin/ReferralAnalyticsCard';
import {
  verifyAdminRole,
  fetchAdminAnalytics,
  fetchGrowthData,
  fetchActivityFeed,
  fetchTopUsers,
  fetchSystemMetrics,
  fetchPlatformHealth,
  fetchCAPAnalytics,
  fetchReferralPerformance
} from '@/app/lib/admin';

export const metadata = {
  title: 'Admin Analytics | EIPsInsight',
  description: 'Monitor platform performance and ecosystem growth',
};

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
    
  // Verify admin role
  // Comment the below snippet and visit /dashboard/admin/analytics
  // const isAdmin = await verifyAdminRole();
  
  //  if (!isAdmin) {
  //    redirect('/dashboard');
  //  }

  // Fetch all data (with fallback to mock data)
  const [
    analyticsData,
    growthData,
    activityFeed,
    topUsers,
    systemMetrics,
    platformHealth,
    capAnalytics,
    referralPerformance
  ] = await Promise.all([
    fetchAdminAnalytics(),
    fetchGrowthData(),
    fetchActivityFeed(),
    fetchTopUsers(),
    fetchSystemMetrics(),
    fetchPlatformHealth(),
    fetchCAPAnalytics(),
    fetchReferralPerformance()
  ]);

  return (
    <DashboardShell>
    <div className="min-h-screen bg-background text-foreground">
      {/* Main gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent pointer-events-none -z-10" />
      
      {/* Content */}
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Hero Section */}
        <AdminHero startDate="May 1" endDate="May 31, 2024" />

        {/* KPI Grid */}
        <div className="mb-8">
          <KPIGrid data={analyticsData} />
        </div>

        {/* Main Content Grid - Chart and Activity Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Left side - Growth Chart (spans 2 columns on lg) */}
          <div className="lg:col-span-2">
            <GrowthChart data={growthData} />
          </div>

          {/* Right side - Recent Activity */}
          <div>
            <RecentActivity activities={activityFeed} />
          </div>
        </div>

        {/* Top Users Table */}
        <div className="mb-8">
          <TopUsersTable users={topUsers} />
        </div>

        {/* System Overview */}
        <div className="mb-8">
          <SystemOverview metrics={systemMetrics} />
        </div>

        {/* Right Sidebar Widgets */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <PlatformHealthCard data={platformHealth} />
          <CapAnalyticsCard data={capAnalytics} />
          <ReferralAnalyticsCard data={referralPerformance} />
        </div>

        {/* Footer spacer */}
        <div className="mt-12 pt-8 border-t border-emerald-500/10 text-center text-muted-foreground text-sm">
          <p>Last updated: {new Date().toLocaleString()}</p>
        </div>
      </div>
    </div>
    </DashboardShell>
  );
}