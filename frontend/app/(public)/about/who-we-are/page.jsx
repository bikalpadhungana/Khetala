'use client';

import React from 'react';
import { LuTarget, LuEye, LuHeart, LuShieldCheck, LuUsers, LuZap } from 'react-icons/lu';

export default function WhoWeArePage() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <main className="flex-1 bg-gray-50/50 dark:bg-background pt-16 pb-20">

        {/* About Section */}
        <div className="max-w-7xl mx-auto px-6 mb-24 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About <span className="text-[#0452a3]">Think Tank</span> <span className="text-[#003882]">Freelancing</span> <span className="text-[#2d9c22]">Hub</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-10 text-justify font-medium">
              <strong className="text-navy-900 dark:text-black ">Think Tank Freelancing Hub</strong> is Nepal’s premier multi-service platform. We aim to empower independent professionals by providing an enterprise-grade infrastructure to monetize their networks. By blending deep technical expertise with strategic insights, we deliver innovative solutions designed to drive growth, efficiency, and transformation for businesses and freelancers alike.
            </p>

            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="mt-1">
                  <LuTarget className="w-6 h-6 text-success" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-accent mb-2">Our Mission</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    To connect people and businesses with opportunities, solutions, and success.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="mt-1">
                  <LuEye className="w-6 h-6 text-success" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-accent mb-2">Our Vision</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    To become a trusted global hub for freelancing and professional services.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="mt-1">
                  <LuTarget className="w-6 h-6 text-success" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-accent mb-2">Our Goals</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    To empower individuals, support businesses, and create sustainable growth through innovation and collaboration.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="bg-white dark:bg-card rounded-3xl p-6 shadow-2xl border border-border">
              {/* Using a placeholder or workflow image for visual matching */}
              <img src="/images/workflow/workflow_step_1_1781200091892.png" alt="About Think Tank" className="w-full h-auto rounded-2xl object-cover mix-blend-multiply dark:mix-blend-normal opacity-90" />
            </div>
            {/* Decorative Elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-success/10 rounded-full blur-2xl -z-10" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-accent/10 rounded-full blur-2xl -z-10" />
          </div>
        </div>

        {/* Core Values Section */}
        <div className="bg-white dark:bg-card py-20 border-y border-border">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                <span className="text-success">Our</span> <span className="text-accent">Core Values</span>
              </h2>
              <p className="text-muted-foreground text-base">The principles that guide everything we do</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Value 1 */}
              <div className="bg-gray-50 dark:bg-background rounded-3xl p-8 text-center shadow-lg border border-border/50 hover:border-blue-200 transition-colors group cursor-default">
                <div className="w-16 h-16 mx-auto bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm">
                  <LuHeart className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-navy-900 dark:text-dark blue mb-4">Passion</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We are passionate about technology and its potential to transform businesses.
                </p>
              </div>

              {/* Value 2 */}
              <div className="bg-gray-50 dark:bg-background rounded-3xl p-8 text-center shadow-lg border border-border/50 hover:border-blue-200 transition-colors group cursor-default">
                <div className="w-16 h-16 mx-auto bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm">
                  <LuShieldCheck className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-navy-900 dark:text-dark blue mb-4">Integrity</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We maintain the highest standards of honesty and transparency in all our dealings.
                </p>
              </div>

              {/* Value 3 */}
              <div className="bg-gray-50 dark:bg-background rounded-3xl p-8 text-center shadow-lg border border-border/50 hover:border-blue-200 transition-colors group cursor-default">
                <div className="w-16 h-16 mx-auto bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm">
                  <LuUsers className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-navy-900 dark:text-dark blue mb-4">Collaboration</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We believe in the power of teamwork and partnership with our clients.
                </p>
              </div>

              {/* Value 4 */}
              <div className="bg-gray-50 dark:bg-background rounded-3xl p-8 text-center shadow-lg border border-border/50 hover:border-blue-200 transition-colors group cursor-default">
                <div className="w-16 h-16 mx-auto bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm">
                  <LuZap className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-navy-900 dark:text-dark blue mb-4">Innovation</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We constantly push boundaries to deliver cutting-edge solutions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
