import { useState } from 'react';
import { Button, Sidebar, SidebarItem, SidebarProfile, SidebarSection } from '@jkpeyi/focus-ui';
import { Boxes, Gauge, PanelLeftClose, PanelLeftOpen, Receipt, Settings, ShoppingCart, Users } from 'lucide-react';

export default function Example() {
  const [collapsed, setCollapsed] = useState(true);
  return (
    <div className="flex flex-col items-center gap-4">
      <Button size="sm" leadingIcon={collapsed ? <PanelLeftOpen /> : <PanelLeftClose />} onClick={() => setCollapsed(!collapsed)}>
        {collapsed ? 'Expand' : 'Collapse'}
      </Button>
      <div className="h-[440px] overflow-hidden rounded-xl border border-line">
        <Sidebar collapsed={collapsed} footer={<SidebarProfile name="Ava Thompson" description="Admin" />}>
          <SidebarSection title="Main">
            <SidebarItem icon={<Gauge />} label="Dashboard" />
            <SidebarItem icon={<ShoppingCart />} label="Orders" badge={12} active />
            <SidebarItem icon={<Users />} label="Customers" />
          </SidebarSection>
          <SidebarSection title="More">
            {/* Collapsed parents open their children in a flyout */}
            <SidebarItem icon={<Receipt />} label="Invoicing">
              <SidebarItem label="Invoices" />
              <SidebarItem label="Credit notes" />
            </SidebarItem>
            <SidebarItem icon={<Boxes />} label="Inventory" />
            <SidebarItem icon={<Settings />} label="Settings" />
          </SidebarSection>
        </Sidebar>
      </div>
      <p className="text-[13px] text-fg-muted">Hover icons for tooltips · click “Invoicing” for its flyout.</p>
    </div>
  );
}
