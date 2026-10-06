import { cn } from '../utils/cn';
import { IconButton } from './IconButton';
import { ChevronLeftIcon, ChevronRightIcon } from './icons';

export interface PaginationProps {
  /** 1-based current page. */
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
  className?: string;
}

function pageList(page: number, count: number): Array<number | '…'> {
  if (count <= 7) return Array.from({ length: count }, (_, i) => i + 1);
  const pages: Array<number | '…'> = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(count - 1, page + 1);
  if (start > 2) pages.push('…');
  for (let p = start; p <= end; p++) pages.push(p);
  if (end < count - 1) pages.push('…');
  pages.push(count);
  return pages;
}

export function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
  className,
}: PaginationProps) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(total, page * pageSize);
  const fmt = (n: number) => n.toLocaleString();

  return (
    <nav
      aria-label="Pagination"
      className={cn('flex flex-wrap items-center justify-between gap-3 text-[13px] text-fg-muted', className)}
    >
      <div className="flex items-center gap-3">
        <span className="tabular-nums">
          <span className="font-medium text-fg">
            {fmt(from)}–{fmt(to)}
          </span>{' '}
          of {fmt(total)}
        </span>
        {onPageSizeChange && (
          <label className="hidden items-center gap-1.5 sm:flex">
            <span>Rows</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="focus-ring h-7 cursor-pointer rounded-md bg-fill/10 px-1.5 text-[13px] text-fg"
            >
              {pageSizeOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>
      <div className="flex items-center gap-1">
        <IconButton
          label="Previous page"
          icon={<ChevronLeftIcon />}
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        />
        <div className="hidden items-center gap-0.5 sm:flex">
          {pageList(page, pageCount).map((p, i) =>
            p === '…' ? (
              <span key={`e${i}`} className="w-7 text-center text-fg-subtle">
                …
              </span>
            ) : (
              <button
                key={p}
                type="button"
                aria-current={p === page ? 'page' : undefined}
                onClick={() => onPageChange(p)}
                className={cn(
                  'focus-ring h-7 min-w-7 rounded-md px-1.5 tabular-nums transition-colors',
                  p === page ? 'bg-accent font-semibold text-accent-fg' : 'text-fg hover:bg-fill/12',
                )}
              >
                {p}
              </button>
            ),
          )}
        </div>
        <span className="px-2 tabular-nums sm:hidden">
          {page} / {pageCount}
        </span>
        <IconButton
          label="Next page"
          icon={<ChevronRightIcon />}
          size="sm"
          disabled={page >= pageCount}
          onClick={() => onPageChange(page + 1)}
        />
      </div>
    </nav>
  );
}
