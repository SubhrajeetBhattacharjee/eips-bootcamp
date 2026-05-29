// apps/web/app/components/admin/KPIGrid.tsx
'use client';

import React from 'react';
import {
  Users,
  TrendingUp,
  BookOpen,
  Zap,
  Gift,
  FileText
} from 'lucide-react';
import { KPICard } from '@/app/components/admin/KPICard';
import { AdminAnalyticsData } from '@/app/lib/admin';

interface KPIGridProps {
  data: AdminAnalyticsData;
}

export function KPIGrid({ data }: KPIGridProps) {
  const kpis = [
    {
      title: 'Total Users',
      value: data.totalUsers.value,
      change: data.totalUsers.change,
      icon: Users,
      color: 'emerald' as const
    },
    {
      title: 'Active Learners',
      value: data.activeLearnersMonth.value,
      change: data.activeLearnersMonth.change,
      icon: TrendingUp,
      color: 'blue' as const
    },
    {
      title: 'Modules Completed',
      value: data.modulesCompleted.value,
      change: data.modulesCompleted.change,
      icon: BookOpen,
      color: 'emerald' as const
    },
    {
      title: 'XP Awarded',
      value: data.xpAwarded.value,
      change: data.xpAwarded.change,
      icon: Zap,
      color: 'amber' as const
    },
    {
      title: 'Rewards Distributed',
      value: data.rewardsDistributed.value,
      change: data.rewardsDistributed.change,
      icon: Gift,
      color: 'emerald' as const
    },
    {
      title: 'Pending Applications',
      value: data.pendingCAPApplications.value,
      change: data.pendingCAPApplications.change,
      icon: FileText,
      color: 'violet' as const
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 gap-4">
      {kpis.map((kpi) => (
        <KPICard
          key={kpi.title}
          title={kpi.title}
          value={kpi.value}
          change={kpi.change}
          icon={kpi.icon}
          color={kpi.color}
        />
      ))}
    </div>
  );
}