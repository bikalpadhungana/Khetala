'use client';

import Sidebar from '@/app/components/common/Sidebar';
import ProtectedRoute from '@/app/components/common/ProtectedRoute';

/**
 * Layout for every authenticated admin page (/admin/*, except /admin/login,
 * which lives outside this route group so it isn't wrapped by the guard).
 */
export default function AdminLayout({ children }) {
  return (
    <ProtectedRoute role="superadmin" loginPath="/admin/login">
      <div className="h-screen overflow-hidden bg-background flex">
        <Sidebar variant="admin" />
        {/* pb-20 on mobile so content doesn't hide behind the bottom nav bar */}
        <main className="flex-1 min-w-0 overflow-y-auto pb-20 lg:pb-0">
          <div className="p-3 sm:p-4 md:p-8 max-w-7xl mx-auto animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
