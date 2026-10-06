import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../utils/cn';

export interface DividerProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
  /** Optional centered label, e.g. "or". */
  label?: ReactNode;
}

export function Divider({ orientation = 'horizontal', label, className, ...props }: DividerProps) {
  if (orientation === 'vertical') {
    return <div role="separator" aria-orientation="vertical" className={cn('w-px self-stretch bg-line', className)} {...props} />;
  }
  if (label) {
    return (
      <div role="separator" className={cn('flex items-center gap-3 text-xs text-fg-subtle', className)} {...props}>
        <span className="h-px flex-1 bg-line" />
        {label}
        <span className="h-px flex-1 bg-line" />
      </div>
    );
  }
  return <div role="separator" className={cn('h-px w-full bg-line', className)} {...props} />;
}
