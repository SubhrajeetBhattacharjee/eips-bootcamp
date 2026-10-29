// apps/web/app/about/page.tsx

import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
  Search,
  BarChart2,
  GitBranch,
  Shield,
  ExternalLink,
  ArrowRight,
  Sparkles,
  BookOpen,
  Terminal,
  Laptop,
  Flame,
  Award,
  Users,
  Compass,
  Mail,
} from 'lucide-react';

import { Navbar } from '../components/landing/Navbar';
import { Footer } from '../components/landing/Footer';
import TeamCard from '../components/about/TeamCard';
import { ContributorFlywheel } from '../components/about/ContributorFlywheel';
import { AboutHeroMetrics } from '../components/about/AboutHeroMetrics';
import { GithubIcon, LinkedInIcon, DiscordIcon } from '../components/about/social_icons';

export const metadata: Metadata = {
  title: "About Us | ETHShala",
  description: "Learn about the mission, the team, and the story behind ETHShala — demystifying Ethereum protocol governance and EIPs for the next generation of builders.",
};

export default function AboutPage() {
  const teamMembers = [
    {
      name: "Pooja Ranjan",
      role: "Founder",
      focus: "Ecosystem Strategy & Protocol Research",
      description: "Shapes the long-range direction of ETHShala, leads research initiatives, and keeps the work deeply anchored to real Ethereum governance needs.",
      imageSrc: "/team/pooja_ranjan.webp",
      status: "Founder",
      socials: [
        {
          label: "GitHub",
          href: "https://github.com/poojaranjan",
          icon: <GithubIcon className="w-3.5 h-3.5" />,
        },
        {
          label: "LinkedIn",
          href: "https://www.linkedin.com/in/pooja-r-072899114/",
          icon: <LinkedInIcon className="w-3.5 h-3.5" />,
        },
      ],
    },
    {
      name: "Subhrajeet Bhattacharjee",
      role: "Full Stack Lead",
      focus: "Platform Architecture & Dev Lead",
      description: "Drives full-stack engineering, core learning module architecture, interactive quizzes, and seamless developer onboarding across web systems.",
      imageSrc: "/team/SubhrajeetBhattacharjee.webp",
      status: "Core Dev",
      socials: [
        {
          label: "GitHub",
          href: "https://github.com/SubhrajeetBhattacharjee",
          icon: <GithubIcon className="w-3.5 h-3.5" />,
        },
        {
          label: "LinkedIn",
          href: "https://www.linkedin.com/in/subhrajeet-bhattacharjee/",
          icon: <LinkedInIcon className="w-3.5 h-3.5" />,
        },
      ],
    },
    {
      name: "Rajdeep Chakraborty",
      role: "Full Stack Engineer",
      focus: "UI/UX & Interactive Systems",
      description: "Builds high-performance interactive interfaces, animated community feeds, and learning experiences that make complex protocol mechanics intuitive.",
      imageSrc: "/team/rajdeep.webp",
      status: "Core Dev",
      socials: [
        {
          label: "GitHub",
          href: "https://github.com/rajdeepchakraborty-rc",
          icon: <GithubIcon className="w-3.5 h-3.5" />,
        },
        {
          label: "LinkedIn",
          href: "https://www.linkedin.com/in/rajdeepchakraborty69/",
          icon: <LinkedInIcon className="w-3.5 h-3.5" />,
        },
      ],
    },
    {
      name: "Dhanush Naik",
      role: "Full Stack Engineer",
      focus: "Platform Systems & Analytics",
      description: "Architects the product analytics, storage layers, and backend infrastructure that turn complex protocol data into actionable student tooling.",
      imageSrc: "/team/Dhanush.webp",
      status: "Core Dev",
      socials: [
        {
          label: "GitHub",
          href: "https://github.com/dhanushlnaik",
          icon: <GithubIcon className="w-3.5 h-3.5" />,
        },
        {
          label: "LinkedIn",
          href: "https://www.linkedin.com/in/dhanushlnaik/",
          icon: <LinkedInIcon className="w-3.5 h-3.5" />,
        },
      ],
    },
    {
      name: "Yash Kamal Chaturvedi",
      role: "Operations Lead",
      focus: "Community Delivery & Partnerships",
      description: "Spearheads campus programs, hackathon operations, and cross-university coordination to bring developer workshops straight to students.",
      imageSrc: "/team/yash.webp",
      status: "Operations",
      socials: [
        {
          label: "LinkedIn",
          href: "https://www.linkedin.com/in/yash-kamal-chaturvedi/",
          icon: <LinkedInIcon className="w-3.5 h-3.5" />,
        },
      ],
    },
  ];

  const pillars = [
    {
      icon: Compass,
      title: "Our Mission",
      badge: "Purpose",
      badgeColor: "bg-[#075945] text-white",
      description: "Make Ethereum standards, EIPs, and client upgrades legible, transparent, and operationally accessible to student developers worldwide.",
    },
    {
      icon: BookOpen,
      title: "What We Teach",
      badge: "Curriculum",
      badgeColor: "bg-[#f8bd36] text-black",
      description: "From Ethereum fundamentals and EVM mechanics to consensus upgrades, live EIP proposal tracking, and core contributor review paths.",
    },
    {
      icon: Shield,
      title: "Built by Avarch",
      badge: "Roots",
      badgeColor: "bg-black text-white",
      description: "Crafted by Avarch with deep ecosystem collaboration alongside Ethereum researchers, client developers, and standards coordinators.",
    },
  ];

  const coreValues = [
    {
      icon: Shield,
      title: "Open Learning",
      subtitle: "100% Free Forever",
      description: "No paywalls, no gatekeeping. Protocol education should be universally accessible to anyone with curiosity and code.",
    },
    {
      icon: Terminal,
      title: "Learn by Doing",
      subtitle: "Hands-on First",
      description: "Concepts become tangible when learners write smart contracts, interact with testnets, and dissect actual EIP pull requests.",
    },
    {
      icon: Users,
      title: "Grassroots Community",
      subtitle: "Student-Led Chapters",
      description: "Peer mentorship on campus accelerates technical mastery faster than isolated study ever could.",
    },
    {
      icon: GitBranch,
      title: "Direct Contribution",
      subtitle: "Bridging to Core",
      description: "We don't stop at teaching syntax; we guide builders toward authoring ERCs, participating in ACD calls, and shipping open-source code.",
    },
  ];

  const capabilities = [
    {
      icon: Search,
      tag: "Structured Learning",
      title: "Step-by-Step EIP Pathways",
      description: "Guided modules that break down complex protocol standards — from ERC-20 and ERC-721 to account abstraction (ERC-4337) and blob transactions (EIP-4844).",
    },
    {
      icon: BarChart2,
      tag: "Interactive Verification",
      title: "Practical Labs & Knowledge Checks",
      description: "Validate your protocol understanding through interactive quizzes, contract sandbox challenges, and real-world deployment assignments.",
    },
    {
      icon: GitBranch,
      tag: "Contributor On-Ramp",
      title: "Live Governance Tracking & Sprints",
      description: "Stay ahead of Ethereum upgrades with normalized proposal status trackers, ACD summaries, and direct avenues to review active pull requests.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#fcfbf7] text-[#171a18] font-sans selection:bg-[#61d9b9] selection:text-black">
      <style dangerouslySetInnerHTML={{ __html: `@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&display=swap');` }} />
      
      {/* Navbar with dark backdrop */}
      <Navbar
        className="dark bg-background/90 backdrop-blur-xl border-b border-border"
        showThemeToggle={false}
      />

      <main className="mt-16 relative">

        {/* 1. HERO SECTION: Grand Masthead (LIGHT) */}
        <section className="relative bg-[#fcfbf7] text-[#171a18] pt-12 pb-32 sm:pt-20 sm:pb-40 overflow-hidden">
          {/* Subtle ambient lighting */}
          <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-[#075945]/10 blur-[160px]" />
          <div className="pointer-events-none absolute top-40 right-10 h-80 w-80 rounded-full bg-[#f8bd36]/10 blur-[150px]" />

          <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12 relative z-10">
            
            {/* Centered Masthead Header */}
            <div className="mx-auto max-w-4xl text-center">
              {/* Pulse Badge */}
              <div className="inline-flex items-center gap-2.5 rounded-full border border-[#075945]/20 bg-[#075945]/10 px-4 py-1.5 backdrop-blur-md mb-6 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#075945] opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#075945]" />
                </span>
                <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#075945]">
                  About ETHShala
                </span>
                <span className="text-[#333]/30 text-xs">·</span>
                <span className="text-[11px] font-semibold text-[#444]">
                  Open Ethereum Governance &amp; Education
                </span>
              </div>

              {/* Bold Headline */}
              <h1 className="font-sans text-[clamp(2.75rem,5.5vw,5rem)] font-black leading-[0.98] tracking-tight text-[#111]">
                Demystifying Ethereum protocol governance{' '}
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#075945] via-[#0e7955] to-[#d97706] mt-1">
                  for everyone.
                </span>
              </h1>

              {/* Subtitle */}
              <p className="mt-6 text-[17px] sm:text-[20px] font-medium leading-[1.5] text-[#333] max-w-2xl mx-auto">
                We build open-source educational pathways, governance movement trackers, and campus networks so builders, researchers, and newcomers can understand what is changing in Ethereum and why.
              </p>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <a
                  href="#why-we-built-this"
                  className="group inline-flex min-h-[50px] items-center gap-3 rounded-xl bg-[#0a1a16] px-7 text-[15px] font-black text-white transition-all hover:bg-[#15382f] hover:shadow-lg hover:shadow-[#0a1a16]/25 hover:-translate-y-0.5"
                >
                  Our Story &amp; Vision
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </a>
                <a
                  href="#team"
                  className="inline-flex min-h-[50px] items-center gap-2 rounded-xl border-2 border-[#e5e7eb] bg-white px-6 text-[15px] font-semibold text-[#111] transition-all hover:border-[#d1d5db] hover:bg-[#f9fafb]"
                >
                  Meet the Team
                </a>
              </div>
            </div>

            {/* 3 Pillar Cards Mosaic */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {pillars.map((pillar) => {
                const Icon = pillar.icon;
                return (
                  <article
                    key={pillar.title}
                    className="group relative flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-7 shadow-lg transition-all duration-300 hover:-translate-y-1.5 hover:border-[#075945]/40 hover:shadow-2xl hover:shadow-[#075945]/15"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-3 mb-5">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#075945]/10 text-[#075945] border border-[#075945]/20">
                          <Icon size={22} />
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${pillar.badgeColor} shadow-md`}>
                          {pillar.badge}
                        </span>
                      </div>
                      <h3 className="font-sans text-xl font-bold text-[#111] group-hover:text-[#075945] transition-colors leading-snug">
                        {pillar.title}
                      </h3>
                      <p className="mt-3 text-sm text-[#555] leading-relaxed">
                        {pillar.description}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Impact Metric Bar with GSAP animated counter */}
            <AboutHeroMetrics />

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

        {/* 2. THE PROBLEM & VISION SECTION (DARK) */}
        <section id="why-we-built-this" className="relative bg-[#0d1f1a] text-white pt-20 pb-32 sm:pt-28 sm:pb-40 overflow-hidden">
          <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12 relative z-10">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              
              {/* Left Column: Narrative */}
              <div className="lg:col-span-7">
                <div className="flex items-center gap-2 mb-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#075945]/40 text-[#61d9b9] border border-[#61d9b9]/30">
                    <Flame size={15} />
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#61d9b9]">
                    The Challenge
                  </span>
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#f8bd36]" />
                  <span
                    className="font-caveat text-[#f8bd36] text-[20px] font-bold transform -rotate-1 hidden sm:inline-block leading-none"
                    style={{ fontFamily: '"Caveat", cursive' }}
                  >
                    ~ bridge the institutional knowledge gap
                  </span>
                </div>

                <h2 className="font-sans text-[clamp(2.5rem,4.5vw,3.75rem)] font-black leading-[1.02] tracking-tight text-white">
                  Standards and governance shouldn't require institutional memory.
                </h2>

                <div className="mt-6 space-y-4 text-base sm:text-lg text-white/75 font-medium leading-relaxed">
                  <p>
                    Ethereum governance is decentralized and open, yet sprawling across repositories, AllCoreDevs transcripts, Discord channels, and review queues. For a newcomer or student builder, understanding the lifecycle of a protocol change can feel like decrypting an insider's handbook.
                  </p>
                  <p>
                    ETHShala was born to dismantle that barrier. We curate the moving parts, normalize the standards, and provide clear operational paths: what changed, why it matters, which proposals are active, and how aspiring engineers can participate.
                  </p>
                  <p>
                    Our goal is not just more documentation. Our goal is operational clarity so anyone can evolve from passive observer to active Ethereum protocol contributor.
                  </p>
                </div>

                <div className="mt-8 flex flex-wrap gap-4 pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2.5 text-xs font-semibold text-white/80">
                    <span className="h-2 w-2 rounded-full bg-[#61d9b9]" />
                    Zero Paywalls
                  </div>
                  <div className="flex items-center gap-2.5 text-xs font-semibold text-white/80">
                    <span className="h-2 w-2 rounded-full bg-[#ffd359]" />
                    Developer-First Curricula
                  </div>
                  <div className="flex items-center gap-2.5 text-xs font-semibold text-white/80">
                    <span className="h-2 w-2 rounded-full bg-[#61d9b9]" />
                    Real Campus Mentorship
                  </div>
                </div>
              </div>

              {/* Right Column: Interactive Flywheel Carousel */}
              <div className="lg:col-span-5">
                <ContributorFlywheel />
              </div>

            </div>

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

        {/* 3. PLATFORM CAPABILITIES SECTION (LIGHT) */}
        <section id="platform-capabilities" className="relative bg-[#fcfbf7] text-[#171a18] pt-20 pb-32 sm:pt-28 sm:pb-40 overflow-hidden">
          <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12 relative z-10">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-gray-200">
              <div className="max-w-2xl">
                <div className="flex items-center gap-2 mb-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#075945]/10 text-[#075945] border border-[#075945]/20">
                    <Laptop size={15} />
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#075945]">
                    Platform Features
                  </span>
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#f8bd36]" />
                  <span
                    className="font-caveat text-[#f8bd36] text-[20px] font-bold transform -rotate-1 hidden sm:inline-block leading-none"
                    style={{ fontFamily: '"Caveat", cursive' }}
                  >
                    ~ built for active builders
                  </span>
                </div>

                <h2 className="font-sans text-[clamp(2.5rem,4.5vw,3.75rem)] font-black leading-[1.02] tracking-tight text-[#111]">
                  Engineered for every stage of your Web3 journey.
                </h2>
              </div>
              <p className="max-w-md text-sm sm:text-base text-[#444] leading-relaxed font-medium">
                Whether mastering your first smart contract or analyzing live consensus upgrades, ETHShala gives you direct, uncompromised developer tools.
              </p>
            </div>

            {/* 3 Column Capabilities Grid */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {capabilities.map((item) => {
                const Icon = item.icon;
                return (
                  <article
                    key={item.title}
                    className="group relative flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-7 sm:p-8 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:border-[#075945]/40 hover:shadow-2xl hover:shadow-[#075945]/15"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#075945]/10 text-[#075945] border border-[#075945]/20 group-hover:border-[#075945]/40 transition-colors">
                          <Icon size={22} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-[#d97706] px-2.5 py-1 rounded-md bg-[#f8bd36]/15 border border-[#f8bd36]/40">
                          {item.tag}
                        </span>
                      </div>
                      <h3 className="font-sans text-xl font-bold text-[#111] group-hover:text-[#075945] transition-colors leading-snug">
                        {item.title}
                      </h3>
                      <p className="mt-3 text-sm text-[#555] leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-1.5 text-xs font-bold text-[#075945]">
                      <span>Explore feature</span>
                      <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                    </div>
                  </article>
                );
              })}
            </div>

          </div>

          {/* Organic wavy transition into dark section */}
          <svg 
            className="absolute bottom-0 left-0 w-full h-[60px] md:h-[110px] text-[#0a1a16] translate-y-[1px] pointer-events-none" 
            viewBox="0 0 1440 120" 
            fill="currentColor" 
            preserveAspectRatio="none"
          >
            <path d="M0,80 C480,-40 960,200 1440,80 L1440,120 L0,120 Z" />
          </svg>
        </section>

        {/* 4. TEAM SECTION: The Core Builders (DARK) */}
        <section id="team" className="relative bg-[#0a1a16] text-white pt-20 pb-32 sm:pt-28 sm:pb-40 overflow-hidden">
          <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12 relative z-10">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-white/10">
              <div className="max-w-2xl">
                <div className="flex items-center gap-2 mb-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#075945]/40 text-[#61d9b9] border border-[#61d9b9]/30">
                    <Award size={15} />
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#61d9b9]">
                    The Team
                  </span>
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#f8bd36]" />
                  <span
                    className="font-caveat text-[#f8bd36] text-[20px] font-bold transform -rotate-1 hidden sm:inline-block leading-none"
                    style={{ fontFamily: '"Caveat", cursive' }}
                  >
                    ~ built by builders, for the ecosystem
                  </span>
                </div>

                <h2 className="font-sans text-[clamp(2.5rem,4.5vw,3.75rem)] font-black leading-[1.02] tracking-tight text-white">
                  A compact team working across strategy, engineering, and delivery.
                </h2>
              </div>
              <p className="max-w-md text-sm sm:text-base text-white/70 leading-relaxed font-medium">
                We are not a bloated organization. ETHShala is designed and maintained by a tight-knit group with distinct domain focus and deep commitment to open-source developer empowerment.
              </p>
            </div>

            {/* Team Grid */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {teamMembers.map((member) => (
                <TeamCard
                  key={member.name}
                  name={member.name}
                  role={member.role}
                  focus={member.focus}
                  description={member.description}
                  imageSrc={member.imageSrc}
                  status={member.status}
                  socials={member.socials}
                />
              ))}
            </div>

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

        {/* 5. GUIDING PRINCIPLES & VALUES SECTION (LIGHT) */}
        <section id="values" className="relative bg-[#fcfbf7] text-[#171a18] pt-20 pb-32 sm:pt-28 sm:pb-40 overflow-hidden">
          <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12 relative z-10">
            
            {/* Values Header */}
            <div className="text-center max-w-2xl mx-auto mb-14">
              <div className="inline-flex items-center gap-2 mb-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#075945]/10 text-[#075945] border border-[#075945]/20">
                  <Shield size={13} />
                </span>
                <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#075945]">
                  Guiding Principles
                </span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#f8bd36]" />
                <span
                  className="font-caveat text-[#f8bd36] text-[19px] font-bold transform -rotate-1 hidden sm:inline-block leading-none"
                  style={{ fontFamily: '"Caveat", cursive' }}
                >
                  ~ how we build &amp; teach
                </span>
              </div>

              <h2 className="font-sans text-[clamp(2.5rem,4.5vw,3.75rem)] font-black leading-[1.02] tracking-tight text-[#111]">
                Learning should lead to building and contributing.
              </h2>
              <p className="mt-4 text-[#555] text-base leading-relaxed">
                Our principles define how we teach, how we coordinate campus workshops, and how we build our software.
              </p>
            </div>

            {/* 4 Values Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {coreValues.map((val) => {
                const Icon = val.icon;
                return (
                  <div
                    key={val.title}
                    className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1.5 hover:border-[#075945]/40 hover:shadow-xl flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#075945]/10 text-[#075945] border border-[#075945]/20 mb-5 group-hover:border-[#075945]/40 transition-colors">
                        <Icon size={22} />
                      </div>
                      <h4 className="font-sans text-lg font-bold text-[#111] group-hover:text-[#075945] transition-colors">
                        {val.title}
                      </h4>
                      <p className="text-[11px] font-semibold text-[#d97706] mt-0.5">
                        {val.subtitle}
                      </p>
                      <p className="mt-3 text-xs sm:text-sm text-[#555] leading-relaxed">
                        {val.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

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

        {/* 6. ECOSYSTEM COLLABORATION & PARTNERS SECTION (DARK) */}
        <section id="partners" className="relative bg-[#0d1f1a] text-white pt-20 pb-32 sm:pt-28 sm:pb-40 overflow-hidden">
          <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12 relative z-10">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-white/10">
              <div className="max-w-2xl">
                <div className="flex items-center gap-2 mb-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#075945]/40 text-[#61d9b9] border border-[#61d9b9]/30">
                    <Users size={15} />
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#61d9b9]">
                    Ecosystem Collaboration
                  </span>
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#f8bd36]" />
                  <span
                    className="font-caveat text-[#f8bd36] text-[20px] font-bold transform -rotate-1 hidden sm:inline-block leading-none"
                    style={{ fontFamily: '"Caveat", cursive' }}
                  >
                    ~ working together for builders
                  </span>
                </div>

                <h2 className="font-sans text-[clamp(2.5rem,4.5vw,3.75rem)] font-black leading-[1.02] tracking-tight text-white">
                  Working alongside ecosystem operators.
                </h2>
              </div>
              <p className="max-w-md text-sm sm:text-base text-white/70 leading-relaxed font-medium">
                From protocol research desks to active university builder chapters, our partners help amplify free, accessible Ethereum education.
              </p>
            </div>

            {/* 3 Partner Cards on Dark Theme */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {/* EtherWorld */}
              <div className="group rounded-2xl border border-white/10 bg-[#0a1a15]/80 p-7 shadow-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-[#61d9b9]/40 hover:bg-[#0e241e]">
                <Link target="_blank" href="https://etherworld.co/" className="block">
                  <div className="relative h-16 w-36 bg-white/10 rounded-xl border border-white/15 p-2 group-hover:border-[#61d9b9]/40 transition-colors flex items-center justify-center overflow-hidden mb-5">
                    <Image
                      src="/brand/partners/EtherWorld-horizontal-dark.png"
                      alt="EtherWorld Logo"
                      width={120}
                      height={40}
                      className="object-contain invert brightness-200"
                    />
                  </div>
                  <h4 className="font-sans text-lg font-bold text-white group-hover:text-[#61d9b9] transition-colors flex items-center gap-1.5">
                    EtherWorld
                    <ExternalLink size={14} className="text-white/50" />
                  </h4>
                  <p className="text-xs sm:text-sm text-white/70 mt-2 leading-relaxed">
                    Media &amp; ecosystem amplification. Research insights into consensus upgrades, EIP roadmaps, and AllCoreDevs coverage.
                  </p>
                </Link>
              </div>

              {/* Hooghly Engineering */}
              <div className="group rounded-2xl border border-white/10 bg-[#0a1a15]/80 p-7 shadow-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-[#61d9b9]/40 hover:bg-[#0e241e]">
                <Link target="_blank" href="https://www.hetc.ac.in/" className="block">
                  <div className="relative h-16 w-16 bg-white/10 rounded-xl border border-white/15 p-2 group-hover:border-[#61d9b9]/40 transition-colors flex items-center justify-center overflow-hidden mb-5">
                    <Image
                      src="/brand/partners/hetc.png"
                      alt="HETC Logo"
                      width={48}
                      height={48}
                      className="object-contain"
                    />
                  </div>
                  <h4 className="font-sans text-lg font-bold text-white group-hover:text-[#61d9b9] transition-colors flex items-center gap-1.5">
                    HETC Chapter
                    <ExternalLink size={14} className="text-white/50" />
                  </h4>
                  <p className="text-xs sm:text-sm text-white/70 mt-2 leading-relaxed">
                    Active student builder hub. Conducted our debut offline hands-on bootcamp with 25+ developers deploying live smart contracts.
                  </p>
                </Link>
              </div>

              {/* MCKV Institute */}
              <div className="group rounded-2xl border border-white/10 bg-[#0a1a15]/80 p-7 shadow-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-[#61d9b9]/40 hover:bg-[#0e241e]">
                <Link target="_blank" href="https://www.mckvie.edu.in/" className="block">
                  <div className="relative h-16 w-16 bg-white/10 rounded-xl border border-white/15 p-2 group-hover:border-[#61d9b9]/40 transition-colors flex items-center justify-center overflow-hidden mb-5">
                    <Image
                      src="/brand/partners/mckvie.jpg"
                      alt="MCKVIE Logo"
                      width={48}
                      height={48}
                      className="object-contain rounded-lg"
                    />
                  </div>
                  <h4 className="font-sans text-lg font-bold text-white group-hover:text-[#61d9b9] transition-colors flex items-center gap-1.5">
                    MCKV Institute
                    <ExternalLink size={14} className="text-white/50" />
                  </h4>
                  <p className="text-xs sm:text-sm text-white/70 mt-2 leading-relaxed">
                    Smart contracts &amp; dev sessions. Hands-on Web3 workshops and EVM architecture deep dives with 40+ engineering students.
                  </p>
                </Link>
              </div>
            </div>

          </div>

          {/* Organic wavy transition into light section */}
          <svg 
            className="absolute bottom-0 left-0 w-full h-[60px] md:h-[110px] text-[#fdfdfc] translate-y-[1px] pointer-events-none" 
            viewBox="0 0 1440 120" 
            fill="currentColor" 
            preserveAspectRatio="none"
          >
            <path d="M0,0 C480,120 960,-40 1440,60 L1440,120 L0,120 Z" />
          </svg>
        </section>

        {/* 7. JOIN THE MOVEMENT & PLATFORM TRANSPARENCY SECTION (LIGHT WITH GRID) */}
        <section id="get-involved" className="relative bg-[#fdfdfc] text-[#111] pt-20 pb-36 sm:pt-28 sm:pb-48 overflow-hidden">
          {/* Subtle grid background matching Home page partner section */}
          <div 
            className="absolute inset-0 opacity-[0.05] pointer-events-none" 
            style={{ 
              backgroundImage: 'linear-gradient(#0e7955 1px, transparent 1px), linear-gradient(90deg, #0e7955 1px, transparent 1px)', 
              backgroundSize: '40px 40px' 
            }} 
          />

          <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12 relative z-10">
            
            {/* Big Action Callout Card */}
            <div className="rounded-3xl border border-[#075945]/20 bg-gradient-to-r from-[#075945]/10 via-white to-white p-8 sm:p-14 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden">
              <div className="relative z-10 max-w-2xl">
                <span className="inline-flex items-center gap-2 rounded-lg bg-[#ffd359] px-3 py-1 text-[11px] font-black uppercase tracking-wider text-black mb-4 shadow-sm">
                  <Sparkles size={13} />
                  Join the Movement
                </span>
                <h2 className="font-sans text-3xl sm:text-5xl font-black text-[#111] leading-tight">
                  Support the platform, contribute feedback, or build with us.
                </h2>
                <p className="mt-4 text-base sm:text-lg text-[#444] leading-relaxed font-medium">
                  ETHShala is a public good resource for the global Ethereum ecosystem. Whether submitting code, hosting a campus session, or reviewing new EIP modules, your voice matters.
                </p>
                
                {/* Action Buttons */}
                <div className="mt-8 flex flex-wrap gap-3.5">
                  <Link
                    href="/community#campus-network"
                    className="inline-flex min-h-[48px] items-center gap-2.5 rounded-xl bg-[#0a1a16] px-6 text-sm font-black text-white hover:bg-[#15382f] hover:shadow-lg transition-all"
                  >
                    Bring ETHShala to Your Campus
                    <ArrowRight size={16} />
                  </Link>

                  <Link target="_blank" href="https://github.com/AvarchLLC/eips-bootcamp">
                    <button className="flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl bg-white border border-gray-300 text-[#111] hover:border-[#075945] hover:text-[#075945] transition-all shadow-sm">
                      <GithubIcon className="w-4 h-4" />
                      GitHub Repo
                    </button>
                  </Link>

                  <Link target="_blank" href="https://discord.com/invite/tUXgfV822C">
                    <button className="flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl bg-white border border-gray-300 text-[#111] hover:border-[#075945] hover:text-[#075945] transition-all shadow-sm">
                      <DiscordIcon className="w-4 h-4" />
                      Discord
                    </button>
                  </Link>
                </div>
              </div>

              {/* Quick Contact Box on Right */}
              <div className="relative z-10 w-full lg:w-auto shrink-0 flex flex-col gap-4">
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-md max-w-sm">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-[#075945] mb-1">Direct Inquiries</p>
                  <h4 className="font-sans text-base font-bold text-[#111]">Host a Campus Workshop</h4>
                  <p className="text-xs text-[#555] mt-1 leading-relaxed">
                    Free hands-on workshops, bounties, and guest sessions for your college or club.
                  </p>
                  <a
                    href="mailto:contact@ethshala.com"
                    className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-[#075945] hover:underline"
                  >
                    <Mail size={14} />
                    contact@ethshala.com
                    <ArrowRight size={13} />
                  </a>
                </div>
              </div>
            </div>

            {/* Legal & Platform Transparency Footnotes */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#075945] mb-2">Policy &amp; Standards</p>
                <h4 className="font-sans text-lg font-bold text-[#111] mb-2">Platform Transparency</h4>
                <p className="text-xs text-[#555] leading-relaxed mb-4">
                  We believe in explicit privacy and educational integrity. Your account data, quiz telemetry, and platform usage remain secure and transparent.
                </p>
                <div className="flex gap-3">
                  <button className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200 text-[#333] hover:border-[#075945] hover:text-[#075945] transition-all">
                    Privacy Policy <ArrowRight size={12} />
                  </button>
                  <button className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200 text-[#333] hover:border-[#075945] hover:text-[#075945] transition-all">
                    Terms of Service <ArrowRight size={12} />
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#d97706] mb-2">Direct Contact</p>
                <h4 className="font-sans text-lg font-bold text-[#111] mb-2">Reach the Core Team</h4>
                <p className="text-xs text-[#555] leading-relaxed mb-4">
                  For university chapter inquiries, research collaboration, grant support, or speaking engagements, reach out directly.
                </p>
                <a
                  href="mailto:contact@ethshala.com"
                  className="inline-flex items-center gap-2 text-sm font-bold text-[#075945] hover:underline"
                >
                  <Mail size={15} />
                  contact@ethshala.com
                  <ArrowRight size={14} />
                </a>
              </div>
            </div>

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
