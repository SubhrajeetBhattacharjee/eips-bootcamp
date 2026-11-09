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
    <div className="bg-white/85 backdrop-blur-md border border-[#075945]/15 rounded-2xl p-5 sm:p-6 flex flex-col h-full relative overflow-hidden group hover:border-[#075945]/30 shadow-xs transition-all">
      {/* Background Glow */}
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#075945]/8 rounded-full blur-3xl group-hover:bg-[#075945]/12 transition-all duration-500 pointer-events-none" />

      <div className="flex items-center justify-between mb-4 relative z-10">
        <h3 className="text-[#171a18] font-bold text-base flex items-center gap-2">
          <Video size={16} className="text-[#075945]" />
          Upcoming Events
        </h3>
      </div>

      <div className="flex-1 flex flex-col justify-center relative z-10">
        {loading ? (
          <div className="flex items-center justify-center py-6">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-[#075945] border-opacity-70"></div>
          </div>
        ) : events.length === 0 ? (
          <div className="bg-[#075945]/5 border border-[#075945]/15 rounded-xl p-6 text-center">
            <Calendar size={20} className="text-[#6b7280] mx-auto mb-2" />
            <p className="text-[#171a18] font-bold text-sm">No scheduled events</p>
            <p className="text-[#6b7280] text-xs mt-1">Events for your subscribed modules will appear here</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {events.slice(0, 3).map((event) => (
              <div key={event.id} className="bg-[#075945]/5 border border-[#075945]/12 rounded-xl p-3 flex flex-col gap-2 hover:bg-[#075945]/10 transition-colors">
                <div className="flex justify-between items-start">
                  <h4 className="text-sm font-semibold text-[#171a18] truncate pr-2">{event.title}</h4>
                  <span className="text-[9px] uppercase font-bold tracking-wider text-[#075945] bg-[#075945]/10 px-2 py-0.5 rounded-full flex-shrink-0">
                    {event.module?.title || 'General'}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs font-semibold text-[#075945] flex items-center gap-1">
                    <Calendar size={12} />
                    {new Date(event.date).toLocaleDateString()} {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <a href={event.link} target="_blank" rel="noreferrer" className="text-[10px] font-bold text-white bg-[#075945] hover:bg-[#064e3b] px-2.5 py-1 rounded-lg transition-colors shadow-xs">
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
