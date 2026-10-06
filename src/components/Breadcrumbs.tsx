import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../utils/cn';
import { ChevronRightIcon } from './icons';

export interface BreadcrumbItem {
  label: ReactNode;
  href?: string;
  onClick?: () => void;
}

export interface BreadcrumbsProps extends HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items, className, ...props }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn('min-w-0', className)} {...props}>
      <ol className="flex min-w-0 items-center gap-1 text-[13px] text-fg-muted">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          const content =
            !last && (item.href || item.onClick) ? (
              <a
                href={item.href}
                onClick={(e) => {
                  if (item.onClick) {
                    e.preventDefault();
                    item.onClick();
                  }
                }}
                className="focus-ring truncate rounded hover:text-fg"
              >
                {item.label}
              </a>
            ) : (
              <span aria-current={last ? 'page' : undefined} className={cn('truncate', last && 'font-medium text-fg')}>
                {item.label}
              </span>
            );
          return (
            <li
              key={i}
              className={cn('flex min-w-0 items-center gap-1', !last && 'max-sm:hidden', i === items.length - 2 && 'max-sm:flex')}
            >
              {content}
              {!last && <ChevronRightIcon className="size-3.5 shrink-0 text-fg-subtle" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
