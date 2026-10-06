import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type AnchorHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { cn } from '../utils/cn';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { useEscapeKey } from '../hooks/useEscapeKey';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { IconButton } from './IconButton';
import { ChevronDownIcon, MenuIcon, SidebarIcon } from './icons';
import { Tooltip } from './Tooltip';

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

export interface AppShellProps {
  sidebar: ReactNode;
  topbar?: ReactNode;
  children: ReactNode;
  defaultCollapsed?: boolean;
  className?: string;
}

/**
 * Responsive application frame.
 * ≥lg: persistent sidebar (collapsible to icons). <lg: sidebar becomes a drawer opened from the Topbar.
 */
export function AppShell({ sidebar, topbar, children, defaultCollapsed = false, className }: AppShellProps) {
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
        </div>
      </div>
    </AppShellContext.Provider>
  );
}

export interface SidebarProps extends HTMLAttributes<HTMLElement> {
  header?: ReactNode;
  footer?: ReactNode;
}

export function Sidebar({ header, footer, className, children, ...props }: SidebarProps) {
  const { collapsed } = useAppShell();
  return (
    <aside
      data-collapsed={collapsed}
      className={cn(
        'group/sidebar flex h-full w-full flex-col border-r border-line bg-surface-2/95 backdrop-blur-xl dark:bg-surface/95',
        className,
      )}
      {...props}
    >
      {header && <div className={cn('flex h-14 shrink-0 items-center px-4', collapsed && 'justify-center px-2')}>{header}</div>}
      <nav className={cn('scrollbar-thin flex-1 overflow-y-auto px-3 py-2', collapsed && 'px-2')}>{children}</nav>
      {footer && <div className={cn('shrink-0 border-t border-line p-3', collapsed && 'p-2')}>{footer}</div>}
    </aside>
  );
}

export interface SidebarSectionProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: ReactNode;
  /** Allow collapsing the section by clicking its title. */
  collapsible?: boolean;
  defaultOpen?: boolean;
}

export function SidebarSection({ title, collapsible, defaultOpen = true, className, children, ...props }: SidebarSectionProps) {
  const { collapsed } = useAppShell();
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={cn('mb-4', className)} {...props}>
      {title && !collapsed && (
        <button
          type="button"
          disabled={!collapsible}
          onClick={() => setOpen(!open)}
          aria-expanded={collapsible ? open : undefined}
          className="focus-ring group/title mb-1 flex w-full items-center justify-between rounded-md px-2.5 py-1 text-[11px] font-semibold tracking-wide text-fg-subtle uppercase disabled:cursor-default"
        >
          {title}
          {collapsible && (
            <ChevronDownIcon className={cn('size-3 opacity-0 transition group-hover/title:opacity-100', !open && '-rotate-90')} />
          )}
        </button>
      )}
      {collapsed && title && <div className="mx-auto mb-2 h-px w-6 bg-line" />}
      {(open || collapsed) && <ul className="flex flex-col gap-px">{children}</ul>}
    </div>
  );
}

export interface SidebarItemProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children'> {
  icon?: ReactNode;
  label: ReactNode;
  active?: boolean;
  /** Count or status shown on the right (e.g. pending approvals). */
  badge?: ReactNode;
}

export function SidebarItem({ icon, label, active, badge, className, onClick, ...props }: SidebarItemProps) {
  const { collapsed, setMobileOpen } = useAppShell();
  const link = (
    <a
      aria-current={active ? 'page' : undefined}
      onClick={(e) => {
        onClick?.(e);
        setMobileOpen(false);
      }}
      className={cn(
        'focus-ring relative flex h-8 cursor-pointer items-center gap-2.5 rounded-lg px-2.5 text-[13px] font-medium transition-colors duration-100 select-none',
        '[&_svg]:size-[18px] [&_svg]:shrink-0',
        active ? 'bg-accent/10 text-accent dark:bg-accent/18' : 'text-fg/85 hover:bg-fill/10 hover:text-fg',
        collapsed && 'h-9 justify-center px-0',
        className,
      )}
      {...props}
    >
      <span className={cn(!active && 'text-fg-muted')}>{icon}</span>
      {!collapsed && <span className="min-w-0 flex-1 truncate">{label}</span>}
      {!collapsed && badge !== undefined && (
        <span
          className={cn(
            'rounded-full px-1.5 text-[11px] font-semibold tabular-nums',
            active ? 'bg-accent text-accent-fg' : 'bg-fill/14 text-fg-muted',
          )}
        >
          {badge}
        </span>
      )}
      {collapsed && badge !== undefined && <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-accent" />}
    </a>
  );
  return (
    <li>
      {collapsed ? (
        <Tooltip content={label} placement="right" delay={150}>
          {link}
        </Tooltip>
      ) : (
        link
      )}
    </li>
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
