'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LuChevronDown } from 'react-icons/lu';
import RevealSection from '@/app/components/effects/RevealSection';

const faqs = [
  {
    question: "What is Think Tank Freelancing Hub?",
    answer: "Think Tank Freelancing Hub is Nepal's premier freelancing and professional collaboration network, designed to connect talented individuals with global opportunities. We bridge the gap between skilled professionals, businesses, and international clients by providing access to freelance projects, enterprise contracts, consulting engagements, and strategic partnerships. Our mission is to help local talent compete and thrive in the global digital economy."
  },
  {
    question: "Who can join Think Tank Freelancing Hub?",
    answer: "Anyone with valuable skills, expertise, or professional experience can apply to join. Whether you are a freelancer, student, creative professional, software developer, digital marketer, consultant, project manager, entrepreneur, or industry specialist, Think Tank provides opportunities to showcase your capabilities and connect with potential clients and projects."
  },
  {
    question: "How do I get started?",
    answer: "Getting started is simple. Create your account, complete your professional profile, highlight your skills and experience, and upload relevant portfolio work or project examples. A strong profile increases your visibility and improves your chances of being matched with suitable opportunities."
  },
  {
    question: "What types of opportunities are available?",
    answer: "Members gain access to a wide range of opportunities, including freelance projects, remote work engagements, consulting assignments, enterprise contracts, business collaborations, and referral-based income programs. Opportunities may range from short-term projects to long-term professional partnerships."
  },
  {
    question: "How do payments work?",
    answer: "Payments are managed through secure and transparent processes. Once agreed project milestones or deliverables are completed and approved, payments are processed according to the terms of the contract. Our focus is to ensure professionalism, accountability, and reliability for all parties involved."
  },
  {
    question: "What is the Lead Partner Program?",
    answer: "The Lead Partner Program allows individuals to introduce potential clients, businesses, or organizations to Think Tank Freelancing Hub. When a qualified referral successfully converts into a project, service agreement, or enterprise contract, the referrer may receive a commission or incentive based on the agreement terms."
  },
  {
    question: "Are there any membership fees?",
    answer: "Creating an account and joining the Think Tank community is free. Depending on the services provided, project structure, or partnership arrangement, standard platform or service fees may apply only when business is successfully conducted through the platform."
  }
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-12 bg-bg border-t border-border">
      <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center mb-16 text-center">
        <RevealSection>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-ink mb-6 tracking-tight">
            Frequently Asked <span className="text-accent">Questions</span>
          </h2>
          <p className="text-base sm:text-lg text-ink-2 max-w-2xl mx-auto leading-relaxed">
            Everything you need to know about Think Tank and how we connect talent with global opportunities.
          </p>
        </RevealSection>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto grid gap-4">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;

          return (
            <RevealSection key={index} delay={index * 0.05}>
              <div
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen 
                    ? 'bg-surface border-accent/40 shadow-sm' 
                    : 'bg-surface border-border hover:border-accent/30'
                }`}
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-4 sm:p-6 text-left cursor-pointer outline-none"
                  aria-expanded={isOpen}
                >
                  <span className={`text-base sm:text-lg font-bold pr-4 sm:pr-8 transition-colors duration-300 font-display ${isOpen ? 'text-accent' : 'text-ink'}`}>
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className={`flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full transition-colors ${isOpen ? 'bg-accent/10 text-accent' : 'bg-surface-2 text-ink-2'}`}
                  >
                    <LuChevronDown className="w-5 h-5" />
                  </motion.div>
                </button>
                
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-4 sm:px-6 pb-4 sm:pb-6 text-ink-2 leading-relaxed text-sm sm:text-base border-t border-border/50 pt-4 mt-2">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </RevealSection>
          );
        })}
      </div>
    </section>
  );
}
