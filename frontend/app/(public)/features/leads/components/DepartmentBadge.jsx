import { SERVICE_DEPARTMENTS } from '@/app/lib/constants';
import { cn } from '@/app/lib/utils';
import { departmentTone, iconMap } from './leadUi';

export default function DepartmentBadge({ departmentSlug, department, compact = false }) {
  const item = department || SERVICE_DEPARTMENTS.find((entry) => entry.slug === departmentSlug);
  const Icon = iconMap[item?.icon] || iconMap.LuBriefcase;

  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full border font-medium', compact ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm', departmentTone[item?.color] || departmentTone.zinc)}>
      <Icon className={compact ? 'h-3.5 w-3.5' : 'h-4 w-4'} />
      {item?.title || 'Unassigned'}
    </span>
  );
}
