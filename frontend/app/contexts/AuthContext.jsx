'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { LuServerCrash, LuRefreshCcw } from 'react-icons/lu';
import api from '../api/api';
import { setAuthCookie, getAuthCookie, removeAuthCookie } from '../lib/cookies';

const AuthContext = createContext(null);

/**
 * AuthProvider — manages session lifecycle with cookie + localStorage dual storage.
 *
 * Token is stored in:
 *  • Cookie   → so Next.js middleware can gate routes server-side
 *  • localStorage → so the Axios interceptor can attach the Bearer header
 *
 * Session lifecycle:
 *  1. On mount, read token from cookie (primary) or localStorage (fallback)
 *  2. If token exists, validate via GET /auth/me
 *  3. If validation fails, clear both stores and set user=null
 *  4. ProtectedRoute and middleware react to user=null / missing cookie
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [networkError, setNetworkError] = useState(false);
  const router = useRouter();

  /**
   * Persist token in both cookie and localStorage.
   */
  const persistToken = useCallback((token) => {
    setAuthCookie(token);
    localStorage.setItem('accessToken', token);
  }, []);

  /**
   * Clear token from both stores.
   */
  const clearToken = useCallback(() => {
    removeAuthCookie();
    localStorage.removeItem('accessToken');
  }, []);

  // ── Load user profile on mount ──────────────────────────────
  useEffect(() => {
    let cancelled = false;

    async function loadUser() {
      // Read token from cookie first, fall back to localStorage
      const token = getAuthCookie() || localStorage.getItem('accessToken');

      if (!token) {
        setLoading(false);
        return;
      }

      // Sync: ensure both stores have the token
      persistToken(token);

      try {
        // Race the API call against a 10-second timeout to prevent infinite loading
        const timeoutMs = 10000;
        const res = await Promise.race([
          api.get('/auth/me'),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('AUTH_TIMEOUT')), timeoutMs)
          ),
        ]);

        if (!cancelled && res.success && res.data) {
          setUser(res.data);
        } else if (!cancelled) {
          // Unexpected response shape — clear session
          clearToken();
          setUser(null);
        }
      } catch (err) {
        console.error('Failed to load user profile:', err);
        if (!cancelled) {
          if (err?.message === 'AUTH_TIMEOUT') {
            // Auth check timed out — don't clear the token (backend might be slow),
            // but allow the app to render so the user isn't stuck on a spinner.
            console.warn('Auth validation timed out — proceeding without user data');
            setUser(null);
          } else if (err?.statusCode === 401 || err?.status === 401 || err?.message?.toLowerCase().includes('unauthorized')) {
            clearToken();
            setUser(null);
          } else if (err?.message?.toLowerCase().includes('network error') || err?.code === 'ERR_NETWORK') {
            setNetworkError(true);
          }
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadUser();

    return () => {
      cancelled = true;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Listen for session-expired events from the API interceptor ──
  useEffect(() => {
    function handleSessionExpired() {
      clearToken();
      setUser(null);
      // Send admins back to the admin login, everyone else to the affiliate login
      window.location.href = window.location.pathname.startsWith('/admin')
        ? '/admin/login'
        : '/login';
    }

    window.addEventListener('auth:session-expired', handleSessionExpired);
    return () => {
      window.removeEventListener('auth:session-expired', handleSessionExpired);
    };
  }, [clearToken, router]);

  // ── Login ───────────────────────────────────────────────────
  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.success && res.data) {
        const { token, user: loggedInUser } = res.data;
        persistToken(token);
        setUser(loggedInUser);
        return { success: true, user: loggedInUser };
      }
      return { success: false, message: res.message || 'Login failed' };
    } catch (err) {
      console.error('Login request failed:', err);
      return {
        success: false,
        message: err.message || 'Invalid credentials or login failure.'
      };
    } finally {
      setLoading(false);
    }
  };

  // ── Register ────────────────────────────────────────────────
  const register = async (payload) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/register', payload);
      if (res.success) {
        return { success: true, message: res.message };
      }
      return { success: false, message: res.message || 'Registration failed' };
    } catch (err) {
      console.error('Registration failed:', err);
      let errorMsg = err.message || 'Registration error occurred.';
      if (err.errors && err.errors.length > 0) {
        errorMsg = err.errors[0].message;
      }
      return {
        success: false,
        message: errorMsg
      };
    } finally {
      setLoading(false);
    }
  };

  // ── Logout ──────────────────────────────────────────────────
  const logout = useCallback(() => {
    clearToken();
    setUser(null);
    // Use window.location.href to perform a hard navigation. This completely wipes the
    // Next.js client-side router cache, ensuring that hitting the "Back" button cannot 
    // retrieve a ghost copy of the protected dashboard from memory.
    window.location.href = '/';
  }, [clearToken]);

  // ── Forgot Password ────────────────────────────────────────
  const forgotPassword = async (email) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/forgot-password', { email });
      return { success: true, message: res.message || 'OTP sent successfully' };
    } catch (err) {
      console.error('Forgot password failed:', err);
      return {
        success: false,
        message: err.message || 'Failed to send OTP.'
      };
    } finally {
      setLoading(false);
    }
  };

  // ── Reset Password ─────────────────────────────────────────
  const resetPassword = async (email, otp, newPassword) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/reset-password', { email, otp, newPassword });
      return { success: true, message: res.message || 'Password reset successfully' };
    } catch (err) {
      console.error('Reset password failed:', err);
      return {
        success: false,
        message: err.message || 'Failed to reset password.'
      };
    } finally {
      setLoading(false);
    }
  };

  // Derived convenience boolean
  const isAuthenticated = !loading && !!user;

  if (networkError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="max-w-md w-full bg-card border border-border rounded-2xl shadow-xl p-8 text-center animate-fade-in">
          <div className="w-20 h-20 bg-danger/10 text-danger rounded-full flex items-center justify-center mx-auto mb-6">
            <LuServerCrash className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight mb-3">
            Service Unavailable
          </h1>
          <p className="text-muted-foreground mb-8">
            We are unable to connect to our servers right now. Please check your internet connection or try again later.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="w-full flex items-center justify-center gap-2 bg-accent text-white py-3.5 rounded-xl font-bold hover:bg-accent/90 transition-all active:scale-[0.98]"
          >
            <LuRefreshCcw className="w-5 h-5" />
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isAuthenticated,
      login,
      register,
      logout,
      setUser,
      forgotPassword,
      resetPassword,
      clearToken,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
