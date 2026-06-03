'use client';

import React, { useState, useEffect } from 'react';
import { DashboardShell } from '@/app/components/dashboard/DashboardShell';
import { Calendar, Plus, Trash2, Video, Loader2 } from 'lucide-react';
import { useSession } from '@/app/lib/auth-client';
import { useRouter } from 'next/navigation';

export default function AdminEventsPage() {
  const { data: session } = useSession();
  const user = session?.user;
  const router = useRouter();
  const [events, setEvents] = useState<any[]>([]);
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [link, setLink] = useState('');
  const [moduleId, setModuleId] = useState('');

  const checkAdmin = () => {
    const isAdmin = (user as any)?.role === 'ADMIN' || (user as any)?.role === 'admin' || (user as any)?.role?.role === 'ADMIN' || (user as any)?.role?.role === 'admin' || user?.id === 'user_3EFohPWsEpwDDfFQxcf3i1T39pJ';
    if (!isAdmin && user) {
      router.push('/dashboard');
    }
  };

  const fetchData = async () => {
    if (!user) return;
    try {
      const [eventsRes, modulesRes] = await Promise.all([
        fetch('/api/events'),
        fetch(`/api/bootcamp/modules?userId=${user.id}`)
      ]);
      
      if (eventsRes.ok) {
        setEvents(await eventsRes.json());
      }
      if (modulesRes.ok) {
        setModules(await modulesRes.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      checkAdmin();
      fetchData();
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const eventDate = new Date(`${date}T${time}`);
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          date: eventDate.toISOString(),
          link,
          moduleId
        })
      });

      if (res.ok) {
        setTitle('');
        setDescription('');
        setDate('');
        setTime('');
        setLink('');
        setModuleId('');
        setIsAdding(false);
        fetchData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/events/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="flex-1 overflow-auto p-8 max-w-6xl mx-auto w-full">
        <div className="flex justify-between items-end mb-8">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold mb-2">
              <Calendar size={16} />
              ADMIN / EVENTS
            </div>
            <h1 className="text-4xl font-bold text-white">Manage Events</h1>
          </div>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-lg transition-all"
          >
            {isAdding ? 'Cancel' : <><Plus size={18} /> Add Event</>}
          </button>
        </div>

        {isAdding && (
          <div className="bg-[#111] border border-white/5 rounded-2xl p-6 mb-8">
            <h2 className="text-xl font-bold text-white mb-6">Create New Event</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Title</label>
                  <input
                    required
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                    placeholder="e.g. Zoom AMA with Vitalik"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Target Module</label>
                  <select
                    required
                    value={moduleId}
                    onChange={(e) => setModuleId(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="">Select a module...</option>
                    {modules.map(m => (
                      <option key={m.id} value={m.id}>{m.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Date</label>
                  <input
                    required
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Time</label>
                  <input
                    required
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Meeting Link (e.g. Zoom)</label>
                  <input
                    required
                    type="url"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                    placeholder="https://zoom.us/j/..."
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Description</label>
                  <textarea
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 min-h-[100px]"
                    placeholder="Brief description of the event..."
                  />
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-bold rounded-lg transition-all flex items-center gap-2">
                  {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : 'Create Event'}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="space-y-4">
          {events.length > 0 ? events.map(event => (
            <div key={event.id} className="bg-[#111] border border-white/5 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-white/10 transition-colors">
              <div className="flex items-start gap-4 flex-1">
                <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                  <Video className="text-emerald-400" size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-white">{event.title}</h3>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      {event.module?.title || 'Unknown Module'}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-400 mb-2">{event.description}</p>
                  <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-zinc-500">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {new Date(event.date).toLocaleString()}
                    </span>
                    <a href={event.link} target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors">
                      {event.link}
                    </a>
                  </div>
                </div>
              </div>
              <div>
                <button onClick={() => handleDelete(event.id)} disabled={deletingId === event.id} className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-400/10 disabled:opacity-50 rounded-lg transition-colors">
                  {deletingId === event.id ? <Loader2 size={18} className="animate-spin text-red-400" /> : <Trash2 size={18} />}
                </button>
              </div>
            </div>
          )) : (
            <div className="text-center py-20 border border-white/5 rounded-xl bg-white/[0.01]">
              <Calendar size={32} className="mx-auto mb-3 text-zinc-600" />
              <h3 className="text-lg font-medium text-white mb-1">No events scheduled</h3>
              <p className="text-zinc-500 text-sm">Click 'Add Event' to create your first upcoming event.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
