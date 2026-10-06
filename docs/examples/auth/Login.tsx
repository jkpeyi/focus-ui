import { useState, type FormEvent } from 'react';
import { Alert, AuthDivider, AuthLayout, Button, Checkbox, Field, Input, PasswordInput } from 'focus-ui';
import { KeyRound } from 'lucide-react';
import { AcmeLogo } from './Logo';

/** Sign-in screen. Replace the fake request with your auth API. */
export default function LoginPage() {
  const [email, setEmail] = useState('ava@acme.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!password) return setError('Enter your password.');
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900)); // ← call your API here
    setLoading(false);
    window.location.hash = '/demo/verify'; // 2-step verification
  };

  return (
    <AuthLayout
      logo={<AcmeLogo />}
      title="Sign in to Acme ERP"
      description="Use your work account to continue."
      footer={
        <>
          © 2026 Acme Industries ·{' '}
          <a href="#" className="hover:text-fg">
            Privacy
          </a>{' '}
          ·{' '}
          <a href="#" className="hover:text-fg">
            Terms
          </a>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4" noValidate>
        {error && <Alert tone="danger">{error}</Alert>}
        <Field label="Work email">
          <Input type="email" autoComplete="username" size="lg" value={email} onChange={(e) => setEmail(e.target.value)} />
        </Field>
        <Field
          label="Password"
          labelAside={
            <a href="#" className="text-accent hover:underline">
              Forgot password?
            </a>
          }
        >
          <PasswordInput size="lg" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
        </Field>
        <Checkbox label="Keep me signed in on this device" defaultChecked />
        <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>
          Sign in
        </Button>
      </form>

      <AuthDivider>or</AuthDivider>

      <div className="grid gap-2">
        <Button size="lg" fullWidth leadingIcon={<KeyRound />}>
          Sign in with a passkey
        </Button>
        <Button size="lg" fullWidth leadingIcon={<MicrosoftMark />}>
          Continue with Microsoft
        </Button>
      </div>

      <p className="mt-8 text-center text-[13px] text-fg-muted">
        New to Acme?{' '}
        <a href="#/demo/register" className="font-medium text-accent hover:underline">
          Create an account
        </a>
      </p>
    </AuthLayout>
  );
}

function MicrosoftMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden>
      <path fill="#F25022" d="M2 2h9.5v9.5H2z" />
      <path fill="#7FBA00" d="M12.5 2H22v9.5h-9.5z" />
      <path fill="#00A4EF" d="M2 12.5h9.5V22H2z" />
      <path fill="#FFB900" d="M12.5 12.5H22V22h-9.5z" />
    </svg>
  );
}
