import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../utils/cn';
import { CheckIcon } from './icons';

export interface Step {
  label: ReactNode;
  description?: ReactNode;
}

export interface StepperProps extends HTMLAttributes<HTMLOListElement> {
  steps: Step[];
  /** 0-based index of the current step. Steps before it are complete. */
  current: number;
  orientation?: 'horizontal' | 'vertical';
  /** Mark the current step as failed (e.g. rejected approval). */
  error?: boolean;
}

/** Workflow progress — order lifecycle, approval chains, onboarding wizards. */
export function Stepper({ steps, current, orientation = 'horizontal', error, className, ...props }: StepperProps) {
  const vertical = orientation === 'vertical';
  return (
    <ol
      className={cn('flex', vertical ? 'flex-col' : 'flex-col gap-4 sm:flex-row sm:items-start sm:gap-0', className)}
      {...props}
    >
      {steps.map((step, i) => {
        const status = i < current ? 'complete' : i === current ? (error ? 'error' : 'current') : 'upcoming';
        const last = i === steps.length - 1;
        return (
          <li
            key={i}
            aria-current={status === 'current' ? 'step' : undefined}
            className={cn('relative flex gap-3', vertical ? 'pb-6 last:pb-0' : 'sm:flex-1 sm:flex-col sm:gap-2')}
          >
            {!last && (
              <span
                aria-hidden
                className={cn(
                  'absolute',
                  vertical
                    ? 'top-7 bottom-1 left-[11px] w-0.5'
                    : 'max-sm:top-7 max-sm:-bottom-3 max-sm:left-[11px] max-sm:w-0.5 sm:top-[11px] sm:right-2 sm:left-9 sm:h-0.5',
                  'rounded-full',
                  i < current ? 'bg-accent' : 'bg-fill/20',
                )}
              />
            )}
            <span
              className={cn(
                'relative z-[1] flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold tabular-nums transition-colors',
                status === 'complete' && 'bg-accent text-accent-fg',
                status === 'current' && 'bg-surface text-accent ring-2 ring-accent',
                status === 'error' && 'bg-danger text-white',
                status === 'upcoming' && 'bg-surface text-fg-subtle ring-1 ring-line-strong',
              )}
            >
              {status === 'complete' ? <CheckIcon className="size-3.5" /> : status === 'error' ? '!' : i + 1}
            </span>
            <span className={cn('flex flex-col', !vertical && 'sm:pr-4')}>
              <span
                className={cn(
                  'text-[13px] font-medium',
                  status === 'upcoming' ? 'text-fg-muted' : 'text-fg',
                  status === 'error' && 'text-danger',
                )}
              >
                {step.label}
              </span>
              {step.description && <span className="text-xs text-fg-muted">{step.description}</span>}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
