import { useState } from 'react';
import {
  Avatar,
  Button,
  Card,
  CardContent,
  CardHeader,
  DataTable,
  Progress,
  SegmentedControl,
  StatCard,
  Timeline,
  formatDate,
  useToast,
} from '@jkpeyi/focus-ui';
import { CheckCircle2, Clock, CreditCard, Download, Euro, Package, Plus, ShoppingCart, Truck } from 'lucide-react';
import { BarChart } from '../BarChart';
import { months, orders, products, revenueByMonth } from '../data';
import { eur, go } from '../shared';

export function Dashboard() {
  const [period, setPeriod] = useState('12m');
  const { toast } = useToast();
  const pending = orders.filter((o) => o.status === 'pending').slice(0, 4);
  const lowStock = products.filter((p) => p.stock < p.reorderPoint * 2).slice(0, 4);
  const slice = period === '12m' ? 12 : period === '6m' ? 6 : 3;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[13px] font-medium text-fg-muted">Tuesday, October 6</p>
          <h1 className="mt-0.5 text-2xl font-semibold tracking-[-0.022em] sm:text-[28px]">Good morning, Ava</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <SegmentedControl
            size="sm"
            aria-label="Period"
            value={period}
            onValueChange={setPeriod}
            options={[
              { value: '3m', label: '3M' },
              { value: '6m', label: '6M' },
              { value: '12m', label: '12M' },
            ]}
          />
          <Button size="sm" leadingIcon={<Download />}>
            Export
          </Button>
          <Button size="sm" variant="primary" leadingIcon={<Plus />} onClick={() => go('orders/new')}>
            New order
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Revenue"
          value={eur(3_142_890, 0)}
          delta={0.084}
          deltaLabel="vs prior period"
          icon={<Euro />}
          trend={revenueByMonth.slice(-slice)}
        />
        <StatCard
          label="Open orders"
          value="1,284"
          delta={0.031}
          deltaLabel="vs last week"
          icon={<ShoppingCart />}
          trend={[30, 34, 29, 41, 38, 44, 47]}
        />
        <StatCard
          label="Days sales outstanding"
          value="38.2"
          delta={0.054}
          invertDelta
          deltaLabel="vs Q2"
          icon={<Clock />}
          trend={[33, 34, 35, 34, 36, 37, 38]}
        />
        <StatCard
          label="On-time delivery"
          value="96.4%"
          delta={0.012}
          deltaLabel="vs last month"
          icon={<Truck />}
          trend={[92, 93, 95, 94, 95, 96, 96.4]}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Net revenue by month" description="Thousands of euros, all entities" />
          <CardContent>
            <BarChart values={revenueByMonth.slice(-slice)} labels={months.slice(-slice)} format={(v) => `€${v}k`} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader title="Targets" description="Q4 2026" />
          <CardContent className="space-y-5">
            <Progress label="Sales quota" value={78} showValue />
            <Progress label="Gross margin (goal 42%)" value={39.1} max={42} showValue tone="success" />
            <Progress label="Warehouse capacity" value={93} showValue tone="warning" />
            <Progress label="OPEX budget" value={104} showValue tone="danger" />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Awaiting your approval"
            description={`${pending.length} sales orders exceed the €10,000 threshold`}
            actions={
              <Button size="sm" variant="plain" onClick={() => go('orders')}>
                View all
              </Button>
            }
          />
          <DataTable
            variant="plain"
            density="regular"
            data={pending}
            rowKey="id"
            onRowClick={(o) => go(`orders/${o.id}`)}
            columns={[
              { id: 'number', header: 'Order', cell: (o) => <span className="font-medium">{o.number}</span> },
              {
                id: 'customer',
                header: 'Customer',
                cell: (o) => (
                  <span className="flex items-center gap-2">
                    <Avatar name={o.customer.name} size="xs" shape="rounded" />
                    <span className="truncate">{o.customer.name}</span>
                  </span>
                ),
              },
              { id: 'date', header: 'Date', hideBelow: 'md', cell: (o) => formatDate(o.date) },
              { id: 'total', header: 'Amount', align: 'right', cell: (o) => eur(o.total) },
              {
                id: 'approve',
                header: <span className="sr-only">Approve</span>,
                align: 'right',
                cell: (o) => (
                  <Button
                    size="xs"
                    variant="tinted"
                    onClick={(e) => {
                      e.stopPropagation();
                      toast({ title: `${o.number} approved`, tone: 'success' });
                    }}
                  >
                    Approve
                  </Button>
                ),
              },
            ]}
          />
        </Card>
        <Card>
          <CardHeader title="Activity" />
          <CardContent>
            <Timeline
              items={[
                {
                  title: (
                    <>
                      <b>Payment received</b> from Contoso
                    </>
                  ),
                  time: '10:42',
                  tone: 'success',
                  icon: <CreditCard />,
                },
                {
                  title: (
                    <>
                      <b>SO-24171</b> shipped
                    </>
                  ),
                  description: 'DHL Freight · 4 pallets',
                  time: '09:15',
                  tone: 'info',
                  icon: <Truck />,
                },
                {
                  title: (
                    <>
                      <b>SO-24176</b> approved
                    </>
                  ),
                  description: 'by Grace Lee',
                  time: 'Yesterday',
                  tone: 'accent',
                  icon: <CheckCircle2 />,
                },
                {
                  title: (
                    <>
                      <b>Low stock</b> on SKU-2421
                    </>
                  ),
                  time: 'Yesterday',
                  tone: 'warning',
                  icon: <Package />,
                },
              ]}
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader
          title="Low stock"
          description="Items under twice their reorder point"
          actions={
            <Button size="sm" variant="plain" onClick={() => go('inventory')}>
              Open inventory
            </Button>
          }
        />
        <div className="grid divide-line sm:grid-cols-2 sm:divide-x lg:grid-cols-4">
          {lowStock.map((p) => (
            <div key={p.sku} className="space-y-2 border-t border-line px-5 py-4">
              <div className="truncate text-[13px] font-medium">{p.name}</div>
              <div className="font-mono text-xs text-fg-muted">
                {p.sku} · {p.warehouse}
              </div>
              <Progress
                value={p.stock}
                max={p.reorderPoint * 2}
                tone={p.stock < p.reorderPoint ? 'danger' : 'warning'}
                size="sm"
              />
              <div className="text-xs text-fg-muted tabular-nums">
                {p.stock} on hand · reorder at {p.reorderPoint}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
