import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../utils/cn';

type ProgressTone = 'accent' | 'success' | 'warning' | 'danger';
const fills: Record<ProgressTone, string> = {
  accent: 'bg-accent',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
};
const strokes: Record<ProgressTone, string> = {
  accent: 'text-accent',
  success: 'text-success',
  warning: 'text-warning',
  danger: 'text-danger',
};

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  tone?: ProgressTone;
  size?: 'sm' | 'md';
  label?: ReactNode;
  /** Show the percentage next to the label. */
  showValue?: boolean;
}

export function Progress({
  value,
  max = 100,
  tone = 'accent',
  size = 'md',
  label,
  showValue,
  className,
  ...props
}: ProgressProps) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className={cn('w-full', className)} {...props}>
      {(label || showValue) && (
        <div className="mb-1.5 flex items-center justify-between text-[13px]">
          <span className="text-fg">{label}</span>
          {showValue && <span className="text-fg-muted tabular-nums">{Math.round(pct)}%</span>}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        className={cn('overflow-hidden rounded-full bg-fill/16', size === 'sm' ? 'h-1' : 'h-1.5')}
      >
        <div
          className={cn('h-full rounded-full transition-[width] duration-500 ease-apple', fills[tone])}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export interface ProgressRingProps extends HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  size?: number;
  thickness?: number;
  tone?: ProgressTone;
  /** Content in the center. Defaults to the percentage. */
  children?: ReactNode;
}

/** Activity-ring style circular progress. */
export function ProgressRing({
  value,
  max = 100,
  size = 56,
  thickness = 6,
  tone = 'accent',
  className,
  children,
  ...props
}: ProgressRingProps) {
  const pct = Math.max(0, Math.min(1, value / max));
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      className={cn('relative inline-flex items-center justify-center', className)}
      style={{ width: size, height: size }}
      {...props}
    >
      <svg width={size} height={size} className={cn('-rotate-90', strokes[tone])}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.15}
          strokeWidth={thickness}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth={thickness}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct)}
          className="transition-[stroke-dashoffset] duration-700 ease-apple"
        />
      </svg>
      <span className="absolute text-xs font-semibold text-fg tabular-nums">{children ?? `${Math.round(pct * 100)}%`}</span>
    </div>
  );
}
