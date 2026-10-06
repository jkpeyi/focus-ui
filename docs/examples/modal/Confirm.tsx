import { useState } from 'react';
import { Button, ConfirmDialog, useToast } from 'focus-ui';

export default function Example() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  return (
    <>
      <Button variant="destructive-tinted" onClick={() => setOpen(true)}>
        Void invoice
      </Button>
      <ConfirmDialog
        open={open}
        onClose={() => setOpen(false)}
        destructive
        title="Void invoice INV-2026-0412?"
        description="A credit note will be generated and the customer balance updated. This can't be undone."
        confirmLabel="Void invoice"
        onConfirm={async () => {
          await new Promise((r) => setTimeout(r, 1200));
          toast({ title: 'Invoice voided', description: 'Credit note CN-0088 created.', tone: 'success' });
        }}
      />
    </>
  );
}
