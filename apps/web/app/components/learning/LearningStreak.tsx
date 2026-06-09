import React from 'react';
import { Flame } from 'lucide-react';

export const LearningStreak = ({ streakData }: { streakData?: any[] }) => {
  // Use real data if provided, otherwise empty array
  const rawData = streakData || [];

  // Sort and validate
  const sortedData = [...rawData].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  // Create a default empty heatmap if no data
  const ensureData = () => {
    if (sortedData.length === 57) return sortedData;
    const data = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let i = 56; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      data.push({ date, intensity: 0 });
    }
    return data;
  };

  const finalData = ensureData();

  // Calculate streaks
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  for (let i = 0; i < finalData.length; i++) {
    if (finalData[i].intensity > 0) {
      tempStreak++;
      if (tempStreak > longestStreak) longestStreak = tempStreak;
      // If it's today or yesterday and we have activity, we might have a current streak
      if (i >= finalData.length - 2) {
        currentStreak = tempStreak;
      }
    } else {
      // If it's today and we don't have activity, the streak might still be alive from yesterday
      if (i < finalData.length - 1) {
        tempStreak = 0;
      }
    }
  }

  // If today has no activity, but yesterday did, currentStreak is tempStreak
  // If today and yesterday have no activity, currentStreak is 0.
  if (finalData[finalData.length - 1].intensity === 0 && finalData[finalData.length - 2].intensity === 0) {
    currentStreak = 0;
  } else if (finalData[finalData.length - 1].intensity === 0 && finalData[finalData.length - 2].intensity > 0) {
    // Keep currentStreak as is
  } else if (finalData[finalData.length - 1].intensity > 0) {
    currentStreak = tempStreak;
  }

  // Group data by week
  const weeks = [];
  for (let i = 0; i < finalData.length; i += 7) {
    weeks.push(finalData.slice(i, i + 7));
  }

  const getColor = (intensity: number) => {
    if (intensity === 0) return 'bg-accent border-border';
    if (intensity === 1) return 'bg-emerald-900/40 border-emerald-500/20';
    if (intensity === 2) return 'bg-emerald-700/60 border-emerald-500/30';
    if (intensity === 3) return 'bg-emerald-500/80 border-emerald-500/50';
    return 'bg-emerald-400 border-emerald-400';
  };

  return (
    <div className="relative group">
      <div className="relative rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-emerald-500/20 overflow-hidden">
        {/* Hover glow */}
        <div className="absolute inset-0 bg-emerald-500/0 group-hover:bg-emerald-500/3 transition-all duration-300 rounded-2xl" />

        <div className="relative z-10">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                Consistency
              </p>
              <h3 className="text-xl font-bold text-foreground">Learning Streak</h3>
            </div>

            {/* Stats */}
            <div className="flex gap-6">
              <div className="text-center">
                <p className="text-xs text-muted-foreground font-medium mb-1">
                  Current Streak
                </p>
                <div className="flex items-center justify-center gap-1.5">
                  <Flame className={currentStreak > 0 ? "text-orange-400" : "text-muted-foreground"} size={16} />
                  <p className={`text-xl font-bold ${currentStreak > 0 ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {currentStreak} <span className="text-sm text-muted-foreground font-normal">days</span>
                  </p>
                </div>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground font-medium mb-1">
                  Longest
                </p>
                <p className="text-xl font-bold text-emerald-400">
                  {longestStreak} <span className="text-sm text-emerald-600 font-normal">days</span>
                </p>
              </div>
            </div>
          </div>

          {/* Heatmap */}
          <div className="pt-2 pl-4 custom-scrollbar">
            <div className="flex gap-1.5 mb-4 min-w-max">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1.5">
                  {week.map((day, dayIndex) => {
                    const dateObj = new Date(day.date);
                    return (
                      <div
                        key={dayIndex}
                        className={`
                          w-4 h-4 rounded-sm
                          border
                          transition-all duration-200
                          hover:ring-2 hover:ring-emerald-400/50
                          cursor-pointer
                          group/day
                          relative
                          ${getColor(day.intensity)}
                        `}
                      >
                        {/* Tooltip on hover */}
                        <div
                          className={`
                            absolute top-full mb-2
                            ${
                              weekIndex < 3
                              ? 'left-0'
                              : weekIndex > weeks.length - 4
                                ? 'right-0'
                                : 'left-1/2 -translate-x-1/2'
                            }
                            px-2 py-1 rounded text-xs text-foreground
                            bg-card border border-border shadow-lg
                            whitespace-nowrap pointer-events-none
                            opacity-0 group-hover/day:opacity-100
                            transition-opacity duration-200
                            z-20
                          `}
                        >
                          {dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}: {
                            day.intensity > 0
                              ? `Activity level ${day.intensity}`
                              : 'No activity'
                          }
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-end gap-2 text-[10px] text-muted-foreground mt-2">
            <span>Less</span>
            <div className="w-3 h-3 rounded-sm bg-accent border border-border" />
            <div className="w-3 h-3 rounded-sm bg-emerald-900/40 border border-emerald-500/20" />
            <div className="w-3 h-3 rounded-sm bg-emerald-700/60 border border-emerald-500/30" />
            <div className="w-3 h-3 rounded-sm bg-emerald-500/80 border border-emerald-500/50" />
            <div className="w-3 h-3 rounded-sm bg-emerald-400 border border-emerald-400" />
            <span>More</span>
          </div>
        </div>
      </div>
    </div>
  );
};