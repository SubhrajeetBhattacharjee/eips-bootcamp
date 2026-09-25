'use client';

import { Camera } from 'lucide-react';
import { ImageCarousel } from './ImageCarousel';

const eventImages = [
  {
    src: '/events/event_images/IMG_4191.png',
    alt: 'Speaker presenting on stage at a conference',
    eyebrow: 'HETC · Offline Session',
    title: 'A Space for Ideas, Learning, and Experimentation',
  },
  {
    src: '/events/event_images/IMG_4217.png',
    alt: 'Students collaborating around a table at a workshop',
    eyebrow: 'HETC · Offline Session',
    title: 'Learning becomes electric when the room builds together.',
  },
  {
    src: '/events/event_images/IMG_4213.png',
    alt: 'Audience gathered at a technology event',
    eyebrow: 'HETC · Offline Session',
    title: 'From first questions to confident ideas in one evening.',
  },
  {
    src: '/events/event_images/IMG_4203.png',
    alt: 'Speaker presenting on stage at a conference',
    eyebrow: 'HETC · Offline Session',
    title: 'Big ideas need a stage, a team, and a little room to experiment.',
  },
];

export function EventImageShowcase() {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-emerald-400/20 bg-emerald-400/[0.04] p-4 shadow-2xl shadow-emerald-950/20 sm:p-6 lg:p-8">
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl" />
      <div className="relative z-10 mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300">
            <Camera size={15} />
            <span>Event gallery</span>
          </div>
          <h2 className="max-w-2xl text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            A closer look at the rooms where the network comes alive.
          </h2>
        </div>
        <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
          A few snapshots from workshops, meetups, and hackathons across the campus network.
        </p>
      </div>
      <div className="relative z-10">
        <ImageCarousel images={eventImages} />
      </div>
    </section>
  );
}
