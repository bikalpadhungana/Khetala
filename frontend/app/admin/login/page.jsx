import { Suspense } from 'react';
import LoginClient from '@/app/login/page.client';

export const metadata = {
  title: 'Admin Sign In',
  description: 'Administrator access to Think Tank Freelancing Hub',
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <LoginClient variant="admin" />
    </Suspense>
  );
}
