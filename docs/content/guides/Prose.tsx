import type { ReactNode } from 'react';
import { CodeBlock } from '../../site/CodeBlock';

export function H2({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <h2 id={id} className="mt-12 mb-3 scroll-mt-20 text-xl font-semibold tracking-[-0.015em] text-fg">
      {children}
    </h2>
  );
}
export function H3({ children }: { children: ReactNode }) {
  return <h3 className="mt-8 mb-2 text-[15px] font-semibold text-fg">{children}</h3>;
}
export function P({ children }: { children: ReactNode }) {
  return <p className="my-3 text-[15px] leading-relaxed text-fg-muted">{children}</p>;
}
export function Code({ children }: { children: ReactNode }) {
  return <code className="rounded-md bg-fill/12 px-1.5 py-0.5 font-mono text-[0.85em] text-fg">{children}</code>;
}
export function Snippet({ code, language = 'tsx' }: { code: string; language?: string }) {
  return (
    <div className="my-4 overflow-hidden rounded-2xl border border-line">
      <CodeBlock code={code} language={language} />
    </div>
  );
}
export function List({ items }: { items: ReactNode[] }) {
  return (
    <ul className="my-3 space-y-2 text-[15px] leading-relaxed text-fg-muted">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2.5">
          <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
