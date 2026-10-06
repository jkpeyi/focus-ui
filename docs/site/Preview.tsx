import { useState } from 'react';
import { cn, SegmentedControl } from 'focus-ui';
import { Code2, Eye } from 'lucide-react';
import { CodeBlock } from './CodeBlock';
import { getExample } from './examples';

export interface PreviewProps {
  example: string;
  title?: string;
  description?: string;
  /** Remove padding / centering — for full-width examples like tables. */
  bleed?: boolean;
}

export function Preview({ example, title, description, bleed }: PreviewProps) {
  const [view, setView] = useState('preview');
  const ex = getExample(example);
  if (!ex) return <div className="text-danger">Missing example: {example}</div>;
  const { Component, source } = ex;
  return (
    <section className="scroll-mt-20">
      {(title || description) && (
        <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
          <div>
            {title && <h3 className="text-[15px] font-semibold tracking-[-0.01em] text-fg">{title}</h3>}
            {description && <p className="mt-0.5 text-[13px] text-fg-muted">{description}</p>}
          </div>
          <SegmentedControl
            size="sm"
            aria-label="View"
            value={view}
            onValueChange={setView}
            options={[
              { value: 'preview', label: 'Preview', icon: <Eye /> },
              { value: 'code', label: 'Code', icon: <Code2 /> },
            ]}
          />
        </div>
      )}
      <div className="overflow-hidden rounded-2xl border border-line bg-surface">
        {view === 'preview' ? (
          <div
            className={cn(
              'bg-canvas/60 dark:bg-canvas',
              bleed ? 'p-3 sm:p-6' : 'flex min-h-36 flex-wrap items-center justify-center gap-4 p-6 sm:p-10',
            )}
            style={{
              backgroundImage: 'radial-gradient(color-mix(in srgb, var(--fx-fill) 22%, transparent) 1px, transparent 1px)',
              backgroundSize: '16px 16px',
            }}
          >
            <Component />
          </div>
        ) : (
          <CodeBlock code={source} />
        )}
      </div>
    </section>
  );
}
