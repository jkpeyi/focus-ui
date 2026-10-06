import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '../utils/cn';
import { controlBase, controlSizes, type ControlSize } from './controlStyles';
import { useFieldControlProps } from './Field';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> {
  size?: ControlSize;
  invalid?: boolean;
  /** Icon or text inside the control, before the value (e.g. a search icon or "$"). */
  prefix?: ReactNode;
  /** Icon or text inside the control, after the value (e.g. "kg", "USD"). */
  suffix?: ReactNode;
  /** Right-align the value — use for amounts and quantities. */
  numeric?: boolean;
  /** Classes for the outer wrapper (only rendered with prefix/suffix). */
  wrapperClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { size = 'md', invalid, prefix, suffix, numeric, className, wrapperClassName, ...props },
  ref,
) {
  const { invalid: isInvalid, ...fieldProps } = useFieldControlProps({ ...props, invalid });
  const input = (
    <input
      ref={ref}
      {...props}
      {...fieldProps}
      className={cn(
        controlBase,
        controlSizes[size],
        numeric &&
          'text-right tabular-nums [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
        prefix && 'pl-8',
        suffix && 'pr-10',
        className,
      )}
    />
  );
  if (!prefix && !suffix) return input;
  return (
    <div className={cn('relative flex w-full items-center', isInvalid && 'text-danger', wrapperClassName)}>
      {prefix && (
        <span className="pointer-events-none absolute left-2.5 flex items-center text-[13px] text-fg-subtle [&_svg]:size-4">
          {prefix}
        </span>
      )}
      {input}
      {suffix && <span className="absolute right-2.5 flex items-center text-[13px] text-fg-subtle [&_svg]:size-4">{suffix}</span>}
    </div>
  );
});
