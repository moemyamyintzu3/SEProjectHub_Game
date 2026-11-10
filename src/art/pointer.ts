import { motionValue } from 'framer-motion';

/** One shared pointer position for every Hubby on screen (pupils follow it). */
const hasWindow = typeof window !== 'undefined';
export const pointerX = motionValue(hasWindow ? window.innerWidth / 2 : 0);
export const pointerY = motionValue(hasWindow ? window.innerHeight / 2 : 0);

if (hasWindow) {
  const onPointer = (e: PointerEvent) => {
    pointerX.set(e.clientX);
    pointerY.set(e.clientY);
  };
  window.addEventListener('pointermove', onPointer, { passive: true });
  window.addEventListener('pointerdown', onPointer, { passive: true });
}
