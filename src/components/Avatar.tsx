import { Children, cloneElement, forwardRef, isValidElement, useState, type HTMLAttributes, type ReactElement } from 'react';
import { cn } from '../utils/cn';

export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  src?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  shape?: 'circle' | 'rounded';
  status?: 'online' | 'away' | 'busy' | 'offline';
}

const sizes = {
  xs: 'size-6 text-[10px]',
  sm: 'size-8 text-xs',
  md: 'size-10 text-sm',
  lg: 'size-12 text-base',
  xl: 'size-16 text-xl',
};
const statusColors = { online: 'bg-success', away: 'bg-warning', busy: 'bg-danger', offline: 'bg-fg-subtle' };

// Pleasant, deterministic gradients for initials.
const gradients = [
  'from-sky-400 to-blue-600',
  'from-violet-400 to-indigo-600',
  'from-emerald-400 to-teal-600',
  'from-amber-400 to-orange-600',
  'from-pink-400 to-rose-600',
  'from-slate-400 to-slate-600',
];

export function getInitials(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function hash(value: string) {
  let h = 0;
  for (let i = 0; i < value.length; i++) h = (h * 31 + value.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  { src, name, size = 'md', shape = 'circle', status, className, ...props },
  ref,
) {
  const [failed, setFailed] = useState(false);
  const showImage = src && !failed;
  const radius = shape === 'circle' ? 'rounded-full' : 'rounded-[28%]';
  return (
    <span ref={ref} className={cn('relative inline-flex shrink-0', sizes[size], className)} {...props}>
      <span
        role="img"
        aria-label={name}
        className={cn(
          'flex size-full items-center justify-center overflow-hidden font-semibold text-white select-none',
          radius,
          !showImage && cn('bg-gradient-to-br', gradients[hash(name ?? '') % gradients.length]),
        )}
      >
        {showImage ? (
          <img src={src} alt="" className="size-full object-cover" onError={() => setFailed(true)} />
        ) : (
          getInitials(name)
        )}
      </span>
      {status && (
        <span
          aria-label={status}
          className={cn(
            'absolute right-0 bottom-0 block size-[28%] min-h-2 min-w-2 rounded-full ring-2 ring-surface',
            statusColors[status],
          )}
        />
      )}
    </span>
  );
});

export interface AvatarGroupProps extends HTMLAttributes<HTMLDivElement> {
  max?: number;
  size?: AvatarProps['size'];
}

export function AvatarGroup({ max = 4, size = 'sm', className, children, ...props }: AvatarGroupProps) {
  const items = Children.toArray(children).filter(isValidElement) as ReactElement<AvatarProps>[];
  const visible = items.slice(0, max);
  const rest = items.length - visible.length;
  return (
    <div className={cn('flex items-center -space-x-2', className)} {...props}>
      {visible.map((child, i) => (
        <span key={i} className="rounded-full ring-2 ring-surface">
          {cloneElement(child, { size })}
        </span>
      ))}
      {rest > 0 && (
        <span
          className={cn(
            'relative inline-flex items-center justify-center rounded-full bg-fill/16 font-medium text-fg-muted ring-2 ring-surface',
            sizes[size],
          )}
        >
          +{rest}
        </span>
      )}
    </div>
  );
}
