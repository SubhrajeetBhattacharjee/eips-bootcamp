// apps/web/components/learning/LearningStatsGrid.tsx

import React from 'react';
import * as Icons from 'lucide-react';

interface LearningStatCard {
  id: string;
  label: string;
  value: string | number;
  unit?: string;
  icon: string;
  color: 'emerald' | 'blue' | 'purple' | 'orange' | 'pink' | 'cyan';
}

const learningStats: LearningStatCard[] = [
  {
    id: 'overall',
    label: 'Overall Progress',
    value: '72',
    unit: '%',
    icon: 'BarChart3',
    color: 'emerald',
  },
  {
    id: 'modules',
    label: 'Modules Completed',
    value: '12',
    unit: '/18',
    icon: 'Layers',
    color: 'emerald',
  },
  {
    id: 'assignments',
    label: 'Assignments Submitted',
    value: '8',
    unit: '/12',
    icon: 'CheckCircle',
    color: 'emerald',
  },
  {
    id: 'streak',
    label: 'Current Streak',
    value: '5',
    unit: 'days',
    icon: 'Flame',
    color: 'emerald',
  },
];

const iconMap: Record<string, React.ComponentType<any>> = {
  BarChart3: Icons.BarChart3,
  Layers: Icons.Layers,
  CheckCircle: Icons.CheckCircle,
  Flame: Icons.Flame,
  Zap: Icons.Zap,
  Trophy: Icons.Trophy,
};

export const LearningStatsGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {learningStats.map((card) => {
        const IconComponent = iconMap[card.icon] || Icons.Activity;

        return (
          <div key={card.id} className="group relative bg-[#0d0d0d] border border-white/8 rounded-2xl p-5 flex flex-col justify-between hover:border-emerald-500/20 hover:-translate-y-0.5 transition-all duration-300 cursor-default overflow-hidden min-h-[160px]">
            {/* Hover glow */}
            <div className="absolute inset-0 bg-emerald-500/0 group-hover:bg-emerald-500/3 transition-all duration-300 rounded-2xl" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <p className="text-zinc-500 text-xs font-medium uppercase tracking-wider">{card.label}</p>
                <IconComponent size={18} className="text-emerald-400/60" />
              </div>
              <div>
                <p className="font-black text-3xl tracking-tight text-white mb-1">{card.value}</p>
                {card.unit && <p className="text-xs font-medium text-zinc-500">{card.unit}</p>}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};