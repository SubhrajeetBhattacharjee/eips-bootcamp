'use client';

import React from 'react';
import { Shield, Lock, CheckCircle2, ChevronRight, Award } from 'lucide-react';
import {
  LeagueTier,
  TIER_CONFIG,
  ORDERED_TIERS,
} from '@/app/lib/leagues';

interface LeagueTierRoadmapProps {
  currentTier: LeagueTier;
}

export function LeagueTierRoadmap({ currentTier }: LeagueTierRoadmapProps) {
  const currentIdx = ORDERED_TIERS.indexOf(currentTier);

  return (
    <div className="w-full rounded-2xl bg-card border border-border/70 p-5 sm:p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
            <Award className="text-primary dark:text-emerald-400" size={20} />
            <span>ETHShala Division Hierarchy</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Climb through weekly cohorts by finishing in the Top 20% promotion zone.
          </p>
        </div>

        <div className="text-xs font-mono text-muted-foreground self-start sm:self-center bg-muted/60 px-2.5 py-1 rounded-lg">
          Tier {currentIdx + 1} of {ORDERED_TIERS.length}
        </div>
      </div>

      {/* Grid of Tiers */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {ORDERED_TIERS.map((tier, idx) => {
          const cfg = TIER_CONFIG[tier];
          const isCurrent = tier === currentTier;
          const isPassed = idx < currentIdx;
          const isLocked = idx > currentIdx;

          return (
            <div
              key={tier}
              className={`relative rounded-xl p-3.5 flex flex-col items-center text-center transition-all duration-200 border ${
                isCurrent
                  ? 'border-primary ring-2 ring-primary/25 bg-primary/5 dark:bg-emerald-950/20 shadow-xs scale-[1.02]'
                  : isPassed
                  ? 'border-border/80 bg-card/60 opacity-90'
                  : 'border-border/40 bg-muted/20 opacity-60'
              }`}
            >
              {/* Badge Top Indicator */}
              <div className="mb-2">
                {isCurrent ? (
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary text-primary-foreground shadow-xs">
                    Current
                  </span>
                ) : isPassed ? (
                  <span className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5">
                    <CheckCircle2 size={10} /> Cleared
                  </span>
                ) : (
                  <span className="text-[9px] font-mono text-muted-foreground flex items-center gap-0.5">
                    <Lock size={10} /> Locked
                  </span>
                )}
              </div>

              {/* Tier Icon */}
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-2.5 border ${cfg.borderColor} ${cfg.badgeColor}`}
              >
                <span>{cfg.icon}</span>
              </div>

              {/* Division Title */}
              <h3 className="text-xs font-bold text-foreground truncate w-full">
                {cfg.name.replace(' Division', '')}
              </h3>

              {/* Min XP info */}
              <p className="text-[10px] text-muted-foreground font-mono mt-1">
                {cfg.minXpToStay > 0 ? `${cfg.minXpToStay}+ XP` : 'Open'}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

