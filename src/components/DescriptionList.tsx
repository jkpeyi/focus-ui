import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../utils/cn';

export interface DescriptionItem {
  term: ReactNode;
  description: ReactNode;
  /** Span the full row in multi-column layouts. */
  fullWidth?: boolean;
}

export interface DescriptionListProps extends HTMLAttributes<HTMLDListElement> {
  items: DescriptionItem[];
  /** `grid` lays items in columns; `inline` uses label/value rows (record detail style). */
  layout?: 'grid' | 'inline';
  columns?: 1 | 2 | 3;
}

/** Key/value pairs for record details (customer, invoice, product…). */
export function DescriptionList({ items, layout = 'inline', columns = 2, className, ...props }: DescriptionListProps) {
  if (layout === 'inline') {
    return (
      <dl className={cn('divide-y divide-line', className)} {...props}>
        {items.map((item, i) => (
          <div key={i} className="grid grid-cols-1 gap-1 py-2.5 sm:grid-cols-[minmax(8rem,35%)_1fr] sm:gap-4">
            <dt className="text-[13px] text-fg-muted">{item.term}</dt>
            <dd className="min-w-0 text-[13px] text-fg">{item.description}</dd>
          </div>
        ))}
      </dl>
    );
  }
  return (
    <dl
      className={cn(
        'grid grid-cols-1 gap-x-6 gap-y-4',
        columns === 2 && 'sm:grid-cols-2',
        columns === 3 && 'sm:grid-cols-2 lg:grid-cols-3',
        className,
      )}
      {...props}
    >
      {items.map((item, i) => (
        <div key={i} className={cn('min-w-0', item.fullWidth && 'sm:col-span-full')}>
          <dt className="text-xs font-medium text-fg-muted">{item.term}</dt>
          <dd className="mt-1 text-sm text-fg">{item.description}</dd>
        </div>
      ))}
    </dl>
  );
}
