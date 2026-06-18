import { Users } from "lucide-react";
import type { ReferralActivity as ReferralActivityType } from "../../lib/referrals";

export default function ReferralActivity({ activities }: { activities?: ReferralActivityType[] }) {
  const hasActivity = activities && activities.length > 0;

  return (
    <div className="p-6 bg-accent/40 rounded-xl border border-border">
      <h3 className="text-base font-bold text-foreground mb-4">Recent Referral Activity</h3>
      
      {hasActivity ? (
        <ul className="space-y-4">
          {activities.slice(0, 6).map((a) => (
            <li key={a.id} className="flex items-center justify-between bg-background/40 p-3 rounded-lg border border-border/50 hover:border-emerald-500/30 transition-colors">
              <div>
                <div className="font-bold text-sm">{a.name}</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{a.timestamp}</div>
              </div>
              <div className="text-emerald-400 font-bold">+{a.xpEarned} XP</div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="py-8 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-full bg-background/60 flex items-center justify-center mb-3 border border-border/50">
            <Users size={20} className="text-muted-foreground" />
          </div>
          <h4 className="text-sm font-bold text-foreground mb-1">No activity yet</h4>
          <p className="text-xs text-muted-foreground max-w-[200px]">
            Once your friends join using your link, their activity will appear here.
          </p>
        </div>
      )}
    </div>
  );
}
