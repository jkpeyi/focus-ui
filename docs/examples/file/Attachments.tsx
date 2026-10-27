import { useEffect, useRef, useState } from 'react';
import { FileDropzone, FileList, fileToItem, useToast, type FileItem } from '@jkpeyi/focus-ui';

// Existing attachments + one upload in each state, so every row style is visible.
const initial: FileItem[] = [
  { id: 'a', name: 'PO-77821-signed.pdf', size: 248_000, type: 'application/pdf', status: 'done', href: '#' },
  { id: 'b', name: 'packing-list.xlsx', size: 61_400, status: 'uploading', progress: 45 },
  { id: 'c', name: 'customs-declaration.docx', size: 1_480_000, status: 'error', error: 'Network error — try again' },
];

export default function Example() {
  const { toast } = useToast();
  const [items, setItems] = useState(initial);
  const timers = useRef<ReturnType<typeof setInterval>[]>([]);
  useEffect(() => () => timers.current.forEach(clearInterval), []);

  // Simulated upload — replace with fetch/XHR and report progress from upload.onprogress.
  const upload = (id: string) => {
    setItems((all) => all.map((f) => (f.id === id ? { ...f, status: 'uploading', progress: 0, error: undefined } : f)));
    const timer = setInterval(() => {
      setItems((all) =>
        all.map((f) => {
          if (f.id !== id || f.status !== 'uploading') return f;
          const progress = (f.progress ?? 0) + 12 + Math.random() * 18;
          return progress >= 100 ? { ...f, status: 'done', progress: 100 } : { ...f, progress };
        }),
      );
    }, 300);
    timers.current.push(timer);
  };

  // Kick off the "uploading" sample row once on mount.
  useEffect(() => upload('b'), []);

  return (
    <div className="w-full max-w-lg space-y-3">
      <FileDropzone
        accept=".pdf,.xlsx,.csv,.docx,image/*"
        maxSize={10 * 1024 * 1024}
        maxFiles={8}
        currentCount={items.length}
        onFilesAdded={(files) => {
          const added = files.map((f) => fileToItem(f));
          setItems((all) => [...all, ...added]);
          added.forEach((f) => upload(f.id));
        }}
        onReject={(rejections) => rejections.forEach((r) => toast({ title: r.message, tone: 'danger' }))}
      />
      <FileList items={items} onRemove={(id) => setItems((all) => all.filter((f) => f.id !== id))} onRetry={upload} />
    </div>
  );
}
