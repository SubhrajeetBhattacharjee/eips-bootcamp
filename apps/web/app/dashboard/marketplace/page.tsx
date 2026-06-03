'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { ChevronRight, ChevronLeft, BookOpen, Search, ShoppingCart } from 'lucide-react';
import { DashboardShell } from '@/app/components/dashboard/DashboardShell';
import { ModuleCard } from '@/app/components/bootcamp/ModuleCard';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from '@/app/lib/auth-client';

export default function MarketplacePage() {
  const { data: session } = useSession();
  const user = session?.user;
  const router = useRouter();
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchModules = async () => {
    if (!user?.id) return;
    try {
      const res = await fetch(`/api/bootcamp/modules?userId=${user.id}`);
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

  const handleModuleClick = (module: any) => {
    if (module.isSubscribed) {
      router.push(`/dashboard/my-modules?moduleId=${module.id}`);
    } else {
      router.push(`/dashboard/checkout?moduleId=${module.id}`);
    }
  };

  const filteredModules = useMemo(() => {
    if (!searchQuery.trim()) return modules;
    const query = searchQuery.toLowerCase();
    return modules.filter(m => 
      m.title.toLowerCase().includes(query) || 
      m.description.toLowerCase().includes(query)
    );
  }, [modules, searchQuery]);

  // Group by category
  const groupedModules = useMemo(() => {
    const groups: Record<string, any[]> = {};
    filteredModules.forEach(m => {
      const cat = m.category || 'General';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(m);
    });
    return groups;
  }, [filteredModules]);

  return (
    <DashboardShell>
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto">
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
                <ShoppingCart size={16} />
                MARKETPLACE
              </div>
              <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Module Marketplace
              </h1>
              <p className="text-gray-400 text-lg max-w-2xl">
                Browse our curated selection of Ethereum and Web3 modules. Add modules to your cart and start learning.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-12">
              <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 rounded-xl p-4">
                <div className="text-gray-400 text-sm mb-1">Available Modules</div>
                <div className="text-3xl font-bold text-emerald-400">{modules.length}</div>
              </div>
              <div className="bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 border border-cyan-500/20 rounded-xl p-4">
                <div className="text-gray-400 text-sm mb-1">My Owned Modules</div>
                <div className="text-3xl font-bold text-cyan-400">
                  {modules.filter(m => m.isSubscribed).length}
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
                  placeholder="Search modules..."
                  className="w-full bg-[#111] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors placeholder:text-zinc-500"
                />
              </div>
            </div>

            {/* Modules Grid Grouped by Category */}
            {Object.keys(groupedModules).length > 0 ? (
              <div className="space-y-12">
                {Object.keys(groupedModules).map((category) => (
                  <div key={category}>
                    <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-2">{category} Modules</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {groupedModules[category].map((module: any) => (
                        <ModuleCard
                          key={module.id}
                          module={module}
                          isMarketplaceMode={true}
                          onClick={() => handleModuleClick(module)}
                        />
                      ))}
                    </div>
                  </div>
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
        </div>
      </div>
    </DashboardShell>
  );
}