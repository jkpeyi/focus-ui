import { Button, Spinner } from '@jkpeyi/focus-ui';

export default function Example() {
  return (
    <>
      <Spinner size="xs" />
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" className="text-accent" />
      <Button loading>Saving</Button>
    </>
  );
}
