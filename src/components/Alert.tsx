import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../utils/cn';
import { CheckCircleIcon, ErrorIcon, InfoIcon, WarningIcon, XIcon } from './icons';

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  tone?: 'info' | 'success' | 'warning' | 'danger' | 'neutral';
  title?: ReactNode;
  icon?: ReactNode | false;
  actions?: ReactNode;
  onDismiss?: () => void;
}

const tones = {
  info: { box: 'bg-accent/8 ring-accent/15', icon: 'text-accent', Icon: InfoIcon },
  success: { box: 'bg-success/8 ring-success/15', icon: 'text-success', Icon: CheckCircleIcon },
  warning: { box: 'bg-warning/8 ring-warning/20', icon: 'text-warning', Icon: WarningIcon },
  danger: { box: 'bg-danger/7 ring-danger/15', icon: 'text-danger', Icon: ErrorIcon },
  neutral: { box: 'bg-fill/8 ring-line', icon: 'text-fg-muted', Icon: InfoIcon },
};

export function Alert({ tone = 'info', title, icon, actions, onDismiss, className, children, ...props }: AlertProps) {
  const t = tones[tone];
  return (
    <div
      role={tone === 'danger' || tone === 'warning' ? 'alert' : 'status'}
      className={cn('flex gap-3 rounded-xl p-3.5 ring-1 ring-inset', t.box, className)}
      {...props}
    >
      {icon !== false && <span className={cn('mt-px shrink-0 [&_svg]:size-[18px]', t.icon)}>{icon ?? <t.Icon />}</span>}
      <div className="min-w-0 flex-1 text-sm">
        {title && <div className="font-semibold text-fg">{title}</div>}
        {children && <div className={cn('text-fg-muted', title && 'mt-0.5')}>{children}</div>}
        {actions && <div className="mt-3 flex flex-wrap gap-2">{actions}</div>}
      </div>
      {onDismiss && (
        <button
          type="button"
          aria-label="Dismiss"
          onClick={onDismiss}
          className="focus-ring -m-1 flex size-6 shrink-0 items-center justify-center rounded-md text-fg-muted hover:bg-fill/12"
        >
          <XIcon className="size-3.5" />
        </button>
      )}
    </div>
  );
}
