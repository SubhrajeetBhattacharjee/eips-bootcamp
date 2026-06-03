'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { ChevronRight, ChevronLeft, BookOpen, Search, Layers } from 'lucide-react';
import { DashboardShell } from '@/app/components/dashboard/DashboardShell';
import { ModuleCard } from '@/app/components/bootcamp/ModuleCard';
import { ModuleDetail } from '@/app/components/bootcamp/ModuleDetail';
import Link from 'next/link';
import { useSession } from '@/app/lib/auth-client';
import { useSearchParams } from 'next/navigation';

export default function MyModulesPage() {
  const { data: session } = useSession();
  const user = session?.user;
  const searchParams = useSearchParams();
  const initialModuleId = searchParams?.get('moduleId');
  
  const [selectedModule, setSelectedModule] = useState<string | null>(initialModuleId || null);
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchModules = async () => {
    if (!user?.id) return;
    try {
      const res = await fetch(`/api/bootcamp/modules?userId=${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setModules(data.filter((m: any) => m.isSubscribed));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchModules();
    }
  }, [user?.id]);

  const handleLessonComplete = async (lessonId: string) => {
    if (!user?.id) return;
    try {
      const res = await fetch('/api/bootcamp/lessons/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, lessonId }),
      });
      if (res.ok) {
        await fetchModules();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const selectedModuleData = modules.find(m => m.id === selectedModule);

  const filteredModules = useMemo(() => {
    if (!searchQuery.trim()) return modules;
    const query = searchQuery.toLowerCase();
    return modules.filter(m => 
      m.title.toLowerCase().includes(query) || 
      m.description.toLowerCase().includes(query)
    );
  }, [modules, searchQuery]);

  return (
    <DashboardShell>
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto">
          {selectedModuleData ? (
            <ModuleDetail 
              module={selectedModuleData} 
              onBack={() => setSelectedModule(null)}
              lessons={selectedModuleData.mappedLessons || []}
              onLessonComplete={handleLessonComplete}
            />
          ) : (
            <div className="p-8 max-w-7xl mx-auto">
              {/* Header */}
              <div className="mb-12">
                <Link href="/dashboard">
                  <button className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 mb-6 transition-colors">
                    <ChevronLeft size={20} />
                    Back to Dashboard
                  </button>
                </Link>
                <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold mb-2">
                  <Layers size={16} />
                  MY MODULES
                </div>
                <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                  My Modules
                </h1>
                <p className="text-gray-400 text-lg max-w-2xl">
                  Access the modules you have subscribed to. Track your progress and continue where you left off.
                </p>
              </div>

              {/* Search Bar */}
              <div className="mb-8 flex justify-between items-center">
                <div className="relative max-w-md w-full">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={18} className="text-zinc-500" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search my modules..."
                    className="w-full bg-[#111] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors placeholder:text-zinc-500"
                  />
                </div>
                <Link href="/dashboard/marketplace">
                  <button className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                    Browse Marketplace <ChevronRight size={18} />
                  </button>
                </Link>
              </div>

              {/* Modules Grid */}
              {filteredModules.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredModules.map((module) => (
                    <ModuleCard
                      key={module.id}
                      module={module}
                      isMarketplaceMode={false}
                      onClick={() => setSelectedModule(module.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 border border-white/5 rounded-xl bg-white/[0.01]">
                  <BookOpen size={32} className="mx-auto mb-3 text-zinc-600" />
                  <h3 className="text-lg font-medium text-white mb-1">You haven't subscribed to any modules yet</h3>
                  <p className="text-zinc-500 text-sm mb-6">Head over to the Marketplace to discover and unlock new content.</p>
                  <Link href="/dashboard/marketplace">
                    <button className="flex items-center gap-2 px-6 py-3 mx-auto bg-white/5 hover:bg-white/10 text-emerald-400 font-bold rounded-xl border border-emerald-500/30 hover:border-emerald-500/50 transition-all">
                      Go to Marketplace
                    </button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}