import Image from 'next/image';
import { cn } from '@/app/lib/utils';

const sizeClasses = { sm: 'w-12 h-12', md: 'w-14 h-14', lg: 'w-20 h-20' };
const bgClasses = {
  light: 'bg-white text-navy-900 border border-border shadow-sm',
  dark: 'bg-navy-900 text-white',
  accent: 'bg-accent text-white shadow-md',
  success: 'bg-success text-white shadow-md',
  transparent: 'bg-transparent',
};
const textClasses = { sm: 'text-base', md: 'text-xl', lg: 'text-2xl' };

export default function Logo({
  variant = 'accent',
  size = 'md',
  showText = true,
  textColor = '',
  className = '',
  ...props
}) {
  return (
    <div
      className={cn('flex items-center gap-3 select-none', className)}
      {...props}
    >
      <div
        className={cn(
          'flex items-center justify-center rounded-xl flex-shrink-0 relative overflow-hidden group',
          sizeClasses[size],
          bgClasses[variant]
        )}
      >
        <Image
          src="/logo.ico"
          alt="Think Tank Logo"
          fill
          unoptimized
          className="object-contain transform group-hover:scale-110 transition-transform duration-300"
        />
        {(variant === 'accent' || variant === 'success') && (
          <div className="absolute inset-0 bg-white/20 blur-md rounded-full scale-0 group-hover:scale-150 transition-transform duration-500 origin-center pointer-events-none" />
        )}
      </div>
      {showText && (
        <div className="flex items-center">
          <h1
            className={cn(
              'font-bold leading-none tracking-tight flex gap-x-1.5 whitespace-nowrap',
              textClasses[size]
            )}
          >
            <span className="text-[#0452a3]">Think Tank</span>
            <span className="text-[#003882]">Freelancing</span>
            <span className="text-[#2d9c22]">Hub</span>
          </h1>
        </div>
      )}
    </div>
  );
}
