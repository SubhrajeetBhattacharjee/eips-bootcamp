'use client';

import Link from 'next/link';
import { footerLinks } from '../../lib/landing-data';
import { Heart, Globe } from 'lucide-react';

import Image from 'next/image';

export function Footer() {
  return (
    <footer className="bg-[#050505] border-t border-white/5 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          
          {/* Column 1: Brand & Info */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              {/* Processed Hex Crystal Image */}
              <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 relative drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                <Image src="/brand-logo.png" alt="EIPsInsight Logo" fill className="object-contain" />
              </div>
              <div className="text-white font-bold text-xl tracking-tight">
                EIPsInsight Bootcamp
              </div>
            </div>
            
            <p className="text-zinc-400 text-sm flex items-center gap-1.5 mb-8">
              Build With <Heart size={14} className="text-emerald-500 fill-emerald-500/20" /> by Avarch
            </p>
            
            <div>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">JOIN US:</p>
              <div className="inline-flex items-center justify-center px-3 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold">
                v4.1
              </div>
            </div>
          </div>

          {/* Column 2: Links */}
          <div>
            <h4 className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-5">LINKS</h4>
            <ul className="space-y-3.5">
              {footerLinks.important.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-zinc-300 text-sm hover:text-emerald-400 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Follow Us */}
          <div>
            <h4 className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-5">FOLLOW US</h4>
            <ul className="space-y-3.5">
              {footerLinks.followUs.map((l) => {
                return (
                  <li key={l.label}>
                    <Link href={l.href} className="text-zinc-300 text-sm hover:text-emerald-400 transition-colors flex items-center gap-2">
                      {l.label === 'YouTube' && (
                        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
                      )}
                      {l.label === 'LinkedIn' && (
                        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                      )}
                      {l.label === 'X' && (
                        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                      )}
                      {l.label === 'EtherWorld' && (
                        <Globe size={16} />
                      )}
                      {l.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

        </div>
      </div>
    </footer>
  );
}

export default Footer;
