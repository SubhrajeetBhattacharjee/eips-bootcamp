'use client';

import React from 'react';
import { CheckCircle2, Clock, Zap, ChevronRight, Book } from 'lucide-react';

interface Module {
  id: string;
  section: string;
  title: string;
  description: string;
  lessons: number;
  completed: number;
  xpReward: number;
  duration: string;
  color: string;
}

interface ModuleCardProps {
  module: Module;
  onClick: () => void;
}

export function ModuleCard({ module, onClick }: ModuleCardProps) {
  const completionPercentage = Math.round((module.completed / module.lessons) * 100);
  const isCompleted = module.completed === module.lessons;

  return (
    <button
      onClick={onClick}
      className={`group text-left bg-gradient-to-br ${module.color} border border-gray-800 hover:border-emerald-500/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/20`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3 flex-1">
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center border border-emerald-500/20 group-hover:border-emerald-500/50 transition-colors">
            <Book size={20} className="text-emerald-400" />
          </div>
          <div>
            <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Module {module.section}</div>
            <h3 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors mt-1">
              {module.title}
            </h3>
          </div>
        </div>
        <div className="flex-shrink-0 ml-4">
          {isCompleted ? (
            <CheckCircle2 size={24} className="text-emerald-400" />
          ) : (
            <div className="w-6 h-6 rounded-full border-2 border-emerald-400/30 group-hover:border-emerald-400/60 transition-colors"></div>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-400 text-sm mb-4 line-clamp-2">{module.description}</p>

      {/* Meta Info */}
      <div className="grid grid-cols-3 gap-4 mb-6 pb-6 border-b border-gray-700/50">
        <div>
          <div className="text-xs text-gray-500 mb-1">Lessons</div>
          <div className="text-lg font-bold text-white">
            {module.completed}/{module.lessons}
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-500 mb-1">Duration</div>
          <div className="flex items-center gap-1 text-white">
            <Clock size={14} className="text-emerald-400" />
            <span className="text-sm font-semibold">{module.duration}</span>
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-500 mb-1">XP Reward</div>
          <div className="flex items-center gap-1 text-emerald-400">
            <Zap size={14} />
            <span className="text-sm font-semibold">{module.xpReward}</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-gray-400">Progress</span>
          <span className="text-xs font-bold text-emerald-400">{completionPercentage}%</span>
        </div>
        <div className="w-full h-2.5 bg-gray-800/50 rounded-full overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-500`}
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      {/* CTA */}
      <div className="flex items-center justify-between text-emerald-400 group-hover:text-emerald-300 transition-colors">
        <span className="text-sm font-semibold">
          {isCompleted ? 'Completed' : 'Continue Learning'}
        </span>
        <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
      </div>
    </button>
  );
}