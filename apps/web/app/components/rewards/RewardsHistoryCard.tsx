// apps/web/app/components/rewards/RewardsHistoryCard.tsx

'use client';

import React, { useState } from 'react';
import { UserReward } from '@/app/lib/rewards';

interface RewardsHistoryCardProps {
  history: UserReward[];
}

export const RewardsHistoryCard: React.FC<RewardsHistoryCardProps> = ({ history }) => {
  const [showAll, setShowAll] = useState(false);

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

  const displayedHistory = showAll ? history : history.slice(0, 5);

  return (
    <div className="relative">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 to-transparent rounded-2xl blur-xl" />

      {/* Card */}
      <div className="relative bg-card/90 dark:bg-slate-900/80 backdrop-blur-xl border border-emerald-500/20 rounded-2xl p-6 sm:p-8 shadow-xl">
        {/* Background Pattern */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Title */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-foreground">Rewards History</h3>
          <span className="text-xs font-mono text-muted-foreground font-semibold">
            {history.length} {history.length === 1 ? 'item' : 'items'}
          </span>
        </div>

        {/* History Items */}
        <div className="space-y-3 mb-6">
          {displayedHistory.length > 0 ? (
            displayedHistory.map((item, index) => (
            <div
              key={index}
              className="p-3.5 rounded-xl bg-accent/40 dark:bg-slate-800/40 border border-emerald-500/10 hover:border-emerald-500/30 hover:bg-accent/60 dark:hover:bg-slate-800/60 transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-1.5">
                <span className="text-sm font-bold text-foreground">
                  {item.title}
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold text-sm font-mono">
                  -{item.xpSpent} XP
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                {formatDate(item.redeemedAt)}
              </span>
            </div>
            ))
          ) : (
            <div className="text-muted-foreground text-sm text-center py-6 border border-dashed border-border rounded-xl">
              No rewards redeemed yet.
            </div>
          )}
        </div>

        {/* View All Button */}
        {history.length > 5 && (
          <button
            type="button"
            onClick={() => setShowAll(!showAll)}
            className="w-full py-3 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold text-sm uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{showAll ? 'Show less' : `View all history (${history.length})`}</span>
            <span>{showAll ? '↑' : '→'}</span>
          </button>
        )}
      </div>
    </div>
  );
};
