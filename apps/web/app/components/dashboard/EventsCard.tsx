
import { Video, Clock } from 'lucide-react';

export function EventsCard() {
  return (
    <div className="bg-[#0d0d0d] border border-white/8 rounded-2xl p-5 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-bold text-base">Upcoming Events</h3>
        <button className="text-emerald-400 text-xs font-semibold hover:text-emerald-300 transition-colors">
          View All
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center bg-black/20 border border-white/5 rounded-xl p-6 text-center">
        <div>
          <Clock size={20} className="text-zinc-500 mx-auto mb-2" />
          <p className="text-white font-semibold text-sm">No upcoming event</p>
          <p className="text-zinc-500 text-xs mt-1">Check back later for new workshops.</p>
        </div>
      </div>
    </div>
  );
}

export default EventsCard;
