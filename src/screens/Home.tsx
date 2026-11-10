import { useMemo, type PointerEvent, type ReactNode } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import { Art, Hubby, Icon, type ArtName } from '../art';
import { GlassCard } from '../components/GlassCard';
import { Rich } from '../components/Rich';
import { Screen } from '../components/Screen';
import { Shine } from '../components/Shine';
import { useLang, type Lang, type TKey } from '../i18n';
import { rise } from '../motion';
import { TIME_LIMIT } from '../data';

/** Split into graphemes so Thai vowels and tone marks stay attached to their consonant. */
function graphemes(s: string, lang: Lang): string[] {
  try {
    return [...new Intl.Segmenter(lang, { granularity: 'grapheme' }).segment(s)].map((x) => x.segment);
  } catch {
    return [...s];
  }
}

function PopTitle({ text, lang }: { text: string; lang: Lang }) {
  const reduce = useReducedMotion();
  // Words stay unbreakable (nowrap) so a line can only wrap at spaces, never inside a word.
  const words = useMemo(() => {
    const split = text.split(' ').map((w) => graphemes(w, lang));
    const starts = split.map((_, i) => split.slice(0, i).reduce((sum, g) => sum + g.length, 0));
    return split.map((g, wi) => g.map((ch, ci) => ({ ch, d: starts[wi] + ci })));
  }, [text, lang]);
  return (
    <h1 key={text} className="text-[30px] leading-[1.25] text-green md:text-[40px] land:text-[24px] lg:text-[clamp(40px,3.4vw,54px)] lg:leading-[1.2]" aria-label={text}>
      {words.map((g, wi) => (
        <span key={wi} aria-hidden>
          {wi > 0 && ' '}
          <span className="inline-block whitespace-nowrap">
            {g.map(({ ch, d }) => {
              return (
                <motion.span
                  key={d}
                  className="inline-block"
                  initial={reduce ? false : { opacity: 0, y: 24, rotate: -12, scale: 0.6 }}
                  animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 420, damping: 14, delay: 0.2 + d * 0.035 }}
                >
                  {ch}
                </motion.span>
              );
            })}
          </span>
        </span>
      ))}
    </h1>
  );
}

const STEPS: { art: ArtName; t: TKey; s: TKey }[] = [
  { art: 'student', t: 's1t', s: 's1' },
  { art: 'advisor', t: 's2t', s: 's2' },
  { art: 'trophy', t: 's3t', s: 's3' },
];

function Arrow({ i }: { i: number }) {
  return (
    <motion.span
      aria-hidden
      className="text-[16px] text-leaf md:text-[20px] lg:text-[22px]"
      animate={{ x: [0, 3, 0] }}
      transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut', delay: i * 0.2 }}
    >
      ➜
    </motion.span>
  );
}

function Steps() {
  const { t } = useLang();
  return (
    <motion.div
      className="mt-3.5 grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-1 md:mt-5 md:gap-2 land:mt-2.5 lg:mt-6 lg:gap-2.5"
      initial="initial"
      animate="enter"
      variants={{ enter: { transition: { staggerChildren: 0.15, delayChildren: 0.5 } } }}
    >
      {STEPS.map((st, i) => (
        <StepWithArrow key={st.t} i={i} last={i === STEPS.length - 1}>
          <motion.div
            variants={rise}
            className="h-full rounded-[18px] border-2 border-mint2 bg-white px-1 py-2.5 text-center text-[12.5px] leading-[1.35] md:rounded-[20px] md:px-2 md:py-3.5 md:text-[15px] land:py-2 land:text-[12px] lg:rounded-[22px] lg:px-2.5 lg:py-4 lg:text-base"
          >
            <motion.span
              className="mx-auto mb-0.5 block h-[46px] w-[46px] md:mb-1 md:h-[62px] md:w-[62px] land:h-10 land:w-10 lg:mb-1.5 lg:h-[72px] lg:w-[72px]"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.6 }}
            >
              <Art name={st.art} className="h-full w-full" />
            </motion.span>
            <b className="block font-mitr text-[11px] font-medium text-leaf md:text-[12px] lg:text-[13px]">{t(st.t)}</b>
            <span>{t(st.s)}</span>
          </motion.div>
        </StepWithArrow>
      ))}
    </motion.div>
  );
}

function StepWithArrow({ children, i, last }: { children: ReactNode; i: number; last: boolean }) {
  return (
    <>
      {children}
      {!last && <Arrow i={i} />}
    </>
  );
}

type GameCardProps = {
  icon: 'cards' | 'wheel';
  iconBg: string;
  name: TKey;
  tag: TKey;
  desc: TKey;
  onClick: () => void;
};

/** Big home game card that tilts in 3D toward the pointer. */
function GameCard({ icon, iconBg, name, tag, desc, onClick }: GameCardProps) {
  const { t } = useLang();
  const reduce = useReducedMotion();
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotY = useSpring(useTransform(mx, [0, 1], [-10, 10]), { stiffness: 300, damping: 20 });
  const rotX = useSpring(useTransform(my, [0, 1], [10, -10]), { stiffness: 300, damping: 20 });

  const onMove = (e: PointerEvent<HTMLButtonElement>) => {
    if (reduce || e.pointerType === 'touch') return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };
  const reset = () => {
    mx.set(0.5);
    my.set(0.5);
  };

  return (
    <motion.div variants={rise} style={{ perspective: 700 }} className="md:h-full">
      <motion.button
        type="button"
        onClick={onClick}
        onPointerMove={onMove}
        onPointerLeave={reset}
        style={{ rotateX: rotX, rotateY: rotY, boxShadow: '0 7px 0 #0a2c20, 0 16px 30px rgba(0,0,0,.3)' }}
        whileHover={{ y: -3 }}
        whileTap={{ y: 5, scale: 0.99, boxShadow: '0 2px 0 #0a2c20, 0 8px 16px rgba(0,0,0,.3)' }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        className="group relative flex w-full items-center gap-3.5 overflow-hidden rounded-[24px] bg-[linear-gradient(160deg,#fff,#f1faf3)] p-4 text-left md:h-full md:flex-col md:items-start md:gap-4 md:p-5 land:flex-row land:items-center land:gap-3 land:p-3.5 lg:min-h-[220px] lg:flex-row lg:items-center lg:gap-6 lg:rounded-[28px] lg:p-6"
      >
        <Shine delay={icon === 'wheel' ? 0.6 : 0} />
        <div className="relative grid h-[66px] w-[66px] shrink-0 place-items-center rounded-[20px] md:h-[88px] md:w-[88px] md:rounded-[26px] land:h-14 land:w-14 land:rounded-[18px] lg:h-[clamp(96px,9vw,128px)] lg:w-[clamp(96px,9vw,128px)] lg:rounded-[32px]" style={{ background: iconBg }}>
          <motion.span
            className="block h-[50px] w-[50px] md:h-[70px] md:w-[70px] land:h-11 land:w-11 lg:h-[clamp(80px,7.6vw,108px)] lg:w-[clamp(80px,7.6vw,108px)]"
            animate={{ rotate: [0, 0, -14, 12, 0], scale: [1, 1, 1.1, 1.1, 1] }}
            transition={{ duration: 2.6, repeat: Infinity, times: [0, 0.7, 0.75, 0.85, 1], ease: 'easeInOut' }}
          >
            <Icon name={icon} className="h-full w-full" />
          </motion.span>
        </div>
        <div className="relative min-w-0 flex-1 md:flex md:w-full md:flex-col md:items-start lg:w-auto lg:flex lg:flex-col lg:items-start lg:self-stretch lg:justify-center">
          <h3 className="text-[20px] leading-snug text-green md:text-[24px] md:leading-tight land:text-lg lg:text-[clamp(24px,2.3vw,30px)]">
            {t(name)}
            <span className="ml-1.5 inline-block rounded-full bg-gold px-2.5 py-0.5 align-middle font-mitr text-[11px] whitespace-nowrap md:px-3 md:text-[13px] lg:text-[14px]">
              {t(tag, { s: TIME_LIMIT })}
            </span>
          </h3>
          <p className="mt-0.5 text-[14px] leading-[1.4] text-[#4a6357] md:mt-1.5 md:text-base md:text-pretty land:mt-0.5 land:text-[13px] lg:mt-2 lg:text-lg">{t(desc)}</p>
          <span
            aria-hidden
            className="relative mt-4 hidden items-center md:mt-auto md:inline-flex land:hidden lg:mt-4 gap-2 overflow-hidden rounded-full bg-[linear-gradient(180deg,var(--color-gold2),var(--color-gold))] px-6 py-2.5 font-mitr text-lg text-ink shadow-[0_5px_0_#c48f00] transition-transform duration-300 group-hover:translate-x-1 md:self-start lg:inline-flex"
          >
            {t('play')}
          </span>
        </div>
        <span aria-hidden className="relative ml-auto text-[22px] text-leaf transition-transform duration-300 group-hover:translate-x-1 md:hidden land:inline">
          ➜
        </span>
      </motion.button>
    </motion.div>
  );
}

export function Home({ onMemory, onWheel }: { onMemory: () => void; onWheel: () => void }) {
  const { t, lang } = useLang();
  return (
    <Screen label="Home">
      {/* phone: one column | tablet: game cards side by side | desktop: hero left, games right */}
      <div className="flex flex-col gap-3.5 md:my-auto md:gap-5 land:grid land:grid-cols-12 land:items-center land:gap-5 lg:grid lg:grid-cols-12 lg:items-center lg:gap-8">
      <GlassCard className="relative mt-16 pt-5 text-center md:mt-[92px] md:px-6 md:pb-6 land:col-span-7 land:mt-12 land:px-4 land:pt-3 land:pb-4 lg:col-span-7 lg:mt-28 lg:px-8 lg:pt-6 lg:pb-8">
        <motion.div
          className="mx-auto -mt-[86px] mb-0.5 block h-[132px] w-[132px] drop-shadow-[0_12px_14px_rgba(0,0,0,.25)] md:-mt-[108px] md:h-[156px] md:w-[156px] land:-mt-[58px] land:h-[84px] land:w-[84px] lg:-mt-[124px] lg:mb-1 lg:h-[180px] lg:w-[180px]"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Hubby wave className="h-full w-full" />
        </motion.div>
        <PopTitle text={t('homeTitle')} lang={lang} />
        <div className="bubble mt-2.5 md:mt-3.5 md:text-lg md:text-pretty land:mt-2 land:py-2 land:text-sm lg:mt-4 lg:px-6 lg:py-4 lg:text-xl lg:leading-[1.6]">
          <Rich text={t('homeBubble')} />
        </div>
        <Steps />
      </GlassCard>
      <div className="flex flex-col gap-3.5 md:grid md:grid-cols-2 md:gap-5 land:col-span-5 land:flex land:gap-3 land:pt-8 lg:col-span-5 lg:flex lg:gap-7 lg:pt-12">
        <GameCard icon="cards" iconBg="linear-gradient(135deg,#d8f3dc,#95d5b2)" name="gMname" tag="gMtag" desc="gMdesc" onClick={onMemory} />
        <GameCard icon="wheel" iconBg="linear-gradient(135deg,#fff1c7,#ffd76a)" name="gWname" tag="gWtag" desc="gWdesc" onClick={onWheel} />
      </div>
      </div>
      <motion.p variants={rise} className="mt-auto pt-3.5 text-center text-[12px] text-[#8fc2a6] md:text-[13px] land:pt-2 lg:text-sm">
        {t('foot')}
      </motion.p>
    </Screen>
  );
}
