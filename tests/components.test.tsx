import { useState } from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  ActionBar,
  OtpInput,
  PasswordInput,
  getPasswordStrength,
  Button,
  Footer,
  Sidebar,
  SidebarItem,
  SidebarSection,
  Checkbox,
  Combobox,
  ConfirmDialog,
  DataTable,
  DropdownMenu,
  Field,
  Input,
  Modal,
  SegmentedControl,
  Switch,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  ToastProvider,
  cn,
  useToast,
  type DataTableColumn,
} from 'focus-ui';

describe('cn', () => {
  it('lets later Tailwind classes win', () => {
    expect(cn('px-2 bg-surface', 'px-4')).toBe('bg-surface px-4');
    expect(cn('shadow-card', 'shadow-modal')).toBe('shadow-modal');
  });
});

describe('Button', () => {
  it('defaults to type=button and disables while loading', () => {
    render(<Button loading>Save</Button>);
    const button = screen.getByRole('button', { name: /save/i });
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
  });
});

describe('Field', () => {
  it('links label, description and error to the control', () => {
    render(
      <Field label="VAT number" description="13 characters" error="Invalid VAT" required>
        <Input />
      </Field>,
    );
    const input = screen.getByLabelText(/vat number/i);
    expect(input).toBeRequired();
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('Invalid VAT');
  });
});

describe('Checkbox & Switch', () => {
  it('reports the checked value', async () => {
    const onChange = vi.fn();
    render(<Checkbox label="Send by email" onChange={onChange} />);
    await userEvent.click(screen.getByLabelText('Send by email'));
    expect(onChange).toHaveBeenCalledWith(true, expect.anything());
  });

  it('toggles a switch', async () => {
    render(<Switch label="Auto-reorder" />);
    const sw = screen.getByRole('switch', { name: 'Auto-reorder' });
    expect(sw).toHaveAttribute('aria-checked', 'false');
    await userEvent.click(sw);
    expect(sw).toHaveAttribute('aria-checked', 'true');
  });
});

describe('SegmentedControl', () => {
  it('supports arrow-key navigation', async () => {
    const onChange = vi.fn();
    render(
      <SegmentedControl
        aria-label="Period"
        defaultValue="day"
        onValueChange={onChange}
        options={[
          { value: 'day', label: 'Day' },
          { value: 'week', label: 'Week' },
        ]}
      />,
    );
    screen.getByRole('radio', { name: 'Day' }).focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(onChange).toHaveBeenCalledWith('week');
    expect(screen.getByRole('radio', { name: 'Week' })).toHaveAttribute('aria-checked', 'true');
  });
});

describe('Tabs', () => {
  it('shows the selected panel', async () => {
    render(
      <Tabs defaultValue="a">
        <TabList>
          <Tab value="a">Lines</Tab>
          <Tab value="b">Activity</Tab>
        </TabList>
        <TabPanel value="a">Lines panel</TabPanel>
        <TabPanel value="b">Activity panel</TabPanel>
      </Tabs>,
    );
    expect(screen.getByText('Lines panel')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('tab', { name: 'Activity' }));
    expect(screen.getByText('Activity panel')).toBeInTheDocument();
    expect(screen.queryByText('Lines panel')).not.toBeInTheDocument();
  });
});

describe('Modal', () => {
  function Harness() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open</Button>
        <Modal open={open} onClose={() => setOpen(false)} title="Adjust stock">
          <input aria-label="Quantity" />
        </Modal>
      </>
    );
  }

  it('opens as an accessible dialog and closes on Escape', async () => {
    render(<Harness />);
    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByRole('dialog', { name: 'Adjust stock' })).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    // Exit transition keeps it mounted briefly.
    await new Promise((r) => setTimeout(r, 250));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('ConfirmDialog awaits onConfirm before closing', async () => {
    const onConfirm = vi.fn(() => Promise.resolve());
    const onClose = vi.fn();
    render(<ConfirmDialog open onClose={onClose} onConfirm={onConfirm} title="Void invoice?" confirmLabel="Void" destructive />);
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Void' }));
    expect(onConfirm).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });
});

describe('DropdownMenu', () => {
  it('selects an item with the keyboard', async () => {
    const onEdit = vi.fn();
    render(
      <DropdownMenu
        trigger={<Button>Actions</Button>}
        items={[{ label: 'Edit', onSelect: onEdit }, { type: 'separator' }, { label: 'Delete', tone: 'danger' }]}
      />,
    );
    screen.getByRole('button', { name: 'Actions' }).focus();
    await userEvent.keyboard('{ArrowDown}');
    expect(screen.getByRole('menu')).toBeInTheDocument();
    await new Promise((r) => requestAnimationFrame(() => r(null)));
    await userEvent.keyboard('{Enter}');
    expect(onEdit).toHaveBeenCalled();
  });
});

describe('Combobox', () => {
  it('filters and selects options', async () => {
    const onChange = vi.fn();
    render(
      <Combobox
        aria-label="Customer"
        onValueChange={onChange}
        options={[
          { value: 'c1', label: 'Northwind Traders' },
          { value: 'c2', label: 'Contoso Pharmaceuticals' },
        ]}
      />,
    );
    const input = screen.getByRole('combobox', { name: 'Customer' });
    await userEvent.click(input);
    await userEvent.type(input, 'conto');
    const list = screen.getByRole('listbox');
    expect(within(list).getAllByRole('option')).toHaveLength(1);
    await userEvent.keyboard('{Enter}');
    expect(onChange).toHaveBeenCalledWith('c2');
  });
});

describe('DataTable', () => {
  interface Row {
    id: number;
    name: string;
    amount: number;
  }
  const data: Row[] = [
    { id: 1, name: 'Bravo', amount: 30 },
    { id: 2, name: 'Alpha', amount: 10 },
    { id: 3, name: 'Charlie', amount: 20 },
  ];
  const columns: DataTableColumn<Row>[] = [
    { id: 'name', header: 'Name', sortable: true },
    { id: 'amount', header: 'Amount', align: 'right', sortable: true, footer: (rows) => rows.reduce((s, r) => s + r.amount, 0) },
  ];
  const names = () =>
    screen
      .getAllByRole('row')
      .slice(1, 4)
      .map((r) => within(r).getAllByRole('cell')[0].textContent);

  it('sorts when clicking a sortable header', async () => {
    render(<DataTable columns={columns} data={data} rowKey="id" />);
    await userEvent.click(screen.getByRole('button', { name: 'Name' }));
    expect(names()).toEqual(['Alpha', 'Bravo', 'Charlie']);
    await userEvent.click(screen.getByRole('button', { name: 'Name' }));
    expect(names()).toEqual(['Charlie', 'Bravo', 'Alpha']);
  });

  it('renders footer totals', () => {
    render(<DataTable columns={columns} data={data} rowKey="id" />);
    expect(screen.getByText('60')).toBeInTheDocument();
  });

  it('selects all rows and shows bulk actions', async () => {
    const onSelection = vi.fn();
    render(
      <DataTable
        columns={columns}
        data={data}
        rowKey="id"
        selectable
        onSelectionChange={onSelection}
        bulkActions={(rows) => <Button>Archive {rows.length}</Button>}
      />,
    );
    await userEvent.click(screen.getByLabelText('Select all rows on this page'));
    expect(onSelection).toHaveBeenLastCalledWith([1, 2, 3]);
    expect(screen.getByRole('button', { name: 'Archive 3' })).toBeInTheDocument();
  });

  it('shows an empty state', () => {
    render(<DataTable columns={columns} data={[]} rowKey="id" />);
    expect(screen.getByText('No records')).toBeInTheDocument();
  });
});

describe('Toast', () => {
  function Fire() {
    const { toast } = useToast();
    return <Button onClick={() => toast({ title: 'Invoice sent', tone: 'success' })}>Send</Button>;
  }
  it('shows a toast', async () => {
    render(
      <ToastProvider>
        <Fire />
      </ToastProvider>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Send' }));
    expect(screen.getByText('Invoice sent')).toBeInTheDocument();
  });
});

describe('Sidebar', () => {
  it('works standalone and marks the active item', () => {
    render(
      <Sidebar>
        <SidebarSection title="Sales">
          <SidebarItem label="Orders" href="#orders" active badge={3} />
          <SidebarItem label="Customers" href="#customers" />
        </SidebarSection>
      </Sidebar>,
    );
    expect(screen.getByRole('navigation', { name: 'Main' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /orders/i })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Customers' })).not.toHaveAttribute('aria-current');
  });

  it('expands nested items and auto-opens the active branch', async () => {
    render(
      <Sidebar>
        <SidebarSection>
          <SidebarItem label="Invoicing">
            <SidebarItem label="Invoices" href="#inv" />
          </SidebarItem>
          <SidebarItem label="Purchasing">
            <SidebarItem label="Suppliers" href="#sup" active />
          </SidebarItem>
        </SidebarSection>
      </Sidebar>,
    );
    expect(screen.getByRole('link', { name: 'Suppliers' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Invoices' })).not.toBeInTheDocument();
    const toggle = screen.getByRole('button', { name: 'Invoicing' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(toggle);
    expect(screen.getByRole('link', { name: 'Invoices' })).toBeInTheDocument();
  });

  it('hides labels when collapsed', () => {
    render(
      <Sidebar collapsed>
        <SidebarSection title="Sales">
          <SidebarItem label="Orders" href="#orders" icon={<svg />} />
        </SidebarSection>
      </Sidebar>,
    );
    expect(screen.queryByText('Sales')).not.toBeInTheDocument();
    expect(screen.queryByText('Orders')).not.toBeInTheDocument();
  });
});

describe('Footer & ActionBar', () => {
  it('renders link columns and inline links', () => {
    render(
      <Footer
        brand="Acme"
        columns={[{ title: 'Portal', links: [{ label: 'Invoices', href: '/invoices' }] }]}
        links={[{ label: 'Privacy', href: '/privacy', external: true }]}
        copyright="© 2026 Acme"
      />,
    );
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Invoices' })).toHaveAttribute('href', '/invoices');
    expect(screen.getByRole('link', { name: 'Privacy' })).toHaveAttribute('target', '_blank');
    expect(screen.getByText('© 2026 Acme')).toBeInTheDocument();
  });

  it('shows the action bar only when open', () => {
    const { rerender } = render(<ActionBar variant="sticky" open={false} message="Unsaved changes" />);
    expect(screen.queryByText('Unsaved changes')).not.toBeInTheDocument();
    rerender(<ActionBar variant="sticky" open message="Unsaved changes" actions={<Button>Save</Button>} />);
    expect(screen.getByRole('region', { name: 'Actions' })).toHaveTextContent('Unsaved changes');
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });
});

describe('OtpInput', () => {
  it('auto-advances and calls onComplete', async () => {
    const onComplete = vi.fn();
    render(<OtpInput length={4} onComplete={onComplete} />);
    const boxes = screen.getAllByRole('textbox');
    await userEvent.click(boxes[0]);
    await userEvent.keyboard('12a34');
    expect(boxes.map((b) => (b as HTMLInputElement).value)).toEqual(['1', '2', '3', '4']);
    expect(onComplete).toHaveBeenCalledWith('1234');
  });

  it('accepts a pasted code and moves back on backspace', async () => {
    const onChange = vi.fn();
    render(<OtpInput length={6} onValueChange={onChange} />);
    const boxes = screen.getAllByRole('textbox');
    await userEvent.click(boxes[0]);
    await userEvent.paste('987 654');
    expect(onChange).toHaveBeenLastCalledWith('987654');
    await userEvent.click(boxes[5]);
    await userEvent.keyboard('{Backspace}{Backspace}');
    expect(onChange).toHaveBeenLastCalledWith('9876');
    expect(boxes[4]).toHaveFocus();
  });
});

describe('PasswordInput', () => {
  it('toggles visibility', async () => {
    render(<PasswordInput aria-label="Password" defaultValue="secret" />);
    const input = screen.getByLabelText('Password');
    expect(input).toHaveAttribute('type', 'password');
    await userEvent.click(screen.getByRole('button', { name: 'Show password' }));
    expect(input).toHaveAttribute('type', 'text');
  });

  it('scores password strength', () => {
    expect(getPasswordStrength('').score).toBe(0);
    expect(getPasswordStrength('abc').label).toBe('Weak');
    expect(getPasswordStrength('Acme-2026-Ledger!').label).toBe('Strong');
  });
});

describe('OtpInput focus recovery', () => {
  it('refocuses after being re-enabled', () => {
    const { rerender } = render(<OtpInput length={4} autoFocus disabled value="" onValueChange={() => {}} />);
    rerender(<OtpInput length={4} autoFocus value="" onValueChange={() => {}} />);
    expect(screen.getAllByRole('textbox')[0]).toHaveFocus();
  });
});
