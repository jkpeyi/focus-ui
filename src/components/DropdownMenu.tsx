import { useId, useRef, useState, type KeyboardEvent, type ReactElement, type ReactNode } from 'react';
import { cn } from '../utils/cn';
import { useClickOutside } from '../hooks/useClickOutside';
import { useFloating, type Placement } from '../hooks/useFloating';
import { usePresence } from '../hooks/usePresence';
import { Portal } from './Portal';
import { cloneTrigger } from './triggerProps';
import { CheckIcon } from './icons';

export interface MenuActionItem {
  type?: 'item';
  label: ReactNode;
  icon?: ReactNode;
  /** Keyboard shortcut hint, e.g. "⌘D". Display only. */
  shortcut?: string;
  description?: ReactNode;
  onSelect?: () => void;
  disabled?: boolean;
  tone?: 'default' | 'danger';
  /** Shows a checkmark (for toggles / single-choice lists). */
  checked?: boolean;
}

export type MenuItem = MenuActionItem | { type: 'separator' } | { type: 'label'; label: ReactNode };

export interface DropdownMenuProps {
  trigger: ReactElement;
  items: MenuItem[];
  placement?: Placement;
  className?: string;
  'aria-label'?: string;
}

/** Action menu (macOS context-menu style) with full keyboard support. */
export function DropdownMenu({ trigger, items, placement = 'bottom-end', className, ...aria }: DropdownMenuProps) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const anchorRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const id = useId();
  const { mounted, state } = usePresence(open, 120);
  const { style } = useFloating(anchorRef, menuRef, { placement, open: mounted, offset: 4 });

  const actionable = items
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => (item.type ?? 'item') === 'item' && !(item as MenuActionItem).disabled)
    .map(({ index }) => index);

  const openMenu = (focusIndex: number) => {
    setOpen(true);
    setActive(focusIndex);
    requestAnimationFrame(() => menuRef.current?.focus());
  };
  const close = (restoreFocus = true) => {
    setOpen(false);
    setActive(-1);
    if (restoreFocus) anchorRef.current?.focus();
  };
  useClickOutside([anchorRef, menuRef], () => close(false), open);

  const select = (index: number) => {
    const item = items[index];
    if (!item || (item.type ?? 'item') !== 'item') return;
    const it = item as MenuActionItem;
    if (it.disabled) return;
    close();
    it.onSelect?.();
  };

  const move = (delta: number) => {
    if (actionable.length === 0) return;
    const pos = actionable.indexOf(active);
    const next = pos === -1 ? (delta > 0 ? 0 : actionable.length - 1) : (pos + delta + actionable.length) % actionable.length;
    setActive(actionable[next]);
  };

  const onMenuKeyDown = (event: KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        move(1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        move(-1);
        break;
      case 'Home':
        event.preventDefault();
        setActive(actionable[0]);
        break;
      case 'End':
        event.preventDefault();
        setActive(actionable[actionable.length - 1]);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        select(active);
        break;
      case 'Escape':
        event.preventDefault();
        close();
        break;
      case 'Tab':
        close(false);
        break;
    }
  };

  return (
    <>
      {cloneTrigger(trigger, anchorRef, {
        onClick: () => (open ? close(false) : openMenu(-1)),
        onKeyDown: (e: KeyboardEvent) => {
          if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            openMenu(e.key === 'ArrowDown' ? actionable[0] : actionable[actionable.length - 1]);
          }
        },
        'aria-haspopup': 'menu',
        'aria-expanded': open,
        'aria-controls': open ? id : undefined,
      })}
      {mounted && (
        <Portal>
          <div
            ref={menuRef}
            id={id}
            role="menu"
            aria-label={aria['aria-label']}
            aria-activedescendant={active >= 0 ? `${id}-${active}` : undefined}
            tabIndex={-1}
            data-state={state}
            onKeyDown={onMenuKeyDown}
            style={style}
            className={cn(
              'material z-50 min-w-48 rounded-xl p-1 text-fg shadow-popover outline-none',
              'transition-opacity duration-100 data-[state=closed]:opacity-0 data-[state=open]:animate-fx-pop-in',
              className,
            )}
          >
            {items.map((item, index) => {
              if (item.type === 'separator') return <div key={index} role="separator" className="mx-2 my-1 h-px bg-line" />;
              if (item.type === 'label')
                return (
                  <div
                    key={index}
                    className="px-2.5 pt-1.5 pb-1 text-[11px] font-semibold tracking-wide text-fg-subtle uppercase"
                  >
                    {item.label}
                  </div>
                );
              const isActive = index === active;
              const danger = item.tone === 'danger';
              return (
                <div
                  key={index}
                  id={`${id}-${index}`}
                  role={item.checked !== undefined ? 'menuitemcheckbox' : 'menuitem'}
                  aria-checked={item.checked}
                  aria-disabled={item.disabled || undefined}
                  data-active={isActive}
                  onPointerMove={() => !item.disabled && setActive(index)}
                  onPointerLeave={() => setActive(-1)}
                  onClick={() => select(index)}
                  className={cn(
                    'flex cursor-default items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[13px] select-none [&_svg]:size-4 [&_svg]:shrink-0',
                    danger ? 'text-danger' : 'text-fg',
                    isActive && (danger ? 'bg-danger text-white' : 'bg-accent text-accent-fg'),
                    item.disabled && 'opacity-40',
                  )}
                >
                  {item.checked !== undefined && (
                    <span className="flex w-4 justify-center">{item.checked && <CheckIcon className="size-3.5" />}</span>
                  )}
                  {item.icon && <span className={cn(!isActive && !danger && 'text-fg-muted')}>{item.icon}</span>}
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate">{item.label}</span>
                    {item.description && (
                      <span className={cn('text-xs', isActive ? 'text-current/80' : 'text-fg-muted')}>{item.description}</span>
                    )}
                  </span>
                  {item.shortcut && (
                    <span className={cn('ml-4 text-xs tracking-widest', isActive ? 'text-current/80' : 'text-fg-subtle')}>
                      {item.shortcut}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </Portal>
      )}
    </>
  );
}
