import React from 'react';
import { ArrowRight, BookOpen } from 'lucide-react';
import Link from 'next/link';

export const ContinueLearningCard = ({ inProgress }: { inProgress?: any }) => {
  if (!inProgress) {
    return (
      <div className="group relative bg-[#0d0d0d] border border-white/8 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-emerald-500/0 group-hover:opacity-100 opacity-50 transition-opacity duration-500" />
        
        <div className="relative z-10 text-center md:text-left flex-1">
          <p className="text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">Ready to Start?</p>
          <h2 className="text-2xl md:text-3xl font-black text-white mb-2">Welcome to Web3 Learning</h2>
          <p className="text-zinc-400 text-sm md:text-base max-w-2xl">Start your first module and begin your journey into Ethereum protocol development.</p>
        </div>

        <Link href="/dashboard/bootcamp" className="relative z-10 w-full md:w-auto">
          <button className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl transition-all duration-300 transform group-hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]">
            Explore Modules
            <ArrowRight size={18} />
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="group relative bg-[#0d0d0d] border border-white/8 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-emerald-500/0 group-hover:opacity-100 opacity-50 transition-opacity duration-500" />
      
      <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 flex-1 w-full text-center md:text-left">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400/20 to-emerald-600/20 border border-emerald-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.15)] flex-shrink-0">
          <BookOpen className="text-emerald-400" size={28} />
        </div>

        <div className="flex-1 w-full max-w-2xl">
          <p className="text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">Continue Learning</p>
          <h2 className="text-2xl md:text-3xl font-black text-white mb-2 line-clamp-1">{inProgress.title}</h2>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-zinc-400">
            <span>{inProgress.moduleName}</span>
            <span className="hidden sm:inline text-zinc-600">•</span>
            <div className="flex items-center justify-center sm:justify-start gap-2 flex-1 max-w-xs">
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden flex-1">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${inProgress.progress}%` }} />
              </div>
              <span className="text-xs font-semibold text-emerald-400 min-w-[32px]">{inProgress.progress}%</span>
            </div>
          </div>
        </div>
      </div>

      <Link href={`/dashboard/assignments/${inProgress.id}`} className="relative z-10 w-full md:w-auto">
        <button className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl transition-all duration-300 transform group-hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]">
          Resume
          <ArrowRight size={18} />
        </button>
      </Link>
    </div>
  );
};