'use client';

import Link from 'next/link';
import { useSession } from '@/app/lib/auth-client';
import { ArrowRight, BookOpen } from 'lucide-react';

// Inline EIP book illustration — SVG only, no images needed
function EIPBookIllustration() {
  return (
    <div className="relative flex items-center justify-center w-full h-full select-none pointer-events-none">
      {/* Ambient glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-emerald-500/8 rounded-full blur-3xl" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-40 h-40 bg-emerald-400/6 rounded-full blur-2xl" />

      {/* Particle dots */}
      {[
        { top: '8%', left: '20%', size: 3, delay: '0s', opacity: 0.6 },
        { top: '15%', right: '15%', size: 2, delay: '0.5s', opacity: 0.4 },
        { top: '40%', left: '5%', size: 4, delay: '1s', opacity: 0.5 },
        { top: '60%', right: '8%', size: 2, delay: '0.3s', opacity: 0.35 },
        { top: '20%', left: '55%', size: 3, delay: '0.8s', opacity: 0.45 },
      ].map((p: { top: string; left?: string; right?: string; size: number; delay: string; opacity: number }, i: number) => (
        <div
          key={i}
          className="absolute rounded-full bg-emerald-400 animate-pulse"
          style={{
            top: p.top, left: p.left, right: p.right,
            width: p.size, height: p.size, opacity: p.opacity,
            animationDelay: p.delay,
          }}
        />
      ))}

      <div className="relative z-10 flex flex-col items-center">
        {/* Ethereum crystal */}
        <svg
          width="140"
          height="170"
          viewBox="0 0 120 160"
          className="mb-[-20px] drop-shadow-[0_0_40px_rgba(16,185,129,0.55)]"
          style={{ filter: 'drop-shadow(0 0 30px rgba(16,185,129,0.5))' }}
        >
          <defs>
            <linearGradient id="hTop1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#6ee7b7" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#059669" stopOpacity="0.75" />
            </linearGradient>
            <linearGradient id="hTop2" x1="1" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#34d399" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#065f46" stopOpacity="0.95" />
            </linearGradient>
            <linearGradient id="hBot1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#059669" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#022c22" stopOpacity="0.98" />
            </linearGradient>
            <linearGradient id="hBot2" x1="1" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#047857" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#022c22" stopOpacity="0.98" />
            </linearGradient>
          </defs>
          <polygon points="60,5 100,65 60,80 20,65" fill="url(#hTop1)" />
          <polygon points="60,5 20,65 60,80" fill="url(#hTop2)" />
          <polygon points="60,5 100,65 60,80" fill="rgba(16,185,129,0.15)" />
          <polygon points="60,80 100,65 60,155" fill="url(#hBot2)" />
          <polygon points="60,80 20,65 60,155" fill="url(#hBot1)" />
          <line x1="20" y1="65" x2="100" y2="65" stroke="#34d399" strokeWidth="0.5" opacity="0.4" />
        </svg>

        {/* Open book */}
        <div className="relative">
          {/* Book shadow glow */}
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-56 h-6 bg-emerald-500/15 blur-xl rounded-full" />
          <svg width="340" height="190" viewBox="0 0 340 190" className="relative z-10">
            <defs>
              <linearGradient id="pageL" x1="1" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1a1f1e" />
                <stop offset="100%" stopColor="#111614" />
              </linearGradient>
              <linearGradient id="pageR" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#1c211f" />
                <stop offset="100%" stopColor="#111614" />
              </linearGradient>
              <linearGradient id="spine" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#0d1412" />
                <stop offset="100%" stopColor="#1a2420" />
              </linearGradient>
              <linearGradient id="cover" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0a1210" />
                <stop offset="100%" stopColor="#050a08" />
              </linearGradient>
            </defs>

            {/* Book body shadow */}
            <ellipse cx="170" cy="188" rx="130" ry="6" fill="rgba(0,0,0,0.4)" />

            {/* Book cover base */}
            <path d="M30,40 L170,20 L310,40 L310,175 L170,185 L30,175 Z" fill="url(#cover)" />

            {/* Left page */}
            <path d="M170,25 L35,43 L35,172 L170,182 Z" fill="url(#pageL)" stroke="#2a3530" strokeWidth="0.5" />
            {/* Right page */}
            <path d="M170,25 L305,43 L305,172 L170,182 Z" fill="url(#pageR)" stroke="#2a3530" strokeWidth="0.5" />

            {/* Spine line */}
            <line x1="170" y1="25" x2="170" y2="182" stroke="#3a4a44" strokeWidth="1.5" />

            {/* Left page content — EIP-1559 */}
            <text x="100" y="72" textAnchor="middle" fill="#94a3a0" fontSize="11" fontWeight="700" fontFamily="system-ui">EIP-1559</text>
            <text x="100" y="86" textAnchor="middle" fill="#6b7e79" fontSize="8.5" fontFamily="system-ui">Fee market change</text>
            <line x1="55" y1="94" x2="145" y2="94" stroke="#2a3a36" strokeWidth="0.5" />
            <text x="100" y="108" textAnchor="middle" fill="#4d6460" fontSize="7.5" fontFamily="system-ui" style={{ maxWidth: '90px' }}>Introduces a base fee for</text>
            <text x="100" y="119" textAnchor="middle" fill="#4d6460" fontSize="7.5" fontFamily="system-ui">transactions and burns it,</text>
            <text x="100" y="130" textAnchor="middle" fill="#4d6460" fontSize="7.5" fontFamily="system-ui">improving the economic</text>
            <text x="100" y="141" textAnchor="middle" fill="#4d6460" fontSize="7.5" fontFamily="system-ui">model of Ethereum.</text>
            {/* Final badge */}
            <rect x="74" y="152" width="52" height="14" rx="7" fill="rgba(16,185,129,0.15)" stroke="rgba(16,185,129,0.3)" strokeWidth="0.5" />
            <text x="100" y="162" textAnchor="middle" fill="#10b981" fontSize="7.5" fontWeight="700" fontFamily="system-ui">Final</text>

            {/* Right page content — EIP-4844 */}
            <text x="240" y="72" textAnchor="middle" fill="#94a3a0" fontSize="11" fontWeight="700" fontFamily="system-ui">EIP-4844</text>
            <text x="240" y="86" textAnchor="middle" fill="#6b7e79" fontSize="8.5" fontFamily="system-ui">Proto-danksharding</text>
            <line x1="195" y1="94" x2="285" y2="94" stroke="#2a3a36" strokeWidth="0.5" />
            <text x="240" y="108" textAnchor="middle" fill="#4d6460" fontSize="7.5" fontFamily="system-ui">Introduces blob-carrying</text>
            <text x="240" y="119" textAnchor="middle" fill="#4d6460" fontSize="7.5" fontFamily="system-ui">transactions to scale</text>
            <text x="240" y="130" textAnchor="middle" fill="#4d6460" fontSize="7.5" fontFamily="system-ui">Ethereum with rollups.</text>
            {/* Final badge */}
            <rect x="214" y="152" width="52" height="14" rx="7" fill="rgba(16,185,129,0.15)" stroke="rgba(16,185,129,0.3)" strokeWidth="0.5" />
            <text x="240" y="162" textAnchor="middle" fill="#10b981" fontSize="7.5" fontWeight="700" fontFamily="system-ui">Final</text>

            {/* Page curl hint */}
            <path d="M35,170 Q52,175 35,172" fill="#0f1a17" opacity="0.5" />
            <path d="M305,170 Q288,175 305,172" fill="#0f1a17" opacity="0.5" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export function HeroSection() {
  const { data: session } = useSession();
  const isSignedIn = !!session?.user;

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#080808] pt-16">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
        <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] bg-emerald-500/4 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-40 w-[400px] h-[400px] bg-emerald-500/3 rounded-full blur-3xl" />
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, #10b981 1px, transparent 0)',
            backgroundSize: '36px 36px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20 lg:py-0">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-6 items-center min-h-[calc(100vh-64px)]">

          {/* Left — text */}
          <div className="flex flex-col justify-center">
            <p className="text-emerald-400 text-sm font-semibold mb-5 tracking-wide">
              Understand Ethereum. Shape the Future.
            </p>

            <h1 className="text-white font-black leading-none mb-6" style={{ fontSize: 'clamp(2.8rem, 5vw, 4.2rem)', letterSpacing: '-0.03em', lineHeight: 1.02 }}>
              Learn Ethereum.<br />
              Understand <span className="text-emerald-400">EIPs</span>.<br />
              Build the Future.
            </h1>

            <p className="text-zinc-400 text-base leading-relaxed mb-8 max-w-[480px]">
              EIPsInsight Bootcamp is your gateway to the world of Ethereum Improvement Proposals, core concepts, and the ideas shaping the Ethereum ecosystem.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 mb-10">
              <Link
                href={isSignedIn ? '/dashboard' : '/sign-up'}
                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm px-6 py-3.5 rounded-xl transition-all duration-200 shadow-[0_0_24px_rgba(16,185,129,0.25)] hover:shadow-[0_0_36px_rgba(16,185,129,0.4)] group"
              >
                {isSignedIn ? 'Continue Learning' : 'Start Learning'}
                <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
              {!isSignedIn && (
                <div className="text-sm text-zinc-500 leading-snug">
                  Sign in or create an account<br />
                  to continue your journey
                </div>
              )}
            </div>

            {/* Value prop bar */}
            <div className="flex items-center gap-3 bg-white/3 border border-white/6 rounded-xl px-4 py-3 max-w-[460px]">
              <BookOpen size={16} className="text-emerald-400 flex-shrink-0" />
              <p className="text-zinc-400 text-sm">
                From beginner to contributor — learn, explore, and grow with Ethereum.
              </p>
            </div>
          </div>

          {/* Right — illustration */}
          <div className="hidden lg:flex items-center justify-center h-[560px]">
            <EIPBookIllustration />
          </div>
        </div>
      </div>
    </section>
  );
}