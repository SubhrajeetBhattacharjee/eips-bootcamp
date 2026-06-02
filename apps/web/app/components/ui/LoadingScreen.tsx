"use client";

import React from 'react';

export default function LoadingScreen({ text = "SYNCING DATA...", fullScreen = true }: { text?: string, fullScreen?: boolean }) {
  return (
    <div className={`${fullScreen ? 'fixed inset-0 z-50' : 'w-full h-full min-h-[400px] rounded-xl'} flex flex-col items-center justify-center bg-[#080808] backdrop-blur-md`}>
      <div className="relative flex flex-col items-center justify-center">
        {/* Glow effect behind the logo */}
        <div className="absolute w-32 h-32 bg-emerald-500/20 rounded-full blur-[50px] animate-pulse"></div>
        
        {/* Animated Book with Floating Ethereum Logo */}
        <div className="relative w-40 h-40 mb-8 flex flex-col items-center justify-end">
          
          {/* Particles rising from the book */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-[ping_1.5s_ease-in-out_infinite]"></div>
            <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-emerald-300 rounded-full animate-[ping_2s_ease-in-out_infinite_0.8s]"></div>
            <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-emerald-500 rounded-full animate-[ping_1.2s_ease-in-out_infinite_0.5s]"></div>
          </div>

          {/* Floating Ethereum Diamond */}
          <div className="absolute top-2 w-14 h-14 animate-bounce drop-shadow-[0_0_15px_rgba(16,185,129,0.8)] z-10" style={{ animationDuration: '2s' }}>
            <svg viewBox="0 0 256 417" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <path fill="#34d399" d="M127.961 0l-2.795 9.5v275.668l2.795 2.79 127.962-75.638z" />
              <path fill="#059669" d="M127.962 0L0 212.32l127.962 75.639V154.158z" />
              <path fill="#10b981" d="M127.961 312.187l-1.575 1.92v98.199l1.575 4.6L256 236.587z" />
              <path fill="#047857" d="M127.962 416.905v-104.72L0 236.585z" />
              <path fill="#6ee7b7" d="M127.961 287.958l127.96-75.637-127.96-58.162z" />
              <path fill="#a7f3d0" d="M0 212.32l127.96 75.638v-133.8z" />
            </svg>
          </div>

          {/* Glowing Open Book */}
          <div className="relative w-24 h-24 text-emerald-600 drop-shadow-[0_0_20px_rgba(16,185,129,0.3)] z-0">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
              {/* Glowing Pages */}
              <path d="M6 8h4" stroke="#34d399" strokeWidth="1" className="animate-pulse"></path>
              <path d="M6 12h4" stroke="#34d399" strokeWidth="1" className="animate-pulse" style={{ animationDelay: '0.2s' }}></path>
              <path d="M14 8h4" stroke="#34d399" strokeWidth="1" className="animate-pulse" style={{ animationDelay: '0.4s' }}></path>
              <path d="M14 12h4" stroke="#34d399" strokeWidth="1" className="animate-pulse" style={{ animationDelay: '0.6s' }}></path>
            </svg>
          </div>
        </div>

        {/* Loading Text */}
        <div className="flex flex-col items-center gap-2">
          <div className="text-emerald-400 font-mono text-sm tracking-[0.3em] uppercase animate-pulse">
            {text}
          </div>
          
          {/* Progress bar container */}
          <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden mt-4">
            {/* Animated progress bar line */}
            <div className="h-full bg-gradient-to-r from-emerald-600 via-emerald-400 to-emerald-600 w-full animate-[shimmer_1.5s_infinite]" 
                 style={{ 
                   animation: 'shimmer 1.5s infinite linear',
                   transform: 'translateX(-100%)'
                 }}>
            </div>
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}} />
    </div>
  );
}
