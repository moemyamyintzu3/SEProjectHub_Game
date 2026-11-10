import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { pageVariants } from '../motion';

/** One page. AnimatePresence (mode="wait") in App swaps these with a spring slide + scale + fade. */
export function Screen({ children, label, className = '' }: { children: ReactNode; label: string; className?: string }) {
  return (
    <motion.section
      aria-label={label}
      variants={pageVariants}
      initial="initial"
      animate="enter"
      exit="exit"
      className={`flex flex-1 flex-col gap-3.5 ${className}`}
    >
      {children}
    </motion.section>
  );
}
