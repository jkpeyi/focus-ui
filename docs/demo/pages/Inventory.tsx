import { useState } from 'react';
import { Badge, Button, DataTable, PageHeader, Progress, SegmentedControl, StatCard, type DataTableColumn } from 'focus-ui';
import { AlertTriangle, Boxes, Euro, Plus, RefreshCw } from 'lucide-react';
import { products, type Product } from '../data';
import { eur } from '../shared';

export function Inventory() {
  const [category, setCategory] = useState('all');
  const rows = products.filter((p) => category === 'all' || p.category === category);
  const value = products.reduce((s, p) => s + p.stock * p.unitCost, 0);
  const low = products.filter((p) => p.stock < p.reorderPoint).length;

  const columns: DataTableColumn<Product>[] = [
    { id: 'sku', header: 'SKU', sortable: true, sticky: true, className: 'font-mono text-xs' },
    {
      id: 'name',
      header: 'Product',
      sortable: true,
      cell: (p) => <span className="font-medium whitespace-nowrap">{p.name}</span>,
    },
    { id: 'category', header: 'Category', hideBelow: 'md', cell: (p) => <Badge>{p.category}</Badge> },
    { id: 'warehouse', header: 'Location', hideBelow: 'lg' },
    {
      id: 'level',
      header: 'Stock level',
      hideBelow: 'sm',
      accessor: (p) => p.stock / p.reorderPoint,
      sortable: true,
      cell: (p) => (
        <div className="w-32">
          <Progress
            size="sm"
            value={Math.min(p.stock, p.reorderPoint * 4)}
            max={p.reorderPoint * 4}
            tone={p.stock < p.reorderPoint ? 'danger' : p.stock < p.reorderPoint * 2 ? 'warning' : 'success'}
          />
        </div>
      ),
    },
    {
      id: 'stock',
      header: 'On hand',
      align: 'right',
      sortable: true,
      cell: (p) => (
        <span className="inline-flex items-center gap-2">
          {p.stock < p.reorderPoint && (
            <Badge tone="danger" size="sm">
              Reorder
            </Badge>
          )}
          {p.stock.toLocaleString()}
        </span>
      ),
      footer: (r) => r.reduce((s, p) => s + p.stock, 0).toLocaleString(),
    },
    { id: 'unitCost', header: 'Unit cost', align: 'right', hideBelow: 'xl', cell: (p) => eur(p.unitCost) },
    {
      id: 'value',
      header: 'Value',
      align: 'right',
      sortable: true,
      accessor: (p) => p.stock * p.unitCost,
      cell: (p) => eur(p.stock * p.unitCost, 0),
      footer: (r) =>
        eur(
          r.reduce((s, p) => s + p.stock * p.unitCost, 0),
          0,
        ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inventory"
        description="Stock on hand across all warehouses, valued at FIFO cost."
        actions={
          <>
            <Button leadingIcon={<RefreshCw />}>Cycle count</Button>
            <Button variant="primary" leadingIcon={<Plus />}>
              New item
            </Button>
          </>
        }
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Inventory value" value={eur(value, 0)} delta={0.023} deltaLabel="vs last month" icon={<Euro />} />
        <StatCard label="Active SKUs" value={products.length} icon={<Boxes />} footer="3 warehouses" />
        <StatCard label="Below reorder point" value={low} icon={<AlertTriangle />} footer="Auto-reorder is off" />
      </div>
      <DataTable
        caption="Inventory"
        columns={columns}
        data={rows}
        rowKey="sku"
        density="compact"
        defaultSort={{ id: 'level', direction: 'asc' }}
        toolbar={
          <SegmentedControl
            size="sm"
            value={category}
            onValueChange={setCategory}
            options={[
              { value: 'all', label: 'All' },
              ...['Components', 'Electronics', 'Machinery', 'Consumables'].map((c) => ({ value: c, label: c })),
            ]}
          />
        }
      />
    </div>
  );
}
