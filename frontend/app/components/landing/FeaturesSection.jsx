'use client';

import { LuFileCheck, LuRoute, LuUserCheck, LuCreditCard, LuChartBar, LuShieldCheck, LuArrowRight } from 'react-icons/lu';
import RevealSection from '@/app/components/effects/RevealSection';

const features = [
  { icon: LuFileCheck, title: 'Lead Intake & Verification', desc: 'Standardized forms ensure high-quality data capture and instant validation.' },
  { icon: LuRoute, title: 'Department Routing', desc: 'Leads are automatically routed to the correct specialized department team.' },
  { icon: LuUserCheck, title: 'Affiliate CRM', desc: 'Manage all your clients, notes, and statuses in a single dedicated workspace.' },
  { icon: LuCreditCard, title: 'Commission Tracking', desc: 'Automated ledger tracking every rupee earned, pending, and withdrawn.' },
  { icon: LuChartBar, title: 'Performance Analytics', desc: 'Visual dashboards detailing your conversion rates and highest performing sectors.' },
  { icon: LuShieldCheck, title: 'Compliance & SLA', desc: 'Strict data privacy and guaranteed response times for all submitted leads.' },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-surface-2 relative overflow-hidden border-t border-border">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[800px] h-[600px] bg-gradient-to-bl from-accent/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-accent-2/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        <RevealSection>
          <div className="text-center mb-16 lg:mb-24 max-w-3xl mx-auto flex flex-col items-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-ink mb-6 tracking-tight">
              Everything you need to scale.
            </h2>
            <p className="text-base sm:text-xl text-ink-2 leading-relaxed">
              We've built a complete operational layer so you can focus purely on networking and closing. Let our system handle the heavy lifting.
            </p>
          </div>
        </RevealSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, i) => (
            <RevealSection key={i} delay={i * 0.1}>
              <div className="bg-surface border border-border rounded-3xl p-8 hover-lift shadow-sm group flex flex-col items-start h-full cursor-default">
                <div className="w-14 h-14 rounded-2xl bg-surface-2 flex items-center justify-center text-accent mb-8 group-hover:bg-accent group-hover:text-white transition-all duration-300 shadow-sm border border-border">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-display font-bold text-ink mb-3">{feature.title}</h3>
                <p className="text-ink-2 leading-relaxed text-sm flex-1">{feature.desc}</p>
              </div>
            </RevealSection>
          ))}
        </div>
      </div>
    </section>
  );
}
