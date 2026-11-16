'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { LuArrowUp } from 'react-icons/lu';
import { cn } from '@/app/lib/utils';

export default function ScrollToTop() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);

  // Instantly scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  // Monitor scroll height to show/hide button
  useEffect(() => {
    const toggleVisibility = () => {
      // Check if user is near the bottom of the page (within 500px)
      const scrollPosition = window.scrollY + window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      if (window.scrollY > 300 && documentHeight - scrollPosition < 600) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={cn(
        'fixed bottom-24 right-7 z-50 flex items-center justify-center rounded-full w-11 h-11',
        'bg-card/90 backdrop-blur-sm border border-border text-foreground',
        'hover:bg-accent hover:text-white hover:border-accent shadow-md hover:shadow-lg',
        'transition-all duration-300 hover:-translate-y-1 cursor-pointer active:scale-95',
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none'
      )}
      aria-label="Scroll to top"
    >
      <LuArrowUp className="w-5 h-5" />
    </button>
  );
}
