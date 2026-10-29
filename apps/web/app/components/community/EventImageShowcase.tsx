// apps/web/app/components/community/EventImageShowcase.tsx

'use client';

import { Camera } from 'lucide-react';
import { ImageCarousel } from './ImageCarousel';

const eventImages = [
  {
    src: '/events/event_images/IMG_4191.webp',
    alt: 'Speaker presenting on stage at a conference',
    eyebrow: 'HETC · Offline Session',
    title: 'A Space for Ideas, Learning, and Experimentation.',
  },
  {
    src: '/events/event_images/InnovoCon2_1.webp',
    alt: 'Students collaborating around a table at a workshop',
    eyebrow: 'InnovoCon Hacknex 2.0 · Hackathon',
    title: 'From Ideas to Working Solutions.',
  },
  {
    src: '/events/event_images/IMG_4217.webp',
    alt: 'Students collaborating around a table at a workshop',
    eyebrow: 'HETC · Offline Session',
    title: 'Learning becomes electric when the room builds together.',
  },
  {
    src: '/events/event_images/InnovoCon2_2.webp',
    alt: 'Students collaborating around a table at a workshop',
    eyebrow: 'InnovoCon Hacknex 2.0 · Hackathon',
    title: 'From First Idea to Final Build.',
  },
  {
    src: '/events/event_images/IMG_4213.webp',
    alt: 'Audience gathered at a technology event',
    eyebrow: 'HETC · Offline Session',
    title: 'From first questions to confident ideas in one evening.',
  },
  {
    src: '/events/event_images/IMG_4203.webp',
    alt: 'Speaker presenting on stage at a conference',
    eyebrow: 'HETC · Offline Session',
    title: 'Big ideas need a stage, a team, and a little room to experiment.',
  },
];

export function EventImageShowcase() {
  return (
    <div className="relative w-full">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[#61d9b9]/10 blur-[140px]" />
      <div className="pointer-events-none absolute -left-20 -bottom-20 h-96 w-96 rounded-full bg-[#f8bd36]/5 blur-[140px]" />

      {/* Header */}
      <div className="relative z-10 mb-12 flex flex-col justify-between gap-6 sm:flex-row sm:items-end border-b border-white/10 pb-8">
        <div>
          <div className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.25em] text-[#61d9b9]">
            <Camera size={15} />
            <span>Event gallery</span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#f8bd36] ml-1" />
            <span
              className="font-caveat text-[#f8bd36] text-[20px] sm:text-[22px] font-bold transform -rotate-1 hidden md:inline-block ml-1 leading-none"
              style={{ fontFamily: '"Caveat", cursive' }}
            >
              ~ live from classrooms &amp; hackathons
            </span>
          </div>
          <h2 className="font-sans max-w-3xl text-[clamp(2.5rem,5vw,4rem)] font-black leading-[1.02] tracking-tight text-white">
            A closer look at the rooms where the network comes alive.
          </h2>
        </div>
        <p className="max-w-xs text-sm sm:text-base leading-relaxed text-white/70 font-medium">
          Snapshots from technical workshops, hackathons, and community meetups across our campus network.
        </p>
      </div>

      <div className="relative z-10">
        <ImageCarousel images={eventImages} />
      </div>
    </div>
  );
}
