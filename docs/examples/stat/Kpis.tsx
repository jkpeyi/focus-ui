import { StatCard, formatCurrency } from '@jkpeyi/focus-ui';
import { Clock, DollarSign, Package, ShoppingCart } from 'lucide-react';

export default function Example() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Revenue (MTD)"
        value={formatCurrency(312480, 'USD', undefined, { maximumFractionDigits: 0 })}
        delta={0.072}
        deltaLabel="vs last month"
        icon={<DollarSign />}
        trend={[182, 196, 175, 210, 228, 241, 236, 259, 274, 268, 291, 312]}
      />
      <StatCard
        label="Open orders"
        value="1,284"
        delta={0.031}
        deltaLabel="vs last week"
        icon={<ShoppingCart />}
        trend={[30, 34, 29, 41, 38, 44, 47]}
      />
      <StatCard
        label="Days sales outstanding"
        value="38.2"
        delta={0.054}
        invertDelta
        deltaLabel="vs Q2"
        icon={<Clock />}
        trend={[33, 34, 35, 34, 36, 37, 38]}
      />
      <StatCard
        label="Stock turns"
        value="6.4×"
        delta={-0.012}
        deltaLabel="vs last year"
        icon={<Package />}
        footer="Target: 7.0×"
      />
    </div>
  );
}
