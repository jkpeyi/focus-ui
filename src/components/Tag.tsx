import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../utils/cn';
import { XIcon } from './icons';

export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  /** Shows a remove button. */
  onRemove?: () => void;
  icon?: ReactNode;
  /** Visual state for filter chips. */
  selected?: boolean;
}

/** Compact token for active filters, labels and multi-value fields. */
export function Tag({ onRemove, icon, selected, className, children, ...props }: TagProps) {
  return (
    <span
      className={cn(
        'inline-flex h-7 items-center gap-1.5 rounded-full border pr-1 pl-2.5 text-[13px] whitespace-nowrap [&_svg]:size-3.5',
        selected ? 'border-accent/30 bg-accent/10 text-accent' : 'border-line-strong bg-surface text-fg dark:bg-fill/10',
        !onRemove && 'pr-2.5',
        className,
      )}
      {...props}
    >
      {icon}
      {children}
      {onRemove && (
        <button
          type="button"
          aria-label="Remove"
          onClick={onRemove}
          className="focus-ring flex size-5 items-center justify-center rounded-full text-current/60 hover:bg-fill/14 hover:text-current"
        >
          <XIcon className="size-3" />
        </button>
      )}
    </span>
  );
}
