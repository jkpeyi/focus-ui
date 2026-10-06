import { useCallback, useLayoutEffect, useState, type CSSProperties, type RefObject } from 'react';

export type Placement = 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'right';

interface Options {
  placement?: Placement;
  offset?: number;
  /** Match the floating element's min-width to the anchor's width. */
  matchWidth?: boolean;
  open: boolean;
}

const VIEWPORT_PADDING = 8;

/**
 * Minimal, dependency-free positioning for popovers, menus and tooltips.
 * Uses `position: fixed`, flips to the opposite side when there is not enough
 * room and clamps inside the viewport.
 */
export function useFloating(
  anchorRef: RefObject<HTMLElement | null>,
  floatingRef: RefObject<HTMLElement | null>,
  { placement = 'bottom-start', offset = 6, matchWidth = false, open }: Options,
) {
  const [style, setStyle] = useState<CSSProperties>({ position: 'fixed', top: 0, left: 0, visibility: 'hidden' });
  const [actualPlacement, setActualPlacement] = useState<Placement>(placement);

  const update = useCallback(() => {
    const anchor = anchorRef.current;
    const floating = floatingRef.current;
    if (!anchor || !floating) return;
    const a = anchor.getBoundingClientRect();
    const f = floating.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    let [side, align] = placement.split('-') as [string, string | undefined];

    if (side === 'bottom' && a.bottom + offset + f.height > vh && a.top - offset - f.height > 0) side = 'top';
    else if (side === 'top' && a.top - offset - f.height < 0 && a.bottom + offset + f.height < vh) side = 'bottom';
    else if (side === 'right' && a.right + offset + f.width > vw) side = 'left';
    else if (side === 'left' && a.left - offset - f.width < 0) side = 'right';

    let top = 0;
    let left = 0;
    if (side === 'top' || side === 'bottom') {
      top = side === 'bottom' ? a.bottom + offset : a.top - offset - f.height;
      if (align === 'start') left = a.left;
      else if (align === 'end') left = a.right - f.width;
      else left = a.left + a.width / 2 - f.width / 2;
    } else {
      left = side === 'right' ? a.right + offset : a.left - offset - f.width;
      top = a.top + a.height / 2 - f.height / 2;
    }

    left = Math.min(Math.max(VIEWPORT_PADDING, left), vw - f.width - VIEWPORT_PADDING);
    top = Math.min(Math.max(VIEWPORT_PADDING, top), vh - f.height - VIEWPORT_PADDING);

    setActualPlacement((align ? `${side}-${align}` : side) as Placement);
    setStyle({
      position: 'fixed',
      top,
      left,
      minWidth: matchWidth ? a.width : undefined,
    });
  }, [anchorRef, floatingRef, placement, offset, matchWidth]);

  useLayoutEffect(() => {
    if (!open) {
      setStyle((s) => ({ ...s, visibility: 'hidden' }));
      return;
    }
    update();
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(update) : undefined;
    if (floatingRef.current) observer?.observe(floatingRef.current);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
      observer?.disconnect();
    };
  }, [open, update, floatingRef]);

  return { style, placement: actualPlacement, update };
}
