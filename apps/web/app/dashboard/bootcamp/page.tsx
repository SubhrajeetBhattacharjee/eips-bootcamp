'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { ChevronRight, ChevronLeft, BookOpen, CheckCircle2, Clock, Search } from 'lucide-react';
import { DashboardShell } from '@/app/components/dashboard/DashboardShell';
import { ModuleCard } from '@/app/components/bootcamp/ModuleCard';
import { ModuleDetail } from '@/app/components/bootcamp/ModuleDetail';
import Link from 'next/link';
import { useSession } from '@/app/lib/auth-client';


export default function BootcampPage() {
  const { data: session } = useSession();
  const user = session?.user;
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchModules = async () => {
    if (!user?.id) return;
    try {
      const res = await fetch(`/api/bootcamp/modules?clerkId=${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setModules(data);
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
        body: JSON.stringify({ clerkId: user.id, lessonId }),
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Content */}
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
                {/*Add a back to dashboard button here similar to back to modules */}
                <Link href="/dashboard">
                    <button className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 mb-6 transition-colors">
                    <ChevronLeft size={20} />
                        Back to Dashboard
                    </button>
                </Link>
                <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold mb-2">
                  <BookOpen size={16} />
                  BOOTCAMP
                </div>
                <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                  EIP Mastery Bootcamp
                </h1>
                <p className="text-gray-400 text-lg max-w-2xl">
                  Master Ethereum Improvement Proposals through structured learning. Complete modules, earn XP, and join the EIP contributor community.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-12">
                <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 rounded-xl p-4">
                  <div className="text-gray-400 text-sm mb-1">Total Modules</div>
                  <div className="text-3xl font-bold text-emerald-400">{modules.length}</div>
                </div>
                <div className="bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 border border-cyan-500/20 rounded-xl p-4">
                  <div className="text-gray-400 text-sm mb-1">In Progress</div>
                  <div className="text-3xl font-bold text-cyan-400">
                    {modules.filter(m => m.completed > 0 && m.completed < m.lessons).length}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-xl p-4">
                  <div className="text-gray-400 text-sm mb-1">Total XP</div>
                  <div className="text-3xl font-bold text-blue-400">
                    {modules.reduce((acc, m) => acc + (m.completed === m.lessons ? m.xpReward : 0), 0) + (modules.reduce((acc, m) => acc + m.completed, 0) * 50)}
                  </div>
                </div>
              </div>

              {/* Search Bar */}
              <div className="mb-8">
                <div className="relative max-w-md">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={18} className="text-zinc-500" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search modules by title or description..."
                    className="w-full bg-[#111] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors placeholder:text-zinc-500"
                  />
                </div>
              </div>

              {/* Modules Grid */}
              {filteredModules.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredModules.map((module) => (
                    <ModuleCard
                      key={module.id}
                      module={module}
                      onClick={() => setSelectedModule(module.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 border border-white/5 rounded-xl bg-white/[0.01]">
                  <Search size={32} className="mx-auto mb-3 text-zinc-600" />
                  <h3 className="text-lg font-medium text-white mb-1">No modules found</h3>
                  <p className="text-zinc-500 text-sm">Try adjusting your search query.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    {/*</div>*/}
    </DashboardShell>
  );
}