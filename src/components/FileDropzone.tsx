import { useId, useRef, useState, type DragEvent, type KeyboardEvent, type ReactNode } from 'react';
import { cn } from '../utils/cn';
import { describeAccept, formatBytes, validateFiles, type FileRejection } from '../utils/files';
import { useFieldControlProps } from './Field';
import { UploadIcon } from './icons';

export interface FileDropzoneProps {
  /** Same as the native attribute: ".pdf,.xlsx", "image/*"… */
  accept?: string;
  /** Allow several files at once. Default true. */
  multiple?: boolean;
  /** Max size per file, in bytes. */
  maxSize?: number;
  /** Max total files; pass `currentCount` so already-added files count. */
  maxFiles?: number;
  currentCount?: number;
  /** Called with files that passed validation. */
  onFilesAdded?: (files: File[]) => void;
  /** Called with files rejected by `accept`, `maxSize` or `maxFiles`. */
  onReject?: (rejections: FileRejection[]) => void;
  title?: ReactNode;
  /** Defaults to a summary of accept / maxSize, e.g. "PDF, PNG up to 10 MB". */
  description?: ReactNode;
  icon?: ReactNode;
  /** Single-row layout for tight spaces (sheets, table toolbars). */
  compact?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  id?: string;
  name?: string;
  className?: string;
}

/**
 * Drag-and-drop target that also works as a click / keyboard file picker.
 * Validates type, size and count before handing files over.
 */
export function FileDropzone({
  accept,
  multiple = true,
  maxSize,
  maxFiles,
  currentCount = 0,
  onFilesAdded,
  onReject,
  title,
  description,
  icon,
  compact,
  name,
  className,
  ...props
}: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const depth = useRef(0);
  const hintId = useId();
  const { invalid, disabled, required: _required, ...field } = useFieldControlProps(props);
  const full = maxFiles !== undefined && currentCount >= maxFiles;
  const inactive = disabled || full;

  const hint =
    description ??
    [describeAccept(accept), maxSize ? `up to ${formatBytes(maxSize)}` : '', maxFiles ? `max ${maxFiles} files` : '']
      .filter(Boolean)
      .join(' · ');

  const handle = (list: FileList | File[] | null) => {
    const all = Array.from(list ?? []);
    const { accepted, rejected } = validateFiles(multiple ? all : all.slice(0, 1), { accept, maxSize, maxFiles, currentCount });
    if (!multiple && all.length > 1) {
      rejected.push(...all.slice(1).map((file) => ({ file, reason: 'count' as const, message: 'Only one file can be added.' })));
    }
    if (accepted.length) onFilesAdded?.(accepted);
    if (rejected.length) onReject?.(rejected);
  };

  const open = () => !inactive && inputRef.current?.click();

  const onDrag = (e: DragEvent<HTMLDivElement>, kind: 'enter' | 'leave' | 'over' | 'drop') => {
    e.preventDefault();
    e.stopPropagation();
    if (inactive) return;
    if (kind === 'enter') {
      depth.current++;
      setDragging(true);
    } else if (kind === 'leave') {
      depth.current = Math.max(0, depth.current - 1);
      if (depth.current === 0) setDragging(false);
    } else if (kind === 'over') {
      e.dataTransfer.dropEffect = 'copy';
    } else {
      depth.current = 0;
      setDragging(false);
      handle(e.dataTransfer.files);
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      open();
    }
  };

  return (
    <div
      role="button"
      tabIndex={inactive ? -1 : 0}
      {...field}
      aria-describedby={[field['aria-describedby'], hint ? hintId : undefined].filter(Boolean).join(' ') || undefined}
      aria-disabled={inactive || undefined}
      aria-invalid={invalid || undefined}
      data-dragging={dragging || undefined}
      onClick={open}
      onKeyDown={onKeyDown}
      onDragEnter={(e) => onDrag(e, 'enter')}
      onDragLeave={(e) => onDrag(e, 'leave')}
      onDragOver={(e) => onDrag(e, 'over')}
      onDrop={(e) => onDrag(e, 'drop')}
      className={cn(
        'focus-ring group/dz relative flex cursor-pointer rounded-2xl border border-dashed border-line-strong bg-surface-2 text-center transition-[border-color,background-color,box-shadow] duration-150 dark:bg-fill/6',
        'hover:border-fg-subtle/70 hover:bg-fill/6',
        compact ? 'items-center gap-3 px-4 py-3 text-left' : 'flex-col items-center justify-center gap-1 px-6 py-8',
        dragging && 'border-solid border-accent bg-accent/6 ring-4 ring-accent/12',
        invalid && 'border-danger',
        inactive && 'pointer-events-none cursor-not-allowed opacity-55',
        className,
      )}
    >
      <input
        ref={inputRef}
        type="file"
        name={name}
        accept={accept}
        multiple={multiple}
        disabled={inactive}
        tabIndex={-1}
        aria-hidden
        className="sr-only"
        onClick={(e) => e.stopPropagation()}
        onChange={(e) => {
          handle(e.target.files);
          e.target.value = ''; // allow re-selecting the same file
        }}
      />
      <span
        aria-hidden
        className={cn(
          'flex shrink-0 items-center justify-center rounded-xl bg-surface text-fg-muted shadow-raised transition-all duration-200 dark:bg-elevated [&_svg]:size-5',
          compact ? 'size-9' : 'mb-3 size-11',
          dragging && 'scale-110 text-accent',
        )}
      >
        {icon ?? <UploadIcon />}
      </span>
      <span className={cn('flex flex-col', compact && 'min-w-0 flex-1')}>
        <span className="text-sm font-medium text-fg">
          {full
            ? `Maximum of ${maxFiles} files reached`
            : dragging
              ? 'Drop to upload'
              : (title ?? (
                  <>
                    <span className="text-accent">Choose {multiple ? 'files' : 'a file'}</span> or drag {multiple ? 'them' : 'it'}{' '}
                    here
                  </>
                ))}
        </span>
        {hint && (
          <span id={hintId} className="mt-0.5 text-xs text-fg-muted">
            {hint}
          </span>
        )}
      </span>
    </div>
  );
}
