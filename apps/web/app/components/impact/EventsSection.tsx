// apps/web/components/community/EventsSection.tsx

import React from 'react';
import { Calendar, Users, MapPin, ArrowRight } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  college: string;
  date: string;
  attendees: string;
  type: 'workshop' | 'meetup' | 'hackathon' | 'talk' | 'offline session' | 'online session';
  image?: string;
}

const events: Event[] = [
  {
    id: '1',
    title: 'Ethereum, EIPs, and The Future of Web3 ecosystem',
    college: 'Hooghly Engineering & Technology College',
    date: 'Aug 27, 2026',
    attendees: '20-25',
    type: 'offline session',
    image: '/events/event_posters/Event poster.jpeg',
  },
  // {
  //   id: '1',
  //   title: 'Solidity Fundamentals Workshop',
  //   college: 'IIT Delhi',
  //   date: 'May 15, 2024',
  //   attendees: 120,
  //   type: 'workshop',
  // },
  // {
  //   id: '2',
  //   title: 'Web3 Startup Pitch Night',
  //   college: 'BITS Pilani',
  //   date: 'May 22, 2024',
  //   attendees: 85,
  //   type: 'meetup',
  // },
  // {
  //   id: '3',
  //   title: 'EthShala Hackathon 2024',
  //   college: 'NIT Mumbai',
  //   date: 'June 1-3, 2024',
  //   attendees: 250,
  //   type: 'hackathon',
  // },
  // {
  //   id: '4',
  //   title: 'Smart Contract Security Talk',
  //   college: 'Delhi University',
  //   date: 'June 10, 2024',
  //   attendees: 95,
  //   type: 'talk',
  // },
];

const typeColors = {
  workshop: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  meetup: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  'offline session': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  hackathon: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  'online session': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  talk: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
};

export const EventsSection: React.FC = () => {
  return (
    <div className="relative group h-full lg:col-span-2">
      <div
        className={`
          relative rounded-2xl
          border border-blue-500/30
          bg-gradient-to-br from-blue-500/10 to-blue-500/5
          backdrop-blur-xl
          p-4 sm:p-6
          transition-all duration-300
          hover:border-blue-500/60
          hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]
          overflow-hidden
          flex flex-col
        `}
      >
        {/* Background gradient */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 bg-gradient-to-br from-blue-400 to-transparent pointer-events-none" />

        <div className="relative z-10 flex-1 flex flex-col">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🎓</span>
              <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                Events & Workshops
              </p>
            </div>
            <h3 className="text-2xl font-bold text-foreground mt-1">
              College Events
            </h3>
          </div>

          <div className="mb-4 mt-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-400">On the calendar</p>
              <h4 className="mt-1 text-xl font-bold text-foreground">Recent gatherings</h4>
            </div>
            <span className="text-xs text-muted-foreground">{events.length} highlights</span>
          </div>

          {/* Events List */}
          <div className="grid flex-1 gap-4 sm:grid-cols-2">
            {events.map((event) => (
              <div
                key={event.id}
                className={`
                  rounded-lg border border-border
                  bg-card/60 hover:bg-accent
                  flex flex-col p-3 transition-all duration-200
                  group/event
                `}
              >
                {event.image && (
                  <div className="mb-3 shrink-0 overflow-hidden rounded-lg border border-border bg-white shadow-sm">
                    <img
                      src={event.image}
                      alt={`${event.title} event poster`}
                      className="aspect-video w-full object-contain transition duration-500 group-hover/event:scale-[1.02]"
                    />
                  </div>
                )}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">
                      {event.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {event.college}
                    </p>
                  </div>
                  <span
                    className={`
                      text-xs font-medium px-2 py-1 rounded border
                      whitespace-nowrap flex-shrink-0
                      ${typeColors[event.type]}
                    `}
                  >
                    {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar size={12} />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users size={12} />
                    <span>{event.attendees}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* View All Button */}
          {/* <div className="mt-6 pt-4 border-t border-gray-700/50">
            <button
              className={`
                w-full rounded-lg font-medium py-3 px-4
                transition-all duration-200
                border border-blue-500/50 hover:border-blue-500/80
                bg-blue-500/10 hover:bg-blue-500/20
                text-blue-300 hover:text-blue-200
                text-sm flex items-center justify-center gap-2
              `}
            >
              <span>View All Events</span>
              <ArrowRight size={16} />
            </button>
          </div> */}
        </div>

        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </div>
  );
};