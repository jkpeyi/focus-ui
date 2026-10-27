import { useState } from 'react';
import { Field, FileInput, formatBytes } from '@jkpeyi/focus-ui';

export default function Example() {
  const [logo, setLogo] = useState<File[]>([]);
  const [error, setError] = useState<string>();
  return (
    <div className="grid w-full max-w-md gap-5">
      <Field
        label="Company logo"
        description={logo[0] ? `${formatBytes(logo[0].size)} · shown on invoices` : 'PNG or SVG, up to 2 MB.'}
        error={error}
      >
        <FileInput
          accept=".png,.svg,image/png,image/svg+xml"
          maxSize={2 * 1024 * 1024}
          value={logo}
          onFilesChange={(files) => {
            setLogo(files);
            setError(undefined);
          }}
          onReject={(r) => setError(r[0].message)}
        />
      </Field>
      <Field label="Supporting documents" labelAside="Optional">
        <FileInput multiple buttonLabel="Add files" placeholder="Contracts, certificates…" />
      </Field>
      <Field label="Signed delivery note" required>
        <FileInput size="sm" accept=".pdf" />
      </Field>
      <Field label="Disabled" disabled>
        <FileInput />
      </Field>
    </div>
  );
}
