import { Badge, Button } from '@jkpeyi/focus-ui';
import { ArrowRight, Check } from 'lucide-react';
import type { ComponentDoc } from '../content/components';
import { CodeBlock } from './CodeBlock';
import { Preview } from './Preview';
import { PropsTable } from './PropsTable';
import { navigate } from './router';

export function ComponentPage({ doc }: { doc: ComponentDoc }) {
  return (
    <article>
      <Badge tone="accent" className="mb-3">
        {doc.group}
      </Badge>
      <h1 className="text-3xl font-semibold tracking-[-0.025em] text-fg">{doc.title}</h1>
      <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-fg-muted">{doc.description}</p>
      <div className="mt-5 overflow-hidden rounded-xl border border-line">
        <CodeBlock code={doc.import} />
      </div>

      {doc.slug === 'app-shell' && (
        <div className="mt-8 rounded-2xl bg-surface p-6 shadow-card">
          <div className="text-[15px] font-semibold">See it in a real application</div>
          <p className="mt-1 text-[13px] text-fg-muted">
            The AppShell is best experienced full screen. The demo ERP uses it with a collapsible sidebar, mobile drawer, search
            and user menu.
          </p>
          <Button className="mt-4" variant="primary" trailingIcon={<ArrowRight />} onClick={() => navigate('demo')}>
            Launch ERP demo
          </Button>
          <div className="mt-6 overflow-hidden rounded-xl border border-line">
            <CodeBlock
              code={`<AppShell
  sidebar={
    <Sidebar header={<Logo />} footer={<SidebarProfile name="Ava Thompson" description="Admin" />}>
      <SidebarSection title="Sales">
        <SidebarItem icon={<Gauge />} label="Dashboard" href="/" active />
        <SidebarItem icon={<ShoppingCart />} label="Orders" href="/orders" badge={12} />
      </SidebarSection>
    </Sidebar>
  }
  topbar={<Topbar start={<SearchField shortcut="k" />} end={<NotificationsButton />} />}
  footer={<Footer variant="bar" brand="Acme ERP" copyright="v4.12.0" meta="Synced 2 min ago" />}
>
  <div className="p-6">
    <PageHeader title="Dashboard" actions={<Button variant="primary">New order</Button>} />
  </div>
</AppShell>`}
            />
          </div>
        </div>
      )}

      {doc.examples.length > 0 && (
        <div className="mt-10 space-y-10">
          {doc.examples.map((ex) => (
            <Preview
              key={ex.file}
              example={ex.file}
              title={ex.title}
              description={ex.description}
              bleed={ex.bleed}
              frame={ex.frame}
            />
          ))}
        </div>
      )}

      {doc.guidelines && (
        <section className="mt-12">
          <h2 className="mb-3 text-xl font-semibold tracking-[-0.015em]">Guidelines</h2>
          <ul className="space-y-2">
            {doc.guidelines.map((g) => (
              <li key={g} className="flex gap-2.5 text-[14px] text-fg-muted">
                <Check className="mt-0.5 size-4 shrink-0 text-success" />
                {g}
              </li>
            ))}
          </ul>
        </section>
      )}

      {doc.props && (
        <section className="mt-12">
          <h2 className="mb-4 text-xl font-semibold tracking-[-0.015em]">API reference</h2>
          <div className="space-y-6">
            {doc.props.map((group, i) => (
              <PropsTable key={i} title={group.title} props={group.props} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
