import { forwardRef, useState } from 'react';
import { cn } from '../utils/cn';
import { Input, type InputProps } from './Input';

export interface PasswordStrength {
  /** 0 (empty) to 4 (strong). */
  score: 0 | 1 | 2 | 3 | 4;
  label: string;
}

/** Simple, dependency-free strength estimate (length + character variety). Replace with zxcvbn for stricter checks. */
export function getPasswordStrength(password: string): PasswordStrength {
  if (!password) return { score: 0, label: '' };
  let points = 0;
  if (password.length >= 8) points++;
  if (password.length >= 12) points++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) points++;
  if (/\d/.test(password)) points++;
  if (/[^A-Za-z0-9]/.test(password)) points++;
  const score = Math.max(1, Math.min(4, points - (password.length < 8 ? 1 : 0))) as PasswordStrength['score'];
  return { score, label: ['', 'Weak', 'Fair', 'Good', 'Strong'][score] };
}

const meterColors = ['', 'bg-danger', 'bg-warning', 'bg-accent', 'bg-success'];
const labelColors = ['', 'text-danger', 'text-warning', 'text-accent', 'text-success'];

export interface PasswordInputProps extends Omit<InputProps, 'type' | 'suffix'> {
  /** Show a 4-segment strength meter under the field (use on registration / change password). */
  showStrength?: boolean;
}

/** Password field with a show/hide toggle and optional strength meter. */
export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(function PasswordInput(
  { showStrength, value, defaultValue, onChange, wrapperClassName, autoComplete, ...props },
  ref,
) {
  const [visible, setVisible] = useState(false);
  const [internal, setInternal] = useState(String(defaultValue ?? ''));
  const current = value !== undefined ? String(value) : internal;
  const strength = getPasswordStrength(current);

  return (
    <div className={cn('flex w-full flex-col gap-1.5', wrapperClassName)}>
      <Input
        ref={ref}
        type={visible ? 'text' : 'password'}
        autoComplete={autoComplete ?? (showStrength ? 'new-password' : 'current-password')}
        value={value}
        defaultValue={value === undefined ? defaultValue : undefined}
        onChange={(e) => {
          if (value === undefined) setInternal(e.target.value);
          onChange?.(e);
        }}
        suffix={
          <button
            type="button"
            onClick={() => setVisible(!visible)}
            aria-label={visible ? 'Hide password' : 'Show password'}
            aria-pressed={visible}
            className="focus-ring -mr-1 rounded-md px-1 text-xs font-medium text-fg-muted hover:text-fg"
          >
            {visible ? 'Hide' : 'Show'}
          </button>
        }
        {...props}
      />
      {showStrength && (
        <div className="flex items-center gap-3" aria-live="polite">
          <div className="grid flex-1 grid-cols-4 gap-1" aria-hidden>
            {[1, 2, 3, 4].map((i) => (
              <span
                key={i}
                className={cn(
                  'h-1 rounded-full transition-colors duration-300',
                  strength.score >= i ? meterColors[strength.score] : 'bg-fill/16',
                )}
              />
            ))}
          </div>
          <span className={cn('w-12 text-right text-xs font-medium', labelColors[strength.score])}>{strength.label}</span>
        </div>
      )}
    </div>
  );
});
