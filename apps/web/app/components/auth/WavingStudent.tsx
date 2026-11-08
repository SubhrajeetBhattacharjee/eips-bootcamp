'use client';

import React, { useEffect, useRef } from 'react';
import { Sparkles } from 'lucide-react';

export function WavingStudent() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.defaultMuted = true;
      video.muted = true;
      video.playsInline = true;
      video.play().catch(() => {});
    }
  }, []);

  return (
    <div className="relative w-full max-w-[440px] mx-auto flex flex-col items-center select-none py-2">
      
      {/* Soft organic emerald glow behind the character */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-gradient-to-tr from-[#075945]/15 via-[#61d9b9]/20 to-[#f8bd36]/10 blur-3xl opacity-80" />

      {/* Floating badge 1: EIP-4844 */}
      <div className="absolute top-8 -left-2 sm:left-0 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-[#075945]/20 text-xs font-mono font-bold text-[#075945] shadow-lg animate-[bounce_4.5s_ease-in-out_infinite]">
        <Sparkles className="w-3.5 h-3.5 text-[#d97706]" />
        <span>EIP-4844 // Blobs ⚡</span>
      </div>

      {/* Floating badge 2: ERC-4337 */}
      <div className="absolute bottom-16 -right-2 sm:right-0 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-[#f8bd36]/50 text-xs font-mono font-bold text-[#b45309] shadow-lg animate-[bounce_5.5s_ease-in-out_infinite_1s]">
        <span>ERC-4337 // AA 🔑</span>
      </div>

      {/* Floating badge 3: Sepolia live connection */}
      <div className="absolute bottom-4 -left-2 sm:left-2 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md border border-gray-200/80 text-[11px] font-mono text-[#333] shadow-md">
        <span className="w-2 h-2 rounded-full bg-[#27c93f] animate-pulse" />
        <span>Sepolia: Connected</span>
      </div>

      {/* Main Character: Native H.264 Video with multiply blend + edge fade */}
      <div className="relative w-full flex items-center justify-center">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          poster="/student-wave-poster.png"
          className="w-full max-w-[380px] sm:max-w-[420px] h-auto object-contain pointer-events-none mix-blend-multiply"
          style={{
            maskImage: 'radial-gradient(ellipse 78% 74% at 50% 48%, black 45%, transparent 78%)',
            WebkitMaskImage: 'radial-gradient(ellipse 78% 74% at 50% 48%, black 45%, transparent 78%)',
          }}
        >
          <source src="/student-wave.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Soft Grounding Ambient Pedestal Shadow under character */}
      <div className="pointer-events-none w-60 sm:w-72 h-6 -mt-3 rounded-full bg-gradient-to-r from-transparent via-[#075945]/18 to-transparent blur-md" />

    </div>
  );
}
