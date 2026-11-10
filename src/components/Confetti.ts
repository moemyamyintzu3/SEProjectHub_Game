import confetti from 'canvas-confetti';

const COLORS = ['#ffc83d', '#40916c', '#95d5b2', '#ff6b6b', '#ffffff', '#4cc9f0'];

const reduced = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/** Confetti burst. Without x/y it bursts from the upper middle of the screen.
    x/y are viewport pixels (e.g. the centre of a card or button). */
export function burst(count = 140, x?: number, y?: number) {
  if (reduced()) return;
  const origin = {
    x: x === undefined ? 0.5 : x / window.innerWidth,
    y: y === undefined ? 0.35 : y / window.innerHeight,
  };
  const small = count < 80;
  confetti({
    particleCount: count,
    origin,
    spread: small ? 360 : 110,
    startVelocity: small ? 22 : 45,
    gravity: 0.9,
    ticks: small ? 120 : 220,
    scalar: small ? 0.8 : 1,
    colors: COLORS,
    zIndex: 60,
    disableForReducedMotion: true,
  });
  if (!small) {
    // a second, all-round burst makes the big celebration feel fuller
    confetti({ particleCount: Math.round(count / 2), origin, spread: 360, startVelocity: 30, ticks: 200, colors: COLORS, zIndex: 60, disableForReducedMotion: true });
  }
}

/** Confetti from the centre of an element. */
export function burstFrom(el: Element | null, count = 40) {
  if (!el) return burst(count);
  const r = el.getBoundingClientRect();
  burst(count, r.left + r.width / 2, r.top + r.height / 2);
}
