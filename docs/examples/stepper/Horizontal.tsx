import { useState } from 'react';
import { Button, Stepper } from '@jkpeyi/focus-ui';

const steps = [
  { label: 'Draft', description: 'Sep 30' },
  { label: 'Approved', description: 'Oct 1' },
  { label: 'Picked & packed' },
  { label: 'Shipped' },
  { label: 'Invoiced' },
];

export default function Example() {
  const [current, setCurrent] = useState(2);
  return (
    <div className="w-full space-y-6">
      <Stepper steps={steps} current={current} />
      <div className="flex justify-center gap-2">
        <Button size="sm" disabled={current === 0} onClick={() => setCurrent(current - 1)}>
          Back
        </Button>
        <Button size="sm" variant="primary" disabled={current === steps.length} onClick={() => setCurrent(current + 1)}>
          Advance
        </Button>
      </div>
    </div>
  );
}
