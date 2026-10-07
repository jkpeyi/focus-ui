import { useState, type FormEvent } from 'react';
import { AuthLayout, Avatar, Button, Checkbox, Field, Input, PasswordInput, Select, getPasswordStrength } from '@jkpeyi/focus-ui';
import { BarChart3, Boxes, ShieldCheck } from 'lucide-react';
import { AcmeLogo } from './Logo';

/** Registration screen — split layout with a branded side panel. */
export default function RegisterPage() {
  const [form, setForm] = useState({ company: '', name: '', email: '', password: '', country: 'NL', terms: false });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const set = (key: keyof typeof form) => (value: string | boolean) => setForm({ ...form, [key]: value });

  const errors = {
    company: !form.company && 'Company name is required.',
    name: !form.name && 'Your name is required.',
    email: !/^\S+@\S+\.\S+$/.test(form.email) && 'Enter a valid work email.',
    password:
      getPasswordStrength(form.password).score < 3 &&
      'Choose a stronger password — at least 8 characters mixing upper- and lowercase, numbers and symbols.',
    terms: !form.terms && 'Please accept the terms to continue.',
  };
  const show = (key: keyof typeof errors) => (submitted && errors[key]) || undefined;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (Object.values(errors).some(Boolean)) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900)); // ← call your API here
    setLoading(false);
    window.location.hash = '/demo/verify';
  };

  return (
    <AuthLayout
      variant="split"
      width="md"
      topbar={<AcmeLogo size={36} />}
      title="Create your workspace"
      description="Start a 30-day trial. No credit card required."
      footer="© 2026 Acme Industries · Privacy · Terms"
      aside={<BrandPanel />}
    >
      <form onSubmit={submit} className="space-y-4" noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Company" error={show('company')} required>
            <Input autoComplete="organization" value={form.company} onChange={(e) => set('company')(e.target.value)} />
          </Field>
          <Field label="Country">
            <Select
              value={form.country}
              onChange={(e) => set('country')(e.target.value)}
              options={[
                { value: 'NL', label: 'Netherlands' },
                { value: 'FR', label: 'France' },
                { value: 'DE', label: 'Germany' },
                { value: 'US', label: 'United States' },
              ]}
            />
          </Field>
        </div>
        <Field label="Full name" error={show('name')} required>
          <Input autoComplete="name" value={form.name} onChange={(e) => set('name')(e.target.value)} />
        </Field>
        <Field label="Work email" error={show('email')} required description="We'll send a verification code to this address.">
          <Input type="email" autoComplete="email" value={form.email} onChange={(e) => set('email')(e.target.value)} />
        </Field>
        <Field label="Password" error={show('password')} required>
          <PasswordInput showStrength value={form.password} onChange={(e) => set('password')(e.target.value)} />
        </Field>
        <Field error={show('terms')}>
          <Checkbox
            checked={form.terms}
            onChange={(checked) => set('terms')(checked)}
            label={
              <>
                I agree to the{' '}
                <a href="#" className="text-accent hover:underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-accent hover:underline">
                  Data Processing Agreement
                </a>
                .
              </>
            }
          />
        </Field>
        <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>
          Create account
        </Button>
        <p className="text-center text-[13px] text-fg-muted">
          Already have an account?{' '}
          <a href="#/demo/login" className="font-medium text-accent hover:underline">
            Sign in
          </a>
        </p>
      </form>
    </AuthLayout>
  );
}

function BrandPanel() {
  const highlights = [
    { icon: <Boxes />, title: 'Inventory in real time', text: 'Every warehouse, every SKU, always in sync.' },
    { icon: <BarChart3 />, title: 'Close the books faster', text: 'Automated reconciliation and period close.' },
    { icon: <ShieldCheck />, title: 'Enterprise-grade security', text: 'SSO, 2FA, audit trails and EU data residency.' },
  ];
  return (
    <div className="flex h-full flex-col justify-between bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 p-10 text-white">
      <div className="text-sm font-medium text-white/70">Acme ERP</div>
      <div className="space-y-6">
        {highlights.map((h) => (
          <div key={h.title} className="flex gap-4">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/15 backdrop-blur [&_svg]:size-5">
              {h.icon}
            </span>
            <div>
              <div className="font-semibold">{h.title}</div>
              <div className="text-sm text-white/75">{h.text}</div>
            </div>
          </div>
        ))}
      </div>
      <figure className="rounded-2xl bg-white/12 p-5 backdrop-blur-md">
        <blockquote className="text-[15px] leading-relaxed">
          “We replaced three legacy systems in a quarter. Month-end close went from nine days to two.”
        </blockquote>
        <figcaption className="mt-4 flex items-center gap-3 text-sm">
          <Avatar name="Sofia Rossi" size="sm" />
          <span>
            <span className="block font-semibold">Sofia Rossi</span>
            <span className="text-white/70">CFO, Fabrikam Industries</span>
          </span>
        </figcaption>
      </figure>
    </div>
  );
}
