import { Button, Divider, Field, Input, Select } from 'focus-ui';

export default function Example() {
  return (
    <form className="w-full max-w-2xl space-y-4" onSubmit={(e) => e.preventDefault()}>
      <Field label="Item name" orientation="horizontal" required>
        <Input defaultValue="Servo Motor 750W" />
      </Field>
      <Field label="Category" orientation="horizontal">
        <Select
          defaultValue="machinery"
          options={[
            { value: 'components', label: 'Components' },
            { value: 'electronics', label: 'Electronics' },
            { value: 'machinery', label: 'Machinery' },
          ]}
        />
      </Field>
      <Field label="Unit cost" orientation="horizontal" description="Standard cost used for valuation.">
        <Input prefix="€" defaultValue="412.50" numeric wrapperClassName="sm:max-w-40" />
      </Field>
      <Divider />
      <div className="flex justify-end gap-2">
        <Button>Cancel</Button>
        <Button type="submit" variant="primary">
          Save item
        </Button>
      </div>
    </form>
  );
}
