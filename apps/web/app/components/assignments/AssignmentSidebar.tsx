'use client';

import React from 'react';
import {
  LayoutDashboard,
  BookOpen,
  CheckSquare,
  Zap,
  Users,
  Settings,
  HelpCircle,
} from 'lucide-react';

export function AssignmentSidebar() {
  const [collapsed, setCollapsed] = React.useState(false);

  const menuItems = [
    {
      section: 'BOOTCAMP',
      items: [
        { icon: BookOpen, label: 'Bootcamp Modules', active: false },
        { icon: Zap, label: 'XP Progress', active: false },
      ],
    },
    {
      section: 'LEARNING',
      items: [
        { icon: CheckSquare, label: 'My Assignments', active: true },
        { icon: Users, label: 'Community', active: false },
      ],
    },
  ];

  return (
    <div
      className={`bg-gradient-to-b from-gray-950 via-black to-black border-r border-emerald-500/10 transition-all duration-300 flex flex-col ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Logo */}
      <div className="p-6 border-b border-emerald-500/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
            <BookOpen size={24} className="text-black" />
          </div>
          {!collapsed && (
            <div>
              <div className="text-white font-bold text-sm">EIPsInsight</div>
              <div className="text-emerald-400 text-xs">Bootcamp</div>
            </div>
          )}
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 px-3 py-6 overflow-y-auto space-y-6">
        {menuItems.map((group) => (
          <div key={group.section}>
            {!collapsed && (
              <div className="text-emerald-400/60 text-xs font-semibold px-3 mb-3 uppercase tracking-wider">
                {group.section}
              </div>
            )}
            <div className="space-y-2">
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
                      item.active
                        ? 'bg-gradient-to-r from-emerald-500/20 to-emerald-600/10 border border-emerald-500/30 text-emerald-300'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon size={20} />
                    {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom CTA */}
      <div className="p-4 border-t border-emerald-500/10">
        <div className="bg-gradient-to-br from-emerald-500/15 to-emerald-600/5 border border-emerald-500/20 rounded-lg p-4">
          {!collapsed && (
            <>
              <div className="text-sm font-semibold text-white mb-2">Pro Bootcamp</div>
              <div className="text-xs text-gray-400 mb-3">Unlock advanced modules and 1-on-1 mentorship</div>
              <button className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-black font-semibold py-2 rounded-lg transition-all text-sm">
                Upgrade
              </button>
            </>
          )}
        </div>
      </div>

      {/* Collapse Button */}
      <div className="p-4 border-t border-emerald-500/10">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full text-gray-400 hover:text-white transition-colors"
        >
          <svg
            className={`w-5 h-5 mx-auto transition-transform ${collapsed ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>
    </div>
  );
}