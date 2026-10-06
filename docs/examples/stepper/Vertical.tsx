import { Stepper } from 'focus-ui';

export default function Example() {
  return (
    <Stepper
      orientation="vertical"
      current={2}
      error
      steps={[
        { label: 'Submitted by Daniel Kim', description: 'Oct 2, 09:14' },
        { label: 'Approved by Finance', description: 'Grace Lee · Oct 2, 11:40' },
        { label: 'Rejected by CFO', description: 'Budget exceeded for cost center 4100' },
        { label: 'Purchase order issued' },
      ]}
    />
  );
}
