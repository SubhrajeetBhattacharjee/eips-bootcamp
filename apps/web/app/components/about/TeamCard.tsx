import Image from "next/image";
import Link from "next/link";
import React from "react";
import { GithubIcon, LinkedInIcon } from "@/app/components/about/social_icons";

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
  return (
    <div className="p-4 sm:p-6 rounded-2xl bg-muted/40 border border-border hover:border-primary/40 flex flex-col sm:flex-row gap-4 sm:gap-6">
      
      {/* Avatar */}
      <div className="w-16 h-16 rounded-full bg-muted border border-border shrink-0 overflow-hidden relative">
        <Image
          src={imageSrc}
          alt={name}
          fill
          className="object-cover"
        />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-1 flex-wrap">
          <h4 className="font-bold break-words">{name}</h4>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-muted border border-border">
            {status}
          </span>
        </div>

        <p className="text-primary text-sm font-medium mb-3">
          {role}
        </p>

        <h5 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
          {focus}
        </h5>

        <p className="text-xs text-muted-foreground mb-4 break-words">
          {description}
        </p>

        {/* Socials */}
        {socials.length > 0 && (
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {socials.map((social) => (
              <Link key={social.href} href={social.href}>
                <button className="flex items-center gap-2 text-xs font-medium px-2 sm:px-3 py-1.5 rounded-lg border border-border hover:border-primary/40 hover:bg-primary/10 hover:text-primary transition-colors whitespace-nowrap">
                  {social.icon}
                  {social.label}
                </button>
              </Link>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}