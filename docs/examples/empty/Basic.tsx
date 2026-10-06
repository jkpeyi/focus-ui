import { Button, Card, EmptyState } from 'focus-ui';
import { FileText, Plus } from 'lucide-react';

export default function Example() {
  return (
    <Card className="w-full max-w-lg">
      <EmptyState
        icon={<FileText />}
        title="No invoices yet"
        description="Invoices you create or import from your previous system will appear here."
        actions={
          <>
            <Button>Import CSV</Button>
            <Button variant="primary" leadingIcon={<Plus />}>
              New invoice
            </Button>
          </>
        }
      />
    </Card>
  );
}
