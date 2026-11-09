import { ActivityItem } from '../../lib/dashboard';
import { User, Users, Star, ShieldCheck } from 'lucide-react';

const iconConfig: Record<ActivityItem['icon'], { icon: React.ReactNode; bg: string }> = {
  profile: {
    icon: <User size={15} />,
    bg: 'bg-[#075945]/10 text-[#075945] border-[#075945]/20',
  },
  referral: {
    icon: <Users size={15} />,
    bg: 'bg-[#7c3aed]/10 text-[#7c3aed] border-[#7c3aed]/20',
  },
  xp: {
    icon: <Star size={15} />,
    bg: 'bg-[#075945]/10 text-[#075945] border-[#075945]/20',
  },
  cap: {
    icon: <ShieldCheck size={15} />,
    bg: 'bg-[#d97706]/10 text-[#d97706] border-[#d97706]/20',
  },
};

export function ActivityFeed({ activities }: { activities: ActivityItem[] }) {
  return (
    <div className="bg-white/85 backdrop-blur-md border border-[#075945]/15 rounded-2xl p-5 sm:p-6 flex flex-col h-full shadow-xs hover:border-[#075945]/30 transition-all">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[#171a18] font-bold text-base">Recent Activity</h3>
        <button className="text-[#075945] text-xs font-bold hover:underline transition-colors">
          View All
        </button>
      </div>

      <ul className="space-y-3.5">
        {activities.length > 0 ? (
          activities.map((item) => {
          const { icon, bg } = iconConfig[item.icon] || iconConfig['xp'];
          return (
            <li key={item.id} className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-full border flex items-center justify-center flex-shrink-0 mt-0.5 ${bg}`}>
                {icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[#171a18] text-sm font-semibold leading-tight">{item.title}</p>
                  <span className="text-[#6b7280] text-[10px] font-medium flex-shrink-0 mt-0.5">{item.time}</span>
                </div>
                <p className="text-[#4b5563] text-xs mt-0.5 leading-relaxed">{item.description}</p>
              </div>
            </li>
          );
        })
        ) : (
          <li className="text-center text-[#6b7280] text-xs py-6">No recent activity</li>
        )}
      </ul>
    </div>
  );
}

export default ActivityFeed;
