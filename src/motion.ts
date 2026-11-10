import type { Transition, Variants } from 'framer-motion';

export const spring: Transition = { type: 'spring', stiffness: 380, damping: 26 };
export const softSpring: Transition = { type: 'spring', stiffness: 220, damping: 22 };

/** Page transition: spring slide + scale + fade, and staggers its children. */
export const pageVariants: Variants = {
  initial: { opacity: 0, x: 60, scale: 0.96 },
  enter: {
    opacity: 1, x: 0, scale: 1,
    transition: { ...softSpring, staggerChildren: 0.08, delayChildren: 0.05 },
  },
  exit: { opacity: 0, x: -60, scale: 0.96, transition: { duration: 0.22, ease: 'easeIn' } },
};

/** Child items rise in (used with the page stagger). */
export const rise: Variants = {
  initial: { opacity: 0, y: 40, scale: 0.94 },
  enter: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 260, damping: 20 } },
};

/** Container that staggers its own children. */
export const stagger = (each = 0.08, delay = 0): Variants => ({
  initial: {},
  enter: { transition: { staggerChildren: each, delayChildren: delay } },
});
