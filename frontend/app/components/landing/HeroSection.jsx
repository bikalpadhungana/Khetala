'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { LuArrowRight } from 'react-icons/lu';
import MagneticButton from '@/app/components/effects/MagneticButton';
import CursorGlow from '@/app/components/effects/CursorGlow';
import AnimatedCounter from '@/app/components/effects/AnimatedCounter';
import HeroSlider from '@/app/components/landing/HeroSlider';

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: 'easeOut' },
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } },
};

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section id="hero-section" className="min-h-[calc(100vh-88px)] w-full flex items-center pt-12 pb-6 lg:pt-16 lg:pb-8 bg-surface-2 relative overflow-hidden">

      {/* Animated grid background */}
      <div className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `linear-gradient(var(--accent) 1px, transparent 1px), linear-gradient(90deg, var(--accent) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />

      <CursorGlow />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center w-full">

        {/* Left: Copy */}
        <motion.div
          initial="initial"
          animate="animate"
          variants={staggerContainer}
          className="flex flex-col items-center lg:items-start text-center lg:text-left"
        >

          <motion.h1 variants={fadeUp} className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold text-ink leading-tight mb-4 tracking-tight">
            NEPAL'S PREMIER<br />
            <span className="text-[#5b51f7]">FREELANCING NETWORK</span>
          </motion.h1>

          <motion.div variants={fadeUp} className="font-display text-base sm:text-lg font-bold text-ink-2 mb-4">
            “More skills. More opportunities. More income.”
          </motion.div>

          <motion.p variants={fadeUp} className="text-ink-2 text-sm sm:text-base leading-relaxed mb-6 max-w-xl mx-auto lg:mx-0">
            A global platform connecting talented local freelancers, creative thinkers, and highly skilled professionals in Kathmandu with unlimited international opportunities, project consulting, and enterprise contracts.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-6 w-full">
            <Link href="/register" className="block w-full sm:w-auto">
              <MagneticButton className="w-full sm:w-auto bg-[#16a34a] hover:bg-[#15803d] text-white px-6 py-3.5 rounded-xl font-semibold text-sm hover:scale-[1.02] shadow-lg shadow-green-600/30 flex items-center justify-center border-none transition-all duration-200">
                Start Earning <LuArrowRight className="ml-2 w-4 h-4" />
              </MagneticButton>
            </Link>
            <Link href="/affiliate/submit-lead" className="block w-full sm:w-auto">
              <MagneticButton className="w-full sm:w-auto bg-white border border-border text-ink px-6 py-3.5 rounded-xl font-semibold text-sm hover:bg-surface-2 transition-colors flex items-center justify-center">
                Submit a Lead
              </MagneticButton>
            </Link>
          </motion.div>

          {/* Social proof strip */}
          <motion.div variants={fadeUp} className="hidden sm:flex items-center justify-center lg:justify-start gap-6 text-sm text-ink-2 bg-white/50 backdrop-blur-sm px-6 py-2.5 rounded-2xl border border-border/60">
            <div>
              <AnimatedCounter target={100} suffix="+" />
              <span className="ml-1">Active affiliates</span>
            </div>
            <div className="w-px h-4 bg-border" />
            <div>
              <AnimatedCounter target={8} />
              <span className="ml-1"> sectors</span>
            </div>
            <div className="w-px h-4 bg-border" />
          </motion.div>
        </motion.div>

        {/* Right: Slider & Floating Badge */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="w-full relative mt-4 lg:mt-0 max-w-lg lg:max-w-2xl xl:max-w-3xl mx-auto"
        >
          <div className="rounded-2xl overflow-hidden shadow-2xl w-full border-4 border-white">
            <HeroSlider />
          </div>

          {/* Floating commission badge */}

        </motion.div>

      </div>
    </section>
  );
}