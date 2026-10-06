import { useId, type SVGProps } from 'react';
import { cn } from '../utils/cn';

export interface SparklineProps extends Omit<SVGProps<SVGSVGElement>, 'values'> {
  values: number[];
  /** Fill the area under the line with a soft gradient. */
  area?: boolean;
  strokeWidth?: number;
}

/** Tiny trend line. Color follows `currentColor` — set it with a text-* class. */
export function Sparkline({ values, area = true, strokeWidth = 1.75, className, ...props }: SparklineProps) {
  const id = useId();
  if (values.length < 2) return null;
  const w = 100;
  const h = 32;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const points = values.map((v, i) => [(i / (values.length - 1)) * w, h - 2 - ((v - min) / range) * (h - 4)] as const);
  const line = points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`).join(' ');
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      className={cn('h-8 w-full overflow-visible', className)}
      aria-hidden
      {...props}
    >
      {area && (
        <>
          <defs>
            <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="currentColor" stopOpacity={0.22} />
              <stop offset="100%" stopColor="currentColor" stopOpacity={0} />
            </linearGradient>
          </defs>
          <path d={`${line} L${w},${h} L0,${h} Z`} fill={`url(#${id})`} />
        </>
      )}
      <path
        d={line}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        vectorEffect="non-scaling-stroke"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
