import { useState } from 'react';
import { Button, Tag } from 'focus-ui';

export default function Example() {
  const [filters, setFilters] = useState(['Status: Pending', 'Warehouse: Rotterdam', 'Owner: Me']);
  return (
    <div className="flex flex-wrap items-center gap-2">
      {filters.map((f) => (
        <Tag key={f} onRemove={() => setFilters(filters.filter((x) => x !== f))}>
          {f}
        </Tag>
      ))}
      <Tag selected>Overdue only</Tag>
      {filters.length < 3 && (
        <Button size="sm" variant="plain" onClick={() => setFilters(['Status: Pending', 'Warehouse: Rotterdam', 'Owner: Me'])}>
          Reset
        </Button>
      )}
    </div>
  );
}
