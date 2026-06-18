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
    const link = `${window.location.origin}/apply?ref=${referralCode}`;
    if (navigator.share) {
      navigator.share({ title: 'Join ETHShala', url: link }).catch(() => handleCopy());
    } else {
      navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Card className="flex flex-col h-full !p-5 bg-gradient-to-br from-slate-100/90 via-slate-200/70 to-slate-300/50
      dark:from-slate-800/80 dark:via-slate-900/60 dark:to-slate-900/40">
      <div className="mb-4">
        <h3 className="text-foreground font-bold text-base">Your Referral Code</h3>
        <p className="text-muted-foreground text-xs mt-0.5">Share your code and earn XP</p>
      </div>

      {/* Referral code input */}
      <div className="flex items-center gap-2 mb-5">
        <div className="flex-1 bg-background/60 border border-emerald-500/25 rounded-lg px-4 py-2.5 flex items-center">
          <span className="text-emerald-400 font-bold text-sm font-mono tracking-widest">
            {referralCode}
          </span>
        </div>
        <Button
          variant="secondary"
          size="icon"
          onClick={handleCopy}
          className="p-2.5 h-auto w-auto"
        >
          {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
        </Button>
      </div>

      {/* Stats row */}
      <div className="flex gap-4 mb-5">
        <div className="flex-1 bg-background/30 border border-border rounded-xl p-3.5">
          <p className="text-muted-foreground text-[10px] uppercase tracking-wider font-medium mb-1.5">Total Referrals</p>
          <p className="text-foreground font-black text-2xl leading-none">{referralsCount}</p>
          <p className="text-emerald-400 text-xs mt-1 font-medium">+0 this week</p>
        </div>
        <div className="flex-1 bg-background/30 border border-border rounded-xl p-3.5 relative overflow-hidden">
          <p className="text-muted-foreground text-[10px] uppercase tracking-wider font-medium mb-1.5">XP Earned</p>
          <p className="text-foreground font-black text-2xl leading-none">{xp.toLocaleString()}</p>
          <p className="text-muted-foreground text-xs mt-1">from referrals</p>
          {/* Coin stack placeholder */}
          <div className="absolute right-2 bottom-1 opacity-40">
            <svg viewBox="0 0 40 40" className="w-10 h-10 text-emerald-500">
              <ellipse cx="20" cy="32" rx="14" ry="5" fill="currentColor" opacity="0.4" />
              <ellipse cx="20" cy="28" rx="14" ry="5" fill="currentColor" opacity="0.6" />
              <ellipse cx="20" cy="24" rx="14" ry="5" fill="currentColor" opacity="0.8" />
              <ellipse cx="20" cy="20" rx="14" ry="5" fill="currentColor" />
              <text x="20" y="22" textAnchor="middle" fill="#000" fontSize="6" fontWeight="800">XP</text>
            </svg>
          </div>
        </div>
      </div>

      {/* Share CTA */}
      <Button 
        onClick={handleShare}
        className="w-full mt-auto"
        rightIcon={<Share2 size={15} className="group-hover:rotate-12 transition-transform" />}
      >
        {copied ? "Link Copied!" : "Share Referral Link"}
      </Button>
    </Card>
  );
}

export default ReferralCard;
