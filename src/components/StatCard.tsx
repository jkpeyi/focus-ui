import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../utils/cn';
import { Card } from './Card';
import { Sparkline } from './Sparkline';
import { ArrowDownIcon, ArrowUpIcon } from './icons';

export interface StatCardProps extends HTMLAttributes<HTMLDivElement> {
  label: ReactNode;
  value: ReactNode;
  /** Relative change, e.g. 0.124 for +12.4%. */
  delta?: number;
  /** Text after the delta, e.g. "vs last month". */
  deltaLabel?: ReactNode;
  /** Set to true when a decrease is good (costs, DSO, returns…). */
  invertDelta?: boolean;
  icon?: ReactNode;
  trend?: number[];
  footer?: ReactNode;
}

/** KPI tile for dashboards: value, change vs. previous period and an optional sparkline. */
export function StatCard({
  label,
  value,
  delta,
  deltaLabel,
  invertDelta,
  icon,
  trend,
  footer,
  className,
  ...props
}: StatCardProps) {
  const positive = delta !== undefined && delta >= 0;
  const good = delta === undefined ? undefined : invertDelta ? !positive : positive;
  return (
    <Card className={cn('flex flex-col p-5', className)} {...props}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-[13px] font-medium text-fg-muted">{label}</span>
        {icon && (
          <span className="flex size-8 items-center justify-center rounded-lg bg-accent/10 text-accent [&_svg]:size-4">
            {icon}
          </span>
        )}
      </div>
      <div className="mt-2 text-[28px] leading-tight font-semibold tracking-[-0.025em] text-fg tabular-nums">{value}</div>
      {delta !== undefined && (
        <div className="mt-1 flex items-center gap-1.5 text-[13px]">
          <span
            className={cn('inline-flex items-center gap-0.5 font-semibold tabular-nums', good ? 'text-success' : 'text-danger')}
          >
            {positive ? <ArrowUpIcon className="size-3" /> : <ArrowDownIcon className="size-3" />}
            {Math.abs(delta * 100).toFixed(1)}%
          </span>
          {deltaLabel && <span className="text-fg-muted">{deltaLabel}</span>}
        </div>
      )}
      {trend && <Sparkline values={trend} className={cn('mt-4', good === false ? 'text-danger' : 'text-accent')} />}
      {footer && <div className="mt-4 border-t border-line pt-3 text-[13px] text-fg-muted">{footer}</div>}
    </Card>
  );
}
