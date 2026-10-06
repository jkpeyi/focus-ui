import { Divider, Kbd } from 'focus-ui';

export default function Example() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-3 text-[13px] text-fg-muted">
      <div className="flex items-center justify-between">
        Quick search{' '}
        <span className="flex gap-1">
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </span>
      </div>
      <Divider />
      <div className="flex items-center justify-between">
        New sales order{' '}
        <span className="flex gap-1">
          <Kbd>⌥</Kbd>
          <Kbd>N</Kbd>
        </span>
      </div>
      <Divider label="or" />
      <div className="flex items-center justify-between">
        Save &amp; close{' '}
        <span className="flex gap-1">
          <Kbd>⌘</Kbd>
          <Kbd>↵</Kbd>
        </span>
      </div>
    </div>
  );
}
