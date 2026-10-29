'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { useSession } from '@/app/lib/auth-client';

const events = [
  {
    day: '27',
    month: 'AUG',
    title: 'Ethereum, EIPs, and The Future of Web3 ecosystem',
    venue: 'Hooghly Engineering & Technology College',
    color: 'bg-[#ffd359]',
  },
  {
    day: '27',
    month: 'SEPT',
    title: 'InnovoCon Hacknex 2.0',
    venue: 'Hackathon, Kolkata',
    color: 'bg-[#dfdbfc]',
  },
  {
    day: '08',
    month: 'OCT',
    title: 'WEB3 Hands-on Session',
    venue: 'MCKV Institute of Engineering',
    color: 'bg-[#d8f0dd]',
  },
];

const campuses = [
  {
    name: 'Hooghly Engineering & Technology College',
    logo: '/brand/partners/hetc.png',
  },
  {
    name: 'Heritage Institute of Technology',
    logo: '/brand/partners/heritage.png',
  },
  {
    name: 'MCKV Institute of Engineering',
    logo: '/brand/partners/mckvie.jpg',
  },
  {
    name: 'Techno Main Salt Lake',
    logo: '/brand/partners/tmsl.png',
  },
];

export function HeroSection() {
  const { data: session } = useSession();
  const isSignedIn = !!session?.user;

  return (
    <section className="relative w-full h-[calc(100vh-60px)] min-h-[650px] bg-[#fcfbf7] text-[#171a18] flex flex-col pt-6 pb-6 overflow-hidden font-sans">
      <style dangerouslySetInnerHTML={{__html: `@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&display=swap');`}} />
      
      <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-8 lg:px-12 flex-grow flex flex-col justify-between">
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_1.1fr] gap-8 xl:gap-8 items-center flex-grow">
          
          {/* Left Column */}
          <div className="relative z-10 flex flex-col justify-center max-w-2xl">
            <h1 className="text-[clamp(3.5rem,7vw,6.5rem)] font-black leading-[0.92] tracking-tight">
              <span className="block text-[#111]">Ethereum,</span>
              <span className="relative inline-block text-[#075945] mt-1">
                on campus.
                {/* Squiggly underline */}
                <svg
                  aria-hidden="true"
                  viewBox="0 0 360 24"
                  className="absolute -bottom-5 left-0 w-full overflow-visible"
                  fill="none"
                >
                  <path
                    d="M3 16C78 5 189 3 353 9M14 21C108 13 236 9 326 13"
                    stroke="#f8bd36"
                    strokeLinecap="round"
                    strokeWidth="5"
                  />
                </svg>
              </span>
            </h1>

            <p className="mt-8 max-w-md text-[17px] lg:text-[19px] font-medium leading-[1.4] text-[#333]">
              Bringing Ethereum learning,
              <br className="hidden sm:block" /> events &amp; communities to students.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/community"
                className="group inline-flex min-h-[48px] items-center gap-3 rounded-lg bg-[#064a3a] px-6 text-[15px] font-semibold text-white transition-colors hover:bg-[#043328] shadow-md"
              >
                Partner with us
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
              {/* <Link
                href={isSignedIn ? '/dashboard/learning' : '/sign-up'}
                className="inline-flex min-h-[48px] items-center rounded-lg border-2 border-[#dcdad3] bg-transparent px-6 text-[15px] font-semibold text-[#1c201e] transition-colors hover:bg-black/5"
              >
                Explore programs
              </Link> */}
            </div>

            <div className="mt-10 flex items-center gap-4 relative">
              <div aria-hidden="true" className="flex -space-x-3">
                {['Arijit.jpg', 'dhan.jpg', 'rajdeep.jpg', 'Subhadeep.jpeg'].map((avatar) => (
                  <img
                    key={avatar}
                    src={`/avatars/${avatar}`}
                    alt={avatar.split('.')[0]}
                    className="h-10 w-10 rounded-full border-[3px] border-[#fcfbf7] shadow-sm object-cover bg-gradient-to-br from-[#c8c7bf] to-[#898c83]"
                  />
                ))}
              </div>
              <p className="text-[13px] leading-[1.3] text-[#555] font-medium max-w-[150px]">
                <span className="font-extrabold text-[#111] text-[15px]">200+</span> Students reached across campuses
              </p>

              {/* Handwritten text + Arrow */}
              <div className="absolute right-[0px] md:right-[50px] top-[0px] hidden md:block">
                <div className="relative transform rotate-[-12deg]">
                  <p className="text-2xl font-bold text-[#222] leading-none" style={{ fontFamily: '"Caveat", cursive' }}>
                    Students
                    <br />Build
                    <br />Communities
                  </p>
                  <svg className="absolute -bottom-6 -right-10 w-12 h-10 text-[#222]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10,20 Q40,60 80,70" />
                    <path d="M65,55 L80,70 L60,85" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (Images and Events) */}
          <div className="relative w-full h-[380px] xl:h-[500px] flex justify-center items-center">
            
            {/* Top right handwritten text */}
            <div className="absolute top-[-10px] right-[40px] z-20 transform rotate-[-8deg] hidden xl:block">
              <p className="text-3xl font-bold text-[#222] leading-none text-right" style={{ fontFamily: '"Caveat", cursive' }}>
                Learn
                <br />Build
                <br />Belong
              </p>
              <svg className="absolute -left-6 bottom-0 w-6 h-6 text-[#f8bd36]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round">
                <path d="M20,80 L80,20" />
                <path d="M40,90 L90,40" />
              </svg>
            </div>

            {/* Main Placeholder Image */}
            <div className="relative w-full max-w-[600px] h-full max-h-[350px] xl:max-h-[450px] mr-auto xl:mr-10">
              
              {/* Main Image */}
              <div className="absolute inset-0 bg-[#e3dfd3] border-[8px] border-white shadow-xl transform rotate-[2deg] flex items-center justify-center overflow-hidden">
                <img 
                  src="/events/event_images/IMG_4213.webp" 
                  alt="Main Event" 
                  className="w-full h-full object-cover"
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                />
              </div>
              
              {/* Tape piece top left */}
              <div className="absolute -top-3 left-[20%] w-24 h-8 bg-white/50 backdrop-blur-md transform rotate-[-4deg] shadow-sm mix-blend-screen" />
              
              {/* Tape piece bottom right */}
              <div className="absolute -bottom-3 right-[30%] w-16 h-7 bg-white/50 backdrop-blur-md transform rotate-[5deg] shadow-sm mix-blend-screen" />

              {/* Overlapping small B&W photo */}
              <div className="absolute top-[25%] -right-8 w-[240px] h-[140px] bg-[#cfccc2] border-[6px] border-white shadow-2xl transform rotate-[-6deg] hidden xl:flex items-center justify-center z-10 overflow-hidden">
                <img 
                  src="/events/event_images/IMG_4217.webp" 
                  alt="EIP Session" 
                  className="w-full h-full object-cover grayscale sepia-[0.3]"
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                />
              </div>

              {/* Event Cards Overlapping Bottom Right */}
              <div className="absolute -bottom-6 right-0 z-30 flex flex-col gap-2.5 w-[95%] sm:w-[360px]">
                {events.map((event, index) => (
                  <div
                    key={event.title}
                    className={`${event.color} flex items-center gap-3 rounded-xl px-4 py-2.5 shadow-[0_8px_25px_rgba(0,0,0,0.08)] transform transition-transform hover:-translate-y-1`}
                    style={{ marginLeft: `${index * 12}px` }}
                  >
                    <div className="w-12 shrink-0 text-center leading-none border-r border-black/10 pr-3">
                      <span className="block text-[22px] font-black text-[#111]">{event.day}</span>
                      <span className="mt-1 block text-[9px] font-bold text-[#333] tracking-[0.2em]">{event.month}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-bold text-[#111] leading-tight">
                        {event.title}
                      </p>
                      <p className="mt-1 truncate text-[11px] font-medium text-[#444] leading-tight">
                        {event.venue}
                      </p>
                    </div>
                    <ArrowRight size={18} className="shrink-0 text-[#111]" />
                  </div>
                ))}
              </div>

            </div>
          </div>

        </div>
        
        {/* Logos Section */}
        <div className="mt-6 pt-6 pb-2">
          <div className="border-t border-[#d8d6ce] relative">
            <span className="absolute -top-3 left-0 bg-[#fcfbf7] pr-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#666]">
              TRUSTED BY CAMPUSES ACROSS INDIA
            </span>
            <div className="mt-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-0 relative">
              {campuses.map((campus, index) => (
                <div key={campus.name} className="flex items-center gap-4 flex-1 md:px-4 relative logo-item">
                  <Image
                    src={campus.logo}
                    alt={`${campus.name} logo`}
                    width={48}
                    height={48}
                    className="h-10 w-10 shrink-0 object-contain mix-blend-multiply opacity-90 hover:opacity-100 transition-all"
                  />
                  <p className="text-[12px] font-semibold leading-tight text-[#333] max-w-[140px]">
                    {campus.name.split(' ').slice(0, 2).join(' ')}
                    <br/>
                    <span className="font-normal text-[#666]">{campus.name.split(' ').slice(2).join(' ')}</span>
                  </p>
                  
                  {/* Vertical Divider */}
                  {index !== campuses.length - 1 && (
                    <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-[1px] h-8 bg-[#d8d6ce]" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
