'use client';

import React from 'react';
import { CheckCircle2, Clock, Zap, ChevronRight, Book } from 'lucide-react';

export interface Module {
  id: string;
  section: string;
  title: string;
  description: string;
  lessons: number;
  completed: number;
  xpReward: number;
  duration: string;
  color: string;
  thumbnailUrl?: string;
  isPremium?: boolean;
  price?: number;
  category?: string;
  isSubscribed?: boolean;
}

interface ModuleCardProps {
  module: Module;
  onClick: () => void;
  isMarketplaceMode?: boolean;
}

export function ModuleCard({ module, onClick, isMarketplaceMode = false }: ModuleCardProps) {
  const completionPercentage = module.lessons > 0 ? Math.round((module.completed / module.lessons) * 100) : 0;
  const isCompleted = module.completed === module.lessons;

  return (
    <div
      onClick={onClick}
      className={`group relative text-left bg-[#0f0f0f] border border-white/5 hover:border-emerald-500/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] relative overflow-hidden cursor-pointer`}
    >
      {/* Expanding Gradient Overlay on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-emerald-500/0 group-hover:from-emerald-500/5 group-hover:to-transparent transition-all duration-500 pointer-events-none" />

      {/* Accent Line */}
      <div className={`absolute top-0 left-0 w-full h-1 ${module.color}`} />
      
      {/* Thumbnail (if available) */}
      {module.thumbnailUrl && (
        <div className="w-full h-32 mb-4 rounded-xl overflow-hidden bg-black border border-white/5 cursor-pointer" onClick={isMarketplaceMode || module.isSubscribed ? onClick : undefined}>
          <img src={module.thumbnailUrl} alt={module.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3 flex-1 cursor-pointer" onClick={isMarketplaceMode || module.isSubscribed ? onClick : undefined}>
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center border border-emerald-500/20 group-hover:border-emerald-500/50 transition-colors">
            <Book size={20} className="text-emerald-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors mt-1">
              {module.title}
            </h3>
            {module.category && (
              <span className="text-[10px] font-semibold tracking-wider uppercase text-zinc-500 border border-white/10 rounded-full px-2 py-0.5 inline-block mt-1">
                {module.category}
              </span>
            )}
          </div>
        </div>
        <div className="flex-shrink-0 ml-4">
          {!isMarketplaceMode && isCompleted ? (
            <CheckCircle2 size={24} className="text-emerald-400" />
          ) : !isMarketplaceMode && (
            <div className="w-6 h-6 rounded-full border-2 border-emerald-400/30 group-hover:border-emerald-400/60 transition-colors"></div>
          )}
          {isMarketplaceMode && module.isPremium && !module.isSubscribed && (
            <div className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-md">
              <span className="text-xs font-bold text-white">PRO</span>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-400 text-sm mb-4 line-clamp-2 cursor-pointer" onClick={isMarketplaceMode || module.isSubscribed ? onClick : undefined}>{module.description}</p>

      {/* Meta Info */}
      <div className="grid grid-cols-3 gap-4 mb-6 pb-6 border-b border-gray-700/50 cursor-pointer" onClick={isMarketplaceMode || module.isSubscribed ? onClick : undefined}>
        <div>
          <div className="text-xs text-gray-500 mb-1">Lessons</div>
          <div className="text-lg font-bold text-white">
            {isMarketplaceMode ? module.lessons : `${module.completed}/${module.lessons}`}
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

      {/* Progress Bar (Only if not marketplace mode) */}
      {!isMarketplaceMode && (
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
      )}

      {/* CTA */}
      <div className="mt-auto">
        {isMarketplaceMode ? (
          module.isSubscribed ? (
            <button
              onClick={onClick}
              className="w-full flex items-center justify-center py-2.5 rounded-lg bg-white/5 border border-white/10 text-emerald-400 hover:bg-white/10 hover:border-emerald-500/30 transition-all font-semibold text-sm"
            >
              Already Owned - View Module
            </button>
          ) : (
            <button
              onClick={onClick}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Add to Cart - {module.price === 0 ? 'Free' : `$${module.price}`}
            </button>
          )
        ) : (
          <button
            onClick={onClick}
            className="w-full flex items-center justify-between text-emerald-400 group-hover:text-emerald-300 transition-colors"
          >
            <span className="text-sm font-semibold">
              {isCompleted ? 'Completed' : 'Continue Learning'}
            </span>
            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        )}
      </div>
    </div>
  );
}