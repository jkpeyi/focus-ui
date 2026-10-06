import { Button, Card, CardContent, CardFooter, CardHeader, DescriptionList, IconButton } from 'focus-ui';
import { MoreHorizontal } from 'lucide-react';

export default function Example() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader
        title="Payment terms"
        description="Applies to all new invoices for this customer."
        actions={<IconButton label="More options" icon={<MoreHorizontal />} size="sm" />}
      />
      <CardContent>
        <DescriptionList
          items={[
            { term: 'Terms', description: 'Net 30' },
            { term: 'Early payment discount', description: '2% within 10 days' },
            { term: 'Currency', description: 'EUR' },
          ]}
        />
      </CardContent>
      <CardFooter>
        <Button>Cancel</Button>
        <Button variant="primary">Save</Button>
      </CardFooter>
    </Card>
  );
}
