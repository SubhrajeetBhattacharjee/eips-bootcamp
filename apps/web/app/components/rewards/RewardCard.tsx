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
    MERCH: { bg: 'bg-amber-500/20', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-500/30' },
    NFT: { bg: 'bg-purple-500/20', text: 'text-purple-600 dark:text-purple-400', border: 'border-purple-500/30' },
    ACCESS: { bg: 'bg-blue-500/20', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-500/30' },
    EXPERIENCE: { bg: 'bg-orange-500/20', text: 'text-orange-600 dark:text-orange-400', border: 'border-orange-500/30' },
    CERTIFICATE: { bg: 'bg-green-500/20', text: 'text-green-600 dark:text-green-400', border: 'border-green-500/30' },
  };

  const badgeStyle = badgeColors[reward.badge] || badgeColors.MERCH;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative h-full flex flex-col"
    >
      {/* Glow Effect on Hover */}
      {isHovered && (
        <div className="absolute -inset-2 bg-gradient-to-br from-emerald-600/20 to-emerald-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      )}

      {/* Card */}
      <div className="relative h-full bg-card/90 dark:bg-slate-900/80 backdrop-blur-xl border border-emerald-500/20 group-hover:border-emerald-500/40 rounded-2xl p-6 transition-all duration-300 flex flex-col shadow-lg overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Badge */}
        <div className={`relative inline-flex w-fit mb-4 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider ${badgeStyle.bg} ${badgeStyle.text} ${badgeStyle.border}`}>
          {reward.badge}
        </div>

        {/* Image/Icon Area */}
        <div className="relative mb-6 h-32 lg:h-36 flex items-center justify-center bg-accent/40 dark:bg-slate-800/40 border border-emerald-500/10 rounded-xl group-hover:border-emerald-500/30 transition-all duration-300">
          <div
            className="text-5xl lg:text-6xl filter drop-shadow-md transition-transform duration-300 group-hover:scale-110"
            style={{
              textShadow: '0 0 20px rgba(16, 185, 129, 0.25)',
            }}
          >
            {reward.image}
          </div>
        </div>

        {/* Content */}
        <div className="relative flex-grow flex flex-col">
          <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors duration-300">
            {reward.title}
          </h3>

          <p className="text-sm text-muted-foreground mb-4 flex-grow leading-relaxed">
            {reward.description}
          </p>

          {/* Cost Section */}
          <div className="flex items-baseline gap-2 mb-4 pt-4 border-t border-border">
            <span className="text-2xl lg:text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
              {reward.cost.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-muted-foreground uppercase">XP</span>
          </div>

          {/* Redeem Button */}
          <button
            type="button"
            onClick={() => onRedeem?.(reward.id)}
            disabled={!isRedeemable}
            className={`w-full py-3 rounded-xl font-bold uppercase text-xs tracking-wider transition-all duration-200 ${
              isRedeemable
                ? 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-md shadow-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-0.5 cursor-pointer'
                : 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
            }`}
          >
            {isRedeemable ? 'Redeem Reward' : 'Locked'}
          </button>
        </div>
      </div>
    </div>
  );
};
