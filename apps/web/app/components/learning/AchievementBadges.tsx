import React from 'react';
import { Award, Zap, Shield, BookOpen } from 'lucide-react';

export const AchievementBadges = ({ stats }: { stats?: any }) => {
  const data = stats || { totalXp: 0, modulesCompleted: 0 };

  // Calculate dynamic badges based on real stats
  const badges = [
    {
      id: 'xp-1',
      name: 'First Steps',
      description: 'Earned 100 XP',
      icon: Zap,
      unlocked: data.totalXp >= 100,
      color: 'amber'
    },
    {
      id: 'xp-2',
      name: 'Dedicated Learner',
      description: 'Earned 1,000 XP',
      icon: Zap,
      unlocked: data.totalXp >= 1000,
      color: 'amber'
    },
    {
      id: 'mod-1',
      name: 'Module Initiated',
      description: 'Completed your first module',
      icon: BookOpen,
      unlocked: data.modulesCompleted >= 1,
      color: 'blue'
    },
    {
      id: 'mod-2',
      name: 'Halfway There',
      description: 'Completed 5 modules',
      icon: Shield,
      unlocked: data.modulesCompleted >= 5,
      color: 'emerald'
    }
  ];

  const getColorClasses = (color: string, unlocked: boolean) => {
    if (!unlocked) return 'bg-white/5 border-white/5 text-zinc-600';
    switch (color) {
      case 'amber': return 'bg-amber-400/10 border-amber-400/30 text-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.15)]';
      case 'blue': return 'bg-blue-500/10 border-blue-500/30 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.15)]';
      case 'emerald': return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]';
      default: return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400';
    }
  };

  return (
    <div className="bg-[#0d0d0d] border border-white/8 rounded-2xl p-6 flex flex-col h-full hover:border-emerald-500/20 transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-white font-bold text-base">Achievements</h3>
        <p className="text-xs font-semibold text-zinc-400">{badges.filter(b => b.unlocked).length} Unlocked</p>
      </div>

      <div className="flex-1 grid grid-cols-2 gap-4">
        {badges.map((badge) => {
          const Icon = badge.icon;
          return (
            <div key={badge.id} className="relative group">
              <div className={`p-4 rounded-xl border flex flex-col items-center text-center h-full transition-all duration-300 ${getColorClasses(badge.color, badge.unlocked)} ${badge.unlocked ? 'hover:-translate-y-1 hover:scale-105' : 'opacity-60 grayscale'}`}>
                <div className="mb-3 relative">
                  {badge.unlocked && (
                    <div className="absolute inset-0 bg-current opacity-20 blur-xl rounded-full" />
                  )}
                  <Icon size={32} className="relative z-10" />
                </div>
                <h4 className={`text-sm font-bold mb-1 ${badge.unlocked ? 'text-white' : 'text-zinc-400'}`}>{badge.name}</h4>
                <p className="text-[10px] leading-tight text-zinc-500">{badge.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};