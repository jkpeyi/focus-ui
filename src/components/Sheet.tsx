import { useId, useRef, type ReactNode } from 'react';
import { cn } from '../utils/cn';
import { useEscapeKey } from '../hooks/useEscapeKey';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { useLockBodyScroll } from '../hooks/useLockBodyScroll';
import { usePresence } from '../hooks/usePresence';
import { Portal } from './Portal';
import { IconButton } from './IconButton';
import { XIcon } from './icons';

export interface SheetProps {
  open: boolean;
  onClose: () => void;
  side?: 'right' | 'left';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  title?: ReactNode;
  description?: ReactNode;
  /** Content rendered at the top-right next to the close button. */
  headerActions?: ReactNode;
  footer?: ReactNode;
  className?: string;
  children?: ReactNode;
}

const sizes = { sm: 'sm:max-w-sm', md: 'sm:max-w-md', lg: 'sm:max-w-xl', xl: 'sm:max-w-3xl' };

/** Side panel for record details, filters and quick edits without losing list context. */
export function Sheet({
  open,
  onClose,
  side = 'right',
  size = 'md',
  title,
  description,
  headerActions,
  footer,
  className,
  children,
}: SheetProps) {
  const { mounted, state } = usePresence(open, 300);
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  useFocusTrap(panelRef, open);
  useLockBodyScroll(open);
  useEscapeKey(onClose, open);
  if (!mounted) return null;

  return (
    <Portal>
      <div className="fixed inset-0 z-50">
        <div
          aria-hidden
          data-state={state}
          onClick={onClose}
          className="absolute inset-0 bg-scrim transition-opacity duration-300 data-[state=closed]:opacity-0 data-[state=open]:animate-fx-fade-in"
        />
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? titleId : undefined}
          data-state={state}
          tabIndex={-1}
          className={cn(
            'absolute inset-y-0 flex w-full flex-col bg-elevated shadow-modal outline-none transition-transform duration-300 ease-spring',
            side === 'right'
              ? 'right-0 data-[state=closed]:translate-x-full data-[state=open]:animate-fx-slide-in-right sm:rounded-l-2xl'
              : 'left-0 data-[state=closed]:-translate-x-full data-[state=open]:animate-fx-slide-in-left sm:rounded-r-2xl',
            sizes[size],
            className,
          )}
        >
          <div className="flex items-start gap-3 border-b border-line px-5 py-4">
            <div className="min-w-0 flex-1">
              {title && (
                <h2 id={titleId} className="truncate text-[17px] font-semibold tracking-[-0.015em]">
                  {title}
                </h2>
              )}
              {description && <p className="mt-0.5 text-[13px] text-fg-muted">{description}</p>}
            </div>
            {headerActions}
            <IconButton label="Close" icon={<XIcon />} size="sm" shape="circle" onClick={onClose} className="bg-fill/10" />
          </div>
          <div className="scrollbar-thin min-h-0 flex-1 overflow-y-auto px-5 py-4">{children}</div>
          {footer && (
            <div className="flex items-center justify-end gap-2 border-t border-line px-5 py-3.5 pb-[max(0.875rem,env(safe-area-inset-bottom))]">
              {footer}
            </div>
          )}
        </div>
      </div>
    </Portal>
  );
}
