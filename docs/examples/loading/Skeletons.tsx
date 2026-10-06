import { Card, Skeleton } from 'focus-ui';

export default function Example() {
  return (
    <Card padding="md" className="w-full max-w-sm">
      <div className="flex items-center gap-3">
        <Skeleton circle className="size-10" />
        <div className="flex-1 space-y-2">
          <Skeleton className="w-1/2" />
          <Skeleton className="h-2.5 w-1/3" />
        </div>
      </div>
      <Skeleton lines={3} className="mt-5" />
    </Card>
  );
}
