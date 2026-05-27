import React from 'react';
import { Navbar } from './components/landing/Navbar';
import { HeroSection } from './components/landing/HeroSection';
import { LearningTracks } from './components/landing/LearningTracks';
import { WhyEIPs } from './components/landing/WhyEIPs';
import { JourneySection } from './components/landing/JourneySection';
import { Footer } from './components/landing/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#080808] text-white">
      <Navbar />
      <main className="mt-16">
        <HeroSection />
        <LearningTracks />
        <WhyEIPs />
        <JourneySection />
      </main>
      <Footer />
    </div>
  );
}

