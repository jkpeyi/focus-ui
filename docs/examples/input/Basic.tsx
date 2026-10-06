import { Input } from 'focus-ui';
import { Mail } from 'lucide-react';

export default function Example() {
  return (
    <div className="grid w-full max-w-sm gap-3">
      <Input placeholder="Company name" />
      <Input type="email" placeholder="billing@company.com" prefix={<Mail />} />
      <Input placeholder="0.00" prefix="$" suffix="USD" numeric />
      <Input placeholder="Weight" suffix="kg" numeric size="sm" />
      <Input placeholder="Disabled" disabled />
    </div>
  );
}
