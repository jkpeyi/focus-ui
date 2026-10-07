import { Checkbox } from '@jkpeyi/focus-ui';

export default function Example() {
  return (
    <div className="flex flex-col gap-3">
      <Checkbox label="Send invoice by email" defaultChecked />
      <Checkbox label="Attach delivery note" description="Adds the signed POD as a PDF attachment." />
      <Checkbox label="Mark as tax exempt" disabled />
    </div>
  );
}
