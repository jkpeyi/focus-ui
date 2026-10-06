import { useMemo, useState } from 'react';
import {
  Avatar,
  Badge,
  Button,
  DataTable,
  DropdownMenu,
  IconButton,
  SearchField,
  SegmentedControl,
  formatCurrency,
  formatDate,
  useToast,
  type DataTableColumn,
} from 'focus-ui';
import { Archive, FileDown, MoreHorizontal, Printer } from 'lucide-react';
import { orders, statusMeta, type Order } from '../../demo/data';

export default function Example() {
  const { toast } = useToast();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');

  const rows = useMemo(
    () =>
      orders.filter(
        (o) =>
          (status === 'all' || o.status === status) && (o.number + o.customer.name).toLowerCase().includes(query.toLowerCase()),
      ),
    [query, status],
  );

  const columns: DataTableColumn<Order>[] = [
    { id: 'number', header: 'Order', sortable: true, cell: (o) => <span className="font-medium">{o.number}</span> },
    {
      id: 'customer',
      header: 'Customer',
      sortable: true,
      accessor: (o) => o.customer.name,
      cell: (o) => (
        <div className="flex items-center gap-2.5">
          <Avatar name={o.customer.name} size="xs" shape="rounded" />
          <span className="truncate">{o.customer.name}</span>
        </div>
      ),
    },
    {
      id: 'date',
      header: 'Date',
      sortable: true,
      hideBelow: 'md',
      accessor: (o) => new Date(o.date),
      cell: (o) => formatDate(o.date),
    },
    {
      id: 'status',
      header: 'Status',
      sortable: true,
      cell: (o) => (
        <Badge tone={statusMeta[o.status].tone} dot>
          {statusMeta[o.status].label}
        </Badge>
      ),
    },
    {
      id: 'items',
      header: 'Units',
      align: 'right',
      sortable: true,
      hideBelow: 'lg',
      footer: (r) => r.reduce((s, o) => s + o.items, 0).toLocaleString(),
    },
    {
      id: 'total',
      header: 'Total',
      align: 'right',
      sortable: true,
      cell: (o) => formatCurrency(o.total),
      footer: (r) => formatCurrency(r.reduce((s, o) => s + o.total, 0)),
    },
    {
      id: 'actions',
      header: <span className="sr-only">Actions</span>,
      width: 48,
      cell: (o) => (
        <div onClick={(e) => e.stopPropagation()}>
          <DropdownMenu
            trigger={<IconButton label={`Actions for ${o.number}`} icon={<MoreHorizontal />} size="sm" />}
            items={[{ label: 'Open' }, { label: 'Duplicate' }, { type: 'separator' }, { label: 'Cancel order', tone: 'danger' }]}
          />
        </div>
      ),
    },
  ];

  return (
    <DataTable
      className="w-full"
      caption="Sales orders"
      columns={columns}
      data={rows}
      rowKey="id"
      defaultSort={{ id: 'date', direction: 'desc' }}
      selectable
      pageSize={10}
      maxHeight={520}
      onRowClick={(o) => toast({ title: `Open ${o.number}` })}
      toolbar={
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <SegmentedControl
            size="sm"
            aria-label="Status"
            value={status}
            onValueChange={setStatus}
            options={[
              { value: 'all', label: 'All' },
              { value: 'pending', label: 'Pending' },
              { value: 'approved', label: 'Approved' },
              { value: 'shipped', label: 'Shipped' },
            ]}
          />
          <SearchField size="sm" value={query} onValueChange={setQuery} placeholder="Search orders" className="md:max-w-64" />
        </div>
      }
      bulkActions={(selected, clear) => (
        <>
          <Button size="sm" variant="plain" leadingIcon={<Printer />}>
            Print
          </Button>
          <Button size="sm" variant="plain" leadingIcon={<FileDown />}>
            Export
          </Button>
          <Button
            size="sm"
            variant="tinted"
            leadingIcon={<Archive />}
            onClick={() => {
              toast({ title: `${selected.length} orders archived`, tone: 'success' });
              clear();
            }}
          >
            Archive
          </Button>
        </>
      )}
    />
  );
}
