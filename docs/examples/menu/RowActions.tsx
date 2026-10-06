import { useState } from 'react';
import { Button, DropdownMenu, IconButton, useToast } from 'focus-ui';
import { Archive, ChevronDown, Copy, FileDown, MoreHorizontal, Pencil, Printer, Trash2 } from 'lucide-react';

export default function Example() {
  const { toast } = useToast();
  const [density, setDensity] = useState('regular');
  return (
    <>
      <DropdownMenu
        aria-label="Order actions"
        trigger={<IconButton label="Order actions" icon={<MoreHorizontal />} variant="secondary" />}
        items={[
          { label: 'Edit', icon: <Pencil />, shortcut: '⌘E', onSelect: () => toast({ title: 'Edit order' }) },
          { label: 'Duplicate', icon: <Copy />, shortcut: '⌘D', onSelect: () => toast({ title: 'Order duplicated' }) },
          { label: 'Print', icon: <Printer />, shortcut: '⌘P' },
          { type: 'separator' },
          { label: 'Archive', icon: <Archive />, disabled: true },
          { label: 'Delete', icon: <Trash2 />, tone: 'danger', onSelect: () => toast({ title: 'Deleted', tone: 'danger' }) },
        ]}
      />
      <DropdownMenu
        placement="bottom-start"
        trigger={<Button trailingIcon={<ChevronDown />}>Export</Button>}
        items={[
          { type: 'label', label: 'Format' },
          { label: 'Excel (.xlsx)', icon: <FileDown />, description: 'Keeps formulas & formatting' },
          { label: 'CSV', icon: <FileDown /> },
          { label: 'PDF', icon: <FileDown /> },
          { type: 'separator' },
          { type: 'label', label: 'Density' },
          ...['compact', 'regular', 'comfortable'].map((d) => ({
            label: d[0].toUpperCase() + d.slice(1),
            checked: density === d,
            onSelect: () => setDensity(d),
          })),
        ]}
      />
    </>
  );
}
