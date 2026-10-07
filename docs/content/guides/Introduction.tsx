import { Badge, Button, Card } from '@jkpeyi/focus-ui';
import { ArrowRight, Boxes, Gauge, Layers, Moon, MousePointerClick, Palette, Smartphone, Table2 } from 'lucide-react';
import { navigate } from '../../site/router';
import { H2, P } from './Prose';
import { componentDocs } from '../components';

const features = [
  {
    icon: <Palette />,
    title: 'Apple-grade craft',
    text: 'System typography, soft materials, hairline borders, spring motion and a restrained palette.',
  },
  {
    icon: <Table2 />,
    title: 'Built for ERP',
    text: 'Data tables with totals & bulk actions, record sheets, workflow steppers, KPI tiles, audit timelines.',
  },
  {
    icon: <Layers />,
    title: 'Tailwind at the core',
    text: 'Every token is a Tailwind v4 theme variable. Style with utilities, override with className.',
  },
  {
    icon: <Smartphone />,
    title: 'Responsive by default',
    text: 'Sidebar becomes a drawer, modals become bottom sheets, tables hide secondary columns.',
  },
  {
    icon: <MousePointerClick />,
    title: 'Accessible',
    text: 'Keyboard navigation, focus management, ARIA roles and visible focus halos throughout.',
  },
  {
    icon: <Moon />,
    title: 'Light & dark',
    text: 'Semantic tokens switch automatically. Rebrand by changing a single CSS variable.',
  },
  {
    icon: <Gauge />,
    title: 'Lightweight',
    text: 'Zero runtime dependencies beyond clsx and tailwind-merge. Tree-shakeable ESM.',
  },
  { icon: <Boxes />, title: 'Typed', text: 'Written in strict TypeScript with generic, inferred APIs such as DataTable<T>.' },
];

export function Introduction() {
  return (
    <div>
      <div className="relative overflow-hidden rounded-3xl bg-surface px-6 py-12 shadow-card sm:px-12 sm:py-16">
        <div
          aria-hidden
          className="absolute -top-24 -right-24 size-96 rounded-full opacity-30 blur-3xl"
          style={{ background: 'radial-gradient(circle, var(--fx-accent), transparent 70%)' }}
        />
        <Badge tone="accent" className="mb-5">
          v0.1 · React 18 & 19 · Tailwind CSS v4
        </Badge>
        <h1 className="max-w-2xl text-4xl font-semibold tracking-[-0.03em] text-fg sm:text-5xl">
          Focus on the work.
          <br />
          <span className="text-fg-muted">The interface gets out of the way.</span>
        </h1>
        <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-fg-muted">
          Focus UI is a modern React component library inspired by Apple’s design language and engineered for enterprise platforms
          — ERP, finance, supply chain and back-office tools.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button variant="primary" size="lg" trailingIcon={<ArrowRight />} onClick={() => navigate('installation')}>
            Get started
          </Button>
          <Button size="lg" onClick={() => navigate('demo')}>
            Launch ERP demo
          </Button>
        </div>
      </div>

      <H2>Why Focus UI</H2>
      <div className="grid gap-4 sm:grid-cols-2">
        {features.map((f) => (
          <Card key={f.title} padding="md" className="flex gap-4">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent [&_svg]:size-5">
              {f.icon}
            </span>
            <div>
              <div className="text-[15px] font-semibold">{f.title}</div>
              <p className="mt-1 text-[13px] leading-relaxed text-fg-muted">{f.text}</p>
            </div>
          </Card>
        ))}
      </div>

      <H2>Components</H2>
      <P>{componentDocs.length} documented components and patterns, each with live, copy-pasteable examples.</P>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {componentDocs.map((c) => (
          <button
            key={c.slug}
            onClick={() => navigate(`components/${c.slug}`)}
            className="focus-ring flex items-center justify-between rounded-xl bg-surface px-3.5 py-2.5 text-left text-[13px] font-medium shadow-card transition hover:-translate-y-px hover:shadow-popover"
          >
            {c.title}
            <ArrowRight className="size-3.5 text-fg-subtle" />
          </button>
        ))}
      </div>
    </div>
  );
}
