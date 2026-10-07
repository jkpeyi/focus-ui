import { useState } from 'react';
import { Avatar, Combobox, Field } from '@jkpeyi/focus-ui';
import { customers } from '../../demo/data';

export default function Example() {
  const [customer, setCustomer] = useState<string | null>('C-1003');
  return (
    <div className="w-full max-w-sm">
      <Field label="Customer" description="Search by name or customer number.">
        <Combobox
          value={customer}
          onValueChange={setCustomer}
          placeholder="Select customer…"
          options={customers.map((c) => ({
            value: c.id,
            label: c.name,
            description: `${c.id} · ${c.city}, ${c.country}`,
            icon: <Avatar name={c.name} size="xs" shape="rounded" />,
          }))}
        />
      </Field>
    </div>
  );
}
