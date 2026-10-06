import { forwardRef, useId, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '../utils/cn';
import { useControllableState } from '../hooks/useControllableState';

export interface SwitchProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'value' | 'defaultValue'> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: ReactNode;
  description?: ReactNode;
  size?: 'sm' | 'md';
  /** Place the label on the left and the switch on the right (iOS settings style). */
  labelPosition?: 'left' | 'right';
}

/** iOS-style toggle. Rendered as a `button[role=switch]`. */
export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(function Switch(
  {
    checked: checkedProp,
    defaultChecked = false,
    onCheckedChange,
    label,
    description,
    size = 'md',
    labelPosition = 'right',
    disabled,
    className,
    id: idProp,
    ...props
  },
  ref,
) {
  const [checked, setChecked] = useControllableState(checkedProp, defaultChecked, onCheckedChange);
  const autoId = useId();
  const id = idProp ?? autoId;
  const track = size === 'sm' ? 'h-5 w-8' : 'h-[26px] w-[44px]';
  const thumb = size === 'sm' ? 'size-4 data-[on=true]:translate-x-3' : 'size-[22px] data-[on=true]:translate-x-[18px]';

  const control = (
    <button
      ref={ref}
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => setChecked(!checked)}
      className={cn(
        'focus-ring relative inline-flex shrink-0 cursor-pointer items-center rounded-full p-0.5 transition-colors duration-200 ease-apple',
        'disabled:cursor-not-allowed disabled:opacity-45',
        checked ? 'bg-success' : 'bg-fill/30',
        track,
        !label && className,
      )}
      {...props}
    >
      <span
        data-on={checked}
        className={cn(
          'pointer-events-none block rounded-full bg-white shadow-[0_2px_4px_rgb(0_0_0/0.18),0_0_0_0.5px_rgb(0_0_0/0.04)] transition-transform duration-200 ease-spring',
          thumb,
        )}
      />
    </button>
  );
  if (!label) return control;
  return (
    <div
      className={cn(
        'flex items-center gap-3',
        labelPosition === 'left' && 'flex-row-reverse justify-between',
        disabled && 'opacity-60',
        className,
      )}
    >
      {control}
      <label htmlFor={id} className="flex cursor-pointer flex-col">
        <span className="text-sm text-fg">{label}</span>
        {description && <span className="text-xs text-fg-muted">{description}</span>}
      </label>
    </div>
  );
});
