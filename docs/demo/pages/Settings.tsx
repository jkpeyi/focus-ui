import {
  Alert,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  Field,
  Input,
  PageHeader,
  RadioGroup,
  Select,
  Switch,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  useToast,
} from 'focus-ui';

export function SettingsPage() {
  const { toast } = useToast();
  const save = () => toast({ title: 'Settings saved', tone: 'success' });
  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Company-wide configuration for Acme Industries." />
      <Tabs defaultValue="general">
        <TabList>
          <Tab value="general">General</Tab>
          <Tab value="sales">Sales</Tab>
          <Tab value="inventory">Inventory</Tab>
          <Tab value="notifications">Notifications</Tab>
        </TabList>

        <TabPanel value="general" className="max-w-3xl space-y-6">
          <Card>
            <CardHeader title="Company profile" description="Appears on invoices and purchase orders." />
            <CardContent className="space-y-4">
              <Field label="Legal name" orientation="horizontal" required>
                <Input defaultValue="Acme Industries B.V." />
              </Field>
              <Field label="VAT number" orientation="horizontal">
                <Input defaultValue="NL123456789B01" />
              </Field>
              <Field
                label="Base currency"
                orientation="horizontal"
                description="Cannot be changed after the first posted transaction."
                disabled
              >
                <Select
                  defaultValue="EUR"
                  options={[
                    { value: 'EUR', label: 'EUR — Euro' },
                    { value: 'USD', label: 'USD — US Dollar' },
                  ]}
                />
              </Field>
              <Field label="Fiscal year start" orientation="horizontal">
                <Select
                  defaultValue="1"
                  options={['January', 'April', 'July', 'October'].map((m, i) => ({ value: String(i * 3 + 1), label: m }))}
                />
              </Field>
            </CardContent>
            <CardFooter>
              <Button>Cancel</Button>
              <Button variant="primary" onClick={save}>
                Save changes
              </Button>
            </CardFooter>
          </Card>
        </TabPanel>

        <TabPanel value="sales" className="max-w-3xl space-y-6">
          <Card>
            <CardHeader title="Approvals" />
            <CardContent className="space-y-4">
              <Switch
                labelPosition="left"
                label="Require approval for sales orders"
                description="Orders above the threshold go to the sales manager."
                defaultChecked
              />
              <Field label="Approval threshold" orientation="horizontal">
                <Input prefix="€" defaultValue="10,000" numeric wrapperClassName="sm:max-w-48" />
              </Field>
              <Switch labelPosition="left" label="Block orders over credit limit" defaultChecked />
            </CardContent>
          </Card>
          <Card>
            <CardHeader title="Document numbering" />
            <CardContent>
              <RadioGroup
                defaultValue="yearly"
                options={[
                  { value: 'continuous', label: 'Continuous', description: 'SO-24181, SO-24182…' },
                  { value: 'yearly', label: 'Reset every fiscal year', description: 'SO-2026-0001…' },
                ]}
              />
            </CardContent>
            <CardFooter>
              <Button variant="primary" onClick={save}>
                Save
              </Button>
            </CardFooter>
          </Card>
        </TabPanel>

        <TabPanel value="inventory" className="max-w-3xl space-y-6">
          <Alert tone="warning" title="Changing the costing method">
            Switching methods triggers a revaluation of all stock at the next period close.
          </Alert>
          <Card>
            <CardHeader title="Valuation" />
            <CardContent>
              <RadioGroup
                variant="cards"
                orientation="horizontal"
                defaultValue="fifo"
                options={[
                  { value: 'fifo', label: 'FIFO', description: 'First in, first out' },
                  { value: 'avg', label: 'Moving average', description: 'Recomputed per receipt' },
                  { value: 'std', label: 'Standard', description: 'Variance to P&L' },
                ]}
              />
            </CardContent>
            <CardFooter>
              <Button variant="primary" onClick={save}>
                Save
              </Button>
            </CardFooter>
          </Card>
        </TabPanel>

        <TabPanel value="notifications" className="max-w-3xl">
          <Card className="divide-y divide-line">
            {[
              ['Orders awaiting my approval', 'Instant push and email', true],
              ['Low stock alerts', 'Daily digest at 8:00', true],
              ['Overdue invoices', 'Weekly summary on Monday', false],
              ['Failed bank sync', 'Instant', true],
            ].map(([label, desc, on]) => (
              <div key={label as string} className="px-5 py-3.5">
                <Switch
                  labelPosition="left"
                  label={label as string}
                  description={desc as string}
                  defaultChecked={on as boolean}
                />
              </div>
            ))}
          </Card>
        </TabPanel>
      </Tabs>
    </div>
  );
}
