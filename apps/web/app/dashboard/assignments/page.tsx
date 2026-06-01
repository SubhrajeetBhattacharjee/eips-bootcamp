'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, Search } from 'lucide-react';
import { DashboardShell } from '@/app/components/dashboard/DashboardShell';
import { AssignmentStats } from '@/app/components/assignments/AssignmentStats';
import { AssignmentFilters } from '@/app/components/assignments/AssignmentFilters';
import { AssignmentCard } from '@/app/components/assignments/AssignmentCard';
import { DeadlineWidget } from '@/app/components/assignments/DeadlineWidget';
import { FeedbackWidget } from '@/app/components/assignments/FeedbackWidget';
import { XPProgressWidget } from '@/app/components/assignments/XPProgressWidget';
import { mockStats } from '@/app/lib/assignments-data';
import { Assignment } from '@/app/lib/assignments.types';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';

export default function AssignmentsPage() {
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [moduleFilter, setModuleFilter] = useState('all');
  const [sortBy, setSortBy] = useState('deadline');
  
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [stats, setStats] = useState(mockStats);
  const [loading, setLoading] = useState(true);

  const fetchAssignments = async () => {
    if (!user?.id) return;
    try {
      const res = await fetch(`/api/assignments?clerkId=${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setAssignments(data.assignments || []);
        if (data.stats) setStats(data.stats);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) fetchAssignments();
  }, [user?.id]);

  const handleSubmit = async (assignmentId: string) => {
    if (!user?.id) return;
    try {
      const res = await fetch('/api/assignments/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clerkId: user.id, assignmentId, content: 'Placeholder content for submission' }),
      });
      if (res.ok) {
        await fetchAssignments(); // refresh data
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Filter assignments
  const filteredAssignments = assignments.filter((assignment) => {
    const matchesSearch =
      assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || assignment.status === statusFilter;
    const matchesDifficulty =
      difficultyFilter === 'all' || assignment.difficulty === difficultyFilter;
    const matchesModule = moduleFilter === 'all' || assignment.module === moduleFilter;

    return matchesSearch && matchesStatus && matchesDifficulty && matchesModule;
  });

  // Sort assignments
  const sortedAssignments = [...filteredAssignments].sort((a, b) => {
    switch (sortBy) {
      case 'deadline':
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      case 'difficulty':
        const difficultyOrder = { Beginner: 1, Intermediate: 2, Advanced: 3 };
        return (
          difficultyOrder[a.difficulty as keyof typeof difficultyOrder] -
          difficultyOrder[b.difficulty as keyof typeof difficultyOrder]
        );
      case 'xp-high':
        return b.xpReward - a.xpReward;
      case 'xp-low':
        return a.xpReward - b.xpReward;
      default:
        return 0;
    }
  });

  return (
    <DashboardShell>     

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-8 max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="mb-12">
                <Link href="/dashboard">
              <button className="flex items-center gap-2 text-gray-400 hover:text-emerald-400 transition-colors mb-4">
                <ChevronLeft size={18} />
                <span className="text-sm font-medium">Back to Dashboard</span>
              </button>
              </Link>

              <div className="mb-6">
                <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                  Assignments
                </h1>
                <p className="text-gray-400 text-lg">
                  Complete challenges, submit EIPs, and earn XP rewards.
                </p>
              </div>

              {/* Glow effect background */}
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl opacity-30 pointer-events-none" />
            </div>

            {/* Stats Grid */}
            <AssignmentStats stats={stats} />

            {/* Filters Section */}
            <AssignmentFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              statusFilter={statusFilter}
              onStatusChange={setStatusFilter}
              difficultyFilter={difficultyFilter}
              onDifficultyChange={setDifficultyFilter}
              moduleFilter={moduleFilter}
              onModuleChange={setModuleFilter}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
              {/* Assignments List */}
              <div className="lg:col-span-2">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-white">
                    {sortedAssignments.length} Assignments
                  </h2>
                  <p className="text-gray-400 text-sm mt-1">
                    {statusFilter !== 'all' && `Showing ${statusFilter} assignments`}
                  </p>
                </div>

                <div className="space-y-4">
                  {sortedAssignments.length > 0 ? (
                    sortedAssignments.map((assignment) => (
                      <AssignmentCard key={assignment.id} assignment={assignment} onSubmit={handleSubmit} />
                    ))
                  ) : (
                    <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/20 border border-gray-700/50 rounded-2xl p-12 text-center">
                      <p className="text-gray-400 text-lg">No assignments found</p>
                      <p className="text-gray-500 text-sm mt-2">
                        Try adjusting your filters or search query
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Sidebar Widgets */}
              <div className="lg:col-span-1 space-y-6">
                <DeadlineWidget assignments={sortedAssignments} />
                <XPProgressWidget stats={stats} />
                <FeedbackWidget />
              </div>
            </div>
          </div>
        </div>
      </div>
    
    </DashboardShell>
  );
}