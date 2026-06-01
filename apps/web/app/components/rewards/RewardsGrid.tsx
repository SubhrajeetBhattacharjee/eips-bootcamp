// apps/web/app/components/rewards/RewardsGrid.tsx

'use client';

import React, { useState, useMemo } from 'react';
import { Reward, REWARDS_DATA, RewardCategory } from '@/app/lib/rewards';
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
  const filteredAndSorted = useMemo(() => {
    let filtered = rewards;

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
    let sorted = [...filtered];
    if (sortBy === 'cost') {
      sorted.sort((a, b) => a.cost - b.cost);
    } else if (sortBy === 'new') {
      sorted.reverse();
    }
    // 'popular' is default order from REWARDS_DATA

    return sorted;
  }, [activeCategory, sortBy, rewards]);

  const handleRedeem = (rewardId: string) => {
    onRedeem(rewardId);
  };

  return (
    <div>
      {filteredAndSorted.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
            {filteredAndSorted.map((reward) => (
              <RewardCard
                key={reward.id}
                reward={reward}
                onRedeem={handleRedeem}
                isRedeemable={reward.available && userXP >= reward.cost}
              />
            ))}
          </div>

          {/* Load More Button */}
          {filteredAndSorted.length >= 8 && (
            <div className="flex justify-center">
              <button className="px-8 py-3 rounded-full border border-emerald-500/50 text-emerald-400 font-bold hover:bg-emerald-500/10 transition-all duration-300 hover:border-emerald-400">
                Load More Rewards
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16">
          <div className="text-6xl mb-4 opacity-50">📦</div>
          <h3 className="text-xl font-bold text-gray-400 mb-2">
            No rewards in this category
          </h3>
          <p className="text-gray-500">
            Check back soon for new exclusive rewards!
          </p>
        </div>
      )}
    </div>
  );
};