'use client';

import Link from 'next/link';
import { SERVICE_DEPARTMENTS } from '@/app/lib/constants';
import { LuArrowRight } from 'react-icons/lu';
import SpotlightCard from '@/app/components/effects/SpotlightCard';
import RevealSection from '@/app/components/effects/RevealSection';

const customIconMap = {
  'abroad-study-services': '/images/icons/Education_Icon.ico',
  'it-digital-services': '/images/icons/IT and Digital.ico',
  'writing-services': '/images/icons/Writing.ico',
  'tourism-travel-services': '/images/icons/Tours and Travels.ico',
  'real-estate-services': '/images/icons/Real State.ico',
  'automobile-services': '/images/icons/Automobilies.ico',
  'accounting-financial-services': '/images/icons/Financial.ico',
  'others': '/images/icons/Others.ico',
};

const styleMap = {
  'abroad-study-services': { bg: 'bg-[#F0F7FF]', text: 'text-[#0066FF]', border: 'border-[#0066FF]/20' },
  'it-digital-services': { bg: 'bg-[#F5F3FF]', text: 'text-[#7C3AED]', border: 'border-[#7C3AED]/20' },
  'writing-services': { bg: 'bg-[#FFF1F2]', text: 'text-[#E11D48]', border: 'border-[#E11D48]/20' },
  'tourism-travel-services': { bg: 'bg-[#ECFEFF]', text: 'text-[#0891B2]', border: 'border-[#0891B2]/20' },
  'real-estate-services': { bg: 'bg-[#F0FDF4]', text: 'text-[#16A34A]', border: 'border-[#16A34A]/20' },
  'automobile-services': { bg: 'bg-[#F8FAFC]', text: 'text-[#475569]', border: 'border-[#475569]/20' },
  'others': { bg: 'bg-[#FAFAFA]', text: 'text-[#52525B]', border: 'border-[#52525B]/20' },
  'accounting-financial-services': { bg: 'bg-[#FFFBEB]', text: 'text-[#D97706]', border: 'border-[#D97706]/20' },
};

export default function ServicesSection() {
  return (
    <section id="services" className="py-24 bg-bg border-t border-border relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <RevealSection>
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-ink mb-4 tracking-tight">
              Services We Handle
            </h2>
            <p className="text-base sm:text-lg text-ink-2 leading-relaxed">
              Submit leads to any of our specialized departments and earn industry-leading commissions.
            </p>
          </div>
        </RevealSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICE_DEPARTMENTS.map((dept, idx) => {
            const styles = styleMap[dept.slug] || styleMap['others'];
            const customIconSrc = customIconMap[dept.slug];
            const href = `/services/${dept.slug}`;

            return (
              <RevealSection key={dept.slug} delay={idx * 0.1}>
                <Link href={href} className="block group h-full">
                  <SpotlightCard className="h-full rounded-3xl border border-border bg-surface p-6 sm:p-8 flex flex-col hover-lift">
                    <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-8 transition-transform duration-300 group-hover:scale-110 shadow-sm border ${styles.border} ${styles.bg}`}>
                      {customIconSrc ? (
                        <img src={customIconSrc} alt={dept.title} className="w-14 h-14 object-contain" />
                      ) : (
                        <div className={`w-10 h-10 ${styles.text}`}>Icon</div>
                      )}
                    </div>

                    <h3 className="text-xl font-display font-bold text-ink mb-3 group-hover:text-accent transition-colors">
                      {dept.title}
                    </h3>
                    <p className="text-sm text-ink-2 flex-1 mb-4 leading-relaxed">
                      {dept.description}
                    </p>
                  </SpotlightCard>
                </Link>
              </RevealSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}
