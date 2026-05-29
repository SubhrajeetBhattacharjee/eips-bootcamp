// apps/web/app/components/rewards/RewardsHero.tsx

'use client';

import React from 'react';

export const RewardsHero: React.FC = () => {
  return (
    <div className="relative mb-12 overflow-hidden bg-black">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-12">
        {/* Left Content */}
        <div className="z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="text-4xl">🎁</div>
            <h1 className="text-5xl lg:text-6xl font-bold text-white tracking-tight">
              Rewards
            </h1>
          </div>

          <p className="text-lg text-gray-300 leading-relaxed max-w-xl">
            Redeem your XP for exclusive rewards and unlock new opportunities.
          </p>
        </div>

        {/* Right Content - Green Glowing Gift Box */}
        <div className="relative h-80 lg:h-96 flex items-center justify-center">
          {/* Orbit Rings - Spinning emerald circles */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div 
              className="absolute w-80 h-80 rounded-full border-2 border-emerald-500/40 opacity-60"
              style={{ animation: 'spin 8s linear infinite reverse' }}
            />
            <div 
              className="absolute w-64 h-64 rounded-full border border-emerald-400/30 opacity-40"
              style={{ animation: 'spin 12s linear infinite' }}
            />
          </div>

          {/* Floating Particles - Green dots */}
          <div className="absolute inset-0">
            {[
              { top: '10%', left: '15%' },
              { top: '20%', left: '75%' },
              { top: '50%', left: '5%' },
              { top: '65%', left: '80%' },
              { top: '75%', left: '20%' },
            ].map((pos, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-emerald-500 opacity-70"
                style={{
                  top: pos.top,
                  left: pos.left,
                  animation: `float 4s ease-in-out infinite`,
                  animationDelay: `${i * 0.3}s`,
                }}
              />
            ))}
          </div>

          {/* Floating Accent Stars */}
          <div className="absolute inset-0">
            {[
              { top: '15%', right: '10%' },
              { bottom: '20%', left: '8%' },
            ].map((pos, i) => (
              <div
                key={`star-${i}`}
                className="absolute text-emerald-500/70 text-3xl"
                style={{
                  top: pos.top,
                  right: pos.right,
                  left: pos.left,
                  bottom: pos.bottom,
                  animation: `float 5s ease-in-out infinite`,
                  animationDelay: `${i * 0.7}s`,
                }}
              >
                ✦
              </div>
            ))}
          </div>

          {/* Central Green Gift Box */}
          <div className="relative z-20 flex items-center justify-center">
            <div className="relative">
              {/* Intense Glow Effect - Emerald */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/50 via-emerald-500/30 to-emerald-600/10 rounded-2xl blur-3xl animate-pulse" />

              {/* Gift Box Container with glowing border */}
              <div className="relative bg-gradient-to-br from-emerald-900/60 to-emerald-900/30 backdrop-blur-md border-2 border-emerald-500/70 rounded-2xl p-8 shadow-2xl" style={{
                boxShadow: '0 0 40px rgba(16, 185, 129, 0.5), 0 0 80px rgba(16, 185, 129, 0.3)'
              }}>
                {/* Gift Box SVG - Glowing Green */}
                <svg
                  width="120"
                  height="120"
                  viewBox="0 0 120 120"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="animate-glow-bounce drop-shadow-lg"
                  style={{
                    filter: 'drop-shadow(0 0 20px rgba(16, 185, 129, 0.6))',
                  }}
                >
                  {/* Gift Box Body */}
                  <rect x="25" y="40" width="70" height="60" fill="#10b981" opacity="0.95" rx="4"/>
                  
                  {/* Gift Box Ribbon Vertical */}
                  <rect x="55" y="35" width="10" height="70" fill="#34d399" opacity="0.9" rx="2"/>
                  
                  {/* Gift Box Ribbon Horizontal */}
                  <rect x="20" y="70" width="80" height="10" fill="#34d399" opacity="0.9" rx="2"/>
                  
                  {/* Bow Top Left */}
                  <circle cx="45" cy="35" r="8" fill="#6ee7b7" opacity="0.8"/>
                  
                  {/* Bow Top Right */}
                  <circle cx="75" cy="35" r="8" fill="#6ee7b7" opacity="0.8"/>
                  
                  {/* Bow Center */}
                  <circle cx="60" cy="32" r="10" fill="#a7f3d0" opacity="0.9"/>
                  
                  {/* Sparkle accents */}
                  <circle cx="40" cy="55" r="3" fill="#a7f3d0" opacity="0.7"/>
                  <circle cx="80" cy="65" r="3" fill="#a7f3d0" opacity="0.7"/>
                  <circle cx="60" cy="85" r="3" fill="#a7f3d0" opacity="0.7"/>
                </svg>
              </div>

              {/* Extra Glow Orb */}
              <div className="absolute -inset-6 bg-gradient-to-br from-emerald-500/20 to-transparent rounded-full blur-3xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Background ambient glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0.5;
          }
          50% {
            transform: translateY(-18px) translateX(6px);
            opacity: 0.85;
          }
        }

        @keyframes glowBounce {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-10px) scale(1.02);
          }
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-glow-bounce {
          animation: glowBounce 3.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};