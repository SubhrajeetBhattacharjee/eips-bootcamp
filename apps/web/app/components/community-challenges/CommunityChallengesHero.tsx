'use client';

import React from 'react';
import { Users, Sparkles, Target, Trophy, Flame } from 'lucide-react';

interface CommunityChallengesHeroProps {
  stats: {
    total: number;
    active: number;
    completed: number;
  };
}

export function CommunityChallengesHero({ stats }: CommunityChallengesHeroProps) {
  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-2 border border-primary/30 bg-primary/10 text-primary">
            <Users size={14} />
            Collective Protocol Missions
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
            Community Challenges
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-xl">
            Team up with builders across university chapters. Hit collective smart contract, arena, and EIP research goals to unlock community XP and commemorative titles.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-y border-border/40">
        <div className="space-y-0.5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Active Missions
          </p>
          <p className="text-xl sm:text-2xl font-black text-primary">
            {stats.active}
          </p>
          <p className="text-[11px] text-muted-foreground">In Progress Now</p>
        </div>

        <div className="space-y-0.5 sm:border-l sm:border-border/30 sm:pl-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Missions Conquered
          </p>
          <p className="text-xl sm:text-2xl font-black text-emerald-400">
            {stats.completed}
          </p>
          <p className="text-[11px] text-muted-foreground">100% Goal Reached</p>
        </div>

        <div className="space-y-0.5 sm:border-l sm:border-border/30 sm:pl-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            All-Time Challenges
          </p>
          <p className="text-xl sm:text-2xl font-black text-foreground">
            {stats.total}
          </p>
          <p className="text-[11px] text-muted-foreground">Ecosystem Milestones</p>
        </div>

        <div className="space-y-0.5 sm:border-l sm:border-border/30 sm:pl-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Collaboration Bonus
          </p>
          <p className="text-xl sm:text-2xl font-black text-amber-400 flex items-center gap-1">
            <Sparkles size={18} />
            <span>+250 XP</span>
          </p>
          <p className="text-[11px] text-muted-foreground">Per Mission Tier</p>
        </div>
      </div>
    </div>
  );
}

