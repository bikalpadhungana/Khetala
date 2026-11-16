'use client';

import { usePathname } from 'next/navigation';
import { FaWhatsapp } from 'react-icons/fa';
import { cn } from '@/app/lib/utils';

export default function WhatsAppFloating() {
  const pathname = usePathname();
  
  // Hide the floating WhatsApp widget on affiliate dashboard, admin, and auth routes
  const isExcludedRoute = 
    pathname?.startsWith('/affiliate') || 
    pathname?.startsWith('/admin') ||
    pathname === '/login' ||
    pathname === '/register' ||
    pathname === '/forgot-password';
  
  if (isExcludedRoute) {
    return null;
  }

  // Official contact WhatsApp link (using Nepal country code prefix +977)
  const whatsappUrl = 'https://wa.me/9779856017621';

  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-30 flex items-center group">
      {/* Tooltip text showing on hover */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mr-3 px-3.5 py-2 rounded-xl border border-border bg-card shadow-md text-xs font-bold text-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 pointer-events-none group-hover:pointer-events-auto transition-all duration-300 select-none whitespace-nowrap"
      >
        Chat with us on WhatsApp
      </a>

      {/* Pulsing trigger button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-11 h-11 md:w-13 md:h-13 rounded-full bg-[#25d366] text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 relative cursor-pointer group-hover:shadow-[#25d366]/30 group-hover:shadow-xl"
        aria-label="Contact support on WhatsApp"
      >
        {/* Pulsing animation border */}
        <span className="absolute inset-0 rounded-full bg-[#25d366]/40 animate-ping opacity-75 pointer-events-none" style={{ animationDuration: '2.5s' }} />
        
        <FaWhatsapp className="w-6 h-6 md:w-7 md:h-7 relative z-10" />
      </a>
    </div>
  );
}
