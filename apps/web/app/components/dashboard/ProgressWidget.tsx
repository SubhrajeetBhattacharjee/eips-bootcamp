export function ProgressWidget({ progress = 0 }: { progress?: number }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="bg-white/85 backdrop-blur-md border border-[#075945]/15 rounded-2xl p-5 sm:p-6 flex flex-col h-full shadow-xs hover:border-[#075945]/30 transition-all">
      <h3 className="text-[#171a18] font-bold text-base mb-4">Your XP Progress</h3>

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
              stroke="#07594518"
              strokeWidth="10"
            />
            {/* Progress */}
            <circle
              cx="70"
              cy="70"
              r={radius}
              fill="none"
              stroke="#075945"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{
                filter: 'drop-shadow(0 2px 8px rgba(7,89,69,0.3))',
                transition: 'stroke-dashoffset 1s ease-in-out',
              }}
            />
          </svg>
          {/* Center text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[#171a18] font-black text-3xl font-mono">{progress}%</span>
          </div>
        </div>

        <div className="text-center">
          <p className="text-[#171a18] font-bold text-sm">Overall Progress</p>
          <p className="text-[#075945] text-xs font-semibold mt-1">Keep learning to reach the next rank!</p>
        </div>
      </div>
    </div>
  );
}

export default ProgressWidget;
