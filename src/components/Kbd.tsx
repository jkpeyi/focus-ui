import type { HTMLAttributes } from 'react';
import { cn } from '../utils/cn';

export function Kbd({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return (
    <kbd
      className={cn(
        'inline-flex h-5 min-w-5 items-center justify-center rounded-[5px] border border-line-strong bg-surface-2 px-1 font-sans text-[11px] font-medium text-fg-muted shadow-[0_1px_0_var(--fx-line-strong)]',
        className,
      )}
      {...props}
    />
  );
}
