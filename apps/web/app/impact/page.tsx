// apps/web/app/community/page.tsx

'use client';

import { Navbar } from '../components/landing/Navbar';
import { Footer } from '../components/landing/Footer';
import { CommunityHero } from '../components/impact/CommunityHero';
import { EventsSection } from '../components/impact/EventsSection';
import { MediaSection } from '../components/impact/MediaSection';
import { SocialSection } from '../components/impact/SocialSection';
import { EventImageShowcase } from '../components/impact/EventImageShowcase';
import { CampusNetworkSection } from '../components/impact/CampusNetworkSection';
import { ArrowDownRight, Globe, Users } from 'lucide-react';

export default function CommunityPage() {

    return (
        <div className="min-h-screen overflow-hidden bg-background text-foreground">
            <Navbar />
            <main className="relative mx-auto max-w-7xl px-4 pt-24 pb-24 sm:px-6 lg:px-8">
            <div className="pointer-events-none absolute -right-40 top-24 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />
            <div className="pointer-events-none absolute left-0 top-[34rem] h-80 w-80 rounded-full bg-cyan-400/5 blur-3xl" />
            <div className="relative space-y-20">
                {/* ===== HERO SECTION ===== */}
                <section className="pt-8">
                    <CommunityHero />
                </section>

                {/* Decorative divider */}
                <div className="flex items-center gap-4 text-xs uppercase tracking-[0.24em] text-emerald-400/70"><span className="h-px flex-1 bg-emerald-400/20" /><span>Explore the network</span><ArrowDownRight size={14} /><span className="h-px flex-1 bg-emerald-400/20" /></div>

                {/* ===== COMMUNITY ACTIVITIES SECTION ===== */}
                <section className="relative">
                    <div className="mb-8 max-w-xl">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-lg bg-emerald-500/20 border border-emerald-500/30">
                                <Users size={20} className="text-emerald-400" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold tracking-tight text-foreground">Community activities</h2>
                                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Events, media coverage, and social impact from the people moving Ethereum forward.</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-1">
                        {/* Events Section */}
                        <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="relative">
                                <EventsSection />
                            </div>
                        </div>

                        {/* Media Section */}
                        {/* <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="relative">
                                <MediaSection />
                            </div>
                        </div> */}

                        {/* Social Section */}
                        <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="relative">
                                <SocialSection />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Decorative divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />

                {/* ===== EVENT IMAGE SHOWCASE ===== */}
                <EventImageShowcase />

                <div className="h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />

                {/* ===== CAMPUS NETWORK SECTION ===== */}
                <section className="relative">
                    <div className="mb-8 max-w-xl">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-lg bg-emerald-500/20 border border-emerald-500/30">
                                <Globe size={20} className="text-emerald-400" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold tracking-tight text-foreground">Campus network</h2>
                                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">The colleges, clubs, and partners turning curiosity into practical contribution.</p>
                            </div>
                        </div>
                    </div>

                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="relative">
                            <CampusNetworkSection />
                        </div>
                    </div>
                </section>

                {/* Decorative divider */}
                {/* <div className="h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" /> */}

                {/* Bottom spacing */}
                {/* <div className="h-8" /> */}
            </div>

            </main>
            <Footer />
        </div>
    );
}