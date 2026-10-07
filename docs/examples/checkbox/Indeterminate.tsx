import { useState } from 'react';
import { Checkbox } from '@jkpeyi/focus-ui';

const modules = ['Sales', 'Purchasing', 'Inventory', 'Accounting'];

export default function Example() {
  const [checked, setChecked] = useState<string[]>(['Sales', 'Inventory']);
  const all = checked.length === modules.length;
  return (
    <div className="flex flex-col gap-2.5">
      <Checkbox
        label="All modules"
        checked={all}
        indeterminate={!all && checked.length > 0}
        onChange={() => setChecked(all ? [] : modules)}
      />
      <div className="ml-6 flex flex-col gap-2.5">
        {modules.map((m) => (
          <Checkbox
            key={m}
            label={m}
            checked={checked.includes(m)}
            onChange={(on) => setChecked(on ? [...checked, m] : checked.filter((x) => x !== m))}
          />
        ))}
      </div>
    </div>
  );
}
