import { motion, type HTMLMotionProps } from 'framer-motion';
import type { ReactNode } from 'react';
import { rise } from '../motion';
import { Shine } from './Shine';

type Props = Omit<HTMLMotionProps<'button'>, 'children'> & {
  variant?: 'primary' | 'ghost';
  children: ReactNode;
  /** Gentle breathing scale while idle (spin button). */
  breathe?: boolean;
  /** Join the page's stagger-in (default). Turn off inside pop-ups. */
  stagger?: boolean;
};

/** Chunky gold 3D button (primary) or glass button (ghost), with spring hover/tap. */
export function Button({ variant = 'primary', breathe, stagger = true, className = '', children, disabled, ...rest }: Props) {
  const primary = variant === 'primary';
  const base =
    'relative w-full min-h-[52px] overflow-hidden rounded-[18px] px-5 py-[15px] font-mitr text-[18px] font-medium leading-tight md:min-h-[58px] md:rounded-[20px] md:text-[20px] land:min-h-[46px] land:py-2.5 land:text-[17px]';
  const look = primary
    ? 'text-ink bg-[linear-gradient(180deg,var(--color-gold2),var(--color-gold))]'
    : 'btn-ghost text-white bg-white/10 border border-white/20 backdrop-blur-md';
  const shadowUp = primary ? '0 6px 0 #c48f00, 0 12px 24px rgba(255,200,61,.3)' : '0 0 0 rgba(0,0,0,0)';
  const shadowDown = primary ? '0 2px 0 #c48f00, 0 4px 10px rgba(255,200,61,.25)' : '0 0 0 rgba(0,0,0,0)';

  return (
    <motion.div variants={stagger ? rise : undefined} initial={stagger ? undefined : false} className="w-full">
      <motion.button
        type="button"
        disabled={disabled}
        className={`${base} ${look} ${disabled ? 'opacity-50' : ''} ${className}`}
        style={{ boxShadow: shadowUp }}
        animate={breathe && !disabled ? { scale: [1, 1.03, 1] } : { scale: 1 }}
        transition={breathe && !disabled ? { duration: 1.6, repeat: Infinity, ease: 'easeInOut' } : { type: 'spring', stiffness: 400, damping: 22 }}
        whileHover={disabled ? undefined : { y: -2, scale: 1.01 }}
        whileTap={disabled ? undefined : { y: 4, scale: 0.98, boxShadow: shadowDown }}
        {...rest}
      >
        {primary && !disabled && <Shine />}
        <span className="relative">{children}</span>
      </motion.button>
    </motion.div>
  );
}
