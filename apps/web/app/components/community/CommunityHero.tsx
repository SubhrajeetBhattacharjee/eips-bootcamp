// apps/web/app/components/community/CommunityHero.tsx

'use client';

import React, { useEffect, useRef } from 'react';
import { ArrowRight, Calendar, Users, Building2, Sparkles, MapPin, Laptop, Flame, Award } from 'lucide-react';
import { gsap } from 'gsap';

export const CommunityHero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  const stats = [
    { label: 'Students Reached', target: 350, suffix: '+', subtitle: 'Across HETC & MCKVIE workshops', icon: Users, color: 'text-[#075945]' },
    { label: 'Active Chapters', target: 2, suffix: '', subtitle: 'Hooghly & MCKV campuses', icon: Building2, color: 'text-[#f8bd36]' },
    { label: 'Ecosystem Events', target: 24, suffix: '+', subtitle: 'Hackathons, bootcamps & meetups', icon: Calendar, color: 'text-[#075945]' },
    { label: 'Open Access', target: 100, suffix: '%', subtitle: 'Free developer education', icon: Sparkles, color: 'text-[#f8bd36]' },
  ];

  const communityMoments = [
    {
      title: 'Hackathons & Sprints',
      chapter: 'InnovoCon Hacknex 2.0',
      description: 'Mentoring student builders shipping real smart contract projects and decentralized apps.',
      tag: 'Hackathon',
      tagColor: 'bg-[#f8bd36] text-black',
      image: '/events/event_images/InnovoCon2_1.webp',
      icon: Laptop,
    },
    {
      title: 'Hands-on Dev Sessions',
      chapter: 'MCKV Institute of Engineering',
      description: 'Live interactive coding walkthrough on wallet integration, testnets, and core Ethereum standards.',
      tag: 'Live Workshop',
      tagColor: 'bg-[#075945] text-white',
      image: '/events/event_images/IMG_4200.webp',
      icon: Flame,
      featured: true,
    },
    {
      title: 'Peer Mentorship & Builds',
      chapter: 'Hooghly Engineering (HETC)',
      description: 'Student-led campus chapters creating hands-on technical opportunities for peers.',
      tag: 'Campus Chapter',
      tagColor: 'bg-black text-white',
      image: '/events/event_images/InnovoCon2_2.webp',
      icon: Award,
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Badge pop-in
      if (badgeRef.current) {
        tl.fromTo(
          badgeRef.current,
          { scale: 0.85, opacity: 0, y: -15 },
          { scale: 1, opacity: 1, y: 0, duration: 0.5 }
        );
      }
      
      // Title reveal
      if (titleRef.current) {
        tl.fromTo(
          titleRef.current,
          { y: 25, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6 },
          '-=0.2'
        );
      }
      
      // Description reveal
      if (descRef.current) {
        tl.fromTo(
          descRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5 },
          '-=0.3'
        );
      }
      
      // CTA buttons
      if (ctaRef.current) {
        tl.fromTo(
          ctaRef.current,
          { y: 15, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5 },
          '-=0.3'
        );
      }
      
      // 3 Mosaic Cards stagger reveal
      if (cardsRef.current && cardsRef.current.children.length > 0) {
        tl.fromTo(
          cardsRef.current.children,
          { y: 30, opacity: 0, scale: 0.98 },
          { 
            y: 0, 
            opacity: 1, 
            scale: 1, 
            duration: 0.6, 
            stagger: 0.1, 
            ease: 'power2.out',
            clearProps: 'opacity,transform',
          },
          '-=0.2'
        );
      }

      // Stats animated count-up
      if (statsRef.current) {
        const counters = statsRef.current.querySelectorAll('.stat-number');
        counters.forEach((counter) => {
          const target = parseFloat(counter.getAttribute('data-target') || '0');
          const suffix = counter.getAttribute('data-suffix') || '';
          const obj = { val: 0 };
          gsap.to(obj, {
            val: target,
            duration: 1.6,
            ease: 'power2.out',
            delay: 0.3,
            onUpdate: () => {
              counter.textContent = `${Math.floor(obj.val)}${suffix}`;
            },
          });
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // 3D Tilt handler on cards
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;

    gsap.to(card, {
      rotateX,
      rotateY,
      transformPerspective: 1000,
      duration: 0.3,
      ease: 'power1.out',
    });
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    gsap.to(e.currentTarget, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.5,
      ease: 'power2.out',
    });
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-[#075945]/10 blur-[160px]" />
      <div className="pointer-events-none absolute top-40 right-10 h-80 w-80 rounded-full bg-[#f8bd36]/10 blur-[150px]" />

      {/* 1. Grand Centered Masthead (Light Theme) */}
      <div className="relative z-10 mx-auto max-w-4xl text-center">
        {/* Live Ecosystem Pulse Badge */}
        <div ref={badgeRef} className="inline-flex items-center gap-2.5 rounded-full border border-[#075945]/20 bg-[#075945]/10 px-4 py-1.5 backdrop-blur-md mb-6 shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#075945] opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#075945]" />
          </span>
          <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#075945]">
            ETHShala Community Hub
          </span>
          <span className="text-[#333]/30 text-xs">·</span>
          <span className="text-[11px] font-semibold text-[#444]">
            350+ Students Reached Across Campuses
          </span>
        </div>

        {/* Big Bold Centered Headline */}
        <h1 ref={titleRef} className="font-sans text-[clamp(2.75rem,5.5vw,5rem)] font-black leading-[0.98] tracking-tight text-[#111]">
          Building the grassroots{' '}
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#075945] via-[#0e7955] to-[#d97706] mt-1">
            Web3 Community.
          </span>
        </h1>

        {/* Centered Descriptive Paragraph */}
        <p ref={descRef} className="mt-6 text-[17px] sm:text-[20px] font-medium leading-[1.5] text-[#333] max-w-2xl mx-auto">
          From first technical sessions to hackathons and smart contract development.
          Connecting student developers, campus ambassadors, and open-source contributors across universities in India.
        </p>

        {/* Action Buttons Row */}
        <div ref={ctaRef} className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#events"
            className="group inline-flex min-h-[50px] items-center gap-3 rounded-xl bg-[#0a1a16] px-7 text-[15px] font-black text-white transition-all hover:bg-[#15382f] hover:shadow-lg hover:shadow-[#0a1a16]/25 hover:-translate-y-0.5"
          >
            Explore Events &amp; Workshops
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </a>
          <a
            href="#campus-network"
            className="inline-flex min-h-[50px] items-center gap-2 rounded-xl border-2 border-[#e5e7eb] bg-white px-6 text-[15px] font-semibold text-[#111] transition-all hover:border-[#d1d5db] hover:bg-[#f9fafb]"
          >
            Join Campus Network
          </a>
        </div>

        {/* Real Student Proof Bar */}
        <div className="mt-8 flex items-center justify-center gap-3">
          <div className="flex -space-x-3 overflow-hidden">
            {['Arijit.webp', 'dhan.webp', 'rajdeep.webp', 'Subhadeep.webp'].map((avatar) => (
              <img
                key={avatar}
                src={`/avatars/${avatar}`}
                alt="ETHShala Student Contributor"
                loading="eager"
                decoding="async"
                className="h-9 w-9 rounded-full border-2 border-white object-cover bg-black/10 shadow-md"
              />
            ))}
          </div>
          <p className="text-xs sm:text-sm font-semibold text-[#444]">
            <span className="text-[#075945] font-black">350+</span> student builders actively participating
          </p>
        </div>
      </div>

      {/* 2. Panoramic 3-Panel Community Mosaic with 3D Tilt */}
      <div ref={cardsRef} className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 perspective-1000">
        {communityMoments.map((moment, idx) => {
          const MomentIcon = moment.icon;
          return (
            <article
              key={moment.chapter}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border transition-all duration-300 will-change-transform ${
                moment.featured
                  ? 'border-[#075945]/40 bg-white shadow-2xl shadow-[#075945]/15 md:scale-[1.02]'
                  : 'border-gray-200 bg-white shadow-lg hover:border-gray-300'
              }`}
            >
              {/* Photo Banner with Zoom effect */}
              <div className="relative aspect-[16/11] w-full overflow-hidden bg-gray-100">
                <img
                  src={moment.image}
                  alt={moment.title}
                  loading={idx === 0 ? "eager" : "lazy"}
                  fetchPriority={idx === 0 ? "high" : "auto"}
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                {/* Tag Chip top-left */}
                <div className="absolute top-3.5 left-3.5">
                  <span className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${moment.tagColor} shadow-md`}>
                    <MomentIcon size={12} />
                    {moment.tag}
                  </span>
                </div>

                {/* College / Event overlay bottom */}
                <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center gap-1.5 text-xs text-white font-medium">
                  <MapPin size={12} className="text-[#f8bd36] shrink-0" />
                  <span className="truncate">{moment.chapter}</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex flex-1 flex-col justify-between">
                <div>
                  <h3 className="font-sans text-lg font-bold text-[#111] group-hover:text-[#075945] transition-colors leading-snug">
                    {moment.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-[#666] line-clamp-2 leading-relaxed">
                    {moment.description}
                  </p>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* 3. Community Stats Dock with Animated Counter */}
      <div ref={statsRef} className="mt-14 pt-8 border-t border-gray-200 grid grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="group flex flex-col justify-between rounded-2xl border border-gray-200 bg-white/90 p-5 shadow-sm transition-all duration-300 hover:border-[#075945]/40 hover:shadow-md hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#666]">
                  {item.label}
                </span>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 border border-gray-200 group-hover:border-[#075945]/30">
                  <Icon size={15} className={`${item.color}`} />
                </div>
              </div>
              <div>
                <p 
                  data-target={item.target} 
                  data-suffix={item.suffix}
                  className={`stat-number font-sans text-3xl sm:text-4xl font-black tracking-tight ${item.color}`}
                >
                  0{item.suffix}
                </p>
                <p className="text-[11px] text-[#666] mt-1 font-medium">
                  {item.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};