// apps/web/app/community/page.tsx

'use client';

import { Navbar } from '../components/landing/Navbar';
import { Footer } from '../components/landing/Footer';
import { CommunityHero } from '../components/community/CommunityHero';
import { EventsSection } from '../components/community/EventsSection';
import { SocialSection } from '../components/community/SocialSection';
import { EventImageShowcase } from '../components/community/EventImageShowcase';
import { CampusNetworkSection } from '../components/community/CampusNetworkSection';

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-[#fcfbf7] text-[#171a18] font-sans selection:bg-[#61d9b9] selection:text-black">
      <style dangerouslySetInnerHTML={{__html: `@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&display=swap');`}} />
      <Navbar
        className="dark bg-background/90 backdrop-blur-xl border-b border-border"
        showThemeToggle={false}
      />
      
      <main className="mt-16 relative">
        {/* 1. Hero Section (LIGHT) */}
        <section className="relative bg-[#fcfbf7] text-[#171a18] pt-12 pb-32 sm:pt-16 sm:pb-40 overflow-hidden">
          <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
            <CommunityHero />
          </div>

          {/* Organic wavy transition into dark section */}
          <svg 
            className="absolute bottom-0 left-0 w-full h-[60px] md:h-[110px] text-[#0d1f1a] translate-y-[1px] pointer-events-none" 
            viewBox="0 0 1440 120" 
            fill="currentColor" 
            preserveAspectRatio="none"
          >
            <path d="M0,80 C480,-40 960,200 1440,80 L1440,120 L0,120 Z" />
          </svg>
        </section>

        {/* 2. College Events & Workshops Section (DARK) */}
        <section id="events" className="relative bg-[#0d1f1a] text-white pt-20 pb-32 sm:pt-28 sm:pb-40 scroll-mt-20 overflow-hidden">
          <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
            <EventsSection />
          </div>

          {/* Organic wavy transition into light section */}
          <svg 
            className="absolute bottom-0 left-0 w-full h-[60px] md:h-[110px] text-[#fcfbf7] translate-y-[1px] pointer-events-none" 
            viewBox="0 0 1440 120" 
            fill="currentColor" 
            preserveAspectRatio="none"
          >
            <path d="M0,0 C480,120 960,-40 1440,60 L1440,120 L0,120 Z" />
          </svg>
        </section>

        {/* 3. Latest Buzz / Community Social Feed Section (LIGHT) */}
        <section id="social" className="relative bg-[#fcfbf7] text-[#171a18] pt-20 pb-32 sm:pt-28 sm:pb-40 scroll-mt-20 overflow-hidden">
          <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
            <SocialSection />
          </div>

          {/* Organic wavy transition into dark section */}
          <svg 
            className="absolute bottom-0 left-0 w-full h-[60px] md:h-[110px] text-[#06100e] translate-y-[1px] pointer-events-none" 
            viewBox="0 0 1440 120" 
            fill="currentColor" 
            preserveAspectRatio="none"
          >
            <path d="M0,80 C480,-40 960,200 1440,80 L1440,120 L0,120 Z" />
          </svg>
        </section>

        {/* 4. Event Gallery & Panoramic Showcase Section (DARK) */}
        <section id="gallery" className="relative bg-[#06100e] text-white pt-20 pb-32 sm:pt-28 sm:pb-40 scroll-mt-20 overflow-hidden">
          <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
            <EventImageShowcase />
          </div>

          {/* Organic wavy transition into light section */}
          <svg 
            className="absolute bottom-0 left-0 w-full h-[60px] md:h-[110px] text-[#fcfbf7] translate-y-[1px] pointer-events-none" 
            viewBox="0 0 1440 120" 
            fill="currentColor" 
            preserveAspectRatio="none"
          >
            <path d="M0,0 C480,120 960,-40 1440,60 L1440,120 L0,120 Z" />
          </svg>
        </section>

        {/* 5. Campus Network & College Partnerships Section (LIGHT) */}
        <section id="campus-network" className="relative bg-[#fcfbf7] text-[#171a18] pt-20 pb-36 sm:pt-28 sm:pb-48 scroll-mt-20 overflow-hidden">
          <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
            <CampusNetworkSection />
          </div>

          {/* Organic wavy transition into dark footer */}
          <svg 
            className="absolute bottom-0 left-0 w-full h-[60px] md:h-[110px] text-[#080808] translate-y-[1px] pointer-events-none" 
            viewBox="0 0 1440 120" 
            fill="currentColor" 
            preserveAspectRatio="none"
          >
            <path d="M0,80 C480,-40 960,200 1440,80 L1440,120 L0,120 Z" />
          </svg>
        </section>
      </main>

      <div className="dark">
        <Footer />
      </div>
    </div>
  );
}