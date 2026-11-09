'use client';

import React from 'react';
import { Sparkles, Trophy, Shield, CheckCircle2, Wallet } from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

interface NftRewardsHeroProps {
  stats: {
    total: number;
    eligible: number;
    minted: number;
    mythic: number;
    legendary: number;
    epic: number;
  };
}

export function NftRewardsHero({ stats }: NftRewardsHeroProps) {
  const { isConnected, address } = useAccount();

  return (
    <div className="space-y-6">
      {/* Title & Wallet Connect Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-2 border border-primary/30 bg-primary/10 text-primary">
            <Sparkles size={14} />
            Verifiable Web3 Credentials
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
            NFT Rewards & Honors
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-xl">
            Verifiable ERC-721 commemorative badges minted on Base L2. Earned through Weekly Arena podiums, division promotions, and protocol mastery.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-center">
          <ConnectButton showBalance={false} chainStatus="icon" />
        </div>
      </div>

      {/* Metrics Row (Duolingo/Clean style HUD) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-y border-border/40">
        <div className="space-y-0.5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Total Honors
          </p>
          <p className="text-xl sm:text-2xl font-black text-foreground">
            {stats.total}
          </p>
          <p className="text-[11px] text-muted-foreground">
            Earned Milestones
          </p>
        </div>

        <div className="space-y-0.5 sm:border-l sm:border-border/30 sm:pl-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Minted on Chain
          </p>
          <p className="text-xl sm:text-2xl font-black text-emerald-400">
            {stats.minted}
          </p>
          <p className="text-[11px] text-muted-foreground">
            In Web3 Wallet
          </p>
        </div>

        <div className="space-y-0.5 sm:border-l sm:border-border/30 sm:pl-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Ready to Mint
          </p>
          <p className="text-xl sm:text-2xl font-black text-primary">
            {stats.eligible}
          </p>
          <p className="text-[11px] text-muted-foreground">
            Claimable Now
          </p>
        </div>

        <div className="space-y-0.5 sm:border-l sm:border-border/30 sm:pl-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Apex Rarity
          </p>
          <p className="text-xl sm:text-2xl font-black text-amber-400">
            {stats.mythic + stats.legendary}
          </p>
          <p className="text-[11px] text-muted-foreground">
            Mythic & Legendary
          </p>
        </div>
      </div>
    </div>
  );
}

