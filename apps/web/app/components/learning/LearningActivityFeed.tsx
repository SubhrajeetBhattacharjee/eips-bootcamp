import React from 'react';
import { Award, BookOpen, Star, MessageSquare, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const LearningActivityFeed = ({ activity }: { activity?: any[] }) => {
  const events = activity || [];

  const getIcon = (type: string) => {
    switch (type) {
      case 'assignment':
        return <BookOpen size={16} className="text-blue-400" />;
      case 'achievement':
        return <Award size={16} className="text-amber-400" />;
      default:
        return <Star size={16} className="text-emerald-400" />;
    }
  };

  const getIconBg = (type: string) => {
    switch (type) {
      case 'assignment':
        return 'bg-blue-500/10 border-blue-500/20';
      case 'achievement':
        return 'bg-amber-400/10 border-amber-400/20';
      default:
        return 'bg-emerald-500/10 border-emerald-500/20';
    }
  };

  return (
    <div className="bg-[#0d0d0d] border border-white/8 rounded-2xl p-6 flex flex-col h-full hover:border-emerald-500/20 transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-white font-bold text-base">Recent Activity</h3>
      </div>

      <div className="flex-1">
        {events.length === 0 ? (
          <div className="flex items-center justify-center h-full text-zinc-500 text-sm">
            No recent activity.
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <div key={event.id} className="flex gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${getIconBg(event.type)}`}>
                  {getIcon(event.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{event.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-zinc-500">{event.time}</span>
                    {event.xp > 0 && (
                      <>
                        <span className="text-zinc-700 text-[10px]">•</span>
                        <span className="text-xs font-bold text-emerald-400">+{event.xp} XP</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};