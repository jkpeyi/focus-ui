/** Shared look for text-like controls (Input, Select, Textarea). */
export const controlBase =
  'w-full rounded-lg border border-line-strong bg-surface text-fg shadow-[0_1px_1px_rgb(0_0_0/0.02)] ' +
  'placeholder:text-fg-subtle transition-[border-color,box-shadow,background-color] duration-150 ' +
  'hover:border-fg-subtle/60 focus:outline-none focus:border-accent focus:ring-[3px] focus:ring-accent/20 ' +
  'disabled:cursor-not-allowed disabled:bg-fill/8 disabled:text-fg-muted ' +
  'aria-invalid:border-danger aria-invalid:focus:ring-danger/20 ' +
  'dark:bg-fill/12 dark:border-line-strong';

export const controlSizes = {
  sm: 'h-7 text-[13px] px-2.5',
  md: 'h-8 text-sm px-3',
  lg: 'h-10 text-[15px] px-3.5',
} as const;

export type ControlSize = keyof typeof controlSizes;
