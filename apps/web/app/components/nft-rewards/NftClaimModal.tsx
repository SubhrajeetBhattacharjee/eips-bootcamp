'use client';

import React, { useState } from 'react';
import {
  X,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  Share2,
  Copy,
  Check,
  ShieldAlert,
  Loader2,
  Layers,
} from 'lucide-react';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { toast } from 'sonner';
import type { NftRewardItem } from '@/app/lib/nft-rewards';

interface NftClaimModalProps {
  isOpen: boolean;
  onClose: () => void;
  reward: NftRewardItem | null;
  onClaimSuccess: (updatedReward: NftRewardItem) => void;
}

export function NftClaimModal({
  isOpen,
  onClose,
  reward,
  onClaimSuccess,
}: NftClaimModalProps) {
  const { address, isConnected } = useAccount();
  const [manualAddress, setManualAddress] = useState('');
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimedReward, setClaimedReward] = useState<NftRewardItem | null>(null);
  const [copiedTx, setCopiedTx] = useState(false);

  if (!isOpen || !reward) return null;

  const targetWallet =
    address || reward.walletAddress || manualAddress.trim();
  const isAlreadyMinted =
    reward.status === 'MINTED' || claimedReward?.status === 'MINTED';
  const displayReward = claimedReward || reward;

  const handleClaim = async () => {
    if (!targetWallet) {
      toast.error('Please connect your Web3 wallet or enter an Ethereum address');
      return;
    }

    if (!/^0x[a-fA-F0-9]{40}$/.test(targetWallet)) {
      toast.error('Invalid Ethereum address format (must start with 0x and be 42 characters)');
      return;
    }

    setIsClaiming(true);
    try {
      const res = await fetch('/api/nft-rewards/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rewardId: reward.id,
          walletAddress: targetWallet,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to mint NFT reward');
      }

      const updated: NftRewardItem = await res.json();
      setClaimedReward(updated);
      onClaimSuccess(updated);
      toast.success('NFT Reward successfully minted to your wallet!');
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Error claiming NFT reward');
    } finally {
      setIsClaiming(false);
    }
  };

  const handleCopyTx = () => {
    if (displayReward.txHash) {
      navigator.clipboard.writeText(displayReward.txHash);
      setCopiedTx(true);
      toast.success('Transaction hash copied to clipboard');
      setTimeout(() => setCopiedTx(false), 2000);
    }
  };

  const handleShareTwitter = () => {
    const text = `I just claimed my on-chain "${displayReward.title}" commemorative NFT on @ETHShala! 🎓⛓️\n\nVerifiable Proof on Base L2:\n`;
    const url = `https://ethshala.org/dashboard/nft-rewards`;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      '_blank',
    );
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'MYTHIC':
        return 'text-amber-400 border-amber-500/40 bg-amber-500/10 shadow-amber-500/20';
      case 'LEGENDARY':
        return 'text-sky-400 border-sky-500/40 bg-sky-500/10 shadow-sky-500/20';
      case 'EPIC':
        return 'text-purple-400 border-purple-500/40 bg-purple-500/10 shadow-purple-500/20';
      default:
        return 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10 shadow-emerald-500/20';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#091a14] border border-border/70 rounded-2xl p-6 sm:p-8 text-foreground shadow-2xl overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-72 bg-primary/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-full transition-colors"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-2 border border-primary/30 bg-primary/10 text-primary">
            <Sparkles size={14} />
            {isAlreadyMinted ? 'Minted Collectible' : 'On-Chain Claim'}
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            {displayReward.title}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-2">
            {displayReward.description}
          </p>
        </div>

        {/* Visual Badge Card */}
        <div className="flex flex-col items-center justify-center py-4 my-2 relative">
          <div className="relative group">
            <div
              className={`w-36 h-36 sm:w-44 sm:h-44 rounded-2xl flex items-center justify-center p-3 border shadow-xl transition-all duration-300 ${getTierColor(
                displayReward.tier,
              )}`}
            >
              {/* Badge SVG representation */}
              <img
                src={displayReward.badgeImage}
                alt={displayReward.title}
                className="w-full h-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)]"
              />
            </div>

            <span
              className={`absolute -bottom-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase border ${getTierColor(
                displayReward.tier,
              )}`}
            >
              {displayReward.tier}
            </span>
          </div>
        </div>

        {/* Details / Claim State */}
        {isAlreadyMinted ? (
          <div className="space-y-4 mt-6">
            <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold">
                <CheckCircle2 size={16} />
                Minted on Base L2
              </div>
              <p className="text-emerald-400/80">
                Token #{displayReward.tokenId} is verifiably registered in your wallet address.
              </p>
            </div>

            <div className="space-y-2 text-xs bg-muted/20 p-3.5 rounded-xl border border-border/40 font-mono">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Recipient:</span>
                <span className="font-semibold truncate max-w-[220px]">
                  {displayReward.walletAddress}
                </span>
              </div>
              {displayReward.txHash && (
                <div className="flex items-center justify-between gap-2 pt-1 border-t border-border/20">
                  <span className="text-muted-foreground">Tx Hash:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="truncate max-w-[160px] text-primary">
                      {displayReward.txHash}
                    </span>
                    <button
                      onClick={handleCopyTx}
                      className="p-1 hover:bg-white/10 rounded transition-colors text-muted-foreground hover:text-white"
                      title="Copy transaction hash"
                    >
                      {copiedTx ? <Check size={12} /> : <Copy size={12} />}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={handleShareTwitter}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-xs transition-colors"
              >
                <Share2 size={14} />
                Share on X
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-2.5 px-4 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 mt-6">
            {/* Wallet Selection */}
            {isConnected ? (
              <div className="p-3.5 rounded-xl bg-muted/20 border border-border/50 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-muted-foreground">Target Wallet:</span>
                  <span className="text-emerald-400 font-medium flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Connected
                  </span>
                </div>
                <p className="font-mono text-white text-[11px] truncate">
                  {address}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Connect wallet to receive NFT:
                  </span>
                  <ConnectButton showBalance={false} chainStatus="none" />
                </div>

                <div className="relative flex items-center justify-center my-2">
                  <div className="border-t border-border/30 w-full" />
                  <span className="bg-[#091a14] px-2 text-[10px] text-muted-foreground uppercase tracking-wider absolute">
                    or enter address
                  </span>
                </div>

                <input
                  type="text"
                  placeholder="0x..."
                  value={manualAddress}
                  onChange={(e) => setManualAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-border/50 text-white placeholder-muted-foreground text-xs font-mono focus:outline-none focus:border-primary"
                />
              </div>
            )}

            {/* Gasless Relay Callout */}
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground px-1">
              <Sparkles size={13} className="text-primary flex-shrink-0" />
              <span>
                Gasless Mint: ETHShala sponsors the Base L2 transaction fee.
              </span>
            </div>

            {/* Claim Action */}
            <button
              onClick={handleClaim}
              disabled={isClaiming || (!address && !manualAddress.trim())}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground font-bold text-sm shadow-lg shadow-primary/20 transition-all cursor-pointer"
            >
              {isClaiming ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Broadcasting Mint to Base L2...
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  Mint NFT to Wallet
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

