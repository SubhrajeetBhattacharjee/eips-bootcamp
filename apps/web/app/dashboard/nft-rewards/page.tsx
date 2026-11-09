'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from '@/app/lib/auth-client';
import LoadingScreen from '@/app/components/ui/LoadingScreen';
import { NftRewardsHero } from '@/app/components/nft-rewards/NftRewardsHero';
import { NftBadgeCard } from '@/app/components/nft-rewards/NftBadgeCard';
import { NftClaimModal } from '@/app/components/nft-rewards/NftClaimModal';
import {
  Sparkles,
  Trophy,
  Shield,
  Layers,
  ArrowRight,
  Filter,
} from 'lucide-react';
import type { NftRewardItem, NftRewardsResponse } from '@/app/lib/nft-rewards';

export default function NftRewardsPage() {
  const { data: session, isPending: isSessionPending } = useSession();
  const [data, setData] = useState<NftRewardsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'ELIGIBLE' | 'MINTED' | 'APEX'>('ALL');
  const [selectedReward, setSelectedReward] = useState<NftRewardItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function loadRewards() {
      if (!session?.user?.id) return;
      setIsLoading(true);
      try {
        const res = await fetch(`/api/nft-rewards?userId=${session.user.id}`);
        if (res.ok) {
          const json: NftRewardsResponse = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error('Failed to load NFT rewards:', err);
      } finally {
        setIsLoading(false);
      }
    }

    if (!isSessionPending && session?.user?.id) {
      loadRewards();
    } else if (!isSessionPending && !session?.user) {
      setIsLoading(false);
    }
  }, [session, isSessionPending]);

  if (isSessionPending || (isLoading && !data)) {
    return <LoadingScreen text="Loading NFT Rewards & Honors..." />;
  }

  const rewards = data?.rewards || [];
  const stats = data?.stats || {
    total: 0,
    eligible: 0,
    minted: 0,
    mythic: 0,
    legendary: 0,
    epic: 0,
  };

  const filteredRewards = rewards.filter((r) => {
    if (activeFilter === 'ELIGIBLE') return r.status === 'ELIGIBLE';
    if (activeFilter === 'MINTED') return r.status === 'MINTED';
    if (activeFilter === 'APEX') return r.tier === 'MYTHIC' || r.tier === 'LEGENDARY';
    return true;
  });

  const handleOpenReward = (reward: NftRewardItem) => {
    setSelectedReward(reward);
    setIsModalOpen(true);
  };

  const handleClaimSuccess = (updated: NftRewardItem) => {
    if (!data) return;
    const updatedList = data.rewards.map((r) => (r.id === updated.id ? updated : r));
    setData({
      ...data,
      rewards: updatedList,
      stats: {
        ...data.stats,
        eligible: Math.max(0, data.stats.eligible - 1),
        minted: data.stats.minted + 1,
      },
    });
    setSelectedReward(updated);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fade-in">
      {/* Hero Section */}
      <NftRewardsHero stats={stats} />

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-card border border-border/50">
          <button
            onClick={() => setActiveFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeFilter === 'ALL'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            All Badges ({stats.total})
          </button>
          <button
            onClick={() => setActiveFilter('ELIGIBLE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeFilter === 'ELIGIBLE'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Ready to Mint ({stats.eligible})
          </button>
          <button
            onClick={() => setActiveFilter('MINTED')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeFilter === 'MINTED'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Minted ({stats.minted})
          </button>
          <button
            onClick={() => setActiveFilter('APEX')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeFilter === 'APEX'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Apex Rarity ({stats.mythic + stats.legendary})
          </button>
        </div>

        <div className="text-xs text-muted-foreground font-mono">
          Contract: Base L2 ERC-721
        </div>
      </div>

      {/* Rewards Grid or Empty State */}
      {filteredRewards.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredRewards.map((reward) => (
            <NftBadgeCard
              key={reward.id}
              reward={reward}
              onSelectReward={handleOpenReward}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-4 rounded-3xl bg-card border border-border/50 max-w-2xl mx-auto space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center mx-auto">
            <Sparkles size={32} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">
              {activeFilter === 'ALL'
                ? 'No NFT Rewards Earned Yet'
                : `No ${activeFilter.toLowerCase()} badges found`}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 max-w-md mx-auto">
              On-chain commemorative NFTs are awarded to top competitive builders on ETHShala.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left pt-2">
            <div className="p-3 rounded-xl bg-muted/20 border border-border/40 text-xs">
              <div className="font-bold text-foreground flex items-center gap-1.5 mb-1">
                <Trophy size={14} className="text-amber-400" />
                Arena Podiums
              </div>
              <p className="text-muted-foreground text-[11px]">
                Finish 1st, 2nd, or 3rd in any Weekly Arena competition.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-muted/20 border border-border/40 text-xs">
              <div className="font-bold text-foreground flex items-center gap-1.5 mb-1">
                <Shield size={14} className="text-purple-400" />
                Division Titan
              </div>
              <p className="text-muted-foreground text-[11px]">
                Promote to Diamond or Master tier in Weekly Leagues.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-muted/20 border border-border/40 text-xs">
              <div className="font-bold text-foreground flex items-center gap-1.5 mb-1">
                <Layers size={14} className="text-emerald-400" />
                Protocol Master
              </div>
              <p className="text-muted-foreground text-[11px]">
                Reach Level 10 Protocol Architect status with 10k+ XP.
              </p>
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/dashboard/competitions"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs shadow-md transition-all"
            >
              Enter Weekly Arenas
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      )}

      {/* Claim Modal */}
      <NftClaimModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        reward={selectedReward}
        onClaimSuccess={handleClaimSuccess}
      />
    </div>
  );
}
