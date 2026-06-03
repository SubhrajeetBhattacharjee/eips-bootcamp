'use client';

import { Calendar, Video } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSession } from '@/app/lib/auth-client';

export function UpcomingEventsWidget() {
  const { data: session } = useSession();
  const user = session?.user;
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    
    fetch(`/api/events/upcoming?userId=${user.id}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setEvents(data);
        } else {
          setEvents([]);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user?.id]);

  return (
    <div className="bg-[#0d0d0d] border border-white/8 rounded-2xl p-5 flex flex-col h-full relative overflow-hidden group hover:border-emerald-500/30 transition-all duration-300">
      {/* Background Glow */}
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all duration-500 pointer-events-none" />

      <div className="flex items-center justify-between mb-4 relative z-10">
        <h3 className="text-white font-bold text-base flex items-center gap-2">
          <Video size={16} className="text-emerald-400" />
          Upcoming Events
        </h3>
      </div>

      <div className="flex-1 flex flex-col justify-center relative z-10">
        {loading ? (
          <div className="flex items-center justify-center py-6">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-emerald-500 border-opacity-50"></div>
          </div>
        ) : events.length === 0 ? (
          <div className="bg-black/20 border border-white/5 rounded-xl p-6 text-center">
            <Calendar size={20} className="text-zinc-500 mx-auto mb-2" />
            <p className="text-white font-semibold text-sm">No scheduled events</p>
            <p className="text-zinc-500 text-xs mt-1">Events for your subscribed modules will appear here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {events.slice(0, 3).map((event) => (
              <div key={event.id} className="bg-white/5 border border-white/10 rounded-lg p-3 flex flex-col gap-2 hover:bg-white/10 transition-colors">
                <div className="flex justify-between items-start">
                  <h4 className="text-sm font-semibold text-white truncate pr-2">{event.title}</h4>
                  <span className="text-[9px] uppercase font-bold tracking-wider text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded flex-shrink-0">
                    {event.module?.title || 'General'}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs font-medium text-emerald-400 flex items-center gap-1">
                    <Calendar size={12} />
                    {new Date(event.date).toLocaleDateString()} {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <a href={event.link} target="_blank" rel="noreferrer" className="text-[10px] font-bold text-black bg-emerald-500 hover:bg-emerald-400 px-2 py-1 rounded transition-colors">
                    JOIN
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
