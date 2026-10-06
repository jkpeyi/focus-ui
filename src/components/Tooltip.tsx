import { useId, useRef, useState, type ReactElement, type ReactNode } from 'react';
import { cn } from '../utils/cn';
import { useFloating, type Placement } from '../hooks/useFloating';
import { Portal } from './Portal';
import { cloneTrigger } from './triggerProps';

export interface TooltipProps {
  content: ReactNode;
  children: ReactElement;
  placement?: Placement;
  /** Delay before showing, in ms. */
  delay?: number;
  disabled?: boolean;
}

export function Tooltip({ content, children, placement = 'top', delay = 450, disabled }: TooltipProps) {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLElement>(null);
  const floatingRef = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const id = useId();
  const { style } = useFloating(anchorRef, floatingRef, { placement, open, offset: 8 });

  const show = () => {
    if (disabled) return;
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(true), delay);
  };
  const hide = () => {
    clearTimeout(timer.current);
    setOpen(false);
  };

  return (
    <>
      {cloneTrigger(children, anchorRef, {
        onPointerEnter: show,
        onPointerLeave: hide,
        onFocus: () => !disabled && setOpen(true),
        onBlur: hide,
        onKeyDown: (e: KeyboardEvent) => e.key === 'Escape' && hide(),
        'aria-describedby': open ? id : undefined,
      })}
      {open && (
        <Portal>
          <div
            ref={floatingRef}
            id={id}
            role="tooltip"
            style={style}
            className={cn(
              'pointer-events-none z-[60] max-w-xs rounded-lg bg-fg/90 px-2.5 py-1.5 text-xs font-medium text-surface shadow-popover backdrop-blur-md animate-fx-fade-in',
            )}
          >
            {content}
          </div>
        </Portal>
      )}
    </>
  );
}
