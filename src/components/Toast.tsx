import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { cn } from '../utils/cn';
import { Portal } from './Portal';
import { CheckCircleIcon, ErrorIcon, InfoIcon, WarningIcon, XIcon } from './icons';

export type ToastTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info';

export interface ToastOptions {
  title: ReactNode;
  description?: ReactNode;
  tone?: ToastTone;
  /** ms before auto-dismiss. `Infinity` keeps it until dismissed. Default 5000. */
  duration?: number;
  action?: { label: string; onClick: () => void };
}

interface ToastRecord extends ToastOptions {
  id: number;
  leaving?: boolean;
}

interface ToastApi {
  toast: (options: ToastOptions) => number;
  dismiss: (id: number) => void;
}

const ToastContext = createContext<ToastApi | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within <ToastProvider>');
  return ctx;
}

const icons = {
  neutral: null,
  success: <CheckCircleIcon className="text-success" />,
  warning: <WarningIcon className="text-warning" />,
  danger: <ErrorIcon className="text-danger" />,
  info: <InfoIcon className="text-accent" />,
};

export interface ToastProviderProps {
  children: ReactNode;
  position?: 'bottom-right' | 'bottom-center' | 'top-right' | 'top-center';
  /** Maximum toasts visible at once. */
  limit?: number;
}

export function ToastProvider({ children, position = 'bottom-right', limit = 4 }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastRecord[]>([]);
  const nextId = useRef(1);

  const dismiss = useCallback((id: number) => {
    setToasts((all) => all.map((t) => (t.id === id ? { ...t, leaving: true } : t)));
    setTimeout(() => setToasts((all) => all.filter((t) => t.id !== id)), 200);
  }, []);

  const toast = useCallback(
    (options: ToastOptions) => {
      const id = nextId.current++;
      setToasts((all) => [...all, { ...options, id }].slice(-limit));
      return id;
    },
    [limit],
  );

  const api = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);
  const top = position.startsWith('top');

  return (
    <ToastContext.Provider value={api}>
      {children}
      <Portal>
        <div
          aria-live="polite"
          className={cn(
            'pointer-events-none fixed z-[70] flex w-full flex-col gap-2 p-4 sm:max-w-sm',
            top ? 'top-0' : 'bottom-0 flex-col-reverse',
            position.endsWith('center') ? 'left-1/2 -translate-x-1/2' : 'right-0 max-sm:left-1/2 max-sm:-translate-x-1/2',
          )}
        >
          {toasts.map((t) => (
            <ToastItem key={t.id} toast={t} onDismiss={dismiss} />
          ))}
        </div>
      </Portal>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onDismiss: dismissById }: { toast: ToastRecord; onDismiss: (id: number) => void }) {
  const { id, title, description, tone = 'neutral', duration = 5000, action, leaving } = toast;
  const [paused, setPaused] = useState(false);
  const onDismiss = useCallback(() => dismissById(id), [dismissById, id]);
  useEffect(() => {
    if (paused || !Number.isFinite(duration)) return;
    const timer = setTimeout(onDismiss, duration);
    return () => clearTimeout(timer);
  }, [paused, duration, onDismiss]);

  return (
    <div
      role={tone === 'danger' ? 'alert' : 'status'}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      className={cn(
        'material pointer-events-auto flex items-start gap-3 rounded-2xl p-3.5 shadow-popover transition-all duration-200 ease-apple animate-fx-toast-in',
        leaving && 'scale-95 opacity-0',
      )}
    >
      {icons[tone] && <span className="mt-px shrink-0 [&_svg]:size-5">{icons[tone]}</span>}
      <div className="min-w-0 flex-1">
        <div className="text-sm font-semibold text-fg">{title}</div>
        {description && <div className="mt-0.5 text-[13px] text-fg-muted">{description}</div>}
      </div>
      {action && (
        <button
          type="button"
          onClick={() => {
            action.onClick();
            onDismiss();
          }}
          className="focus-ring shrink-0 rounded-md px-1.5 py-0.5 text-[13px] font-semibold text-accent hover:bg-accent/10"
        >
          {action.label}
        </button>
      )}
      <button
        type="button"
        aria-label="Dismiss notification"
        onClick={onDismiss}
        className="focus-ring -mr-1 flex size-6 shrink-0 items-center justify-center rounded-full text-fg-subtle hover:bg-fill/12 hover:text-fg"
      >
        <XIcon className="size-3.5" />
      </button>
    </div>
  );
}
