import { useSyncExternalStore } from 'react';

const subscribe = (cb: () => void) => {
  window.addEventListener('hashchange', cb);
  return () => window.removeEventListener('hashchange', cb);
};

/** Tiny hash router — keeps the docs deployable as static files anywhere. */
export function useRoute() {
  const hash = useSyncExternalStore(
    subscribe,
    () => window.location.hash,
    () => '',
  );
  return hash.replace(/^#\/?/, '') || 'introduction';
}

export function navigate(path: string) {
  window.location.hash = `/${path}`;
}
