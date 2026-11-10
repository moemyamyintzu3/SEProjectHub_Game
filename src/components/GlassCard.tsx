import { motion, type HTMLMotionProps } from 'framer-motion';
import { rise } from '../motion';

/** White glass card (radius 28px, soft shadow) that rises in with the page stagger. */
export function GlassCard({ className = '', ...rest }: HTMLMotionProps<'div'>) {
  return <motion.div variants={rise} className={`glass ${className}`} {...rest} />;
}
