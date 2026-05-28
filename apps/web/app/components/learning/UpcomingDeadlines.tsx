// apps/web/components/learning/UpcomingDeadlines.tsx

import React from 'react';
import { Calendar, AlertCircle, Clock } from 'lucide-react';

interface Deadline {
  id: string;
  title: string;
  dueDate: string;
  daysLeft: number;
  priority: 'high' | 'medium' | 'low';
  type: string;
}

const deadlines: Deadline[] = [
  {
    id: '1',
    title: 'Assignment #5: Smart Contracts',
    dueDate: 'May 30, 2024',
    daysLeft: 2,
    priority: 'high',
    type: 'Assignment',
  },
  {
    id: '2',
    title: 'Quiz: Web3 Fundamentals',
    dueDate: 'June 2, 2024',
    daysLeft: 5,
    priority: 'medium',
    type: 'Quiz',
  },
  {
    id: '3',
    title: 'Project: Build EIP Proposal',
    dueDate: 'June 10, 2024',
    daysLeft: 13,
    priority: 'medium',
    type: 'Project',
  },
  {
    id: '4',
    title: 'Code Review Submission',
    dueDate: 'June 15, 2024',
    daysLeft: 18,
    priority: 'low',
    type: 'Review',
  },
];

export const UpcomingDeadlines: React.FC = () => {
  return (
    <div className="group relative bg-[#0d0d0d] border border-white/8 rounded-2xl p-6 hover:border-emerald-500/20 hover:-translate-y-0.5 transition-all duration-300 overflow-hidden h-full flex flex-col">
      {/* Hover glow */}
      <div className="absolute inset-0 bg-emerald-500/0 group-hover:bg-emerald-500/3 transition-all duration-300 rounded-2xl" />

      <div className="relative z-10 flex-1 flex flex-col">
        <div className="mb-6">
          <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
            Timeline
          </p>
          <h3 className="text-xl font-bold text-white mt-1">
            Upcoming Deadlines
          </h3>
        </div>

        {/* Deadline Items */}
        <div className="space-y-3 flex-1">
            {deadlines.map((deadline) => {
              let priorityColor = 'bg-white/5 text-zinc-300 border-white/8';
              let dayColor = 'text-zinc-400';

              if (deadline.priority === 'high') {
                priorityColor = 'bg-red-500/15 text-red-300 border-red-500/20';
                dayColor = 'text-red-400';
              } else if (deadline.priority === 'medium') {
                priorityColor = 'bg-yellow-500/15 text-yellow-300 border-yellow-500/20';
                dayColor = 'text-yellow-400';
              } else {
                priorityColor = 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20';
                dayColor = 'text-emerald-400';
              }

              return (
                <div
                  key={deadline.id}
                  className={`
                    rounded-lg border
                    bg-white/5 hover:bg-white/8
                    p-3.5 transition-all duration-200
                    group/deadline
                  `}
                  style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}
                >
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div>
                      <p className="text-xs font-semibold text-white">
                        {deadline.title}
                      </p>
                      <p className="text-xs text-zinc-500 mt-0.5">
                        {deadline.type}
                      </p>
                    </div>
                    <span
                      className={`
                        text-xs font-medium px-2.5 py-1 rounded-md border
                        whitespace-nowrap
                        ${priorityColor}
                      `}
                    >
                      {deadline.priority.charAt(0).toUpperCase() +
                        deadline.priority.slice(1)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-zinc-500">
                      <Calendar size={13} />
                      <span>{deadline.dueDate}</span>
                    </div>
                    <div className={`flex items-center gap-1 font-semibold ${dayColor}`}>
                      <Clock size={13} />
                      <span>{deadline.daysLeft}d</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        {/* View All Button */}
        <div className="mt-6 pt-4 border-t border-white/8">
          <button className="w-full rounded-lg font-medium text-sm py-2.5 px-4 transition-all duration-200 border border-emerald-500/30 hover:border-emerald-500/60 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 hover:text-emerald-200">
            View Calendar →
          </button>
        </div>
      </div>
    </div>
  );
};