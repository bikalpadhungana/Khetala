
'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  LuLayoutDashboard,
  LuPlus,
  LuFileText,
  LuDollarSign,
  LuBell,
  LuUser,
  LuHeadphones,
  LuLogOut,
  LuMenu,
  LuX,
  LuChevronLeft,
  LuChevronRight,
  LuGlobe,

} from 'react-icons/lu';

import * as Dialog from '@radix-ui/react-dialog';

import { cn, getInitials } from '@/app/lib/utils';
import { useAuth } from '@/app/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import api from '@/app/api/api';

const iconMap = {
  LuLayoutDashboard,
  LuPlus,
  LuFileText,
  LuDollarSign,
  LuBell,
  LuUser,
  LuHeadphones,
};

const affiliateLinks = [
  { label: 'Dashboard',    href: '/affiliate/dashboard',    icon: 'LuLayoutDashboard' },
  { label: 'Submit Lead',  href: '/affiliate/submit-lead',  icon: 'LuPlus' },
  { label: 'My Leads',     href: '/affiliate/my-leads',     icon: 'LuFileText' },
  { label: 'Commission',   href: '/affiliate/commission',   icon: 'LuDollarSign' },
  { label: 'Notifications',href: '/affiliate/notifications',icon: 'LuBell' },
  { label: 'Profile',      href: '/affiliate/profile',      icon: 'LuUser' },
  { label: 'Support',      href: '/affiliate/support',      icon: 'LuHeadphones' },
];

// Bottom nav shows these 4 + "More" button
const BOTTOM_NAV_ITEMS = ['Dashboard', 'Submit Lead', 'My Leads', 'Commission'];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const [collapsed, setCollapsed]     = useState(false);
  const [mobileOpen, setMobileOpen]   = useState(false);  // drawer (legacy, kept for "More" sheet)
  const [moreOpen, setMoreOpen]       = useState(false);   // "More" slide-up sheet
  const [logoutOpen, setLogoutOpen]   = useState(false);

  const displayName  = user?.name  || 'User';
  const displayEmail = user?.email || '';

  // Close drawer on route change
  useEffect(() => {
    setMobileOpen(false);
    setMoreOpen(false);
  }, [pathname]);

  const { data: notificationsData } = useQuery({
    queryKey: ['notifications-unread-count'],
    queryFn: () => api.get('/notifications'),
    refetchInterval: 15000,
  });

  const unreadCount = notificationsData?.data?.unreadCount || 0;

  const navLinks = affiliateLinks.map((link) => {
    if (link.label === 'Notifications') {
      return { ...link, badge: unreadCount > 0 ? unreadCount : undefined };
    }
    return link;
  });

  const isActive = (href) => pathname === href || pathname.startsWith(href + '/');

  // ── Desktop sidebar content ─────────────────────────────────────
  const sidebarContent = (
    <div className="flex flex-col h-full bg-navy-900 text-sidebar-muted">
      {/* Header */}
      <div className={cn('flex items-center gap-3 px-4 py-5 border-b border-navy-700', collapsed && 'justify-center px-2')}>
        <div className="relative w-10 h-10 rounded-xl bg-accent flex items-center justify-center overflow-hidden flex-shrink-0">
          <Image src="/logo.ico" alt="Logo" fill unoptimized priority={true} className="object-contain" />
        </div>
        {!collapsed && (
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold text-white truncate">Think Tank</span>
            <span className="text-[0.6rem] uppercase tracking-[0.15em] text-sidebar-muted">Affiliate Hub</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {navLinks.map((link) => {
          const Icon = iconMap[link.icon];
          const active = isActive(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              title={collapsed ? link.label : undefined}
              className={cn(
                'group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                active
                  ? 'bg-accent text-white shadow-lg shadow-accent/20'
                  : 'text-sidebar-muted hover:bg-navy-800 hover:text-white',
                collapsed && 'justify-center px-2'
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && (
                <>
                  <span className="truncate">{link.label}</span>
                  {link.badge && (
                    <span className="ml-auto min-w-[20px] h-5 px-1.5 rounded-full bg-accent text-white text-[0.65rem] font-semibold flex items-center justify-center">
                      {link.badge}
                    </span>
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className={cn('border-t border-navy-700 px-3 py-4', collapsed && 'px-2')}>
        <div className={cn('flex items-center gap-3', collapsed && 'justify-center')}>
          <div className="w-10 h-10 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold flex-shrink-0">
            {getInitials(displayName)}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{displayName}</p>
              <p className="text-[0.7rem] text-sidebar-muted truncate">{displayEmail}</p>
            </div>
          )}
        </div>

        <div className={cn('mt-4 space-y-2', collapsed && 'flex flex-col items-center')}>
          <Link
            href="/"
            className={cn(
              'w-full flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-300',
              'bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500 hover:text-white hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/20',
              collapsed && 'w-10 h-10 p-0'
            )}
            title={collapsed ? 'Main Website' : undefined}
          >
            <LuGlobe className="w-4 h-4" />
            {!collapsed && <span>Main Website</span>}
          </Link>

          <button
            onClick={() => setLogoutOpen(true)}
            className={cn(
              'w-full flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-300',
              'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white hover:border-red-500 hover:shadow-lg hover:shadow-red-500/20',
              collapsed && 'w-10 h-10 p-0'
            )}
            title={collapsed ? 'Logout' : undefined}
          >
            <LuLogOut className="w-4 h-4" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>

        {/* Collapse Toggle — desktop only */}
        <button
          onClick={() => setCollapsed((prev) => !prev)}
          className="hidden lg:flex items-center justify-center w-full mt-3 py-2 rounded-xl text-sidebar-muted hover:bg-navy-800 hover:text-white transition-colors"
        >
          {collapsed ? <LuChevronRight className="w-4 h-4" /> : <LuChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* ── Desktop Sidebar ─────────────────────────────────────── */}
      <aside
        className={cn(
          'hidden lg:flex flex-col h-screen sticky top-0 transition-all duration-300',
          collapsed ? 'w-[72px]' : 'w-[260px]'
        )}
      >
        {sidebarContent}
      </aside>

      {/* ── Mobile Bottom Navigation Bar ─────────────────────────── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-navy-900 border-t border-navy-700 flex items-stretch bottom-nav-safe">
        {BOTTOM_NAV_ITEMS.map((label) => {
          const link = navLinks.find((l) => l.label === label);
          if (!link) return null;
          const Icon = iconMap[link.icon];
          const active = isActive(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex-1 flex flex-col items-center justify-center gap-1 py-2.5 px-1 text-[10px] font-semibold transition-colors relative',
                active ? 'text-white' : 'text-sidebar-muted hover:text-white'
              )}
            >
              {active && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-b-full bg-accent" />
              )}
              <div className={cn('w-6 h-6 flex items-center justify-center rounded-lg', active && 'text-accent')}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="leading-none truncate max-w-[56px]">{label}</span>
              {link.badge && (
                <span className="absolute top-1.5 right-[calc(50%-10px)] min-w-[16px] h-4 px-1 rounded-full bg-accent text-white text-[9px] font-bold flex items-center justify-center">
                  {link.badge}
                </span>
              )}
            </Link>
          );
        })}

        {/* More button — opens slide-up sheet */}
        <button
          onClick={() => setMoreOpen(true)}
          className="flex-1 flex flex-col items-center justify-center gap-1 py-2.5 px-1 text-[10px] font-semibold text-sidebar-muted hover:text-white transition-colors"
        >
          <div className="w-6 h-6 flex items-center justify-center">
            <LuMenu className="w-5 h-5" />
          </div>
          <span className="leading-none">More</span>
        </button>
      </nav>

      {/* ── "More" Slide-Up Sheet (mobile) ──────────────────────── */}
      {moreOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
            onClick={() => setMoreOpen(false)}
          />
          <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[70] bg-navy-900 rounded-t-2xl border-t border-navy-700 animate-slide-up pb-safe">
            {/* Handle bar */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-navy-700" />
            </div>

            {/* User info */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-navy-700">
              <div className="w-10 h-10 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold flex-shrink-0">
                {getInitials(displayName)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{displayName}</p>
                <p className="text-[0.7rem] text-sidebar-muted truncate">{displayEmail}</p>
              </div>
            </div>

            {/* Remaining nav links */}
            <div className="px-4 py-3 space-y-1">
              {navLinks
                .filter((l) => !BOTTOM_NAV_ITEMS.includes(l.label))
                .map((link) => {
                  const Icon = iconMap[link.icon];
                  const active = isActive(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMoreOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all',
                        active
                          ? 'bg-accent text-white'
                          : 'text-sidebar-muted hover:bg-navy-800 hover:text-white'
                      )}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <span>{link.label}</span>
                      {link.badge && (
                        <span className="ml-auto min-w-[20px] h-5 px-1.5 rounded-full bg-accent text-white text-[0.65rem] font-semibold flex items-center justify-center">
                          {link.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}

              {/* Main Website link */}
              <Link
                href="/"
                onClick={() => setMoreOpen(false)}
                className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-blue-400 hover:bg-navy-800 hover:text-blue-300 transition-all"
              >
                <LuGlobe className="w-5 h-5 flex-shrink-0" />
                <span>Main Website</span>
              </Link>
            </div>

            {/* Logout */}
            <div className="px-4 pb-4">
              <button
                onClick={() => { setMoreOpen(false); setLogoutOpen(true); }}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all"
              >
                <LuLogOut className="w-5 h-5 flex-shrink-0" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* ── Logout Dialog ─────────────────────────────────────────── */}
      <Dialog.Root open={logoutOpen} onOpenChange={setLogoutOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm animate-in fade-in-0" />
          <Dialog.Content
            className="
              fixed left-1/2 top-1/2 z-[100]
              w-[92%] max-w-md
              -translate-x-1/2 -translate-y-1/2
              rounded-2xl border border-white/10
              bg-[#0B1120]
              p-6
              shadow-2xl
              animate-in fade-in zoom-in-95
            "
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 text-red-400 flex-shrink-0">
                <LuLogOut className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <Dialog.Title className="text-lg font-semibold text-white">Confirm Logout</Dialog.Title>
                <Dialog.Description className="mt-2 text-sm leading-relaxed text-slate-400">
                  You are about to securely sign out of your Think Tank Affiliate Hub account.
                </Dialog.Description>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-end gap-3">
              <Dialog.Close asChild>
                <button className="rounded-xl border border-white/10 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-white/5 transition-colors">
                  Cancel
                </button>
              </Dialog.Close>
              <button
                onClick={() => { setLogoutOpen(false); logout(); }}
                className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
