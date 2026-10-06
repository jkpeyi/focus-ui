import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../utils/cn';

export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  /** Accessible label announced to screen readers. */
  label?: string;
}

const sizes = { xs: 'size-3', sm: 'size-4', md: 'size-5', lg: 'size-8' };

/** Apple-style activity indicator (8 fading spokes). */
export const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(function Spinner(
  { size = 'md', label = 'Loading', className, ...props },
  ref,
) {
  return (
    <span ref={ref} role="status" aria-label={label} className={cn('inline-block shrink-0', sizes[size], className)} {...props}>
      <svg viewBox="0 0 24 24" className="size-full animate-fx-spin" aria-hidden>
        {Array.from({ length: 8 }).map((_, i) => (
          <rect
            key={i}
            x="11"
            y="2"
            width="2"
            height="6"
            rx="1"
            fill="currentColor"
            opacity={1 - i * 0.11}
            transform={`rotate(${-i * 45} 12 12)`}
          />
        ))}
      </svg>
    </span>
  );
});
