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
      <div className="relative bg-gradient-to-br from-slate-800/80 via-slate-900/60 to-slate-900/40 backdrop-blur-xl border border-emerald-500/20 rounded-2xl p-8 shadow-xl">
        {/* Background Pattern */}
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl" />

        {/* Title */}
        <h3 className="text-lg font-bold text-white mb-6">How to Earn More XP</h3>

        {/* Activities List */}
        <div className="space-y-3 mb-6">
          {XP_ACTIVITIES.map((activity, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg bg-slate-800/40 border border-emerald-500/10 hover:border-emerald-500/30 hover:bg-slate-800/60 transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">
                  {activity.emoji}
                </span>
                <span className="text-sm text-gray-300">
                  {activity.activity}
                </span>
              </div>
              <span className="text-emerald-400 font-bold text-sm">
                +{activity.xpValue} XP
              </span>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <button className="w-full py-2.5 rounded-lg text-emerald-400 font-bold text-xs uppercase tracking-wider hover:text-emerald-300 transition-colors duration-200 flex items-center justify-center gap-2">
          <span>View all ways to earn XP</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
};