'use client';

import React from 'react';
import { Flame } from 'lucide-react';

export const LearningStreak = ({ streakData }: { streakData?: any[] }) => {
  const rawData = streakData || [];

  // Sort data safely
  const sortedData = [...rawData].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  /**
   * Map API data for fast lookup (fixes broken highlight issue)
   */
  const intensityMap = new Map(
    sortedData.map((d) => [
      new Date(d.date).toDateString(),
      d.intensity,
    ])
  );

  /**
 * Generate GitHub-style 1 year grid
 * Always keeps full 7-day columns
 */
  const ensureData = () => {
    const data: any[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Start 1 year ago
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 364);

    // Align start to Sunday (GitHub style)
    startDate.setDate(startDate.getDate() - startDate.getDay());

    const current = new Date(startDate);

    while (current <= today) {
      const key = current.toDateString();

      data.push({
        date: new Date(current),
        intensity: intensityMap.get(key) || 0,
      });

      current.setDate(current.getDate() + 1);
    }

    // Always remove incomplete last week padding
    return data;
  };

  const finalData = ensureData();

  /**
   * KEEPING YOUR EXISTING STREAK LOGIC (no change)
   */
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  for (let i = 0; i < finalData.length; i++) {
    if (finalData[i].intensity > 0) {
      tempStreak++;
      if (tempStreak > longestStreak) longestStreak = tempStreak;

      if (i >= finalData.length - 2) {
        currentStreak = tempStreak;
      }
    } else {
      if (i < finalData.length - 1) {
        tempStreak = 0;
      }
    }
  }

  if (
    finalData[finalData.length - 1].intensity === 0 &&
    finalData[finalData.length - 2].intensity === 0
  ) {
    currentStreak = 0;
  } else if (
    finalData[finalData.length - 1].intensity === 0 &&
    finalData[finalData.length - 2].intensity > 0
  ) {
    // keep streak as is
  } else if (finalData[finalData.length - 1].intensity > 0) {
    currentStreak = tempStreak;
  }

  /**
   * GitHub style weekly columns
   */
  const weeks: any[][] = [];
  let currentWeek: any[] = [];

  finalData.forEach((day) => {
    currentWeek.push(day);

    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });
  
  // Added weekday labels
  const weekdays = ['Mon', 'Wed', 'Fri'];

  if (currentWeek.length) weeks.push(currentWeek);

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
              <h3 className="text-xl font-bold text-foreground">
                Learning Streak
              </h3>
            </div>

            {/* Stats */}
            <div className="flex gap-6">
              <div className="text-center">
                <p className="text-xs text-muted-foreground font-medium mb-1">
                  Current Streak
                </p>
                <div className="flex items-center justify-center gap-1.5">
                  <Flame
                    className={
                      currentStreak > 0
                        ? 'text-orange-400'
                        : 'text-muted-foreground'
                    }
                    size={16}
                  />
                  <p className="text-xl font-bold text-foreground">
                    {currentStreak}{' '}
                    <span className="text-sm text-muted-foreground font-normal">
                      days
                    </span>
                  </p>
                </div>
              </div>

              <div className="text-center">
                <p className="text-xs text-muted-foreground font-medium mb-1">
                  Longest
                </p>
                <p className="text-xl font-bold text-emerald-400">
                  {longestStreak}{' '}
                  <span className="text-sm text-emerald-600 font-normal">
                    days
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Heatmap */}
          <div className="pt-4 flex justify-center overflow-visible">
            <div className="flex">

              {/* Weekday labels */}
              <div className="flex flex-col gap-2 mr-3 pt-5 text-xs text-muted-foreground">
                <span className="h-4"></span>
                <span className="h-4">Mon</span>
                <span className="h-3.5"></span>
                <span className="h-4">Wed</span>
                <span className="h-3"></span>
                <span className="h-4">Fri</span>
              </div>

              <div>

                {/* Month labels */}
                <div className="flex gap-1.5 mb-2 h-4">
                  {weeks.map((week, index) => {
                    const date = new Date(week[0].date);

                    const currentMonth = date.getMonth();

                    const previousMonth =
                      index > 0
                        ? new Date(weeks[index - 1][0].date).getMonth()
                        : null;

                    const showMonth =
                      index === 0 || currentMonth !== previousMonth;


                    return (
                      <div
                        key={index}
                        className="w-4 text-[11px] text-muted-foreground"
                      >
                        {showMonth
                          ? date.toLocaleString('default', {
                              month: 'short',
                            })
                          : ''}
                      </div>
                    );
                  })}
                </div>


                {/* Heatmap columns */}
                <div className="flex gap-1.5">

                  {weeks.map((week, weekIndex) => (
                    <div
                      key={weekIndex}
                      className="flex flex-col gap-1.5"
                    >

                      {week.map((day, dayIndex) => {
                        const dateObj = new Date(day.date);

                        return (
                          <div
                            key={dayIndex}
                            className={`w-4 h-4 rounded-sm border transition-all duration-200 hover:ring-2 hover:ring-emerald-400/50 cursor-pointer group/day relative ${getColor(
                              day.intensity
                            )}`}
                          >

                            {/* Tooltip */}
                            <div className="absolute z-50 left-1/2 -translate-x-1/2 bottom-full mb-2 px-2 py-1 rounded-md text-[11px] leading-tight text-white bg-black/90 backdrop-blur-md border border-white/10 shadow-xl whitespace-nowrap pointer-events-none opacity-0 group-hover/day:opacity-100 transition-opacity duration-150">
                              {dateObj.toLocaleDateString(undefined, {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}

                              <div className="text-[10px] text-white/70 mt-0.5">
                                {day.intensity > 0
                                  ? `Activity level ${day.intensity}`
                                  : 'No activity'}
                              </div>
                            </div>

                          </div>
                        );
                      })}

                    </div>
                  ))}

                </div>

              </div>

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