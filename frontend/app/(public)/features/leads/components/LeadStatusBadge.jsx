import StatusBadge from '@/app/components/common/StatusBadge';

export default function LeadStatusBadge({ status, size = 'sm' }) {
  return <StatusBadge status={status} size={size} />;
}
