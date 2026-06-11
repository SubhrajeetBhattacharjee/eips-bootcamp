import { Navbar } from "../components/landing/Navbar";
import { Zap, TrendingUp, Trophy, BookOpen } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div
        className="
          absolute
          inset-0
          bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(6,182,212,0.15),transparent_40%)]
        "
      />
      <Navbar />

      {/* Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute left-20 top-20 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
        <div
          className="
            absolute
            -left-40
            top-20
            h-[35rem]
            w-[35rem]
            rounded-full
            bg-emerald-500/20
            dark:bg-emerald-500/10
            blur-[150px]
          "
        />

        <div
          className="
            absolute
            -right-40
            bottom-0
            h-[35rem]
            w-[35rem]
            rounded-full
            bg-cyan-500/20
            dark:bg-cyan-500/10
            blur-[150px]
          "
        />
      </div>
      
      {/* Main Card */}
      <div className="relative z-10 pt-16 min-h-screen">
        <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-2">
          
          {/* Left Panel */}
          <div className="hidden lg:flex flex-col justify-center items-center px-16 xl:px-24">
            {/* EthereumLearningAnimation */}
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
            </div>

            {/* Heading */}
            <h1 className="mt-6 text-5xl xl:text-6xl font-bold text-center">
              Learn.
              <span className="text-emerald-500"> Build.</span>
              <br />
              Grow.
            </h1>

            {/* Description */}
            <p className="mt-4 max-w-md text-center text-muted-foreground text-base leading-relaxed">
              Master Ethereum development through structured learning and real progress tracking.
            </p>
            
            {/* SaaS cards */}
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
  
              <div className="flex items-start gap-2 rounded-xl border border-white/10 bg-white/5 p-2 backdrop-blur">
                <span className="text-emerald-400">⚡</span>
                <div>
                  <p className="font-medium">Earn XP</p>
                  <p className="text-sm text-muted-foreground">Complete tasks and level up</p>
                </div>
              </div>

              <div className="flex items-start gap-2 rounded-xl border border-white/10 bg-white/5 p-2 backdrop-blur">
                <span className="text-emerald-400">🔥</span>
                <div>
                  <p className="font-medium">Streak System</p>
                  <p className="text-sm text-muted-foreground">Stay consistent daily</p>
                </div>
              </div>

              <div className="flex items-start gap-2 rounded-xl border border-white/10 bg-white/5 p-2 backdrop-blur">
                <span className="text-emerald-400">🏆</span>
                <div>
                  <p className="font-medium">Leaderboard</p>
                  <p className="text-sm text-muted-foreground">Compete globally</p>
                </div>
              </div>

              <div className="flex items-start gap-2 rounded-xl border border-white/10 bg-white/5 p-2 backdrop-blur">
                <span className="text-emerald-400">📘</span>
                <div>
                  <p className="font-medium">EIP Explorer</p>
                  <p className="text-sm text-muted-foreground">Study Ethereum proposals</p>
                </div>
              </div>

            </div>

          </div> 

          {/* Auth Card */}
          <div className="flex items-center justify-center p-6">
            {children}
          </div>

        </div>
      </div>
      
    </div>
  );
}
