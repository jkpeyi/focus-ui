# Focus UI

**A modern, elegant React component library inspired by Apple's design language — engineered for enterprise and ERP web platforms. Tailwind CSS at its core.**

- 🍎 **Apple-grade craft** — system typography, translucent materials, hairline borders, soft elevation, spring motion.
- 🏢 **ERP-focused** — DataTable with totals, bulk actions & density; record Sheets; workflow Steppers; KPI StatCards; audit Timelines; searchable Combobox pickers.
- 🎨 **Tailwind CSS v4 at the core** — every design token is a Tailwind theme variable (`bg-surface`, `text-fg-muted`, `shadow-card`…). Override anything with `className`.
- 📱 **Responsive by default** — sidebar → drawer, modal → bottom sheet, tables hide secondary columns.
- ♿ **Accessible** — keyboard navigation, focus trapping & restoration, ARIA roles, visible focus halos.
- 🌗 **Light & dark** — semantic tokens flip automatically; rebrand with one CSS variable.
- 🪶 **Lightweight** — runtime deps are only `clsx` and `tailwind-merge`. Tree-shakeable ESM + CJS, full TypeScript types, `"use client"` ready for Next.js.

---

## Contents

- [Quick start](#quick-start)
- [Documentation site & ERP demo](#documentation-site--erp-demo)
- [Components](#components)
- [Theming](#theming)
- [Usage examples](#usage-examples)
- [ERP patterns](#erp-patterns)
- [Accessibility](#accessibility)
- [Project structure](#project-structure)
- [Development](#development)

---

## Quick start

```bash
npm install focus-ui
```

### With Tailwind CSS v4 (recommended)

```css
/* src/index.css */
@import 'tailwindcss';
@import 'focus-ui/theme.css';

/* Let Tailwind see the classes used by the components (path relative to this file) */
@source "../node_modules/focus-ui/dist";
```

### Without Tailwind

```ts
import 'focus-ui/styles.css'; // precompiled: preflight + tokens + component styles
```

### Wrap your app (optional providers)

```tsx
import { ThemeProvider, ToastProvider } from 'focus-ui';

createRoot(root).render(
  <ThemeProvider defaultMode="system">
    <ToastProvider>
      <App />
    </ToastProvider>
  </ThemeProvider>,
);
```

Requires **React 18 or 19**.

---

## Documentation site & ERP demo

The repository contains a full documentation site with **live examples whose source is the exact code shown** (each example in `docs/examples/` is both rendered and displayed), API tables for every component, guides, and a complete **ERP demo application** (dashboard, sales orders, order detail with approval workflow, order entry with line-item editor, inventory, customers and settings).

```bash
npm install
npm run dev          # http://localhost:5173 — docs + demo (#/demo)
npm run build:docs   # static site in docs-dist/, deployable anywhere (hash routing)
```

---

## Components

| Group                   | Components                                                                                                                                                     |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Foundations**         | `Button`, `IconButton`, `Badge`, `Avatar`, `AvatarGroup`, `Card` (+ `CardHeader`, `CardContent`, `CardFooter`), `Tag`, `Divider`, `Spinner`, `Skeleton`, `Kbd` |
| **Forms**               | `Field`, `Label`, `Input`, `Textarea`, `Select`, `Combobox`, `Checkbox`, `Switch`, `RadioGroup`, `SegmentedControl`, `SearchField`                             |
| **Feedback**            | `Alert`, `ToastProvider` / `useToast`, `Progress`, `ProgressRing`, `EmptyState`                                                                                |
| **Overlays**            | `Modal`, `ConfirmDialog`, `Sheet`, `Popover`, `Tooltip`, `DropdownMenu`, `Portal`                                                                              |
| **Navigation & layout** | `AppShell`, `Sidebar`, `SidebarSection`, `SidebarItem`, `Topbar`, `PageHeader`, `Tabs` (+ `TabList`, `Tab`, `TabPanel`), `Breadcrumbs`, `Pagination`           |
| **Data display**        | `DataTable`, `StatCard`, `Sparkline`, `DescriptionList`, `Stepper`, `Timeline`                                                                                 |
| **Theming**             | `ThemeProvider`, `useTheme`                                                                                                                                    |
| **Hooks**               | `useControllableState`, `useFloating`, `useFocusTrap`, `useEscapeKey`, `useClickOutside`, `useLockBodyScroll`, `useMediaQuery`, `usePresence`                  |
| **Utilities**           | `cn`, `mergeRefs`, `formatCurrency`, `formatNumber`, `formatCompact`, `formatPercent`, `formatDate`                                                            |

Every component:

- forwards native HTML attributes and accepts `className` (merged with `tailwind-merge`, so your classes win);
- supports controlled **and** uncontrolled usage where it holds state (`value`/`defaultValue`/`onValueChange`, `checked`/`defaultChecked`/`onCheckedChange`, `open`/`onOpenChange`…);
- is written in strict TypeScript.

---

## Theming

All tokens are CSS variables prefixed `--fx-` and mapped to Tailwind via `@theme`:

| Tailwind token                         | Variable                         | Purpose                                             |
| -------------------------------------- | -------------------------------- | --------------------------------------------------- |
| `canvas`                               | `--fx-canvas`                    | App background                                      |
| `surface`, `surface-2`                 | `--fx-surface`, `--fx-surface-2` | Cards, tables, inputs / table headers               |
| `elevated`                             | `--fx-elevated`                  | Modals, sheets, popovers                            |
| `fill`                                 | `--fx-fill`                      | Neutral fills — use with opacity, e.g. `bg-fill/12` |
| `fg`, `fg-muted`, `fg-subtle`          | `--fx-fg*`                       | Text hierarchy                                      |
| `line`, `line-strong`                  | `--fx-line*`                     | Hairlines, control borders                          |
| `accent`                               | `--fx-accent`                    | Brand & interactive color                           |
| `success`, `warning`, `danger`, `info` | `--fx-*`                         | Semantic states                                     |
| `shadow-card/raised/popover/modal`     | `--fx-shadow-*`                  | Elevation                                           |

Utilities: `focus-ring` (soft focus halo), `material` (translucent blurred surface), `scrollbar-thin`. Easings: `ease-apple`, `ease-spring`.

**Dark mode** — add `dark` (or `data-theme="dark"`) to `<html>`; `ThemeProvider` does it for you, including the `system` mode. Tailwind's `dark:` variant uses the same selector.

**Rebrand** — override variables after importing the theme:

```css
@import 'tailwindcss';
@import 'focus-ui/theme.css';

:root {
  --fx-accent: #6d28d9;
  --fx-accent-hover: #7c3aed;
}
.dark {
  --fx-accent: #a78bfa;
  --fx-accent-hover: #c4b5fd;
}
```

---

## Usage examples

### Data table with selection, totals and bulk actions

```tsx
import { Badge, Button, DataTable, formatCurrency, type DataTableColumn } from 'focus-ui';

const columns: DataTableColumn<Order>[] = [
  { id: 'number', header: 'Order', sortable: true, sticky: true },
  { id: 'customer', header: 'Customer', sortable: true, accessor: (o) => o.customer.name, cell: (o) => o.customer.name },
  { id: 'date', header: 'Date', sortable: true, hideBelow: 'md', accessor: (o) => new Date(o.date) },
  {
    id: 'status',
    header: 'Status',
    cell: (o) => (
      <Badge tone={toneFor(o.status)} dot>
        {o.status}
      </Badge>
    ),
  },
  {
    id: 'total',
    header: 'Total',
    align: 'right',
    sortable: true,
    cell: (o) => formatCurrency(o.total, 'EUR'),
    footer: (rows) =>
      formatCurrency(
        rows.reduce((s, o) => s + o.total, 0),
        'EUR',
      ),
  },
];

<DataTable
  columns={columns}
  data={orders}
  rowKey="id"
  selectable
  pageSize={25}
  density="compact"
  defaultSort={{ id: 'date', direction: 'desc' }}
  onRowClick={openInSheet}
  toolbar={<SearchField value={q} onValueChange={setQ} />}
  bulkActions={(rows, clear) => <Button onClick={() => archive(rows).then(clear)}>Archive</Button>}
/>;
```

### Forms with automatic label / error wiring

```tsx
<Field label="Customer" required error={errors.customer}>
  <Combobox options={customerOptions} value={customer} onValueChange={setCustomer} />
</Field>
<Field label="Unit price" orientation="horizontal" description="Excl. VAT">
  <Input prefix="€" suffix="EUR" numeric />
</Field>
```

### Confirm a destructive action

```tsx
<ConfirmDialog
  open={open}
  onClose={() => setOpen(false)}
  destructive
  title="Void invoice INV-0412?"
  description="A credit note will be created. This can't be undone."
  confirmLabel="Void invoice"
  onConfirm={() => api.voidInvoice(id)} // spinner until the promise settles
/>
```

### Application frame

```tsx
<AppShell
  sidebar={
    <Sidebar header={<Logo />} footer={<UserMenu />}>
      <SidebarSection title="Sales">
        <SidebarItem icon={<Gauge />} label="Dashboard" href="/" active />
        <SidebarItem icon={<ShoppingCart />} label="Orders" href="/orders" badge={12} />
      </SidebarSection>
    </Sidebar>
  }
  topbar={<Topbar start={<SearchField shortcut="k" />} end={<Avatar name="Ava Thompson" />} />}
>
  <main className="p-6">
    <PageHeader title="Sales orders" actions={<Button variant="primary">New order</Button>} />
  </main>
</AppShell>
```

### Toasts

```tsx
const { toast } = useToast();
toast({ title: '3 orders archived', tone: 'success', action: { label: 'Undo', onClick: restore } });
```

---

## ERP patterns

- **List → Sheet → Page.** Preview records in a `Sheet` from a `DataTable` (`activeRowKey` highlights the open row); open the full page only for deep edits.
- **One primary action per screen.** Submit / Approve / Post as `variant="primary"`; everything else secondary or in a `DropdownMenu`.
- **Consistent status language.** `Badge` with `dot` and a fixed status → tone mapping across modules.
- **Workflows & history.** `Stepper` for lifecycles and approval chains (with `error` for rejections), `Timeline` for audit trails.
- **Numbers.** Right-aligned with tabular figures (`align: 'right'` / `numeric`), totals in the table footer, `formatCurrency()` everywhere.
- **Irreversible operations** go through `ConfirmDialog`.
- **Density.** `density="compact"` fits ~40% more rows for power users.

---

## Accessibility

- All interactive components are keyboard operable: arrow keys in `SegmentedControl`, `Tabs`, `DropdownMenu`, `Combobox`; Escape closes overlays; Enter/Space activate.
- `Modal`, `Sheet` and the mobile sidebar trap focus, restore it on close and lock body scroll.
- `Field` links labels, descriptions and errors (`aria-describedby`, `aria-invalid`, `required`).
- Icon-only buttons require a `label`.
- Color is never the only signal — statuses carry text, deltas carry arrows, charts have table fallbacks.
- Motion respects `prefers-reduced-motion`.

---

## Project structure

```
src/
  components/      # one file per component
  hooks/           # reusable hooks (floating positioning, focus trap…)
  styles/
    theme.css      # design tokens → Tailwind @theme (shipped as focus-ui/theme.css)
    standalone.css # entry for the precompiled focus-ui/styles.css
  utils/           # cn, formatters, mergeRefs
  index.ts         # public API
docs/
  site/            # docs shell (built with Focus UI itself)
  content/         # guides + component registry (descriptions, props)
  examples/        # live examples — rendered AND shown as source
  demo/            # full ERP demo application
tests/             # Vitest + Testing Library
```

## Development

```bash
npm install
npm run dev         # docs & demo with hot reload
npm test            # unit tests (Vitest + Testing Library)
npm run typecheck   # strict TypeScript
npm run build       # dist/: ESM, CJS, .d.ts, theme.css, focus-ui.css
npm run format      # Prettier
```

Adding a component: create `src/components/MyThing.tsx`, export it from `src/index.ts`, add examples in `docs/examples/my-thing/`, register the page in `docs/content/components.ts`, and add tests in `tests/`.

## License

MIT
