'use client';

import React from 'react';
import Link from 'next/link';
import { LuArrowRight, LuQuote, LuTarget, LuShieldCheck, LuTrendingUp, LuGlobe, LuAward } from 'react-icons/lu';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function MessageFromFounderPage() {
    const { scrollYProgress } = useScroll();
    const y = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);

    const values = [
        {
            title: "Unyielding Trust",
            icon: LuShieldCheck,
            desc: "Trust is the foundation of our network. We ensure transparency in every transaction, lead, and partnership.",
            color: "from-blue-500 to-cyan-500"
        },
        {
            title: "Global Opportunity",
            icon: LuGlobe,
            desc: "Skill should not be constrained by geography. We build bridges for exceptional talent to reach international markets.",
            color: "from-violet-500 to-fuchsia-500"
        },
        {
            title: "Continuous Growth",
            icon: LuTrendingUp,
            desc: "We prioritize the professional and financial growth of every affiliate, partner, and talent in our ecosystem.",
            color: "from-amber-500 to-orange-500"
        }
    ];

    return (
        <div className="min-h-screen flex flex-col font-sans selection:bg-accent/20 bg-background overflow-hidden">
            <main className="flex-1 relative z-10">

                {/* Dynamic Backgrounds */}
                <div className="fixed inset-0 pointer-events-none -z-10">
                    <div className="absolute top-[-10%] left-[-10%] w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-blue-500/10 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] bg-violet-500/10 rounded-full blur-[120px]" />
                    <div className="absolute top-[40%] left-[60%] w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] bg-amber-500/5 rounded-full blur-[100px]" />
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] mix-blend-overlay" />
                </div>

                {/* HERO SECTION */}
                <section className="relative pt-[120px] pb-16 sm:pt-[140px] sm:pb-20 md:pt-[200px] md:pb-32 border-b border-border/40 overflow-hidden">
                    <motion.div style={{ y }} className="absolute inset-0 -z-10 bg-gradient-to-b from-secondary/50 to-transparent" />

                    <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center relative z-10">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        >
                            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-border/50 bg-card/50 backdrop-blur-md mb-6 sm:mb-8">
                                <LuAward className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent" />
                                <span className="text-[10px] sm:text-xs font-bold tracking-[0.2em] text-foreground uppercase">
                                    Leadership Vision
                                </span>
                            </div>

                            <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-black leading-[1.1] text-foreground tracking-tight mb-4 sm:mb-8">
                                The Vision Behind <br className="hidden sm:block" />
                                <span className="bg-gradient-to-r from-blue-600 via-violet-600 to-indigo-600 bg-clip-text text-transparent">Think Tank</span>
                            </h1>

                            <p className="mt-4 sm:mt-6 text-muted-foreground max-w-3xl mx-auto text-base sm:text-xl md:text-2xl font-medium leading-relaxed px-2">
                                Connecting exceptional talent with limitless global opportunities through an ecosystem built on trust, skill, and sheer ambition.
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* CONTENT & LETTER */}
                <section className="max-w-[1400px] mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-24 grid grid-cols-1 lg:grid-cols-[380px_1fr] xl:grid-cols-[400px_1fr] gap-8 sm:gap-10 lg:gap-20 relative z-10">

                    {/* Founder Card — full-width on mobile, sticky sidebar on desktop */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="lg:sticky lg:top-32">
                            <div className="rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden border border-border/60 shadow-2xl bg-card group relative max-w-sm mx-auto lg:max-w-none">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 z-10 transition-opacity group-hover:opacity-80" />

                                <div className="aspect-[3/4] relative overflow-hidden bg-secondary">
                                    <img
                                        src="/images/team/Pradip_Timsina.jpg"
                                        alt="Pradip Timsina - Founder & Executive Director"
                                        loading="eager"
                                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-1000 ease-out"
                                        onError={(e) => {
                                            e.target.src = "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop";
                                        }}
                                    />
                                </div>

                                <div className="absolute bottom-0 left-0 w-full p-5 sm:p-8 z-20">
                                    <h3 className="text-2xl sm:text-3xl font-black text-white mb-2 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                                        Pradip Timsina
                                    </h3>
                                    <div className="h-1 w-12 bg-accent mb-3 sm:mb-4 transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" />
                                    <p className="text-xs sm:text-sm font-bold text-white/80 uppercase tracking-widest">
                                        Founder & Executive Director
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 sm:mt-8 p-5 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] border border-border/50 bg-card shadow-lg text-base sm:text-lg text-foreground/80 font-medium leading-relaxed italic relative max-w-sm mx-auto lg:max-w-none">
                                <LuQuote className="absolute top-3 sm:top-4 left-3 sm:left-4 w-6 h-6 sm:w-8 sm:h-8 text-accent/20" />
                                <p className="relative z-10 pt-3 sm:pt-4 px-2 sm:px-4 text-center">
                                    &quot;Our platform isn&apos;t just about services; it&apos;s about elevating potential and redefining what&apos;s possible.&quot;
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Letter Body Container */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="space-y-12 sm:space-y-16 md:space-y-20"
                    >
                        {/* Authentic Paper Letter Effect */}
                        <div
                            className="bg-[#fcfaf7] border border-[#e5e5e5] rounded-sm p-5 sm:p-8 md:p-12 lg:p-16 xl:p-20 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] relative overflow-hidden"
                            style={{
                                backgroundImage: "linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px)",
                                backgroundSize: "2rem 2rem"
                            }}
                        >
                            {/* Notebook Left Margin Line — hidden on mobile for cleaner look */}
                            <div className="absolute top-0 bottom-0 left-6 sm:left-8 md:left-12 w-0.5 bg-red-500/20 z-0 hidden sm:block" />
                            <div className="absolute top-0 bottom-0 left-[1.75rem] sm:left-[2.25rem] md:left-[3.25rem] w-px bg-red-500/10 z-0 hidden sm:block" />

                            <div className="absolute -top-10 -right-10 opacity-[0.03] pointer-events-none">
                                <LuQuote className="w-32 sm:w-64 h-32 sm:h-64 text-[#2c2c2c]" />
                            </div>

                            <div className="relative z-10 sm:pl-6 md:pl-10">
                                <h2 className="text-2xl sm:text-3xl md:text-5xl font-black mb-6 sm:mb-8 md:mb-12 text-[#2c2c2c] tracking-tight border-b border-[#2c2c2c]/10 pb-4 sm:pb-6 md:pb-8 font-serif">
                                    A Letter to the Future Achievers
                                </h2>

                                <div className="prose prose-base sm:prose-lg md:prose-xl max-w-none text-[#4a4a4a] font-serif leading-[2rem] sm:leading-[2.5rem] text-justify">
                                    <p className="text-sm sm:text-lg md:text-2xl font-bold mb-4 sm:mb-6 md:mb-8">
                                        Dear Freelancers, Dreamers, Professionals, and Partners,
                                    </p>

                                    <p className="mb-4 sm:mb-6 md:mb-8">
                                        When I conceptualized Think Tank Freelancing Hub, the core idea was remarkably simple yet profoundly ambitious: <strong>To bridge exceptional talent with real global opportunity.</strong> We realized early on that brilliant minds exist everywhere, but the infrastructure to connect those minds with the right opportunities was fundamentally lacking.
                                    </p>

                                    <p className="mb-4 sm:mb-6 md:mb-8">
                                        We believe that skill, not geography, should dictate success. The world has shifted towards a digital-first economy, and those equipped with the right expertise deserve a platform that champions their capabilities without limits.
                                    </p>

                                    <div className="my-8 sm:my-12 md:my-16 border-l-4 border-accent pl-5 sm:pl-8 md:pl-10 py-4 sm:py-6 bg-accent/5 rounded-r-2xl sm:rounded-r-3xl shadow-sm relative overflow-hidden">
                                        <div className="absolute right-0 top-0 w-16 sm:w-32 h-full bg-gradient-to-l from-accent/10 to-transparent pointer-events-none" />
                                        <p className="text-lg sm:text-2xl md:text-3xl font-semibold text-[#1a1a1a] italic m-0 leading-snug">
                                            &quot;We are not merely offering services; we are engineering an ecosystem where dedication translates directly into prosperity.&quot;
                                        </p>
                                    </div>

                                    <p className="mb-4 sm:mb-6 md:mb-8">
                                        From developers engineering complex systems to designers crafting stunning interfaces, from academic consultants to real estate specialists—we have built an infrastructure that empowers individuals to build meaningful, scalable, and highly lucrative careers.
                                    </p>

                                    <p className="mb-6 sm:mb-8 md:mb-12">
                                        To every affiliate, partner, and talent currently in our network: Every project you close, every lead you verify, and every success you achieve brings us one step closer to our ultimate vision. Thank you for believing in the power of this network. The journey has only just begun.
                                    </p>
                                </div>

                                {/* Sign-off */}
                                <div className="mt-8 sm:mt-12 md:mt-16 pt-6 sm:pt-8 md:pt-12 border-t border-[#2c2c2c]/10 flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-8">
                                    <div className="text-center sm:text-left">
                                        <p className="text-lg sm:text-xl font-medium text-[#4a4a4a] mb-2 font-serif">Sincerely,</p>
                                        <p className="text-2xl sm:text-3xl md:text-4xl font-black text-[#1a1a1a] font-signature">Pradip Timsina</p>
                                    </div>

                                    <div className="text-center sm:text-right">
                                        <p className="text-xl sm:text-2xl font-black text-[#1a1a1a] mb-1">
                                            Think Tank
                                        </p>
                                        <p className="text-xs sm:text-sm font-bold text-accent uppercase tracking-widest">
                                            Freelancing Hub
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Core Values Grid (moved outside paper) */}
                        <div>
                            <h3 className="text-2xl sm:text-3xl font-black text-foreground mb-8 sm:mb-12 text-center">The Pillars of Think Tank</h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                                {values.map((val, idx) => (
                                    <motion.div
                                        key={idx}
                                        whileHover={{ y: -10 }}
                                        className="bg-card border border-border/50 rounded-2xl sm:rounded-3xl p-5 sm:p-8 relative overflow-hidden group shadow-sm"
                                    >
                                        <div className={`absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-gradient-to-bl ${val.color} opacity-10 rounded-bl-full transition-transform group-hover:scale-150`} />
                                        <div className={`w-12 sm:w-14 h-12 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br ${val.color} text-white flex items-center justify-center mb-4 sm:mb-6 shadow-lg`}>
                                            <val.icon className="w-6 sm:w-7 h-6 sm:h-7" />
                                        </div>
                                        <h4 className="text-lg sm:text-xl font-black text-foreground mb-2 sm:mb-4">{val.title}</h4>
                                        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{val.desc}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                </section>

                {/* Global Vision Section */}
                <section className="py-16 sm:py-24 md:py-32 bg-foreground text-background relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 mix-blend-overlay" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] sm:w-[800px] md:w-[1000px] h-[500px] sm:h-[800px] md:h-[1000px] bg-accent/20 rounded-full blur-[150px] pointer-events-none" />

                    <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10 text-center">
                        <LuTarget className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 text-accent mx-auto mb-4 sm:mb-6 md:mb-8" />
                        <h2 className="text-2xl sm:text-4xl md:text-6xl font-black text-white mb-4 sm:mb-6 md:mb-8 tracking-tight">
                            Our Vision for the Next Decade
                        </h2>
                        <p className="text-base sm:text-xl md:text-2xl text-white/70 mb-8 sm:mb-10 md:mb-12 leading-relaxed max-w-3xl mx-auto px-2">
                            To become the most trusted, lucrative, and comprehensive freelancing and service fulfillment network in Asia, empowering over 100,000 independent professionals to achieve financial freedom.
                        </p>
                        <Link href="/register">
                            <button className="h-12 sm:h-14 md:h-16 px-6 sm:px-8 md:px-10 rounded-full bg-accent text-white font-black text-sm sm:text-base md:text-lg shadow-[0_0_40px_rgba(37,99,235,0.4)] hover:shadow-[0_0_60px_rgba(37,99,235,0.6)] hover:scale-105 transition-all">
                                Join The Movement
                            </button>
                        </Link>
                    </div>
                </section>

            </main>

        </div>
    );
}