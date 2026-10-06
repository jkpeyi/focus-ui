import { Progress } from 'focus-ui';

export default function Example() {
  return (
    <div className="grid w-full max-w-sm gap-5">
      <Progress label="Q3 sales target" value={78} showValue />
      <Progress label="Warehouse capacity — Rotterdam" value={93} tone="warning" showValue />
      <Progress label="Budget consumed — Marketing" value={104} tone="danger" showValue />
      <Progress label="Inventory count" value={45} tone="success" size="sm" showValue />
    </div>
  );
}
