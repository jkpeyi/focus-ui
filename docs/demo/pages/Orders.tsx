import { useMemo, useState, type Key } from 'react';
import {
  Avatar,
  Button,
  Checkbox,
  ConfirmDialog,
  DataTable,
  DescriptionList,
  Divider,
  DropdownMenu,
  IconButton,
  PageHeader,
  Popover,
  SearchField,
  Sheet,
  Stepper,
  Tab,
  TabList,
  Tabs,
  Tag,
  formatDate,
  useToast,
  type DataTableColumn,
} from '@jkpeyi/focus-ui';
import { Archive, ExternalLink, FileDown, ListFilter, MoreHorizontal, Plus, Printer, XCircle } from 'lucide-react';
import { orders, type Order, type OrderStatus } from '../data';
import { StatusBadge, eur, go } from '../shared';

const lifecycle: OrderStatus[] = ['draft', 'pending', 'approved', 'shipped', 'delivered'];
const warehouses = ['Seattle DC', 'Rotterdam', 'Singapore'];

export function Orders() {
  const { toast } = useToast();
  const [tab, setTab] = useState('all');
  const [query, setQuery] = useState('');
  const [whs, setWhs] = useState<string[]>([]);
  const [selected, setSelected] = useState<Key[]>([]);
  const [preview, setPreview] = useState<Order | null>(null);
  const [cancelling, setCancelling] = useState<Order[] | null>(null);

  const count = (s: string) => orders.filter((o) => s === 'all' || o.status === s).length;

  const rows = useMemo(
    () =>
      orders.filter(
        (o) =>
          (tab === 'all' || o.status === tab) &&
          (whs.length === 0 || whs.includes(o.warehouse)) &&
          `${o.number} ${o.customer.name} ${o.owner}`.toLowerCase().includes(query.toLowerCase()),
      ),
    [tab, query, whs],
  );

  const columns: DataTableColumn<Order>[] = [
    { id: 'number', header: 'Order', sortable: true, sticky: true, cell: (o) => <span className="font-medium">{o.number}</span> },
    {
      id: 'customer',
      header: 'Customer',
      sortable: true,
      accessor: (o) => o.customer.name,
      cell: (o) => (
        <div className="flex min-w-40 items-center gap-2.5">
          <Avatar name={o.customer.name} size="xs" shape="rounded" />
          <div className="min-w-0">
            <div className="truncate">{o.customer.name}</div>
            <div className="truncate text-xs text-fg-muted">{o.customer.city}</div>
          </div>
        </div>
      ),
    },
    {
      id: 'date',
      header: 'Ordered',
      sortable: true,
      hideBelow: 'md',
      accessor: (o) => new Date(o.date),
      cell: (o) => formatDate(o.date),
    },
    { id: 'status', header: 'Status', sortable: true, cell: (o) => <StatusBadge status={o.status} /> },
    { id: 'warehouse', header: 'Warehouse', hideBelow: 'xl' },
    {
      id: 'owner',
      header: 'Owner',
      hideBelow: 'lg',
      sortable: true,
      cell: (o) => (
        <span className="flex items-center gap-2">
          <Avatar name={o.owner} size="xs" />
          {o.owner}
        </span>
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
      cell: (o) => eur(o.total),
      footer: (r) => eur(r.reduce((s, o) => s + o.total, 0)),
    },
    {
      id: 'menu',
      header: <span className="sr-only">Actions</span>,
      width: 44,
      cell: (o) => (
        <div onClick={(e) => e.stopPropagation()}>
          <DropdownMenu
            trigger={<IconButton label={`Actions for ${o.number}`} icon={<MoreHorizontal />} size="sm" />}
            items={[
              { label: 'Open', icon: <ExternalLink />, onSelect: () => go(`orders/${o.id}`) },
              { label: 'Print', icon: <Printer />, shortcut: '⌘P' },
              { type: 'separator' },
              {
                label: 'Cancel order',
                icon: <XCircle />,
                tone: 'danger',
                disabled: o.status === 'cancelled',
                onSelect: () => setCancelling([o]),
              },
            ]}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Sales orders"
        description="Track orders from quote to cash."
        actions={
          <>
            <Button leadingIcon={<FileDown />}>Export</Button>
            <Button variant="primary" leadingIcon={<Plus />} onClick={() => go('orders/new')}>
              New order
            </Button>
          </>
        }
      />

      <Tabs
        value={tab}
        onValueChange={(t) => {
          setTab(t);
          setSelected([]);
        }}
      >
        <TabList>
          <Tab value="all" count={count('all')}>
            All
          </Tab>
          <Tab value="draft" count={count('draft')}>
            Draft
          </Tab>
          <Tab value="pending" count={count('pending')}>
            Pending
          </Tab>
          <Tab value="approved" count={count('approved')}>
            Approved
          </Tab>
          <Tab value="shipped" count={count('shipped')}>
            Shipped
          </Tab>
          <Tab value="delivered" count={count('delivered')}>
            Delivered
          </Tab>
        </TabList>
      </Tabs>

      <DataTable
        caption="Sales orders"
        columns={columns}
        data={rows}
        rowKey="id"
        defaultSort={{ id: 'date', direction: 'desc' }}
        selectable
        selectedKeys={selected}
        onSelectionChange={setSelected}
        pageSize={25}
        onRowClick={setPreview}
        activeRowKey={preview?.id}
        toolbar={
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <SearchField
              size="sm"
              value={query}
              onValueChange={setQuery}
              placeholder="Search order, customer, owner"
              className="sm:max-w-72"
            />
            <Popover
              className="w-60"
              trigger={
                <Button size="sm" leadingIcon={<ListFilter />}>
                  Warehouse
                </Button>
              }
            >
              <div className="flex flex-col gap-2.5">
                {warehouses.map((w) => (
                  <Checkbox
                    key={w}
                    label={w}
                    checked={whs.includes(w)}
                    onChange={(on) => setWhs(on ? [...whs, w] : whs.filter((x) => x !== w))}
                  />
                ))}
              </div>
            </Popover>
            <div className="flex flex-wrap gap-1.5">
              {whs.map((w) => (
                <Tag key={w} onRemove={() => setWhs(whs.filter((x) => x !== w))}>
                  {w}
                </Tag>
              ))}
            </div>
          </div>
        }
        bulkActions={(sel, clear) => (
          <>
            <Button size="sm" variant="plain" leadingIcon={<Printer />}>
              Print
            </Button>
            <Button
              size="sm"
              variant="plain"
              leadingIcon={<Archive />}
              onClick={() => {
                toast({ title: `${sel.length} orders archived`, tone: 'success' });
                clear();
              }}
            >
              Archive
            </Button>
            <Button size="sm" variant="destructive-tinted" onClick={() => setCancelling(sel)}>
              Cancel
            </Button>
          </>
        )}
      />

      <Sheet
        open={preview !== null}
        onClose={() => setPreview(null)}
        size="lg"
        title={preview?.number}
        description={preview?.customer.name}
        headerActions={preview && <StatusBadge status={preview.status} />}
        footer={
          <>
            <Button onClick={() => setPreview(null)}>Close</Button>
            <Button variant="primary" trailingIcon={<ExternalLink />} onClick={() => preview && go(`orders/${preview.id}`)}>
              Open order
            </Button>
          </>
        }
      >
        {preview && (
          <div className="space-y-6">
            {preview.status !== 'cancelled' && (
              <Stepper
                orientation="vertical"
                current={lifecycle.indexOf(preview.status) + (preview.status === 'delivered' ? 1 : 0)}
                steps={[
                  { label: 'Draft' },
                  { label: 'Approval' },
                  { label: 'Fulfilment' },
                  { label: 'In transit' },
                  { label: 'Delivered' },
                ]}
              />
            )}
            <Divider />
            <DescriptionList
              items={[
                { term: 'Ordered', description: formatDate(preview.date) },
                { term: 'Due', description: formatDate(preview.dueDate) },
                { term: 'Warehouse', description: preview.warehouse },
                { term: 'Owner', description: preview.owner },
                { term: 'Contact', description: `${preview.customer.contact} · ${preview.customer.email}` },
              ]}
            />
            <DataTable
              density="compact"
              data={preview.lines}
              rowKey={(l) => l.sku + l.quantity}
              columns={[
                { id: 'product', header: 'Product' },
                { id: 'quantity', header: 'Qty', align: 'right' },
                {
                  id: 'amount',
                  header: 'Amount',
                  align: 'right',
                  cell: (l) => eur(l.quantity * l.unitPrice),
                  footer: () => eur(preview.total),
                },
              ]}
            />
          </div>
        )}
      </Sheet>

      <ConfirmDialog
        open={cancelling !== null}
        onClose={() => setCancelling(null)}
        destructive
        title={cancelling?.length === 1 ? `Cancel ${cancelling[0].number}?` : `Cancel ${cancelling?.length} orders?`}
        description="Reserved stock will be released and the customer notified. This can't be undone."
        confirmLabel="Cancel orders"
        cancelLabel="Keep"
        onConfirm={async () => {
          await new Promise((r) => setTimeout(r, 900));
          toast({ title: 'Orders cancelled', tone: 'success', action: { label: 'Undo', onClick: () => {} } });
          setSelected([]);
        }}
      />
    </div>
  );
}
