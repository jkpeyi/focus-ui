import { createContext, useContext, useId, type HTMLAttributes, type LabelHTMLAttributes, type ReactNode } from 'react';
import { cn } from '../utils/cn';

interface FieldContextValue {
  id: string;
  descriptionId?: string;
  errorId?: string;
  invalid?: boolean;
  required?: boolean;
  disabled?: boolean;
}

const FieldContext = createContext<FieldContextValue | null>(null);

/** Returns ids & state from the closest <Field>, so controls wire up labels and ARIA automatically. */
export function useField() {
  return useContext(FieldContext);
}

/** Shared props for any control rendered inside a <Field>. */
export function useFieldControlProps(props: {
  id?: string;
  disabled?: boolean;
  required?: boolean;
  invalid?: boolean;
  'aria-describedby'?: string;
}) {
  const field = useField();
  const describedBy =
    [props['aria-describedby'], field?.descriptionId, field?.invalid ? field.errorId : undefined].filter(Boolean).join(' ') ||
    undefined;
  const invalid = props.invalid ?? field?.invalid;
  return {
    id: props.id ?? field?.id,
    disabled: props.disabled ?? field?.disabled,
    required: props.required ?? field?.required,
    invalid,
    'aria-invalid': invalid || undefined,
    'aria-describedby': describedBy,
  };
}

export function Label({
  className,
  children,
  required,
  ...props
}: LabelHTMLAttributes<HTMLLabelElement> & { required?: boolean }) {
  return (
    <label className={cn('text-[13px] font-medium text-fg', className)} {...props}>
      {children}
      {required && (
        <span aria-hidden className="ml-0.5 text-danger">
          *
        </span>
      )}
    </label>
  );
}

export interface FieldProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  label?: ReactNode;
  /** Helper text under the control. */
  description?: ReactNode;
  /** Error message. Presence marks the control invalid. */
  error?: ReactNode;
  required?: boolean;
  disabled?: boolean;
  /** Optional content aligned to the right of the label (e.g. "Optional", a link). */
  labelAside?: ReactNode;
  /** `horizontal` places the label to the left on ≥sm screens — ideal for dense ERP forms. */
  orientation?: 'vertical' | 'horizontal';
  id?: string;
  children: ReactNode;
}

export function Field({
  label,
  description,
  error,
  required,
  disabled,
  labelAside,
  orientation = 'vertical',
  id: idProp,
  className,
  children,
  ...props
}: FieldProps) {
  const autoId = useId();
  const id = idProp ?? `fx-${autoId}`;
  const descriptionId = description ? `${id}-desc` : undefined;
  const errorId = `${id}-err`;
  const invalid = Boolean(error);

  return (
    <FieldContext.Provider value={{ id, descriptionId, errorId, invalid, required, disabled }}>
      <div
        className={cn(
          'flex flex-col gap-1.5',
          orientation === 'horizontal' && 'sm:grid sm:grid-cols-[minmax(8rem,12rem)_1fr] sm:items-start sm:gap-x-6',
          disabled && 'opacity-60',
          className,
        )}
        {...props}
      >
        {(label || labelAside) && (
          <div className={cn('flex items-center justify-between gap-2', orientation === 'horizontal' && 'sm:pt-1.5')}>
            {label && (
              <Label htmlFor={id} required={required}>
                {label}
              </Label>
            )}
            {labelAside && <span className="text-xs text-fg-subtle">{labelAside}</span>}
          </div>
        )}
        <div className="flex min-w-0 flex-col gap-1.5">
          {children}
          {description && !error && (
            <p id={descriptionId} className="text-xs text-fg-muted">
              {description}
            </p>
          )}
          {error && (
            <p id={errorId} role="alert" className="text-xs font-medium text-danger">
              {error}
            </p>
          )}
        </div>
      </div>
    </FieldContext.Provider>
  );
}
