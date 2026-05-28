// apps/web/components/learning/ContinueLearningCard.tsx

import React from 'react';
import { Play, Clock, Zap } from 'lucide-react';

export const ContinueLearningCard: React.FC = () => {
  const moduleTitle = 'Module: Writing & Improving EIPs';
  const description = 'Learn how to write clear EIP specifications and add ethereum details';
  const progress = 75;
  const estimatedTime = '2h 30m';
  const difficulty = 'Intermediate';

  return (
    <div className="group relative bg-[#0d0d0d] border border-white/8 rounded-2xl p-6 hover:border-emerald-500/20 hover:-translate-y-0.5 transition-all duration-300 overflow-hidden">
      {/* Hover glow */}
      <div className="absolute inset-0 bg-emerald-500/0 group-hover:bg-emerald-500/3 transition-all duration-300 rounded-2xl" />

      <div className="relative z-10">
        <div className="mb-6">
          <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3">Continue Learning</p>
          <h2 className="text-2xl font-bold text-white mb-2">{moduleTitle}</h2>
          <p className="text-sm text-zinc-400">{description}</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-zinc-400">Progress</span>
            <span className="text-xs font-semibold text-emerald-400">{progress}%</span>
          </div>
          <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/8">
            <div
              className="h-full bg-gradient-to-r from-emerald-500/80 to-emerald-400/80 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Meta Info */}
        <div className="flex flex-wrap gap-6 mb-6">
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <Clock size={14} className="text-emerald-400/70" />
            <span>{estimatedTime} remaining</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <Zap size={14} className="text-emerald-400/70" />
            <span>{difficulty}</span>
          </div>
        </div>

        {/* CTA Button */}
        <button
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold border border-emerald-500/30 hover:border-emerald-500/60 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 hover:text-emerald-200 transition-all duration-200"
        >
          <Play size={16} />
          <span>Resume Lesson</span>
        </button>
      </div>
    </div>
  );
};