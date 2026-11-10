import { memo, useEffect, useState } from 'react';
import { motion, useAnimate, useReducedMotion } from 'framer-motion';
import { Art, type ArtName } from '../art';

const FLOAT_ART: ArtName[] = ['star', 'document', 'comment', 'bulb', 'check', 'books', 'heart', 'student', 'advisor', 'coordinator', 'gift', 'trophy'];
const FLOATERS = 16;
const FLOATERS_WIDE = 24; // laptops and big screens (>= 1024px), so the sides don't look empty
const SPARKS = 18;

const BLOBS = [
  // size = the larger of the phone size (px) and a share of the viewport width, so phones are unchanged
  { w: 420, vw: 40, color: '#2d9c6b', opacity: 0.55, style: { left: -120, top: -80 }, dur: 18 },
  { w: 360, vw: 34, color: '#ffc83d', opacity: 0.28, style: { right: -140, top: '30%' }, dur: 22 },
  { w: 460, vw: 44, color: '#1f7a8c', opacity: 0.4, style: { left: '10%', bottom: -200 }, dur: 26 },
  { w: 260, vw: 26, color: '#95d5b2', opacity: 0.3, style: { right: '15%', top: -60 }, dur: 20 },
];

const rand = (a: number, b: number) => a + Math.random() * (b - a);

/** Fixed animated backdrop: drifting blobs, panning dot grid, rising characters, sparkles.
    Uses transform + opacity only. */
export const Background = memo(function Background() {
  const reduce = useReducedMotion();

  const [floaters] = useState(() => {
    const wide = typeof window !== 'undefined' && window.innerWidth >= 1024;
    const count = wide ? FLOATERS_WIDE : FLOATERS;
    return Array.from({ length: count }, (_, i) => ({
        art: FLOAT_ART[i % FLOAT_ART.length],
        // wide screens: one floater per vertical strip, so they spread across the full width
        left: wide ? ((((i * 7) % count) + rand(0.1, 0.9)) / count) * 100 : rand(0, 100),
        size: wide ? rand(34, 72) : rand(26, 56),
        opacity: rand(0.18, 0.43),
        sway: rand(-80, 80),
        rot: rand(-180, 180),
        dur: rand(14, 30),
        offset: rand(0, 1),
        blur: Math.random() < 0.3,
      }));
  });
  const [sparks] = useState(
    () => Array.from({ length: SPARKS }, () => ({ left: rand(0, 100), top: rand(0, 100), dur: rand(2, 5), delay: rand(0, 3) })),
  );

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      style={{ background: 'radial-gradient(120% 80% at 50% 0%, #145a41 0%, #0a3426 45%, #041c14 100%)' }}
    >
      {BLOBS.map((b, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full mix-blend-screen"
          style={{ width: `max(${b.w}px, ${b.vw}vw)`, height: `max(${b.w}px, ${b.vw}vw)`, background: b.color, opacity: b.opacity, filter: 'blur(60px)', ...b.style }}
          animate={reduce ? undefined : { x: [0, 80, -40], y: [0, 60, 120], scale: [1, 1.15, 0.9] }}
          transition={{ duration: b.dur, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut', delay: -i * 4 }}
        />
      ))}

      <motion.div
        className="absolute -inset-1/2"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,.12) 1.2px, transparent 1.2px)',
          backgroundSize: '26px 26px',
          maskImage: 'radial-gradient(circle at 50% 40%, #000 0, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(circle at 50% 40%, #000 0, transparent 70%)',
        }}
        animate={reduce ? undefined : { x: [0, 26], y: [0, 52] }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
      />

      {!reduce && floaters.map((f, i) => <Floater key={i} {...f} />)}

      {sparks.map((s, i) => (
        <motion.span
          key={i}
          className="absolute h-1 w-1 rounded-full bg-white"
          style={{ left: `${s.left}%`, top: `${s.top}%`, boxShadow: '0 0 8px 2px rgba(255,230,150,.8)' }}
          initial={{ opacity: 0, scale: 0.4 }}
          animate={reduce ? { opacity: 0.6, scale: 1 } : { opacity: [0, 1, 0], scale: [0.4, 1, 0.4] }}
          transition={reduce ? undefined : { duration: s.dur, repeat: Infinity, ease: 'easeInOut', delay: s.delay }}
        />
      ))}
    </div>
  );
});

type FloaterProps = {
  art: ArtName; left: number; size: number; opacity: number; sway: number; rot: number; dur: number; offset: number; blur: boolean;
};

/** One character rising up the screen with sway + rotation. Starts partway through its loop
    so the sky is already populated on first paint. */
function Floater({ art, left, size, opacity, sway, rot, dur, offset, blur }: FloaterProps) {
  const [scope, animate] = useAnimate<HTMLSpanElement>();
  useEffect(() => {
    const rise = window.innerHeight * 1.15 + 80;
    const controls = animate(
      scope.current,
      {
        y: [0, -rise],
        x: [0, sway * 0.6, sway * 0.2, sway],
        rotate: [0, rot],
        opacity: [0, opacity, opacity, 0],
      },
      {
        duration: dur,
        repeat: Infinity,
        ease: 'linear',
        opacity: { duration: dur, repeat: Infinity, ease: 'linear', times: [0, 0.1, 0.9, 1] },
        x: { duration: dur, repeat: Infinity, ease: 'easeInOut' },
      },
    );
    controls.time = offset * dur;
    return () => controls.stop();
  }, [animate, scope, sway, rot, opacity, dur, offset]);

  return (
    <span
      ref={scope}
      className="absolute -bottom-16 block opacity-0 will-change-transform"
      style={{ left: `${left}%`, width: size, height: size, filter: blur ? 'blur(2px)' : undefined }}
    >
      <Art name={art} className="h-full w-full" />
    </span>
  );
}
