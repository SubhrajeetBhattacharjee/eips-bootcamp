// apps/web/components/learning/LearningTimeline.tsx

import React from 'react';
import { CheckCircle, Circle, Lock } from 'lucide-react';

interface TimelineModule {
  id: number;
  name: string;
  status: 'completed' | 'current' | 'locked';
}

const timelineModules: TimelineModule[] = [
  { id: 1, name: 'Solidity Basics', status: 'completed' },
  { id: 2, name: 'Smart Contracts', status: 'completed' },
  { id: 3, name: 'Web3 JS', status: 'completed' },
  { id: 4, name: 'Security', status: 'current' },
  { id: 5, name: 'Gas Optimization', status: 'locked' },
  { id: 6, name: 'Advanced Patterns', status: 'locked' },
];

export const LearningTimeline: React.FC = () => {
  return (
    <div className="group relative bg-[#0d0d0d] border border-white/8 rounded-2xl p-6 hover:border-emerald-500/20 hover:-translate-y-0.5 transition-all duration-300 overflow-hidden h-full flex flex-col">
      {/* Hover glow */}
      <div className="absolute inset-0 bg-emerald-500/0 group-hover:bg-emerald-500/3 transition-all duration-300 rounded-2xl" />

      <div className="relative z-10 flex-1 flex flex-col">
        <div className="mb-6">
          <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Learning Roadmap</p>
          <h3 className="text-xl font-bold text-white mt-1">Your Timeline</h3>
        </div>

        {/* Timeline */}
        <div className="space-y-2 flex-1">
          {timelineModules.map((module, index) => {
            const isLast = index === timelineModules.length - 1;
            let bgColor = 'bg-white/5';
            let borderColor = 'border-white/8';
            let iconColor = 'text-zinc-500';

            if (module.status === 'completed') {
              bgColor = 'bg-emerald-500/10';
              borderColor = 'border-emerald-500/20';
              iconColor = 'text-emerald-400';
            } else if (module.status === 'current') {
              bgColor = 'bg-emerald-500/15';
              borderColor = 'border-emerald-500/30';
              iconColor = 'text-emerald-400';
            }

            return (
              <div key={module.id} className="relative">
                {/* Connector line */}
                {!isLast && (
                  <div
                    className={`absolute left-4 top-8 w-0.5 h-4 ${
                      module.status === 'completed'
                        ? 'bg-emerald-500/30'
                        : 'bg-white/10'
                    }`}
                  />
                )}

                {/* Module item */}
                <div
                  className={`
                    flex items-start gap-3
                    rounded-lg border px-3 py-2.5
                    ${bgColor} ${borderColor}
                    transition-all duration-200
                  `}
                >
                  {/* Icon */}
                  <div className="flex-shrink-0 mt-0.5">
                    {module.status === 'completed' ? (
                      <CheckCircle size={18} className={iconColor} />
                    ) : module.status === 'current' ? (
                      <Circle size={18} className={`${iconColor} fill-current`} />
                    ) : (
                      <Lock size={18} className={iconColor} />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-white">{module.name}</p>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      {module.status === 'completed'
                        ? 'Completed'
                        : module.status === 'current'
                        ? 'In Progress'
                        : 'Locked'}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};