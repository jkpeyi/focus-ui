import { useState } from 'react';
import { SearchField } from '@jkpeyi/focus-ui';

export default function Example() {
  const [q, setQ] = useState('');
  return (
    <div className="w-full max-w-sm space-y-2">
      <SearchField value={q} onValueChange={setQ} placeholder="Search orders, customers, SKUs…" shortcut="k" />
      <p className="text-[13px] text-fg-muted">Press ⌘K / Ctrl+K anywhere to focus. Esc clears.</p>
    </div>
  );
}
