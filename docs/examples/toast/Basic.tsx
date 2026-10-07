import { Button, useToast } from '@jkpeyi/focus-ui';

export default function Example() {
  const { toast } = useToast();
  return (
    <>
      <Button
        variant="primary"
        onClick={() =>
          toast({ title: 'Invoice INV-2026-0412 sent', description: 'Emailed to billing@northwind.com', tone: 'success' })
        }
      >
        Success
      </Button>
      <Button
        onClick={() =>
          toast({
            title: '3 orders archived',
            action: { label: 'Undo', onClick: () => toast({ title: 'Restored 3 orders' }) },
          })
        }
      >
        With action
      </Button>
      <Button
        variant="destructive-tinted"
        onClick={() => toast({ title: 'Export failed', description: 'The report exceeded 1M rows.', tone: 'danger' })}
      >
        Error
      </Button>
    </>
  );
}
