import { forwardRef, type ReactNode, type SelectHTMLAttributes } from 'react';
import { cn } from '../utils/cn';
import { controlBase, controlSizes, type ControlSize } from './controlStyles';
import { useFieldControlProps } from './Field';
import { ChevronUpDownIcon } from './icons';

export interface SelectOption {
  value: string;
  label: ReactNode;
  disabled?: boolean;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  size?: ControlSize;
  invalid?: boolean;
  /** Shortcut for rendering <option>s. You can also pass children. */
  options?: SelectOption[];
  placeholder?: string;
}

/**
 * Native select with macOS-style chevrons. Native means perfect keyboard,
 * mobile and screen-reader support — the right default for large ERP forms.
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { size = 'md', invalid, options, placeholder, className, children, ...props },
  ref,
) {
  const { invalid: _invalid, ...fieldProps } = useFieldControlProps({ ...props, invalid });
  return (
    <div className="relative w-full">
      <select
        ref={ref}
        {...props}
        {...fieldProps}
        className={cn(controlBase, controlSizes[size], 'cursor-pointer appearance-none pr-8', className)}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options?.map((o) => (
          <option key={o.value} value={o.value} disabled={o.disabled}>
            {o.label as string}
          </option>
        ))}
        {children}
      </select>
      <ChevronUpDownIcon className="pointer-events-none absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2 text-fg-muted" />
    </div>
  );
});
