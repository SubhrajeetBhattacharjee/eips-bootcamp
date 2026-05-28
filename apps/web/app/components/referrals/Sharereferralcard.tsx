import type { ReferralStats } from "../../lib/referrals";

export default function ShareReferralCard({ stats }: { stats?: ReferralStats }) {
  const code = stats?.referralCode ?? "—";
  return (
    <div className="p-4 bg-zinc-900 rounded-md border border-zinc-800">
      <h3 className="text-sm font-medium text-gray-200">Share your referral</h3>
      <p className="text-xs text-gray-400 mt-2">Your code: <span className="font-mono bg-zinc-800 px-2 py-1 rounded">{code}</span></p>
      <div className="mt-3">
        <button className="px-3 py-1 bg-emerald-600 text-black rounded">Copy code</button>
      </div>
    </div>
  );
}
