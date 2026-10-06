import { useMemo, useState, type Key, type ReactNode } from 'react';
import { cn } from '../utils/cn';
import { useControllableState } from '../hooks/useControllableState';
import { Checkbox } from './Checkbox';
import { Skeleton } from './Skeleton';
import { Pagination } from './Pagination';
import { EmptyState } from './EmptyState';
import { Portal } from './Portal';
import { ArrowDownIcon, ArrowUpIcon, ChevronUpDownIcon } from './icons';

export type SortDirection = 'asc' | 'desc';
export interface SortState {
  id: string;
  direction: SortDirection;
}

export interface DataTableColumn<T> {
  /** Unique column id. Also used as the property name when no `accessor` is given. */
  id: string;
  header: ReactNode;
  /** Value used for sorting (and default rendering). */
  accessor?: (row: T) => string | number | Date | boolean | null | undefined;
  /** Custom cell renderer. */
  cell?: (row: T, index: number) => ReactNode;
  /** Footer cell, receives all (filtered) rows — perfect for totals. */
  footer?: (rows: T[]) => ReactNode;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  /** CSS width, e.g. 120 or "20%". */
  width?: number | string;
  /** Hide the column below a breakpoint to keep tables readable on small screens. */
  hideBelow?: 'sm' | 'md' | 'lg' | 'xl';
  /** Keep the column visible while scrolling horizontally (first column only recommended). */
  sticky?: boolean;
  className?: string;
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  /** Unique key per row. */
  rowKey: keyof T | ((row: T) => Key);
  /** `card` wraps the table in a surface; `plain` renders the bare table. */
  variant?: 'card' | 'plain';
  density?: 'compact' | 'regular' | 'comfortable';
  loading?: boolean;
  /** Rendered when `data` is empty and not loading. */
  empty?: ReactNode;
  onRowClick?: (row: T) => void;
  /** Highlight a row (e.g. the record open in a side sheet). */
  activeRowKey?: Key;

  // Sorting
  sort?: SortState | null;
  defaultSort?: SortState | null;
  onSortChange?: (sort: SortState | null) => void;
  /** Set when data is sorted on the server — disables client-side sorting. */
  manualSorting?: boolean;

  // Selection
  selectable?: boolean;
  selectedKeys?: Key[];
  defaultSelectedKeys?: Key[];
  onSelectionChange?: (keys: Key[]) => void;
  /** Contextual action bar shown when rows are selected. */
  bulkActions?: (selectedRows: T[], clear: () => void) => ReactNode;

  // Client-side pagination
  /** Enables built-in pagination with this page size. */
  pageSize?: number;
  pageSizeOptions?: number[];

  /** Content above the table, inside the card (filters, search…). */
  toolbar?: ReactNode;
  stickyHeader?: boolean;
  /** Max height of the scroll area (enables vertical scrolling with sticky header). */
  maxHeight?: number | string;
  striped?: boolean;
  caption?: string;
  className?: string;
}

const densities = {
  compact: { cell: 'h-8 py-1 text-[13px]', head: 'h-8' },
  regular: { cell: 'h-11 py-2 text-[13px]', head: 'h-9' },
  comfortable: { cell: 'h-14 py-3 text-sm', head: 'h-10' },
};

const hideClass = {
  sm: 'max-sm:hidden',
  md: 'max-md:hidden',
  lg: 'max-lg:hidden',
  xl: 'max-xl:hidden',
};

const alignClass = { left: 'text-left', center: 'text-center', right: 'text-right' };

function compare(a: unknown, b: unknown) {
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' });
}

/**
 * Data grid for ERP list views: sorting, selection with bulk actions, totals footer,
 * pagination, loading skeletons, density control and responsive column hiding.
 */
export function DataTable<T>({
  columns,
  data,
  rowKey,
  variant = 'card',
  density = 'regular',
  loading,
  empty,
  onRowClick,
  activeRowKey,
  sort: sortProp,
  defaultSort = null,
  onSortChange,
  manualSorting,
  selectable,
  selectedKeys: selectedProp,
  defaultSelectedKeys = [],
  onSelectionChange,
  bulkActions,
  pageSize: initialPageSize,
  pageSizeOptions,
  toolbar,
  stickyHeader = true,
  maxHeight,
  striped,
  caption,
  className,
}: DataTableProps<T>) {
  const [sort, setSort] = useControllableState<SortState | null>(sortProp, defaultSort, onSortChange);
  const [selected, setSelected] = useControllableState<Key[]>(selectedProp, defaultSelectedKeys, onSelectionChange);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize ?? 0);

  const getKey = (row: T): Key => (typeof rowKey === 'function' ? rowKey(row) : (row[rowKey] as unknown as Key));
  const getValue = (row: T, col: DataTableColumn<T>) =>
    col.accessor ? col.accessor(row) : (row as Record<string, unknown>)[col.id];

  const sorted = useMemo(() => {
    if (!sort || manualSorting) return data;
    const col = columns.find((c) => c.id === sort.id);
    if (!col) return data;
    const dir = sort.direction === 'asc' ? 1 : -1;
    return [...data].sort((a, b) => compare(getValue(a, col), getValue(b, col)) * dir);
  }, [data, sort, manualSorting, columns]);

  const paginated = pageSize > 0;
  const pageCount = paginated ? Math.max(1, Math.ceil(sorted.length / pageSize)) : 1;
  const currentPage = Math.min(page, pageCount);
  const rows = paginated ? sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize) : sorted;

  const selectedSet = new Set(selected);
  const pageKeys = rows.map(getKey);
  const allOnPageSelected = pageKeys.length > 0 && pageKeys.every((k) => selectedSet.has(k));
  const someOnPageSelected = pageKeys.some((k) => selectedSet.has(k));
  const selectedRows = data.filter((row) => selectedSet.has(getKey(row)));

  const toggleSort = (col: DataTableColumn<T>) => {
    if (!col.sortable) return;
    if (!sort || sort.id !== col.id) setSort({ id: col.id, direction: 'asc' });
    else if (sort.direction === 'asc') setSort({ id: col.id, direction: 'desc' });
    else setSort(null);
  };

  const toggleRow = (key: Key) => {
    const next = new Set(selectedSet);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setSelected([...next]);
  };

  const toggleAll = () => {
    const next = new Set(selectedSet);
    if (allOnPageSelected) pageKeys.forEach((k) => next.delete(k));
    else pageKeys.forEach((k) => next.add(k));
    setSelected([...next]);
  };

  const d = densities[density];
  const hasFooter = columns.some((c) => c.footer);
  const colCount = columns.length + (selectable ? 1 : 0);

  const table = (
    <div className={cn('scrollbar-thin relative overflow-auto', variant === 'card' && 'rounded-[inherit]')} style={{ maxHeight }}>
      <table className="w-full border-separate border-spacing-0">
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead className={cn(stickyHeader && 'sticky top-0 z-10')}>
          <tr>
            {selectable && (
              <th
                scope="col"
                className={cn('w-10 border-b text-left border-line bg-surface-2 pr-0 pl-4 dark:bg-surface', d.head)}
              >
                <Checkbox
                  aria-label="Select all rows on this page"
                  checked={allOnPageSelected}
                  indeterminate={!allOnPageSelected && someOnPageSelected}
                  onChange={toggleAll}
                  disabled={rows.length === 0}
                />
              </th>
            )}
            {columns.map((col, i) => {
              const sortedBy = sort?.id === col.id ? sort.direction : undefined;
              return (
                <th
                  key={col.id}
                  scope="col"
                  aria-sort={sortedBy === 'asc' ? 'ascending' : sortedBy === 'desc' ? 'descending' : undefined}
                  style={{ width: col.width }}
                  className={cn(
                    'border-b border-line bg-surface-2 px-3 text-[12px] font-medium whitespace-nowrap text-fg-muted dark:bg-surface',
                    d.head,
                    alignClass[col.align ?? 'left'],
                    i === 0 && !selectable && 'pl-4',
                    i === columns.length - 1 && 'pr-4',
                    col.hideBelow && hideClass[col.hideBelow],
                    col.sticky && 'sticky left-0 z-[1]',
                    col.className,
                  )}
                >
                  {col.sortable ? (
                    <button
                      type="button"
                      onClick={() => toggleSort(col)}
                      className={cn(
                        'focus-ring group/sort -mx-1 inline-flex items-center gap-1 rounded px-1 hover:text-fg',
                        col.align === 'right' && 'flex-row-reverse',
                        sortedBy && 'text-fg',
                      )}
                    >
                      {col.header}
                      {sortedBy === 'asc' ? (
                        <ArrowUpIcon className="size-3" />
                      ) : sortedBy === 'desc' ? (
                        <ArrowDownIcon className="size-3" />
                      ) : (
                        <ChevronUpDownIcon className="size-3 opacity-0 transition-opacity group-hover/sort:opacity-60" />
                      )}
                    </button>
                  ) : (
                    col.header
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {loading &&
            Array.from({ length: Math.min(pageSize || 6, 8) }).map((_, r) => (
              <tr key={`sk-${r}`}>
                {selectable && <td className={cn('border-b border-line pl-4', d.cell)} />}
                {columns.map((col) => (
                  <td key={col.id} className={cn('border-b border-line px-3', d.cell, col.hideBelow && hideClass[col.hideBelow])}>
                    <Skeleton className={cn('h-3', col.align === 'right' ? 'ml-auto w-16' : 'w-3/4')} />
                  </td>
                ))}
              </tr>
            ))}
          {!loading && rows.length === 0 && (
            <tr>
              <td colSpan={colCount} className="px-4 py-12">
                {empty ?? <EmptyState title="No records" description="There is nothing to show here yet." />}
              </td>
            </tr>
          )}
          {!loading &&
            rows.map((row, r) => {
              const key = getKey(row);
              const isSelected = selectedSet.has(key);
              const isActive = activeRowKey !== undefined && activeRowKey === key;
              return (
                <tr
                  key={key}
                  aria-selected={selectable ? isSelected : undefined}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={cn(
                    // The row tint lives in a variable so sticky cells (which need an opaque background) can share it.
                    'group/row bg-(--row-bg) transition-colors duration-75 [--row-bg:var(--fx-surface)]',
                    onRowClick && 'cursor-pointer',
                    striped && r % 2 === 1 && '[--row-bg:color-mix(in_srgb,var(--fx-fill)_4%,var(--fx-surface))]',
                    isSelected || isActive
                      ? '[--row-bg:color-mix(in_srgb,var(--fx-accent)_8%,var(--fx-surface))] dark:[--row-bg:color-mix(in_srgb,var(--fx-accent)_14%,var(--fx-surface))]'
                      : 'hover:[--row-bg:color-mix(in_srgb,var(--fx-fill)_7%,var(--fx-surface))]',
                  )}
                >
                  {selectable && (
                    <td
                      className={cn('border-b border-line pr-0 pl-4 group-last/row:border-b-0', d.cell)}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Checkbox aria-label="Select row" checked={isSelected} onChange={() => toggleRow(key)} />
                    </td>
                  )}
                  {columns.map((col, i) => (
                    <td
                      key={col.id}
                      className={cn(
                        'border-b border-line px-3 text-fg group-last/row:border-b-0',
                        d.cell,
                        alignClass[col.align ?? 'left'],
                        col.align === 'right' && 'tabular-nums',
                        i === 0 && !selectable && 'pl-4',
                        i === columns.length - 1 && 'pr-4',
                        col.hideBelow && hideClass[col.hideBelow],
                        col.sticky && 'sticky left-0 z-[1] bg-(--row-bg)',
                        col.className,
                      )}
                    >
                      {col.cell ? col.cell(row, r) : String(getValue(row, col) ?? '—')}
                    </td>
                  ))}
                </tr>
              );
            })}
        </tbody>
        {hasFooter && !loading && rows.length > 0 && (
          <tfoot>
            <tr>
              {selectable && <td className="border-t border-line-strong bg-surface-2 dark:bg-surface" />}
              {columns.map((col, i) => (
                <td
                  key={col.id}
                  className={cn(
                    'h-10 border-t border-line-strong bg-surface-2 px-3 text-[13px] font-semibold text-fg tabular-nums dark:bg-surface',
                    alignClass[col.align ?? 'left'],
                    i === 0 && !selectable && 'pl-4',
                    i === columns.length - 1 && 'pr-4',
                    col.hideBelow && hideClass[col.hideBelow],
                  )}
                >
                  {col.footer?.(sorted)}
                </td>
              ))}
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );

  return (
    <div className={cn('relative', variant === 'card' && 'overflow-hidden rounded-2xl bg-surface shadow-card', className)}>
      {toolbar && <div className="border-b border-line px-4 py-3">{toolbar}</div>}
      {table}
      {paginated && !loading && sorted.length > 0 && (
        <div className="border-t border-line px-4 py-2.5">
          <Pagination
            page={currentPage}
            pageSize={pageSize}
            total={sorted.length}
            onPageChange={setPage}
            onPageSizeChange={(s) => {
              setPageSize(s);
              setPage(1);
            }}
            pageSizeOptions={pageSizeOptions}
          />
        </div>
      )}
      {selectable && bulkActions && selectedRows.length > 0 && (
        <Portal>
          <div className="pointer-events-none fixed inset-x-0 bottom-[max(3.5rem,calc(env(safe-area-inset-bottom)+1rem))] z-40 flex justify-center px-4">
            <div
              role="toolbar"
              aria-label="Bulk actions"
              className="material pointer-events-auto flex max-w-full animate-fx-toast-in items-center gap-3 overflow-x-auto rounded-2xl py-2 pr-2 pl-4 text-fg shadow-modal"
            >
              <span className="text-[13px] font-medium whitespace-nowrap tabular-nums">{selectedRows.length} selected</span>
              <button
                type="button"
                onClick={() => setSelected([])}
                className="focus-ring rounded text-[13px] whitespace-nowrap text-fg-muted hover:text-fg"
              >
                Clear
              </button>
              <span className="h-4 w-px shrink-0 bg-line-strong" />
              <div className="flex items-center gap-1.5">{bulkActions(selectedRows, () => setSelected([]))}</div>
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
}
