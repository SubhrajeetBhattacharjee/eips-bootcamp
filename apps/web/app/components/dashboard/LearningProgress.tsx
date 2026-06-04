
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
    <div className="bg-card border border-border rounded-2xl p-5 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-foreground font-bold text-base">Continue Your Learning</h3>
        <Link href="/dashboard/my-modules">  
          <button className="text-emerald-400 text-xs font-semibold hover:text-emerald-300 transition-colors flex items-center gap-1">
          View All Modules <ArrowRight size={12} />
        </button>
        </Link>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center py-6">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-emerald-500 border-opacity-50"></div>
        </div>
      ) : progressData ? (
        <Link href={`/dashboard/assignments/${progressData.id}`} className="flex-1 flex flex-col justify-center bg-accent border border-border rounded-xl p-5 hover:bg-accent transition-colors group cursor-pointer">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 bg-blue-500/10 rounded-lg text-blue-400 group-hover:scale-110 transition-transform">
              <BookOpen size={20} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-0.5">Latest Assignment</p>
              <h4 className="text-sm font-bold text-foreground line-clamp-1">{progressData.title}</h4>
            </div>
          </div>
          <div className="w-full bg-accent rounded-full h-1.5 mt-2">
            <div className="bg-blue-500 h-1.5 rounded-full w-[15%]"></div>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-right group-hover:text-muted-foreground transition-colors">Continue <ArrowRight size={10} className="inline ml-1" /></p>
        </Link>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-background/20 border border-border rounded-xl">
          <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mb-3">
            <ArrowRight size={20} className="text-muted-foreground" />
          </div>
          <p className="text-foreground font-semibold text-sm mb-1">Nothing in progress</p>
          <p className="text-muted-foreground text-xs">Start a module to see your progress here.</p>
        </div>
      )}
    </div>
  );
}

export default LearningProgress;
