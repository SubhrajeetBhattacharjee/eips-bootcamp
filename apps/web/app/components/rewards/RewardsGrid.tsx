// apps/web/app/components/rewards/RewardsGrid.tsx

'use client';

import React, { useState, useMemo } from 'react';
import { Reward, RewardCategory } from '@/app/lib/rewards';
import { RewardCard } from './RewardCard';

interface RewardsGridProps {
  activeCategory: RewardCategory;
  sortBy: 'popular' | 'cost' | 'new';
  userXP: number;
  rewards: Reward[];
  onRedeem: (rewardId: string) => void;
}

export const RewardsGrid: React.FC<RewardsGridProps> = ({
  activeCategory,
  sortBy,
  userXP,
  rewards,
  onRedeem,
}) => {
  const [displayCount, setDisplayCount] = useState(8);

  const filteredAndSorted = useMemo(() => {
    let filtered = rewards || [];

    // Filter by category
    if (activeCategory !== 'All Rewards') {
      const categoryMap: Record<string, Reward['category']> = {
        Certificates: 'certificates',
        Community: 'community',
        Experiences: 'experiences',
        Merchandise: 'merchandise',
        NFTs: 'nfts',
      };
      const category = categoryMap[activeCategory];
      if (category) {
        filtered = filtered.filter((r) => r.category === category);
      }
    }

    // Sort
    const sorted = [...filtered];
    if (sortBy === 'cost') {
      sorted.sort((a, b) => a.cost - b.cost);
    } else if (sortBy === 'new') {
      sorted.reverse();
    }
    // 'popular' is default order

    return sorted;
  }, [activeCategory, sortBy, rewards]);

  const handleRedeem = (rewardId: string) => {
    onRedeem(rewardId);
  };

  const visibleRewards = filteredAndSorted.slice(0, displayCount);

  return (
    <div>
      {filteredAndSorted.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {visibleRewards.map((reward) => (
              <RewardCard
                key={reward.id}
                reward={reward}
                onRedeem={handleRedeem}
                isRedeemable={reward.available && userXP >= reward.cost}
              />
            ))}
          </div>

          {/* Load More Button */}
          {filteredAndSorted.length > displayCount && (
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => setDisplayCount((prev) => prev + 8)}
                className="px-8 py-3 rounded-full border border-emerald-500/50 text-emerald-600 dark:text-emerald-400 font-bold hover:bg-emerald-500/10 transition-all duration-300 hover:border-emerald-400 cursor-pointer"
              >
                Load More Rewards
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16">
          <div className="text-6xl mb-4 opacity-50">📦</div>
          <h3 className="text-xl font-bold text-muted-foreground mb-2">
            No rewards in this category
          </h3>
          <p className="text-muted-foreground">
            Check back soon for new exclusive rewards!
          </p>
        </div>
      )}
    </div>
  );
};
