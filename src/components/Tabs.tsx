import { createContext, useContext, useId, useRef, type HTMLAttributes, type KeyboardEvent, type ReactNode } from 'react';
import { cn } from '../utils/cn';
import { useControllableState } from '../hooks/useControllableState';
import { useIndicator } from './useIndicator';

interface TabsContextValue {
  value: string;
  setValue: (v: string) => void;
  baseId: string;
  variant: 'underline' | 'pill';
}

const TabsContext = createContext<TabsContextValue | null>(null);
function useTabs() {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error('Tabs components must be used within <Tabs>');
  return ctx;
}

export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue'> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  variant?: 'underline' | 'pill';
}

export function Tabs({
  value: valueProp,
  defaultValue = '',
  onValueChange,
  variant = 'underline',
  className,
  ...props
}: TabsProps) {
  const [value, setValue] = useControllableState(valueProp, defaultValue, onValueChange);
  const baseId = useId();
  return (
    <TabsContext.Provider value={{ value, setValue, baseId, variant }}>
      <div className={cn('flex flex-col', className)} {...props} />
    </TabsContext.Provider>
  );
}

export function TabList({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  const { value, variant } = useTabs();
  const ref = useRef<HTMLDivElement>(null);
  const indicator = useIndicator(ref, value, '[role="tab"][data-active="true"]');

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    const tabs = Array.from(ref.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]:not(:disabled)') ?? []);
    const index = tabs.findIndex((t) => t === document.activeElement);
    let next = index;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    event.preventDefault();
    tabs[next]?.focus();
    tabs[next]?.click();
  };

  return (
    <div
      ref={ref}
      role="tablist"
      onKeyDown={onKeyDown}
      className={cn(
        'scrollbar-thin relative flex items-center overflow-x-auto',
        variant === 'underline' ? 'gap-5 border-b border-line' : 'gap-1',
        className,
      )}
      {...props}
    >
      {children}
      {indicator && variant === 'underline' && (
        <span
          aria-hidden
          className="absolute bottom-0 h-0.5 rounded-full bg-accent transition-[left,width] duration-300 ease-spring"
          style={{ left: indicator.left, width: indicator.width }}
        />
      )}
    </div>
  );
}

export interface TabProps extends HTMLAttributes<HTMLButtonElement> {
  value: string;
  disabled?: boolean;
  /** Small count shown next to the label (e.g. pending approvals). */
  count?: ReactNode;
  icon?: ReactNode;
}

export function Tab({ value, disabled, count, icon, className, children, ...props }: TabProps) {
  const ctx = useTabs();
  const active = ctx.value === value;
  return (
    <button
      type="button"
      role="tab"
      id={`${ctx.baseId}-tab-${value}`}
      aria-controls={`${ctx.baseId}-panel-${value}`}
      aria-selected={active}
      data-active={active}
      tabIndex={active ? 0 : -1}
      disabled={disabled}
      onClick={() => ctx.setValue(value)}
      className={cn(
        'focus-ring inline-flex shrink-0 items-center gap-1.5 text-sm font-medium whitespace-nowrap transition-colors duration-150 disabled:opacity-40 [&_svg]:size-4',
        ctx.variant === 'underline' && 'h-10 rounded-sm',
        ctx.variant === 'underline' && (active ? 'text-fg' : 'text-fg-muted hover:text-fg'),
        ctx.variant === 'pill' && 'h-8 rounded-lg px-3',
        ctx.variant === 'pill' && (active ? 'bg-fill/14 text-fg' : 'text-fg-muted hover:bg-fill/8 hover:text-fg'),
        className,
      )}
      {...props}
    >
      {icon}
      {children}
      {count !== undefined && (
        <span
          className={cn(
            'rounded-full px-1.5 py-px text-[11px] tabular-nums',
            active ? 'bg-accent/12 text-accent' : 'bg-fill/14 text-fg-muted',
          )}
        >
          {count}
        </span>
      )}
    </button>
  );
}

export interface TabPanelProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
  /** Keep the panel mounted when hidden (preserves form state). */
  keepMounted?: boolean;
}

export function TabPanel({ value, keepMounted, className, ...props }: TabPanelProps) {
  const ctx = useTabs();
  const active = ctx.value === value;
  if (!active && !keepMounted) return null;
  return (
    <div
      role="tabpanel"
      id={`${ctx.baseId}-panel-${value}`}
      aria-labelledby={`${ctx.baseId}-tab-${value}`}
      hidden={!active}
      tabIndex={0}
      className={cn('pt-4 focus:outline-none', className)}
      {...props}
    />
  );
}
