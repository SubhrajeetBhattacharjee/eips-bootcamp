'use client';

import React from 'react';
import { Sparkles, CheckCircle2, ExternalLink, Shield } from 'lucide-react';
import type { NftRewardItem } from '@/app/lib/nft-rewards';

interface NftBadgeCardProps {
  reward: NftRewardItem;
  onSelectReward: (reward: NftRewardItem) => void;
}

export function NftBadgeCard({ reward, onSelectReward }: NftBadgeCardProps) {
  const isMinted = reward.status === 'MINTED';

  const getTierStyles = (tier: string) => {
    switch (tier) {
      case 'MYTHIC':
        return {
          pill: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
          border: 'hover:border-amber-500/40',
          glow: 'group-hover:bg-amber-500/10',
          badgeBg: 'bg-amber-500/5',
        };
      case 'LEGENDARY':
        return {
          pill: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
          border: 'hover:border-sky-500/40',
          glow: 'group-hover:bg-sky-500/10',
          badgeBg: 'bg-sky-500/5',
        };
      case 'EPIC':
        return {
          pill: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
          border: 'hover:border-purple-500/40',
          glow: 'group-hover:bg-purple-500/10',
          badgeBg: 'bg-purple-500/5',
        };
      default:
        return {
          pill: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
          border: 'hover:border-emerald-500/40',
          glow: 'group-hover:bg-emerald-500/10',
          badgeBg: 'bg-emerald-500/5',
        };
    }
  };

  const styles = getTierStyles(reward.tier);

  return (
    <div
      onClick={() => onSelectReward(reward)}
      className={`group relative flex flex-col justify-between p-5 rounded-2xl bg-card border border-border/70 ${styles.border} transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer overflow-hidden`}
    >
      {/* Background ambient glow on hover */}
      <div
        className={`absolute -top-16 -right-16 w-36 h-36 rounded-full blur-2xl transition-all duration-300 pointer-events-none ${styles.glow}`}
      />

      {/* Top Bar: Rarity + Status */}
      <div className="flex items-center justify-between mb-4 z-10">
        <span
          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border ${styles.pill}`}
        >
          {reward.tier}
        </span>

        {isMinted ? (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
            <CheckCircle2 size={12} />
            Token #{reward.tokenId}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-primary bg-primary/10 border border-primary/30 px-2 py-0.5 rounded-full animate-pulse">
            <Sparkles size={12} />
            Eligible to Claim
          </span>
        )}
      </div>

      {/* Badge Image Artwork */}
      <div className="flex items-center justify-center my-3 py-2 z-10">
        <div
          className={`w-28 h-28 sm:w-32 sm:h-32 rounded-xl flex items-center justify-center p-2.5 ${styles.badgeBg} transition-transform duration-300 group-hover:scale-105`}
        >
          <img
            src={reward.badgeImage}
            alt={reward.title}
            className="w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)]"
          />
        </div>
      </div>

      {/* Info Content */}
      <div className="space-y-1.5 mt-2 z-10">
        <h3 className="font-bold text-sm sm:text-base text-foreground group-hover:text-primary transition-colors line-clamp-1">
          {reward.title}
        </h3>
        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {reward.description}
        </p>

        {reward.competition && (
          <p className="text-[11px] text-muted-foreground/80 pt-1 font-mono">
            Arena: {reward.competition.title}
          </p>
        )}
      </div>

      {/* Bottom Action Footer */}
      <div className="pt-4 mt-3 border-t border-border/40 flex items-center justify-between z-10">
        {isMinted ? (
          <>
            <span className="text-[11px] font-mono text-muted-foreground truncate max-w-[150px]">
              {reward.walletAddress?.slice(0, 6)}...{reward.walletAddress?.slice(-4)}
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
              View Proof
              <ExternalLink size={12} />
            </span>
          </>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectReward(reward);
            }}
            className="w-full py-2 px-3 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-primary/20 transition-all"
          >
            <Sparkles size={13} />
            Claim NFT to Wallet
          </button>
        )}
      </div>
    </div>
  );
}

