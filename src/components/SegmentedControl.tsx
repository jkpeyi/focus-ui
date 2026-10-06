import { useRef, type KeyboardEvent, type ReactNode } from 'react';
import { cn } from '../utils/cn';
import { useControllableState } from '../hooks/useControllableState';
import { useIndicator } from './useIndicator';

export interface SegmentedOption {
  value: string;
  label: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
}

export interface SegmentedControlProps {
  options: SegmentedOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  size?: 'sm' | 'md';
  fullWidth?: boolean;
  'aria-label'?: string;
  className?: string;
}

/** macOS/iOS segmented control with a sliding selection thumb. */
export function SegmentedControl({
  options,
  value: valueProp,
  defaultValue,
  onValueChange,
  size = 'md',
  fullWidth,
  className,
  ...aria
}: SegmentedControlProps) {
  const [value, setValue] = useControllableState(valueProp, defaultValue ?? options[0]?.value ?? '', onValueChange);
  const containerRef = useRef<HTMLDivElement>(null);
  const indicator = useIndicator(containerRef, value);

  const onKeyDown = (event: KeyboardEvent) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const enabled = options.filter((o) => !o.disabled);
    const index = enabled.findIndex((o) => o.value === value);
    let next = index;
    if (event.key === 'ArrowRight') next = (index + 1) % enabled.length;
    if (event.key === 'ArrowLeft') next = (index - 1 + enabled.length) % enabled.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = enabled.length - 1;
    setValue(enabled[next].value);
    containerRef.current?.querySelector<HTMLElement>(`[data-value="${CSS.escape(enabled[next].value)}"]`)?.focus();
  };

  return (
    <div
      ref={containerRef}
      role="radiogroup"
      aria-label={aria['aria-label']}
      onKeyDown={onKeyDown}
      className={cn('relative isolate inline-flex rounded-[9px] bg-fill/12 p-0.5', fullWidth && 'flex w-full', className)}
    >
      {indicator && (
        <span
          aria-hidden
          className="absolute -z-10 rounded-[7px] bg-surface shadow-[0_3px_8px_rgb(0_0_0/0.12),0_0_0_0.5px_rgb(0_0_0/0.04)] transition-[left,width] duration-300 ease-spring dark:bg-fill/45"
          style={{ left: indicator.left, width: indicator.width, top: indicator.top, height: indicator.height }}
        />
      )}
      {options.map((option, i) => {
        const active = option.value === value;
        const prevActive = options[i - 1]?.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            data-active={active}
            data-value={option.value}
            tabIndex={active ? 0 : -1}
            disabled={option.disabled}
            onClick={() => setValue(option.value)}
            className={cn(
              'focus-ring relative inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-[7px] font-medium transition-colors duration-150 [&_svg]:size-3.5',
              'disabled:cursor-not-allowed disabled:opacity-40',
              size === 'sm' ? 'h-6 px-2.5 text-xs' : 'h-7 px-3.5 text-[13px]',
              fullWidth && 'flex-1',
              active ? 'text-fg' : 'text-fg-muted hover:text-fg',
              // Hairline separators between inactive neighbours, like macOS.
              i > 0 &&
                !active &&
                !prevActive &&
                'before:absolute before:top-1/4 before:left-0 before:h-1/2 before:w-px before:bg-fill/25',
            )}
          >
            {option.icon}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
