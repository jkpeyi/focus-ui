import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../utils/cn';
import { InboxIcon } from './icons';

export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
}

export function EmptyState({ icon, title, description, actions, className, ...props }: EmptyStateProps) {
  return (
    <div className={cn('mx-auto flex max-w-sm flex-col items-center px-4 py-6 text-center', className)} {...props}>
      <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-fill/10 text-fg-subtle [&_svg]:size-6">
        {icon ?? <InboxIcon />}
      </div>
      <h3 className="text-[15px] font-semibold text-fg">{title}</h3>
      {description && <p className="mt-1 text-[13px] text-fg-muted">{description}</p>}
      {actions && <div className="mt-5 flex flex-wrap justify-center gap-2">{actions}</div>}
    </div>
  );
}
