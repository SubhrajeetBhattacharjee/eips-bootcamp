// apps/web/app/components/admin/RecentActivity.tsx
'use client';

import React from 'react';
import {
  Users,
  FileText,
  BookOpen,
  Gift,
  UserPlus,
  Star,
  ArrowRight
} from 'lucide-react';
import { ActivityFeed } from '@/app/lib/admin';

interface RecentActivityProps {
  activities: ActivityFeed[];
}

function getActivityIcon(type: ActivityFeed['type']) {
  switch (type) {
    case 'user_registered':
      return <Users className="w-5 h-5" />;
    case 'cap_application':
      return <FileText className="w-5 h-5" />;
    case 'module_completed':
      return <BookOpen className="w-5 h-5" />;
    case 'reward_redeemed':
      return <Gift className="w-5 h-5" />;
    case 'referral_joined':
      return <UserPlus className="w-5 h-5" />;
    case 'top_performer':
      return <Star className="w-5 h-5" />;
    default:
      return <Users className="w-5 h-5" />;
  }
}

function getActivityColor(color?: string) {
  switch (color) {
    case 'emerald':
      return 'bg-emerald-500/10 text-emerald-400';
    case 'blue':
      return 'bg-blue-500/10 text-blue-400';
    case 'purple':
      return 'bg-purple-500/10 text-purple-400';
    case 'amber':
      return 'bg-amber-500/10 text-amber-400';
    case 'violet':
      return 'bg-violet-500/10 text-violet-400';
    default:
      return 'bg-gray-500/10 text-gray-400';
  }
}

function formatTime(date: Date) {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}

export function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <div className="rounded-xl border border-emerald-500/20 bg-black/40 backdrop-blur-xl overflow-hidden shadow-lg shadow-emerald-500/10 h-fit">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-emerald-500/10">
        <h3 className="text-white font-semibold text-lg">Recent Activity</h3>
        <a href="#" className="
          flex items-center gap-1 text-emerald-400 text-sm font-medium
          hover:text-emerald-300 transition-colors group
        ">
          View All
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </a>
      </div>

      {/* Activity List */}
      <div className="divide-y divide-emerald-500/10 max-h-[500px] overflow-y-auto">
        {activities.map((activity, index) => (
          <div
            key={activity.id}
            className="p-4 hover:bg-emerald-500/5 transition-colors duration-200 group"
          >
            <div className="flex gap-4">
              {/* Icon */}
              <div className={`
                flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center
                transition-all duration-300 group-hover:scale-110
                ${getActivityColor(activity.color)}
              `}>
                {getActivityIcon(activity.type)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm truncate">
                  {activity.title}
                </p>
                <p className="text-gray-500 text-sm truncate">
                  {activity.description}
                </p>
              </div>

              {/* Time */}
              <div className="flex-shrink-0 text-right">
                <p className="text-gray-500 text-xs whitespace-nowrap">
                  {formatTime(activity.timestamp)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer with fade gradient */}
      <div className="h-8 bg-gradient-to-b from-transparent to-black/20" />
    </div>
  );
}