'use client';

import HeroSection from '@/app/components/landing/HeroSection';
import FeaturesSection from '@/app/components/landing/FeaturesSection';
import ServicesSection from '@/app/components/landing/ServicesSection';
import WorkflowSection from '@/app/components/landing/WorkflowSection';
import PreviewSection from '@/app/components/landing/PreviewSection';
import CtaSection from '@/app/components/landing/CtaSection';
import FaqSection from '@/app/components/landing/FaqSection';
export default function LandingPage() {
  return (
    <div className="bg-background font-sans">
      <HeroSection />
      <FeaturesSection />
      <ServicesSection />
      <WorkflowSection />
      <PreviewSection />
      <CtaSection />
      <FaqSection />
    </div>
  );
}
