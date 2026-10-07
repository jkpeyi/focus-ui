import { useState } from 'react';
import { Button, Field, Input, Modal, Select, Textarea, useToast } from '@jkpeyi/focus-ui';

export default function Example() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  return (
    <>
      <Button variant="primary" onClick={() => setOpen(true)}>
        Adjust stock
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Stock adjustment"
        description="Servo Motor 750W · SKU-2435 · Rotterdam"
        footer={
          <>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button
              variant="primary"
              onClick={() => {
                setOpen(false);
                toast({ title: 'Stock adjusted', tone: 'success' });
              }}
            >
              Post adjustment
            </Button>
          </>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Quantity" required>
            <Input type="number" defaultValue={-4} numeric suffix="pcs" />
          </Field>
          <Field label="Reason">
            <Select
              defaultValue="damage"
              options={[
                { value: 'damage', label: 'Damaged goods' },
                { value: 'count', label: 'Cycle count' },
                { value: 'theft', label: 'Shrinkage' },
              ]}
            />
          </Field>
          <Field label="Comment" className="sm:col-span-2">
            <Textarea placeholder="Optional details for auditors" />
          </Field>
        </div>
      </Modal>
    </>
  );
}
