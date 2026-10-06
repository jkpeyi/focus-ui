import { useState } from 'react';
import { Avatar, Badge, Button, Card, DataTable, PageHeader, Progress, SearchField, SegmentedControl } from 'focus-ui';
import { LayoutGrid, List, Mail, Plus } from 'lucide-react';
import { customers } from '../data';
import { eur } from '../shared';

const segmentTone = { Enterprise: 'accent', 'Mid-market': 'info', SMB: 'neutral' } as const;

export function Customers() {
  const [view, setView] = useState('grid');
  const [q, setQ] = useState('');
  const rows = customers.filter((c) => `${c.name} ${c.city} ${c.contact}`.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customers"
        description={`${customers.length} active accounts`}
        actions={
          <Button variant="primary" leadingIcon={<Plus />}>
            New customer
          </Button>
        }
      />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchField value={q} onValueChange={setQ} placeholder="Search customers" className="sm:max-w-72" />
        <SegmentedControl
          size="sm"
          aria-label="View"
          value={view}
          onValueChange={setView}
          options={[
            { value: 'grid', label: 'Cards', icon: <LayoutGrid /> },
            { value: 'list', label: 'List', icon: <List /> },
          ]}
        />
      </div>
      {view === 'grid' ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {rows.map((c) => {
            const usage = c.balance / c.creditLimit;
            return (
              <Card key={c.id} padding="md" interactive>
                <div className="flex items-start gap-3">
                  <Avatar name={c.name} shape="rounded" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-semibold">{c.name}</div>
                    <div className="text-[13px] text-fg-muted">
                      {c.city}, {c.country}
                    </div>
                  </div>
                  <Badge tone={segmentTone[c.segment]} size="sm">
                    {c.segment}
                  </Badge>
                </div>
                <div className="mt-4 flex items-center gap-2 text-[13px] text-fg-muted">
                  <Avatar name={c.contact} size="xs" />
                  {c.contact}
                  <Mail className="ml-auto size-4" />
                </div>
                <Progress
                  className="mt-4"
                  label={
                    <span className="text-xs text-fg-muted">
                      Credit used · {eur(c.balance, 0)} of {eur(c.creditLimit, 0)}
                    </span>
                  }
                  value={usage * 100}
                  size="sm"
                  tone={usage > 0.8 ? 'danger' : usage > 0.5 ? 'warning' : 'accent'}
                />
              </Card>
            );
          })}
        </div>
      ) : (
        <DataTable
          data={rows}
          rowKey="id"
          columns={[
            {
              id: 'name',
              header: 'Customer',
              sortable: true,
              cell: (c) => (
                <span className="flex items-center gap-2.5">
                  <Avatar name={c.name} size="xs" shape="rounded" />
                  <span className="font-medium">{c.name}</span>
                </span>
              ),
            },
            {
              id: 'segment',
              header: 'Segment',
              sortable: true,
              hideBelow: 'sm',
              cell: (c) => (
                <Badge tone={segmentTone[c.segment]} size="sm">
                  {c.segment}
                </Badge>
              ),
            },
            { id: 'contact', header: 'Contact', hideBelow: 'md' },
            { id: 'country', header: 'Country', sortable: true, hideBelow: 'lg' },
            {
              id: 'balance',
              header: 'Balance',
              align: 'right',
              sortable: true,
              cell: (c) => eur(c.balance),
              footer: (r) => eur(r.reduce((s, c) => s + c.balance, 0)),
            },
          ]}
        />
      )}
    </div>
  );
}
