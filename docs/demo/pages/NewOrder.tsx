import { useState } from 'react';
import {
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  CardHeader,
  Combobox,
  Field,
  IconButton,
  Input,
  PageHeader,
  RadioGroup,
  Select,
  Textarea,
  useToast,
} from 'focus-ui';
import { Plus, Trash2 } from 'lucide-react';
import { customers, products } from '../data';
import { eur, go } from '../shared';

interface Line {
  key: number;
  sku: string | null;
  quantity: number;
  discount: number;
}

let nextKey = 3;

export function NewOrder() {
  const { toast } = useToast();
  const [customer, setCustomer] = useState<string | null>(null);
  const [lines, setLines] = useState<Line[]>([
    { key: 1, sku: products[2].sku, quantity: 12, discount: 0 },
    { key: 2, sku: null, quantity: 1, discount: 0 },
  ]);
  const [shipping, setShipping] = useState('ground');
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);

  const update = (key: number, patch: Partial<Line>) => setLines(lines.map((l) => (l.key === key ? { ...l, ...patch } : l)));
  const price = (sku: string | null) => products.find((p) => p.sku === sku)?.price ?? 0;
  const lineTotal = (l: Line) => price(l.sku) * l.quantity * (1 - l.discount / 100);
  const subtotal = lines.reduce((s, l) => s + lineTotal(l), 0);
  const shippingCost = { ground: 12, express: 38, freight: 240 }[shipping] ?? 0;
  const tax = (subtotal + shippingCost) * 0.2;

  const customerError = submitted && !customer ? 'Select a customer to continue.' : undefined;
  const filledLines = lines.filter((l) => l.sku);

  const save = async (submit: boolean) => {
    setSubmitted(true);
    if (!customer || filledLines.length === 0) {
      toast({ title: 'Some fields need attention', tone: 'warning' });
      return;
    }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 900));
    setSaving(false);
    toast({ title: submit ? 'Order submitted for approval' : 'Draft saved', description: 'SO-24181', tone: 'success' });
    go('orders');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={
          <Breadcrumbs
            items={[
              { label: 'Sales', href: '#/demo/orders' },
              { label: 'Orders', href: '#/demo/orders' },
              { label: 'New order' },
            ]}
          />
        }
        title="New sales order"
        actions={
          <>
            <Button onClick={() => go('orders')}>Discard</Button>
            <Button variant="tinted" onClick={() => save(false)} disabled={saving}>
              Save draft
            </Button>
            <Button variant="primary" onClick={() => save(true)} loading={saving}>
              Submit for approval
            </Button>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader title="Customer & dates" />
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <Field label="Customer" required error={customerError} className="sm:col-span-2">
                <Combobox
                  value={customer}
                  onValueChange={setCustomer}
                  placeholder="Search customers…"
                  options={customers.map((c) => ({ value: c.id, label: c.name, description: `${c.id} · ${c.city}` }))}
                />
              </Field>
              <Field label="Order date" required>
                <Input type="date" defaultValue="2026-10-06" />
              </Field>
              <Field label="Requested delivery">
                <Input type="date" defaultValue="2026-10-20" />
              </Field>
              <Field label="Customer reference" labelAside="Optional">
                <Input placeholder="e.g. PO-55120" />
              </Field>
              <Field label="Warehouse">
                <Select
                  defaultValue="rtm"
                  options={[
                    { value: 'sea', label: 'Seattle DC' },
                    { value: 'rtm', label: 'Rotterdam' },
                    { value: 'sin', label: 'Singapore' },
                  ]}
                />
              </Field>
            </CardContent>
          </Card>

          <Card>
            <CardHeader
              title="Line items"
              description={`${filledLines.length} ${filledLines.length === 1 ? 'product' : 'products'}`}
              actions={
                <Button
                  size="sm"
                  variant="tinted"
                  leadingIcon={<Plus />}
                  onClick={() => setLines([...lines, { key: nextKey++, sku: null, quantity: 1, discount: 0 }])}
                >
                  Add line
                </Button>
              }
            />
            <div className="divide-y divide-line border-t border-line">
              <div className="hidden grid-cols-[1fr_90px_90px_120px_32px] gap-3 bg-surface-2 px-5 py-2 text-xs font-medium text-fg-muted md:grid dark:bg-surface">
                <span>Product</span>
                <span className="text-right">Qty</span>
                <span className="text-right">Disc. %</span>
                <span className="text-right">Amount</span>
                <span />
              </div>
              {lines.map((line) => (
                <div
                  key={line.key}
                  className="grid grid-cols-2 items-center gap-3 px-5 py-3 md:grid-cols-[1fr_90px_90px_120px_32px]"
                >
                  <div className="col-span-2 md:col-span-1">
                    <Combobox
                      aria-label="Product"
                      size="sm"
                      value={line.sku}
                      onValueChange={(sku) => update(line.key, { sku })}
                      placeholder="Select product…"
                      options={products.map((p) => ({
                        value: p.sku,
                        label: p.name,
                        description: `${p.sku} · ${eur(p.price)} · ${p.stock} in stock`,
                      }))}
                    />
                  </div>
                  <Input
                    aria-label="Quantity"
                    size="sm"
                    type="number"
                    min={1}
                    numeric
                    value={line.quantity}
                    onChange={(e) => update(line.key, { quantity: Math.max(1, Number(e.target.value)) })}
                  />
                  <Input
                    aria-label="Discount"
                    size="sm"
                    type="number"
                    min={0}
                    max={100}
                    numeric
                    value={line.discount}
                    onChange={(e) => update(line.key, { discount: Math.min(100, Math.max(0, Number(e.target.value))) })}
                  />
                  <div className="text-right text-[13px] font-medium tabular-nums">{eur(lineTotal(line))}</div>
                  <IconButton
                    label="Remove line"
                    icon={<Trash2 />}
                    size="sm"
                    disabled={lines.length === 1}
                    onClick={() => setLines(lines.filter((l) => l.key !== line.key))}
                    className="justify-self-end"
                  />
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader title="Shipping" />
            <CardContent>
              <RadioGroup
                variant="cards"
                orientation="horizontal"
                value={shipping}
                onValueChange={setShipping}
                options={[
                  { value: 'ground', label: 'Ground', description: '5–7 days · €12' },
                  { value: 'express', label: 'Express', description: '2 days · €38' },
                  { value: 'freight', label: 'Freight', description: 'Pallets · €240' },
                ]}
              />
              <Field label="Delivery instructions" className="mt-4">
                <Textarea placeholder="Dock 4, deliveries 7am–3pm" autoResize />
              </Field>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="lg:sticky lg:top-20">
            <CardHeader title="Summary" />
            <CardContent className="space-y-2.5 text-[13px]">
              <div className="flex justify-between text-fg-muted">
                <span>Subtotal</span>
                <span className="tabular-nums">{eur(subtotal)}</span>
              </div>
              <div className="flex justify-between text-fg-muted">
                <span>Shipping</span>
                <span className="tabular-nums">{eur(shippingCost)}</span>
              </div>
              <div className="flex justify-between text-fg-muted">
                <span>VAT 20%</span>
                <span className="tabular-nums">{eur(tax)}</span>
              </div>
              <div className="flex justify-between border-t border-line pt-3 text-lg font-semibold tracking-[-0.01em]">
                <span>Total</span>
                <span className="tabular-nums">{eur(subtotal + shippingCost + tax)}</span>
              </div>
              <p className="pt-1 text-xs text-fg-muted">Orders over €10,000 require manager approval.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
