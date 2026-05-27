import { mockEvents } from '../../lib/dashboard-data';;
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

      <div className="space-y-3">
        {mockEvents.map((event) => (
          <div
            key={event.id}
            className="flex items-center gap-4 bg-black/30 border border-white/5 rounded-xl p-3.5 hover:border-white/10 transition-colors"
          >
            {/* Date badge */}
            <div className="w-12 flex-shrink-0 flex flex-col items-center justify-center bg-emerald-500/10 border border-emerald-500/20 rounded-xl py-2">
              <span className="text-emerald-400 text-[10px] font-bold uppercase tracking-wider leading-none">
                {event.month}
              </span>
              <span className="text-white font-black text-xl leading-tight">{event.day}</span>
            </div>

            {/* Event info */}
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm leading-tight">{event.title}</p>
              <div className="flex items-center gap-3 mt-1.5">
                <span className="flex items-center gap-1 text-zinc-500 text-xs">
                  <Video size={11} />
                  {event.platform}
                </span>
                <span className="flex items-center gap-1 text-zinc-500 text-xs">
                  <Clock size={11} />
                  {event.time}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EventsCard;
