import { useEffect, useRef, type ClipboardEvent, type KeyboardEvent } from 'react';
import { cn } from '../utils/cn';
import { useControllableState } from '../hooks/useControllableState';
import { useFieldControlProps } from './Field';

export interface OtpInputProps {
  /** Number of characters. Default 6. */
  length?: number;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Called once every slot is filled — submit the code here. */
  onComplete?: (value: string) => void;
  /** `numeric` (default) only accepts digits; `alphanumeric` accepts A–Z too (uppercased). */
  mode?: 'numeric' | 'alphanumeric';
  /** Insert a visual separator after this many slots (e.g. 3 → "123 – 456"). */
  groupSize?: number;
  size?: 'md' | 'lg';
  invalid?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
  /** Mask characters like a password. */
  mask?: boolean;
  id?: string;
  'aria-label'?: string;
  className?: string;
}

/**
 * One-time code input: one box per character, auto-advance, backspace to the previous
 * box, arrow keys, and paste of the full code. Supports SMS autofill (autocomplete="one-time-code").
 */
export function OtpInput({
  length = 6,
  value: valueProp,
  defaultValue = '',
  onValueChange,
  onComplete,
  mode = 'numeric',
  groupSize,
  size = 'lg',
  invalid,
  disabled,
  autoFocus,
  mask,
  id,
  className,
  ...aria
}: OtpInputProps) {
  const [value, setValue] = useControllableState(valueProp, defaultValue, onValueChange);
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  const field = useFieldControlProps({ id, disabled, invalid });
  const pattern = mode === 'numeric' ? /[^0-9]/g : /[^0-9a-zA-Z]/g;
  const chars = Array.from({ length }, (_, i) => value[i] ?? '');

  // Disabling (e.g. while a code is being checked) drops focus. When the input is
  // re-enabled — typically after a wrong code — put the caret back so the user can retype.
  const wasDisabled = useRef(field.disabled);
  useEffect(() => {
    if (wasDisabled.current && !field.disabled && autoFocus) {
      refs.current[Math.min(value.length, length - 1)]?.focus();
    }
    wasDisabled.current = field.disabled;
  }, [field.disabled, autoFocus, value.length, length]);

  const commit = (next: string) => {
    const clean = next.replace(pattern, '').slice(0, length);
    const normalized = mode === 'alphanumeric' ? clean.toUpperCase() : clean;
    setValue(normalized);
    if (normalized.length === length) onComplete?.(normalized);
    return normalized;
  };

  const focus = (index: number) => {
    const el = refs.current[Math.max(0, Math.min(length - 1, index))];
    el?.focus();
    el?.select();
  };

  const handleInput = (index: number, raw: string) => {
    const typed = raw.replace(pattern, '');
    if (!typed) return;
    // Multiple characters (autofill or fast typing) fill forward from this slot.
    const next = (value.slice(0, index) + typed + value.slice(index + typed.length)).slice(0, length);
    const committed = commit(next);
    focus(Math.min(index + typed.length, committed.length >= length ? length - 1 : index + typed.length));
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      if (chars[index]) {
        commit(value.slice(0, index) + value.slice(index + 1));
      } else if (index > 0) {
        commit(value.slice(0, index - 1) + value.slice(index));
        focus(index - 1);
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      focus(index - 1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      focus(index + 1);
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const committed = commit(e.clipboardData.getData('text'));
    focus(Math.min(committed.length, length - 1));
  };

  return (
    <div role="group" aria-label={aria['aria-label'] ?? 'Verification code'} className={cn('flex items-center gap-2', className)}>
      {chars.map((char, i) => (
        <div key={i} className="contents">
          {groupSize && i > 0 && i % groupSize === 0 && (
            <span aria-hidden className="h-0.5 w-3 shrink-0 rounded-full bg-line-strong" />
          )}
          <input
            ref={(el) => {
              refs.current[i] = el;
            }}
            id={i === 0 ? field.id : undefined}
            aria-describedby={i === 0 ? field['aria-describedby'] : undefined}
            aria-invalid={field['aria-invalid']}
            aria-label={`Character ${i + 1} of ${length}`}
            type={mask ? 'password' : 'text'}
            inputMode={mode === 'numeric' ? 'numeric' : 'text'}
            autoComplete={i === 0 ? 'one-time-code' : 'off'}
            autoFocus={autoFocus && i === 0}
            disabled={field.disabled}
            maxLength={length}
            value={char}
            onChange={(e) => handleInput(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={handlePaste}
            onFocus={(e) => e.target.select()}
            className={cn(
              'w-full min-w-0 rounded-xl border border-line-strong bg-surface text-center font-semibold text-fg tabular-nums caret-accent',
              'transition-[border-color,box-shadow] duration-150 focus:border-accent focus:ring-[3px] focus:ring-accent/20 focus:outline-none',
              'disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-danger aria-invalid:focus:ring-danger/20 dark:bg-fill/12',
              size === 'lg' ? 'h-14 max-w-12 text-2xl' : 'h-11 max-w-10 text-lg',
              char && 'border-fg-subtle/60',
            )}
          />
        </div>
      ))}
    </div>
  );
}
