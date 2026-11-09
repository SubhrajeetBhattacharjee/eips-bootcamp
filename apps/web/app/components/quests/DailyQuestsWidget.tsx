'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  BookOpen,
  Zap,
  Swords,
  CheckCircle2,
  Clock,
  Check,
  Loader2,
  Trophy,
} from 'lucide-react';
import { toast } from 'sonner';
import type { DailyQuestItem, DailyQuestsResponse } from '@/app/lib/quests';

interface DailyQuestsWidgetProps {
  userId?: string;
  initialData?: DailyQuestsResponse | null;
  onXpClaimed?: (amount: number) => void;
}

export function DailyQuestsWidget({
  userId,
  initialData,
  onXpClaimed,
}: DailyQuestsWidgetProps) {
  const [data, setData] = useState<DailyQuestsResponse | null>(initialData || null);
  const [loading, setLoading] = useState(!initialData);
  const [claimingId, setClaimingId] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(initialData?.resetInSeconds || 86400);

  // Ticking countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  // Load daily quests
  useEffect(() => {
    if (!userId) return;
    let isMounted = true;

    async function loadQuests() {
      try {
        const res = await fetch(`/api/quests/daily?userId=${userId}`);
        if (res.ok) {
          const json: DailyQuestsResponse = await res.json();
          if (isMounted) {
            setData(json);
            setTimeLeft(json.resetInSeconds);
          }
        }
      } catch (err) {
        console.error('Failed to load daily quests:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    if (!initialData) {
      loadQuests();
    }
    return () => {
      isMounted = false;
    };
  }, [userId, initialData]);

  const handleClaim = async (quest: DailyQuestItem) => {
    if (!userId || claimingId || !quest.isCompleted || quest.isClaimed) return;
    setClaimingId(quest.id);

    try {
      const res = await fetch('/api/quests/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questId: quest.id, userId }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to claim reward');
      }

      const updatedQuest: DailyQuestItem = await res.json();

      if (data) {
        const updatedQuests = data.quests.map((q) =>
          q.id === updatedQuest.id ? updatedQuest : q,
        );
        setData({
          ...data,
          quests: updatedQuests,
          allCompleted: updatedQuests.every((q) => q.isCompleted),
        });
      }

      toast.success(`Claimed +${quest.xpReward} XP for "${quest.title}"! 🎉`);
      onXpClaimed?.(quest.xpReward);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Failed to claim reward');
    } finally {
      setClaimingId(null);
    }
  };

  const formatCountdown = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;
  };

  const getQuestIcon = (key: string) => {
    switch (key) {
      case 'DAILY_LESSON':
        return <BookOpen size={16} className="text-emerald-400" />;
      case 'XP_GOAL':
        return <Zap size={16} className="text-amber-400" />;
      case 'ARENA_PRACTICE':
        return <Swords size={16} className="text-sky-400" />;
      default:
        return <Sparkles size={16} className="text-primary" />;
    }
  };

  const quests = data?.quests || [];
  const completedCount = quests.filter((q) => q.isCompleted).length;
  const isTrifecta = quests.length > 0 && quests.every((q) => q.isCompleted);

  if (loading && !data) {
    return (
      <div className="p-6 rounded-2xl bg-card border border-border/70 animate-pulse space-y-4">
        <div className="h-5 w-36 bg-muted/40 rounded-md" />
        <div className="space-y-3">
          <div className="h-14 bg-muted/20 rounded-xl" />
          <div className="h-14 bg-muted/20 rounded-xl" />
          <div className="h-14 bg-muted/20 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-card border border-border/70 space-y-5 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 text-primary flex items-center justify-center">
            <Sparkles size={16} />
          </div>
          <div>
            <h3 className="font-bold text-sm sm:text-base text-foreground flex items-center gap-2">
              <span>Daily Quests</span>
              <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                {completedCount}/{quests.length}
              </span>
            </h3>
            <p className="text-[11px] text-muted-foreground">
              Complete daily learning goals to accelerate XP and streaks
            </p>
          </div>
        </div>

        {/* Ticking UTC Countdown */}
        <div className="flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground bg-muted/30 px-2.5 py-1 rounded-lg border border-border/40 self-start sm:self-auto">
          <Clock size={12} className="text-primary" />
          <span>Resets in {formatCountdown(timeLeft)}</span>
        </div>
      </div>

      {/* Quests List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {quests.map((quest) => {
          const progressPercent = Math.min(
            100,
            Math.round((quest.currentCount / quest.targetCount) * 100),
          );
          const isClaimable = quest.isCompleted && !quest.isClaimed;

          return (
            <div
              key={quest.id}
              className={`p-4 rounded-xl border transition-all flex flex-col justify-between gap-3 ${
                quest.isClaimed
                  ? 'bg-muted/10 border-border/40 opacity-80'
                  : isClaimable
                  ? 'bg-primary/5 border-primary/30 shadow-xs'
                  : 'bg-muted/20 border-border/50'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-card border border-border/60 flex items-center justify-center flex-shrink-0">
                      {getQuestIcon(quest.questKey)}
                    </div>
                    <p className="font-semibold text-xs text-foreground truncate">
                      {quest.title}
                    </p>
                  </div>

                  {/* Right Action / Status */}
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {quest.isClaimed ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-[10px] tracking-wide uppercase">
                        <Check size={11} />
                        Claimed
                      </span>
                    ) : isClaimable ? (
                      <button
                        onClick={() => handleClaim(quest)}
                        disabled={claimingId === quest.id}
                        className="px-2.5 py-1 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-[11px] flex items-center gap-1 shadow-sm transition-all cursor-pointer"
                      >
                        {claimingId === quest.id ? (
                          <Loader2 size={12} className="animate-spin" />
                        ) : (
                          <Sparkles size={12} />
                        )}
                        Claim +{quest.xpReward} XP
                      </button>
                    ) : (
                      <span className="text-[11px] font-mono font-bold text-primary dark:text-emerald-400">
                        +{quest.xpReward} XP
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-[11px] text-muted-foreground line-clamp-1 mb-2">
                  {quest.description}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="w-full h-1.5 rounded-full bg-muted/60 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      quest.isCompleted ? 'bg-emerald-400' : 'bg-primary'
                    }`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
                  <span>Progress</span>
                  <span>
                    {quest.currentCount} / {quest.targetCount}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Trifecta Celebration Banner */}
      {isTrifecta && (
        <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-500/10 via-primary/10 to-transparent border border-emerald-500/30 text-emerald-300 flex items-center gap-2.5 text-xs animate-fade-in">
          <Trophy size={16} className="text-emerald-400 flex-shrink-0" />
          <div>
            <span className="font-bold text-emerald-400">
              Daily Trifecta Achieved!
            </span>{' '}
            You completed all objectives for today. Your streak is on fire! 🔥
          </div>
        </div>
      )}
    </div>
  );
}

