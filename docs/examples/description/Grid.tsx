import { Card, DescriptionList } from '@jkpeyi/focus-ui';

export default function Example() {
  return (
    <Card padding="md" className="w-full">
      <DescriptionList
        layout="grid"
        columns={3}
        items={[
          { term: 'Customer', description: 'Northwind Traders' },
          { term: 'Order date', description: 'Sep 30, 2026' },
          { term: 'Requested delivery', description: 'Oct 14, 2026' },
          { term: 'Warehouse', description: 'Seattle DC' },
          { term: 'Sales rep', description: 'Ava Thompson' },
          { term: 'Payment terms', description: 'Net 30' },
          { term: 'Shipping address', description: '1200 Harbor Ave SW, Seattle, WA 98126, United States', fullWidth: true },
        ]}
      />
    </Card>
  );
}
