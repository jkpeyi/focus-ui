import { useId, type ReactNode } from 'react';
import { cn } from '../utils/cn';
import { useControllableState } from '../hooks/useControllableState';

export interface RadioOption {
  value: string;
  label: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
}

export interface RadioGroupProps {
  options: RadioOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  name?: string;
  orientation?: 'vertical' | 'horizontal';
  /** `cards` renders each option as a selectable tile (e.g. shipping method, plan). */
  variant?: 'default' | 'cards';
  label?: ReactNode;
  disabled?: boolean;
  className?: string;
}

export function RadioGroup({
  options,
  value: valueProp,
  defaultValue = '',
  onValueChange,
  name,
  orientation = 'vertical',
  variant = 'default',
  label,
  disabled,
  className,
}: RadioGroupProps) {
  const [value, setValue] = useControllableState(valueProp, defaultValue, onValueChange);
  const autoName = useId();
  const groupName = name ?? autoName;
  const labelId = `${autoName}-label`;

  return (
    <div role="radiogroup" aria-labelledby={label ? labelId : undefined} className={className}>
      {label && (
        <div id={labelId} className="mb-2 text-[13px] font-medium text-fg">
          {label}
        </div>
      )}
      <div
        className={cn(
          'flex gap-3',
          orientation === 'vertical' ? 'flex-col' : 'flex-wrap',
          variant === 'cards' &&
            orientation === 'horizontal' &&
            'grid grid-cols-1 sm:grid-cols-[repeat(auto-fit,minmax(10rem,1fr))]',
        )}
      >
        {options.map((option) => {
          const checked = option.value === value;
          const isDisabled = disabled || option.disabled;
          return (
            <label
              key={option.value}
              className={cn(
                'group flex cursor-pointer items-start gap-2.5',
                isDisabled && 'cursor-not-allowed opacity-50',
                variant === 'cards' &&
                  'rounded-xl border border-line-strong bg-surface p-3.5 transition-[border-color,box-shadow] duration-150 hover:border-fg-subtle/60 has-checked:border-accent has-checked:ring-[3px] has-checked:ring-accent/15 dark:bg-fill/8',
              )}
            >
              <input
                type="radio"
                name={groupName}
                value={option.value}
                checked={checked}
                disabled={isDisabled}
                onChange={() => setValue(option.value)}
                className={cn(
                  'focus-ring mt-0.5 size-4 shrink-0 cursor-pointer appearance-none rounded-full border border-line-strong bg-surface transition-all duration-150',
                  'checked:border-[5px] checked:border-accent checked:bg-white disabled:cursor-not-allowed dark:bg-fill/16 dark:checked:bg-white',
                )}
              />
              <span className="flex flex-col">
                <span className="text-sm text-fg">{option.label}</span>
                {option.description && <span className="text-xs text-fg-muted">{option.description}</span>}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
