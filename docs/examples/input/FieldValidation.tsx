import { useState } from 'react';
import { Field, Input, Textarea } from '@jkpeyi/focus-ui';

export default function Example() {
  const [vat, setVat] = useState('FR12');
  const error = vat.length > 0 && vat.length < 13 ? 'VAT number must be 13 characters (e.g. FR12345678901).' : undefined;
  return (
    <div className="grid w-full max-w-sm gap-4">
      <Field label="Legal entity" description="As registered with the trade register." required>
        <Input defaultValue="Northwind Traders SAS" />
      </Field>
      <Field label="VAT number" error={error} required>
        <Input value={vat} onChange={(e) => setVat(e.target.value.toUpperCase())} />
      </Field>
      <Field label="Internal notes" labelAside="Optional">
        <Textarea placeholder="Visible to your team only" autoResize />
      </Field>
    </div>
  );
}
