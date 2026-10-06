import { useState } from 'react';
import { ActionBar, Button, Switch } from 'focus-ui';

export default function Example() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Switch label="Show floating action bar" checked={open} onCheckedChange={setOpen} />
      <ActionBar
        open={open}
        message="3 settings changed"
        actions={
          <>
            <Button size="sm" variant="plain" onClick={() => setOpen(false)}>
              Discard
            </Button>
            <Button size="sm" variant="primary" onClick={() => setOpen(false)}>
              Save changes
            </Button>
          </>
        }
      />
    </>
  );
}
