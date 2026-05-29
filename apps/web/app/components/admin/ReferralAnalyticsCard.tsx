// apps/web/app/components/admin/ReferralAnalyticsCard.tsx
'use client';

import React from 'react';
import { ReferralPerformanceData } from '@/app/lib/admin';
import { Share2, TrendingUp, Zap } from 'lucide-react';

interface ReferralAnalyticsCardProps {
  data: ReferralPerformanceData;
}

export function ReferralAnalyticsCard({ data }: ReferralAnalyticsCardProps) {
  return (
    <div className="rounded-xl border border-emerald-500/20 bg-black/40 backdrop-blur-xl overflow-hidden shadow-lg shadow-emerald-500/10 p-6">
      <h3 className="text-white font-semibold text-lg mb-6 flex items-center gap-2">
        <Share2 className="w-5 h-5 text-blue-400" />
        Referral Performance
      </h3>

      <div className="space-y-5">
        {/* Total Referrals */}
        <div className="rounded-lg bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-sm font-medium">Total Referrals</p>
            <Share2 className="w-4 h-4 text-blue-400 opacity-60" />
          </div>
          <p className="text-white text-3xl font-bold">
            {data.totalReferrals.toLocaleString()}
          </p>
          <p className="text-blue-400/70 text-xs mt-2">↑ 8.5% from last month</p>
        </div>

        {/* Conversion Rate */}
        <div className="rounded-lg bg-gradient-to-br from-emerald-500/10 to-green-500/10 border border-emerald-500/20 p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-sm font-medium">Conversion Rate</p>
            <TrendingUp className="w-4 h-4 text-emerald-400 opacity-60" />
          </div>
          <p className="text-white text-3xl font-bold">
            {data.conversionRate}%
          </p>
          <p className="text-emerald-400/70 text-xs mt-2">↑ 3.2% from last month</p>
        </div>

        {/* XP Generated */}
        <div className="rounded-lg bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-sm font-medium">XP Generated</p>
            <Zap className="w-4 h-4 text-amber-400 opacity-60" />
          </div>
          <p className="text-white text-3xl font-bold">
            {(data.xpGenerated / 1000).toFixed(1)}K
          </p>
          <p className="text-amber-400/70 text-xs mt-2">↑ 12.1% from last month</p>
        </div>
      </div>

      {/* Stats summary */}
      <div className="mt-6 pt-6 border-t border-emerald-500/10">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-gray-500 text-xs mb-1">Avg. Reward</p>
            <p className="text-emerald-400 font-semibold text-sm">
              {(data.xpGenerated / data.totalReferrals).toFixed(0)} XP
            </p>
          </div>
          <div>
            <p className="text-gray-500 text-xs mb-1">Active Rate</p>
            <p className="text-emerald-400 font-semibold text-sm">92%</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs mb-1">Avg. Join Time</p>
            <p className="text-emerald-400 font-semibold text-sm">2.3h</p>
          </div>
        </div>
      </div>
    </div>
  );
}