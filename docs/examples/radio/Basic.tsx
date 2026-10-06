import { RadioGroup } from 'focus-ui';

export default function Example() {
  return (
    <RadioGroup
      label="Costing method"
      defaultValue="fifo"
      options={[
        { value: 'fifo', label: 'FIFO', description: 'First in, first out.' },
        { value: 'avg', label: 'Weighted average' },
        { value: 'std', label: 'Standard cost' },
        { value: 'lifo', label: 'LIFO', description: 'Not permitted under IFRS.', disabled: true },
      ]}
    />
  );
}
