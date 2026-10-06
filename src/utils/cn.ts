import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      shadow: [{ shadow: ['card', 'raised', 'popover', 'modal'] }],
    },
  },
});

/** Merge class names, resolving Tailwind conflicts so consumer classes always win. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
