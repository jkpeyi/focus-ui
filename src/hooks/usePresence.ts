import { useEffect, useState } from 'react';

/**
 * Keeps an element mounted for `duration` ms after `open` turns false so it can
 * play an exit transition. `state` drives `data-state="open|closed"` styling.
 */
export function usePresence(open: boolean, duration = 200) {
  const [mounted, setMounted] = useState(open);
  useEffect(() => {
    if (open) {
      setMounted(true);
      return;
    }
    const timer = setTimeout(() => setMounted(false), duration);
    return () => clearTimeout(timer);
  }, [open, duration]);
  return { mounted: mounted || open, state: open ? ('open' as const) : ('closed' as const) };
}
