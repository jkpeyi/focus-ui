import { useEffect, useState } from 'react';
import { Alert, AuthLayout, Button, OtpInput } from '@jkpeyi/focus-ui';
import { ArrowLeft, MailCheck } from 'lucide-react';

const DEMO_CODE = '123456';

/** Two-step verification (OTP) screen with resend countdown. Demo code: 123456. */
export default function VerifyPage() {
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<'idle' | 'checking' | 'error' | 'success'>('idle');
  const [cooldown, setCooldown] = useState(30);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown(cooldown - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const verify = async (value = code) => {
    setStatus('checking');
    await new Promise((r) => setTimeout(r, 700)); // ← call your API here
    if (value === DEMO_CODE) {
      setStatus('success');
      setTimeout(() => (window.location.hash = '/demo'), 600);
    } else {
      setStatus('error');
      setCode('');
    }
  };

  return (
    <AuthLayout
      topbar={
        <a href="#/demo/login" className="inline-flex items-center gap-1.5 text-[13px] text-fg-muted hover:text-fg">
          <ArrowLeft className="size-4" /> Back to sign in
        </a>
      }
      logo={
        <span className="flex size-14 items-center justify-center rounded-2xl bg-accent/10 text-accent">
          <MailCheck className="size-7" />
        </span>
      }
      title="Check your email"
      description={
        <>
          Enter the 6-digit code we sent to <span className="font-medium text-fg">ava@acme.com</span>.
        </>
      }
      footer="Codes expire after 10 minutes. Demo code: 123456"
    >
      <div className="space-y-5">
        {status === 'error' && <Alert tone="danger">That code didn’t match. Check the latest email and try again.</Alert>}
        {status === 'success' && <Alert tone="success">Verified — signing you in…</Alert>}
        <div className="flex justify-center">
          <OtpInput
            autoFocus
            groupSize={3}
            value={code}
            onValueChange={(v) => {
              setCode(v);
              if (status === 'error') setStatus('idle');
            }}
            onComplete={verify}
            invalid={status === 'error'}
            disabled={status === 'checking' || status === 'success'}
          />
        </div>
        <Button
          variant="primary"
          size="lg"
          fullWidth
          loading={status === 'checking'}
          disabled={code.length < 6 || status === 'success'}
          onClick={() => verify()}
        >
          Verify
        </Button>
        <p className="text-center text-[13px] text-fg-muted">
          Didn’t get it?{' '}
          {cooldown > 0 ? (
            <span className="tabular-nums">Resend in {cooldown}s</span>
          ) : (
            <button type="button" className="font-medium text-accent hover:underline" onClick={() => setCooldown(30)}>
              Resend code
            </button>
          )}
        </p>
      </div>
    </AuthLayout>
  );
}
