'use client';

import Image from 'next/image';
import { LuLogOut, LuShieldCheck } from 'react-icons/lu';
import ProtectedRoute from '@/app/components/common/ProtectedRoute';
import { useAuth } from '@/app/contexts/AuthContext';

/**
 * Layout for every authenticated admin page (/admin/*, except /admin/login,
 * which lives outside this route group so it isn't wrapped by the guard).
 */
export default function AdminLayout({ children }) {
  const { user, logout } = useAuth();

  return (
    <ProtectedRoute role="superadmin" loginPath="/admin/login">
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-30 bg-card border-b border-border">
          <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative w-9 h-9 shrink-0">
                <Image src="/logo.ico" alt="Logo" fill unoptimized priority className="object-contain" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-foreground truncate">Think Tank Admin</div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground truncate">
                  <LuShieldCheck className="w-3.5 h-3.5 shrink-0" />
                  {user?.email}
                </div>
              </div>
            </div>
            <button
              onClick={logout}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-danger rounded-lg hover:bg-danger-light transition-colors"
            >
              <LuLogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </header>
        <main className="max-w-7xl mx-auto p-3 sm:p-4 md:p-8 animate-fade-in">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
