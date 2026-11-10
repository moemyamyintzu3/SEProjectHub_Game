import { useEffect, useRef } from 'react';
import { useAnimate } from 'framer-motion';

/** Returns a ref; the element does a springy scale "bump" whenever `value` changes (not on mount). */
export function useBump<T extends Element>(value: unknown) {
  const [scope, animate] = useAnimate<T>();
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (scope.current) animate(scope.current, { scale: [1, 1.25, 1] }, { duration: 0.35, ease: 'easeOut' });
  }, [value, animate, scope]);
  return scope;
}
