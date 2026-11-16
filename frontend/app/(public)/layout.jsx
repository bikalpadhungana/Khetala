import PublicNavbar from '@/app/components/common/PublicNavbar';
import PublicFooter from '@/app/components/common/PublicFooter';

export default function PublicLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <PublicNavbar />
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      <PublicFooter />
    </div>
  );
}
