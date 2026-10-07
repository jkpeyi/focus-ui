import { Card } from '@jkpeyi/focus-ui';
import { H2, List, P } from './Prose';

const principles = [
  {
    title: 'Clarity',
    text: 'Content is the interface. Typography, spacing and hierarchy do the heavy lifting; chrome stays quiet.',
  },
  {
    title: 'Deference',
    text: 'Translucent materials, hairlines and soft shadows let data take center stage — vital for dense ERP screens.',
  },
  {
    title: 'Depth',
    text: 'Layers communicate hierarchy: canvas → surface → elevated. Motion reinforces where things come from.',
  },
  { title: 'Efficiency', text: 'Keyboard-first flows, compact density, bulk actions and side sheets keep power users in flow.' },
];

export function Principles() {
  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-[-0.025em]">Design principles</h1>
      <P>
        Focus UI adapts Apple’s Human Interface Guidelines to the realities of enterprise software: many records, many fields,
        many users.
      </P>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {principles.map((p, i) => (
          <Card key={p.title} padding="md">
            <div className="text-xs font-semibold text-accent tabular-nums">0{i + 1}</div>
            <div className="mt-1 text-[17px] font-semibold">{p.title}</div>
            <p className="mt-1.5 text-[13px] leading-relaxed text-fg-muted">{p.text}</p>
          </Card>
        ))}
      </div>

      <H2>ERP patterns</H2>
      <List
        items={[
          'List → Sheet → Page: preview records in a Sheet from a DataTable; open the full page only for deep edits.',
          'One primary action per screen (Submit, Post, Approve). Secondary actions go in the PageHeader or a DropdownMenu.',
          'Document status uses Badge with dot and a fixed tone mapping across modules.',
          'Workflows (approval chains, order lifecycles) use Stepper; history uses Timeline.',
          'Amounts are right-aligned with tabular figures; totals live in the DataTable footer.',
          'Irreversible operations (void, post, delete) always go through ConfirmDialog.',
        ]}
      />

      <H2>Accessibility</H2>
      <List
        items={[
          'All interactive components are keyboard operable with visible focus halos (focus-ring utility).',
          'Overlays trap focus, restore it on close and close with Escape.',
          'Form controls are linked to labels, descriptions and errors automatically through Field.',
          'Color is never the only signal: statuses carry text, deltas carry arrows.',
          'Text tokens meet WCAG AA contrast on their intended surfaces in both themes.',
        ]}
      />

      <H2>Responsive strategy</H2>
      <List
        items={[
          '< 640px: modals become bottom sheets, footers stack full width, breadcrumbs collapse.',
          '< 1024px: the sidebar becomes a drawer opened from the Topbar.',
          'Tables keep essential columns and hide others via hideBelow; horizontal scroll with a sticky first column for the rest.',
        ]}
      />
    </div>
  );
}
