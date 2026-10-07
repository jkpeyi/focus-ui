import { useState } from 'react';
import { Avatar, Badge, Button, DescriptionList, Sheet, Timeline } from '@jkpeyi/focus-ui';
import { Mail, Phone } from 'lucide-react';

export default function Example() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open customer</Button>
      <Sheet
        open={open}
        onClose={() => setOpen(false)}
        title="Northwind Traders"
        description="C-1001 · Enterprise"
        footer={
          <>
            <Button onClick={() => setOpen(false)}>Close</Button>
            <Button variant="primary">Edit customer</Button>
          </>
        }
      >
        <div className="flex items-center gap-3">
          <Avatar name="Ava Thompson" size="lg" />
          <div>
            <div className="font-semibold">Ava Thompson</div>
            <div className="text-[13px] text-fg-muted">Head of Procurement</div>
          </div>
          <Badge tone="success" dot className="ml-auto">
            Active
          </Badge>
        </div>
        <div className="mt-4 flex gap-2">
          <Button size="sm" leadingIcon={<Mail />}>
            Email
          </Button>
          <Button size="sm" leadingIcon={<Phone />}>
            Call
          </Button>
        </div>
        <h3 className="mt-6 mb-1 text-[13px] font-semibold">Account</h3>
        <DescriptionList
          items={[
            { term: 'Credit limit', description: '$250,000.00' },
            { term: 'Open balance', description: '$31,420.18' },
            { term: 'Payment terms', description: 'Net 30' },
            { term: 'Tax ID', description: 'US 91-1144442' },
          ]}
        />
        <h3 className="mt-6 mb-3 text-[13px] font-semibold">Activity</h3>
        <Timeline
          items={[
            { title: 'Invoice INV-0412 paid', time: '2h ago', tone: 'success' },
            { title: 'Order SO-24177 shipped', time: 'Yesterday', tone: 'info' },
            { title: 'Credit limit raised to $250k', description: 'Approved by Grace Lee', time: 'Sep 12', tone: 'accent' },
          ]}
        />
      </Sheet>
    </>
  );
}
