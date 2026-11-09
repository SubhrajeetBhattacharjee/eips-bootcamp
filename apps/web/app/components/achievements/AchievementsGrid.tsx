'use client';

import React, { useState } from 'react';
import {
  Award,
  Search,
  CheckCircle2,
  Lock,
  Zap,
  Sparkles,
  Filter,
} from 'lucide-react';
import {
  AchievementItem,
  AchievementCategory,
  AchievementRarity,
} from '@/app/lib/achievements';

interface AchievementsGridProps {
  achievements: AchievementItem[];
}

export function AchievementsGrid({ achievements }: AchievementsGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | AchievementCategory>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'UNLOCKED' | 'LOCKED'>('ALL');
  const [search, setSearch] = useState('');

  const filtered = achievements.filter((ach) => {
    // Category filter
    if (selectedCategory !== 'ALL' && ach.category !== selectedCategory) {
      return false;
    }
    // Status filter
    if (statusFilter === 'UNLOCKED' && !ach.isUnlocked) return false;
    if (statusFilter === 'LOCKED' && ach.isUnlocked) return false;
    // Search query
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        ach.title.toLowerCase().includes(q) ||
        ach.description.toLowerCase().includes(q) ||
        ach.code.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getRarityBadge = (rarity: AchievementRarity) => {
    switch (rarity) {
      case 'LEGENDARY':
        return (
          <span className="text-[9px] font-mono font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-300 border border-amber-500/30">
            Legendary
          </span>
        );
      case 'EPIC':
        return (
          <span className="text-[9px] font-mono font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-600 dark:text-purple-300 border border-purple-500/30">
            Epic
          </span>
        );
      case 'RARE':
        return (
          <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-600 dark:text-cyan-300 border border-cyan-500/30">
            Rare
          </span>
        );
      default:
        return (
          <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
            Common
          </span>
        );
    }
  };

  const getCardBorder = (ach: AchievementItem) => {
    if (!ach.isUnlocked) {
      return 'border-border/60 bg-muted/20 opacity-70 hover:opacity-90';
    }
    switch (ach.rarity) {
      case 'LEGENDARY':
        return 'border-amber-500/40 bg-gradient-to-br from-amber-500/10 via-card to-card shadow-sm ring-1 ring-amber-500/20';
      case 'EPIC':
        return 'border-purple-500/40 bg-gradient-to-br from-purple-500/10 via-card to-card shadow-xs ring-1 ring-purple-500/20';
      case 'RARE':
        return 'border-cyan-500/40 bg-gradient-to-br from-cyan-500/10 via-card to-card shadow-xs';
      default:
        return 'border-border/80 bg-card shadow-xs';
    }
  };

  return (
    <div className="w-full space-y-6">
      
      {/* Category Pills & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
          {[
            { id: 'ALL', label: 'All Badges' },
            { id: 'LEARNING', label: 'Protocol Tracks 🌱' },
            { id: 'COMPETITION', label: 'Arenas ⚔️' },
            { id: 'LEAGUE', label: 'Leagues 🛡️' },
            { id: 'ENGAGEMENT', label: 'Community 🤝' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === tab.id
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'bg-card text-muted-foreground hover:text-foreground border border-border/80'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Right: Search & Status Filter */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-56">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search badges..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-card border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl shrink-0">
            {(['ALL', 'UNLOCKED', 'LOCKED'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold capitalize transition-all cursor-pointer ${
                  statusFilter === st
                    ? 'bg-card text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {st === 'ALL' ? 'All' : st === 'UNLOCKED' ? 'Earned' : 'Locked'}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Badges Grid */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center text-muted-foreground space-y-2 rounded-2xl bg-card border border-border/80">
          <div className="w-12 h-12 rounded-2xl bg-muted/50 border border-border flex items-center justify-center text-2xl mx-auto">
            🎖️
          </div>
          <p className="text-sm font-bold text-foreground">No Badges Found</p>
          <p className="text-xs max-w-sm mx-auto">
            Try adjusting your search query or category filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((ach) => {
            const isUnlocked = ach.isUnlocked;
            const progressPercent =
              ach.maxProgress > 1
                ? Math.min(100, Math.round((ach.progress / ach.maxProgress) * 100))
                : isUnlocked
                ? 100
                : 0;

            const unlockedDate = ach.unlockedAt
              ? new Date(ach.unlockedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })
              : null;

            return (
              <div
                key={ach.id}
                className={`rounded-2xl border p-5 flex flex-col justify-between transition-all duration-200 relative group ${getCardBorder(
                  ach,
                )}`}
              >
                <div>
                  {/* Top: Icon + Rarity + Lock Indicator */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0 shadow-xs border ${
                        isUnlocked
                          ? 'bg-accent/80 border-border/70 scale-100'
                          : 'bg-muted/40 border-border/40 grayscale opacity-60'
                      }`}
                    >
                      <span>{ach.icon}</span>
                    </div>

                    <div className="flex flex-col items-end gap-1.5">
                      {getRarityBadge(ach.rarity)}

                      {isUnlocked ? (
                        <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle2 size={12} /> Earned
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-muted-foreground flex items-center gap-1">
                          <Lock size={11} /> Locked
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-sm font-black text-foreground tracking-tight group-hover:text-primary dark:group-hover:text-emerald-400 transition-colors">
                    {ach.title}
                  </h3>

                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {ach.description}
                  </p>
                </div>

                {/* Bottom: Progress or Unlock Date + XP */}
                <div className="mt-5 pt-3.5 border-t border-border/50 space-y-2">
                  {/* Multi-step progress bar if maxProgress > 1 */}
                  {ach.maxProgress > 1 && !isUnlocked && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                        <span>Progress</span>
                        <span>
                          {ach.progress} / {ach.maxProgress}
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all duration-500"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-muted-foreground truncate">
                      {isUnlocked && unlockedDate ? `Unlocked ${unlockedDate}` : 'Reward'}
                    </span>

                    <span className="font-bold text-primary dark:text-emerald-400 shrink-0">
                      +{ach.xpReward} XP
                    </span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}

