import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../utils/cn';

export interface FooterLink {
  label: ReactNode;
  href?: string;
  onClick?: () => void;
  /** Opens in a new tab with rel="noopener noreferrer". */
  external?: boolean;
}

export interface FooterColumn {
  title: ReactNode;
  links: FooterLink[];
}

export interface FooterProps extends HTMLAttributes<HTMLElement> {
  /**
   * - `columns`: full footer with brand and link groups (portals, customer-facing apps).
   * - `simple`: one row — copyright, links, meta (end of a page or docs).
   * - `bar`: compact status bar for app shells (version, environment, sync status).
   */
  variant?: 'columns' | 'simple' | 'bar';
  /** Logo / product name. */
  brand?: ReactNode;
  /** Short text under the brand (columns variant). */
  description?: ReactNode;
  /** Link groups (columns variant). */
  columns?: FooterColumn[];
  /** Inline links (bottom row). */
  links?: FooterLink[];
  /** e.g. "© 2026 Acme Industries". */
  copyright?: ReactNode;
  /** Right-aligned content: version, status, locale switcher, social icons. */
  meta?: ReactNode;
  /** Constrain content width (e.g. "max-w-7xl"). Defaults to full width. */
  containerClassName?: string;
}

function FooterAnchor({ link, className }: { link: FooterLink; className?: string }) {
  return (
    <a
      href={link.href}
      onClick={
        link.onClick
          ? (e) => {
              if (!link.href) e.preventDefault();
              link.onClick?.();
            }
          : undefined
      }
      {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={cn('focus-ring cursor-pointer rounded-sm transition-colors hover:text-fg', className)}
    >
      {link.label}
    </a>
  );
}

/** Page and application footer in three densities. */
export function Footer({
  variant,
  brand,
  description,
  columns,
  links,
  copyright,
  meta,
  containerClassName,
  className,
  children,
  ...props
}: FooterProps) {
  const kind = variant ?? (columns?.length ? 'columns' : 'simple');

  if (kind === 'bar') {
    return (
      <footer
        className={cn('border-t border-line bg-surface-2/80 text-xs text-fg-muted dark:bg-surface/60', className)}
        {...props}
      >
        <div className={cn('mx-auto flex min-h-9 flex-wrap items-center gap-x-4 gap-y-1 px-4 py-2 sm:px-6', containerClassName)}>
          {brand && <span className="font-medium text-fg">{brand}</span>}
          {copyright && <span>{copyright}</span>}
          {children}
          {links && links.length > 0 && (
            <nav aria-label="Footer" className="flex flex-wrap items-center gap-x-3">
              {links.map((l, i) => (
                <FooterAnchor key={i} link={l} />
              ))}
            </nav>
          )}
          {meta && <div className="ml-auto flex items-center gap-3">{meta}</div>}
        </div>
      </footer>
    );
  }

  const bottomRow = (
    <div className="flex flex-col gap-3 text-[13px] text-fg-muted sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-5">
        {kind === 'simple' && brand && <span className="font-semibold text-fg">{brand}</span>}
        {copyright && <span>{copyright}</span>}
        {links && links.length > 0 && (
          <nav aria-label="Legal" className="flex flex-wrap gap-x-4 gap-y-1">
            {links.map((l, i) => (
              <FooterAnchor key={i} link={l} />
            ))}
          </nav>
        )}
      </div>
      {meta && <div className="flex flex-wrap items-center gap-3">{meta}</div>}
    </div>
  );

  if (kind === 'simple') {
    return (
      <footer className={cn('border-t border-line', className)} {...props}>
        <div className={cn('mx-auto px-4 py-6 sm:px-6', containerClassName)}>
          {children}
          {bottomRow}
        </div>
      </footer>
    );
  }

  return (
    <footer className={cn('border-t border-line bg-surface-2 dark:bg-surface/40', className)} {...props}>
      <div className={cn('mx-auto px-4 pt-12 pb-8 sm:px-6', containerClassName)}>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,3fr)]">
          {(brand || description || children) && (
            <div className="max-w-xs">
              {brand && <div className="text-[15px] font-semibold text-fg">{brand}</div>}
              {description && <p className="mt-2 text-[13px] leading-relaxed text-fg-muted">{description}</p>}
              {children && <div className="mt-4">{children}</div>}
            </div>
          )}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4">
            {columns?.map((col, i) => (
              <nav key={i} aria-label={typeof col.title === 'string' ? col.title : undefined}>
                <div className="text-xs font-semibold text-fg">{col.title}</div>
                <ul className="mt-3 space-y-2 text-[13px] text-fg-muted">
                  {col.links.map((l, j) => (
                    <li key={j}>
                      <FooterAnchor link={l} />
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>
        <div className="mt-10 border-t border-line pt-6">{bottomRow}</div>
      </div>
    </footer>
  );
}
