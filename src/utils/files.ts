/** Helpers shared by FileInput, FileDropzone and FileList. */

/** 1536 → "1.5 KB". */
export function formatBytes(bytes: number, decimals = 1) {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)));
  const value = bytes / 1024 ** i;
  return `${i === 0 ? value : value.toFixed(decimals).replace(/\.0+$/, '')} ${units[i]}`;
}

/**
 * Same semantics as the native `accept` attribute:
 * ".pdf,.csv", "image/*", "application/pdf" — comma separated, case-insensitive.
 */
export function matchesAccept(file: { name: string; type?: string }, accept?: string) {
  if (!accept) return true;
  const name = file.name.toLowerCase();
  const type = (file.type ?? '').toLowerCase();
  return accept
    .split(',')
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean)
    .some((rule) => {
      if (rule.startsWith('.')) return name.endsWith(rule);
      if (rule.endsWith('/*')) return type.startsWith(rule.slice(0, -1));
      return type === rule;
    });
}

export type FileRejectionReason = 'type' | 'size' | 'count';

export interface FileRejection {
  file: File;
  reason: FileRejectionReason;
  /** Human-readable message, e.g. "invoice.exe isn't an accepted file type." */
  message: string;
}

export interface FileValidationOptions {
  accept?: string;
  /** Max size per file, in bytes. */
  maxSize?: number;
  /** Max number of files accepted in this batch (after `currentCount`). */
  maxFiles?: number;
  /** Files already selected — counts against `maxFiles`. */
  currentCount?: number;
}

/** Splits files into accepted and rejected, with a reason for each rejection. */
export function validateFiles(files: File[], { accept, maxSize, maxFiles, currentCount = 0 }: FileValidationOptions = {}) {
  const accepted: File[] = [];
  const rejected: FileRejection[] = [];
  for (const file of files) {
    if (!matchesAccept(file, accept)) {
      rejected.push({ file, reason: 'type', message: `${file.name} isn't an accepted file type.` });
    } else if (maxSize !== undefined && file.size > maxSize) {
      rejected.push({ file, reason: 'size', message: `${file.name} is larger than ${formatBytes(maxSize)}.` });
    } else if (maxFiles !== undefined && currentCount + accepted.length >= maxFiles) {
      rejected.push({
        file,
        reason: 'count',
        message: `You can add up to ${maxFiles} file${maxFiles === 1 ? '' : 's'}.`,
      });
    } else {
      accepted.push(file);
    }
  }
  return { accepted, rejected };
}

/** Human-readable summary of an accept string: ".pdf,.csv" → "PDF, CSV". */
export function describeAccept(accept?: string) {
  if (!accept) return '';
  return accept
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)
    .map((t) =>
      t.startsWith('.') ? t.slice(1).toUpperCase() : t.endsWith('/*') ? `${t.slice(0, -2)}s` : t.split('/').pop()!.toUpperCase(),
    )
    .join(', ');
}
