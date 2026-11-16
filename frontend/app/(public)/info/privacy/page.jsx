import React from 'react';
import PageHeader from '@/app/components/common/PageHeader';
import { LuShieldCheck } from 'react-icons/lu';

export const metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for Think Tank Freelancing Hub',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background font-sans flex flex-col">
      <main className="flex-1 w-full pt-28 pb-20">
        <PageHeader title="Privacy Policy" />
        
        <div className="max-w-4xl mx-auto px-6 mt-8">
          <div className="bg-card border border-border rounded-3xl p-8 md:p-12 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-bl-full -z-10" />
            
            <div className="flex items-center gap-4 mb-8 pb-8 border-b border-border/60">
              <div className="w-14 h-14 bg-accent/10 text-accent rounded-full flex items-center justify-center shrink-0">
                <LuShieldCheck className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground mb-1">Data Protection Commitment</h2>
                <p className="text-sm text-muted-foreground">Your privacy and security are our highest priorities.</p>
              </div>
            </div>

            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground">
              <p className="lead text-lg font-medium text-foreground mb-8">
                Think Tank Freelancing Hub ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our multi-service infrastructure.
              </p>

              <h2 className="text-2xl font-bold mt-10 mb-4 text-navy-900 dark:text-white">1. Information We Collect</h2>
              <p>
                We may collect information about you in a variety of ways. The information we may collect includes:
              </p>
              <ul>
                <li><strong>Personal Data:</strong> Personally identifiable information, such as your name, email address, telephone number, and demographic information that you voluntarily give to us when you register as an affiliate or submit a lead.</li>
                <li><strong>Lead Information:</strong> Details regarding the clients and projects you refer to us, which are necessary for matching with our expert departments.</li>
                <li><strong>Financial Data:</strong> Data related to your payment method (e.g., valid bank account or eSewa details) that we may collect when you receive commissions.</li>
              </ul>

              <h2 className="text-2xl font-bold mt-10 mb-4 text-navy-900 dark:text-white">2. Use of Your Information</h2>
              <p>
                Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:
              </p>
              <ul>
                <li>Create and manage your account.</li>
                <li>Process affiliate commissions and financial transactions.</li>
                <li>Match submitted leads with the appropriate service departments.</li>
                <li>Communicate with you regarding your account or our services.</li>
                <li>Increase the efficiency and operation of our platform.</li>
              </ul>

              <h2 className="text-2xl font-bold mt-10 mb-4 text-navy-900 dark:text-white">3. Security of Your Information</h2>
              <p>
                We use administrative, technical, and physical security measures to help protect your personal information. All lead data and client information submitted is encrypted and strictly accessible only by verified department specialists. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable.
              </p>

              <h2 className="text-2xl font-bold mt-10 mb-4 text-navy-900 dark:text-white">4. Sharing Information with Third Parties</h2>
              <p>
                We do not sell, trade, or rent your personal identification information to others. We may share generic aggregated demographic information not linked to any personal identification information regarding visitors and users with our business partners, trusted affiliates, and advertisers for the purposes outlined above.
              </p>

              <h2 className="text-2xl font-bold mt-10 mb-4 text-navy-900 dark:text-white">5. Changes to This Privacy Policy</h2>
              <p>
                We reserve the right to make changes to this Privacy Policy at any time and for any reason. We will alert you about any changes by updating the "Last Updated" date of this Privacy Policy. You are encouraged to periodically review this Privacy Policy to stay informed of updates.
              </p>

              <div className="mt-12 pt-8 border-t border-border/60">
                <p className="text-sm">
                  <strong>Last Updated:</strong> June 2026<br/>
                  If you have questions or comments about this Privacy Policy, please contact us at <a href="mailto:ttfreelancinghubb@gmail.com" className="text-accent hover:underline">ttfreelancinghubb@gmail.com</a>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
}
