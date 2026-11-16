import { STATUS_STYLES } from '@/app/lib/constants';
import { cn } from '@/app/lib/utils';

export default function StatusBadge({ status, size = 'sm' }) {
  if (!status) return null;
  
  // Normalize (e.g. "pending" -> "Pending", "in progress" -> "In Progress")
  const normalizedStatus = status
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const style =
    STATUS_STYLES[normalizedStatus] || STATUS_STYLES[status] || 'bg-muted text-muted-foreground border-border';
  const sizeClass =
    size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm';

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full border',
        style,
        sizeClass
      )}
    >
      {normalizedStatus}
    </span>
  );
}
