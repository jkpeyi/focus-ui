import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../utils/cn';

export interface AuthLayoutProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /**
   * - `centered` (default): a card in the middle of the canvas — Apple ID style.
   * - `split`: form on the left, branded `aside` panel on the right (stacked away on phones).
   */
  variant?: 'centered' | 'split';
  /** Logo / product mark above the title. */
  logo?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  /** Branded panel for the split variant — illustration, testimonial, product highlights. */
  aside?: ReactNode;
  /** Small print under the form — legal links, language switcher, "Need help?". */
  footer?: ReactNode;
  /** Content above the logo, e.g. a "Back" link. */
  topbar?: ReactNode;
  /** Max width of the form column. */
  width?: 'sm' | 'md';
}

const widths = { sm: 'max-w-sm', md: 'max-w-md' };

/** Page shell for sign-in, registration, verification and password-reset screens. */
export function AuthLayout({
  variant = 'centered',
  logo,
  title,
  description,
  aside,
  footer,
  topbar,
  width = 'sm',
  className,
  children,
  ...props
}: AuthLayoutProps) {
  const header = (logo || title || description) && (
    <div className={cn('mb-7 flex flex-col', variant === 'centered' ? 'items-center text-center' : 'items-start')}>
      {logo && <div className="mb-6">{logo}</div>}
      {title && <h1 className="text-[26px] leading-tight font-semibold tracking-[-0.025em] text-fg">{title}</h1>}
      {description && <p className="mt-2 text-[15px] leading-relaxed text-fg-muted">{description}</p>}
    </div>
  );

  if (variant === 'split') {
    return (
      <div className={cn('grid min-h-dvh bg-surface lg:grid-cols-2', className)} {...props}>
        <div className="flex flex-col px-6 py-8 sm:px-12">
          {topbar && <div className="mb-8">{topbar}</div>}
          <div className={cn('m-auto w-full', widths[width])}>
            {header}
            {children}
          </div>
          {footer && <div className="mt-10 text-center text-xs text-fg-subtle lg:text-left">{footer}</div>}
        </div>
        {aside && (
          <aside className="relative hidden overflow-hidden bg-canvas p-3 lg:block">
            <div className="relative flex h-full flex-col overflow-hidden rounded-3xl">{aside}</div>
          </aside>
        )}
      </div>
    );
  }

  return (
    <div className={cn('flex min-h-dvh flex-col bg-canvas px-4 py-8 sm:py-12', className)} {...props}>
      {topbar && <div className="mx-auto mb-6 w-full max-w-5xl">{topbar}</div>}
      <div className={cn('m-auto w-full', widths[width])}>
        <div className="rounded-3xl bg-surface p-6 shadow-card sm:p-10">
          {header}
          {children}
        </div>
        {footer && <div className="mt-6 text-center text-xs text-fg-subtle">{footer}</div>}
      </div>
    </div>
  );
}

/** "or continue with" divider + social / SSO buttons row helper. */
export function AuthDivider({ children = 'or', className }: { children?: ReactNode; className?: string }) {
  return (
    <div role="separator" className={cn('my-6 flex items-center gap-3 text-xs text-fg-subtle', className)}>
      <span className="h-px flex-1 bg-line" />
      {children}
      <span className="h-px flex-1 bg-line" />
    </div>
  );
}
