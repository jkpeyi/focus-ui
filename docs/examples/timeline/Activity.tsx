import { Card, Timeline } from 'focus-ui';
import { CheckCircle2, CreditCard, FileText, Truck } from 'lucide-react';

export default function Example() {
  return (
    <Card padding="md" className="w-full max-w-md">
      <Timeline
        items={[
          {
            title: (
              <>
                <b>Payment received</b> — $18,420.00
              </>
            ),
            description: 'Wire transfer, ref. 88231',
            time: '10:42',
            tone: 'success',
            icon: <CreditCard />,
          },
          {
            title: (
              <>
                <b>Shipment delivered</b>
              </>
            ),
            description: 'Signed by J. Ortega',
            time: 'Yesterday',
            tone: 'info',
            icon: <Truck />,
          },
          {
            title: (
              <>
                <b>Order approved</b> by Grace Lee
              </>
            ),
            time: 'Oct 1',
            tone: 'accent',
            icon: <CheckCircle2 />,
          },
          {
            title: (
              <>
                <b>Order created</b> by Ava Thompson
              </>
            ),
            time: 'Sep 30',
            icon: <FileText />,
          },
        ]}
      />
    </Card>
  );
}
