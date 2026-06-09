'use client';

export default function ApplicationInsights({ applications }: { applications: any[] }) {
  // Generate mock chart data
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const data = [45, 52, 48, 61, 55, 67];
  const maxValue = Math.max(...data);

  return (
    <div className="bg-gradient-to-br from-slate-100/90 via-slate-200/70 to-slate-300/50
  dark:from-slate-800/80 dark:via-slate-900/60 dark:to-slate-900/40 border border-emerald-400/10 rounded-xl p-5 backdrop-blur-md">
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-1">Application Insights</h3>
          <p className="text-xs text-muted-foreground">Applications by month</p>
        </div>

        {/* Mini Chart */}
        <div className="h-32 flex items-end justify-between gap-2">
          {data.map((value, index) => (
            <div
              key={index}
              className="flex-1 group"
            >
              <div className="relative h-full flex items-end justify-center">
                <div
                  className="w-full rounded-t-md bg-gradient-to-t from-emerald-500 to-emerald-400 hover:from-emerald-600 hover:to-emerald-500 transition-colors cursor-pointer group-hover:shadow-lg group-hover:shadow-emerald-500/50"
                  style={{
                    height: `${(value / maxValue) * 100}%`,
                  }}
                />
              </div>
              <p className="text-xs text-muted-foreground text-center mt-2">{months[index]}</p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="pt-4 border-t border-emerald-400/10 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Total This Month</span>
            <span className="text-sm font-semibold text-emerald-400">67</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Growth</span>
            <span className="text-sm font-semibold text-emerald-400">+21.8%</span>
          </div>
        </div>
      </div>
    </div>
  );
}