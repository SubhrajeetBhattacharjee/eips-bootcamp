'use client';

import Image from "next/image";
import Link from "next/link";
import React, { useRef } from "react";
import { GithubIcon, LinkedInIcon } from "@/app/components/about/social_icons";
import { gsap } from "gsap";

const iconMap = {
  github: <GithubIcon className="w-3 h-3" />,
  linkedin: <LinkedInIcon className="w-3 h-3" />,
};

type SocialLink = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

type TeamCardProps = {
  name: string;
  role: string;
  focus: string;
  description: string;
  imageSrc: string;
  status?: string;
  socials?: SocialLink[];
};

export default function TeamCard({
  name,
  role,
  focus,
  description,
  imageSrc,
  status = "Active",
  socials = [],
}: TeamCardProps) {
  const cardRef = useRef<HTMLElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;

    gsap.to(cardRef.current, {
      rotateX,
      rotateY,
      transformPerspective: 1000,
      duration: 0.3,
      ease: 'power1.out',
    });
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.5,
      ease: 'power2.out',
    });
  };

  return (
    <article
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative flex flex-col sm:flex-row gap-5 rounded-2xl border border-white/10 bg-[#0a1a15]/80 p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-[#61d9b9]/50 hover:shadow-2xl hover:shadow-[#075945]/30 will-change-transform"
    >
      {/* Avatar Container with Gradient Border */}
      <div className="relative shrink-0">
        <div className="relative h-20 w-20 overflow-hidden rounded-2xl border-2 border-white/15 bg-black/40 shadow-lg group-hover:border-[#61d9b9]/60 transition-colors">
          <Image
            src={imageSrc}
            alt={name}
            fill
            sizes="80px"
            loading="lazy"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <span className="absolute -bottom-1.5 -right-1.5 inline-flex items-center gap-1 rounded-full border border-white/20 bg-[#075945] px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-[#61d9b9] shadow-md">
          <span className="h-1.5 w-1.5 rounded-full bg-[#61d9b9] animate-pulse" />
          {status}
        </span>
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-baseline justify-between gap-2 flex-wrap mb-1">
            <h4 className="font-sans text-lg font-bold text-white group-hover:text-[#61d9b9] transition-colors">
              {name}
            </h4>
            <span className="text-[11px] font-semibold text-[#ffd359]">
              {role}
            </span>
          </div>

          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 mb-2.5">
            {focus}
          </p>

          <p className="text-xs sm:text-sm text-white/70 leading-relaxed line-clamp-3">
            {description}
          </p>
        </div>

        {/* Socials Row */}
        {socials.length > 0 && (
          <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap gap-2">
            {socials.map((social, index) => (
              <Link
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-semibold text-white/70 hover:bg-[#61d9b9] hover:text-black hover:border-[#61d9b9] transition-all"
                title={social.label}
              >
                {social.icon}
                <span className="text-[11px]">{social.label}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}