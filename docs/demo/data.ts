// Deterministic sample data for the docs and the demo ERP app.

export type OrderStatus = 'draft' | 'pending' | 'approved' | 'shipped' | 'delivered' | 'cancelled';

export interface Customer {
  id: string;
  name: string;
  contact: string;
  email: string;
  city: string;
  country: string;
  segment: 'Enterprise' | 'Mid-market' | 'SMB';
  creditLimit: number;
  balance: number;
}

export interface OrderLine {
  sku: string;
  product: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  number: string;
  customer: Customer;
  date: string;
  dueDate: string;
  status: OrderStatus;
  total: number;
  items: number;
  owner: string;
  warehouse: string;
  lines: OrderLine[];
}

export interface Product {
  sku: string;
  name: string;
  category: string;
  stock: number;
  reorderPoint: number;
  unitCost: number;
  price: number;
  warehouse: string;
}

export const statusMeta: Record<
  OrderStatus,
  { label: string; tone: 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info' }
> = {
  draft: { label: 'Draft', tone: 'neutral' },
  pending: { label: 'Pending approval', tone: 'warning' },
  approved: { label: 'Approved', tone: 'accent' },
  shipped: { label: 'Shipped', tone: 'info' },
  delivered: { label: 'Delivered', tone: 'success' },
  cancelled: { label: 'Cancelled', tone: 'danger' },
};

// Small seeded PRNG so data is stable between renders and builds.
function rng(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}
const rand = rng(42);
const pick = <T>(arr: readonly T[]) => arr[Math.floor(rand() * arr.length)];

export const customers: Customer[] = [
  ['Northwind Traders', 'Ava Thompson', 'Seattle', 'USA', 'Enterprise'],
  ['Contoso Pharmaceuticals', 'Liam Chen', 'Boston', 'USA', 'Enterprise'],
  ['Fabrikam Industries', 'Sofia Rossi', 'Milan', 'Italy', 'Mid-market'],
  ['Tailspin Toys', 'Noah Müller', 'Berlin', 'Germany', 'SMB'],
  ['Wide World Importers', 'Emma Laurent', 'Lyon', 'France', 'Mid-market'],
  ['Adventure Works', 'Lucas Silva', 'São Paulo', 'Brazil', 'Enterprise'],
  ['Proseware, Inc.', 'Mia Johansson', 'Stockholm', 'Sweden', 'SMB'],
  ['Litware Systems', 'Ethan Patel', 'London', 'UK', 'Mid-market'],
  ['Alpine Ski House', 'Chloé Dubois', 'Geneva', 'Switzerland', 'SMB'],
  ['Coho Vineyard', 'Kenji Watanabe', 'Osaka', 'Japan', 'Mid-market'],
  ['Blue Yonder Airlines', 'Olivia Brown', 'Toronto', 'Canada', 'Enterprise'],
  ['Woodgrove Bank', 'Amara Okafor', 'Lagos', 'Nigeria', 'Enterprise'],
].map(([name, contact, city, country, segment], i) => ({
  id: `C-${1001 + i}`,
  name,
  contact,
  email: `${contact.split(' ')[0].toLowerCase()}@${name.split(/[ ,]/)[0].toLowerCase()}.com`,
  city,
  country,
  segment: segment as Customer['segment'],
  creditLimit: [50000, 100000, 250000][i % 3],
  balance: Math.round(rand() * 40000),
}));

export const products: Product[] = [
  ['Aluminium Housing A2', 'Components'],
  ['Precision Bearing 608ZZ', 'Components'],
  ['Industrial Sensor S9', 'Electronics'],
  ['Control Board v4', 'Electronics'],
  ['Hydraulic Pump HX-200', 'Machinery'],
  ['Servo Motor 750W', 'Machinery'],
  ['Safety Gloves (Box 50)', 'Consumables'],
  ['Thermal Paste 20g', 'Consumables'],
  ['Steel Fastener Kit', 'Components'],
  ['LCD Panel 7"', 'Electronics'],
  ['Conveyor Belt 2m', 'Machinery'],
  ['Cleaning Solvent 5L', 'Consumables'],
].map(([name, category], i) => {
  const cost = Math.round((5 + rand() * 600) * 100) / 100;
  return {
    sku: `SKU-${(2400 + i * 7).toString()}`,
    name,
    category,
    stock: Math.round(rand() * 900),
    reorderPoint: 120,
    unitCost: cost,
    price: Math.round(cost * (1.35 + rand() * 0.4) * 100) / 100,
    warehouse: pick(['Seattle DC', 'Rotterdam', 'Singapore']),
  };
});

const owners = ['Ava Thompson', 'Daniel Kim', 'Grace Lee', 'Marco Bianchi', 'Priya Nair'];
const statuses: OrderStatus[] = [
  'draft',
  'pending',
  'pending',
  'approved',
  'approved',
  'shipped',
  'shipped',
  'delivered',
  'delivered',
  'delivered',
  'cancelled',
];

export const orders: Order[] = Array.from({ length: 64 }, (_, i) => {
  const customer = pick(customers);
  const day = new Date(Date.UTC(2026, 8, 30) - i * 86400000 * (0.6 + rand()));
  const lineCount = 1 + Math.floor(rand() * 4);
  const lines: OrderLine[] = Array.from({ length: lineCount }, () => {
    const p = pick(products);
    return { sku: p.sku, product: p.name, quantity: 1 + Math.floor(rand() * 40), unitPrice: p.price };
  });
  const total = Math.round(lines.reduce((s, l) => s + l.quantity * l.unitPrice, 0) * 100) / 100;
  return {
    id: `o${i}`,
    number: `SO-${(24180 - i).toString()}`,
    customer,
    date: day.toISOString(),
    dueDate: new Date(day.getTime() + 30 * 86400000).toISOString(),
    status: pick(statuses),
    total,
    items: lines.reduce((s, l) => s + l.quantity, 0),
    owner: pick(owners),
    warehouse: pick(['Seattle DC', 'Rotterdam', 'Singapore']),
    lines,
  };
});

export const revenueByMonth = [182, 196, 175, 210, 228, 241, 236, 259, 274, 268, 291, 312];
export const months = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
