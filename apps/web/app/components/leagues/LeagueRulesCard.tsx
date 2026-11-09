'use client';

import React from 'react';
import { Shield, Sparkles, AlertCircle, HelpCircle, Users2, CalendarClock } from 'lucide-react';

export function LeagueRulesCard() {
  return (
    <div className="rounded-2xl bg-card border border-border/70 p-5 sm:p-6 shadow-xs space-y-5">
      <div className="flex items-center gap-2">
        <HelpCircle size={18} className="text-primary dark:text-emerald-400" />
        <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
          How Leagues Work
        </h3>
      </div>

      <div className="space-y-4 text-xs text-muted-foreground leading-relaxed">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Users2 size={16} />
          </div>
          <div>
            <h4 className="font-bold text-foreground">30-Student Cohorts</h4>
            <p className="mt-0.5">
              You compete in a focused cohort of up to 30 active builders in your tier,
              not against the entire global community.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Sparkles size={16} />
          </div>
          <div>
            <h4 className="font-bold text-foreground">Top 20% Promotion</h4>
            <p className="mt-0.5">
              Finish in the top 7 of your cohort by Sunday midnight UTC to advance to the next
              division and unlock higher prestige badges.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
            <AlertCircle size={16} />
          </div>
          <div>
            <h4 className="font-bold text-foreground">Demotion Zone</h4>
            <p className="mt-0.5">
              Builders finishing in the bottom 5 of higher tiers move down one division. Bronze
              division is protected from demotion.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-muted text-muted-foreground flex items-center justify-center shrink-0">
            <CalendarClock size={16} />
          </div>
          <div>
            <h4 className="font-bold text-foreground">Sunday Rollover</h4>
            <p className="mt-0.5">
              All weekly XP freezes every Sunday at 23:59:59 UTC. Results are finalized, tiers
              updated, and new weekly cohorts open immediately.
            </p>
          </div>
        </div>
      </div>

      <div className="p-3 rounded-xl bg-muted/40 border border-border/60 text-[11px] text-muted-foreground font-mono">
        💡 Complete lessons, score high on module quizzes, and submit peer-reviewed assignments to maximize weekly XP.
      </div>
    </div>
  );
}

