import { NextResponse } from 'next/server';

/**
 * Next.js Proxy — first line of defense for route protection.
 *
 * Runs on the server BEFORE any React component renders, so there is
 * never a flash of protected content for unauthenticated users.
 *
 * Rules:
 *  • /affiliate/*  → must have `accessToken` cookie, else redirect to /login
 *  • /admin/*      → must have a superadmin token, else redirect to /admin/login
 *  • /admin/login  → if a superadmin token exists, redirect to /admin/dashboard
 *  • /login, /register, /forgot-password → if cookie exists, redirect to that role's dashboard
 *  • Everything else (public pages, API routes, static files) → pass through
 *
 * The role is read from the JWT payload WITHOUT verifying the signature.
 * That is fine for routing decisions only — the backend verifies every
 * request, and AuthContext/ProtectedRoute re-check the user via /auth/me.
 */

const ADMIN_ROLE = 'superadmin';

function getTokenRole(token) {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
    return JSON.parse(atob(padded))?.role ?? null;
  } catch {
    return null;
  }
}

function dashboardFor(role) {
  return role === ADMIN_ROLE ? '/admin/dashboard' : '/affiliate/dashboard';
}

export default function proxy(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('accessToken')?.value;
  const role = token ? getTokenRole(token) : null;

  // ── Admin login page ────────────────────────────────────────
  if (pathname === '/admin/login') {
    if (token && role === ADMIN_ROLE) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // ── Protected admin routes ──────────────────────────────────
  if (pathname.startsWith('/admin')) {
    if (!token || role !== ADMIN_ROLE) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // ── Protected affiliate routes ──────────────────────────────
  if (pathname.startsWith('/affiliate')) {
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      // Preserve the intended destination so we can redirect after login
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Admins don't belong in the affiliate area — send them to their own dashboard
    if (role === ADMIN_ROLE) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }

    // Token exists — allow through (actual JWT validation happens in AuthContext + backend)
    return NextResponse.next();
  }

  // ── Auth pages — redirect authenticated users away ──────────
  const authPages = ['/login', '/register', '/forgot-password'];
  if (authPages.includes(pathname)) {
    if (token) {
      return NextResponse.redirect(new URL(dashboardFor(role), request.url));
    }
  }

  return NextResponse.next();
}

/**
 * Matcher — only run proxy on relevant routes.
 * Excludes API routes, static files, images, and Next.js internals.
 */
export const config = {
  matcher: [
    '/affiliate/:path*',
    '/admin/:path*',
    '/login',
    '/register',
    '/forgot-password',
  ],
};
