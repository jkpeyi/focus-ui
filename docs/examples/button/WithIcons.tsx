import { Button } from 'focus-ui';
import { ChevronDown, Download, Plus } from 'lucide-react';

export default function Example() {
  return (
    <>
      <Button variant="primary" leadingIcon={<Plus />}>
        New invoice
      </Button>
      <Button leadingIcon={<Download />}>Download PDF</Button>
      <Button variant="tinted" trailingIcon={<ChevronDown />}>
        Actions
      </Button>
    </>
  );
}
