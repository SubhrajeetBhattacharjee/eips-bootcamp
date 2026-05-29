// apps/web/app/components/rewards/XPOverviewCard.tsx

'use client';

import React from 'react';
import { UserXPData } from '@/app/lib/rewards';

interface XPOverviewCardProps {
  data: UserXPData;
}

export const XPOverviewCard: React.FC<XPOverviewCardProps> = ({ data }) => {
  const progressRatio = data.currentXP / (data.currentXP + data.nextRewardUnlock);

  return (
    <div className="relative mb-8">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 via-transparent to-emerald-600/5 rounded-2xl blur-xl" />

      {/* Main Card */}
      <div className="relative bg-gradient-to-br from-slate-800/80 via-slate-900/60 to-slate-900/40 backdrop-blur-xl border border-emerald-500/20 rounded-2xl p-8 shadow-xl">
        {/* Grid of Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Your Balance */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-emerald-500 font-bold text-lg">XP</span>
              <span className="text-gray-500 text-sm">Current</span>
            </div>
            <div className="text-3xl lg:text-4xl font-bold text-white">
              {data.currentXP.toLocaleString()}
            </div>
            <p className="text-xs text-gray-400">Keep earning to unlock more!</p>
          </div>

          {/* Rewards Redeemed */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">🎁</span>
              <span className="text-gray-500 text-sm">Redeemed</span>
            </div>
            <div className="text-3xl lg:text-4xl font-bold text-white">
              {data.rewardsRedeemed}
            </div>
            <p className="text-xs text-gray-400">Total rewards claimed</p>
          </div>

          {/* Total Value Unlocked */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">💰</span>
              <span className="text-gray-500 text-sm">Value</span>
            </div>
            <div className="text-3xl lg:text-4xl font-bold text-white">
              ${data.totalValueUnlocked}
            </div>
            <p className="text-xs text-gray-400">Across all rewards</p>
          </div>

          {/* Next Reward */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">🔓</span>
              <span className="text-gray-500 text-sm">Next Unlock</span>
            </div>
            <div className="text-3xl lg:text-4xl font-bold text-white">
              {data.nextRewardUnlock}
            </div>
            <p className="text-xs text-gray-400">XP needed</p>
          </div>
        </div>

        {/* Progress Bar Section */}
        <div className="pt-6 border-t border-emerald-500/10">
          <div className="flex items-end justify-between mb-3">
            <span className="text-sm font-medium text-gray-400">
              Progress to next reward
            </span>
            <span className="text-sm font-bold text-emerald-400">
              {data.currentXP} / {data.currentXP + data.nextRewardUnlock} XP
            </span>
          </div>

          {/* Progress Bar */}
          <div className="relative h-3 bg-slate-800/80 rounded-full overflow-hidden border border-emerald-500/20">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-500 ease-out shadow-lg shadow-emerald-500/50"
              style={{ width: `${(progressRatio * 100).toFixed(1)}%` }}
            />
            {/* Shimmer Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
};