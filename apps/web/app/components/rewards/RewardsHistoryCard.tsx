// apps/web/app/components/rewards/RewardsHistoryCard.tsx

'use client';

import React from 'react';
import { UserReward } from '@/app/lib/rewards';

interface RewardsHistoryCardProps {
  history: UserReward[];
}

export const RewardsHistoryCard: React.FC<RewardsHistoryCardProps> = ({ history }) => {
  const formatDate = (dateStr: string | Date): string => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  return (
    <div className="relative">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 to-transparent rounded-2xl blur-xl" />

      {/* Card */}
      <div className="relative bg-gradient-to-br from-slate-100/90 via-slate-200/70 to-slate-300/50
  dark:from-slate-800/80 dark:via-slate-900/60 dark:to-slate-900/40 backdrop-blur-xl border border-emerald-500/20 rounded-2xl p-8 shadow-xl">
        {/* Background Pattern */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl" />

        {/* Title */}
        <h3 className="text-lg font-bold text-foreground mb-6">Rewards History</h3>

        {/* History Items */}
        <div className="space-y-4 mb-6">
          {history.length > 0 ? (
            history.map((item, index) => (
            <div
              key={index}
              className="p-4 rounded-lg bg-slate-800/40 border border-emerald-500/10 hover:border-emerald-500/30 hover:bg-slate-800/60 transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-sm font-bold text-foreground">
                  {item.title}
                </span>
                <span className="text-emerald-400 font-bold text-sm">
                  -{item.xpSpent} XP
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                {formatDate(item.redeemedAt)}
              </span>
            </div>
            ))
          ) : (
            <div className="text-muted-foreground text-sm text-center py-4">No rewards redeemed yet.</div>
          )}
        </div>

        {/* View All Button */}
        <button className="w-full py-3 rounded-lg bg-gradient-to-r from-emerald-600/20 to-emerald-500/10 border border-emerald-500/40 text-emerald-400 font-bold text-sm uppercase tracking-wider hover:from-emerald-600/40 hover:to-emerald-500/20 hover:border-emerald-500/60 transition-all duration-300 flex items-center justify-center gap-2">
          <span>View all history</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
};