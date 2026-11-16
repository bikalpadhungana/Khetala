'use client';

import { useState, useRef, useEffect } from 'react';
import {
  LuBriefcase,
  LuCar,
  LuChevronDown,
  LuCode,
  LuCompass,
  LuGraduationCap,
  LuHouse,
  LuPenTool,
  LuUsers,
} from 'react-icons/lu';
import { cn } from '@/app/lib/utils';
import { SERVICE_DEPARTMENTS } from '@/app/lib/constants';

const iconMap = {
  LuBriefcase,
  LuCar,
  LuCode,
  LuCompass,
  LuGraduationCap,
  LuHouse,
  LuPenTool,
  LuUsers,
};

const sectors = SERVICE_DEPARTMENTS.map((department) => ({
  value: department.slug,
  label: department.title,
  description: department.description,
  icon: department.icon,
}));

export default function CustomDropdown({
  value,
  onChange,
  label,
  placeholder = 'Select a service sector',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selected = sectors.find((s) => s.value === value);
  const SelectedIcon = selected ? iconMap[selected.icon] : null;

  return (
    <div className="flex flex-col gap-1.5" ref={ref}>
      {label && (
        <label className="text-sm font-medium text-foreground">{label}</label>
      )}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen((v) => !v)}
          className={cn(
            'h-10 w-full rounded-lg border border-border bg-input-background',
            'px-3 py-2 text-sm text-left flex items-center gap-2',
            'focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent',
            'transition-all cursor-pointer',
            !selected && 'text-muted-foreground'
          )}
        >
          {SelectedIcon && <SelectedIcon className="w-4 h-4 text-accent flex-shrink-0" />}
          <span className="flex-1 truncate">
            {selected ? selected.label : placeholder}
          </span>
          <LuChevronDown
            className={cn(
              'w-4 h-4 text-muted-foreground transition-transform',
              isOpen && 'rotate-180'
            )}
          />
        </button>

        {isOpen && (
          <div
            className="absolute top-full left-0 right-0 mt-1 z-20 bg-card border border-border rounded-lg py-1 animate-fade-in"
            style={{ boxShadow: 'var(--shadow-elevated)' }}
          >
            {sectors.map((sector) => {
              const Icon = iconMap[sector.icon] || LuBriefcase;
              return (
                <button
                  key={sector.value}
                  type="button"
                  onClick={() => {
                    onChange?.(sector.value);
                    setIsOpen(false);
                  }}
                  className={cn(
                    'flex items-center gap-3 w-full px-3 py-2.5 text-sm text-left',
                    'hover:bg-secondary transition-colors',
                    value === sector.value && 'bg-accent/5 text-accent'
                  )}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="min-w-0">
                    <span className="block font-medium">{sector.label}</span>
                    <span className="block text-xs text-muted-foreground truncate">
                      {sector.description}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
