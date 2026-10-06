import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../utils/cn';
import { usePresence } from '../hooks/usePresence';
import { Portal } from './Portal';

export interface ActionBarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Show or hide the bar (e.g. when a form becomes dirty). */
  open: boolean;
  /** Message on the left, e.g. "You have unsaved changes". */
  message?: ReactNode;
  /** Buttons on the right. */
  actions?: ReactNode;
  /**
   * - `floating` (default): pill fixed at the bottom-center of the viewport.
   * - `sticky`: full-width bar stuck to the bottom of its scroll container — a form footer.
   */
  variant?: 'floating' | 'sticky';
}

/** Contextual footer for forms and editors: save / discard, review, submit. */
export function ActionBar({ open, message, actions, variant = 'floating', className, ...props }: ActionBarProps) {
  const { mounted, state } = usePresence(open, 200);
  if (!mounted) return null;

  const bar = (
    <div
      role="region"
      aria-label="Actions"
      aria-live="polite"
      data-state={state}
      className={cn(
        'flex items-center gap-3 transition-[opacity,transform] duration-200 ease-apple data-[state=closed]:translate-y-3 data-[state=closed]:opacity-0 data-[state=open]:animate-fx-toast-in',
        variant === 'floating'
          ? 'material pointer-events-auto max-w-full rounded-2xl py-2 pr-2 pl-4 shadow-modal'
          : 'material sticky bottom-0 z-20 -mx-px border-t border-line px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-6',
        className,
      )}
      {...props}
    >
      {message && <div className="min-w-0 flex-1 truncate text-[13px] font-medium text-fg">{message}</div>}
      {actions && <div className="ml-auto flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );

  if (variant === 'sticky') return bar;
  return (
    <Portal>
      <div className="pointer-events-none fixed inset-x-0 bottom-[max(3.5rem,calc(env(safe-area-inset-bottom)+1rem))] z-40 flex justify-center px-4">
        <div className="pointer-events-auto w-full max-w-xl">{bar}</div>
      </div>
    </Portal>
  );
}
