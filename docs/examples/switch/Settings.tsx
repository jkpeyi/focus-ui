import { Card, Switch } from 'focus-ui';

export default function Example() {
  return (
    <Card className="w-full max-w-md divide-y divide-line">
      <div className="px-4 py-3">
        <Switch
          labelPosition="left"
          label="Require PO approval"
          description="Purchase orders over $10,000 need a manager."
          defaultChecked
        />
      </div>
      <div className="px-4 py-3">
        <Switch
          labelPosition="left"
          label="Auto-reorder stock"
          description="Create draft POs when stock hits the reorder point."
        />
      </div>
      <div className="px-4 py-3">
        <Switch labelPosition="left" label="Multi-currency" disabled defaultChecked />
      </div>
      <div className="flex items-center gap-4 px-4 py-3">
        <Switch size="sm" aria-label="Compact switch" defaultChecked />
        <span className="text-[13px] text-fg-muted">Small size</span>
      </div>
    </Card>
  );
}
