'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Users,
  Sparkles,
  Clock,
  CheckCircle2,
  Check,
  Loader2,
  ArrowRight,
  Shield,
  Trophy,
} from 'lucide-react';
import { toast } from 'sonner';
import type { CommunityChallengeItem } from '@/app/lib/community-challenges';

interface CommunityChallengeCardProps {
  challenge: CommunityChallengeItem;
  userId?: string;
  onUpdate: (updated: CommunityChallengeItem) => void;
}

export function CommunityChallengeCard({
  challenge,
  userId,
  onUpdate,
}: CommunityChallengeCardProps) {
  const [isJoining, setIsJoining] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);

  const isCompleted = challenge.status === 'COMPLETED' || challenge.progressPercent >= 100;
  const isJoined = challenge.userParticipation.isJoined;
  const isClaimed = challenge.userParticipation.isClaimed;
  const isEligibleToClaim = challenge.userParticipation.isEligibleToClaim;
  const contributionCount = challenge.userParticipation.contributionCount;

  const handleJoin = async () => {
    if (!userId) {
      toast.error('Please sign in to join this community mission');
      return;
    }

    setIsJoining(true);
    try {
      const res = await fetch('/api/community-challenges/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ challengeId: challenge.id, userId }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to join challenge');
      }

      onUpdate({
        ...challenge,
        userParticipation: {
          ...challenge.userParticipation,
          isJoined: true,
        },
        participantsCount: challenge.participantsCount + 1,
      });

      toast.success(`Joined "${challenge.title}"! Every action counts towards the goal.`);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Error joining challenge');
    } finally {
      setIsJoining(false);
    }
  };

  const handleClaim = async () => {
    if (!userId || isClaiming || !isEligibleToClaim) return;

    setIsClaiming(true);
    try {
      const res = await fetch('/api/community-challenges/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ challengeId: challenge.id, userId }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to claim reward');
      }

      onUpdate({
        ...challenge,
        userParticipation: {
          ...challenge.userParticipation,
          isClaimed: true,
          isEligibleToClaim: false,
        },
      });

      toast.success(`Claimed +${challenge.xpReward} XP for "${challenge.title}"! 🎉`);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Error claiming reward');
    } finally {
      setIsClaiming(false);
    }
  };

  const formatCountdown = (totalSeconds: number) => {
    if (totalSeconds <= 0) return 'Ended';
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    if (days > 0) return `${days}d ${hours}h left`;
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return `${hours}h ${minutes}m left`;
  };

  const getActionLink = () => {
    switch (challenge.category) {
      case 'LEARNING':
        return '/dashboard/my-modules';
      case 'COMPETITION':
        return '/dashboard/competitions';
      case 'ASSIGNMENT':
        return '/dashboard/assignments';
      default:
        return '/dashboard';
    }
  };

  return (
    <div className="flex flex-col justify-between p-5 sm:p-6 rounded-2xl bg-card border border-border/70 hover:border-primary/40 transition-all shadow-xs space-y-5">
      {/* Top Meta: Badge Artwork + Title + Status */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-xl bg-muted/20 border border-border/50 p-2 flex items-center justify-center shrink-0">
              {challenge.bannerImage ? (
                <img
                  src={challenge.bannerImage}
                  alt={challenge.title}
                  className="w-full h-full object-contain filter drop-shadow-md"
                />
              ) : (
                <Users size={24} className="text-primary" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded-md bg-muted text-muted-foreground border border-border/40">
                  {challenge.category}
                </span>

                {isCompleted ? (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                    <CheckCircle2 size={11} />
                    Goal Reached
                  </span>
                ) : (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20">
                    Active Mission
                  </span>
                )}
              </div>

              <h3 className="font-bold text-base sm:text-lg text-foreground tracking-tight line-clamp-1">
                {challenge.title}
              </h3>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-primary dark:text-emerald-400 bg-primary/10 px-2 py-1 rounded-lg">
              +{challenge.xpReward} XP
            </span>
          </div>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
          {challenge.description}
        </p>

        {challenge.rewardBadge && (
          <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Sparkles size={12} />
            <span>Title Unlock: &ldquo;{challenge.rewardBadge}&rdquo;</span>
          </div>
        )}
      </div>

      {/* Collective Progress Bar */}
      <div className="space-y-1.5 pt-1">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-muted-foreground">Community Progress</span>
          <span className="font-bold text-foreground">
            {challenge.currentCount.toLocaleString()} / {challenge.targetCount.toLocaleString()} ({challenge.progressPercent}%)
          </span>
        </div>

        <div className="w-full h-2 rounded-full bg-muted/60 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isCompleted
                ? 'bg-emerald-400'
                : 'bg-gradient-to-r from-primary to-emerald-400'
            }`}
            style={{ width: `${challenge.progressPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-0.5">
          <span className="flex items-center gap-1">
            <Users size={12} />
            {challenge.participantsCount} Builders Participating
          </span>
          <span className="flex items-center gap-1 font-mono">
            <Clock size={12} />
            {formatCountdown(challenge.remainingSeconds)}
          </span>
        </div>
      </div>

      {/* User Contribution HUD & Top Contributors */}
      <div className="p-3 rounded-xl bg-muted/20 border border-border/40 text-xs flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase font-bold text-muted-foreground block">
            Your Contribution
          </span>
          <span className="font-bold text-foreground">
            {isJoined
              ? `${contributionCount} actions recorded`
              : 'Not joined yet'}
          </span>
        </div>

        {challenge.topContributors.length > 0 && (
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-muted-foreground block">
              Top Contributors
            </span>
            <div className="flex items-center justify-end -space-x-1 mt-0.5">
              {challenge.topContributors.slice(0, 3).map((c) => (
                <div
                  key={c.userId}
                  title={`${c.name} (${c.contributionCount} actions)`}
                  className="w-5 h-5 rounded-full bg-primary/20 border border-border text-[9px] font-bold text-primary flex items-center justify-center overflow-hidden"
                >
                  {c.name.slice(0, 2).toUpperCase()}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="pt-2 border-t border-border/30">
        {isClaimed ? (
          <div className="w-full py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center gap-1.5">
            <Check size={14} />
            Community Reward Claimed
          </div>
        ) : isEligibleToClaim ? (
          <button
            onClick={handleClaim}
            disabled={isClaiming}
            className="w-full py-2.5 px-4 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-primary/20 transition-all cursor-pointer"
          >
            {isClaiming ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Sparkles size={14} />
            )}
            Claim +{challenge.xpReward} XP Reward
          </button>
        ) : isJoined ? (
          <div className="flex items-center gap-2">
            <Link
              href={getActionLink()}
              className="flex-1 py-2 px-3 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs flex items-center justify-center gap-1 transition-all"
            >
              <span>Contribute Now</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        ) : (
          <button
            onClick={handleJoin}
            disabled={isJoining}
            className="w-full py-2.5 px-4 rounded-xl bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            {isJoining ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Users size={14} />
            )}
            Join Community Mission
          </button>
        )}
      </div>
    </div>
  );
}

