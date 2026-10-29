// apps/web/app/components/community/EventsSection.tsx

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { GraduationCap, MapPin, Users, ArrowRight, Sparkles } from 'lucide-react';
import { gsap } from 'gsap';

interface Event {
  id: string;
  title: string;
  college: string;
  date: string;
  day: string;
  month: string;
  attendees: string;
  type: 'offline session' | 'hackathon' | 'workshop' | 'hands-on session';
  image: string;
  description: string;
  color: string;
}

const events: Event[] = [
  {
    id: '1',
    title: 'Ethereum, EIPs, and The Future of Web3 ecosystem',
    college: 'Hooghly Engineering & Technology College',
    date: 'Aug 27, 2026',
    day: '27',
    month: 'AUG',
    attendees: '20-25 students',
    type: 'offline session',
    image: '/events/event_posters/Event poster.jpeg',
    description: 'An interactive deep dive introducing core Ethereum architecture, EIP standards, and student ecosystem opportunities.',
    color: 'bg-[#ffd359] text-black',
  },
  {
    id: '2',
    title: 'InnovoCon Hacknex 2.0',
    college: 'Hackathon, Kolkata',
    date: 'Sept 27, 2026',
    day: '27',
    month: 'SEPT',
    attendees: '100+ hackers',
    type: 'hackathon',
    image: '/events/event_images/InnovoCon2_1.webp',
    description: 'Mentoring student builders building innovative smart contract projects and decentralized applications.',
    color: 'bg-[#dfdbfc] text-black',
  },
  {
    id: '3',
    title: 'WEB3 Hands-on Session',
    college: 'MCKV Institute of Engineering',
    date: 'Oct 08, 2026',
    day: '08',
    month: 'OCT',
    attendees: '40+ students',
    type: 'hands-on session',
    image: '/events/event_images/IMG_4200.webp',
    description: 'Live coding walkthrough on wallet integration, smart contract interaction, and building on Ethereum testnets.',
    color: 'bg-[#d8f0dd] text-black',
  },
];

export const EventsSection: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string>('all');
  const cardsRef = useRef<HTMLDivElement>(null);

  const filteredEvents = selectedType === 'all' 
    ? events 
    : events.filter(e => e.type.includes(selectedType));

  useEffect(() => {
    if (cardsRef.current) {
      gsap.fromTo(
        cardsRef.current.children,
        { opacity: 0, y: 30, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.12, ease: 'power2.out' }
      );
    }
  }, [selectedType]);

  return (
    <div className="relative w-full">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute -left-20 top-1/4 h-80 w-80 rounded-full bg-[#075945]/15 blur-[120px]" />
      <div className="pointer-events-none absolute -right-20 bottom-10 h-72 w-72 rounded-full bg-[#f8bd36]/10 blur-[130px]" />

      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-white/10">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#075945]/40 text-[#61d9b9] border border-[#61d9b9]/30">
              <GraduationCap size={15} />
            </span>
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#61d9b9]">
              Events &amp; Workshops
            </span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#f8bd36]" />
            <span
              className="font-caveat text-[#f8bd36] text-[20px] font-bold transform -rotate-1 hidden sm:inline-block leading-none"
              style={{ fontFamily: '"Caveat", cursive' }}
            >
              ~ practical hands-on workshops
            </span>
          </div>

          <h2 className="font-sans text-[clamp(2.5rem,5vw,4rem)] font-black leading-[1.02] tracking-tight text-white">
            College Events
          </h2>
          <p className="mt-4 text-[16px] sm:text-[18px] text-white/70 max-w-xl font-medium leading-relaxed">
            Hands-on bootcamps, technical workshops, and hackathons bringing Ethereum education directly to campus classrooms.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {['all', 'offline', 'hackathon', 'hands-on'].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-bold capitalize transition-all duration-200 ${
                selectedType === type
                  ? 'bg-[#61d9b9] text-black shadow-md shadow-[#61d9b9]/25'
                  : 'bg-white/10 text-white/80 hover:bg-white/20 border border-white/10'
              }`}
            >
              {type === 'all' ? 'All Events' : type}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid with Generous Image Spacing */}
      <div ref={cardsRef} className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
        {filteredEvents.map((event) => (
          <article
            key={event.id}
            className="group flex flex-col rounded-2xl border border-white/10 bg-[#0a1a15]/80 backdrop-blur-md overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:border-[#61d9b9]/50 hover:shadow-2xl hover:shadow-[#075945]/30"
          >
            {/* Event Poster Image with Aspect Ratio and Zoom Effect */}
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/40">
              <img
                src={event.image}
                alt={`${event.title} event poster`}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Floating Date Badge */}
              <div className="absolute top-3.5 left-3.5 flex items-center gap-2 rounded-xl bg-black/70 backdrop-blur-md border border-white/20 px-3 py-1.5 shadow-lg">
                <span className="block text-base font-black text-[#ffd359] leading-none">
                  {event.day}
                </span>
                <span className="text-[10px] font-bold tracking-widest uppercase text-white/90">
                  {event.month}
                </span>
              </div>

              {/* Event Type Chip */}
              <div className="absolute top-3.5 right-3.5">
                <span className="rounded-full border border-white/20 bg-black/60 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#61d9b9] backdrop-blur-md">
                  {event.type}
                </span>
              </div>

              {/* College name overlay on image bottom */}
              <div className="absolute bottom-3 left-4 right-4 flex items-center gap-1.5 text-xs text-white/90 font-medium">
                <MapPin size={13} className="text-[#ffd359] shrink-0" />
                <span className="truncate">{event.college}</span>
              </div>
            </div>

            {/* Event Details Content */}
            <div className="p-6 flex flex-1 flex-col justify-between">
              <div>
                <h4 className="font-sans text-xl font-bold leading-snug tracking-tight text-white group-hover:text-[#61d9b9] transition-colors line-clamp-2">
                  {event.title}
                </h4>

                <p className="mt-3 text-sm text-white/70 line-clamp-2 leading-relaxed">
                  {event.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-white/60">
                <span className="flex items-center gap-1.5 font-medium text-white/80">
                  <Users size={14} className="text-[#61d9b9]" />
                  <span>{event.attendees}</span>
                </span>

                <span className="inline-flex items-center gap-1 font-bold text-[#61d9b9] group-hover:translate-x-1 transition-transform">
                  View Recap
                  <ArrowRight size={14} />
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};