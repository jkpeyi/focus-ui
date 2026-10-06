import { Badge, Footer } from 'focus-ui';
import { CloudCheck } from 'lucide-react';

export default function Example() {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-line bg-canvas">
      <div className="h-24 p-6 text-[13px] text-fg-muted">Application content…</div>
      <Footer
        variant="bar"
        brand="Acme ERP"
        copyright="v4.12.0"
        links={[
          { label: 'Keyboard shortcuts', href: '#' },
          { label: 'Support', href: '#' },
        ]}
        meta={
          <>
            <Badge size="sm" tone="warning">
              Sandbox
            </Badge>
            <span className="inline-flex items-center gap-1.5">
              <CloudCheck className="size-3.5 text-success" /> Synced 2 min ago
            </span>
            <span>EUR · Europe/Amsterdam</span>
          </>
        }
      />
    </div>
  );
}
