import type { HTMLAttributes } from 'react';
import { cn } from '../utils/cn';

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  /** Render `lines` stacked text placeholders. */
  lines?: number;
  circle?: boolean;
}

const shimmer =
  'animate-fx-shimmer bg-[linear-gradient(90deg,color-mix(in_srgb,var(--fx-fill)_12%,transparent)_0%,color-mix(in_srgb,var(--fx-fill)_22%,transparent)_50%,color-mix(in_srgb,var(--fx-fill)_12%,transparent)_100%)] bg-[length:200%_100%]';

export function Skeleton({ lines, circle, className, ...props }: SkeletonProps) {
  if (lines && lines > 1) {
    return (
      <div className={cn('space-y-2', className)} aria-hidden {...props}>
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className={cn('h-3 rounded-md', shimmer, i === lines - 1 && 'w-3/5')} />
        ))}
      </div>
    );
  }
  return <div aria-hidden className={cn('h-3 rounded-md', shimmer, circle && 'rounded-full', className)} {...props} />;
}
