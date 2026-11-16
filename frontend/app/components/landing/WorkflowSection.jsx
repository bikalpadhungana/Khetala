'use client';

import Image from 'next/image';
import RevealSection from '@/app/components/effects/RevealSection';

export default function WorkflowSection() {
  return (
    <section id="workflow" className="py-24 lg:py-32 bg-bg relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <RevealSection>
          <div className="text-center mb-16 lg:mb-24">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-ink tracking-tight">
              How it works
            </h2>
          </div>
        </RevealSection>

        <div className="relative">
          {/* Desktop connecting line */}
          <div className="hidden md:block absolute top-[120px] left-24 right-24 h-[2px] bg-gradient-to-r from-transparent via-border to-transparent" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
            {[
              { step: '1', title: 'Join Platform', desc: 'Create your affiliate account.', image: '/images/workflow/workflow_step_1_1781200091892.png' },
              { step: '2', title: 'Get Verified', desc: 'Quick compliance check.', image: '/images/workflow/workflow_step_2_1781200103947.png' },
              { step: '3', title: 'Submit Leads', desc: 'Add client details.', image: '/images/workflow/workflow_step_3_1781200115416.png' },
              { step: '4', title: 'Earn', desc: 'Get paid on conversion.', image: '/images/workflow/workflow_step_4_1781200127234.png' },
            ].map((item, i) => (
              <RevealSection key={i} delay={i * 0.15}>
                <div className="relative flex flex-col items-center text-center group">
                  {/* Image Container */}
                  <div className="w-40 h-40 sm:w-48 sm:h-48 relative mb-8 rounded-full overflow-hidden shadow-sm border-[4px] border-surface group-hover:-translate-y-2 transition-transform duration-500 bg-surface-2">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 25vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-ink/5 group-hover:bg-transparent transition-colors duration-500" />
                  </div>

                  <div className="w-12 h-12 rounded-full bg-surface border border-border flex items-center justify-center text-lg font-bold text-ink mb-4 relative z-10 group-hover:scale-110 group-hover:bg-accent group-hover:text-white transition-all duration-300 shadow-sm group-hover:border-accent">
                    {item.step}
                  </div>
                  <h3 className="text-lg sm:text-xl font-display font-bold text-ink mb-2">{item.title}</h3>
                  <p className="text-sm text-ink-2">{item.desc}</p>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
