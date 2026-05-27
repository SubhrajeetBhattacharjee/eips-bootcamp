import { mockLearningModule } from '../../lib/dashboard-data';
import { ArrowRight } from 'lucide-react';

export function LearningProgress() {
  const { title, progress } = mockLearningModule;

  return (
    <div className="bg-[#0d0d0d] border border-white/8 rounded-2xl p-5 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-bold text-base">Continue Your Learning</h3>
        <button className="text-emerald-400 text-xs font-semibold hover:text-emerald-300 transition-colors flex items-center gap-1">
          View All Modules <ArrowRight size={12} />
        </button>
      </div>

      {/* Module card */}
      <div className="flex gap-4 items-center bg-black/30 border border-white/5 rounded-xl p-3.5">
        {/* Thumbnail placeholder */}
        <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-emerald-900/60 to-black border border-emerald-500/20 flex items-center justify-center flex-shrink-0 overflow-hidden">
          {/* Ethereum logo placeholder */}
          <svg viewBox="0 0 60 80" className="w-10 h-12 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]" fill="none">
            <defs>
              <linearGradient id="ethSmTop" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6ee7b7" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#059669" stopOpacity="0.7" />
              </linearGradient>
              <linearGradient id="ethSmBot" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#047857" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#022c22" stopOpacity="0.95" />
              </linearGradient>
            </defs>
            <polygon points="30,2 54,32 30,42 6,32" fill="url(#ethSmTop)" />
            <polygon points="30,2 6,32 30,42" fill="#34d399" opacity="0.5" />
            <polygon points="30,42 54,32 30,78" fill="url(#ethSmBot)" />
            <polygon points="30,42 6,32 30,78" fill="#065f46" opacity="0.8" />
          </svg>
        </div>

        {/* Module info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-emerald-400 text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
              In Progress
            </span>
          </div>
          <h4 className="text-white font-bold text-sm leading-tight mb-3">{title}</h4>

          {/* Progress bar */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-1.5 bg-white/8 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-700 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-zinc-400 text-xs font-medium flex-shrink-0">{progress}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LearningProgress;
