import AdminDashboardClient from './page.client';

export const metadata = {
  title: 'Admin Dashboard',
  description: 'Platform overview and pending approvals.',
  robots: { index: false, follow: false },
};

export default function AdminDashboardPage() {
  return <AdminDashboardClient />;
}
