'use client';

import React from 'react';
import Image from 'next/image';
import { User, ShieldAlert, Sparkles, Trophy, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import {
  LeagueStandingUser,
  LeagueTier,
  TIER_CONFIG,
  ORDERED_TIERS,
} from '@/app/lib/leagues';

interface LeagueStandingsTableProps {
  standings: LeagueStandingUser[];
  currentTier: LeagueTier;
  promotionThresholdRank?: number;
  demotionThresholdRank?: number | null;
  hasJoinedThisWeek: boolean;
}

export function LeagueStandingsTable({
  standings,
  currentTier,
  promotionThresholdRank = 7,
  demotionThresholdRank = null,
  hasJoinedThisWeek,
}: LeagueStandingsTableProps) {
  const currentTierIdx = ORDERED_TIERS.indexOf(currentTier);
  const nextTier =
    currentTierIdx < ORDERED_TIERS.length - 1
      ? ORDERED_TIERS[currentTierIdx + 1]
      : null;
  const prevTier = currentTierIdx > 0 ? ORDERED_TIERS[currentTierIdx - 1] : null;

  if (!hasJoinedThisWeek || standings.length === 0) {
    return (
      <div className="w-full rounded-2xl bg-card border border-border/70 p-8 sm:p-12 text-center shadow-xs">
        <div className="w-16 h-16 rounded-2xl bg-muted/50 border border-border flex items-center justify-center text-3xl mx-auto mb-4">
          🏆
        </div>
        <h3 className="text-lg font-bold text-foreground">
          No Cohort Assigned Yet
        </h3>
        <p className="text-sm text-muted-foreground max-w-md mx-auto mt-2 leading-relaxed">
          You haven&apos;t earned any XP this week yet! Complete a lesson, pass a module quiz,
          or submit an assignment to claim your spot in this week&apos;s 30-student cohort.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full rounded-2xl bg-card border border-border/70 shadow-xs overflow-hidden">
      {/* Table Header */}
      <div className="p-5 sm:p-6 border-b border-border/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
            <Trophy size={18} className="text-amber-500" />
            <span>Weekly Division Cohort Standings</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Ranked by total XP earned during the current UTC competition week.
          </p>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-mono text-muted-foreground">
          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Top{' '}
            {promotionThresholdRank} Promoted
          </span>
          {demotionThresholdRank && currentTier !== 'BRONZE' && (
            <>
              <span>·</span>
              <span className="flex items-center gap-1 text-rose-500 dark:text-rose-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" /> Bottom{' '}
                {31 - demotionThresholdRank} Demoted
              </span>
            </>
          )}
        </div>
      </div>

      {/* Standings List */}
      <div className="divide-y divide-border/50">
        {standings.map((user, idx) => {
          const isFirstInSafe =
            idx > 0 &&
            standings[idx - 1].zone === 'PROMOTION' &&
            user.zone === 'SAFE';

          const isFirstInDemotion =
            idx > 0 &&
            standings[idx - 1].zone !== 'DEMOTION' &&
            user.zone === 'DEMOTION';

          const rankBadge =
            user.rank === 1 ? (
              <span className="text-xl">🥇</span>
            ) : user.rank === 2 ? (
              <span className="text-xl">🥈</span>
            ) : user.rank === 3 ? (
              <span className="text-xl">🥉</span>
            ) : (
              <span className="font-mono font-bold text-xs text-muted-foreground">
                #{user.rank}
              </span>
            );

          return (
            <React.Fragment key={user.memberId || user.userId}>
              {/* Promotion Zone Divider (if transitioning into safe) */}
              {isFirstInSafe && (
                <div className="px-4 py-2 bg-muted/40 border-y border-border/40 flex items-center justify-between text-[11px] text-muted-foreground font-mono">
                  <span className="flex items-center gap-1.5 font-bold">
                    <Minus size={12} /> SAFE ZONE
                  </span>
                  <span>Remain in {TIER_CONFIG[currentTier].name}</span>
                </div>
              )}

              {/* Demotion Zone Divider */}
              {isFirstInDemotion && currentTier !== 'BRONZE' && (
                <div className="px-4 py-2 bg-rose-500/5 dark:bg-rose-950/20 border-y border-rose-500/20 flex items-center justify-between text-[11px] text-rose-600 dark:text-rose-400 font-mono">
                  <span className="flex items-center gap-1.5 font-bold">
                    <ArrowDown size={12} /> DEMOTION ZONE
                  </span>
                  <span>
                    Demoting to {prevTier ? TIER_CONFIG[prevTier].name : 'Bronze'}
                  </span>
                </div>
              )}

              {/* User Row */}
              <div
                className={`flex items-center justify-between p-3.5 sm:px-6 transition-colors duration-150 ${
                  user.isCurrentUser
                    ? 'bg-primary/10 dark:bg-emerald-950/30 border-l-4 border-l-primary'
                    : user.zone === 'PROMOTION'
                    ? 'hover:bg-accent/40 bg-emerald-500/[0.02]'
                    : user.zone === 'DEMOTION'
                    ? 'hover:bg-accent/40 bg-rose-500/[0.02]'
                    : 'hover:bg-accent/40'
                }`}
              >
                {/* Left: Rank & Builder Info */}
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  <div className="w-8 flex items-center justify-center shrink-0">
                    {rankBadge}
                  </div>

                  {/* Avatar */}
                  <div className="relative w-9 h-9 rounded-full bg-muted flex items-center justify-center font-bold text-xs text-foreground shrink-0 overflow-hidden border border-border">
                    {user.avatarUrl ? (
                      <Image
                        src={user.avatarUrl}
                        alt={user.name || user.username}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <span>
                        {(user.name || user.username || 'U')
                          .slice(0, 2)
                          .toUpperCase()}
                      </span>
                    )}
                  </div>

                  {/* Name and Tags */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-xs sm:text-sm font-bold text-foreground truncate">
                        {user.name || user.username || 'Anonymous Builder'}
                      </p>

                      {user.isCurrentUser && (
                        <span className="text-[10px] font-mono font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary text-primary-foreground shrink-0 shadow-xs">
                          YOU
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] font-mono text-muted-foreground truncate">
                      @{user.username || 'student'}
                    </p>
                  </div>
                </div>

                {/* Right: Zone Indicator & XP */}
                <div className="flex items-center gap-4 shrink-0 text-right">
                  {/* Zone Pill */}
                  <div className="hidden sm:block">
                    {user.zone === 'PROMOTION' ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold font-mono px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        <ArrowUp size={11} />
                        <span>Promote</span>
                      </span>
                    ) : user.zone === 'DEMOTION' && currentTier !== 'BRONZE' ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold font-mono px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                        <ArrowDown size={11} />
                        <span>Demote</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-md text-muted-foreground">
                        Safe
                      </span>
                    )}
                  </div>

                  {/* XP Count */}
                  <div className="text-right">
                    <span className="font-mono font-black text-sm sm:text-base text-foreground">
                      {user.weeklyXp.toLocaleString()}
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground ml-1">
                      XP
                    </span>
                  </div>
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

