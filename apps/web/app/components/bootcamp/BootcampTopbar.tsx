'use client';

import React from 'react';
import { Search, Bell, Zap } from 'lucide-react';

export function BootcampTopbar() {
  return (
    <div className="bg-gradient-to-b from-gray-950 via-black to-transparent border-b border-emerald-500/10 px-8 py-4 flex items-center justify-between sticky top-0 z-40">
      {/* Search Bar */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search modules, lessons..."
            className="w-full bg-white/5 border border-emerald-500/20 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 transition-all"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4 ml-8">
        {/* Notifications */}
        <button className="relative p-2 text-gray-400 hover:text-emerald-400 transition-colors">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full"></span>
        </button>

        {/* XP Badge */}
        <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500/15 to-emerald-600/5 border border-emerald-500/30 rounded-lg">
          <Zap size={16} className="text-emerald-400" />
          <span className="text-sm font-semibold text-emerald-300">1,250 XP</span>
        </div>

        {/* User Avatar */}
        <div className="flex items-center gap-3 pl-4 border-l border-gray-700">
          <div className="text-right">
            <div className="text-sm font-semibold text-white">Alex Chen</div>
            <div className="text-xs text-gray-400">Bootcamp Member</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
            AC
          </div>
        </div>
      </div>
    </div>
  );
}