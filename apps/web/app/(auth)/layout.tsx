import { Navbar } from "../components/landing/Navbar";
import { WavingStudent } from "../components/auth/WavingStudent";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#fcfbf7] text-[#171a18] font-sans selection:bg-[#61d9b9] selection:text-black flex flex-col relative overflow-hidden">
      <style
        dangerouslySetInnerHTML={{
          __html: `@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&display=swap');`,
        }}
      />

      {/* 1. Subtle Engineering Blueprint Grid matching reference page */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-[0.045] z-0" 
        style={{ 
          backgroundImage: 'linear-gradient(#075945 1px, transparent 1px), linear-gradient(90deg, #075945 1px, transparent 1px)', 
          backgroundSize: '36px 36px' 
        }} 
      />

      {/* 2. Soft Ambient Green & Amber Lighting */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
        <div className="absolute -top-24 left-1/3 -translate-x-1/2 h-[550px] w-[850px] rounded-full bg-[#075945]/12 blur-[160px]" />
        <div className="absolute top-36 right-10 h-80 w-80 rounded-full bg-[#f8bd36]/10 blur-[150px]" />
        <div className="absolute bottom-32 left-10 h-72 w-72 rounded-full bg-[#61d9b9]/12 blur-[140px]" />
      </div>

      {/* Global Navbar */}
      <Navbar
        className="dark bg-background/90 backdrop-blur-xl border-b border-border z-50"
        showNavLinks={false}
        showThemeToggle={false}
      />

      {/* Main Content Area */}
      <main className="mt-16 flex-grow flex flex-col items-center justify-start pt-6 sm:pt-8 lg:pt-10 pb-16 px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="w-full max-w-[1120px] mx-auto flex flex-col items-center">
          
          {/* Top Header: Clean, Balanced & Formatted on Straight Lines */}
          <div className="text-center max-w-3xl mb-6 sm:mb-8">
            
            {/* Pulse Badge */}
            <div className="inline-flex items-center gap-2.5 rounded-full border border-[#075945]/20 bg-[#075945]/10 px-4 py-1.5 backdrop-blur-md mb-3 shadow-xs">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#075945] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#075945]" />
              </span>
              <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#075945]">
                Student On-Ramp
              </span>
              <span className="text-[#333]/30 text-xs">·</span>
              <span className="text-[11px] font-semibold text-[#444]">
                Open Ethereum Education
              </span>
            </div>

            {/* Headline formatted neatly */}
            <h1 className="font-sans text-[clamp(1.85rem,3.4vw,2.75rem)] font-black leading-[1.12] tracking-tight text-[#111]">
              Demystifying Ethereum governance{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#075945] via-[#0e7955] to-[#d97706]">
                for student builders.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-2 text-sm sm:text-base text-[#555] font-medium leading-relaxed max-w-2xl mx-auto">
              Hands-on EIP labs, protocol governance tracks, and campus peers guiding you from your first smart contract to protocol governance.
            </p>
          </div>

          {/* Unified Divided Box: Form on one side, Waving Student on the other */}
          <div className="w-full bg-white/95 backdrop-blur-md rounded-3xl border border-gray-200/90 shadow-[0_20px_60px_rgba(7,89,69,0.08)] overflow-hidden grid grid-cols-1 lg:grid-cols-12">
            
            {/* Side A: Waving Student & Campus Community Stage */}
            <div className="lg:col-span-6 bg-gradient-to-b from-[#faf9f5] to-[#f4f2ea] p-6 sm:p-8 flex flex-col justify-between items-center border-b lg:border-b-0 lg:border-r border-gray-200/80 relative">
              
              {/* Top tag */}
              <div className="w-full flex items-center justify-between text-xs font-mono text-[#666] mb-2">
                <span className="flex items-center gap-1.5 font-bold text-[#075945]">
                  <span className="w-2 h-2 rounded-full bg-[#27c93f] animate-pulse" />
                  Live Campus Cohort
                </span>
                <span className="text-[11px] text-[#888]">
                  EVM &amp; EIP Labs
                </span>
              </div>

              {/* Student Video Animation */}
              <div className="my-auto py-2 w-full flex justify-center">
                <WavingStudent />
              </div>

              {/* Bottom Community Perks & Avatars */}
              <div className="w-full pt-4 border-t border-gray-200/80 space-y-3">
                <div className="flex flex-wrap justify-center gap-4 text-xs font-semibold text-[#444]">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#075945]" />
                    Zero Paywalls
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#f8bd36]" />
                    Developer Labs
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#075945]" />
                    Campus Mentorship
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3">
                  <div aria-hidden="true" className="flex -space-x-2">
                    {['Arijit.jpg', 'dhan.jpg', 'rajdeep.jpg', 'Subhadeep.jpeg'].map((avatar) => (
                      <img
                        key={avatar}
                        src={`/avatars/${avatar}`}
                        alt={avatar.split('.')[0]}
                        className="h-7 w-7 rounded-full border-2 border-white shadow-xs object-cover"
                      />
                    ))}
                  </div>
                  <p className="text-[11px] text-[#666] font-medium">
                    Joined by <span className="font-bold text-[#111]">1,200+ students</span> across 20+ campuses
                  </p>
                </div>
              </div>

            </div>

            {/* Side B: Auth Form (Sign In / Sign Up) */}
            <div className="lg:col-span-6 bg-white p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
              {children}
            </div>

          </div>

        </div>
      </main>

      {/* Signature Organic Wavy Bottom Transition into Deep Green Strip matching reference */}
      <div className="relative w-full overflow-hidden leading-none mt-auto z-10 pointer-events-none">
        <svg 
          className="relative block w-full h-[40px] sm:h-[65px] text-[#0d1f1a] translate-y-[1px]" 
          viewBox="0 0 1440 120" 
          fill="currentColor" 
          preserveAspectRatio="none"
        >
          <path d="M0,80 C480,-40 960,200 1440,80 L1440,120 L0,120 Z" />
        </svg>
        <div className="bg-[#0d1f1a] text-white/70 py-3 px-6 border-t border-[#075945]/30">
          <div className="max-w-[1360px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono">
            <div className="flex items-center gap-2 text-[#61d9b9]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#61d9b9] animate-pulse" />
              <span>Ethereum Protocol &amp; Governance Education</span>
            </div>
            <div className="text-white/40 text-[11px]">
              ETHShala · Built by Avarch · Ethereum Education
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
