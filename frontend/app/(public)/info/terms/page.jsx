import React from 'react';
import PageHeader from '@/app/components/common/PageHeader';
import { LuCircleCheck } from 'react-icons/lu';

export const metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for Think Tank Freelancing Hub',
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background font-sans flex flex-col">
      <main className="flex-1 w-full pt-28 pb-20">
        <PageHeader title="Terms of Service" />
        
        <div className="max-w-4xl mx-auto px-6 mt-8">
          <div className="bg-card border border-border rounded-3xl p-8 md:p-12 shadow-sm">
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground">
              <p className="lead text-lg font-medium text-foreground mb-8">
                Welcome to Think Tank Freelancing Hub. By accessing or using our platform, you agree to be bound by these Terms of Service. Please read them carefully before participating in our affiliate program or using our multi-service infrastructure.
              </p>

              <h2 className="text-2xl font-bold mt-10 mb-4 text-navy-900 dark:text-white">1. Acceptance of Terms</h2>
              <p>
                By registering an account, submitting leads, or utilizing any services provided by Think Tank Freelancing Hub, you accept and agree to these terms. If you do not agree with any portion of these terms, you must not use our platform.
              </p>

              <h2 className="text-2xl font-bold mt-10 mb-4 text-navy-900 dark:text-white">2. Affiliate Program & Lead Submission</h2>
              <p>
                Our affiliate program empowers independent professionals to monetize their networks. As an affiliate, you agree to:
              </p>
              <ul className="list-none space-y-3 pl-0 mb-8 mt-4">
                <li className="flex items-start gap-3">
                  <LuCircleCheck className="w-5 h-5 text-success shrink-0 mt-0.5" />
                  <span>Submit only genuine, high-quality leads that have expressed real interest in our services.</span>
                </li>
                <li className="flex items-start gap-3">
                  <LuCircleCheck className="w-5 h-5 text-success shrink-0 mt-0.5" />
                  <span>Provide accurate contact and requirement information for all submissions.</span>
                </li>
                <li className="flex items-start gap-3">
                  <LuCircleCheck className="w-5 h-5 text-success shrink-0 mt-0.5" />
                  <span>Avoid any fraudulent activity, spam, or misleading marketing tactics to acquire leads.</span>
                </li>
              </ul>
              <p>
                Think Tank reserves the right to reject leads that do not meet our quality standards or appear fraudulent.
              </p>

              <h2 className="text-2xl font-bold mt-10 mb-4 text-navy-900 dark:text-white">3. Commission & Payments</h2>
              <p>
                Commissions are calculated based on the successful conversion and payment of the submitted lead by the respective department. Think Tank Freelancing Hub tracks all lead statuses transparently in your dashboard. Payments are processed according to the standard payout schedule outlined in your affiliate agreement.
              </p>

              <h2 className="text-2xl font-bold mt-10 mb-4 text-navy-900 dark:text-white">4. User Account Security</h2>
              <p>
                You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized use of your account. Think Tank Freelancing Hub will not be liable for any losses caused by unauthorized use of your account.
              </p>

              <h2 className="text-2xl font-bold mt-10 mb-4 text-navy-900 dark:text-white">5. Modifications to the Service</h2>
              <p>
                We reserve the right to modify or discontinue, temporarily or permanently, the service (or any part thereof) with or without notice. We shall not be liable to you or to any third party for any modification, suspension, or discontinuance of the service.
              </p>

              <h2 className="text-2xl font-bold mt-10 mb-4 text-navy-900 dark:text-white">6. Governing Law</h2>
              <p>
                These terms shall be governed by and construed in accordance with the laws of Nepal. Any disputes arising under or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts located in Kathmandu, Nepal.
              </p>

              <div className="mt-12 pt-8 border-t border-border/60">
                <p className="text-sm">
                  <strong>Last Updated:</strong> June 2026<br/>
                  For any questions regarding these terms, please contact us at <a href="mailto:ttfreelancinghubb@gmail.com" className="text-accent hover:underline">ttfreelancinghubb@gmail.com</a>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
}
