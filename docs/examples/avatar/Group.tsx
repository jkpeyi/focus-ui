import { Avatar, AvatarGroup } from 'focus-ui';

export default function Example() {
  return (
    <AvatarGroup max={4}>
      {['Ava Thompson', 'Daniel Kim', 'Grace Lee', 'Marco Bianchi', 'Priya Nair', 'Lucas Silva'].map((name) => (
        <Avatar key={name} name={name} />
      ))}
    </AvatarGroup>
  );
}
