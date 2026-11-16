import { cn } from '@/app/lib/utils';

export default function Card({
  children,
  className = '',
  interactive = false,
}) {
  return (
    <div
      className={cn(
        'bg-card border border-border rounded-lg',
        interactive && 'card-interactive cursor-pointer',
        className
      )}
      style={{ boxShadow: 'var(--shadow-card)' }}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }) {
  return (
    <div className={cn('px-6 py-4 border-b border-border', className)}>
      {children}
    </div>
  );
}

export function CardContent({ children, className = '' }) {
  return <div className={cn('p-6', className)}>{children}</div>;
}

export function CardTitle({ children, className = '' }) {
  return (
    <h3 className={cn('text-base font-semibold text-card-foreground', className)}>
      {children}
    </h3>
  );
}
