import { Preview } from '../../site/Preview';
import { Code, H2, List, P, Snippet } from './Prose';

const tokens: [string, string, string][] = [
  ['canvas', '--fx-canvas', 'App background'],
  ['surface', '--fx-surface', 'Cards, tables, inputs'],
  ['surface-2', '--fx-surface-2', 'Table headers, subtle panels'],
  ['elevated', '--fx-elevated', 'Modals, sheets, popovers'],
  ['fill', '--fx-fill', 'Neutral fills — use with opacity (bg-fill/12)'],
  ['fg', '--fx-fg', 'Primary text'],
  ['fg-muted', '--fx-fg-muted', 'Secondary text'],
  ['fg-subtle', '--fx-fg-subtle', 'Placeholders, tertiary text'],
  ['line', '--fx-line', 'Hairlines & dividers'],
  ['line-strong', '--fx-line-strong', 'Control borders'],
  ['accent', '--fx-accent', 'Brand / interactive color'],
  ['success', '--fx-success', 'Positive states'],
  ['warning', '--fx-warning', 'Attention states'],
  ['danger', '--fx-danger', 'Errors & destructive actions'],
  ['info', '--fx-info', 'Informational states'],
];

export function Theming() {
  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-[-0.025em]">Theming</h1>
      <P>
        Focus UI is themed entirely with CSS variables, exposed to Tailwind through <Code>@theme</Code>. Components only use
        semantic tokens, so light/dark mode and rebranding require no component changes.
      </P>

      <H2>Color tokens</H2>
      <P>
        Each token is available as a Tailwind color: <Code>bg-surface</Code>, <Code>text-fg-muted</Code>, <Code>border-line</Code>
        , <Code>ring-accent/20</Code>…
      </P>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {tokens.map(([name, variable, usage]) => (
          <div key={name} className="flex items-center gap-3 rounded-xl bg-surface p-2.5 shadow-card">
            <span
              className="size-10 shrink-0 rounded-lg ring-1 ring-line ring-inset"
              style={{ background: `var(${variable})` }}
            />
            <div className="min-w-0">
              <div className="font-mono text-[12.5px] font-medium">{name}</div>
              <div className="truncate text-xs text-fg-muted">{usage}</div>
            </div>
          </div>
        ))}
      </div>

      <H2>Dark mode</H2>
      <P>
        Add the <Code>dark</Code> class (or <Code>data-theme="dark"</Code>) to any ancestor — usually <Code>&lt;html&gt;</Code>.{' '}
        <Code>ThemeProvider</Code> does this for you and exposes <Code>useTheme()</Code>. Tailwind’s <Code>dark:</Code> variant is
        wired to the same selector.
      </P>
      <Preview example="theme/Toggle" title="Appearance switcher" />

      <H2>Rebranding</H2>
      <P>
        Override variables after importing the theme. Changing the accent recolors buttons, focus rings, selection, links and
        charts.
      </P>
      <Snippet
        language="css"
        code={`@import "tailwindcss";
@import "@jkpeyi/focus-ui/theme.css";

:root {
  --fx-accent: #6d28d9;        /* your brand */
  --fx-accent-hover: #7c3aed;
}
.dark {
  --fx-accent: #a78bfa;
  --fx-accent-hover: #c4b5fd;
}`}
      />

      <H2>Typography, radius, motion</H2>
      <List
        items={[
          <>
            Font stack: <Code>-apple-system</Code> / SF Pro first, then Inter, Segoe UI and Roboto. Override{' '}
            <Code>--font-sans</Code> to change it.
          </>,
          <>Radii follow a concentric scale: controls 8px, cards 16px, sheets & modals 16–20px.</>,
          <>
            Two easing curves: <Code>ease-apple</Code> for state changes and <Code>ease-spring</Code> for movement. Motion is
            disabled under <Code>prefers-reduced-motion</Code>.
          </>,
          <>
            Elevation tokens: <Code>shadow-card</Code>, <Code>shadow-raised</Code>, <Code>shadow-popover</Code>,{' '}
            <Code>shadow-modal</Code>.
          </>,
          <>
            Utilities: <Code>focus-ring</Code> (soft focus halo), <Code>material</Code> (translucent blurred surface),{' '}
            <Code>scrollbar-thin</Code>.
          </>,
        ]}
      />

      <H2>Customizing components</H2>
      <P>
        Every component accepts <Code>className</Code>. Classes are merged with <Code>tailwind-merge</Code>, so conflicting
        utilities you pass always win:
      </P>
      <Snippet
        code={`<Button variant="primary" className="rounded-full px-6">Checkout</Button>\n<Card className="bg-accent/5 shadow-none">…</Card>`}
      />
      <P>
        Use the exported <Code>cn()</Code> helper in your own components for the same behavior.
      </P>
    </div>
  );
}
