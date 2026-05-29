// apps/web/app/components/rewards/RewardsTabs.tsx

'use client';

import React, { useState } from 'react';
import { REWARD_CATEGORIES, RewardCategory } from '@/app/lib/rewards';

interface RewardsTabsProps {
  onCategoryChange: (category: RewardCategory) => void;
  onSortChange?: (sort: 'popular' | 'cost' | 'new') => void;
}

export const RewardsTabs: React.FC<RewardsTabsProps> = ({
  onCategoryChange,
  onSortChange,
}) => {
  const [activeTab, setActiveTab] = useState<RewardCategory>('All Rewards');
  const [sortBy, setSortBy] = useState<'popular' | 'cost' | 'new'>('popular');

  const handleTabClick = (category: RewardCategory) => {
    setActiveTab(category);
    onCategoryChange(category);
  };

  const handleSortChange = (value: 'popular' | 'cost' | 'new') => {
    setSortBy(value);
    onSortChange?.(value);
  };

  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 lg:gap-3">
        {REWARD_CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => handleTabClick(category)}
            className={`px-4 lg:px-6 py-2.5 rounded-full font-medium text-sm transition-all duration-300 whitespace-nowrap ${
              activeTab === category
                ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-400/50 shadow-lg shadow-emerald-500/20'
                : 'bg-slate-800/50 text-gray-400 border border-slate-700/50 hover:border-emerald-500/30 hover:text-emerald-300'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Sort Dropdown */}
      <div className="flex items-center gap-3">
        <span className="text-gray-500 text-sm font-medium">Sort by:</span>
        <select
          value={sortBy}
          onChange={(e) => handleSortChange(e.target.value as any)}
          className="px-4 py-2.5 rounded-full bg-slate-800/50 border border-slate-700/50 text-gray-300 text-sm font-medium focus:outline-none focus:border-emerald-500/50 focus:bg-slate-800/70 transition-all duration-200 cursor-pointer hover:border-slate-600/50"
        >
          <option value="popular">Popular</option>
          <option value="cost">Cost: Low to High</option>
          <option value="new">Newest First</option>
        </select>
      </div>
    </div>
  );
};