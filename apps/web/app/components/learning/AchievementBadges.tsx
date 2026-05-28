// apps/web/components/learning/AchievementBadges.tsx

import React from 'react';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress?: number;
}

const badges: Badge[] = [
  {
    id: '1',
    name: 'First Module',
    description: 'Completed first module',
    icon: '🎯',
    unlocked: true,
  },
  {
    id: '2',
    name: '7-Day Streak',
    description: 'Learn 7 days in a row',
    icon: '🔥',
    unlocked: true,
  },
  {
    id: '3',
    name: 'Assignment Master',
    description: 'Submit 10 assignments',
    icon: '📝',
    unlocked: true,
  },
  {
    id: '4',
    name: 'Smart Explorer',
    description: 'Complete Smart Contracts module',
    icon: '🧠',
    unlocked: false,
    progress: 75,
  },
  {
    id: '5',
    name: 'Top 10',
    description: 'Reach top 10 in leaderboard',
    icon: '🏆',
    unlocked: true,
  },
  {
    id: '6',
    name: 'Code Master',
    description: 'Master all coding challenges',
    icon: '💻',
    unlocked: false,
    progress: 45,
  },
];

export const AchievementBadges: React.FC = () => {
  return (
    <div className="group relative bg-[#0d0d0d] border border-white/8 rounded-2xl p-6 hover:border-emerald-500/20 hover:-translate-y-0.5 transition-all duration-300 overflow-hidden h-full flex flex-col">
      {/* Hover glow */}
      <div className="absolute inset-0 bg-emerald-500/0 group-hover:bg-emerald-500/3 transition-all duration-300 rounded-2xl" />

      <div className="relative z-10 flex-1 flex flex-col">
        <div className="mb-6">
          <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
            Achievements
          </p>
          <h3 className="text-xl font-bold text-white mt-1">
            Your Badges
          </h3>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-3 gap-3 flex-1">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`
                relative group/badge rounded-lg border p-3 flex flex-col items-center justify-center text-center
                transition-all duration-200
                ${
                  badge.unlocked
                    ? 'border-emerald-500/20 bg-emerald-500/10 hover:border-emerald-500/40 hover:bg-emerald-500/15'
                    : 'border-white/8 bg-white/5 hover:bg-white/8'
                }
              `}
            >
              {/* Content */}
              <div className="relative z-10 w-full">
                <p className="text-3xl mb-1.5">{badge.icon}</p>
                <p className="text-xs font-bold text-white mb-0.5">
                  {badge.name}
                </p>
                <p className="text-xs text-zinc-400 line-clamp-2">
                  {badge.description}
                </p>

                {/* Progress for locked badges */}
                {!badge.unlocked && badge.progress && (
                  <div className="mt-2 pt-2 border-t border-white/8">
                    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mb-0.5">
                      <div
                        className="h-full bg-emerald-500/70 transition-all"
                        style={{ width: `${badge.progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-zinc-600">
                      {badge.progress}%
                    </p>
                  </div>
                )}

                {/* Unlocked indicator */}
                {badge.unlocked && (
                  <p className="text-xs text-emerald-400 font-semibold mt-1.5">
                    ✓ Unlocked
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-6 pt-4 border-t border-white/8">
          <button className="w-full rounded-lg font-medium text-sm py-2.5 px-4 transition-all duration-200 border border-emerald-500/30 hover:border-emerald-500/60 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 hover:text-emerald-200">
            View All Badges →
          </button>
        </div>
      </div>
    </div>
  );
};