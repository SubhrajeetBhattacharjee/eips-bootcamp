'use client';

import {
  MessageSquare,
  Users,
  Radio,
  Sparkles,
} from 'lucide-react';

const communities = [
  {
    icon: MessageSquare,
    title: 'Discuss',
    desc: 'Join conversations around proposals and protocol evolution.',
  },
  {
    icon: Users,
    title: 'Connect',
    desc: 'Meet builders, researchers, and curious learners.',
  },
  {
    icon: Radio,
    title: 'Follow',
    desc: 'Track calls, updates, and ecosystem conversations.',
  },
  {
    icon: Sparkles,
    title: 'Contribute',
    desc: 'Turn understanding into meaningful participation.',
  },
];

export function CommunitySection() {
  return (
    <section
      id="community"
      className="py-24 bg-background"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center max-w-3xl mx-auto">

          <p className="text-emerald-400 text-sm font-semibold tracking-wide mb-3">
            Community
          </p>

          <h2 className="text-foreground text-3xl sm:text-5xl font-black leading-tight">
            Ethereum grows through people
          </h2>

          <p className="text-muted-foreground mt-4">
            Learn publicly. Share ideas. Join discussions.
            Community participation turns knowledge into impact.
          </p>

        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mt-14">

          {communities.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="
                  rounded-2xl
                  border
                  border-border
                  bg-card
                  p-6
                  hover:border-emerald-500/30
                  transition-all
                "
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-5">
                  <Icon size={20} />
                </div>

                <h3 className="font-bold text-foreground">
                  {item.title}
                </h3>

                <p className="text-sm text-muted-foreground mt-2">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}

        <div className="mt-16 rounded-2xl border border-emerald-500/20 bg-card px-8 py-10 text-center">

          <h3 className="text-foreground text-2xl font-black">
            Your next contribution starts with one conversation
          </h3>

          <p className="text-muted-foreground mt-3">
            Explore discussions, attend calls, and keep learning.
          </p>

          <button className="mt-6 px-6 py-3 rounded-xl bg-emerald-500 text-black font-bold hover:bg-emerald-400 transition">
            Join the Community
          </button>

        </div>

      </div>
    </section>
  );
}