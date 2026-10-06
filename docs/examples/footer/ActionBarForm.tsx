import { useState } from 'react';
import { ActionBar, Button, Card, Field, Input, Select, useToast } from 'focus-ui';

const initial = { name: 'Northwind Traders', terms: 'net30', limit: '250000' };

export default function Example() {
  const { toast } = useToast();
  const [form, setForm] = useState(initial);
  const [saved, setSaved] = useState(initial);
  const [saving, setSaving] = useState(false);
  const dirty = JSON.stringify(form) !== JSON.stringify(saved);

  const save = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaved(form);
    setSaving(false);
    toast({ title: 'Customer updated', tone: 'success' });
  };

  return (
    <Card className="w-full max-w-lg overflow-hidden">
      <div className="max-h-80 overflow-y-auto">
        <div className="space-y-4 p-5">
          <p className="text-[13px] text-fg-muted">Edit any field — a sticky footer appears with save / discard.</p>
          <Field label="Customer name">
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </Field>
          <Field label="Payment terms">
            <Select
              value={form.terms}
              onChange={(e) => setForm({ ...form, terms: e.target.value })}
              options={[
                { value: 'net15', label: 'Net 15' },
                { value: 'net30', label: 'Net 30' },
                { value: 'net60', label: 'Net 60' },
              ]}
            />
          </Field>
          <Field label="Credit limit">
            <Input prefix="€" numeric value={form.limit} onChange={(e) => setForm({ ...form, limit: e.target.value })} />
          </Field>
        </div>
        <ActionBar
          variant="sticky"
          open={dirty}
          message="Unsaved changes"
          actions={
            <>
              <Button size="sm" onClick={() => setForm(saved)} disabled={saving}>
                Discard
              </Button>
              <Button size="sm" variant="primary" onClick={save} loading={saving}>
                Save
              </Button>
            </>
          }
        />
      </div>
    </Card>
  );
}
