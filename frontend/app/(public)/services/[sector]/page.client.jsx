'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LuArrowRight, LuCircleCheck, LuBuilding2, LuGraduationCap,
  LuPlane, LuMonitor, LuPenTool, LuCar, LuHouse, LuChevronDown,
  LuSparkles, LuTrendingUp, LuCpu, LuFileText, LuGlobe
} from 'react-icons/lu';
import Button from '@/app/components/common/Button';
import { SERVICE_DEPARTMENTS } from '@/app/lib/constants';

const iconMap = {
  'abroad-study-services': LuGraduationCap,
  'it-digital-services': LuCpu,
  'writing-services': LuFileText,
  'tourism-travel-services': LuGlobe,
  'real-estate-services': LuHouse,
  'automobile-services': LuCar,
  'accounting-financial-services': LuTrendingUp,
  'others': LuSparkles,
};

// Reusable FAQ Item Component
const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-border/50 bg-card rounded-2xl overflow-hidden transition-all duration-300 hover:border-accent/30 hover:shadow-md">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left"
      >
        <span className="font-semibold text-foreground text-lg">{question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 ml-4"
        >
          <div className="w-8 h-8 rounded-full bg-secondary/50 flex items-center justify-center text-muted-foreground">
            <LuChevronDown className="w-5 h-5" />
          </div>
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-6 pb-6 text-muted-foreground leading-relaxed">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function ServicesClient({ sector }) {
  const departmentInfo = SERVICE_DEPARTMENTS.find((d) => d.slug === sector);

  if (!departmentInfo) {
    notFound();
  }

  const Icon = iconMap[departmentInfo.slug] || LuBuilding2;
  const subServices = departmentInfo.subServices || [];

  const faqs = [
    {
      q: `What makes Think Tank's ${departmentInfo.title} different?`,
      a: "We provide top-tier support, transparency, and rapid turnaround times. Our dedicated professionals ensure that every client receives exceptional quality and results."
    },
    {
      q: `How much commission can I earn with ${departmentInfo.title} leads?`,
      a: "Our commission structure is highly competitive. You can earn industry-leading commissions on successful conversions, tracked transparently on your dashboard."
    },
    {
      q: `How do I submit a lead for ${departmentInfo.title}?`,
      a: `Simply create a free affiliate account, navigate to your dashboard, and use the 'Submit Lead' form selecting ${departmentInfo.title} as the primary category.`
    },
    {
      q: "What happens after I submit a lead?",
      a: "Our verification team immediately contacts the prospect. You can track the real-time status of your lead from 'Verified' all the way to 'Converted' in your dashboard."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans selection:bg-accent/20">
      <main className="flex-1">
        {/* Premium Hero Section */}
        <section className="relative pt-[120px] pb-24 md:pt-[160px] md:pb-32 overflow-hidden border-b border-border/40 bg-secondary/20">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-[1200px] pointer-events-none">
            <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-blue-500/10 blur-[100px]" />
            <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-violet-500/10 blur-[100px]" />
          </div>

          <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="inline-flex items-center justify-center p-4 rounded-3xl bg-card border border-border/50 shadow-xl shadow-accent/5 mb-8"
            >
              <Icon className="w-10 h-10 text-accent" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
              className="text-5xl md:text-6xl lg:text-7xl font-black text-foreground tracking-tight leading-[1.1] mb-8 max-w-4xl mx-auto"
            >
              Expert <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">{departmentInfo.title}</span> <br className="hidden md:block" /> for Global Needs
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed"
            >
              {departmentInfo.description} Partner with us, submit high-quality leads, and earn lucrative commissions.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
              className="flex flex-col sm:flex-row items-stretch justify-center gap-3 sm:gap-4 px-2 sm:px-0"
            >
              <Link href="/register">
                <Button size="lg" className="w-full h-14 px-8 rounded-full font-bold text-lg shadow-lg shadow-accent/25 hover:shadow-accent/40 transition-all">
                  Become a Partner <LuArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" size="lg" className="w-full h-14 px-8 rounded-full font-bold text-lg bg-card hover:bg-secondary transition-colors border-border/60">
                  Contact Department
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Sub Services Grid */}
        {subServices.length > 0 && (
          <section className="py-24 bg-background relative">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Our Specialized Services</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  A comprehensive suite of solutions tailored to meet exceptional standards.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subServices.map((sub, idx) => (
                  <motion.div
                    key={sub.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: idx * 0.05 }}
                    className="bg-card border border-border/50 rounded-2xl p-6 hover:shadow-xl hover:border-accent/40 transition-all group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent mb-6 group-hover:scale-110 transition-transform">
                      <LuCircleCheck className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-accent transition-colors">{sub.title}</h3>
                    <p className="text-sm text-muted-foreground">Expert execution and unparalleled support for your {sub.title.toLowerCase()} needs.</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* How it Works - Premium Timeline */}
        <section className="py-16 sm:py-24 bg-secondary/30 max-w-7xl mx-auto px-4 sm:px-6 rounded-[1.5rem] sm:rounded-[2.5rem] my-8 sm:my-12 border border-border/50">
          <div className="grid lg:grid-cols-2 gap-10 sm:gap-16 items-center">
            <div className="order-2 lg:order-1 relative">
              <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-gradient-to-b from-accent/50 via-border to-transparent hidden md:block" />
              <div className="space-y-10">
                {[
                  { step: '01', title: 'Register & Access', desc: 'Create your free affiliate account and unlock your personalized dashboard.' },
                  { step: '02', title: 'Submit Client Details', desc: `Enter prospect information securely for our ${departmentInfo.title} team.` },
                  { step: '03', title: 'We Close The Deal', desc: 'Our expert sales and execution team takes over, keeping you updated.' },
                  { step: '04', title: 'Earn Commission', desc: 'Get paid instantly when the deal is successfully closed and finalized.' }
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="relative pl-0 md:pl-16 group"
                  >
                    <div className="hidden md:flex absolute left-0 top-0 w-12 h-12 rounded-full border-2 border-border bg-card items-center justify-center font-black text-muted-foreground group-hover:border-accent group-hover:text-accent group-hover:shadow-[0_0_20px_rgba(37,99,235,0.2)] transition-all z-10">
                      {item.step}
                    </div>
                    <div className="bg-card border border-border/50 p-6 rounded-2xl shadow-sm group-hover:shadow-md transition-shadow">
                      <div className="md:hidden text-accent font-black text-sm mb-2">STEP {item.step}</div>
                      <h4 className="text-xl font-bold text-foreground mb-2">{item.title}</h4>
                      <p className="text-muted-foreground">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl md:text-5xl font-black text-foreground mb-6 leading-tight">
                Your path to <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">passive income</span> is clear.
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                We handle the operations, the fulfillment, and the client satisfaction. You focus entirely on building relationships and submitting leads. Our platform is designed to make earning commissions as seamless as possible.
              </p>
              <ul className="space-y-4">
                {[
                  `Industry-leading commission rates for ${departmentInfo.title}`,
                  'Real-time tracking of every lead status',
                  'Automated payouts directly to your preferred account',
                  'Dedicated affiliate support team at your disposal'
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-4 text-foreground font-medium bg-card p-4 rounded-xl border border-border/50">
                    <LuCircleCheck className="w-6 h-6 text-success shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 bg-background">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">Frequently Asked Questions</h2>
              <p className="text-muted-foreground text-lg">Everything you need to know about partnering with our {departmentInfo.title} division.</p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <FAQItem key={idx} question={faq.q} answer={faq.a} />
              ))}
            </div>
          </div>
        </section>

        {/* Modern CTA */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-accent" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/10 rounded-full blur-[120px] pointer-events-none" />

          <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
              Ready to elevate your earnings?
            </h2>
            <p className="text-xl text-white/80 mb-10 leading-relaxed">
              Join the Think Tank network today. Gain instant access to our {departmentInfo.title} and start building a reliable income stream.
            </p>
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto h-14 sm:h-16 px-6 sm:px-10 rounded-full text-accent hover:bg-gray-50 font-black text-base sm:text-lg shadow-2xl hover:scale-105 transition-transform">
                Create Your Free Account Now
              </Button>
            </Link>
          </div>
        </section>
      </main>

    </div>
  );
}
