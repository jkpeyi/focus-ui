import { forwardRef, useEffect, useRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '../utils/cn';
import { mergeRefs } from '../utils/ref';
import { useFieldControlProps } from './Field';
import { CheckIcon, MinusIcon } from './icons';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  label?: ReactNode;
  description?: ReactNode;
  indeterminate?: boolean;
  invalid?: boolean;
  onChange?: (checked: boolean, event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, description, indeterminate = false, invalid, className, onChange, ...props },
  ref,
) {
  const innerRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (innerRef.current) innerRef.current.indeterminate = indeterminate;
  }, [indeterminate]);
  const { invalid: _invalid, ...fieldProps } = useFieldControlProps({ ...props, invalid });

  const box = (
    <span className="relative inline-flex size-4 shrink-0 items-center justify-center">
      <input
        ref={mergeRefs(innerRef, ref)}
        type="checkbox"
        {...props}
        {...fieldProps}
        aria-checked={indeterminate ? 'mixed' : undefined}
        onChange={(e) => onChange?.(e.target.checked, e)}
        className={cn(
          'peer focus-ring size-4 cursor-pointer appearance-none rounded-[5px] border border-line-strong bg-surface shadow-[inset_0_1px_1px_rgb(0_0_0/0.04)]',
          'transition-colors duration-100 checked:border-accent checked:bg-accent indeterminate:border-accent indeterminate:bg-accent',
          'disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-danger dark:bg-fill/16',
          !label && className,
        )}
      />
      <CheckIcon className="pointer-events-none absolute size-3 text-accent-fg opacity-0 peer-checked:opacity-100 peer-indeterminate:opacity-0" />
      <MinusIcon className="pointer-events-none absolute size-3 text-accent-fg opacity-0 peer-indeterminate:opacity-100" />
    </span>
  );

  if (!label) return box;
  return (
    <label
      htmlFor={fieldProps.id}
      className={cn(
        'inline-flex cursor-pointer items-start gap-2.5 has-disabled:cursor-not-allowed has-disabled:opacity-60',
        className,
      )}
    >
      <span className="mt-0.5 flex">{box}</span>
      <span className="flex flex-col">
        <span className="text-sm text-fg">{label}</span>
        {description && <span className="text-xs text-fg-muted">{description}</span>}
      </span>
    </label>
  );
});
