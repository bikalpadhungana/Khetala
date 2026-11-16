import { Suspense } from 'react';
import LoginClient from './page.client';

export const metadata = {
  title: 'Sign In',
  description: 'Access your Think Tank account',
};

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <LoginClient />
    </Suspense>
  );
}
