import { useState } from 'react';
import { Button } from '@jkpeyi/focus-ui';

export default function Example() {
  const [posting, setPosting] = useState(false);
  const post = () => {
    setPosting(true);
    setTimeout(() => setPosting(false), 1800);
  };
  return (
    <>
      <Button variant="primary" loading={posting} onClick={post}>
        {posting ? 'Posting to ledger…' : 'Post to ledger'}
      </Button>
      <Button disabled>Disabled</Button>
    </>
  );
}
