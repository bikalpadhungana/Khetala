import axios from 'axios';
import { getAuthCookie, removeAuthCookie } from '../lib/cookies';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
});

// ── Request interceptor: attach Bearer token ──────────────────
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    // Read from cookie (primary) or localStorage (fallback)
    const token = getAuthCookie() || localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// ── Response interceptor: handle 401 gracefully ───────────────
api.interceptors.response.use(
  (response) => {
    // Return response.data to strip the axios wrapper
    return response.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        // Don't clear tokens on auth endpoints — let the login/register form
        // handle its own error display instead of disrupting the session.
        const url = error.config?.url || '';
        const isAuthEndpoint =
          url.includes('/auth/login') ||
          url.includes('/auth/register') ||
          url.includes('/auth/forgot-password') ||
          url.includes('/auth/reset-password');

        if (!isAuthEndpoint) {
          // Clear the token from both stores.
          // We do NOT do window.location.href here — that causes a full page
          // reload which nukes React state and creates the "auto-login" bug.
          //
          // Instead, clearing the token causes:
          //  1. Subsequent API calls to fail (no Bearer header)
          //  2. AuthContext to detect user=null on next re-render
          //  3. ProtectedRoute to redirect to /login
          //  4. Next.js middleware to block /affiliate/* on next navigation
          removeAuthCookie();
          localStorage.removeItem('accessToken');

          // Dispatch a custom event so AuthContext can react immediately
          // without waiting for the next API call or re-render cycle.
          window.dispatchEvent(new CustomEvent('auth:session-expired'));
        }
      }
    }
    return Promise.reject(error.response?.data || error);
  }
);

export default api;
