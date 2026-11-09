'use client';

import { useState } from 'react';
import { Copy, Check, Share2 } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

type ReferralCardProps = {
  referralsCount: number;
  xp: number;
  referralCode: string;
};

export function ReferralCard({ referralsCount, xp, referralCode }: ReferralCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    const link = `${window.location.origin}/ref/${referralCode}`;
    if (navigator.share) {
      navigator.share({ title: 'Join ETHShala', url: link }).catch(() => handleCopy());
    } else {
      navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col h-full p-5 sm:p-6 bg-white/85 backdrop-blur-md border border-[#075945]/15 rounded-2xl shadow-xs hover:border-[#075945]/30 transition-all">
      <div className="mb-4">
        <h3 className="text-[#171a18] font-bold text-base">Your Referral Code</h3>
        <p className="text-[#6b7280] text-xs mt-0.5">Share your code and earn XP</p>
      </div>

      {/* Referral code input */}
      <div className="flex items-center gap-2 mb-5">
        <div className="flex-1 bg-[#075945]/5 border border-[#075945]/20 rounded-xl px-4 py-2.5 flex items-center">
          <span className="text-[#075945] font-bold text-sm font-mono tracking-widest">
            {referralCode}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="p-2.5 rounded-xl bg-white border border-[#075945]/20 hover:bg-[#075945]/10 text-[#075945] transition-colors"
          title="Copy referral code"
        >
          {copied ? <Check size={16} className="text-[#075945]" /> : <Copy size={16} />}
        </button>
      </div>

      {/* Stats row */}
      <div className="flex gap-3 mb-5">
        <div className="flex-1 bg-[#075945]/5 border border-[#075945]/10 rounded-xl p-3.5">
          <p className="text-[#6b7280] text-[10px] uppercase tracking-wider font-bold mb-1.5">Total Referrals</p>
          <p className="text-[#171a18] font-black text-2xl leading-none">{referralsCount}</p>
          <p className="text-[#075945] text-xs mt-1 font-semibold">+0 this week</p>
        </div>
        <div className="flex-1 bg-[#075945]/5 border border-[#075945]/10 rounded-xl p-3.5 relative overflow-hidden">
          <p className="text-[#6b7280] text-[10px] uppercase tracking-wider font-bold mb-1.5">XP Earned</p>
          <p className="text-[#171a18] font-black text-2xl leading-none">{xp.toLocaleString()}</p>
          <p className="text-[#6b7280] text-xs mt-1">from referrals</p>
          {/* Coin stack placeholder */}
          <div className="absolute right-2 bottom-1 opacity-20 pointer-events-none">
            <svg viewBox="0 0 40 40" className="w-10 h-10 text-[#075945]">
              <ellipse cx="20" cy="32" rx="14" ry="5" fill="currentColor" opacity="0.4" />
              <ellipse cx="20" cy="28" rx="14" ry="5" fill="currentColor" opacity="0.6" />
              <ellipse cx="20" cy="24" rx="14" ry="5" fill="currentColor" opacity="0.8" />
              <ellipse cx="20" cy="20" rx="14" ry="5" fill="currentColor" />
              <text x="20" y="22" textAnchor="middle" fill="#fff" fontSize="6" fontWeight="800">XP</text>
            </svg>
          </div>
        </div>
      </div>

      {/* Share CTA */}
      <button 
        onClick={handleShare}
        className="w-full mt-auto bg-[#075945] hover:bg-[#064e3b] text-white font-bold text-sm py-2.5 px-4 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 group"
      >
        <span>{copied ? "Link Copied!" : "Share Referral Link"}</span>
        <Share2 size={15} className="group-hover:rotate-12 transition-transform" />
      </button>
    </div>
  );
}

export default ReferralCard;
