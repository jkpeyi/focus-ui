export interface PropDoc {
  name: string;
  type: string;
  default?: string;
  description: string;
}

export function PropsTable({ props, title }: { props: PropDoc[]; title?: string }) {
  return (
    <div>
      {title && <h3 className="mb-2 font-mono text-[13px] font-semibold text-fg">{title}</h3>}
      <div className="scrollbar-thin overflow-x-auto rounded-2xl border border-line bg-surface">
        <table className="w-full min-w-[640px] text-left text-[13px]">
          <thead>
            <tr className="border-b border-line bg-surface-2 text-xs text-fg-muted dark:bg-surface">
              <th className="px-4 py-2.5 font-medium">Prop</th>
              <th className="px-4 py-2.5 font-medium">Type</th>
              <th className="px-4 py-2.5 font-medium">Default</th>
              <th className="px-4 py-2.5 font-medium">Description</th>
            </tr>
          </thead>
          <tbody>
            {props.map((p) => (
              <tr key={p.name} className="border-b border-line last:border-0 align-top">
                <td className="px-4 py-2.5 font-mono text-[12.5px] font-medium whitespace-nowrap text-accent">{p.name}</td>
                <td className="max-w-[240px] px-4 py-2.5 font-mono text-[12px] text-fg-muted">{p.type}</td>
                <td className="px-4 py-2.5 font-mono text-[12px] whitespace-nowrap text-fg-muted">{p.default ?? '—'}</td>
                <td className="px-4 py-2.5 text-fg">{p.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
