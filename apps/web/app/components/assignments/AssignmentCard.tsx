'use client';

import React from 'react';
import {
  ArrowRight,
  Zap,
  Clock,
  Target,
  CheckCircle2,
  AlertCircle,
  FileText,
} from 'lucide-react';

interface Assignment {
  id: string;
  title: string;
  module: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  xpReward: number;
  deadline: string;
  estimatedTime: number;
  status: 'Not Started' | 'In Progress' | 'Submitted' | 'Under Review' | 'Completed' | 'Overdue';
  progress: number;
  tags: string[];
}

interface AssignmentCardProps {
  assignment: Assignment;
  onSubmit?: (id: string) => void;
}

const statusConfig = {
  'Not Started': {
    bg: 'bg-gray-800/30',
    text: 'text-gray-400',
    badge: 'bg-gray-700 text-gray-300',
  },
  'In Progress': {
    bg: 'bg-cyan-500/10',
    text: 'text-cyan-300',
    badge: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30',
  },
  Submitted: {
    bg: 'bg-blue-500/10',
    text: 'text-blue-300',
    badge: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
  },
  'Under Review': {
    bg: 'bg-amber-500/10',
    text: 'text-amber-300',
    badge: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
  },
  Completed: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-300',
    badge: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
  },
  Overdue: {
    bg: 'bg-red-500/10',
    text: 'text-red-300',
    badge: 'bg-red-500/20 text-red-300 border border-red-500/30',
  },
};

const difficultyConfig = {
  Beginner: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
  Intermediate: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
  Advanced: 'bg-red-500/20 text-red-300 border border-red-500/30',
};

export function AssignmentCard({ assignment, onSubmit }: AssignmentCardProps) {
  const isOverdue = new Date(assignment.deadline) < new Date() && assignment.status !== 'Completed';
  const daysUntilDeadline = Math.ceil(
    (new Date(assignment.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  const statusConfig_ = statusConfig[assignment.status];

  const getActionButton = () => {
    switch (assignment.status) {
      case 'Not Started':
        return { label: 'Start Assignment', icon: ArrowRight };
      case 'In Progress':
        return { label: 'Continue', icon: ArrowRight };
      case 'Submitted':
        return { label: 'View Submission', icon: FileText };
      case 'Under Review':
        return { label: 'View Feedback', icon: AlertCircle };
      case 'Completed':
        return { label: 'View Completed', icon: CheckCircle2 };
      case 'Overdue':
        return { label: 'Submit Now', icon: AlertCircle };
      default:
        return { label: 'View', icon: ArrowRight };
    }
  };

  const actionButton = getActionButton();

  return (
    <div className={`group relative bg-gradient-to-br ${statusConfig_.bg} border border-gray-800 hover:border-emerald-500/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/20`}>
      {/* Top Section */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              {assignment.module}
            </span>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${difficultyConfig[assignment.difficulty]}`}>
              {assignment.difficulty}
            </span>
          </div>
          <h3 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">
            {assignment.title}
          </h3>
          <p className="text-gray-400 text-sm mt-1 line-clamp-2">{assignment.description}</p>
        </div>

        {/* Status Badge */}
        <div className={`flex-shrink-0 ml-4 px-3 py-1.5 rounded-lg text-xs font-semibold ${statusConfig_.badge}`}>
          {assignment.status}
        </div>
      </div>

      {/* Meta Info Row */}
      <div className="grid grid-cols-4 gap-4 mb-4 pb-4 border-b border-gray-700/50">
        <div>
          <div className="text-xs text-gray-500 mb-1">XP Reward</div>
          <div className="flex items-center gap-1 text-emerald-400 font-bold">
            <Zap size={14} />
            <span>{assignment.xpReward}</span>
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-500 mb-1">Est. Time</div>
          <div className="flex items-center gap-1 text-cyan-400 font-semibold text-sm">
            <Clock size={14} />
            <span>{assignment.estimatedTime}h</span>
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-500 mb-1">Deadline</div>
          <div className={`text-sm font-semibold ${isOverdue ? 'text-red-400' : 'text-white'}`}>
            {daysUntilDeadline > 0
              ? `${daysUntilDeadline}d left`
              : daysUntilDeadline === 0
                ? 'Today'
                : 'Overdue'}
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-500 mb-1">Progress</div>
          <div className="text-sm font-bold text-white">{assignment.progress}%</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="w-full h-2 bg-gray-800/50 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-500"
            style={{ width: `${assignment.progress}%` }}
          />
        </div>
      </div>

      {/* Tags and Action */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 flex-wrap">
          {assignment.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-1 rounded-full bg-gray-800/50 text-gray-300 border border-gray-700/50"
            >
              {tag}
            </span>
          ))}
        </div>

        <button 
          onClick={() => {
            if (assignment.status === 'Not Started' || assignment.status === 'In Progress' || assignment.status === 'Overdue') {
              onSubmit?.(assignment.id);
            }
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${statusConfig_.text} hover:bg-white/10`}
        >
          <span className="text-sm">{actionButton.label}</span>
          <actionButton.icon size={16} />
        </button>
      </div>
    </div>
  );
}