// apps/web/app/components/rewards/EarnXPCard.tsx

'use client';

import React from 'react';

interface XPActivity {
  activity: string;
  xpValue: number;
  emoji: string;
}

const XP_ACTIVITIES: XPActivity[] = [
  { activity: 'Refer a friend', xpValue: 50, emoji: '👥' },
  { activity: 'Complete a module', xpValue: 100, emoji: '📚' },
  { activity: 'Submit an assignment', xpValue: 150, emoji: '📝' },
  { activity: 'Attend a live session', xpValue: 100, emoji: '🎤' },
  { activity: 'Community contribution', xpValue: 200, emoji: '🤝' },
];

export const EarnXPCard: React.FC = () => {
  return (
    <div className="relative">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 to-transparent rounded-2xl blur-xl" />

      {/* Card */}
      <div className="relative bg-gradient-to-br from-slate-100/90 via-slate-200/70 to-slate-300/50 dark:from-slate-800/80 dark:via-slate-900/60 dark:to-slate-900/40 backdrop-blur-xl border border-emerald-500/20 rounded-2xl p-8 shadow-xl">
        {/* Background Pattern */}
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl" />

        {/* Title */}
        <h3 className="text-lg font-bold text-foreground mb-6">How to Earn More XP</h3>

        {/* Activities List */}
        <div className="space-y-3 mb-6">
          {XP_ACTIVITIES.map((activity, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg bg-card border border-primary/10 hover:border-primary/30 hover:bg-muted transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">
                  {activity.emoji}
                </span>
                <span className="text-sm text-foreground">
                  {activity.activity}
                </span>
              </div>
              <span className="text-emerald-400 font-bold text-sm">
                +{activity.xpValue} XP
              </span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};