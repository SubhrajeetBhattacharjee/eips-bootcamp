import React from 'react';

export const LearningProgressWidget = ({ stats }: { stats?: any }) => {
  const data = stats || {
    totalModules: 0,
    modulesCompleted: 0
  };

  const progress = data.totalModules > 0 ? Math.min(100, Math.floor((data.modulesCompleted / data.totalModules) * 100)) : 0;
  
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="bg-[#0d0d0d] border border-white/8 rounded-2xl p-6 flex flex-col h-full hover:border-emerald-500/20 transition-all duration-300">
      <h3 className="text-white font-bold text-base mb-6">Course Progress</h3>

      <div className="flex-1 flex flex-col items-center justify-center gap-6">
        {/* Circular progress */}
        <div className="relative group">
          {/* Hover glow */}
          <div className="absolute inset-0 bg-emerald-500/0 group-hover:bg-emerald-500/10 rounded-full blur-xl transition-all duration-300" />
          
          <svg width="140" height="140" viewBox="0 0 140 140" className="-rotate-90 relative z-10">
            {/* Track */}
            <circle
              cx="70"
              cy="70"
              r={radius}
              fill="none"
              stroke="#ffffff08"
              strokeWidth="8"
            />
            {/* Progress */}
            <circle
              cx="70"
              cy="70"
              r={radius}
              fill="none"
              stroke="#10b981"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{
                filter: 'drop-shadow(0 0 6px rgba(16,185,129,0.4))',
                transition: 'stroke-dashoffset 1.5s ease-in-out',
              }}
            />
          </svg>
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center relative z-10">
            <span className="text-white font-black text-3xl tracking-tight">{progress}%</span>
          </div>
        </div>

        <div className="w-full">
          <div className="flex justify-between text-xs mb-2">
            <span className="text-zinc-400">Completed</span>
            <span className="font-semibold text-white">{data.modulesCompleted} / {data.totalModules} Modules</span>
          </div>
          <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-500/50 rounded-full transition-all duration-1000"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};