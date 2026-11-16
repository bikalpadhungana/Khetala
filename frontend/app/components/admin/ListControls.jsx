'use client';

import { useEffect, useState } from 'react';
import { LuSearch, LuChevronLeft, LuChevronRight } from 'react-icons/lu';
import { cn } from '@/app/lib/utils';

/** Text search box that reports its value after the user stops typing. */
export function SearchBox({ placeholder = 'Search…', onSearch, delay = 350 }) {
  const [value, setValue] = useState('');

  useEffect(() => {
    const t = setTimeout(() => onSearch(value.trim()), delay);
    return () => clearTimeout(t);
  }, [value, delay, onSearch]);

  return (
    <div className="relative w-full sm:w-72">
      <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="h-10 w-full rounded-lg border border-border bg-input-background pl-9 pr-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
      />
    </div>
  );
}

/** Pill-style status filter. options: [{ value, label }] — value '' means "all". */
export function FilterTabs({ options, value, onChange }) {
  return (
    <div className="flex gap-1 overflow-x-auto -mx-1 px-1">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={cn(
            'shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors',
            value === opt.value
              ? 'bg-primary text-primary-foreground border-primary'
              : 'bg-card text-muted-foreground border-border hover:text-foreground'
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

/** Previous/next pager driven by the API's { page, pages, total } pagination block. */
export function Pager({ pagination, onPage }) {
  const page = pagination?.page ?? 1;
  const pages = pagination?.pages ?? 1;
  const total = pagination?.total ?? 0;
  if (pages <= 1) return null;

  return (
    <div className="flex items-center justify-between gap-3 px-4 sm:px-5 py-3 border-t border-border text-xs text-muted-foreground">
      <span>
        Page {page} of {pages} · {total} total
      </span>
      <div className="flex gap-1">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPage(page - 1)}
          className="p-1.5 rounded-lg border border-border bg-card disabled:opacity-40 hover:bg-secondary"
          aria-label="Previous page"
        >
          <LuChevronLeft className="w-4 h-4" />
        </button>
        <button
          type="button"
          disabled={page >= pages}
          onClick={() => onPage(page + 1)}
          className="p-1.5 rounded-lg border border-border bg-card disabled:opacity-40 hover:bg-secondary"
          aria-label="Next page"
        >
          <LuChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
