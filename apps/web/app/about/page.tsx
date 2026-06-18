import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about the mission, the team, and the story behind EthShala - your gateway to mastering Ethereum Improvement Proposals.",
};

import { Navbar } from '../components/landing/Navbar';
import { Footer } from '../components/landing/Footer';
import TeamCard from '../components/about/TeamCard';
import { Logo } from '../components/ui/Logo';
import Image from 'next/image';
import Link from 'next/link';
import { Search, BarChart2, GitBranch, FileText, Shield, Activity, Globe, MessageSquare, Heart, Mail, ExternalLink, ArrowRight } from 'lucide-react';

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" {...props}>
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);

const LinkedInIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" {...props}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const DiscordIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" {...props}>
    <path d="M20.317 4.369A19.791 19.791 0 0 0 15.885 3c-.191.328-.403.768-.553 1.11a18.27 18.27 0 0 0-5.29 0A11.64 11.64 0 0 0 9.49 3a19.736 19.736 0 0 0-4.435 1.371C2.249 8.57 1.484 12.663 1.866 16.699a19.9 19.9 0 0 0 5.993 3.028c.48-.654.908-1.346 1.276-2.07a12.93 12.93 0 0 1-2.008-.964c.169-.124.334-.253.494-.386 3.874 1.82 8.08 1.82 11.908 0 .162.133.327.262.496.386a12.89 12.89 0 0 1-2.011.965c.368.723.796 1.415 1.276 2.068a19.86 19.86 0 0 0 5.996-3.028c.448-4.678-.765-8.734-3.969-12.329ZM8.02 14.247c-1.182 0-2.151-1.085-2.151-2.419 0-1.333.95-2.418 2.151-2.418 1.211 0 2.17 1.094 2.151 2.418 0 1.334-.95 2.419-2.151 2.419Zm7.96 0c-1.182 0-2.151-1.085-2.151-2.419 0-1.333.95-2.418 2.151-2.418 1.211 0 2.17 1.094 2.151 2.418 0 1.334-.94 2.419-2.151 2.419Z" />
  </svg>
);

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="mt-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 pb-24">
        
        {/* Header Block */}
        <div className="p-8 md:p-12 rounded-3xl bg-muted/20 border border-border">
          <div className="inline-block px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-widest uppercase mb-6">
            About
          </div>
          <h1 className="text-4xl md:text-5xl font-grotesk font-medium mb-6 leading-tight">
            EthShala makes Ethereum protocol governance accessible to everyone.
          </h1>
          <p className="text-lg text-muted-foreground mb-12 max-w-3xl">
            We build an educational platform, structured pathways, and governance movement trackers so builders, researchers, and newcomers can understand what is changing and why.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-muted/40 border border-border">
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Mission</h3>
              <p className="text-sm">Make Ethereum standards and governance legible, explorable, and operationally useful for newcomers.</p>
            </div>
            <div className="p-6 rounded-2xl bg-muted/40 border border-border">
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">What We Teach</h3>
              <p className="text-sm">Ethereum fundamentals, EIPs, governance workflows, protocol research, and contributor paths.</p>
            </div>
            <div className="p-6 rounded-2xl bg-muted/40 border border-border">
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Built By</h3>
              <p className="text-sm">Avarch with support from the Ethereum ecosystem and partners close to standards operations.</p>
            </div>
          </div>
        </div>

        {/* Why / How Split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Why We Built This</h3>
            <h2 className="text-3xl font-grotesk font-medium mb-6">
              Standards and governance should not require institutional memory to follow.
            </h2>
            <div className="space-y-4 text-muted-foreground text-sm">
              <p>Ethereum governance happens across repositories, pull requests, review queues, forum threads, upgrades, and informal coordination. The data is public, but the workflow is still hard to inspect as a system.</p>
              <p>EthShala exists to reduce that gap. We curate the moving parts, normalize them into structured education, and help people answer practical questions: what changed, what is stuck, who is active, what upgrade work depends on what, and where to go next.</p>
              <p>The goal is not just more documentation. The goal is operational clarity for anyone trying to understand or participate in Ethereum standards.</p>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-muted/20 border border-border space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-6">How People Use It</h3>
            
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-muted/40 border border-border flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Search className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-1">Structured Learning</h4>
                  <p className="text-xs text-muted-foreground">Follow curated modules from fundamentals to advanced protocol research instead of manual repository digging.</p>
                </div>
              </div>
              <div className="p-5 rounded-2xl bg-muted/40 border border-border flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <BarChart2 className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-1">Progress Tracking</h4>
                  <p className="text-xs text-muted-foreground">Track your learning journey, earn XP, and measure your readiness to contribute.</p>
                </div>
              </div>
              <div className="p-5 rounded-2xl bg-muted/40 border border-border flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <GitBranch className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-1">Contributor Tooling</h4>
                  <p className="text-xs text-muted-foreground">Transition from reading governance to working with it through hands-on assignments.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="p-8 md:p-12 rounded-3xl bg-muted/20 border border-border">
          <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Team</h3>
          <h2 className="text-3xl font-grotesk font-medium mb-4">
            A compact team working across strategy, operations, engineering, and product systems.
          </h2>
          <p className="text-sm text-muted-foreground mb-12">
            We are not a giant organization. The product is shaped by a small group with distinct responsibilities, which is exactly why role clarity matters here.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Placeholder 1 */}
            <TeamCard
              name="Pooja Ranjan"
              role="Founder"
              focus="Ecosystem strategy"
              description="Shapes the long-range direction of EthShala and keeps the work anchored to Ethereum governance needs."
              imageSrc="/team/pooja_ranjan.jpg"
              socials={[
                {
                  label: "GitHub",
                  href: "https://github.com/poojaranjan",
                  icon: <GithubIcon className="w-3 h-3" />,
                },
                {
                  label: "LinkedIn",
                  href: "https://www.linkedin.com/in/pooja-r-072899114/",
                  icon: <LinkedInIcon className="w-3 h-3" />,
                },
              ]}
            />

            {/* Placeholder 2 */}
            <TeamCard
              name="Yash Kamal Chaturvedi"
              role="Operations Lead"
              focus="Operations and delivery"
              description="Keeps programs, coordination, and day-to-day execution moving across research, platform work, and partnerships."
              imageSrc="/team/yash.jpg"
              socials={[
                {
                  label: "LinkedIn",
                  href: "https://www.linkedin.com/in/yash-kamal-chaturvedi/",
                  icon: <LinkedInIcon className="w-3 h-3" />,
                },
              ]}
            />
            
            {/* Placeholder 3 */}
            <TeamCard
              name="Dhanush Naik"
              role="Full Stack Engineer"
              focus="Platform engineering"
              description="Builds the product surface, analytics experience, and internal systems that turn raw governance data into usable tooling."
              imageSrc="/team/Dhanush.jpg"
              socials={[
                {
                  label: "GitHub",
                  href: "https://github.com/dhanushlnaik",
                  icon: <GithubIcon className="w-3 h-3" />,
                },
                {
                  label: "LinkedIn",
                  href: "https://www.linkedin.com/in/dhanushlnaik/",
                  icon: <LinkedInIcon className="w-3 h-3" />,
                },
              ]}
            />

            {/* Placeholder 4 */}
            <TeamCard
              name="Subhrajeet Bhattacharjee"
              role="Full Stack Intern"
              focus="Full stack implementation"
              description="Contributes across frontend and backend work to support feature delivery and improve the platform experience."
              imageSrc="/team/SubhrajeetBhattacharjee.webp"
              socials={[
                {
                  label: "GitHub",
                  href: "https://github.com/SubhrajeetBhattacharjee",
                  icon: <GithubIcon className="w-3 h-3" />,
                },
                {
                  label: "LinkedIn",
                  href: "https://www.linkedin.com/in/subhrajeet-bhattacharjee/",
                  icon: <LinkedInIcon className="w-3 h-3" />,
                },
              ]}
            />

            {/* Placeholder 5 */}
            <TeamCard
              name="Rajdeep Chakraborty"
              role="Full Stack Intern"
              focus="Full stack implementation"
              description="Contributes across frontend and backend work to support feature delivery and improve the platform experience."
              imageSrc="/team/rajdeep.jpg"
              socials={[
                {
                  label: "GitHub",
                  href: "https://github.com/rajdeepchakraborty-rc",
                  icon: <GithubIcon className="w-3 h-3" />,
                },
                {
                  label: "LinkedIn",
                  href: "https://www.linkedin.com/in/rajdeepchakraborty69/",
                  icon: <LinkedInIcon className="w-3 h-3" />,
                },
              ]}
            />
          </div>
        </div>

        {/* Values Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="p-8 rounded-3xl bg-muted/20 border border-border">
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Values</h3>
            <h2 className="text-3xl font-grotesk font-medium mb-8">The product is opinionated about clarity.</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-muted/40 border border-border">
                <Shield className="w-5 h-5 text-primary mb-3" />
                <h4 className="font-bold text-sm mb-2">Transparency</h4>
                <p className="text-xs text-muted-foreground">Data should be inspectable, explainable, and tied back to real public sources.</p>
              </div>
              <div className="p-5 rounded-2xl bg-muted/40 border border-border">
                <Activity className="w-5 h-5 text-primary mb-3" />
                <h4 className="font-bold text-sm mb-2">Operational clarity</h4>
                <p className="text-xs text-muted-foreground">Tooling should help people decide and act, not just display information.</p>
              </div>
              <div className="p-5 rounded-2xl bg-muted/40 border border-border">
                <Globe className="w-5 h-5 text-primary mb-3" />
                <h4 className="font-bold text-sm mb-2">Accessibility</h4>
                <p className="text-xs text-muted-foreground">The platform has to work for newcomers, builders, and researchers without flattening complexity.</p>
              </div>
              <div className="p-5 rounded-2xl bg-muted/40 border border-border">
                <GitBranch className="w-5 h-5 text-primary mb-3" />
                <h4 className="font-bold text-sm mb-2">Iteration</h4>
                <p className="text-xs text-muted-foreground">We ship, evaluate, and refine quickly so the product stays aligned with how governance behaves.</p>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-muted/20 border border-border flex flex-col justify-center">
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-8">What the platform offers</h3>
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-border flex gap-4 items-center">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Search className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h4 className="text-sm font-bold">Search and proposal context</h4>
                  <p className="text-xs text-muted-foreground">Find proposals, statuses, authors without jumping across sources.</p>
                </div>
              </div>
              <div className="p-4 rounded-xl border border-border flex gap-4 items-center">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <BarChart2 className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h4 className="text-sm font-bold">Dashboards and analytics</h4>
                  <p className="text-xs text-muted-foreground">Read standards activity through structured analytics views.</p>
                </div>
              </div>
              <div className="p-4 rounded-xl border border-border flex gap-4 items-center">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h4 className="text-sm font-bold">Tooling for active work</h4>
                  <p className="text-xs text-muted-foreground">Use builders, boards, trackers, and graphs when moving from reading to doing.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-8 rounded-3xl bg-muted/20 border border-border">
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Support</h3>
            <h2 className="text-2xl font-grotesk font-medium mb-6">Backed by grants, community support, and ecosystem collaboration.</h2>
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-muted/40 border border-border">
                <h4 className="font-bold text-sm mb-2">Ecosystem Support Program (EF ESP)</h4>
                <p className="text-xs text-muted-foreground mb-3">Funds help maintain data pipelines, improve analytics, and keep EthShala open-source.</p>
                <div className="flex gap-2">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-primary/20 text-primary">Significant</span>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border border-border">Infrastructure</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-muted/20 border border-border">
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Partners</h3>
            <h2 className="text-2xl font-grotesk font-medium mb-6">Working alongside ecosystem operators.</h2>
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-muted/40 border border-border hover:border-primary/40">
                <Link className="flex items-center gap-6" href="https://etherworld.co/">
                <div className="w-16 h-16 rounded-full bg-muted border border-border shrink-0 overflow-hidden relative">
                <Image
                  src="/brand/partners/ew.png"
                  alt="Profile"
                  fill
                  className="object-cover"
                />
                </div>
                <div>
                  <h4 className="font-bold text-sm mb-1">EtherWorld</h4>
                  <p className="text-xs text-muted-foreground">Media and ecosystem amplification.</p>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground" />
                </Link>
              </div>
              <div className="p-5 rounded-2xl bg-muted/40 border border-border hover:border-primary/40">
                <Link className="flex items-center gap-6" target="_blank" href="https://www.ethcatherders.com/">
                <div className="w-16 h-16 rounded-full bg-muted border border-border shrink-0 overflow-hidden relative">
                <Image
                  src="/brand/partners/ech.png"
                  alt="Profile"
                  fill
                  className="object-cover"
                />
                </div>
                <div>
                  <h4 className="font-bold text-sm mb-1">ECH (Ethereum Cat Herders)</h4>
                  <p className="text-xs text-muted-foreground">Operational support around standards.</p>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA Block */}
        <div className="p-8 md:p-12 rounded-3xl bg-muted/20 border border-border">
          <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Get Involved</h3>
          <h2 className="text-2xl font-grotesk font-medium mb-4">Support the platform, contribute feedback, or build on top of the work.</h2>
          <p className="text-sm text-muted-foreground mb-8 max-w-2xl">
            EthShala is a community resource. If you want to help, the best paths are straightforward: use it, critique it, contribute to it, or support the infrastructure behind it.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link target="_blank" href="https://github.com/AvarchLLC/eips-bootcamp">
            <button className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl border border-border hover:bg-muted transition-colors"><GithubIcon className="w-4 h-4"/> GitHub</button>
            </Link>
            <Link target="_blank" href="https://discord.com/invite/tUXgfV822C">
            <button className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl border border-border hover:bg-muted transition-colors"><DiscordIcon className="w-4 h-4"/> Discord</button>
            </Link>
            <Link target="_blank" href="/">
            <button className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl border border-border hover:bg-muted transition-colors"><Heart className="w-4 h-4"/> Donate</button>
            </Link>
            <Link target="_blank" href="mailto:dev@avarch.com">
            <button className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl border border-border hover:bg-muted transition-colors"><Mail className="w-4 h-4"/> Contact</button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-8 rounded-3xl bg-muted/20 border border-border">
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Policy</h3>
            <h2 className="text-xl font-grotesk font-medium mb-4">Legal and privacy</h2>
            <p className="text-xs text-muted-foreground mb-6">We keep the legal and privacy layer explicit. Use these documents when you need the operational details behind account, data, and platform usage.</p>
            <div className="flex gap-4">
              <button className="flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors">Privacy Policy <ArrowRight className="w-3 h-3"/></button>
              <button className="flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-lg border border-border hover:bg-muted transition-colors">Terms of Service <ArrowRight className="w-3 h-3"/></button>
            </div>
          </div>
          <div className="p-8 rounded-3xl bg-muted/20 border border-border">
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Contact</h3>
            <h2 className="text-xl font-grotesk font-medium mb-4">Reach the team</h2>
            <p className="text-xs text-muted-foreground mb-6">For collaboration, platform questions, or product feedback, contact us directly.</p>
            <div className="p-4 rounded-xl border border-border bg-muted/30">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Email</p>
              <a href="mailto:dev@avarch.com" className="text-sm font-medium text-primary hover:underline flex items-center gap-2">dev@avarch.com <ArrowRight className="w-3 h-3"/></a>
            </div>
          </div>
        </div>

      </main>
      <Footer />
    </div>
  );
}
