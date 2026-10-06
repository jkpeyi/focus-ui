import { useSyncExternalStore, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

export interface PortalProps {
  children: ReactNode;
  /** Defaults to document.body. */
  container?: HTMLElement | null;
}

const subscribe = () => () => {};

/** SSR-safe portal: renders nothing on the server / during hydration, immediately on the client. */
export function Portal({ children, container }: PortalProps) {
  const isClient = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  if (!isClient) return null;
  return createPortal(children, container ?? document.body);
}
