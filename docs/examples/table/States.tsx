import { useState } from 'react';
import { Button, DataTable, EmptyState, SegmentedControl, type DataTableColumn } from '@jkpeyi/focus-ui';
import { PackageSearch } from 'lucide-react';
import { products, type Product } from '../../demo/data';

const columns: DataTableColumn<Product>[] = [
  { id: 'sku', header: 'SKU', className: 'font-mono text-xs' },
  { id: 'name', header: 'Product' },
  { id: 'stock', header: 'On hand', align: 'right' },
];

export default function Example() {
  const [state, setState] = useState('loading');
  return (
    <div className="w-full space-y-3">
      <SegmentedControl
        size="sm"
        value={state}
        onValueChange={setState}
        options={[
          { value: 'loading', label: 'Loading' },
          { value: 'empty', label: 'Empty' },
          { value: 'data', label: 'Data' },
        ]}
      />
      <DataTable
        columns={columns}
        data={state === 'data' ? products.slice(0, 4) : []}
        rowKey="sku"
        loading={state === 'loading'}
        pageSize={4}
        empty={
          <EmptyState
            icon={<PackageSearch />}
            title="No products match"
            description="Try a different warehouse or clear your filters."
            actions={<Button size="sm">Clear filters</Button>}
          />
        }
      />
    </div>
  );
}
