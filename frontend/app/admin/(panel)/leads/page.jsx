import AdminLeadsClient from './page.client';

export const metadata = {
  title: 'Leads',
  description: 'All referred leads across the platform.',
  robots: { index: false, follow: false },
};

export default function AdminLeadsPage() {
  return <AdminLeadsClient />;
}
