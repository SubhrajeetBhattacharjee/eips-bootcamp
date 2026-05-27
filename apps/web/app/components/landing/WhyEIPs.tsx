import React from 'react';
import { whyCards } from '../../lib/landing-data';
import { Layers, Shield, Activity, Globe } from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  layers: <Layers size={20} className="text-emerald-400" />,
  shield: <Shield size={20} className="text-emerald-400" />,
  activity: <Activity size={20} className="text-emerald-400" />,
  globe: <Globe size={20} className="text-emerald-400" />,
};

export function WhyEIPs() {
  return (
    <section id="eips" className="py-20 bg-[#070707]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-2xl">
          <p className="text-emerald-400 text-sm font-semibold mb-3 tracking-wide">Why EIPs</p>
          <h2 className="text-white font-black text-3xl sm:text-4xl leading-tight">Why Ethereum evolves through proposals</h2>
          <p className="text-zinc-500 mt-3">Understanding how proposals drive protocol change is essential to participating meaningfully in Ethereum’s future.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {whyCards.map((card) => (
            <div
              key={card.id}
              className="relative bg-[#0d0d0d] border border-white/6 rounded-2xl p-6 shadow-[0_6px_30px_rgba(2,6,4,0.6)] hover:shadow-[0_8px_40px_rgba(16,185,129,0.06)] transition-shadow duration-300"
            >
              <div className="absolute -top-4 right-4 w-20 h-20 rounded-full bg-emerald-500/6 border border-emerald-500/10 blur-md pointer-events-none" />

              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  {iconMap[card.icon]}
                </div>
                <div>
                  <h3 className="text-white font-bold text-base leading-tight">{card.title}</h3>
                  <p className="text-zinc-500 text-sm mt-2">{card.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhyEIPs;
