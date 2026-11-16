'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  LuArrowRight,
  LuBadgeCheck,
  LuBuilding2,
  LuClock3,
  LuFileCheck,
  LuMail,
  LuMapPin,
  LuMessageSquare,
  LuPhone,
  LuRoute,
  LuShieldCheck,
  LuUsers,
} from 'react-icons/lu';
import Button from '@/app/components/common/Button';
import Input from '@/app/components/common/Input';
import Select from '@/app/components/common/Select';
import Logo from '@/app/components/common/Logo';
import api from '@/app/api/api';
import toast from 'react-hot-toast';

const contactChannels = [
  {
    icon: LuMapPin,
    label: 'Office ',
    value: 'Tokha-11, Kathmandu, Nepal',
    note: 'Lead operations and department coordination office',
  },
  {
    icon: LuMail,
    label: 'Partnership Desk',
    value: 'info@thinktank.com',
    href: 'mailto:info@thinktank.com',
    note: 'For affiliate, institutional, and lead-platform inquiries',
  },
  {
    icon: LuPhone,
    label: 'Office Line',
    value: '+977 9856017621 , +977 9864378571',
    note: 'Sunday to Friday, 9:00 AM - 6:00 PM NPT',
  },
];

const departmentOptions = [
  { label: 'Professional network partnership', value: 'network-partnership' },
  { label: 'Lead platform onboarding', value: 'lead-platform' },
  { label: 'Department lead routing', value: 'department-routing' },
  { label: 'Corporate or institution inquiry', value: 'corporate' },
  { label: 'Affiliate support escalation', value: 'affiliate-support' },
];

const processPoints = [
  {
    icon: LuFileCheck,
    title: 'Structured intake',
    desc: 'Every inquiry is reviewed with source, sector, urgency, and client-readiness context.',
  },
  {
    icon: LuRoute,
    title: 'Department routing',
    desc: 'Qualified requests are assigned to the relevant service department for direct follow-up.',
  },
  {
    icon: LuShieldCheck,
    title: 'Professional handling',
    desc: 'Lead information is handled with disciplined access, status visibility, and partner accountability.',
  },
];

export default function ContactClient() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    organization: '',
    email: '',
    phone: '',
    inquiryType: '',
    leadSector: '',
    leadSector: '',
    message: '',
  });

  const isEmailValid = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/contact', formData);
      toast.success('Inquiry submitted successfully! Our team will contact you shortly.');
      setFormData({
        name: '',
        organization: '',
        email: '',
        phone: '',
        inquiryType: '',
        leadSector: '',
        message: '',
      });
    } catch (err) {
      console.error('Contact submission error:', err);
      const errorMsg = err?.message || 'Failed to submit inquiry. Please try again.';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <main className="flex-1">
        <section className="border-b border-border bg-card">
          <div className="max-w-7xl mx-auto px-6 py-20 lg:py-24 grid lg:grid-cols-[1.02fr_0.98fr] gap-12 items-center">
            <div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.08] tracking-tight text-foreground mb-6">
                Contact the office built for network-based lead growth.
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mb-9">
                Speak with Think Tank Freelancing Hub about affiliate partnerships,
                department lead routing, and professional network opportunities
                across Nepal&apos;s high-value service sectors.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a href="mailto:info@thinktank.com" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full h-13 rounded-sm px-7 bg-foreground text-background hover:bg-foreground/90">
                    Email Partnership Desk
                    <LuArrowRight className="w-5 h-5" />
                  </Button>
                </a>
                <a href="tel:+977014567890" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full h-13 rounded-sm px-7">
                    Call Office
                  </Button>
                </a>
              </div>
            </div>

            <div className="border border-border bg-background p-6 md:p-8 rounded-lg shadow-sm">
              <div className="flex items-start justify-between gap-4 border-b border-border pb-6 mb-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-2">
                    Office
                  </p>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                    Tokha-11, Kathmandu
                  </h2>
                </div>
                <div className="w-12 h-12 rounded-lg bg-accent text-white flex items-center justify-center flex-shrink-0">
                  <LuBuilding2 className="w-6 h-6" />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <div className="border border-border bg-card rounded-lg p-4">
                  <LuUsers className="w-5 h-5 text-accent mb-3" />
                  <p className="text-sm font-semibold text-foreground">Network Partnerships</p>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    Professional affiliate, referral, and institutional lead collaboration.
                  </p>
                </div>
                <div className="border border-border bg-card rounded-lg p-4">
                  <LuClock3 className="w-5 h-5 text-accent mb-3" />
                  <p className="text-sm font-semibold text-foreground">Response Standard</p>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    Priority inquiries are reviewed within one business day.
                  </p>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-lg border border-border bg-card h-[250px]">
                <iframe
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src="https://maps.google.com/maps?q=Tokha-11,%20Mahadevtar,%20Kathmandu&t=&z=14&ie=UTF8&iwloc=&output=embed"
                  title="Think Tank Office Location Map"
                ></iframe>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 py-16 lg:py-20 grid lg:grid-cols-[0.9fr_1.1fr] gap-8">
          <div className="space-y-4">
            {contactChannels.map((item) => {
              const Icon = item.icon;
              const content = (
                <div className="border border-border bg-card rounded-lg p-5 flex items-start gap-4 hover:border-accent/40 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-secondary text-accent flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground">{item.label}</p>
                    <p className="text-base font-bold text-foreground mt-1">{item.value}</p>
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{item.note}</p>
                  </div>
                </div>
              );

              return item.href ? (
                <a key={item.label} href={item.href} className="block">
                  {content}
                </a>
              ) : (
                <div key={item.label}>{content}</div>
              );
            })}
          </div>

          <div className="bg-card rounded-[2rem] shadow-2xl shadow-accent/5 p-8 md:p-12 border border-border/40 relative overflow-hidden z-10">
            {/* Decorative background blur */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl -z-10 pointer-events-none translate-x-1/3 -translate-y-1/3" />

            <div className="mb-10">
              <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tight mb-3">Contact Us</h2>
              <p className="text-muted-foreground">Fill out the form below and we'll get back to you shortly.</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Input
                  label={<span className="font-semibold text-foreground/90 tracking-wide text-sm uppercase">Name <span className="text-danger">*</span></span>}
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Type your full name"
                  required
                  className="h-14 bg-secondary/50 border-transparent focus:bg-background focus:border-accent focus:ring-4 focus:ring-accent/10 text-base rounded-xl px-5 transition-all"
                />
                <Input
                  label={<span className="font-semibold text-foreground/90 tracking-wide text-sm uppercase">Organization</span>}
                  name="organization"
                  value={formData.organization}
                  onChange={handleChange}
                  placeholder="Company or network name"
                  className="h-14 bg-secondary/50 border-transparent focus:bg-background focus:border-accent focus:ring-4 focus:ring-accent/10 text-base rounded-xl px-5 transition-all"
                />
                <div className="flex flex-col">
                  <Input
                    label={<span className="font-semibold text-foreground/90 tracking-wide text-sm uppercase">Email <span className="text-danger">*</span></span>}
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email address"
                    required
                    className="h-14 bg-secondary/50 border-transparent focus:bg-background focus:border-accent focus:ring-4 focus:ring-accent/10 text-base rounded-xl px-5 transition-all"
                  />
                  {formData.email && !isEmailValid && (
                    <p className="text-xs text-danger mt-1.5 ml-1">
                      Please enter a valid email address format.
                    </p>
                  )}
                </div>
                <Input
                  label={<span className="font-semibold text-foreground/90 tracking-wide text-sm uppercase">Phone <span className="text-danger">*</span></span>}
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone number"
                  required
                  className="h-14 bg-secondary/50 border-transparent focus:bg-background focus:border-accent focus:ring-4 focus:ring-accent/10 text-base rounded-xl px-5 transition-all"
                />
                <Select
                  label={<span className="font-semibold text-foreground/90 tracking-wide text-sm uppercase">Subject <span className="text-danger">*</span></span>}
                  name="inquiryType"
                  value={formData.inquiryType}
                  onChange={handleChange}
                  placeholder="Please Select"
                  options={departmentOptions}
                  required
                  className="h-14 bg-secondary/50 border-transparent focus:bg-background focus:border-accent focus:ring-4 focus:ring-accent/10 text-base rounded-xl px-5 transition-all"
                />
                <Input
                  label={<span className="font-semibold text-foreground/90 tracking-wide text-sm uppercase">Lead Sector</span>}
                  name="leadSector"
                  value={formData.leadSector}
                  onChange={handleChange}
                  placeholder="Education, IT, Travel..."
                  className="h-14 bg-secondary/50 border-transparent focus:bg-background focus:border-accent focus:ring-4 focus:ring-accent/10 text-base rounded-xl px-5 transition-all"
                />
              </div>

              <div className="flex flex-col gap-2 mt-2">
                <label htmlFor="message" className="font-semibold text-foreground/90 tracking-wide text-sm uppercase">
                  Message <span className="text-danger">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  required
                  className="w-full rounded-xl border-transparent bg-secondary/50 px-5 py-4 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-4 focus:ring-accent/10 focus:border-accent focus:bg-background transition-all resize-y shadow-inner"
                  placeholder="Write your message here..."
                />
              </div>
              <div className="pt-6 flex justify-start">
                <Button type="submit" loading={loading} disabled={formData.email && !isEmailValid} className="h-14 rounded-xl px-10 font-bold flex items-center gap-2 bg-accent text-white hover:bg-accent/90 shadow-xl shadow-accent/20 transition-all text-lg tracking-wide">
                  Send Us <LuArrowRight className="w-5 h-5 ml-1" />
                </Button>
              </div>
            </form>
          </div>
        </section>

        <section className="border-y border-border bg-secondary/30">
          <div className="max-w-7xl mx-auto px-6 py-16">
            <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-10 items-start">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent mb-3">
                  Contact Us
                </p>
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Built for serious lead conversations.
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Our contact workflow keeps professional network inquiries clear,
                  traceable, and ready for department-level action.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {processPoints.map((point) => {
                  const Icon = point.icon;
                  return (
                    <div key={point.title} className="border border-border bg-card rounded-lg p-5">
                      <div className="w-10 h-10 rounded-lg bg-secondary text-accent flex items-center justify-center mb-5">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg font-bold text-foreground mb-2">{point.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{point.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </main>

    </div>
  );
}
