// apps/web/components/learning/RecommendedNextStep.tsx

import React from 'react';
import { Lightbulb, ArrowRight } from 'lucide-react';

export const RecommendedNextStep: React.FC = () => {
  const recommendation = 'Complete Smart Contract Security next';
  const reason = 'You should finish Module 6 before tackling Advanced Patterns';

  return (
    <div className="group relative bg-[#0d0d0d] border border-white/8 rounded-2xl p-6 hover:border-emerald-500/20 hover:-translate-y-0.5 transition-all duration-300 overflow-hidden h-full flex flex-col">
      {/* Hover glow */}
      <div className="absolute inset-0 bg-emerald-500/0 group-hover:bg-emerald-500/3 transition-all duration-300 rounded-2xl" />

      <div className="relative z-10 flex-1 flex flex-col">
        <div className="flex items-start gap-3 mb-6">
          <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <Lightbulb size={18} className="text-emerald-400" />
          </div>
          <div>
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Smart Recommendation</p>
            <h3 className="text-lg font-bold text-white mt-1">Next Step</h3>
          </div>
        </div>

        {/* Recommendation Text */}
        <div className="mb-6 flex-1">
          <p className="font-semibold text-white mb-2 text-sm">
            {recommendation}
          </p>
          <p className="text-xs text-zinc-400 leading-relaxed">
            {reason}
          </p>
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-2 gap-3 pt-6 border-t border-white/8">
          <div>
            <p className="text-xs text-zinc-500 font-medium mb-1">Est. Time</p>
            <p className="text-lg font-bold text-white">3h 20m</p>
          </div>
          <div>
            <p className="text-xs text-zinc-500 font-medium mb-1">XP Reward</p>
            <p className="text-lg font-bold text-white">250 XP</p>
          </div>
        </div>

        {/* CTA Button */}
        <button className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold border border-emerald-500/30 hover:border-emerald-500/60 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 hover:text-emerald-200 transition-all duration-200 w-full">
          <span>Start Learning</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};