import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../utils/cn';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** `elevated` (default) uses a soft shadow; `outline` a hairline border; `flat` a subtle fill. */
  variant?: 'elevated' | 'outline' | 'flat';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** Adds hover feedback — use when the whole card is clickable. */
  interactive?: boolean;
}

const paddings = { none: '', sm: 'p-3', md: 'p-5', lg: 'p-6 sm:p-8' };

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { variant = 'elevated', padding = 'none', interactive, className, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(
        'rounded-2xl text-fg',
        variant === 'elevated' && 'bg-surface shadow-card',
        variant === 'outline' && 'border border-line bg-surface',
        variant === 'flat' && 'bg-fill/8',
        interactive &&
          'cursor-pointer transition-[box-shadow,transform] duration-200 ease-apple hover:-translate-y-0.5 hover:shadow-popover',
        paddings[padding],
        className,
      )}
      {...props}
    />
  );
});

export interface CardHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: ReactNode;
  description?: ReactNode;
  /** Right-aligned actions (buttons, menus). */
  actions?: ReactNode;
}

export function CardHeader({ title, description, actions, className, children, ...props }: CardHeaderProps) {
  return (
    <div className={cn('flex items-start gap-4 px-5 pt-5 pb-3', className)} {...props}>
      <div className="min-w-0 flex-1">
        {title && <h3 className="truncate text-[15px] font-semibold tracking-[-0.01em] text-fg">{title}</h3>}
        {description && <p className="mt-0.5 text-[13px] text-fg-muted">{description}</p>}
        {children}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}

export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('px-5 pb-5', className)} {...props} />;
}

export function CardFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex items-center justify-end gap-2 border-t border-line px-5 py-3.5', className)} {...props} />;
}
