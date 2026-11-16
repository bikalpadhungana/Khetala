'use client';

import { cn } from '@/app/lib/utils';

export default function DataTable({
  columns = [],
  data = [],
  emptyMessage = 'No data available',
  onRowClick,
}) {
  return (
    <>
      {/* ── Desktop Table View (md+) ─────────────────────────────── */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-secondary/40">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    'px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider',
                    col.className
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-5 py-12 text-center text-sm text-muted-foreground"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr
                  key={item.id || index}
                  className={cn(
                    'transition-colors hover:bg-secondary/30',
                    onRowClick && 'cursor-pointer'
                  )}
                  onClick={() => onRowClick?.(item)}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn('px-5 py-3.5 text-sm', col.className)}
                    >
                      {col.render ? col.render(item, index) : item[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── Mobile Card View (< md) ──────────────────────────────── */}
      <div className="md:hidden divide-y divide-border">
        {data.length === 0 ? (
          <div className="px-4 py-10 text-center text-sm text-muted-foreground">
            {emptyMessage}
          </div>
        ) : (
          data.map((item, index) => (
            <div
              key={item.id || index}
              className={cn(
                'p-4 bg-card hover:bg-secondary/30 transition-colors',
                onRowClick && 'cursor-pointer active:bg-secondary/50'
              )}
              onClick={() => onRowClick?.(item)}
            >
              {columns.map((col) => {
                const value = col.render ? col.render(item, index) : item[col.key];
                // Skip rendering if value is null/undefined/empty
                if (value === null || value === undefined || value === '') return null;
                return (
                  <div key={col.key} className="flex items-start justify-between gap-3 py-1">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex-shrink-0 w-28">
                      {col.header}
                    </span>
                    <div className="text-sm text-foreground text-right flex-1 min-w-0">
                      {value}
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        )}
      </div>
    </>
  );
}
