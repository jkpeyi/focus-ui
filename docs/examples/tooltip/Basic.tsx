import { Button, IconButton, Tooltip } from '@jkpeyi/focus-ui';
import { Info, Printer } from 'lucide-react';

export default function Example() {
  return (
    <>
      <Tooltip content="Print packing slip">
        <IconButton label="Print" icon={<Printer />} variant="secondary" />
      </Tooltip>
      <Tooltip content="Gross margin = (Revenue − COGS) / Revenue" placement="bottom">
        <Button variant="plain" leadingIcon={<Info />}>
          Gross margin
        </Button>
      </Tooltip>
      <Tooltip content="Shown on the right" placement="right">
        <Button>Right</Button>
      </Tooltip>
    </>
  );
}
