import { Field, PasswordInput } from 'focus-ui';

export default function Example() {
  return (
    <div className="grid w-full max-w-sm gap-5">
      <Field label="Current password">
        <PasswordInput placeholder="••••••••" />
      </Field>
      <Field label="New password" description="At least 12 characters, mixing letters, numbers and symbols.">
        <PasswordInput showStrength defaultValue="Acme-2026" />
      </Field>
    </div>
  );
}
