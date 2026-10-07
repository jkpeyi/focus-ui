import { Alert } from '@jkpeyi/focus-ui';
import { Code, H2, H3, List, P, Snippet } from './Prose';

export function Installation() {
  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-[-0.025em]">Installation</h1>
      <P>
        Focus UI ships as ESM + CJS with TypeScript declarations. React 18 or 19 is required. Pick the setup that matches your
        app.
      </P>

      <H2>1. Install the package</H2>
      <Snippet
        language="bash"
        code={`npm install @jkpeyi/focus-ui\n# or\npnpm add @jkpeyi/focus-ui\n# or\nyarn add @jkpeyi/focus-ui`}
      />

      <H2>2a. With Tailwind CSS v4 (recommended)</H2>
      <P>
        Import the Focus UI theme after Tailwind and point Tailwind at the package so it generates the classes the components use.
        You can then use the same tokens (<Code>bg-surface</Code>, <Code>text-fg-muted</Code>, <Code>shadow-card</Code>…) in your
        own code.
      </P>
      <Snippet
        language="css"
        code={`/* src/index.css */
@import "tailwindcss";
@import "@jkpeyi/focus-ui/theme.css";

/* Path is relative to this CSS file */
@source "../node_modules/@jkpeyi/focus-ui/dist";`}
      />
      <Alert tone="info" title="Using Vite?">
        Add <Code>@tailwindcss/vite</Code> to your plugins. With Next.js use <Code>@tailwindcss/postcss</Code>.
      </Alert>

      <H2>2b. Without Tailwind</H2>
      <P>
        Import the precompiled stylesheet once. It contains Tailwind’s preflight, the tokens and every class the components need.
      </P>
      <Snippet code={`// main.tsx\nimport '@jkpeyi/focus-ui/styles.css';`} />

      <H2>3. Wrap your app</H2>
      <P>
        <Code>ThemeProvider</Code> handles light/dark mode (persisted, follows the OS by default). <Code>ToastProvider</Code>{' '}
        enables <Code>useToast()</Code>. Both are optional.
      </P>
      <Snippet
        code={`import { ThemeProvider, ToastProvider } from '@jkpeyi/focus-ui';

export function Root() {
  return (
    <ThemeProvider defaultMode="system">
      <ToastProvider position="bottom-right">
        <App />
      </ToastProvider>
    </ThemeProvider>
  );
}`}
      />

      <H2>4. Build something</H2>
      <Snippet
        code={`import { Button, Card, CardHeader, CardContent, StatCard, formatCurrency } from '@jkpeyi/focus-ui';

export function Dashboard() {
  return (
    <div className="grid gap-4 p-6 sm:grid-cols-3">
      <StatCard label="Revenue" value={formatCurrency(312480)} delta={0.072} deltaLabel="vs last month" />
      <Card className="sm:col-span-2">
        <CardHeader title="Pending approvals" actions={<Button variant="primary">Review</Button>} />
        <CardContent>…</CardContent>
      </Card>
    </div>
  );
}`}
      />

      <H2>Framework notes</H2>
      <H3>Next.js (App Router)</H3>
      <P>
        The bundle is marked with <Code>"use client"</Code>, so components can be imported from Server Components directly. Add
        the <Code>ThemeProvider</Code> in a client layout and put <Code>suppressHydrationWarning</Code> on{' '}
        <Code>&lt;html&gt;</Code> as the theme class is applied on the client.
      </P>
      <H3>Routing</H3>
      <P>
        Navigation components render plain anchors and accept <Code>href</Code>/<Code>onClick</Code>, so they work with any
        router. For client-side navigation call your router in <Code>onClick</Code> and <Code>preventDefault()</Code>.
      </P>
      <H3>Icons</H3>
      <P>
        Every <Code>icon</Code> prop accepts any React node. The docs use <Code>lucide-react</Code>, whose stroke style pairs well
        with SF Symbols-inspired UI.
      </P>

      <H2>Browser support</H2>
      <List
        items={[
          'Latest two versions of Safari, Chrome, Edge and Firefox (desktop and mobile).',
          <>
            Relies on modern CSS: <Code>color-mix()</Code>, <Code>:has()</Code>, <Code>backdrop-filter</Code> and cascade layers —
            the same baseline as Tailwind CSS v4.
          </>,
        ]}
      />
    </div>
  );
}
