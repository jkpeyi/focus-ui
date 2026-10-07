import { useState } from 'react';
import { cn } from '@jkpeyi/focus-ui';

export interface BarChartProps {
  values: number[];
  labels: string[];
  format?: (v: number) => string;
  height?: number;
  className?: string;
}

/**
 * Single-series column chart for the demo (not part of the library API).
 * Thin bars with rounded data-ends anchored to the baseline, recessive grid,
 * per-bar hover tooltip and an accessible table fallback.
 */
export function BarChart({ values, labels, format = String, height = 220, className }: BarChartProps) {
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(...values) * 1.1;
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => Math.round(max * t));
  return (
    <div className={cn('relative', className)}>
      <div className="flex" style={{ height }}>
        <div className="flex w-10 flex-col-reverse justify-between pb-6 text-right text-[11px] text-fg-subtle tabular-nums">
          {ticks.map((t) => (
            <span key={t} className="-translate-y-1/2 pr-2 leading-none first:translate-y-0">
              {format(t)}
            </span>
          ))}
        </div>
        <div className="relative flex-1">
          <div className="absolute inset-x-0 top-0 bottom-6 flex flex-col justify-between" aria-hidden>
            {ticks.map((t) => (
              <div key={t} className="h-px bg-line" />
            ))}
          </div>
          <div className="absolute inset-x-0 top-0 bottom-6 flex items-end gap-[2px]">
            {values.map((v, i) => (
              <div
                key={i}
                className="group relative flex h-full flex-1 items-end justify-center"
                onPointerEnter={() => setHover(i)}
                onPointerLeave={() => setHover(null)}
              >
                <div
                  className={cn(
                    'w-full max-w-7 rounded-t-[4px] transition-[background-color,height] duration-500 ease-apple',
                    hover === null || hover === i ? 'bg-accent' : 'bg-accent/35',
                  )}
                  style={{ height: `${(v / max) * 100}%` }}
                />
                {hover === i && (
                  <div
                    className="pointer-events-none absolute z-10 mb-2 rounded-lg bg-elevated px-2.5 py-1.5 text-xs whitespace-nowrap shadow-popover"
                    style={{ bottom: `${(v / max) * 100}%` }}
                  >
                    <div className="text-fg-muted">{labels[i]}</div>
                    <div className="font-semibold text-fg tabular-nums">{format(v)}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="absolute inset-x-0 bottom-0 flex gap-[2px] text-[11px] text-fg-subtle">
            {labels.map((l, i) => (
              <span key={l} className={cn('flex-1 text-center', i % 2 === 1 && 'max-sm:invisible')}>
                {l}
              </span>
            ))}
          </div>
        </div>
      </div>
      <table className="sr-only">
        <tbody>
          {values.map((v, i) => (
            <tr key={i}>
              <th>{labels[i]}</th>
              <td>{format(v)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
