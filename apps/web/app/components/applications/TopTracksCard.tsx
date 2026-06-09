'use client';

export default function TopTracksCard({ applications }: { applications: any[] }) {
  // Calculate track statistics
  const trackStats = applications.reduce((acc: any, app: any) => {
    const track = app.track || 'N/A';
    acc[track] = (acc[track] || 0) + 1;
    return acc;
  }, {});

  const topTracks = Object.entries(trackStats)
    .map(([track, count]) => ({ track, count: count as number }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);

  const trackColors: { [key: string]: string } = {
    'Smart Contract': 'from-purple-500 to-purple-400',
    'Frontend': 'from-blue-500 to-blue-400',
    'DevOps': 'from-orange-500 to-orange-400',
    'Blockchain Research': 'from-pink-500 to-pink-400',
    'N/A': 'from-gray-500 to-gray-400',
  };

  return (
    <div className="bg-gradient-to-br from-slate-100/90 via-slate-200/70 to-slate-300/50
  dark:from-slate-800/80 dark:via-slate-900/60 dark:to-slate-900/40 border border-emerald-400/10 rounded-xl p-5 backdrop-blur-md">
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-1">Top Tracks</h3>
          <p className="text-xs text-muted-foreground">Most applied tracks</p>
        </div>

        <div className="space-y-3">
          {topTracks.length > 0 ? (
            topTracks.map((item, index) => (
              <div key={index} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-medium">{item.track}</span>
                  <span className="text-xs font-bold text-foreground">{item.count}</span>
                </div>
                <div className="w-full h-1.5 bg-accent rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${trackColors[item.track] || trackColors['N/A']} rounded-full`}
                    style={{
                      width: `${Math.max((item.count / Math.max(...topTracks.map(t => t.count))) * 100, 10)}%`,
                    }}
                  />
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-muted-foreground text-center py-4">No data available</p>
          )}
        </div>
      </div>
    </div>
  );
}