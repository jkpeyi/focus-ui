import { useState } from 'react';
import { Field, OtpInput } from '@jkpeyi/focus-ui';

export default function Example() {
  const [code, setCode] = useState('');
  const [done, setDone] = useState<string | null>(null);
  return (
    <div className="flex flex-col items-center gap-8">
      <Field
        label="6-digit code"
        description={done ? `onComplete fired with ${done}` : 'Type or paste — focus advances automatically.'}
      >
        <OtpInput value={code} onValueChange={setCode} onComplete={setDone} groupSize={3} />
      </Field>
      <Field label="4-digit PIN (masked, compact)">
        <OtpInput length={4} size="md" mask />
      </Field>
      <Field label="Alphanumeric recovery code" error="Code is invalid or expired.">
        <OtpInput length={8} mode="alphanumeric" size="md" groupSize={4} defaultValue="K7Q2" />
      </Field>
    </div>
  );
}
