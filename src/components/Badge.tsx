import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../utils/cn';

export type Tone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
  variant?: 'soft' | 'solid' | 'outline';
  size?: 'sm' | 'md';
  /** Leading status dot — great for order / invoice states. */
  dot?: boolean;
  icon?: ReactNode;
}

const soft: Record<Tone, string> = {
  neutral: 'bg-fill/14 text-fg-muted',
  accent: 'bg-accent/12 text-accent',
  success: 'bg-success/12 text-success',
  warning: 'bg-warning/12 text-warning',
  danger: 'bg-danger/10 text-danger',
  info: 'bg-info/12 text-info',
};
const solid: Record<Tone, string> = {
  neutral: 'bg-fg-muted text-surface',
  accent: 'bg-accent text-accent-fg',
  success: 'bg-success text-white',
  warning: 'bg-warning text-white',
  danger: 'bg-danger text-white',
  info: 'bg-info text-white',
};
const outline: Record<Tone, string> = {
  neutral: 'ring-line-strong text-fg-muted',
  accent: 'ring-accent/40 text-accent',
  success: 'ring-success/40 text-success',
  warning: 'ring-warning/40 text-warning',
  danger: 'ring-danger/40 text-danger',
  info: 'ring-info/40 text-info',
};
const dots: Record<Tone, string> = {
  neutral: 'bg-fg-subtle',
  accent: 'bg-accent',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
  info: 'bg-info',
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { tone = 'neutral', variant = 'soft', size = 'md', dot, icon, className, children, ...props },
  ref,
) {
  return (
    <span
      ref={ref}
      className={cn(
        'inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full font-medium leading-none [&_svg]:size-3',
        size === 'sm' ? 'h-5 px-2 text-[11px]' : 'h-6 px-2.5 text-xs',
        variant === 'soft' && soft[tone],
        variant === 'solid' && solid[tone],
        variant === 'outline' && cn('ring-1 ring-inset', outline[tone]),
        className,
      )}
      {...props}
    >
      {dot && <span aria-hidden className={cn('size-1.5 rounded-full', variant === 'solid' ? 'bg-current' : dots[tone])} />}
      {icon}
      {children}
    </span>
  );
});
