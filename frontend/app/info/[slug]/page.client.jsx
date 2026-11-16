'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Logo from '@/app/components/common/Logo';
import PageHeader from '@/app/components/common/PageHeader';
const contentMap = {
  about: {
    title: 'About Think Tank',
    content: 'Think Tank Freelancing Hub is Nepal’s premier multi-service platform. We aim to empower independent professionals by providing an enterprise-grade infrastructure to monetize their networks.',
  },
  contact: {
    title: 'Contact Us',
    content: 'Reach out to our team at info@thinktank.com or call us at +977-985-6017621. We are located in Kathmandu, Nepal.',
  },
  careers: {
    title: 'Careers',
    content: 'Join our growing team. We are always looking for talented developers, support agents, and department specialists. Check back later for open positions.',
  },
  'affiliate-program': {
    title: 'Affiliate Program',
    content: 'Our affiliate program offers industry-leading commissions across 8 highly profitable sectors. Register today to start building your income stream.',
  },
  privacy: {
    title: 'Privacy Policy',
    content: 'We take your data privacy seriously. All client information submitted as leads is encrypted and only accessible by verified department specialists.',
  },
  terms: {
    title: 'Terms of Service',
    content: 'By using the Think Tank platform, you agree to our affiliate terms and conditions. Leads must be genuine and verified.',
  },
  cookies: {
    title: 'Cookie Policy',
    content: 'We use essential cookies to keep you logged in and functional cookies to remember your preferences on the dashboard.',
  },
};

const socialRedirects = {
  linkedin: 'https://linkedin.com',
  facebook: 'https://facebook.com',
  twitter: 'https://twitter.com',
};

export default function InfoClient({ slug }) {
  const router = useRouter();

  useEffect(() => {
    if (socialRedirects[slug]) {
      window.location.href = socialRedirects[slug];
    }
  }, [slug]);

  if (socialRedirects[slug]) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground animate-pulse">Redirecting...</div>
      </div>
    );
  }

  const pageData = contentMap[slug] || {
    title: 'Information',
    content: 'Content not found.',
  };

  return (
    <div className="min-h-screen bg-background font-sans flex flex-col">
      <main className="flex-1 max-w-4xl mx-auto px-6 py-12 w-full pt-28">
        <PageHeader title={pageData.title} />
        <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
          <p className="text-muted-foreground leading-relaxed">
            {pageData.content}
          </p>
          <div className="mt-8 p-4 bg-secondary/30 rounded-lg text-sm text-muted-foreground">
            This is a placeholder {pageData.title} page for the MVP demonstration.
          </div>
        </div>
      </main>

    </div>
  );
}
