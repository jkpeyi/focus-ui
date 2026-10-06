import { cloneElement, isValidElement, type ReactElement, type Ref } from 'react';
import { mergeRefs } from '../utils/ref';

/** Reads the ref of a React element across React 18 (element.ref) and 19 (props.ref). */
function getElementRef(element: ReactElement): Ref<HTMLElement> | undefined {
  const props = element.props as { ref?: Ref<HTMLElement> };
  return props.ref ?? (element as unknown as { ref?: Ref<HTMLElement> }).ref;
}

/** Clone a trigger element, merging our ref and event handlers with its own. */
export function cloneTrigger(child: ReactElement, ref: Ref<HTMLElement>, props: Record<string, unknown>): ReactElement {
  if (!isValidElement(child)) return child;
  const own = child.props as Record<string, unknown>;
  const merged: Record<string, unknown> = { ...props };
  for (const key of Object.keys(props)) {
    if (key.startsWith('on') && typeof own[key] === 'function' && typeof props[key] === 'function') {
      merged[key] = (...args: unknown[]) => {
        (own[key] as (...a: unknown[]) => void)(...args);
        (props[key] as (...a: unknown[]) => void)(...args);
      };
    }
  }
  return cloneElement(child, { ...merged, ref: mergeRefs(getElementRef(child), ref) } as never);
}
