import { Badge, Card, DescriptionList } from 'focus-ui';

export default function Example() {
  return (
    <Card padding="md" className="w-full max-w-lg">
      <DescriptionList
        items={[
          { term: 'Supplier', description: 'Fabrikam Industries' },
          { term: 'PO number', description: <span className="font-mono">PO-77821</span> },
          {
            term: 'Status',
            description: (
              <Badge tone="success" dot>
                Received
              </Badge>
            ),
          },
          { term: 'Incoterms', description: 'DAP Rotterdam' },
          { term: 'Total', description: <span className="font-semibold">€48,210.00</span> },
        ]}
      />
    </Card>
  );
}
