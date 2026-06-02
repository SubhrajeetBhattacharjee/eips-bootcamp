import React from 'react';
import { BookOpen, Trophy, Target, Star } from 'lucide-react';

export const LearningStatsGrid = ({ stats }: { stats?: any }) => {
  const data = stats || {
    totalXp: 0,
    rank: 0,
    modulesCompleted: 0,
    activeAssignments: 0,
    totalModules: 0
  };

  const statCards = [
    {
      label: 'Total XP Earned',
      value: data.totalXp.toLocaleString(),
      icon: Star,
      color: 'text-amber-400',
      bgColor: 'bg-amber-400/10',
      borderColor: 'border-amber-400/20',
    },
    {
      label: 'Global Rank',
      value: `#${data.rank}`,
      icon: Trophy,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-400/10',
      borderColor: 'border-emerald-400/20',
    },
    {
      label: 'Modules Completed',
      value: `${data.modulesCompleted}/${data.totalModules}`,
      icon: BookOpen,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10',
      borderColor: 'border-blue-400/20',
    },
    {
      label: 'Active Assignments',
      value: data.activeAssignments.toString(),
      icon: Target,
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/10',
      borderColor: 'border-purple-400/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="group relative overflow-hidden rounded-2xl bg-[#0d0d0d] border border-white/5 p-6 hover:border-white/10 transition-all duration-300"
          >
            {/* Background Glow */}
            <div
              className={`absolute -right-6 -top-6 w-24 h-24 rounded-full blur-2xl opacity-20 group-hover:opacity-30 transition-opacity ${stat.bgColor}`}
            />
            
            <div className="flex items-center gap-4 relative z-10">
              <div
                className={`p-3 rounded-xl border ${stat.bgColor} ${stat.borderColor} ${stat.color} group-hover:scale-110 transition-transform duration-300`}
              >
                <Icon size={22} strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-400 mb-1">
                  {stat.label}
                </p>
                <h3 className="text-2xl font-bold text-white">
                  {stat.value}
                </h3>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};