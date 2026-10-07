import { useState } from 'react';
import { Badge, Button, Checkbox, Divider, Popover } from '@jkpeyi/focus-ui';
import { ListFilter } from 'lucide-react';

const all = ['Draft', 'Pending approval', 'Approved', 'Shipped', 'Delivered'];

export default function Example() {
  const [selected, setSelected] = useState<string[]>(['Pending approval']);
  return (
    <Popover
      className="w-64"
      trigger={
        <Button leadingIcon={<ListFilter />}>
          Status{' '}
          {selected.length > 0 && (
            <Badge tone="accent" size="sm">
              {selected.length}
            </Badge>
          )}
        </Button>
      }
    >
      {({ close }) => (
        <div className="flex flex-col gap-2.5">
          <div className="text-[13px] font-semibold">Filter by status</div>
          {all.map((s) => (
            <Checkbox
              key={s}
              label={s}
              checked={selected.includes(s)}
              onChange={(on) => setSelected(on ? [...selected, s] : selected.filter((x) => x !== s))}
            />
          ))}
          <Divider className="my-1" />
          <div className="flex justify-between">
            <Button size="sm" variant="plain" onClick={() => setSelected([])}>
              Clear
            </Button>
            <Button size="sm" variant="primary" onClick={close}>
              Apply
            </Button>
          </div>
        </div>
      )}
    </Popover>
  );
}
