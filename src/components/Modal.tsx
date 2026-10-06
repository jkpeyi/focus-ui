import { useId, useRef, type ReactNode, type RefObject } from 'react';
import { cn } from '../utils/cn';
import { useEscapeKey } from '../hooks/useEscapeKey';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { useLockBodyScroll } from '../hooks/useLockBodyScroll';
import { usePresence } from '../hooks/usePresence';
import { Portal } from './Portal';
import { IconButton } from './IconButton';
import { XIcon } from './icons';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  /** Sticky footer, typically action buttons. */
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /** Close when clicking the backdrop. Default `true`. */
  dismissible?: boolean;
  hideCloseButton?: boolean;
  /** Element to focus when opened. Defaults to the first focusable element. */
  initialFocus?: RefObject<HTMLElement | null>;
  /** Use `alertdialog` for confirmations that require a decision. */
  role?: 'dialog' | 'alertdialog';
  className?: string;
  children?: ReactNode;
}

const sizes = {
  sm: 'sm:max-w-sm',
  md: 'sm:max-w-lg',
  lg: 'sm:max-w-2xl',
  xl: 'sm:max-w-4xl',
  full: 'sm:max-w-[calc(100vw-4rem)] sm:h-[calc(100dvh-4rem)]',
};

/**
 * Centered dialog on desktop, bottom sheet on phones.
 * Traps focus, restores it on close, locks body scroll and closes on Escape.
 */
export function Modal({
  open,
  onClose,
  title,
  description,
  footer,
  size = 'md',
  dismissible = true,
  hideCloseButton,
  initialFocus,
  role = 'dialog',
  className,
  children,
}: ModalProps) {
  const { mounted, state } = usePresence(open, 200);
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descId = useId();
  useFocusTrap(panelRef, open, initialFocus);
  useLockBodyScroll(open);
  useEscapeKey(() => dismissible && onClose(), open);

  if (!mounted) return null;
  return (
    <Portal>
      <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-8">
        <div
          aria-hidden
          data-state={state}
          onClick={() => dismissible && onClose()}
          className="absolute inset-0 bg-scrim backdrop-blur-[2px] transition-opacity duration-200 data-[state=closed]:opacity-0 data-[state=open]:animate-fx-fade-in"
        />
        <div
          ref={panelRef}
          role={role}
          aria-modal="true"
          aria-labelledby={title ? titleId : undefined}
          aria-describedby={description ? descId : undefined}
          data-state={state}
          tabIndex={-1}
          className={cn(
            'relative flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-2xl bg-elevated text-fg shadow-modal outline-none sm:max-h-[calc(100dvh-4rem)] sm:rounded-2xl',
            'transition-[opacity,transform] duration-200 ease-apple data-[state=closed]:translate-y-4 data-[state=closed]:opacity-0 sm:data-[state=closed]:translate-y-0 sm:data-[state=closed]:scale-95',
            'data-[state=open]:animate-fx-modal-in',
            sizes[size],
            className,
          )}
        >
          {/* Grabber, iOS-style, on small screens */}
          <div aria-hidden className="mx-auto mt-2 h-1 w-9 shrink-0 rounded-full bg-fill/30 sm:hidden" />
          {(title || !hideCloseButton) && (
            <div className="flex items-start gap-4 px-6 pt-4 pb-2 sm:pt-5">
              <div className="min-w-0 flex-1">
                {title && (
                  <h2 id={titleId} className="text-[17px] font-semibold tracking-[-0.015em] text-fg">
                    {title}
                  </h2>
                )}
                {description && (
                  <p id={descId} className="mt-1 text-[13px] text-fg-muted">
                    {description}
                  </p>
                )}
              </div>
              {!hideCloseButton && (
                <IconButton
                  label="Close"
                  icon={<XIcon />}
                  size="sm"
                  shape="circle"
                  onClick={onClose}
                  className="-mr-2 bg-fill/10"
                />
              )}
            </div>
          )}
          <div className="scrollbar-thin min-h-0 flex-1 overflow-y-auto px-6 py-3">{children}</div>
          {footer && (
            <div className="flex flex-col-reverse gap-2 px-6 pt-3 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:flex-row sm:justify-end sm:pb-5 [&>button]:max-sm:h-11 [&>button]:max-sm:w-full">
              {footer}
            </div>
          )}
        </div>
      </div>
    </Portal>
  );
}
