import { Badge } from 'focus-ui';

export default function Example() {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex flex-wrap gap-2">
        <Badge tone="accent" variant="solid">
          Solid
        </Badge>
        <Badge tone="success" variant="solid">
          Paid
        </Badge>
        <Badge tone="danger" variant="solid">
          Overdue
        </Badge>
      </div>
      <div className="flex flex-wrap gap-2">
        <Badge tone="accent" variant="outline">
          Outline
        </Badge>
        <Badge tone="success" variant="outline">
          In stock
        </Badge>
        <Badge variant="outline" size="sm">
          v2.4.1
        </Badge>
      </div>
    </div>
  );
}
