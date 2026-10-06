import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../utils/cn';
import type { Tone } from './Badge';

export interface TimelineItem {
  id?: string | number;
  title: ReactNode;
  description?: ReactNode;
  time?: ReactNode;
  icon?: ReactNode;
  tone?: Tone;
}

export interface TimelineProps extends HTMLAttributes<HTMLOListElement> {
  items: TimelineItem[];
}

const tones: Record<Tone, string> = {
  neutral: 'bg-fill/14 text-fg-muted',
  accent: 'bg-accent/12 text-accent',
  success: 'bg-success/12 text-success',
  warning: 'bg-warning/12 text-warning',
  danger: 'bg-danger/10 text-danger',
  info: 'bg-info/12 text-info',
};

/** Activity feed / audit trail for records. */
export function Timeline({ items, className, ...props }: TimelineProps) {
  return (
    <ol className={cn('relative', className)} {...props}>
      {items.map((item, i) => (
        <li key={item.id ?? i} className="relative flex gap-3 pb-5 last:pb-0">
          {i < items.length - 1 && <span aria-hidden className="absolute top-8 bottom-1 left-[13px] w-px bg-line-strong" />}
          <span
            className={cn(
              'flex size-7 shrink-0 items-center justify-center rounded-full ring-4 ring-surface [&_svg]:size-3.5',
              tones[item.tone ?? 'neutral'],
            )}
          >
            {item.icon ?? <span className="size-1.5 rounded-full bg-current" />}
          </span>
          <div className="min-w-0 flex-1 pt-1">
            <div className="flex flex-wrap items-baseline justify-between gap-x-3">
              <div className="text-[13px] text-fg">{item.title}</div>
              {item.time && <time className="text-xs text-fg-subtle tabular-nums">{item.time}</time>}
            </div>
            {item.description && <div className="mt-0.5 text-[13px] text-fg-muted">{item.description}</div>}
          </div>
        </li>
      ))}
    </ol>
  );
}
