import {
  AppShell,
  Avatar,
  Badge,
  Footer,
  SidebarProfile,
  DropdownMenu,
  IconButton,
  SearchField,
  Sidebar,
  SidebarItem,
  SidebarSection,
  Topbar,
  useTheme,
} from 'focus-ui';
import {
  ArrowLeft,
  Bell,
  Boxes,
  ChevronsUpDown,
  FileText,
  Gauge,
  HelpCircle,
  LogOut,
  Moon,
  Receipt,
  Settings,
  ShoppingCart,
  Sun,
  Truck,
  Users,
} from 'lucide-react';
import { orders } from './data';
import { Dashboard } from './pages/Dashboard';
import { Orders } from './pages/Orders';
import { OrderDetail } from './pages/OrderDetail';
import { NewOrder } from './pages/NewOrder';
import { Inventory } from './pages/Inventory';
import { Customers } from './pages/Customers';
import { SettingsPage } from './pages/Settings';

function Workspace() {
  return (
    <DropdownMenu
      placement="bottom-start"
      trigger={
        <button className="focus-ring flex w-full items-center gap-2.5 rounded-lg p-1 text-left hover:bg-fill/10">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-[9px] bg-gradient-to-br from-indigo-500 to-violet-600 text-xs font-bold text-white shadow-raised">
            A
          </span>
          <span className="min-w-0 flex-1 group-data-[collapsed=true]/sidebar:hidden">
            <span className="block truncate text-[13px] font-semibold">Acme Industries</span>
            <span className="block truncate text-[11px] text-fg-muted">Production · EUR</span>
          </span>
          <ChevronsUpDown className="size-3.5 text-fg-subtle group-data-[collapsed=true]/sidebar:hidden" />
        </button>
      }
      items={[
        { type: 'label', label: 'Companies' },
        { label: 'Acme Industries', checked: true },
        { label: 'Acme GmbH', checked: false },
        { label: 'Acme Asia Pte. Ltd.', checked: false },
      ]}
    />
  );
}

export default function ErpApp({ route }: { route: string }) {
  const { resolved, setMode } = useTheme();
  const [section, id] = route.split('/');
  const page = section || 'dashboard';
  const pending = orders.filter((o) => o.status === 'pending').length;

  let content;
  if (page === 'orders' && id === 'new') content = <NewOrder />;
  else if (page === 'orders' && id) content = <OrderDetail id={id} />;
  else if (page === 'orders') content = <Orders />;
  else if (page === 'inventory') content = <Inventory />;
  else if (page === 'customers') content = <Customers />;
  else if (page === 'settings') content = <SettingsPage />;
  else content = <Dashboard />;

  const item = (key: string, label: string, icon: React.ReactNode, badge?: number) => (
    <SidebarItem icon={icon} label={label} href={`#/demo/${key}`} active={page === key} badge={badge} />
  );

  return (
    <AppShell
      sidebar={
        <Sidebar
          header={<Workspace />}
          footer={
            <>
              <ul className="mb-2">
                <SidebarItem icon={<ArrowLeft />} label="Back to docs" href="#/introduction" />
              </ul>
              <DropdownMenu
                placement="top-start"
                trigger={<SidebarProfile name="Ava Thompson" description="Sales manager" status="online" />}
                items={[
                  { label: 'Settings', icon: <Settings />, onSelect: () => (window.location.hash = '/demo/settings') },
                  { label: 'Help & support', icon: <HelpCircle /> },
                  { type: 'separator' },
                  { label: 'Sign out', icon: <LogOut />, tone: 'danger' },
                ]}
              />
            </>
          }
        >
          <SidebarSection>{item('dashboard', 'Dashboard', <Gauge />)}</SidebarSection>
          <SidebarSection title="Sales">
            {item('orders', 'Orders', <ShoppingCart />, pending)}
            {item('customers', 'Customers', <Users />)}
            <SidebarItem icon={<Receipt />} label="Invoicing">
              <SidebarItem label="Invoices" href="#/demo/orders" />
              <SidebarItem label="Credit notes" href="#/demo/orders" />
              <SidebarItem label="Payments" href="#/demo/orders" badge={3} />
            </SidebarItem>
          </SidebarSection>
          <SidebarSection title="Operations">
            {item('inventory', 'Inventory', <Boxes />)}
            <SidebarItem icon={<Truck />} label="Shipments" href="#/demo/inventory" />
            <SidebarItem icon={<FileText />} label="Purchase orders" href="#/demo/inventory" />
          </SidebarSection>
          <SidebarSection title="Company">{item('settings', 'Settings', <Settings />)}</SidebarSection>
        </Sidebar>
      }
      topbar={
        <Topbar
          start={<SearchField size="sm" placeholder="Search orders, customers, SKUs…" shortcut="k" className="max-w-80" />}
          end={
            <>
              <IconButton
                label={resolved === 'dark' ? 'Light mode' : 'Dark mode'}
                icon={resolved === 'dark' ? <Sun /> : <Moon />}
                onClick={() => setMode(resolved === 'dark' ? 'light' : 'dark')}
              />
              <span className="relative">
                <IconButton label="Notifications" icon={<Bell />} />
                <span className="pointer-events-none absolute top-1.5 right-1.5 size-2 rounded-full bg-danger ring-2 ring-surface" />
              </span>
              <DropdownMenu
                trigger={
                  <button className="focus-ring ml-1 rounded-full" aria-label="Account">
                    <Avatar name="Ava Thompson" size="sm" status="online" />
                  </button>
                }
                items={[
                  { type: 'label', label: 'ava@acme.com' },
                  { label: 'Settings', icon: <Settings />, onSelect: () => (window.location.hash = '/demo/settings') },
                  { label: 'Help & support', icon: <HelpCircle /> },
                  { type: 'separator' },
                  { label: 'Sign out', icon: <LogOut />, tone: 'danger' },
                ]}
              />
            </>
          }
        />
      }
      footer={
        <Footer
          variant="bar"
          containerClassName="max-w-7xl lg:px-8"
          brand="Acme ERP"
          copyright="v4.12.0"
          links={[
            { label: 'Docs', href: '#/introduction' },
            { label: 'Support', href: '#/demo/settings' },
          ]}
          meta={
            <>
              <Badge size="sm" tone="warning">
                Demo data
              </Badge>
              <span className="inline-flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-success" /> Synced 2 min ago
              </span>
              <span className="max-sm:hidden">EUR · Europe/Amsterdam</span>
            </>
          }
        />
      }
    >
      <div key={route} className="mx-auto w-full max-w-7xl animate-fx-fade-in px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {content}
      </div>
    </AppShell>
  );
}
