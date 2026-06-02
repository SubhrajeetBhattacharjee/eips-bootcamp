'use client';

import Link from 'next/link';
import { footerLinks } from '../../lib/landing-data';
import { useSession } from '@/app/lib/auth-client';

export function Footer() {
  const { data: session } = useSession();
  const isSignedIn = !!session?.user;

  return (
    <footer className="bg-[#050505] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-emerald-400" fill="currentColor"><polygon points="12,2 20,8 20,16 12,22 4,16 4,8" opacity="0.25" /><polygon points="12,2 20,8 12,12" /><polygon points="4,8 12,12 12,22" opacity="0.6" /><polygon points="20,8 12,12 12,22" opacity="0.85" /></svg>
              </div>
              <div>
                <div className="text-white font-bold">EIPsInsight</div>
                <div className="text-emerald-400 text-xs font-semibold">Bootcamp</div>
              </div>
            </div>
            <p className="text-zinc-500 text-sm mt-4 max-w-sm">Premium education for people who want to understand how Ethereum evolves and how to participate.</p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="text-zinc-300 font-semibold mb-3">Platform</h4>
              <ul className="space-y-2">
                {footerLinks.platform.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-zinc-400 text-sm hover:text-white">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-zinc-300 font-semibold mb-3">Company</h4>
              <ul className="space-y-2">
                {footerLinks.company.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-zinc-400 text-sm hover:text-white">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <h4 className="text-zinc-300 font-semibold mb-3">Get started</h4>
            <div className="flex items-center gap-3">
              <Link
                href={isSignedIn ? '/dashboard' : '/sign-up'}
                className="bg-emerald-500 text-black font-semibold px-4 py-2 rounded-lg"
              >
                {isSignedIn ? 'Go to Dashboard' : 'Create Account'}
              </Link>
              <Link href="/sign-in" className="text-zinc-400 text-sm">Sign In</Link>
            </div>
            <div className="text-zinc-500 text-xs mt-6">© {new Date().getFullYear()} EIPsInsight — All rights reserved.</div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
