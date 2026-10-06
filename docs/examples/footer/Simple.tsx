import { Footer } from 'focus-ui';

export default function Example() {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-line bg-surface">
      <div className="h-24 p-6 text-[13px] text-fg-muted">Page content…</div>
      <Footer
        brand="Focus ERP"
        copyright="© 2026 Acme Industries"
        links={[
          { label: 'Help center', href: '#' },
          { label: 'Release notes', href: '#' },
          { label: 'Privacy', href: '#' },
        ]}
        meta={<span className="text-[13px] text-fg-subtle">v4.12.0</span>}
      />
    </div>
  );
}
