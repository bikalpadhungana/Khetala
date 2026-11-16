import AdminAffiliatesClient from './page.client';

export const metadata = {
  title: 'Affiliates',
  description: 'Manage affiliate partners.',
  robots: { index: false, follow: false },
};

export default function AdminAffiliatesPage() {
  return <AdminAffiliatesClient />;
}
