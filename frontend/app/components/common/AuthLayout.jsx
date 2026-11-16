import Link from 'next/link';
import Logo from '@/app/components/common/Logo';
import { LuShieldCheck } from 'react-icons/lu';

export default function AuthLayout({
  children,
  title,
  subtitle,
  showFeatures = false,
}) {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Brand Panel (hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 bg-navy-900 flex-col justify-between p-12 relative overflow-hidden">
        {/* Decorative glows */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-success/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none" />
        
        <div className="relative z-10">
          <Link href="/">
            <Logo variant="accent" size="lg" textColor="text-white" />
          </Link>
        </div>
        
        <div className="relative z-10 max-w-lg mt-auto mb-auto">
          {showFeatures && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-white text-xs font-semibold uppercase tracking-wider mb-6">
              <LuShieldCheck className="w-4 h-4 text-success" />
              Affiliate Program
            </div>
          )}
          
          <h2 className="text-4xl font-bold text-white leading-tight tracking-tight mb-4">
            {title}
          </h2>
          
          {subtitle && (
            <p className="text-lg text-sidebar-muted mb-8">{subtitle}</p>
          )}

          {!showFeatures && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              Secure Enterprise Platform
            </div>
          )}

          {showFeatures && (
            <ul className="space-y-4">
              {[
                'Access 8 high-value service sectors',
                'Real-time commission tracking dashboard',
                'Professional support from our team',
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-sidebar-muted">
                  <div className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0">
                    <LuShieldCheck className="w-3 h-3 text-success" />
                  </div>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        <div className="relative z-10 text-xs text-sidebar-muted">
          © {new Date().getFullYear()} Think Tank Freelancing Hub. All rights reserved.
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-background relative">
        <div className="w-full max-w-md animate-fade-in relative z-10">
          {/* Mobile Logo */}
          <div className="flex justify-center mb-8 lg:hidden">
            <Link href="/">
              <Logo variant="accent" size="md" showText={false} />
            </Link>
          </div>
          
          {children}
        </div>
      </div>
    </div>
  );
}
