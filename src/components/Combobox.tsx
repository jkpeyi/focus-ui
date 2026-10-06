import { useId, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { cn } from '../utils/cn';
import { useControllableState } from '../hooks/useControllableState';
import { useClickOutside } from '../hooks/useClickOutside';
import { useFloating } from '../hooks/useFloating';
import { Portal } from './Portal';
import { controlBase, controlSizes, type ControlSize } from './controlStyles';
import { useFieldControlProps } from './Field';
import { CheckIcon, ChevronUpDownIcon } from './icons';

export interface ComboboxOption {
  value: string;
  label: string;
  /** Secondary text (e.g. SKU, customer number). Also searchable. */
  description?: string;
  icon?: ReactNode;
  disabled?: boolean;
}

export interface ComboboxProps {
  options: ComboboxOption[];
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  placeholder?: string;
  emptyText?: ReactNode;
  size?: ControlSize;
  disabled?: boolean;
  invalid?: boolean;
  id?: string;
  className?: string;
  /** Custom filter. Defaults to case-insensitive match on label + description. */
  filter?: (option: ComboboxOption, query: string) => boolean;
  'aria-label'?: string;
}

const defaultFilter = (o: ComboboxOption, q: string) => {
  const needle = q.trim().toLowerCase();
  return !needle || o.label.toLowerCase().includes(needle) || (o.description?.toLowerCase().includes(needle) ?? false);
};

/** Searchable select — the go-to picker for customers, products, accounts and cost centers. */
export function Combobox({
  options,
  value: valueProp,
  defaultValue = null,
  onValueChange,
  placeholder = 'Select…',
  emptyText = 'No results',
  size = 'md',
  disabled,
  invalid,
  id,
  className,
  filter = defaultFilter,
  ...aria
}: ComboboxProps) {
  const [value, setValue] = useControllableState<string | null>(valueProp, defaultValue, onValueChange);
  const selected = options.find((o) => o.value === value) ?? null;
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listId = useId();
  const { style } = useFloating(wrapperRef, listRef, { open, matchWidth: true, offset: 4 });
  const { invalid: _invalid, ...fieldProps } = useFieldControlProps({ id, disabled, invalid });

  const filtered = useMemo(() => options.filter((o) => filter(o, query)), [options, query, filter]);

  const openList = () => {
    if (disabled) return;
    setOpen(true);
    setQuery('');
    const idx = options.findIndex((o) => o.value === value);
    setActive(Math.max(0, idx));
  };
  const close = () => {
    setOpen(false);
    setQuery('');
  };
  useClickOutside([wrapperRef, listRef], close, open);

  const commit = (option: ComboboxOption | undefined) => {
    if (!option || option.disabled) return;
    setValue(option.value);
    close();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!open) return openList();
      setActive((a) => Math.min(filtered.length - 1, a + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(0, a - 1));
    } else if (e.key === 'Enter') {
      if (open) {
        e.preventDefault();
        commit(filtered[active]);
      }
    } else if (e.key === 'Escape') {
      if (open) {
        e.stopPropagation();
        close();
      }
    } else if (e.key === 'Tab') {
      close();
    }
  };

  return (
    <div ref={wrapperRef} className={cn('relative w-full', className)}>
      <input
        ref={inputRef}
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={open && filtered[active] ? `${listId}-${active}` : undefined}
        aria-label={aria['aria-label']}
        autoComplete="off"
        {...fieldProps}
        value={open ? query : (selected?.label ?? '')}
        placeholder={open && selected ? selected.label : placeholder}
        onChange={(e) => {
          setQuery(e.target.value);
          setActive(0);
          if (!open) setOpen(true);
        }}
        onClick={() => (open ? undefined : openList())}
        onKeyDown={onKeyDown}
        className={cn(controlBase, controlSizes[size], 'cursor-default pr-8 focus:cursor-text')}
      />
      <ChevronUpDownIcon
        aria-hidden
        className="pointer-events-none absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2 text-fg-muted"
      />
      {open && (
        <Portal>
          <ul
            ref={listRef}
            id={listId}
            role="listbox"
            style={style}
            className="material scrollbar-thin z-50 max-h-72 overflow-y-auto rounded-xl p-1 shadow-popover animate-fx-pop-in"
          >
            {filtered.length === 0 && <li className="px-3 py-6 text-center text-[13px] text-fg-muted">{emptyText}</li>}
            {filtered.map((option, i) => {
              const isSelected = option.value === value;
              const isActive = i === active;
              return (
                <li
                  key={option.value}
                  id={`${listId}-${i}`}
                  role="option"
                  aria-selected={isSelected}
                  aria-disabled={option.disabled || undefined}
                  onPointerMove={() => setActive(i)}
                  onPointerDown={(e) => e.preventDefault()}
                  onClick={() => commit(option)}
                  className={cn(
                    'flex cursor-default items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[13px] select-none [&_svg]:size-4',
                    isActive ? 'bg-accent text-accent-fg' : 'text-fg',
                    option.disabled && 'opacity-40',
                  )}
                >
                  {option.icon}
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate">{option.label}</span>
                    {option.description && (
                      <span className={cn('truncate text-xs', isActive ? 'text-current/80' : 'text-fg-muted')}>
                        {option.description}
                      </span>
                    )}
                  </span>
                  {isSelected && <CheckIcon className="size-3.5 shrink-0" />}
                </li>
              );
            })}
          </ul>
        </Portal>
      )}
    </div>
  );
}
