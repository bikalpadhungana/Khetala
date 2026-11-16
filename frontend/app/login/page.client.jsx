'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { LuMail, LuLock, LuArrowRight } from 'react-icons/lu';
import AuthLayout from '@/app/components/common/AuthLayout';
import Input from '@/app/components/common/Input';
import Button from '@/app/components/common/Button';
import { useAuth } from '@/app/contexts/AuthContext';
import { toast } from 'react-hot-toast';

/**
 * Login screen variants. The same form serves affiliates (/login) and
 * superadmins (/admin/login); only the allowed role, redirect target and copy differ.
 */
const VARIANTS = {
  affiliate: {
    role: 'affiliate',
    defaultRedirect: '/affiliate/dashboard',
    deniedMessage: 'Access denied. Only affiliates are allowed to log in here.',
    welcome: 'Welcome to Think Tank Affiliates!',
    layoutTitle: 'Manage your leads and commissions in one place.',
    layoutSubtitle: 'Access your dedicated dashboard to track pipeline, view earnings, and manage your affiliate profile.',
    heading: 'Sign In',
    subheading: 'Welcome back to Think Tank Freelancing Hub',
    showRegister: true,
  },
  admin: {
    role: 'superadmin',
    defaultRedirect: '/admin/dashboard',
    deniedMessage: 'Access denied. This login is for administrators only.',
    welcome: 'Welcome back, admin!',
    layoutTitle: 'Run the Think Tank platform from one place.',
    layoutSubtitle: 'Approve affiliates, assign leads to businesses, and keep the referral pipeline moving.',
    heading: 'Admin Sign In',
    subheading: 'Restricted to Think Tank administrators',
    showRegister: false,
  },
};

export default function LoginClient({ variant = 'affiliate' }) {
  const config = VARIANTS[variant] || VARIANTS.affiliate;
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading, login, logout } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ email: '', password: '' });

  const isEmailValid = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email);

  // ── Redirect authenticated users away from login ────────────
  // This handles the case where a logged-in user navigates to /login
  // (e.g., via back button). The middleware also handles this, but this
  // is a client-side safety net for SPA navigations.
  // Where a signed-in user should land, or null if this login page doesn't
  // accept their role. Superadmins are always sent to the admin dashboard,
  // even when they sign in through the affiliate login at /login.
  const destinationFor = (u) => {
    if (!u) return null;
    if (u.role === config.role) return searchParams.get('redirect') || config.defaultRedirect;
    if (u.role === VARIANTS.admin.role) return VARIANTS.admin.defaultRedirect;
    return null;
  };
  const currentDestination = destinationFor(user);

  useEffect(() => {
    if (!loading && currentDestination) {
      router.replace(currentDestination);
    }
  }, [loading, currentDestination, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const result = await login(formData.email, formData.password);
    setSubmitting(false);

    if (result.success) {
      const destination = destinationFor(result.user);
      if (!destination) {
        const errorMsg = config.deniedMessage;
        setError(errorMsg);
        toast.error(errorMsg);
        logout();
        return;
      }
      const isAdmin = result.user.role === VARIANTS.admin.role;
      toast.success(isAdmin ? VARIANTS.admin.welcome : config.welcome);
      // Redirect to the originally intended page, or the role's dashboard
      router.replace(destination);
    } else {
      setError(result.message);
      toast.error(result.message || 'Invalid credentials or login failure.');
    }
  };

  // Show loading while auth state is hydrating
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If already authenticated, show spinner while redirect happens
  if (currentDestination) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <AuthLayout
      title={config.layoutTitle}
      subtitle={config.layoutSubtitle}
    >
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">{config.heading}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {config.subheading}
        </p>
      </div>

      {error && (
        <div className="mb-5 p-3 text-sm font-medium text-danger bg-danger-light border border-danger-border rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="relative">
          <Input
            label="Email Address"
            type="email"
            placeholder="name@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            className="pl-10"
          />
          <LuMail className="absolute left-3.5 top-[2.4rem] w-4 h-4 text-muted-foreground pointer-events-none" />
          {formData.email && !isEmailValid && (
            <p className="text-xs text-danger mt-1.5 ml-1">
              Please enter a valid email address format.
            </p>
          )}
        </div>

        <div className="relative">
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            className="pl-10"
          />
          <LuLock className="absolute left-3.5 top-[2.4rem] w-4 h-4 text-muted-foreground pointer-events-none" />
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-border text-accent focus:ring-accent/30"
            />
            <span className="text-sm font-medium text-foreground">Remember me</span>
          </label>
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-accent hover:text-accent/80 transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        <Button type="submit" className="w-full h-12 text-base mt-2" loading={submitting} disabled={!formData.password || (formData.email && !isEmailValid)}>
          Sign In
        </Button>
      </form>

      {config.showRegister && (
      <div className="mt-8 pt-6 border-t border-border text-center">
        <p className="text-sm text-muted-foreground">
          Dont have an account?{' '}
          <Link
            href="/register"
            className="font-medium text-foreground hover:text-accent transition-colors inline-flex items-center gap-1"
          >
            Apply now <LuArrowRight className="w-3 h-3" />
          </Link>
        </p>
      </div>
      )}



    </AuthLayout>
  );
}
