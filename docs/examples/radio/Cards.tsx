import { RadioGroup } from '@jkpeyi/focus-ui';

export default function Example() {
  return (
    <RadioGroup
      className="w-full"
      label="Shipping method"
      variant="cards"
      orientation="horizontal"
      defaultValue="express"
      options={[
        { value: 'ground', label: 'Ground', description: '5–7 business days · $12' },
        { value: 'express', label: 'Express', description: '2 business days · $38' },
        { value: 'freight', label: 'Freight', description: 'Pallets & LTL · Quote' },
      ]}
    />
  );
}
