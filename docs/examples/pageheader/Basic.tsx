import { Badge, Breadcrumbs, Button, DropdownMenu, IconButton, PageHeader } from 'focus-ui';
import { MoreHorizontal, Printer, Send } from 'lucide-react';

export default function Example() {
  return (
    <PageHeader
      className="w-full"
      breadcrumbs={<Breadcrumbs items={[{ label: 'Sales', href: '#' }, { label: 'Orders', href: '#' }, { label: 'SO-24180' }]} />}
      title="SO-24180"
      meta={
        <Badge tone="warning" dot>
          Pending approval
        </Badge>
      }
      description="Northwind Traders · Created Sep 30, 2026 by Ava Thompson"
      actions={
        <>
          <Button leadingIcon={<Printer />}>Print</Button>
          <Button variant="primary" leadingIcon={<Send />}>
            Submit for approval
          </Button>
          <DropdownMenu
            trigger={<IconButton label="More" icon={<MoreHorizontal />} variant="secondary" />}
            items={[
              { label: 'Duplicate' },
              { label: 'Convert to invoice' },
              { type: 'separator' },
              { label: 'Cancel order', tone: 'danger' },
            ]}
          />
        </>
      }
    />
  );
}
