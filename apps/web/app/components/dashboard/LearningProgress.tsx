
'use client';

import { ArrowRight, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getLearningProgress } from '@/app/actions/dashboard';

export function LearningProgress() {
  const [progressData, setProgressData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLearningProgress().then(data => {
      setProgressData(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="bg-white/85 backdrop-blur-md border border-[#075945]/15 rounded-2xl p-5 sm:p-6 flex flex-col h-full shadow-xs hover:border-[#075945]/30 transition-all">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[#171a18] font-bold text-base">Continue Your Learning</h3>
        <Link href="/dashboard/my-modules">  
          <button className="text-[#075945] text-xs font-bold hover:underline transition-colors flex items-center gap-1">
            View All Modules <ArrowRight size={12} />
          </button>
        </Link>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center py-6">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-[#075945] border-opacity-70"></div>
        </div>
      ) : progressData ? (
        <Link href="/dashboard/assignments" className="flex-1 flex flex-col justify-center bg-[#075945]/5 border border-[#075945]/15 rounded-xl p-5 hover:bg-[#075945]/10 transition-colors group cursor-pointer">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 bg-[#075945]/10 rounded-xl text-[#075945] group-hover:scale-105 transition-transform">
              <BookOpen size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[#6b7280] font-bold uppercase tracking-wider mb-0.5">Latest Assignment</p>
              <h4 className="text-sm font-bold text-[#171a18] line-clamp-1">{progressData.title}</h4>
            </div>
          </div>
          <div className="w-full bg-[#075945]/15 rounded-full h-1.5 mt-2">
            <div className="bg-[#075945] h-1.5 rounded-full w-[25%]"></div>
          </div>
          <p className="text-xs text-[#075945] font-semibold mt-2.5 text-right flex items-center justify-end gap-1">Continue <ArrowRight size={11} /></p>
        </Link>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-[#075945]/5 border border-[#075945]/15 rounded-xl">
          <div className="w-12 h-12 bg-white rounded-full border border-[#075945]/15 flex items-center justify-center mb-3 text-[#075945] shadow-xs">
            <BookOpen size={20} />
          </div>
          <p className="text-[#171a18] font-bold text-sm mb-1">Nothing in progress</p>
          <p className="text-[#6b7280] text-xs">Start a module to see your progress here.</p>
        </div>
      )}
    </div>
  );
}

export default LearningProgress;
