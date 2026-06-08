// apps/web/app/components/rewards/RewardCard.tsx

'use client';

import React, { useState } from 'react';
import { Reward } from '@/app/lib/rewards';

interface RewardCardProps {
  reward: Reward;
  onRedeem?: (rewardId: string) => void;
  isRedeemable?: boolean;
}

export const RewardCard: React.FC<RewardCardProps> = ({
  reward,
  onRedeem,
  isRedeemable = true,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const badgeColors: Record<string, { bg: string; text: string; border: string }> = {
    MERCH: { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/30' },
    NFT: { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30' },
    ACCESS: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' },
    EXPERIENCE: { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/30' },
    CERTIFICATE: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30' },
  };

  const badgeStyle = badgeColors[reward.badge] || badgeColors.MERCH;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative h-full"
    >
      {/* Glow Effect on Hover */}
      {isHovered && (
        <div className="absolute -inset-2 bg-gradient-to-br from-emerald-600/20 to-emerald-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      )}

      {/* Card */}
      <div className="relative h-full bg-gradient-to-br from-slate-100/90 via-slate-200/70 to-slate-300/50
  dark:from-slate-800/80 dark:via-slate-900/60 dark:to-slate-900/40 backdrop-blur-xl border border-emerald-500/20 group-hover:border-emerald-500/40 rounded-2xl p-6 transition-all duration-300 flex flex-col shadow-xl overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl" />

        {/* Badge */}
        <div className={`relative inline-flex w-fit mb-4 px-3 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider ${badgeStyle.bg} ${badgeStyle.text} ${badgeStyle.border}`}>
          {reward.badge}
        </div>

        {/* Image/Icon Area */}
        <div className="relative mb-6 h-32 lg:h-40 flex items-center justify-center bg-gradient-to-br from-slate-100/80 to-slate-200/60
dark:from-slate-700/40 dark:to-slate-800/40 border border-emerald-500/10 rounded-lg group-hover:border-emerald-500/30 transition-all duration-300">
          <div
            className="text-6xl lg:text-7xl filter drop-shadow-lg transition-transform duration-300 group-hover:scale-110"
            style={{
              textShadow:
                '0 0 20px rgba(16, 185, 129, 0.3), 0 0 40px rgba(16, 185, 129, 0.2)',
            }}
          >
            {reward.image}
          </div>
        </div>

        {/* Content */}
        <div className="relative flex-grow flex flex-col">
          <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-emerald-300 transition-colors duration-300">
            {reward.title}
          </h3>

          <p className="text-sm text-muted-foreground mb-4 flex-grow leading-relaxed">
            {reward.description}
          </p>

          {/* Cost Section */}
          <div className="flex items-baseline gap-2 mb-4 pt-4 border-t border-emerald-500/10">
            <span className="text-2xl lg:text-3xl font-bold text-emerald-400">
              {reward.cost}
            </span>
            <span className="text-sm text-muted-foreground">XP</span>
          </div>

          {/* Redeem Button */}
          <button
            onClick={() => onRedeem?.(reward.id)}
            disabled={!isRedeemable}
            className={`w-full py-3 rounded-lg font-bold uppercase text-sm tracking-wider transition-all duration-300 ${
              isRedeemable
                ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-black hover:from-emerald-500 hover:to-emerald-400 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 cursor-pointer'
                : 'bg-slate-700/50 text-foreground cursor-not-allowed opacity-50'
            }`}
          >
            {isRedeemable ? 'Redeem Now' : 'Locked'}
          </button>
        </div>
      </div>
    </div>
  );
};