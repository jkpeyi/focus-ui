import { IconButton } from 'focus-ui';
import { Bell, Filter, MoreHorizontal, Pencil, Plus, Trash2 } from 'lucide-react';

export default function Example() {
  return (
    <>
      <IconButton label="Notifications" icon={<Bell />} />
      <IconButton label="Filter" icon={<Filter />} />
      <IconButton label="Edit" icon={<Pencil />} variant="secondary" />
      <IconButton label="Add line" icon={<Plus />} variant="primary" shape="circle" />
      <IconButton label="Delete" icon={<Trash2 />} variant="destructive-tinted" />
      <IconButton label="More" icon={<MoreHorizontal />} size="sm" />
    </>
  );
}
