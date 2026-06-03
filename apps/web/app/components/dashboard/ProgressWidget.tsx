export function ProgressWidget({ progress = 0 }: { progress?: number }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="bg-[#0d0d0d] border border-white/8 rounded-2xl p-5 flex flex-col h-full">
      <h3 className="text-white font-bold text-base mb-4">Your Progress</h3>

      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        {/* Circular progress */}
        <div className="relative">
          <svg width="140" height="140" viewBox="0 0 140 140" className="-rotate-90">
            {/* Track */}
            <circle
              cx="70"
              cy="70"
              r={radius}
              fill="none"
              stroke="#ffffff08"
              strokeWidth="10"
            />
            {/* Progress */}
            <circle
              cx="70"
              cy="70"
              r={radius}
              fill="none"
              stroke="#10b981"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{
                filter: 'drop-shadow(0 0 8px rgba(16,185,129,0.6))',
                transition: 'stroke-dashoffset 1s ease-in-out',
              }}
            />
          </svg>
          {/* Center text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white font-black text-3xl">{progress}%</span>
          </div>
        </div>

        <div className="text-center">
          <p className="text-white font-bold text-sm">Overall Progress</p>
          <p className="text-emerald-400/80 text-[11px] font-medium mt-1">Keep learning to reach the next rank!</p>
        </div>
      </div>
    </div>
  );
}

export default ProgressWidget;
