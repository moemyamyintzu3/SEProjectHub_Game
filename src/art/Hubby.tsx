import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import { pointerX, pointerY } from './pointer';

type HubbyProps = {
  /** "happy" makes Hubby jump (result screens). */
  mood?: 'idle' | 'happy';
  /** Wave the right arm (intro screens). */
  wave?: boolean;
  /** Pupils follow the pointer. */
  track?: boolean;
  size?: number;
  className?: string;
};

const fillBox = { transformBox: 'fill-box' as const };

/** The "Hubby" robot mascot, same artwork as hubbySVG() in the prototype. */
export function Hubby({ mood = 'idle', wave = false, track = true, size, className }: HubbyProps) {
  const reduce = useReducedMotion();
  const ref = useRef<SVGSVGElement>(null);
  const tx = useMotionValue(0);
  const ty = useMotionValue(0);
  const px = useSpring(tx, { stiffness: 260, damping: 18, mass: 0.4 });
  const py = useSpring(ty, { stiffness: 260, damping: 18, mass: 0.4 });
  // Each Hubby blinks on its own rhythm so a screen full of them doesn't blink in sync.
  const [blinkDelay] = useState(() => Math.random() * 3);

  useEffect(() => {
    if (!track) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      if (!r.width) return;
      const dx = pointerX.get() - (r.left + r.width / 2);
      const dy = pointerY.get() - (r.top + r.height / 2);
      const d = Math.hypot(dx, dy) || 1;
      const m = Math.min(4, d / 40);
      tx.set((dx / d) * m);
      ty.set((dy / d) * m);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const offX = pointerX.on('change', schedule);
    const offY = pointerY.on('change', schedule);
    schedule();
    return () => {
      offX();
      offY();
      cancelAnimationFrame(raf);
    };
  }, [track, tx, ty]);

  const happy = mood === 'happy' && !reduce;

  return (
    <motion.svg
      ref={ref}
      viewBox="0 0 120 120"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={size ? { width: size, height: size } : undefined}
      aria-hidden
      animate={happy ? { y: [0, -14, 0], rotate: [0, -4, 0] } : undefined}
      transition={happy ? { duration: 0.6, repeat: 2, ease: 'easeInOut', delay: 0.3 } : undefined}
    >
      <line x1="60" y1="20" x2="60" y2="8" stroke="#1b4332" strokeWidth="4" strokeLinecap="round" />
      <motion.circle
        cx="60"
        cy="7"
        r="6.5"
        fill="#ffc83d"
        animate={
          reduce
            ? undefined
            : {
                fill: ['#ffc83d', '#fff3c4', '#ffc83d'],
                filter: ['drop-shadow(0 0 0px #ffc83d)', 'drop-shadow(0 0 6px #ffc83d)', 'drop-shadow(0 0 0px #ffc83d)'],
              }
        }
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
      />
      <rect x="5" y="50" width="11" height="22" rx="5.5" fill="#1b4332" />
      <motion.rect
        x="104"
        y="50"
        width="11"
        height="22"
        rx="5.5"
        fill="#1b4332"
        style={{ ...fillBox, originX: 0.5, originY: 0.9 }}
        animate={wave && !reduce ? { rotate: [0, -35, 10, -30, 0, 0] } : { rotate: 0 }}
        transition={wave && !reduce ? { duration: 1.6, repeat: Infinity, ease: 'easeInOut', times: [0, 0.2, 0.4, 0.6, 0.8, 1] } : undefined}
      />
      <rect x="14" y="18" width="92" height="82" rx="28" fill="#2d6a4f" />
      <rect x="14" y="18" width="92" height="40" rx="28" fill="#40916c" opacity=".5" />
      <rect x="24" y="30" width="72" height="52" rx="20" fill="#e6f7ea" />
      <motion.g
        style={{ ...fillBox, originX: 0.5, originY: 0.5 }}
        animate={reduce ? undefined : { scaleY: [1, 1, 0.08, 1, 1] }}
        transition={{ duration: 4.5, repeat: Infinity, times: [0, 0.9, 0.93, 0.96, 1], delay: blinkDelay }}
      >
        <motion.g style={{ x: px, y: py }}>
          <circle cx="45" cy="54" r="7.5" fill="#0b2219" />
          <circle cx="75" cy="54" r="7.5" fill="#0b2219" />
          <circle cx="47.5" cy="51.5" r="2.6" fill="#fff" />
          <circle cx="77.5" cy="51.5" r="2.6" fill="#fff" />
        </motion.g>
      </motion.g>
      <path d="M49 68 Q60 77 71 68" stroke="#0b2219" strokeWidth="4" fill="none" strokeLinecap="round" />
      <circle cx="33" cy="66" r="5" fill="#ff9e9e" opacity=".75" />
      <circle cx="87" cy="66" r="5" fill="#ff9e9e" opacity=".75" />
      <rect x="40" y="100" width="40" height="12" rx="6" fill="#1b4332" />
    </motion.svg>
  );
}

