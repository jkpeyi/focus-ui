import { forwardRef, useRef, useState, type ReactNode } from 'react';
import { cn } from '../utils/cn';
import { mergeRefs } from '../utils/ref';
import { validateFiles, type FileRejection } from '../utils/files';
import { controlSizes, type ControlSize } from './controlStyles';
import { useFieldControlProps } from './Field';
import { PaperclipIcon, XIcon } from './icons';

export interface FileInputProps {
  /** Same as the native attribute: ".pdf,.csv", "image/*"… */
  accept?: string;
  multiple?: boolean;
  /** Max size per file, in bytes. */
  maxSize?: number;
  /** Controlled selection. Omit to let the component keep its own. */
  value?: File[];
  /** Called with the accepted files (an empty array when cleared). */
  onFilesChange?: (files: File[]) => void;
  /** Called with files rejected by `accept` / `maxSize`. */
  onReject?: (rejections: FileRejection[]) => void;
  placeholder?: ReactNode;
  buttonLabel?: ReactNode;
  /** Show a clear (×) button when files are selected. Default true. */
  clearable?: boolean;
  size?: ControlSize;
  /** Form field name — the native input is kept in the DOM so regular form posts work. */
  name?: string;
  id?: string;
  disabled?: boolean;
  required?: boolean;
  invalid?: boolean;
  className?: string;
  'aria-describedby'?: string;
}

/**
 * Compact file picker that looks like a text field: "Choose file" button + selected file name(s).
 * Labels, descriptions and errors come from a surrounding <Field>.
 */
export const FileInput = forwardRef<HTMLInputElement, FileInputProps>(function FileInput(
  {
    accept,
    multiple,
    maxSize,
    value,
    onFilesChange,
    onReject,
    placeholder = 'No file selected',
    buttonLabel = 'Choose file',
    clearable = true,
    size = 'md',
    name,
    className,
    ...props
  },
  ref,
) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [internal, setInternal] = useState<File[]>([]);
  const files = value ?? internal;
  const { invalid, disabled, required, ...field } = useFieldControlProps(props);

  const update = (next: File[]) => {
    if (value === undefined) setInternal(next);
    onFilesChange?.(next);
  };

  // Keep the native input in sync with what we accepted, so a regular form post
  // never sends a rejected file. DataTransfer is unavailable in some test environments.
  const syncNative = (next: File[]) => {
    const input = inputRef.current;
    if (!input) return;
    try {
      const dt = new DataTransfer();
      next.forEach((f) => dt.items.add(f));
      input.files = dt.files;
    } catch {
      if (next.length === 0) input.value = '';
    }
  };

  const handleChange = (list: FileList | null) => {
    const picked = Array.from(list ?? []);
    const { accepted, rejected } = validateFiles(picked, { accept, maxSize });
    if (rejected.length) onReject?.(rejected);
    if (picked.length > 0 && accepted.length === 0) {
      // Everything was refused: keep the current selection instead of wiping it.
      syncNative(files);
      return;
    }
    if (rejected.length) syncNative(accepted);
    update(accepted);
  };

  const clear = () => {
    if (inputRef.current) inputRef.current.value = '';
    update([]);
  };

  const summary =
    files.length === 0
      ? null
      : files.length === 1
        ? files[0].name
        : `${files.length} files · ${files.map((f) => f.name).join(', ')}`;

  return (
    <div
      className={cn(
        'relative flex w-full items-center gap-2 rounded-lg border border-line-strong bg-surface pr-1.5 pl-1 text-fg transition-[border-color,box-shadow]',
        'focus-within:border-accent focus-within:ring-[3px] focus-within:ring-accent/20 dark:bg-fill/12',
        invalid && 'border-danger focus-within:border-danger focus-within:ring-danger/20',
        disabled && 'cursor-not-allowed bg-fill/8 opacity-60',
        controlSizes[size].replace(/px-\S+/, ''),
        className,
      )}
    >
      {/* Native input stays in the DOM for form submission; the visible button drives it. */}
      <input
        ref={mergeRefs(inputRef, ref)}
        type="file"
        name={name}
        accept={accept}
        multiple={multiple}
        required={required && files.length === 0}
        disabled={disabled}
        tabIndex={-1}
        aria-hidden
        className="sr-only"
        onChange={(e) => handleChange(e.target.files)}
      />
      <button
        type="button"
        {...field}
        aria-invalid={invalid || undefined}
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        className={cn(
          'inline-flex shrink-0 items-center gap-1.5 rounded-md bg-fill/12 px-2.5 font-medium text-fg outline-none transition-colors hover:bg-fill/18 disabled:pointer-events-none [&_svg]:size-3.5',
          size === 'sm' ? 'h-5 text-xs' : size === 'lg' ? 'h-8 text-sm' : 'h-6 text-[13px]',
        )}
      >
        <PaperclipIcon />
        {buttonLabel}
      </button>
      <span className={cn('min-w-0 flex-1 truncate', files.length ? 'text-fg' : 'text-fg-subtle')} title={summary ?? undefined}>
        {summary ?? placeholder}
      </span>
      {clearable && files.length > 0 && !disabled && (
        <button
          type="button"
          onClick={clear}
          aria-label="Remove selected files"
          className="focus-ring flex size-5 shrink-0 items-center justify-center rounded-full text-fg-subtle hover:bg-fill/14 hover:text-fg"
        >
          <XIcon className="size-3" />
        </button>
      )}
    </div>
  );
});
