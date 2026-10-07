import { Tab, TabList, TabPanel, Tabs } from '@jkpeyi/focus-ui';

export default function Example() {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabList>
        <Tab value="overview">Overview</Tab>
        <Tab value="lines" count={4}>
          Line items
        </Tab>
        <Tab value="shipments">Shipments</Tab>
        <Tab value="invoices" count={2}>
          Invoices
        </Tab>
        <Tab value="audit" disabled>
          Audit log
        </Tab>
      </TabList>
      <TabPanel value="overview" className="text-[13px] text-fg-muted">
        Summary of the sales order.
      </TabPanel>
      <TabPanel value="lines" className="text-[13px] text-fg-muted">
        4 products, 112 units.
      </TabPanel>
      <TabPanel value="shipments" className="text-[13px] text-fg-muted">
        1 shipment via DHL Freight.
      </TabPanel>
      <TabPanel value="invoices" className="text-[13px] text-fg-muted">
        2 invoices, 1 paid.
      </TabPanel>
    </Tabs>
  );
}
