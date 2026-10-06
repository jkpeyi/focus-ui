import { forwardRef, useEffect, useRef, type InputHTMLAttributes } from 'react';
import { cn } from '../utils/cn';
import { mergeRefs } from '../utils/ref';
import { useControllableState } from '../hooks/useControllableState';
import { controlSizes, type ControlSize } from './controlStyles';
import { SearchIcon, XIcon } from './icons';
import { Kbd } from './Kbd';

export interface SearchFieldProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size' | 'value' | 'defaultValue' | 'onChange'
> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  size?: ControlSize;
  /** Global keyboard shortcut that focuses the field, e.g. "k" for ⌘K / Ctrl+K. */
  shortcut?: string;
}

/** Rounded, filled search input (Spotlight / Finder style) with clear button and optional ⌘K shortcut. */
export const SearchField = forwardRef<HTMLInputElement, SearchFieldProps>(function SearchField(
  { value: valueProp, defaultValue = '', onValueChange, size = 'md', shortcut, className, placeholder = 'Search', ...props },
  ref,
) {
  const [value, setValue] = useControllableState(valueProp, defaultValue, onValueChange);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!shortcut) return;
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === shortcut.toLowerCase()) {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [shortcut]);

  return (
    <div className={cn('relative flex w-full items-center', className)}>
      <SearchIcon className="pointer-events-none absolute left-2.5 size-4 text-fg-subtle" />
      <input
        ref={mergeRefs(inputRef, ref)}
        type="search"
        value={value}
        placeholder={placeholder}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Escape' && value) {
            e.stopPropagation();
            setValue('');
          }
          props.onKeyDown?.(e);
        }}
        className={cn(
          'w-full rounded-lg border border-transparent bg-fill/12 text-fg placeholder:text-fg-subtle',
          'transition-[background-color,box-shadow,border-color] duration-150 focus:border-accent focus:bg-surface focus:ring-[3px] focus:ring-accent/20 focus:outline-none',
          '[&::-webkit-search-cancel-button]:appearance-none',
          controlSizes[size],
          'pl-8',
          shortcut ? 'pr-14' : 'pr-8',
        )}
        {...props}
      />
      <div className="absolute right-2 flex items-center gap-1">
        {value ? (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => {
              setValue('');
              inputRef.current?.focus();
            }}
            className="flex size-4 items-center justify-center rounded-full bg-fg-subtle/70 text-surface hover:bg-fg-muted"
          >
            <XIcon className="size-2.5" strokeWidth={3.5} />
          </button>
        ) : (
          shortcut && (
            <span className="pointer-events-none hidden gap-0.5 sm:flex">
              <Kbd>⌘</Kbd>
              <Kbd>{shortcut.toUpperCase()}</Kbd>
            </span>
          )
        )}
      </div>
    </div>
  );
});
