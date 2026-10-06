import { useState } from 'react';
import {
  Alert,
  Avatar,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  CardHeader,
  ConfirmDialog,
  DataTable,
  DescriptionList,
  DropdownMenu,
  EmptyState,
  IconButton,
  PageHeader,
  Stepper,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  Textarea,
  Timeline,
  formatDate,
  useToast,
} from 'focus-ui';
import { CheckCircle2, Copy, FileText, MoreHorizontal, Printer, Send, Truck, XCircle } from 'lucide-react';
import { orders, type OrderStatus } from '../data';
import { StatusBadge, eur, go } from '../shared';

const lifecycle: OrderStatus[] = ['draft', 'pending', 'approved', 'shipped', 'delivered'];

export function OrderDetail({ id }: { id: string }) {
  const { toast } = useToast();
  const found = orders.find((o) => o.id === id);
  const [status, setStatus] = useState<OrderStatus>(found?.status ?? 'draft');
  const [confirm, setConfirm] = useState(false);

  if (!found) {
    return <EmptyState title="Order not found" actions={<Button onClick={() => go('orders')}>Back to orders</Button>} />;
  }
  const order = found;
  const subtotal = order.lines.reduce((s, l) => s + l.quantity * l.unitPrice, 0);
  const tax = subtotal * 0.2;
  const overLimit = order.customer.balance + order.total > order.customer.creditLimit * 0.8;

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={
          <Breadcrumbs
            items={[
              { label: 'Sales', href: '#/demo/orders' },
              { label: 'Orders', href: '#/demo/orders' },
              { label: order.number },
            ]}
          />
        }
        title={order.number}
        meta={<StatusBadge status={status} />}
        description={`${order.customer.name} · Ordered ${formatDate(order.date)} by ${order.owner}`}
        actions={
          <>
            <Button leadingIcon={<Printer />}>Print</Button>
            {status === 'pending' && (
              <Button variant="primary" leadingIcon={<CheckCircle2 />} onClick={() => setConfirm(true)}>
                Approve
              </Button>
            )}
            {status === 'draft' && (
              <Button
                variant="primary"
                leadingIcon={<Send />}
                onClick={() => {
                  setStatus('pending');
                  toast({ title: 'Submitted for approval', tone: 'success' });
                }}
              >
                Submit
              </Button>
            )}
            {status === 'approved' && (
              <Button
                variant="primary"
                leadingIcon={<Truck />}
                onClick={() => {
                  setStatus('shipped');
                  toast({ title: 'Shipment created', tone: 'success' });
                }}
              >
                Ship
              </Button>
            )}
            <DropdownMenu
              trigger={<IconButton label="More actions" icon={<MoreHorizontal />} variant="secondary" />}
              items={[
                { label: 'Duplicate', icon: <Copy /> },
                { label: 'Create invoice', icon: <FileText /> },
                { type: 'separator' },
                { label: 'Cancel order', icon: <XCircle />, tone: 'danger', onSelect: () => setStatus('cancelled') },
              ]}
            />
          </>
        }
      />

      {status !== 'cancelled' ? (
        <Card padding="md">
          <Stepper
            current={lifecycle.indexOf(status) + (status === 'delivered' ? 1 : 0)}
            steps={[
              { label: 'Draft', description: formatDate(order.date) },
              { label: 'Approval' },
              { label: 'Fulfilment', description: order.warehouse },
              { label: 'Shipped' },
              { label: 'Delivered', description: `Due ${formatDate(order.dueDate)}` },
            ]}
          />
        </Card>
      ) : (
        <Alert tone="danger" title="This order was cancelled">
          Reserved stock has been released.
        </Alert>
      )}

      {overLimit && status === 'pending' && (
        <Alert tone="warning" title="Credit check">
          Approving this order brings {order.customer.name} to{' '}
          {Math.round(((order.customer.balance + order.total) / order.customer.creditLimit) * 100)}% of its{' '}
          {eur(order.customer.creditLimit, 0)} credit limit.
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Tabs defaultValue="lines">
            <TabList>
              <Tab value="lines" count={order.lines.length}>
                Line items
              </Tab>
              <Tab value="details">Details</Tab>
              <Tab value="activity">Activity</Tab>
            </TabList>
            <TabPanel value="lines">
              <DataTable
                data={order.lines}
                rowKey={(l) => `${l.sku}-${l.quantity}`}
                columns={[
                  { id: 'sku', header: 'SKU', hideBelow: 'sm', className: 'font-mono text-xs text-fg-muted' },
                  { id: 'product', header: 'Product', cell: (l) => <span className="font-medium">{l.product}</span> },
                  { id: 'quantity', header: 'Qty', align: 'right' },
                  { id: 'unitPrice', header: 'Unit price', align: 'right', hideBelow: 'md', cell: (l) => eur(l.unitPrice) },
                  { id: 'amount', header: 'Amount', align: 'right', cell: (l) => eur(l.quantity * l.unitPrice) },
                ]}
              />
              <div className="mt-4 ml-auto w-full max-w-xs space-y-2 text-[13px]">
                <div className="flex justify-between text-fg-muted">
                  <span>Subtotal</span>
                  <span className="tabular-nums">{eur(subtotal)}</span>
                </div>
                <div className="flex justify-between text-fg-muted">
                  <span>VAT 20%</span>
                  <span className="tabular-nums">{eur(tax)}</span>
                </div>
                <div className="flex justify-between border-t border-line pt-2 text-[15px] font-semibold">
                  <span>Total</span>
                  <span className="tabular-nums">{eur(subtotal + tax)}</span>
                </div>
              </div>
            </TabPanel>
            <TabPanel value="details">
              <Card padding="md">
                <DescriptionList
                  layout="grid"
                  columns={3}
                  items={[
                    { term: 'Customer PO', description: `PO-${order.number.slice(3)}-C` },
                    { term: 'Payment terms', description: 'Net 30' },
                    { term: 'Incoterms', description: 'DAP' },
                    { term: 'Warehouse', description: order.warehouse },
                    { term: 'Carrier', description: 'DHL Freight' },
                    { term: 'Currency', description: 'EUR' },
                    {
                      term: 'Ship to',
                      description: `${order.customer.name}, ${order.customer.city}, ${order.customer.country}`,
                      fullWidth: true,
                    },
                  ]}
                />
              </Card>
            </TabPanel>
            <TabPanel value="activity">
              <Card padding="md" className="space-y-5">
                <Timeline
                  items={[
                    {
                      title: (
                        <>
                          <b>{order.owner}</b> created the order
                        </>
                      ),
                      time: formatDate(order.date),
                      icon: <FileText />,
                    },
                    {
                      title: (
                        <>
                          <b>Credit check</b> passed automatically
                        </>
                      ),
                      time: formatDate(order.date),
                      tone: 'success',
                      icon: <CheckCircle2 />,
                    },
                    {
                      title: (
                        <>
                          <b>Grace Lee</b> commented
                        </>
                      ),
                      description: '“Customer asked for partial delivery if Servo Motors are backordered.”',
                      time: '2d ago',
                      tone: 'accent',
                    },
                  ]}
                />
                <Textarea placeholder="Add a comment…" autoResize />
                <div className="flex justify-end">
                  <Button size="sm" variant="primary">
                    Comment
                  </Button>
                </div>
              </Card>
            </TabPanel>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader
              title="Customer"
              actions={
                <Button size="sm" variant="plain" onClick={() => go('customers')}>
                  View
                </Button>
              }
            />
            <CardContent>
              <div className="flex items-center gap-3">
                <Avatar name={order.customer.name} shape="rounded" />
                <div className="min-w-0">
                  <div className="truncate font-medium">{order.customer.name}</div>
                  <div className="text-[13px] text-fg-muted">
                    {order.customer.id} · {order.customer.segment}
                  </div>
                </div>
              </div>
              <DescriptionList
                className="mt-4"
                items={[
                  { term: 'Contact', description: order.customer.contact },
                  {
                    term: 'Email',
                    description: (
                      <a className="text-accent" href={`mailto:${order.customer.email}`}>
                        {order.customer.email}
                      </a>
                    ),
                  },
                  { term: 'Open balance', description: eur(order.customer.balance) },
                  { term: 'Credit limit', description: eur(order.customer.creditLimit, 0) },
                ]}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <ConfirmDialog
        open={confirm}
        onClose={() => setConfirm(false)}
        title={`Approve ${order.number}?`}
        description={`${eur(order.total)} for ${order.customer.name}. Stock will be reserved in ${order.warehouse}.`}
        confirmLabel="Approve order"
        onConfirm={async () => {
          await new Promise((r) => setTimeout(r, 800));
          setStatus('approved');
          toast({ title: `${order.number} approved`, description: 'Fulfilment has been notified.', tone: 'success' });
        }}
      />
    </div>
  );
}
