import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '../utils/cn';
import { Spinner } from './Spinner';

export type ButtonVariant = 'primary' | 'secondary' | 'tinted' | 'plain' | 'destructive' | 'destructive-tinted';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Show a spinner and disable the button. */
  loading?: boolean;
  /** Icon rendered before the label. */
  leadingIcon?: ReactNode;
  /** Icon rendered after the label. */
  trailingIcon?: ReactNode;
  fullWidth?: boolean;
}

export const buttonVariants: Record<ButtonVariant, string> = {
  primary: 'bg-accent text-accent-fg shadow-raised hover:bg-accent-hover active:brightness-95',
  secondary: 'bg-surface text-fg shadow-raised hover:bg-surface-2 active:bg-fill/12 dark:bg-elevated dark:hover:bg-fill/30',
  tinted: 'bg-accent/12 text-accent hover:bg-accent/18 active:bg-accent/24',
  plain: 'text-accent hover:bg-fill/10 active:bg-fill/16',
  destructive: 'bg-danger text-white shadow-raised hover:brightness-110 active:brightness-95',
  'destructive-tinted': 'bg-danger/10 text-danger hover:bg-danger/15 active:bg-danger/20',
};

export const buttonSizes: Record<ButtonSize, string> = {
  xs: 'h-6 px-2 text-xs gap-1 rounded-md',
  sm: 'h-7 px-2.5 text-[13px] gap-1.5 rounded-lg',
  md: 'h-8 px-3.5 text-sm gap-1.5 rounded-lg',
  lg: 'h-11 px-5 text-[15px] gap-2 rounded-xl',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'secondary',
    size = 'md',
    loading = false,
    leadingIcon,
    trailingIcon,
    fullWidth,
    disabled,
    className,
    children,
    type = 'button',
    ...props
  },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        'focus-ring relative inline-flex shrink-0 select-none items-center justify-center whitespace-nowrap font-medium tracking-[-0.01em]',
        'transition-[background-color,color,box-shadow,filter,transform] duration-150 ease-apple active:scale-[0.98]',
        'disabled:pointer-events-none disabled:opacity-45 [&_svg]:size-[1.1em] [&_svg]:shrink-0',
        buttonVariants[variant],
        buttonSizes[size],
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    >
      {loading ? <Spinner size="sm" label="Loading" className="size-[1.1em]" /> : leadingIcon}
      {children}
      {!loading && trailingIcon}
    </button>
  );
});
