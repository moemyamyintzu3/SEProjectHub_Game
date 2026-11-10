import { useEffect, useRef, type ReactNode } from 'react';
import { animate, motion, useReducedMotion } from 'framer-motion';
import { Hubby, Icon } from '../art';
import { useLang, type TKey } from '../i18n';
import { burst } from './Confetti';
import { GlassCard } from './GlassCard';
import { Rich } from './Rich';
import { Screen } from './Screen';
import { Shine } from './Shine';

type Props = {
  score: number;
  total: number;
  /** 1 = best (3 stars), 2 = 2 stars, 3 = 1 star — same as the prototype. */
  level: 1 | 2 | 3;
  title: string;
  message?: string;
  prize: boolean;
  lessonKey: TKey;
  /** Confetti particle count fired 0.5 s after entering (0 = none). */
  confetti: number;
  children: ReactNode;
};

function CountUp({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduce) {
      el.textContent = String(to);
      return;
    }
    const c = animate(0, to, {
      duration: 0.9,
      delay: 0.35,
      ease: [0.33, 1, 0.68, 1], // ease-out cubic
      onUpdate: (v) => (el.textContent = String(Math.round(v))),
    });
    return () => c.stop();
  }, [to, reduce]);
  return <span ref={ref}>0</span>;
}

export function ResultScreen({ score, total, level, title, message, prize, lessonKey, confetti, children }: Props) {
  const { t } = useLang();
  const lit = 4 - level;

  useEffect(() => {
    if (!confetti) return;
    const id = window.setTimeout(() => burst(confetti), 500);
    return () => window.clearTimeout(id);
  }, [confetti]);

  return (
    <Screen label={title} className="md:justify-center">
      {/* desktop: one wide card, score on the left, lesson + buttons on the right */}
      <GlassCard className="text-center md:p-7 land:grid land:grid-cols-2 land:items-center land:gap-6 land:p-4 lg:mx-auto lg:grid lg:w-full lg:max-w-[1000px] lg:grid-cols-2 lg:items-center lg:gap-12 lg:p-10">
        <div>
        <Hubby mood="happy" className="mx-auto block h-[104px] w-[104px] md:h-[124px] md:w-[124px] land:h-14 land:w-14 lg:h-[140px] lg:w-[140px]" />
        <div className="flex h-14 justify-center gap-1.5 md:my-1 md:h-16 md:gap-2 land:my-0 land:h-11 lg:my-2 lg:h-[72px] lg:gap-2.5" aria-label={`${lit} / 3`}>
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="inline-block"
              style={i < lit ? undefined : { filter: 'grayscale(1)', opacity: 0.3 }}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 14, delay: 0.25 + i * 0.22 }}
            >
              <Icon name="star" className="h-[50px] w-[50px] md:h-[60px] md:w-[60px] land:h-10 land:w-10 lg:h-[68px] lg:w-[68px]" />
            </motion.span>
          ))}
        </div>
        <div className="font-mitr text-[72px] leading-none font-semibold text-green md:text-[88px] land:text-[52px] lg:text-[clamp(88px,8vw,116px)]">
          <CountUp to={score} />
          <span className="text-[34px] lg:text-[0.47em]">/{total}</span>
        </div>
        <h2 className="my-1.5 text-[26px] text-green md:my-2 md:text-[32px] land:my-1 land:text-[22px] lg:my-3 lg:text-[clamp(32px,3vw,40px)]">{title}</h2>
        {message && <p className="text-[15px] md:text-[17px] land:text-sm lg:text-lg">{message}</p>}
        {prize && (
          <motion.div
            className="relative my-3 overflow-hidden rounded-[18px] bg-[linear-gradient(135deg,var(--color-gold2),var(--color-gold))] p-3.5 font-mitr text-[18px] md:text-xl land:my-1.5 land:p-2 land:text-base lg:p-4 lg:text-xl"
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              boxShadow: ['0 0 0 0 rgba(255,200,61,.3)', '0 0 0 10px rgba(255,200,61,.3)', '0 0 0 0 rgba(255,200,61,.3)'],
            }}
            transition={{
              type: 'spring',
              stiffness: 240,
              damping: 16,
              delay: 0.8,
              boxShadow: { duration: 1.4, repeat: Infinity, ease: 'easeInOut', delay: 0.8 },
            }}
          >
            <Shine />
            <Rich className="relative" text={t('prize')} />
          </motion.div>
        )}
        </div>
        <div>
        <div className="lesson mt-2.5 md:p-5 md:text-[17px] md:text-pretty land:mt-0 land:p-3 land:text-sm lg:mt-0 lg:p-6 lg:text-lg lg:leading-[1.7] lg:text-pretty">
          <b>
            <Rich text={t('learnT')} />
          </b>
          <br />
          <Rich text={t(lessonKey)} />
        </div>
        <div className="on-light hidden land:mt-3 land:flex land:flex-col land:gap-2 lg:mt-6 lg:flex lg:flex-col lg:gap-3">{children}</div>
        </div>
      </GlassCard>
      <div className="contents land:hidden lg:hidden">{children}</div>
    </Screen>
  );
}
