'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession } from '@/app/lib/auth-client';
import { DashboardShell } from '@/app/components/dashboard/DashboardShell';
import LoadingScreen from '@/app/components/ui/LoadingScreen';
import { Video, Calendar, ExternalLink, ArrowLeft, RefreshCw, Clock, Layers } from 'lucide-react';

interface EventItem {
  id: string;
  title: string;
  description: string;
  link: string;
  date: string;
  module?: {
    title: string;
  };
}

export default function EventsPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const isSignedIn = !!user;

  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/events', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setEvents(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Failed to load events:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isPending) return;
    if (!isSignedIn) {
      router.replace('/sign-in');
      return;
    }
    fetchEvents();
  }, [isPending, isSignedIn, router, fetchEvents]);

  if (isPending || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <LoadingScreen text="LOADING WORKSHOPS..." />
      </div>
    );
  }

  const now = new Date();
  const upcomingEvents = events.filter((e) => new Date(e.date) >= now);
  const pastEvents = events.filter((e) => new Date(e.date) < now);

  const displayedEvents =
    filter === 'upcoming'
      ? upcomingEvents
      : filter === 'past'
      ? pastEvents
      : events;

  return (
    <DashboardShell>
      <div className="max-w-6xl mx-auto space-y-8 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-semibold mb-2 transition-colors"
            >
              <ArrowLeft size={13} />
              <span>Back to Dashboard</span>
            </Link>
            <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight flex items-center gap-2.5">
              <Video className="text-primary dark:text-emerald-400" size={32} />
              <span>Campus Workshops & Events</span>
            </h1>
            <p className="text-sm text-muted-foreground max-w-xl leading-relaxed">
              Join live technical deep-dives, core protocol discussions, and mentor office hours with Ethereum builders.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl self-start sm:self-center">
            {(['all', 'upcoming', 'past'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                  filter === tab
                    ? 'bg-card text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab === 'all' ? `All (${events.length})` : tab === 'upcoming' ? `Upcoming (${upcomingEvents.length})` : `Past (${pastEvents.length})`}
              </button>
            ))}
          </div>
        </div>

        {/* Events Grid */}
        {displayedEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayedEvents.map((evt) => {
              const eventDate = new Date(evt.date);
              const isPast = eventDate < now;
              const day = String(eventDate.getDate()).padStart(2, '0');
              const month = eventDate.toLocaleDateString(undefined, { month: 'short' }).toUpperCase();
              const dateStr = eventDate.toLocaleDateString(undefined, {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              });
              const timeStr = eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

              return (
                <div
                  key={evt.id}
                  className={`relative p-5 rounded-2xl border transition-all flex flex-col justify-between gap-4 ${
                    isPast
                      ? 'bg-card/40 border-border/60 opacity-80'
                      : 'bg-card/90 border-border shadow-xs hover:border-primary/40'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary dark:text-emerald-400 border border-primary/20 flex flex-col items-center justify-center font-bold leading-none shrink-0 shadow-xs">
                        <span className="text-base font-black">{day}</span>
                        <span className="text-[9px] uppercase font-mono tracking-wider mt-0.5">{month}</span>
                      </div>

                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                          isPast
                            ? 'bg-muted text-muted-foreground border-border'
                            : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/25'
                        }`}
                      >
                        {isPast ? 'Completed' : 'Upcoming'}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-primary dark:text-emerald-400">
                        {evt.module?.title || 'Campus Live Track'}
                      </span>
                      <h3 className="text-base font-bold text-foreground leading-snug mt-0.5">
                        {evt.title}
                      </h3>
                      {evt.description && (
                        <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">
                          {evt.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border/50 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                      <Clock size={13} className="text-primary dark:text-emerald-400" />
                      <span>{dateStr} · {timeStr}</span>
                    </div>

                    {!isPast && evt.link && (
                      <a
                        href={evt.link}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer"
                      >
                        <span>Join</span>
                        <ExternalLink size={11} />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center border border-border/70 rounded-3xl bg-card/60 backdrop-blur-sm max-w-xl mx-auto space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary dark:text-emerald-400 flex items-center justify-center mx-auto">
              <Calendar size={28} />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-foreground">No Workshops Found</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                {filter === 'upcoming'
                  ? 'No live workshops are scheduled right now. Check back soon for announcements on upcoming core developer calls!'
                  : 'No events match your selected filter.'}
              </p>
            </div>
            <Link
              href="/dashboard/marketplace"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-xs hover:bg-primary/90 transition-all cursor-pointer"
            >
              <Layers size={14} />
              <span>Explore Self-Paced Modules</span>
            </Link>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}

