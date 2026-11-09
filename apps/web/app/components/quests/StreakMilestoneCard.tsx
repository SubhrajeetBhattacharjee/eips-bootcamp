'use client';

import React, { useState, useEffect } from 'react';
import { Flame, Shield, Trophy, Check, Sparkles } from 'lucide-react';
import type { UserStreakResponse, StreakMilestone } from '@/app/lib/quests';

interface StreakMilestoneCardProps {
  userId?: string;
  initialStreak?: UserStreakResponse | null;
}

export function StreakMilestoneCard({
  userId,
  initialStreak,
}: StreakMilestoneCardProps) {
  const [streakData, setStreakData] = useState<UserStreakResponse | null>(
    initialStreak || null,
  );
  const [loading, setLoading] = useState(!initialStreak);

  useEffect(() => {
    if (!userId) return;
    let isMounted = true;

    async function loadStreak() {
      try {
        const res = await fetch(`/api/quests/streak?userId=${userId}`);
        if (res.ok) {
          const json: UserStreakResponse = await res.json();
          if (isMounted) setStreakData(json);
        }
      } catch (err) {
        console.error('Failed to load streak data:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    if (!initialStreak) {
      loadStreak();
    }
    return () => {
      isMounted = false;
    };
  }, [userId, initialStreak]);

  if (loading && !streakData) {
    return (
      <div className="p-5 rounded-2xl bg-card border border-border/70 animate-pulse space-y-3">
        <div className="h-5 w-28 bg-muted/40 rounded-md" />
        <div className="h-10 bg-muted/20 rounded-xl" />
      </div>
    );
  }

  const currentStreak = streakData?.currentStreak || 1;
  const longestStreak = streakData?.longestStreak || 1;
  const freezes = streakData?.streakFreezesAvailable || 0;
  const milestones: StreakMilestone[] = streakData?.milestones || [
    { days: 3, rewardXp: 50, title: '3-Day Momentum', reached: currentStreak >= 3 },
    { days: 7, rewardXp: 150, title: 'Weekly Champion', reached: currentStreak >= 7 },
    { days: 14, rewardXp: 300, title: 'Fortnight Titan', reached: currentStreak >= 14 },
    { days: 30, rewardXp: 1000, title: 'Monthly Sovereign', reached: currentStreak >= 30 },
  ];

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-card border border-border/70 space-y-5 shadow-xs">
      {/* Top Header: Flame & Freeze */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center">
            <Flame size={18} className="animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-sm sm:text-base text-foreground">
              Daily Streak
            </h3>
            <p className="text-[11px] text-muted-foreground">
              Personal Best: {longestStreak} days
            </p>
          </div>
        </div>

        {/* Streak Freeze Badge */}
        <div
          title={
            freezes > 0
              ? 'Streak Freeze active: protects your streak if you miss a day'
              : 'No Streak Freeze available'
          }
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold"
        >
          <Shield size={13} />
          <span>{freezes} Freeze</span>
        </div>
      </div>

      {/* Streak Count Banner */}
      <div className="flex items-center justify-between p-3.5 rounded-xl bg-orange-500/5 border border-orange-500/20">
        <div className="space-y-0.5">
          <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
            Current Consistency
          </span>
          <p className="text-2xl sm:text-3xl font-black text-orange-400 tracking-tight flex items-center gap-1.5">
            <span>{currentStreak}</span>
            <span className="text-sm font-semibold text-foreground">Days</span>
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs font-semibold text-emerald-400 flex items-center justify-end gap-1">
            <Sparkles size={12} />
            Active Today
          </span>
          <p className="text-[11px] text-muted-foreground">Keep the momentum going!</p>
        </div>
      </div>

      {/* Milestones Progression */}
      <div className="space-y-2 pt-1">
        <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
          Streak Milestones
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {milestones.map((m) => (
            <div
              key={m.days}
              className={`p-2.5 rounded-xl border text-center transition-all ${
                m.reached
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-muted/20 border-border/40 text-muted-foreground'
              }`}
            >
              <div className="flex items-center justify-center gap-1 mb-1">
                {m.reached ? (
                  <Check size={12} className="text-emerald-400" />
                ) : (
                  <Trophy size={12} className="opacity-50" />
                )}
                <span className="font-black text-xs">{m.days} Days</span>
              </div>
              <p className="text-[10px] font-mono font-semibold">
                +{m.rewardXp} XP
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

