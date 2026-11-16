'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function ThemeAnimator() {
  const pathname = usePathname();

  useEffect(() => {
    // Check if it's not a dashboard or admin page (i.e. public pages)
    const isPublic = !pathname.startsWith('/affiliate') && !pathname.startsWith('/admin');
    
    if (isPublic) {
      document.documentElement.classList.add('theme-animate');
    } else {
      document.documentElement.classList.remove('theme-animate');
    }
    
    return () => {
      document.documentElement.classList.remove('theme-animate');
    };
  }, [pathname]);

  return null;
}
