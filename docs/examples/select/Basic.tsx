import { Field, Select } from '@jkpeyi/focus-ui';

export default function Example() {
  return (
    <div className="grid w-full max-w-xs gap-4">
      <Field label="Payment terms">
        <Select
          placeholder="Choose terms"
          defaultValue=""
          options={[
            { value: 'net15', label: 'Net 15' },
            { value: 'net30', label: 'Net 30' },
            { value: 'net60', label: 'Net 60' },
            { value: 'cod', label: 'Cash on delivery' },
          ]}
        />
      </Field>
      <Field label="Currency">
        <Select size="sm" defaultValue="EUR">
          <option value="USD">USD — US Dollar</option>
          <option value="EUR">EUR — Euro</option>
          <option value="GBP">GBP — British Pound</option>
        </Select>
      </Field>
    </div>
  );
}
