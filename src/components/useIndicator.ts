import { useLayoutEffect, useState, type RefObject } from 'react';

/** Measures the active item inside a container so a sliding indicator can follow it. */
export function useIndicator(
  containerRef: RefObject<HTMLElement | null>,
  activeKey: string | undefined,
  selector = '[data-active="true"]',
) {
  const [rect, setRect] = useState<{ left: number; width: number; top: number; height: number } | null>(null);
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const measure = () => {
      const el = container.querySelector<HTMLElement>(selector);
      if (!el) return setRect(null);
      setRect({ left: el.offsetLeft, width: el.offsetWidth, top: el.offsetTop, height: el.offsetHeight });
    };
    measure();
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : undefined;
    observer?.observe(container);
    return () => observer?.disconnect();
  }, [containerRef, activeKey, selector]);
  return rect;
}
