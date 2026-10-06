import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '../utils/cn';
import { buttonVariants, type ButtonVariant } from './Button';

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Required for accessibility — icon-only buttons have no visible text. */
  label: string;
  icon: ReactNode;
  variant?: ButtonVariant | 'ghost';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  shape?: 'rounded' | 'circle';
}

const sizes = { xs: 'size-6 rounded-md', sm: 'size-7 rounded-lg', md: 'size-8 rounded-lg', lg: 'size-11 rounded-xl' };
const iconSizes = { xs: '[&_svg]:size-3.5', sm: '[&_svg]:size-4', md: '[&_svg]:size-[18px]', lg: '[&_svg]:size-5' };

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { label, icon, variant = 'ghost', size = 'md', shape = 'rounded', className, type = 'button', title, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      aria-label={label}
      title={title ?? label}
      className={cn(
        'focus-ring inline-flex shrink-0 items-center justify-center transition-[background-color,color,transform] duration-150 active:scale-95',
        'disabled:pointer-events-none disabled:opacity-45 [&_svg]:shrink-0',
        variant === 'ghost' ? 'text-fg-muted hover:bg-fill/12 hover:text-fg active:bg-fill/20' : buttonVariants[variant],
        sizes[size],
        iconSizes[size],
        shape === 'circle' && 'rounded-full',
        className,
      )}
      {...props}
    >
      {icon}
    </button>
  );
});
