import { useState } from 'react';
import { Badge, DataTable, SegmentedControl, formatCurrency, type DataTableColumn } from 'focus-ui';
import { products, type Product } from '../../demo/data';

const columns: DataTableColumn<Product>[] = [
  { id: 'sku', header: 'SKU', sticky: true, className: 'font-mono text-xs', sortable: true },
  { id: 'name', header: 'Product', sortable: true },
  { id: 'category', header: 'Category', hideBelow: 'md' },
  { id: 'warehouse', header: 'Warehouse', hideBelow: 'lg' },
  {
    id: 'stock',
    header: 'On hand',
    align: 'right',
    sortable: true,
    cell: (p) => (
      <span className="inline-flex items-center gap-2">
        {p.stock < p.reorderPoint && (
          <Badge tone="danger" size="sm">
            Low
          </Badge>
        )}
        {p.stock}
      </span>
    ),
  },
  { id: 'price', header: 'Price', align: 'right', sortable: true, cell: (p) => formatCurrency(p.price) },
  {
    id: 'value',
    header: 'Stock value',
    align: 'right',
    accessor: (p) => p.stock * p.unitCost,
    cell: (p) => formatCurrency(p.stock * p.unitCost),
    footer: (rows) => formatCurrency(rows.reduce((s, p) => s + p.stock * p.unitCost, 0)),
    sortable: true,
  },
];

export default function Example() {
  const [density, setDensity] = useState<'compact' | 'regular' | 'comfortable'>('compact');
  return (
    <div className="w-full space-y-3">
      <SegmentedControl
        size="sm"
        value={density}
        onValueChange={(v) => setDensity(v as typeof density)}
        options={[
          { value: 'compact', label: 'Compact' },
          { value: 'regular', label: 'Regular' },
          { value: 'comfortable', label: 'Comfortable' },
        ]}
      />
      <DataTable columns={columns} data={products} rowKey="sku" density={density} striped />
    </div>
  );
}
