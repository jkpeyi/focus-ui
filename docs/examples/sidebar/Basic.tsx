import { useState } from 'react';
import { DropdownMenu, IconButton, Sidebar, SidebarItem, SidebarProfile, SidebarSection } from 'focus-ui';
import {
  BarChart3,
  Boxes,
  FileText,
  Gauge,
  LogOut,
  Plus,
  Receipt,
  Settings,
  ShoppingCart,
  Truck,
  Users,
  Wallet,
} from 'lucide-react';

export default function Example() {
  const [page, setPage] = useState('orders');
  // Each item calls setPage — with a router you'd pass href / `as={Link} to=…` instead.
  const nav = (id: string) => ({ active: page === id, onClick: () => setPage(id) });

  return (
    <div className="h-[560px] overflow-hidden rounded-xl border border-line">
      <Sidebar
        header={
          <div className="flex items-center gap-2.5 px-1">
            <span className="flex size-7 items-center justify-center rounded-[9px] bg-gradient-to-br from-indigo-500 to-violet-600 text-xs font-bold text-white">
              A
            </span>
            <span className="text-[13px] font-semibold">Acme Industries</span>
          </div>
        }
        footer={
          <DropdownMenu
            placement="top-start"
            trigger={<SidebarProfile name="Ava Thompson" description="ava@acme.com" status="online" />}
            items={[
              { label: 'Settings', icon: <Settings /> },
              { type: 'separator' },
              { label: 'Sign out', icon: <LogOut />, tone: 'danger' },
            ]}
          />
        }
      >
        <SidebarSection>
          <SidebarItem icon={<Gauge />} label="Dashboard" {...nav('dashboard')} />
        </SidebarSection>
        <SidebarSection title="Sales" action={<IconButton label="New order" icon={<Plus />} size="xs" />}>
          <SidebarItem icon={<ShoppingCart />} label="Orders" badge={12} {...nav('orders')} />
          <SidebarItem icon={<Users />} label="Customers" {...nav('customers')} />
          <SidebarItem icon={<Receipt />} label="Invoicing">
            <SidebarItem label="Invoices" {...nav('invoices')} />
            <SidebarItem label="Credit notes" {...nav('credit-notes')} />
            <SidebarItem label="Payments" badge={3} {...nav('payments')} />
          </SidebarItem>
        </SidebarSection>
        <SidebarSection title="Operations" collapsible>
          <SidebarItem icon={<Boxes />} label="Inventory" {...nav('inventory')} />
          <SidebarItem icon={<Truck />} label="Purchasing">
            <SidebarItem label="Purchase orders" {...nav('po')} />
            <SidebarItem label="Suppliers" {...nav('suppliers')} />
          </SidebarItem>
        </SidebarSection>
        <SidebarSection title="Finance" collapsible>
          <SidebarItem icon={<Wallet />} label="General ledger" {...nav('gl')} />
          <SidebarItem icon={<BarChart3 />} label="Reports" {...nav('reports')} />
          <SidebarItem icon={<FileText />} label="Audit log" disabled />
        </SidebarSection>
      </Sidebar>
    </div>
  );
}
