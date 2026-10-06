import { useState } from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Button,
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
