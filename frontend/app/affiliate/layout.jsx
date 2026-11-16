import Sidebar from '@/app/components/common/Sidebar';
import ProtectedRoute from '@/app/components/common/ProtectedRoute';

export default function AffiliateLayout({ children }) {
  return (
    <ProtectedRoute>
      <div className="h-screen overflow-hidden bg-background flex">
        <Sidebar />
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
