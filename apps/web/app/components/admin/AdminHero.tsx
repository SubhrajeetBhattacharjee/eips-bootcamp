// apps/web/app/components/admin/AdminHero.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Download } from 'lucide-react';

interface AdminHeroProps {
  startDate?: string;
  endDate?: string;
}

// SVG Ethereum network visualization component
function EthereumNetworkViz() {
  return (
    <div className="relative w-full h-64 md:h-80">
      <svg
        className="w-full h-full"
        viewBox="0 0 400 300"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Define gradients and filters */}
        <defs>
          <radialGradient id="emeraldGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
          </radialGradient>
          
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          
          <filter id="strongGlow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Connection lines */}
        <line x1="100" y1="80" x2="200" y2="150" stroke="#10B981" strokeWidth="1.5" opacity="0.4" />
        <line x1="300" y1="80" x2="200" y2="150" stroke="#3B82F6" strokeWidth="1.5" opacity="0.4" />
        <line x1="100" y1="220" x2="200" y2="150" stroke="#10B981" strokeWidth="1.5" opacity="0.4" />
        <line x1="300" y1="220" x2="200" y2="150" stroke="#8B5CF6" strokeWidth="1.5" opacity="0.4" />
        <line x1="200" y1="30" x2="200" y2="150" stroke="#10B981" strokeWidth="1.5" opacity="0.4" />

        {/* Corner nodes with glow */}
        {/* Top Left */}
        <circle cx="100" cy="80" r="8" fill="#10B981" opacity="0.6" filter="url(#glow)" />
        <circle cx="100" cy="80" r="15" fill="url(#emeraldGlow)" opacity="0.3" />
        
        {/* Top Right */}
        <circle cx="300" cy="80" r="8" fill="#3B82F6" opacity="0.6" filter="url(#glow)" />
        <circle cx="300" cy="80" r="15" fill="#3B82F6" opacity="0.15" />
        
        {/* Bottom Left */}
        <circle cx="100" cy="220" r="8" fill="#10B981" opacity="0.6" filter="url(#glow)" />
        <circle cx="100" cy="220" r="15" fill="url(#emeraldGlow)" opacity="0.3" />
        
        {/* Bottom Right */}
        <circle cx="300" cy="220" r="8" fill="#8B5CF6" opacity="0.6" filter="url(#glow)" />
        <circle cx="300" cy="220" r="15" fill="#8B5CF6" opacity="0.15" />
        
        {/* Top Center */}
        <circle cx="200" cy="30" r="6" fill="#10B981" opacity="0.6" filter="url(#glow)" />
        <circle cx="200" cy="30" r="12" fill="url(#emeraldGlow)" opacity="0.3" />

        {/* Central Ethereum Crystal - Large with strong glow */}
        <g filter="url(#strongGlow)">
          {/* Outer glow circles */}
          <circle cx="200" cy="150" r="35" fill="#10B981" opacity="0.15" />
          <circle cx="200" cy="150" r="25" fill="#10B981" opacity="0.25" />
          
          {/* Main crystal */}
          <circle cx="200" cy="150" r="16" fill="#10B981" opacity="0.9" />
          
          {/* Inner highlight */}
          <circle cx="200" cy="145" r="8" fill="#34D399" opacity="0.6" />
        </g>

        {/* Pulsing animation using CSS (defined in component) */}
        <style>{`
          @keyframes pulse-glow {
            0%, 100% {
              opacity: 0.9;
              r: 16;
            }
            50% {
              opacity: 0.7;
              r: 20;
            }
          }
          
          circle[data-pulse="true"] {
            animation: pulse-glow 3s ease-in-out infinite;
          }
        `}</style>
      </svg>
    </div>
  );
}

export function AdminHero({ startDate = 'May 1', endDate = 'May 31, 2024' }: AdminHeroProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative mb-8">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-transparent to-transparent rounded-2xl -z-10" />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left side - Text content */}
        <div className="pt-4 lg:pt-8">
          <h1 className="text-5xl lg:text-6xl font-bold text-white mb-3 tracking-tight">
            Admin Analytics
          </h1>
          <p className="text-gray-400 text-lg mb-8 max-w-md leading-relaxed">
            Monitor platform growth, engagement, learning activity, and ecosystem impact.
          </p>

          {/* Date range and export button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v2h16V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5H4v9a2 2 0 002 2h12a2 2 0 002-2V7h-2v1a1 1 0 11-2 0V7H9v1a1 1 0 11-2 0V7H6v1a1 1 0 11-2 0V7z" />
              </svg>
              <span>{startDate} – {endDate}</span>
            </div>
            
            <button className="
              flex items-center gap-2 px-4 py-2 rounded-lg
              bg-emerald-500/10 border border-emerald-500/30
              text-emerald-400 hover:bg-emerald-500/20 
              transition-all duration-300 text-sm font-medium
              hover:shadow-lg hover:shadow-emerald-500/20
            ">
              <Download className="w-4 h-4" />
              Export Report
            </button>
          </div>
        </div>

        {/* Right side - Ethereum visualization */}
        <div className="flex justify-center lg:justify-end">
          <div className="w-full max-w-sm">
            <EthereumNetworkViz />
          </div>
        </div>
      </div>

      {/* Decorative line */}
      <div className="mt-8 h-px bg-gradient-to-r from-emerald-500/20 via-blue-500/20 to-transparent" />
    </div>
  );
}