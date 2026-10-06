import { Avatar } from 'focus-ui';

export default function Example() {
  return (
    <>
      <Avatar name="Ava Thompson" size="xs" />
      <Avatar name="Liam Chen" size="sm" status="online" />
      <Avatar name="Sofia Rossi" size="md" status="away" />
      <Avatar name="Noah Müller" size="lg" status="busy" />
      <Avatar name="Northwind Traders" size="xl" shape="rounded" />
    </>
  );
}
