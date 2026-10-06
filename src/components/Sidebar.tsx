import {
  Children,
  createContext,
  isValidElement,
  useContext,
  useId,
  useState,
  type AnchorHTMLAttributes,
  type ElementType,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from 'react';
import { cn } from '../utils/cn';
import { useOptionalAppShell } from './AppShell';
import { Avatar } from './Avatar';
import { ChevronDownIcon, ChevronRightIcon } from './icons';
import { Popover } from './Popover';
import { Tooltip } from './Tooltip';

interface SidebarContextValue {
  collapsed: boolean;
  /** Called after an item is activated (closes the mobile drawer inside AppShell). */
  onNavigate: () => void;
  /** Nesting depth of the current item list. */
  depth: number;
}

const SidebarContext = createContext<SidebarContextValue>({ collapsed: false, onNavigate: () => {}, depth: 0 });

export function useSidebar() {
  return useContext(SidebarContext);
}

export interface SidebarProps extends HTMLAttributes<HTMLElement> {
  /** Top area — logo, workspace / company switcher. */
  header?: ReactNode;
  /** Bottom area — user profile, settings, help. */
  footer?: ReactNode;
  /**
   * Icon-only mode. Inside <AppShell> this is driven by the Topbar toggle;
   * set it yourself when using the Sidebar standalone.
   */
  collapsed?: boolean;
  /** Accessible name of the navigation landmark. */
  label?: string;
}

/**
 * macOS-style source list. Works inside <AppShell> (responsive drawer, collapse toggle)
 * or standalone in any layout.
 */
export function Sidebar({
  header,
  footer,
  collapsed: collapsedProp,
  label = 'Main',
  className,
  children,
  ...props
}: SidebarProps) {
  const shell = useOptionalAppShell();
  const collapsed = collapsedProp ?? shell?.collapsed ?? false;
  const onNavigate = () => shell?.setMobileOpen(false);

  return (
    <SidebarContext.Provider value={{ collapsed, onNavigate, depth: 0 }}>
      <aside
        data-collapsed={collapsed}
        className={cn(
          'group/sidebar flex h-full flex-col border-r border-line bg-surface-2/95 backdrop-blur-xl dark:bg-surface/95',
          collapsedProp === undefined ? 'w-full' : collapsed ? 'w-[68px]' : 'w-[248px]',
          'transition-[width] duration-300 ease-spring',
          className,
        )}
        {...props}
      >
        {header && <div className={cn('flex h-14 shrink-0 items-center px-3', collapsed && 'justify-center px-2')}>{header}</div>}
        <nav
          aria-label={label}
          className={cn('scrollbar-thin flex-1 overflow-x-hidden overflow-y-auto px-3 py-2', collapsed && 'px-2')}
        >
          {children}
        </nav>
        {footer && <div className={cn('shrink-0 border-t border-line p-3', collapsed && 'p-2')}>{footer}</div>}
      </aside>
    </SidebarContext.Provider>
  );
}

export interface SidebarSectionProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: ReactNode;
  /** Allow collapsing the section by clicking its title. */
  collapsible?: boolean;
  defaultOpen?: boolean;
  /** Optional control on the right of the title (e.g. a "+" button). */
  action?: ReactNode;
}

export function SidebarSection({
  title,
  collapsible,
  defaultOpen = true,
  action,
  className,
  children,
  ...props
}: SidebarSectionProps) {
  const { collapsed } = useSidebar();
  const [open, setOpen] = useState(defaultOpen);
  const listId = useId();
  return (
    <div className={cn('mb-4 last:mb-0', className)} {...props}>
      {title && !collapsed && (
        <div className="group/title mb-1 flex items-center">
          <button
            type="button"
            disabled={!collapsible}
            onClick={() => setOpen(!open)}
            aria-expanded={collapsible ? open : undefined}
            aria-controls={collapsible ? listId : undefined}
            className="focus-ring flex flex-1 items-center justify-between rounded-md px-2.5 py-1 text-[11px] font-semibold tracking-wide text-fg-subtle uppercase disabled:cursor-default"
          >
            {title}
            {collapsible && (
              <ChevronDownIcon
                className={cn('size-3 opacity-0 transition group-hover/title:opacity-100', !open && '-rotate-90')}
              />
            )}
          </button>
          {action}
        </div>
      )}
      {collapsed && title && <div aria-hidden className="mx-auto mb-2 h-px w-6 bg-line" />}
      {(open || collapsed) && (
        <ul id={listId} className="flex flex-col gap-px">
          {children}
        </ul>
      )}
    </div>
  );
}

export interface SidebarItemProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children'> {
  icon?: ReactNode;
  label: ReactNode;
  active?: boolean;
  /** Count or status shown on the right (e.g. pending approvals). */
  badge?: ReactNode;
  /** Nested <SidebarItem>s — rendered as an expandable sub-menu (a flyout when collapsed). */
  children?: ReactNode;
  /** Initial expanded state of the sub-menu. Defaults to open when a child is active. */
  defaultOpen?: boolean;
  /** Render a router link instead of <a>, e.g. `as={Link} to="/orders"`. */
  as?: ElementType;
  /** Convenience for router links that use `to`. */
  to?: string;
  disabled?: boolean;
}

function hasActiveChild(children: ReactNode): boolean {
  return Children.toArray(children).some(
    (child) =>
      isValidElement(child) &&
      ((child as ReactElement<SidebarItemProps>).props.active ||
        hasActiveChild((child as ReactElement<SidebarItemProps>).props.children)),
  );
}

export function SidebarItem({
  icon,
  label,
  active,
  badge,
  children,
  defaultOpen,
  as: Component = 'a',
  disabled,
  className,
  onClick,
  ...props
}: SidebarItemProps) {
  const { collapsed, onNavigate, depth } = useSidebar();
  const nested = Children.count(children) > 0;
  const childActive = nested && hasActiveChild(children);
  const [open, setOpen] = useState(defaultOpen ?? childActive);
  const subId = useId();
  const highlighted = active || (collapsed && childActive);

  const rowClass = cn(
    'focus-ring relative flex w-full cursor-pointer items-center gap-2.5 rounded-lg text-left text-[13px] font-medium transition-colors duration-100 select-none',
    '[&_svg]:size-[18px] [&_svg]:shrink-0',
    depth > 0 ? 'h-7 pr-2.5 pl-[38px]' : 'h-8 px-2.5',
    highlighted ? 'bg-accent/10 text-accent dark:bg-accent/18' : 'text-fg/85 hover:bg-fill/10 hover:text-fg',
    !highlighted && childActive && 'text-fg',
    collapsed && 'h-9 justify-center px-0',
    disabled && 'pointer-events-none opacity-45',
    className,
  );

  const content = (
    <>
      {(icon || depth === 0) && <span className={cn('flex', !highlighted && 'text-fg-muted')}>{icon}</span>}
      {!collapsed && <span className="min-w-0 flex-1 truncate">{label}</span>}
      {!collapsed && badge !== undefined && (
        <span
          className={cn(
            'rounded-full px-1.5 text-[11px] font-semibold tabular-nums',
            highlighted ? 'bg-accent text-accent-fg' : 'bg-fill/14 text-fg-muted',
          )}
        >
          {badge}
        </span>
      )}
      {!collapsed && nested && (
        <ChevronRightIcon className={cn('!size-3.5 text-fg-subtle transition-transform duration-200', open && 'rotate-90')} />
      )}
      {collapsed && (badge !== undefined || childActive) && (
        <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-accent" />
      )}
    </>
  );

  // Parent of a sub-menu
  if (nested) {
    if (collapsed) {
      return (
        <li>
          <Popover
            placement="right"
            className="w-56 p-1.5"
            trigger={
              <button type="button" aria-label={typeof label === 'string' ? label : undefined} className={rowClass}>
                {content}
              </button>
            }
          >
            {({ close }) => (
              <SidebarContext.Provider
                value={{
                  collapsed: false,
                  depth: 0,
                  onNavigate: () => {
                    close();
                    onNavigate();
                  },
                }}
              >
                <div className="px-2.5 pt-1 pb-1.5 text-[11px] font-semibold tracking-wide text-fg-subtle uppercase">{label}</div>
                <ul className="flex flex-col gap-px">{children}</ul>
              </SidebarContext.Provider>
            )}
          </Popover>
        </li>
      );
    }
    return (
      <li>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={subId}
          disabled={disabled}
          onClick={() => setOpen(!open)}
          className={rowClass}
        >
          {content}
        </button>
        {open && (
          <SidebarContext.Provider value={{ collapsed, onNavigate, depth: depth + 1 }}>
            <ul
              id={subId}
              className="relative mt-px flex flex-col gap-px before:absolute before:inset-y-1 before:left-[19px] before:w-px before:bg-line"
            >
              {children}
            </ul>
          </SidebarContext.Provider>
        )}
      </li>
    );
  }

  const link = (
    <Component
      aria-current={active ? 'page' : undefined}
      aria-disabled={disabled || undefined}
      onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
        onClick?.(e);
        onNavigate();
      }}
      className={rowClass}
      {...props}
    >
      {content}
    </Component>
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

export interface SidebarProfileProps extends Omit<HTMLAttributes<HTMLButtonElement>, 'title'> {
  name: string;
  /** Second line — email, role or company. */
  description?: ReactNode;
  avatarSrc?: string;
  status?: 'online' | 'away' | 'busy' | 'offline';
  /** Trailing content, e.g. a chevron or settings icon. */
  trailing?: ReactNode;
}

/** User block for the sidebar footer. Wrap in a DropdownMenu trigger to add an account menu. */
export function SidebarProfile({ name, description, avatarSrc, status, trailing, className, ...props }: SidebarProfileProps) {
  const { collapsed } = useSidebar();
  return (
    <button
      type="button"
      aria-label={collapsed ? name : undefined}
      className={cn(
        'focus-ring flex w-full items-center gap-2.5 rounded-lg p-1.5 text-left transition-colors hover:bg-fill/10',
        collapsed && 'justify-center p-1',
        className,
      )}
      {...props}
    >
      <Avatar name={name} src={avatarSrc} size="sm" status={status} />
      {!collapsed && (
        <>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[13px] font-semibold text-fg">{name}</span>
            {description && <span className="block truncate text-xs text-fg-muted">{description}</span>}
          </span>
          {trailing ?? <ChevronDownIcon className="size-3.5 text-fg-subtle" />}
        </>
      )}
    </button>
  );
}
