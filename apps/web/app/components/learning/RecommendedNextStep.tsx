import React from 'react';
import { ArrowRight, BookOpen } from 'lucide-react';
import Link from 'next/link';

export const RecommendedNextStep = ({ nextStep }: { nextStep?: any }) => {
  if (!nextStep) {
    return (
      <div className="bg-[#0d0d0d] border border-white/8 rounded-2xl p-6 flex flex-col h-full hover:border-emerald-500/20 transition-all duration-300">
        <h3 className="text-white font-bold text-base mb-6">Recommended Next Step</h3>
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-3">
            <BookOpen size={20} className="text-zinc-500" />
          </div>
          <p className="text-white font-semibold text-sm mb-1">You're all caught up!</p>
          <p className="text-zinc-500 text-xs mb-4">Check back later for new modules.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0d0d0d] border border-white/8 rounded-2xl p-6 flex flex-col h-full hover:border-emerald-500/20 transition-all duration-300 relative overflow-hidden group">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-colors duration-500" />
      
      <h3 className="text-white font-bold text-base mb-6 relative z-10">Recommended Next Step</h3>

      <div className="flex-1 flex flex-col relative z-10">
        <div className="flex items-start gap-4 mb-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
            <BookOpen size={20} />
          </div>
          <div>
            <p className="text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1">{nextStep.moduleName}</p>
            <h4 className="text-sm font-bold text-white leading-tight line-clamp-2">{nextStep.title}</h4>
          </div>
        </div>

        <p className="text-xs text-zinc-400 mb-6 flex-1">
          Continue exactly where you left off. Complete this assignment to unlock the next module.
        </p>

        <Link href={`/dashboard/assignments/${nextStep.id}`} className="w-full">
          <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-emerald-500/10 text-white hover:text-emerald-300 text-sm font-semibold rounded-xl border border-white/10 hover:border-emerald-500/30 transition-all duration-300 group/btn">
            Start Now
            <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </Link>
      </div>
    </div>
  );
};