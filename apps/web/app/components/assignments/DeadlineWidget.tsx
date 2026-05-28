'use client';

import React from 'react';
import { Calendar, AlertCircle } from 'lucide-react';

interface Assignment {
  id: string;
  title: string;
  deadline: string;
  status: string;
}

interface DeadlineWidgetProps {
  assignments: Assignment[];
}

export function DeadlineWidget({ assignments }: DeadlineWidgetProps) {
  // Get upcoming deadlines (next 7 days)
  const upcomingDeadlines = assignments
    .filter((a) => a.status !== 'Completed')
    .filter((a) => {
      const deadline = new Date(a.deadline);
      const today = new Date();
      const daysUntil = (deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
      return daysUntil > 0 && daysUntil <= 7;
    })
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    .slice(0, 5);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const daysUntil = Math.ceil(
      (date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysUntil === 0) return 'Today';
    if (daysUntil === 1) return 'Tomorrow';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 rounded-2xl p-6 hover:border-emerald-500/40 transition-colors">
      <div className="flex items-center gap-2 mb-4">
        <Calendar size={20} className="text-emerald-400" />
        <h3 className="text-lg font-bold text-white">Upcoming Deadlines</h3>
      </div>

      {upcomingDeadlines.length > 0 ? (
        <div className="space-y-3">
          {upcomingDeadlines.map((assignment) => (
            <div
              key={assignment.id}
              className="flex items-start gap-3 p-3 bg-black/30 border border-emerald-500/20 rounded-lg hover:border-emerald-500/40 transition-colors"
            >
              <div className="flex-shrink-0 w-2 h-2 rounded-full bg-emerald-400 mt-1.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {assignment.title}
                </p>
                <p className="text-xs text-emerald-300">
                  {formatDate(assignment.deadline)}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6">
          <AlertCircle size={24} className="mx-auto text-gray-500 mb-2" />
          <p className="text-sm text-gray-400">No upcoming deadlines</p>
        </div>
      )}

      {upcomingDeadlines.length === 0 && assignments.length > 0 && (
        <p className="text-xs text-gray-400 text-center">All caught up! 🎉</p>
      )}
    </div>
  );
}