'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  LuChevronDown,
  LuGraduationCap,
  LuCpu,
  LuFileText,
  LuGlobe,
  LuHouse,
  LuCar,
  LuSparkles,
  LuTrendingUp,
  LuBuilding2,
  LuPhone,
  LuLinkedin,
  LuFacebook,
  LuTwitter,
  LuMenu,
  LuX,
  LuLayoutDashboard,
  LuLogIn,
  LuArrowRight,
  LuInstagram,
} from 'react-icons/lu';
import { FaTiktok } from 'react-icons/fa6';
import { cn } from '@/app/lib/utils';
import { SERVICE_SECTORS } from '@/app/lib/constants';
import Button from '@/app/components/common/Button';
import Logo from '@/app/components/common/Logo';
import { useAuth } from '@/app/contexts/AuthContext';

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
  'abroad-study-services': { bg: 'bg-[#F0F7FF]', text: 'text-[#0066FF]', border: 'border-[#0066FF]/20', hoverBg: 'hover:bg-[#F0F7FF]/60', hoverBorder: 'group-hover:border-[#0066FF]', hoverText: 'group-hover:text-[#0066FF]' },
  'it-digital-services': { bg: 'bg-[#F5F3FF]', text: 'text-[#7C3AED]', border: 'border-[#7C3AED]/20', hoverBg: 'hover:bg-[#F5F3FF]/60', hoverBorder: 'group-hover:border-[#7C3AED]', hoverText: 'group-hover:text-[#7C3AED]' },
  'writing-services': { bg: 'bg-[#FFF1F2]', text: 'text-[#E11D48]', border: 'border-[#E11D48]/20', hoverBg: 'hover:bg-[#FFF1F2]/60', hoverBorder: 'group-hover:border-[#E11D48]', hoverText: 'group-hover:text-[#E11D48]' },
  'tourism-travel-services': { bg: 'bg-[#ECFEFF]', text: 'text-[#0891B2]', border: 'border-[#0891B2]/20', hoverBg: 'hover:bg-[#ECFEFF]/60', hoverBorder: 'group-hover:border-[#0891B2]', hoverText: 'group-hover:text-[#0891B2]' },
  'real-estate-services': { bg: 'bg-[#F0FDF4]', text: 'text-[#16A34A]', border: 'border-[#16A34A]/20', hoverBg: 'hover:bg-[#F0FDF4]/60', hoverBorder: 'group-hover:border-[#16A34A]', hoverText: 'group-hover:text-[#16A34A]' },
  'automobile-services': { bg: 'bg-[#F8FAFC]', text: 'text-[#475569]', border: 'border-[#475569]/20', hoverBg: 'hover:bg-[#F8FAFC]/60', hoverBorder: 'group-hover:border-[#475569]', hoverText: 'group-hover:text-[#475569]' },
  'accounting-financial-services': { bg: 'bg-[#FFFBEB]', text: 'text-[#D97706]', border: 'border-[#D97706]/20', hoverBg: 'hover:bg-[#FFFBEB]/60', hoverBorder: 'group-hover:border-[#D97706]', hoverText: 'group-hover:text-[#D97706]' },
  'others': { bg: 'bg-[#FAFAFA]', text: 'text-[#52525B]', border: 'border-[#52525B]/20', hoverBg: 'hover:bg-[#FAFAFA]/60', hoverBorder: 'group-hover:border-[#52525B]', hoverText: 'group-hover:text-[#52525B]' },
};

const iconMap = {
  LuGraduationCap,
  LuCpu,
  LuFileText,
  LuGlobe,
  LuHouse,
  LuCar,
  LuSparkles,
  LuTrendingUp,
  LuBuilding2,
};

export default function PublicNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  // Handle scroll for navbar styling
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) closeMobileMenu();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.classList.toggle('mobile-menu-open', mobileMenuOpen);
    return () => document.body.classList.remove('mobile-menu-open');
  }, [mobileMenuOpen]);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setMobileServicesOpen(false);
    setMobileAboutOpen(false);
  };

  return (
    <>
      <header
        className={cn(
          'fixed top-0 w-full z-50 transition-all duration-300 bg-card border-b border-border flex flex-col',
          scrolled ? 'shadow-md' : 'shadow-sm'
        )}
      >
        {/* Top Contact Bar */}
        <div
          className={cn(
            'bg-navy-950 text-white/90 border-b border-navy-900 transition-all duration-300 ease-in-out overflow-hidden',
            scrolled
              ? 'h-0 opacity-0 border-b-0 pointer-events-none'
              : 'h-[44px] sm:h-[52px] opacity-100 flex items-center'
          )}
        >
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 flex justify-between items-center">
            <div className="flex items-center gap-4 sm:gap-6">
              <a
                href="tel:+9779856017621"
                className="hover:text-accent transition-colors flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-sm font-medium"
              >
                <LuPhone className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-accent animate-pulse" />
                <span>+977 9856017621</span>
              </a>
              <a
                href="tel:+9779845136730"
                className="hover:text-accent transition-colors flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-sm font-medium hidden sm:flex"
              >
                <LuPhone className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-accent animate-pulse" />
                <span>+977 9864378571</span>
              </a>
            </div>
            <div className="hidden sm:flex items-center gap-4">
              <span className="text-white/40 text-[9px] uppercase tracking-widest font-bold mr-1">Follow Us:</span>
              <a href="/info/linkedin" className="text-white/60 hover:text-accent transition-colors" title="LinkedIn">
                <LuLinkedin className="w-3.5 h-3.5" />
              </a>
              <a href="https://www.facebook.com/profile.php?id=61590241028680" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-accent transition-colors" title="Facebook">
                <LuFacebook className="w-3.5 h-3.5" />
              </a>
              <a href="https://www.instagram.com/ttfreelancinghub/" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-accent transition-colors" title="Instagram">
                <LuInstagram className="w-3.5 h-3.5" />
              </a>
              <a href="/info/twitter" className="text-white/60 hover:text-accent transition-colors" title="Twitter">
                <LuTwitter className="w-3.5 h-3.5" />
              </a>
              <a href="/info/tiktok" className="text-white/60 hover:text-accent transition-colors" title="TikTok">
                <FaTiktok className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Main Navigation Bar */}
        <div
          className={cn(
            'max-w-7xl mx-auto w-full px-4 sm:px-6 flex items-center justify-between transition-all duration-300 relative bg-card',
            scrolled ? 'py-2' : 'py-3'
          )}
        >
          {/* Logo */}
          <Link href="/" onClick={closeMobileMenu}>
            <div className="hidden sm:block">
              <Logo variant="transparent" size="lg" />
            </div>
            <div className="block sm:hidden">
              <Logo variant="transparent" size="md" showText={false} />
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-10">
            {/* About Dropdown */}
            <div
              className="relative py-2"
              onMouseEnter={() => setAboutOpen(true)}
              onMouseLeave={() => setAboutOpen(false)}
            >
              <button className="flex items-center gap-1.5 text-sm font-bold text-foreground hover:text-accent transition-colors cursor-pointer">
                ABOUT US
                <LuChevronDown className={cn('w-4.5 h-4.5 transition-transform duration-200', aboutOpen && 'rotate-180')} />
              </button>
              {aboutOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 w-[200px] z-50">
                  <div className="rounded-2xl border border-border bg-gradient-to-br from-[#f0fdf4] to-white shadow-xl p-3 flex flex-col gap-1 animate-fade-in">
                    <Link href="/about/who-we-are" className="px-4 py-2.5 rounded-xl hover:bg-secondary/60 transition-colors text-sm font-bold text-foreground hover:text-accent" onClick={() => setAboutOpen(false)}>WHO WE ARE</Link>
                    <Link href="/about/message-from-founder" className="px-4 py-2.5 rounded-xl hover:bg-secondary/60 transition-colors text-sm font-bold text-foreground hover:text-accent" onClick={() => setAboutOpen(false)}>MESSAGE FROM FOUNDER</Link>
                    <Link href="/about/our-team" className="px-4 py-2.5 rounded-xl hover:bg-secondary/60 transition-colors text-sm font-bold text-foreground hover:text-accent" onClick={() => setAboutOpen(false)}>OUR TEAM</Link>
                  </div>
                </div>
              )}
            </div>

            {/* Services Dropdown */}
            <div
              className="relative py-2"
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <button className="flex items-center gap-1.5 text-sm font-bold text-foreground hover:text-accent transition-colors cursor-pointer">
                SERVICES
                <LuChevronDown className={cn('w-4.5 h-4.5 transition-transform duration-200', servicesOpen && 'rotate-180')} />
              </button>
              {servicesOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-5 w-[850px] z-50">
                  <div className="relative rounded-2xl border border-border/40 bg-gradient-to-br from-[#f0fdf4]/95 via-white/95 to-[#eff6ff]/95 backdrop-blur-md shadow-2xl p-8 animate-fade-in">
                    <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-5 h-5 bg-[#f0fdf4] border-l border-t border-border/40 rotate-45 rounded-sm" />
                    <div className="grid grid-rows-4 grid-flow-col gap-x-12 gap-y-4 relative z-10">
                      {SERVICE_SECTORS.map((service) => {
                        const IconComponent = iconMap[service.icon] || LuBuilding2;
                        const styles = styleMap[service.value] || styleMap['others'];
                        const customIconSrc = customIconMap[service.value];

                        return (
                          <Link
                            key={service.value}
                            href={`/services/${service.value}`}
                            className={cn(
                              "group flex items-start gap-5 p-4 rounded-xl border-l-[3px] border-transparent transition-all duration-200",
                              styles.hoverBg,
                              styles.hoverBorder
                            )}
                            onClick={() => setServicesOpen(false)}
                          >
                            <div className={cn("w-18 h-18 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-200 shadow-sm border", styles.bg, styles.border)}>
                              {customIconSrc ? (
                                <img src={customIconSrc} alt={service.label} className="w-13 h-13 object-contain transition-transform duration-300 group-hover:scale-110" />
                              ) : (
                                <IconComponent className="w-8 h-8" />
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <p className={cn("text-[15px] font-bold text-slate-900 transition-colors duration-200", styles.hoverText)}>
                                  {service.label.replace(' Services', '')}
                                </p>
                                <LuArrowRight className={cn("w-3.5 h-3.5 opacity-0 -translate-x-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0", styles.text)} />
                              </div>
                              <p className="text-[13px] text-slate-500 mt-1 leading-relaxed line-clamp-2">
                                {service.description}
                              </p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link href="/info/careers" className="text-sm font-bold text-foreground hover:text-accent transition-colors">CAREERS</Link>
            <Link href="/contact" className="text-sm font-bold text-foreground hover:text-accent transition-colors">CONTACT</Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {isAuthenticated ? (
              <>
                {/* Desktop: full button */}
                <Link href="/affiliate/dashboard" className="hidden sm:block">
                  <Button className="bg-accent text-white hover:bg-accent/90 shadow-md shadow-accent/20 rounded-full px-5 h-10 cursor-pointer font-bold text-sm whitespace-nowrap">
                    DASHBOARD
                  </Button>
                </Link>
                {/* Mobile: compact icon button (visible only when menu is CLOSED) */}
                {!mobileMenuOpen && (
                  <Link href="/affiliate/dashboard" className="sm:hidden">
                    <button
                      className="flex items-center justify-center w-9 h-9 rounded-full bg-accent text-white shadow-md shadow-accent/20 flex-shrink-0"
                      title="Dashboard"
                    >
                      <LuLayoutDashboard className="w-4 h-4" />
                    </button>
                  </Link>
                )}
              </>
            ) : (
              <>
                {/* Desktop: Sign In text link */}
                <Link
                  href="/login"
                  className="hidden sm:flex items-center gap-1.5 text-sm font-bold text-foreground hover:text-accent transition-colors"
                >
                  SIGN IN
                </Link>
                {/* Sign Up button */}
                <Link href="/register">
                  <Button className="bg-foreground text-background hover:bg-foreground/90 shadow-md shadow-accent/20 rounded-full px-4 sm:px-6 h-9 sm:h-10 cursor-pointer font-bold text-[11px] sm:text-sm whitespace-nowrap">
                    SIGN UP
                  </Button>
                </Link>
              </>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden flex items-center justify-center w-9 h-9 text-foreground hover:bg-secondary/80 rounded-lg transition-colors flex-shrink-0"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <LuX className="w-5 h-5" /> : <LuMenu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* ── Mobile Slide-Down Menu ────────────────────────────────── */}
        <div
          className={cn(
            'md:hidden relative z-50 bg-card overflow-hidden transition-[max-height] duration-300 ease-in-out',
            mobileMenuOpen
              ? 'max-h-[80vh] border-b border-border shadow-2xl overflow-y-auto'
              : 'max-h-0'
          )}
        >
          <div className="flex flex-col px-4 pt-2 pb-6">

            {/* ── DASHBOARD BLOCK (Authenticated) — Most prominent ── */}
            {isAuthenticated && (
              <div className="mb-4 mt-2">
                <Link
                  href="/affiliate/dashboard"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 w-full bg-accent hover:bg-accent/90 active:bg-accent/80 text-white rounded-xl px-4 py-4 font-bold text-sm transition-all shadow-lg shadow-accent/25"
                >
                  <LuLayoutDashboard className="w-5 h-5 flex-shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-[15px] font-bold">Go to Dashboard</span>
                    <span className="text-white/70 text-xs font-normal">Your affiliate hub</span>
                  </div>
                </Link>
              </div>
            )}

            {/* ── About Us Accordion ── */}
            <div className="border-b border-border/50">
              <button
                className="w-full flex items-center justify-between py-4 text-sm font-bold text-foreground"
                onClick={() => setMobileAboutOpen(!mobileAboutOpen)}
              >
                ABOUT US
                <LuChevronDown
                  className={cn(
                    'w-4 h-4 text-muted-foreground transition-transform duration-200 flex-shrink-0',
                    mobileAboutOpen && 'rotate-180 text-accent'
                  )}
                />
              </button>
              <div
                className={cn(
                  'overflow-hidden transition-[max-height] duration-200 ease-in-out',
                  mobileAboutOpen ? 'max-h-48' : 'max-h-0'
                )}
              >
                <div className="flex flex-col pb-3 pl-2 gap-0.5">
                  <Link href="/about/who-we-are" onClick={closeMobileMenu} className="py-2.5 px-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-accent hover:bg-secondary/50 transition-colors">
                    Who We Are
                  </Link>
                  <Link href="/about/message-from-founder" onClick={closeMobileMenu} className="py-2.5 px-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-accent hover:bg-secondary/50 transition-colors">
                    Message from Founder
                  </Link>
                  <Link href="/about/our-team" onClick={closeMobileMenu} className="py-2.5 px-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-accent hover:bg-secondary/50 transition-colors">
                    Our Team
                  </Link>
                </div>
              </div>
            </div>

            {/* ── Services Accordion ── */}
            <div className="border-b border-border/50">
              <button
                className="w-full flex items-center justify-between py-4 text-sm font-bold text-foreground"
                onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
              >
                SERVICES
                <LuChevronDown
                  className={cn(
                    'w-4 h-4 text-muted-foreground transition-transform duration-200 flex-shrink-0',
                    mobileServicesOpen && 'rotate-180 text-accent'
                  )}
                />
              </button>
              <div
                className={cn(
                  'overflow-hidden transition-[max-height] duration-300 ease-in-out',
                  mobileServicesOpen ? 'max-h-[500px]' : 'max-h-0'
                )}
              >
                <div className="flex flex-col pb-3 pl-2 gap-0.5">
                  {SERVICE_SECTORS.map((service) => {
                    const IconComponent = iconMap[service.icon] || LuBuilding2;
                    const styles = styleMap[service.value] || styleMap['others'];
                    const customIconSrc = customIconMap[service.value];

                    return (
                      <Link
                        key={service.value}
                        href={`/services/${service.value}`}
                        onClick={closeMobileMenu}
                        className={cn(
                          "flex items-center gap-3 py-2.5 px-3 rounded-lg transition-colors group",
                          styles.hoverBg
                        )}
                      >
                        <div className={cn("w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors border shadow-xs", styles.bg, styles.border)}>
                          {customIconSrc ? (
                            <img src={customIconSrc} alt={service.label} className="w-8 h-8 object-contain" />
                          ) : (
                            <IconComponent className="w-5.5 h-5.5" />
                          )}
                        </div>
                        <span className={cn("text-sm font-semibold text-foreground transition-colors", styles.hoverText)}>
                          {service.label.replace(' Services', '')}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ── Simple links ── */}
            <Link
              href="/info/careers"
              onClick={closeMobileMenu}
              className="py-4 text-sm font-bold text-foreground hover:text-accent border-b border-border/50 transition-colors"
            >
              CAREERS
            </Link>
            <Link
              href="/contact"
              onClick={closeMobileMenu}
              className="py-4 text-sm font-bold text-foreground hover:text-accent border-b border-border/50 transition-colors"
            >
              CONTACT
            </Link>

            {/* ── Auth Actions (Not Authenticated) ── */}
            {!isAuthenticated && (
              <div className="pt-5 mt-1 flex flex-col gap-3">
                <Link
                  href="/login"
                  onClick={closeMobileMenu}
                  className="flex items-center justify-center gap-2 w-full border border-border rounded-xl px-4 py-3.5 text-sm font-bold text-foreground hover:bg-secondary/60 hover:text-accent hover:border-accent/40 transition-all"
                >
                  <LuLogIn className="w-4 h-4" />
                  SIGN IN
                </Link>
                <Link href="/register" onClick={closeMobileMenu} className="w-full">
                  <Button className="w-full bg-foreground text-background hover:bg-foreground/90 rounded-xl h-12 font-bold text-sm">
                    CREATE FREE ACCOUNT
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Decorative gradient line */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent" />
      </header>

      {/* Backdrop overlay when mobile menu is open */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px]"
          style={{ top: 'var(--navbar-height, 60px)' }}
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}

      {/* Global spacer to prevent fixed navbar from hiding content */}
      <div className="h-[76px] sm:h-[88px] w-full shrink-0 pointer-events-none" aria-hidden="true" />
    </>
  );
}