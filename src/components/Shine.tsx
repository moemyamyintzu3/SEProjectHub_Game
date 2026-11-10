import { motion, useReducedMotion } from 'framer-motion';

/** Diagonal light sweep across a primary surface (parent needs overflow-hidden + relative). */
export function Shine({ delay = 0 }: { delay?: number }) {
  const reduce = useReducedMotion();
  if (reduce) return null;
  return (
    <motion.span
      aria-hidden
      className="pointer-events-none absolute inset-y-0 left-0 w-[40%]"
      style={{
        background: 'linear-gradient(100deg, transparent, rgba(255,255,255,.75), transparent)',
        skewX: -20,
      }}
      initial={{ x: '-150%' }}
      animate={{ x: ['-150%', '-150%', '330%'] }}
      transition={{ duration: 4, times: [0, 0.6, 1], repeat: Infinity, ease: 'easeInOut', delay }}
    />
  );
}
