'use client';

import React from 'react';
import { MessageSquare, ArrowRight } from 'lucide-react';

export function FeedbackWidget() {
  const recentFeedback = [
    {
      id: 1,
      assignment: 'Draft ERC-20 Token',
      mentor: 'Dr. Sarah Chen',
      status: 'positive',
      snippet: 'Great implementation! Consider adding...',
    },
    {
      id: 2,
      assignment: 'EIP-1559 Analysis',
      mentor: 'Alex Rodriguez',
      status: 'neutral',
      snippet: 'Please revise the security section...',
    },
  ];

  const statusColor = {
    positive: 'bg-emerald-500/20 border-emerald-500/30',
    neutral: 'bg-amber-500/20 border-amber-500/30',
    critical: 'bg-red-500/20 border-red-500/30',
  };

  const statusTextColor = {
    positive: 'text-emerald-300',
    neutral: 'text-amber-300',
    critical: 'text-red-300',
  };

  return (
    <div className="bg-gradient-to-br from-blue-500/10 to-purple-600/5 border border-blue-500/20 rounded-2xl p-6 hover:border-blue-500/40 transition-colors">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare size={20} className="text-blue-400" />
        <h3 className="text-lg font-bold text-white">Mentor Feedback</h3>
      </div>

      <div className="space-y-3">
        {recentFeedback.map((feedback) => (
          <div
            key={feedback.id}
            className={`p-3 border rounded-lg transition-colors ${statusColor[feedback.status as keyof typeof statusColor]}`}
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-sm font-semibold text-white truncate">
                  {feedback.assignment}
                </p>
                <p className="text-xs text-gray-400">{feedback.mentor}</p>
              </div>
            </div>
            <p className={`text-xs line-clamp-2 ${statusTextColor[feedback.status as keyof typeof statusTextColor]}`}>
              {feedback.snippet}
            </p>
          </div>
        ))}
      </div>

      <button className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-blue-300 hover:text-blue-200 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 hover:border-blue-500/50 transition-all">
        View All Feedback
        <ArrowRight size={14} />
      </button>
    </div>
  );
}