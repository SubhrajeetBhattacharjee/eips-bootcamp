// apps/web/components/learning/LearningProgressWidget.tsx

import React from 'react';

interface ModuleProgress {
  name: string;
  progress: number;
}

const moduleProgress: ModuleProgress[] = [
  { name: 'Solidity Basics', progress: 100 },
  { name: 'Smart Contracts', progress: 100 },
  { name: 'Web3 JS', progress: 90 },
  { name: 'Security', progress: 75 },
  { name: 'Gas Optimization', progress: 45 },
  { name: 'Advanced Patterns', progress: 0 },
];

export const LearningProgressWidget: React.FC = () => {
  const completedAssignments = 8;
  const totalAssignments = 12;
  const assignmentCompletion = (completedAssignments / totalAssignments) * 100;

  return (
    <div className="group relative bg-[#0d0d0d] border border-white/8 rounded-2xl p-6 hover:border-emerald-500/20 hover:-translate-y-0.5 transition-all duration-300 overflow-hidden h-full flex flex-col">
      {/* Hover glow */}
      <div className="absolute inset-0 bg-emerald-500/0 group-hover:bg-emerald-500/3 transition-all duration-300 rounded-2xl" />

      <div className="relative z-10 flex-1 flex flex-col">
        <div className="mb-6">
          <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Learning Progress</p>
          <h3 className="text-xl font-bold text-white mt-1">Module Breakdown</h3>
        </div>

        {/* Module Progress Bars */}
        <div className="space-y-3 mb-6 flex-1">
          {moduleProgress.map((module) => (
            <div key={module.name}>
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-xs font-medium text-zinc-300">{module.name}</p>
                <p className="text-xs text-emerald-400/70 font-semibold">{module.progress}%</p>
              </div>
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/8">
                <div
                  className="h-full rounded-full bg-emerald-500/70 transition-all duration-300"
                  style={{ width: `${module.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Assignment Completion */}
        <div className="pt-6 border-t border-white/8">
          <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3">Assignment Completion</p>
          <div className="flex items-baseline gap-2 mb-2">
            <p className="text-2xl font-bold text-white">
              {completedAssignments}/{totalAssignments}
            </p>
            <p className="text-xs text-zinc-400">submitted</p>
          </div>
          <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/8">
            <div
              className="h-full bg-emerald-500/70 rounded-full transition-all duration-300"
              style={{ width: `${assignmentCompletion}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};