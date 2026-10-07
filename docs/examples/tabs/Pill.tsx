import { Tab, TabList, TabPanel, Tabs } from '@jkpeyi/focus-ui';
import { Boxes, Receipt, Truck } from 'lucide-react';

export default function Example() {
  return (
    <Tabs defaultValue="receivables" variant="pill" className="w-full">
      <TabList>
        <Tab value="receivables" icon={<Receipt />}>
          Receivables
        </Tab>
        <Tab value="payables" icon={<Truck />}>
          Payables
        </Tab>
        <Tab value="inventory" icon={<Boxes />}>
          Inventory
        </Tab>
      </TabList>
      <TabPanel value="receivables" className="text-[13px] text-fg-muted">
        $1.24M outstanding across 312 invoices.
      </TabPanel>
      <TabPanel value="payables" className="text-[13px] text-fg-muted">
        $842K due in the next 30 days.
      </TabPanel>
      <TabPanel value="inventory" className="text-[13px] text-fg-muted">
        Valued at $3.9M (FIFO).
      </TabPanel>
    </Tabs>
  );
}
