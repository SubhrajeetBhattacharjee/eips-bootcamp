
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function LearningProgress() {

  return (
    <div className="bg-[#0d0d0d] border border-white/8 rounded-2xl p-5 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-bold text-base">Continue Your Learning</h3>
        <Link href="/dashboard/bootcamp">  
          <button className="text-emerald-400 text-xs font-semibold hover:text-emerald-300 transition-colors flex items-center gap-1">
          View All Modules <ArrowRight size={12} />
        </button>
        </Link>
      </div>

      {/* Empty State */}
      <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-black/20 border border-white/5 rounded-xl">
        <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-3">
          <ArrowRight size={20} className="text-zinc-500" />
        </div>
        <p className="text-white font-semibold text-sm mb-1">Nothing in progress</p>
        <p className="text-zinc-500 text-xs">Start a module to see your progress here.</p>
      </div>
    </div>
  );
}

export default LearningProgress;
