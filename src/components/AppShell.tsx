import { createContext, useContext, useEffect, useRef, useState, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../utils/cn';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { useEscapeKey } from '../hooks/useEscapeKey';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { IconButton } from './IconButton';
import { MenuIcon, SidebarIcon } from './icons';

interface AppShellContextValue {
  /** Mobile drawer state. */
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  /** Desktop collapsed (icon-only) state. */
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  isDesktop: boolean;
}

const AppShellContext = createContext<AppShellContextValue | null>(null);

export function useAppShell() {
  const ctx = useContext(AppShellContext);
  if (!ctx) throw new Error('useAppShell must be used within <AppShell>');
  return ctx;
}

/** Like useAppShell, but returns null outside an AppShell (used by Sidebar to work standalone). */
export function useOptionalAppShell() {
  return useContext(AppShellContext);
}

export interface AppShellProps {
  sidebar: ReactNode;
  topbar?: ReactNode;
  /** Rendered below the main content — usually a <Footer variant="bar">. */
  footer?: ReactNode;
  children: ReactNode;
  defaultCollapsed?: boolean;
  className?: string;
}

/**
 * Responsive application frame.
 * ≥lg: persistent sidebar (collapsible to icons). <lg: sidebar becomes a drawer opened from the Topbar.
 */
export function AppShell({ sidebar, topbar, footer, children, defaultCollapsed = false, className }: AppShellProps) {
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const drawerRef = useRef<HTMLDivElement>(null);
  useEscapeKey(() => setMobileOpen(false), mobileOpen && !isDesktop);
  useFocusTrap(drawerRef, mobileOpen && !isDesktop);

  useEffect(() => {
    if (isDesktop) setMobileOpen(false);
  }, [isDesktop]);

  const isCollapsed = isDesktop && collapsed;

  return (
    <AppShellContext.Provider value={{ mobileOpen, setMobileOpen, collapsed: isCollapsed, setCollapsed, isDesktop }}>
      <div className={cn('flex min-h-dvh bg-canvas text-fg', className)}>
        {/* Mobile scrim */}
        {mobileOpen && !isDesktop && (
          <div aria-hidden className="fixed inset-0 z-40 bg-scrim animate-fx-fade-in" onClick={() => setMobileOpen(false)} />
        )}
        <div
          ref={drawerRef}
          className={cn(
            'fixed inset-y-0 left-0 z-50 flex transition-[transform,width] duration-300 ease-spring',
            'lg:sticky lg:top-0 lg:z-20 lg:h-dvh lg:translate-x-0',
            mobileOpen ? 'translate-x-0' : '-translate-x-full',
            isCollapsed ? 'lg:w-[68px]' : 'w-[272px] lg:w-[248px]',
          )}
          {...(!isDesktop && mobileOpen ? { role: 'dialog', 'aria-modal': true, 'aria-label': 'Navigation' } : {})}
        >
          {sidebar}
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          {topbar}
          <main className="min-w-0 flex-1">{children}</main>
          {footer}
        </div>
      </div>
    </AppShellContext.Provider>
  );
}

export interface TopbarProps extends HTMLAttributes<HTMLElement> {
  /** Left side content after the menu toggle — breadcrumbs, title or search. */
  start?: ReactNode;
  /** Right side actions — notifications, user menu. */
  end?: ReactNode;
}

export function Topbar({ start, end, className, children, ...props }: TopbarProps) {
  const { setMobileOpen, collapsed, setCollapsed, isDesktop } = useAppShell();
  return (
    <header
      className={cn(
        'material sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b border-line px-3 sm:px-4',
        className,
      )}
      {...props}
    >
      {isDesktop ? (
        <IconButton
          label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          icon={<SidebarIcon />}
          onClick={() => setCollapsed(!collapsed)}
        />
      ) : (
        <IconButton label="Open navigation" icon={<MenuIcon />} onClick={() => setMobileOpen(true)} />
      )}
      <div className="flex min-w-0 flex-1 items-center gap-3">{start}</div>
      {children}
      {end && <div className="flex shrink-0 items-center gap-1 sm:gap-2">{end}</div>}
    </header>
  );
}

export interface PageHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title: ReactNode;
  description?: ReactNode;
  /** Rendered above the title — usually <Breadcrumbs>. */
  breadcrumbs?: ReactNode;
  /** Inline status next to the title (e.g. a Badge). */
  meta?: ReactNode;
  actions?: ReactNode;
}

export function PageHeader({ title, description, breadcrumbs, meta, actions, className, children, ...props }: PageHeaderProps) {
  return (
    <div className={cn('flex flex-col gap-3', className)} {...props}>
      {breadcrumbs}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <h1 className="text-2xl font-semibold tracking-[-0.022em] text-fg sm:text-[28px]">{title}</h1>
            {meta}
          </div>
          {description && <p className="mt-1 max-w-2xl text-sm text-fg-muted">{description}</p>}
        </div>
        {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
      </div>
      {children}
    </div>
  );
}
