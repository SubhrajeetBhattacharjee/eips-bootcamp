// apps/web/components/community/CommunityHero.tsx

import React from 'react';
import { Globe, Zap, Users, Award } from 'lucide-react';

export const CommunityHero: React.FC = () => {
  const communityStats = {
    events: 24,
    colleges: 15,
    mediaFeatures: 8,
    activeMembers: 1250,
  };

  return (
    <div className="mb-8 relative">
      {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"> */}
        {/* Left: Welcome Text */}
        <div>
          <div className="mb-6">
            <h1 className="text-5xl md:text-6xl font-bold mb-3">
              <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                Building Web3 Community
              </span>
            </h1>
            <p className="text-muted-foreground pt-4 text-lg leading-relaxed">
              Join our growing ecosystem of innovators, educators, and Web3 enthusiasts. Discover events, partnerships, and opportunities to shape the future of Ethereum.
            </p>
          </div>

          {/* Stats Row
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            Events
            <div className="rounded-xl border border-blue-500/30 bg-gradient-to-br from-blue-500/10 to-blue-500/5 backdrop-blur p-4 hover:border-blue-500/60 transition-all">
              <p className="text-xs text-blue-400 uppercase font-semibold mb-2">Events</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold text-white">{communityStats.events}</p>
                <span className="text-blue-400">+</span>
              </div>
            </div>

            Colleges
            <div className="rounded-xl border border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-purple-500/5 backdrop-blur p-4 hover:border-purple-500/60 transition-all">
              <p className="text-xs text-purple-400 uppercase font-semibold mb-2">Colleges</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold text-white">{communityStats.colleges}</p>
                <span className="text-purple-400">+</span>
              </div>
            </div>

             Media 
            <div className="rounded-xl border border-orange-500/30 bg-gradient-to-br from-orange-500/10 to-orange-500/5 backdrop-blur p-4 hover:border-orange-500/60 transition-all">
              <p className="text-xs text-orange-400 uppercase font-semibold mb-2">Media</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold text-white">{communityStats.mediaFeatures}</p>
                <span className="text-orange-400">+</span>
              </div>
            </div>

             Members 
            <div className="rounded-xl border border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 backdrop-blur p-4 hover:border-cyan-500/60 transition-all">
              <p className="text-xs text-cyan-400 uppercase font-semibold mb-2">Members</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold text-white">{communityStats.activeMembers}</p>
                <span className="text-cyan-400">+</span>
              </div>
            </div>
          </div> */}
        </div>

        {/* Right: Illustration */}
        {/* <div className="relative h-96 hidden lg:flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-cyan-500/5 rounded-2xl border border-emerald-500/20 backdrop-blur-xl overflow-hidden"> */}
            {/* Animated shapes */}
            {/* <div className="absolute top-10 left-10 w-32 h-32 bg-emerald-400/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-cyan-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} /> */}
            
            {/* Globe/Network Icon */}
            {/* <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <Globe size={120} className="text-emerald-400/20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Users size={60} className="text-emerald-400/40 animate-pulse" />
                </div>
              </div>
            </div> */}
          {/* </div> */}
        {/* </div> */}
      {/* </div> */}

      {/* Decorative backgrounds */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
};