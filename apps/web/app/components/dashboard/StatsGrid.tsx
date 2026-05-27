import { mockStats } from '../../lib/dashboard-data';;
import { StatsCard } from './StatsCard';

export function StatsGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {mockStats.map((stat) => (
        <StatsCard key={stat.id} stat={stat} />
      ))}
    </div>
  );
}

export default StatsGrid;
