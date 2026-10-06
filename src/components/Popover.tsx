import { useId, useRef, type ReactElement, type ReactNode } from 'react';
import { cn } from '../utils/cn';
import { useControllableState } from '../hooks/useControllableState';
import { useClickOutside } from '../hooks/useClickOutside';
import { useEscapeKey } from '../hooks/useEscapeKey';
import { useFloating, type Placement } from '../hooks/useFloating';
import { usePresence } from '../hooks/usePresence';
import { Portal } from './Portal';
import { cloneTrigger } from './triggerProps';

export interface PopoverProps {
  /** A single focusable element (usually a Button). */
  trigger: ReactElement;
  /** Content, or a render function receiving `close`. */
  children: ReactNode | ((api: { close: () => void }) => ReactNode);
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  placement?: Placement;
  className?: string;
}

export function Popover({
  trigger,
  children,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  placement = 'bottom-start',
  className,
}: PopoverProps) {
  const [open, setOpen] = useControllableState(openProp, defaultOpen, onOpenChange);
  const anchorRef = useRef<HTMLElement>(null);
  const floatingRef = useRef<HTMLDivElement>(null);
  const id = useId();
  const { mounted, state } = usePresence(open, 150);
  const { style } = useFloating(anchorRef, floatingRef, { placement, open: mounted });
  const close = () => setOpen(false);

  useClickOutside([anchorRef, floatingRef], close, open);
  useEscapeKey(() => {
    close();
    anchorRef.current?.focus();
  }, open);

  return (
    <>
      {cloneTrigger(trigger, anchorRef, {
        onClick: () => setOpen(!open),
        'aria-expanded': open,
        'aria-haspopup': 'dialog',
        'aria-controls': open ? id : undefined,
      })}
      {mounted && (
        <Portal>
          <div
            ref={floatingRef}
            id={id}
            role="dialog"
            data-state={state}
            style={style}
            className={cn(
              'z-50 rounded-xl bg-elevated p-3 text-fg shadow-popover transition-opacity duration-150 data-[state=closed]:opacity-0 data-[state=open]:animate-fx-pop-in',
              className,
            )}
          >
            {typeof children === 'function' ? children({ close }) : children}
          </div>
        </Portal>
      )}
    </>
  );
}
