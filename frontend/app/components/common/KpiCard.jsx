'use client';

import {
  LuArrowUpRight,
  LuArrowDownRight,
  LuMinus,
} from 'react-icons/lu';

const trendColors = {
  up: 'text-success',
  down: 'text-danger',
  neutral: 'text-muted-foreground',
};

const trendIcons = {
  up: LuArrowUpRight,
  down: LuArrowDownRight,
  neutral: LuMinus,
};

export default function KpiCard({
  title,
  value,
  change,
  trend = 'up',
  icon: Icon,
  iconColor = 'text-accent',
  isLoading = false,
}) {
  const TrendIcon = trendIcons[trend];

  if (isLoading) {
    return (
      <div
        className="bg-card border border-border rounded-lg p-4 sm:p-5"
        style={{ boxShadow: 'var(--shadow-card)' }}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="w-10 h-10 rounded-lg bg-muted animate-pulse" />
          <div className="w-16 h-4 rounded bg-muted animate-pulse" />
        </div>
        <div className="w-24 h-7 rounded bg-muted animate-pulse mb-1" />
        <div className="w-32 h-4 rounded bg-muted animate-pulse" />
      </div>
    );
  }

  return (
    <div
      className="bg-card border border-border rounded-lg p-4 sm:p-5"
      style={{ boxShadow: 'var(--shadow-card)' }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconColor} bg-accent/8`}>
          <Icon className="w-5 h-5" />
        </div>
        {change && (
          <div className={`flex items-center gap-0.5 text-xs font-medium ${trendColors[trend]}`}>
            <TrendIcon className="w-3.5 h-3.5" />
            {change}
          </div>
        )}
      </div>
      <div className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
        {value}
      </div>
      <p className="text-xs text-muted-foreground mt-0.5">{title}</p>
    </div>
  );
}
