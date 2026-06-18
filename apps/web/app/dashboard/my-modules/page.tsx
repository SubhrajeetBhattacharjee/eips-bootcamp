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
                <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                  My Modules
                </h1>
                <p className="text-muted-foreground text-lg max-w-2xl">
                  Access the modules you have subscribed to. Track your progress and continue where you left off.
                </p>
              </div>

              {/* Search Bar */}
              <div className="mb-8 flex justify-between items-center">
                <div className="relative max-w-md w-full">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={18} className="text-muted-foreground" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search my modules..."
                    className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-3 text-sm text-foreground focus:outline-none focus:border-emerald-500 transition-colors placeholder:text-muted-foreground"
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
                <div className="text-center py-24 border border-border/50 rounded-2xl bg-accent/5 backdrop-blur-sm">
                  <div className="w-16 h-16 rounded-full bg-accent/50 flex items-center justify-center mx-auto mb-6 border border-border">
                    <Layers size={32} className="text-muted-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    {searchQuery ? "No modules found" : "No active modules"}
                  </h3>
                  <p className="text-muted-foreground text-lg max-w-md mx-auto mb-8">
                    {searchQuery 
                      ? `We couldn't find anything matching "${searchQuery}".` 
                      : "You haven't subscribed to any modules yet. Start your learning journey today!"}
                  </p>
                  
                  {searchQuery ? (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="text-emerald-400 font-semibold hover:text-emerald-300 transition-colors"
                    >
                      Clear Search
                    </button>
                  ) : (
                    <Link href="/dashboard/marketplace">
                      <button className="flex items-center gap-2 px-8 py-3 mx-auto bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl transition-all shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                        Browse Marketplace
                      </button>
                    </Link>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}