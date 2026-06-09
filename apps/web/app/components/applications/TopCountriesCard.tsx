'use client';

export default function TopCountriesCard({ applications }: { applications: any[] }) {
  // Calculate country/city statistics
  const countryStats = applications.reduce((acc: any, app: any) => {
    const country = app.city || 'Other';
    acc[country] = (acc[country] || 0) + 1;
    return acc;
  }, {});

  const topCountries = Object.entries(countryStats)
    .map(([country, count]) => ({ country, count: count as number }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);

  const countryEmojis: { [key: string]: string } = {
    'India': '🇮🇳',
    'Nigeria': '🇳🇬',
    'Indonesia': '🇮🇩',
    'Egypt': '🇪🇬',
    'Other': '🌍',
  };

  return (
    <div className="bg-gradient-to-br from-slate-100/90 via-slate-200/70 to-slate-300/50
  dark:from-slate-800/80 dark:via-slate-900/60 dark:to-slate-900/40 border border-emerald-400/10 rounded-xl p-5 backdrop-blur-md">
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-1">Top Countries</h3>
          <p className="text-xs text-muted-foreground">Most active locations</p>
        </div>

        <div className="space-y-2">
          {topCountries.length > 0 ? (
            topCountries.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2.5 bg-background/20 rounded-lg hover:bg-background/40 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{countryEmojis[item.country] || '🌍'}</span>
                  <span className="text-sm text-foreground font-medium">{item.country}</span>
                </div>
                <span className="text-sm font-bold text-emerald-400">{item.count}</span>
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