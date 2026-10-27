import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../utils/cn';
import { formatBytes } from '../utils/files';
import { CheckCircleIcon, ErrorIcon, FileIcon, XIcon } from './icons';
import { Spinner } from './Spinner';

export type FileItemStatus = 'pending' | 'uploading' | 'done' | 'error';

export interface FileItem {
  id: string;
  name: string;
  /** Bytes. */
  size?: number;
  /** MIME type — picks the icon colour/label. */
  type?: string;
  status?: FileItemStatus;
  /** 0–100, shown while uploading. */
  progress?: number;
  /** Error message when status is "error". */
  error?: ReactNode;
  /** Image thumbnail URL (e.g. from URL.createObjectURL). */
  preview?: string;
  /** Makes the name a link (e.g. to download an existing attachment). */
  href?: string;
}

export interface FileListProps extends Omit<HTMLAttributes<HTMLUListElement>, 'children'> {
  items: FileItem[];
  onRemove?: (id: string) => void;
  /** Called when the user retries a failed upload. */
  onRetry?: (id: string) => void;
  /** Extra controls per row (e.g. a download IconButton). */
  renderActions?: (item: FileItem) => ReactNode;
  /** Text when the list is empty. Nothing is rendered when omitted. */
  emptyText?: ReactNode;
}

/** Builds a FileItem from a browser File (with an image preview when possible). */
export function fileToItem(file: File, extra?: Partial<FileItem>): FileItem {
  const id = `${file.name}-${file.size}-${file.lastModified}-${Math.random().toString(36).slice(2, 8)}`;
  const preview =
    file.type.startsWith('image/') && typeof URL !== 'undefined' && 'createObjectURL' in URL
      ? URL.createObjectURL(file)
      : undefined;
  return { id, name: file.name, size: file.size, type: file.type, status: 'pending', preview, ...extra };
}

const kinds: Array<{ test: (type: string, ext: string) => boolean; label: string; tone: string }> = [
  { test: (t, e) => t === 'text/csv' || e === 'csv', label: 'CSV', tone: 'bg-success/12 text-success' },
  { test: (t, e) => t === 'application/pdf' || e === 'pdf', label: 'PDF', tone: 'bg-danger/12 text-danger' },
  {
    test: (t, e) => t.includes('sheet') || t.includes('excel') || ['xls', 'xlsx', 'ods'].includes(e),
    label: 'XLS',
    tone: 'bg-success/12 text-success',
  },
  {
    test: (t, e) => t.includes('word') || ['doc', 'docx', 'odt', 'rtf', 'txt'].includes(e),
    label: 'DOC',
    tone: 'bg-accent/12 text-accent',
  },
  {
    test: (t, e) => t.startsWith('image/') || ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(e),
    label: 'IMG',
    tone: 'bg-info/12 text-info',
  },
  {
    test: (t, e) => t.includes('zip') || ['zip', 'rar', '7z', 'gz'].includes(e),
    label: 'ZIP',
    tone: 'bg-warning/12 text-warning',
  },
];

function kindOf(item: FileItem) {
  const ext = item.name.split('.').pop()?.toLowerCase() ?? '';
  return kinds.find((k) => k.test((item.type ?? '').toLowerCase(), ext));
}

/** List of attached / uploading files with type icon, size, progress, retry and remove. */
export function FileList({ items, onRemove, onRetry, renderActions, emptyText, className, ...props }: FileListProps) {
  if (items.length === 0) {
    return emptyText ? <p className={cn('py-3 text-center text-[13px] text-fg-muted', className)}>{emptyText}</p> : null;
  }
  return (
    <ul className={cn('divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface', className)} {...props}>
      {items.map((item) => {
        const kind = kindOf(item);
        const status = item.status ?? 'done';
        const progress = Math.max(0, Math.min(100, item.progress ?? 0));
        return (
          <li key={item.id} className="flex items-center gap-3 px-3 py-2.5" aria-busy={status === 'uploading' || undefined}>
            {item.preview ? (
              <img src={item.preview} alt="" className="size-9 shrink-0 rounded-lg object-cover ring-1 ring-line" />
            ) : (
              <span
                aria-hidden
                className={cn(
                  'flex size-9 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold tracking-wide',
                  kind?.tone ?? 'bg-fill/12 text-fg-muted',
                )}
              >
                {kind?.label ?? <FileIcon className="size-4" />}
              </span>
            )}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                {item.href ? (
                  <a
                    href={item.href}
                    className="focus-ring truncate rounded text-[13px] font-medium text-fg hover:text-accent"
                    title={item.name}
                  >
                    {item.name}
                  </a>
                ) : (
                  <span className="truncate text-[13px] font-medium text-fg" title={item.name}>
                    {item.name}
                  </span>
                )}
                {status === 'done' && <CheckCircleIcon aria-label="Uploaded" className="size-3.5 shrink-0 text-success" />}
              </div>
              {status === 'uploading' ? (
                <div className="mt-1.5 flex items-center gap-2">
                  <div
                    role="progressbar"
                    aria-label={`Uploading ${item.name}`}
                    aria-valuenow={progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    className="h-1 flex-1 overflow-hidden rounded-full bg-fill/16"
                  >
                    <div
                      className="h-full rounded-full bg-accent transition-[width] duration-300 ease-apple"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-[11px] text-fg-muted tabular-nums">{Math.round(progress)}%</span>
                </div>
              ) : status === 'error' ? (
                <div className="mt-0.5 flex items-center gap-1 text-xs text-danger">
                  <ErrorIcon className="size-3 shrink-0" />
                  <span className="truncate">{item.error ?? 'Upload failed'}</span>
                </div>
              ) : (
                <div className="mt-0.5 text-xs text-fg-muted tabular-nums">
                  {item.size !== undefined ? formatBytes(item.size) : ''}
                  {status === 'pending' && ' · Waiting…'}
                </div>
              )}
            </div>
            <div className="flex shrink-0 items-center gap-1">
              {status === 'uploading' && <Spinner size="xs" className="text-fg-subtle" label={`Uploading ${item.name}`} />}
              {status === 'error' && onRetry && (
                <button
                  type="button"
                  onClick={() => onRetry(item.id)}
                  className="focus-ring rounded-md px-1.5 py-0.5 text-xs font-medium text-accent hover:bg-accent/10"
                >
                  Retry
                </button>
              )}
              {renderActions?.(item)}
              {onRemove && (
                <button
                  type="button"
                  onClick={() => onRemove(item.id)}
                  aria-label={`Remove ${item.name}`}
                  className="focus-ring flex size-7 items-center justify-center rounded-lg text-fg-subtle hover:bg-fill/12 hover:text-fg"
                >
                  <XIcon className="size-3.5" />
                </button>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
