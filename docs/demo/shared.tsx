import { Badge } from 'focus-ui';
import { statusMeta, type OrderStatus } from './data';

export function StatusBadge({ status }: { status: OrderStatus }) {
  const meta = statusMeta[status];
  return (
    <Badge tone={meta.tone} dot>
      {meta.label}
    </Badge>
  );
}

export const go = (path: string) => {
  window.location.hash = `/demo/${path}`;
};

export const eur = (v: number, digits = 2) =>
  new Intl.NumberFormat('en-IE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(v);
