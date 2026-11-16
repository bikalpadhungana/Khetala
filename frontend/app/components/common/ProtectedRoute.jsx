'use client';

import { useAuth } from '@/app/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useLayoutEffect, useEffect, useState } from 'react';

/**
 * ProtectedRoute — secondary (client-side) defense layer.
 *
 * The primary guard is the Next.js middleware which blocks /affiliate/*
 * routes at the edge when no cookie is present. This component adds a
 * second check using React state, ensuring the user object is valid and
 * has the correct role.
 *
 * Uses useLayoutEffect instead of useEffect so the redirect fires
 * BEFORE the browser paints, preventing any flash of protected content.
 *
 * Safety timeout: if auth loading doesn't resolve within 15 seconds,
 * redirect to login to prevent an infinite spinner.
 */
export default function ProtectedRoute({
  children,
  role = 'affiliate',
  loginPath = '/login',
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [timedOut, setTimedOut] = useState(false);

  // Safety timeout: prevent infinite spinner if auth never resolves
  useEffect(() => {
    if (!loading) return; // Auth resolved — no timeout needed

    const timer = setTimeout(() => {
      setTimedOut(true);
    }, 15000);

    return () => clearTimeout(timer);
  }, [loading]);

  useLayoutEffect(() => {
    if (timedOut || (!loading && (!user || user.role !== role))) {
      const redirectPath = `${loginPath}?redirect=${encodeURIComponent(pathname)}`;
      router.replace(redirectPath);
    }
  }, [user, loading, router, timedOut, pathname, role, loginPath]);

  if (loading && !timedOut) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (timedOut || !user || user.role !== role) {
    // Return a loading spinner instead of null to prevent any layout flash
    // while useLayoutEffect redirect is in progress
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return children;
}

