// apps/web/app/components/community/SocialSection.tsx

'use client';

import React, { useState } from 'react';
import { Megaphone, ArrowUpRight, Image as ImageIcon } from 'lucide-react';
import { featuredPosts as socialPosts, SocialPlatform } from '../../lib/social-posts';

const platformUrls: Record<SocialPlatform, string> = {
  Twitter: 'https://x.com/Its_EthShala',
  LinkedIn: 'https://www.linkedin.com/company/ethshala/',
};

const TwitterIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const LinkedinIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

export function SocialSection() {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <div
      className="relative w-full"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={(e) => {
        if (e.currentTarget.contains(e.target as Node)) {
          setIsPaused(true);
        }
      }}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setIsPaused(false);
        }
      }}
    >
      {/* Background glow */}
      <div className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-[#075945]/10 blur-[140px]" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-[#f8bd36]/10 blur-[140px]" />

      {/* Header */}
      <div className="relative z-10 mx-auto mb-14 max-w-2xl text-center">
        <div className="mb-3 flex items-center justify-center gap-2 text-[11px] font-bold uppercase tracking-[0.25em] text-[#075945]">
          <Megaphone size={14} className="text-[#075945]" />
          <span>The latest buzz</span>
        </div>
        <h2 className="font-sans text-[clamp(2rem,3.8vw,3rem)] font-black leading-[1.05] tracking-tight text-[#111]">
          Our latest{' '}
          <span className="relative inline-block text-[#075945]">
            posts
            <svg
              aria-hidden="true"
              viewBox="0 0 120 16"
              className="absolute -bottom-2.5 left-0 w-full overflow-visible"
              fill="none"
            >
              <path
                d="M3 11C28 4 69 3 117 7"
                stroke="#f8bd36"
                strokeLinecap="round"
                strokeWidth="4"
              />
            </svg>
          </span>
          {' '}&amp; news
        </h2>
        <p
          className="font-caveat mt-3 text-[#f8bd36] text-[20px] sm:text-[22px] font-bold leading-none"
          style={{ fontFamily: '"Caveat", cursive' }}
        >
          ~ updates &amp; student stories straight from the road
        </p>
      </div>

      {/* Marquee Track */}
      <div className="relative z-10">
        <div className="social-posts-viewport overflow-hidden pb-4">
          <div className={`social-posts-track${isPaused ? ' is-paused' : ''}`}>
            {[false, true].map((isDuplicate) => (
              <div key={String(isDuplicate)} className="flex shrink-0 gap-6 pr-6" aria-hidden={isDuplicate}>
                {socialPosts.map((post, index) => (
                  <article
                    key={`${post.date}-${post.platform}-${isDuplicate}`}
                    aria-roledescription="slide"
                    aria-label={`${index + 1} of ${socialPosts.length}`}
                    className="group flex w-[min(82vw,280px)] shrink-0 flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg transition-all duration-300 hover:-translate-y-1.5 hover:border-[#075945]/40 hover:shadow-2xl hover:shadow-[#075945]/15"
                  >
                    {/* Post Image Banner */}
                    <div className="relative aspect-[1.65/1] overflow-hidden bg-gray-100">
                      {post.image ? (
                        <img
                          src={post.image}
                          alt=""
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-[#075945]/40">
                          <ImageIcon size={28} aria-hidden="true" />
                        </div>
                      )}
                      
                      {/* Platform badge */}
                      <div className="absolute top-2.5 right-2.5 rounded-lg bg-black/75 border border-white/20 p-1.5 text-white backdrop-blur-md shadow-md">
                        {post.platform === 'Twitter' ? <TwitterIcon size={14} /> : <LinkedinIcon size={14} />}
                      </div>
                    </div>

                    {/* Post Content */}
                    <div className="flex flex-1 flex-col p-5 justify-between">
                      <div>
                        <div className="mb-3 flex items-center gap-2">
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#075945]/20 bg-[#075945]/10 p-1">
                            <img src="/brand/ethshala_logo.svg" alt="EthShala" className="h-full w-full object-contain" />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-xs font-bold text-[#111]">ETHShala</p>
                            <p className="text-[10px] text-[#666]">{post.date}</p>
                          </div>
                        </div>

                        <h4 className="font-sans text-sm font-bold text-[#111] line-clamp-2 leading-snug group-hover:text-[#075945] transition-colors">
                          {post.headline}
                        </h4>

                        <p className="mt-2 text-xs text-[#555] line-clamp-3 leading-relaxed">
                          {post.title}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-[#075945]">
                        <span>Read on {post.platform}</span>
                        <a
                          href={post.href || platformUrls[post.platform]}
                          target="_blank"
                          rel="noopener noreferrer"
                          tabIndex={isDuplicate ? -1 : undefined}
                          className="p-1 rounded-md bg-gray-100 hover:bg-[#075945] hover:text-white transition-colors"
                          aria-label={`Open post on ${post.platform}`}
                        >
                          <ArrowUpRight size={14} />
                        </a>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Edge Fade Masks for Smooth In/Out Flow */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-[#fcfbf7] to-transparent z-20" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-[#fcfbf7] to-transparent z-20" />
      </div>
    </div>
  );
}