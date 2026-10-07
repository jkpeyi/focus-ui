import { Badge } from '@jkpeyi/focus-ui';

const statuses = [
  { label: 'Draft', tone: 'neutral' },
  { label: 'Pending approval', tone: 'warning' },
  { label: 'Approved', tone: 'accent' },
  { label: 'Shipped', tone: 'info' },
  { label: 'Delivered', tone: 'success' },
  { label: 'Cancelled', tone: 'danger' },
] as const;

export default function Example() {
  return (
    <>
      {statuses.map((s) => (
        <Badge key={s.label} tone={s.tone} dot>
          {s.label}
        </Badge>
      ))}
    </>
  );
}
