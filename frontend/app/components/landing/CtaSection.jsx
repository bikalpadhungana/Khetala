'use client';

import Link from 'next/link';
import Button from '@/app/components/common/Button';
import Logo from '@/app/components/common/Logo';

export default function CtaSection() {
  return (
    <section className="py-14 sm:py-24 bg-navy-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.2)_0%,transparent_70%)]" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center flex flex-col items-center">
        <Logo variant="dark" size="lg" showText={false} className="mb-8" />
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 tracking-tight">Ready to monetize your network?</h2>
        <p className="text-base sm:text-xl text-sidebar-muted mb-6 sm:mb-10 max-w-2xl leading-relaxed">
          Join hundreds of professionals across Nepal earning consistent commissions by referring quality leads to our specialized departments.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link href="/register" className="w-full sm:w-auto">
            <Button
              variant="none"
              className="w-full h-14 px-8 rounded-full bg-orange-500 hover:bg-orange-600 text-white hover:scale-[1.02] active:scale-[0.98] text-base font-bold shadow-lg shadow-orange-500/20 transition-all duration-200"
            >
              Create Your Account
            </Button>
          </Link>
          <Link href="/contact" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full h-14 px-8 rounded-full border-white/20 text-white hover:bg-white/10 hover:text-white text-base bg-transparent">
              Submit Inquiry
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
