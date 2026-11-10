import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, animate, motion, useMotionValue, useMotionValueEvent, useReducedMotion } from 'framer-motion';
import { Art, Hubby, Icon } from '../art';
import { ART } from '../art/svgData';
import { Button } from '../components/Button';
import { burst, burstFrom } from '../components/Confetti';
import { ResultScreen } from '../components/ResultScreen';
import { Rich } from '../components/Rich';
import { Screen } from '../components/Screen';
import { useBump } from '../components/useBump';
import { QS, SPINS, TOPICS, WHEEL_POOL, type Question, type Topic, type TopicId } from '../data';
import { useLang, type Lang, type TKey } from '../i18n';
import { rise } from '../motion';

const N = TOPICS.length;
const SEG = 360 / N;
const SPIN_EASE = [0.12, 0.75, 0.12, 1] as const; // same curve as the prototype
const SPIN_SECONDS = 4.6;

function arc(i: number, r: number) {
  const a0 = ((i * SEG - SEG / 2) * Math.PI) / 180;
  const a1 = ((i * SEG + SEG / 2) * Math.PI) / 180;
  return `M0 0 L${r * Math.sin(a0)} ${-r * Math.cos(a0)} A${r} ${r} 0 0 1 ${r * Math.sin(a1)} ${-r * Math.cos(a1)} Z`;
}

/* ============================ WHEEL ART ============================ */

const LABEL_SIZE = 13;
/** Long labels get ~85% size so they stay inside their segment ("Coordinator", "ความปลอดภัย"). */
function wheelLabelSize(tp: Topic, lang: Lang) {
  const long = lang === 'th' ? tp.th.length > 6 : tp.en.length > 8;
  return long ? Math.round(LABEL_SIZE * 0.85) : LABEL_SIZE;
}

function WheelFace({ lang }: { lang: Lang }) {
  return (
    <>
      <defs>
        <radialGradient id="shade">
          <stop offset="55%" stopColor="#fff" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity=".18" />
        </radialGradient>
      </defs>
      {TOPICS.map((tp, i) => (
        <path key={tp.id} d={arc(i, 146)} fill={tp.c} stroke="#fff" strokeWidth="3" />
      ))}
      {TOPICS.map((tp, i) => (
        <g key={tp.id} transform={`rotate(${i * SEG})`}>
          <circle cx="0" cy="-104" r="21" fill="#fff" opacity=".92" />
          <svg x="-19" y="-123" width="38" height="38" viewBox="0 0 100 100" dangerouslySetInnerHTML={{ __html: ART[tp.em] }} />
          <text
            x="0"
            y="-72"
            textAnchor="middle"
            fontFamily="Mitr"
            fontSize={wheelLabelSize(tp, lang)}
            fill={tp.id === 'bonus' ? '#0b2219' : '#fff'}
            fontWeight="500"
          >
            {tp[lang]}
          </text>
        </g>
      ))}
      <circle r="146" fill="url(#shade)" />
    </>
  );
}

/** Rim bulbs: alternate bulbs blink; much faster while spinning. */
function Bulbs({ spinning }: { spinning: boolean }) {
  const reduce = useReducedMotion();
  const period = spinning ? 0.25 : 1;
  const step = (t: number) => (t < 0.5 ? 0 : 1);
  return (
    <div key={spinning ? 'fast' : 'slow'} className="pointer-events-none absolute -inset-2">
      {Array.from({ length: 18 }, (_, i) => {
        const a = (i * 20 * Math.PI) / 180;
        const s = Math.sin(a);
        const c = Math.cos(a);
        return (
          <span
            key={i}
            className="absolute -m-[5px] h-2.5 w-2.5 rounded-full bg-[#5b4a14]"
            style={{ left: `calc(50% + ${s * 50}% - ${s * 2}px)`, top: `calc(50% - ${c * 50}% + ${c * 2}px)` }}
          >
            <motion.span
              className="absolute inset-0 rounded-full bg-[#fff3c4] shadow-[0_0_8px_2px_#ffc83d]"
              animate={reduce ? { opacity: 1 } : { opacity: [1, 0] }}
              transition={{ duration: period, repeat: Infinity, ease: step, delay: i % 2 ? period / 2 : 0 }}
            />
          </span>
        );
      })}
    </div>
  );
}

/* ============================ MODAL ============================ */

type ModalState =
  | { tp: Topic; bonus: true }
  | { tp: Topic; bonus: false; q: Question; answered: number | null };

const KEYS = ['A', 'B', 'C'];

function TopicChip({ tp, lang }: { tp: Topic; lang: Lang }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-mitr text-[15px] md:px-4 md:text-base land:py-1 land:text-sm lg:px-5 lg:py-2 lg:text-lg"
      style={{ background: tp.c, color: tp.id === 'bonus' ? '#0b2219' : '#fff' }}
    >
      <span className="icx !h-[1.6em] !w-[1.6em] rounded-full bg-white p-px">
        <Art name={tp.em} />
      </span>
      {tp[lang]}
    </span>
  );
}

function QuestionModal({
  m,
  last,
  onPick,
  onClose,
}: {
  m: ModalState;
  last: boolean;
  onPick: (i: number, el: HTMLButtonElement | null) => void;
  onClose: () => void;
}) {
  const { t, lang } = useLang();
  const btns = useRef<(HTMLButtonElement | null)[]>([]);
  const nextKey: TKey = last ? 'seeResult' : m.bonus ? 'yay' : 'nextSpin';
  const answered = !m.bonus && m.answered !== null;

  return (
    <motion.div
      className="fixed inset-0 z-30 flex items-center justify-center bg-[rgba(4,28,20,.6)] p-4 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={m.tp[lang]}
        className="glass max-h-[calc(100dvh-32px)] w-full max-w-[520px] overflow-y-auto text-center md:max-w-[600px] md:p-7 land:max-w-[640px] land:p-4 lg:max-w-[640px] lg:p-8 lg:[@media(max-height:760px)]:py-5"
        initial={{ scale: 0.6, y: 40, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.85, y: 20, opacity: 0, transition: { duration: 0.18 } }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <TopicChip tp={m.tp} lang={lang} />

        {m.bonus ? (
          <>
            <div className="mt-2.5">
              <motion.span
                className="inline-block h-[120px] w-[120px] md:h-[136px] md:w-[136px] land:h-20 land:w-20 lg:h-[150px] lg:w-[150px]"
                animate={{ rotate: [-10, 10], scale: [1, 1.15], y: [0, -10] }}
                transition={{ duration: 1, repeat: Infinity, repeatType: 'mirror', type: 'spring', stiffness: 200, damping: 6 }}
              >
                <Icon name="gift" className="h-full w-full" />
              </motion.span>
            </div>
            <div className="my-3 font-mitr text-[22px] leading-[1.35] text-green md:text-[26px] land:my-1.5 land:text-xl lg:text-3xl">{t('bonusT')}</div>
            <p className="text-[17px] lg:text-xl">{t('bonusS')}</p>
          </>
        ) : (
          <>
            <div className="mt-2 land:hidden">
              <motion.span
                className="inline-block h-[104px] w-[104px] md:h-[120px] md:w-[120px] land:h-14 land:w-14 lg:h-[130px] lg:w-[130px] lg:[@media(max-height:760px)]:h-[92px] lg:[@media(max-height:760px)]:w-[92px]"
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0, y: [0, -8, 0] }}
                transition={{
                  scale: { type: 'spring', stiffness: 300, damping: 12, delay: 0.1 },
                  rotate: { type: 'spring', stiffness: 300, damping: 12, delay: 0.1 },
                  y: { duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay: 0.6 },
                }}
              >
                <Art name={m.tp.em} className="h-full w-full" />
              </motion.span>
            </div>
            <div className="my-3 font-mitr text-[22px] leading-[1.35] text-green md:text-[26px] land:my-1.5 land:text-lg lg:my-4 lg:text-3xl lg:leading-[1.3] lg:[@media(max-height:760px)]:my-2.5 lg:[@media(max-height:760px)]:text-[26px]">{m.q.q[lang]}</div>
            <div className="grid gap-2.5 land:grid-cols-1 land:gap-1.5">
              {m.q.o.map((o, i) => {
                const right = answered && i === m.q.a;
                const wrong = answered && i === m.answered && i !== m.q.a;
                const dim = answered && !right && !wrong;
                return (
                  <motion.button
                    key={i}
                    ref={(el) => {
                      btns.current[i] = el;
                    }}
                    type="button"
                    disabled={answered}
                    onClick={() => onPick(i, btns.current[m.q.a])}
                    className={`flex min-h-[52px] items-center gap-2.5 rounded-[18px] border-[3px] px-3.5 py-3 text-left text-[16px] text-ink transition-colors duration-200 md:min-h-[58px] md:text-[17px] land:min-h-[40px] land:py-1.5 land:text-[15px] lg:min-h-[64px] lg:gap-3.5 lg:px-5 lg:py-4 lg:text-lg lg:[@media(max-height:760px)]:min-h-[54px] lg:[@media(max-height:760px)]:py-3 ${
                      right ? 'border-[#2fb36b] bg-[#e3f7e8]' : wrong ? 'border-coral bg-[#ffecec]' : `border-mint2 bg-white ${answered ? '' : 'hover:border-leaf'}`
                    }`}
                    initial={{ opacity: 0, y: 30, scale: 0.94 }}
                    animate={
                      right
                        ? { opacity: 1, y: 0, scale: [1, 1.05, 1], x: 0 }
                        : wrong
                          ? { opacity: 1, y: 0, scale: 1, x: [0, -7, 7, -7, 7, 0] }
                          : { opacity: dim ? 0.45 : 1, y: 0, scale: 1, x: 0 }
                    }
                    transition={
                      answered
                        ? { duration: 0.45 }
                        : { type: 'spring', stiffness: 300, damping: 20, delay: 0.2 + i * 0.09 }
                    }
                    whileHover={answered ? undefined : { x: 4, scale: 1.02 }}
                    whileTap={answered ? undefined : { scale: 0.97 }}
                  >
                    <span className="grid h-[30px] w-[30px] shrink-0 place-items-center rounded-[10px] bg-[#f1faf3] font-mitr text-leaf land:h-6 land:w-6 lg:h-9 lg:w-9 lg:text-lg">
                      {KEYS[i]}
                    </span>
                    <span>{o[lang]}</span>
                  </motion.button>
                );
              })}
            </div>
            <AnimatePresence>
              {answered && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className={`mt-3 rounded-2xl px-3 py-2.5 text-left text-[15px] leading-[1.45] md:text-base land:mt-2 land:py-1.5 land:text-sm lg:px-4 lg:py-3 lg:text-lg ${m.answered === m.q.a ? 'bg-[#e3f7e8]' : 'bg-[#ffecec]'}`}
                >
                  <Rich text={(m.answered === m.q.a ? t('correct') : t('oops')) + m.q.why[lang]} />
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}

        {(m.bonus || answered) && (
          <motion.div className="mt-3.5 land:mt-2" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: m.bonus ? 0.4 : 0.15 }}>
            <Button onClick={onClose} autoFocus stagger={false}>
              {t(nextKey)}
            </Button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}

/* ============================ PLAY ============================ */

type Banner = { k: 'wReady' | 'wSpinning' | 'wDone' } | { k: 'wLeft'; n: number };

export function WheelPlay({ onDone, onQuit }: { onDone: (score: number) => void; onQuit: () => void }) {
  const { t, lang } = useLang();
  const reduce = useReducedMotion();
  const [score, setScore] = useState(0);
  const [spinsUsed, setSpinsUsed] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [modal, setModal] = useState<ModalState | null>(null);
  const [banner, setBanner] = useState<Banner>({ k: 'wReady' });
  const [bannerN, setBannerN] = useState(0); // re-pops the banner text
  const scoreRef = useRef(0);
  const used = useRef<Partial<Record<TopicId, number[]>>>({});
  const timers = useRef<number[]>([]);
  const rot = useMotionValue(0);
  const pointerRot = useMotionValue(0);
  const lastSeg = useRef(0);
  const scorePill = useBump<HTMLSpanElement>(score);

  useEffect(() => {
    const ts = timers.current;
    return () => ts.forEach(window.clearTimeout);
  }, []);
  const later = (ms: number, fn: () => void) => {
    timers.current.push(window.setTimeout(fn, ms));
  };
  const showBanner = (b: Banner) => {
    setBanner(b);
    setBannerN((n) => n + 1);
  };

  // Pointer flicks each time a segment edge passes under it, so it slows down with the wheel.
  useMotionValueEvent(rot, 'change', (v) => {
    const seg = Math.floor((v + SEG / 2) / SEG);
    if (seg !== lastSeg.current) {
      lastSeg.current = seg;
      if (!reduce) animate(pointerRot, [-16, 6, 0], { duration: 0.16, ease: 'easeOut' });
    }
  });

  const addScore = () => {
    scoreRef.current += 1;
    setScore(scoreRef.current);
  };

  const landed = (k: number) => {
    setSpinning(false);
    const n = spinsUsed + 1;
    setSpinsUsed(n);
    const tp = TOPICS[k];
    let next: ModalState;
    if (tp.id === 'bonus') {
      next = { tp, bonus: true };
    } else {
      const list = QS[tp.id];
      const seen = (used.current[tp.id] ??= []);
      let qi = [0, 1].find((i) => !seen.includes(i));
      if (qi === undefined) qi = Math.floor(Math.random() * list.length);
      seen.push(qi);
      next = { tp, bonus: false, q: list[qi], answered: null };
    }
    later(350, () => {
      setModal(next);
      if (next.bonus) {
        addScore();
        burst(120);
      }
    });
  };

  const spin = () => {
    if (spinning || modal || spinsUsed >= SPINS) return;
    setSpinning(true);
    showBanner({ k: 'wSpinning' });
    const k = WHEEL_POOL[Math.floor(Math.random() * WHEEL_POOL.length)];
    const jitter = Math.random() * SEG * 0.6 - SEG * 0.3;
    const current = rot.get();
    const base = Math.ceil((current + 1440) / 360) * 360; // at least 4 full turns
    const target = base + ((360 - k * SEG) % 360) + jitter;
    animate(rot, target, { duration: reduce ? 0.6 : SPIN_SECONDS, ease: SPIN_EASE, onComplete: () => landed(k) });
  };

  const pick = (i: number, rightEl: HTMLButtonElement | null) => {
    if (!modal || modal.bonus || modal.answered !== null) return;
    setModal({ ...modal, answered: i });
    if (i === modal.q.a) {
      addScore();
      burstFrom(rightEl, 50);
    }
  };

  const closeModal = () => {
    setModal(null);
    if (spinsUsed >= SPINS) {
      showBanner({ k: 'wDone' });
      later(500, () => onDone(scoreRef.current));
    } else {
      showBanner({ k: 'wLeft', n: SPINS - spinsUsed });
    }
  };

  const bannerText = banner.k === 'wLeft' ? t('wLeft', { n: banner.n }) : t(banner.k);
  const canSpin = !spinning && !modal && spinsUsed < SPINS;

  return (
    <Screen
      label={t('gWname')}
      className="md:justify-center land:grid land:grid-cols-[1fr_1fr] land:grid-rows-[1fr_auto_auto_auto_auto_1fr] land:items-center land:gap-x-6 land:gap-y-2.5 lg:grid lg:grid-cols-[3fr_2fr] lg:grid-rows-[1fr_auto_auto_auto_auto_1fr] lg:items-center lg:gap-x-12 lg:gap-y-5"
    >
      <motion.div variants={rise} className="flex items-center justify-between gap-2 px-0.5 font-mitr text-[20px] text-white md:mx-auto md:w-full md:max-w-[480px] md:text-[22px] land:col-start-2 land:row-start-3 land:max-w-none land:text-lg lg:col-start-2 lg:row-start-3 lg:max-w-none lg:text-2xl">
        <span ref={scorePill} className="hpill md:px-4 md:py-1.5 land:py-1 lg:px-5 lg:py-2" aria-label={`score ${score}`}>
          <span className="icx !h-[1.25em] !w-[1.25em]">
            <Icon name="star" />
          </span>
          <span>{score}</span>
        </span>
        <span className="hpill md:px-4 md:py-1.5 land:py-1 lg:px-5 lg:py-2">
          <span>{t('spins')}</span>
          <span className="flex gap-1.5" aria-label={`${SPINS - spinsUsed}/${SPINS}`}>
            {Array.from({ length: SPINS }, (_, i) => {
              const isUsed = i < spinsUsed;
              return (
                <motion.i
                  key={i}
                  className="block h-3.5 w-3.5 rounded-full"
                  animate={{
                    scale: isUsed ? 0.7 : 1,
                    backgroundColor: isUsed ? 'rgba(255,255,255,.2)' : '#ffc83d',
                    boxShadow: isUsed ? '0 0 0px rgba(255,200,61,0)' : '0 0 8px rgba(255,200,61,.7)',
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                />
              );
            })}
          </span>
        </span>
      </motion.div>

      <div className="min-h-[30px] text-center font-mitr text-[20px] text-white md:text-[22px] land:col-start-2 land:row-start-2 land:min-h-0 land:text-lg land:leading-snug lg:col-start-2 lg:row-start-2 lg:min-h-[76px] lg:content-end lg:text-[clamp(22px,2vw,28px)] lg:leading-snug" aria-live="polite">
        <motion.div
          key={bannerN}
          initial={{ opacity: 0, y: 16, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 380, damping: 18 }}
        >
          {bannerText}
        </motion.div>
      </div>

      <motion.div
        variants={rise}
        className="relative mx-auto mt-2 aspect-square w-[min(88vw,380px)] md:w-[min(80vw,480px)] land:col-start-1 land:row-span-6 land:row-start-1 land:my-3 land:w-[min(calc(100dvh_-_130px),440px)] lg:col-start-1 lg:row-span-6 lg:row-start-1 lg:my-5 lg:w-[min(80vh,560px,calc(100dvh_-_200px))]"
      >
        <motion.div
          className="absolute -inset-3.5 rounded-full blur-[1px]"
          style={{ background: 'conic-gradient(from 0deg,#ffc83d,#40916c,#ffc83d,#95d5b2,#ffc83d)' }}
          animate={reduce ? undefined : { rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
        />
        <div className="absolute -inset-2 rounded-full bg-green shadow-[0_20px_40px_rgba(0,0,0,.45),inset_0_0_0_3px_rgba(255,255,255,.2)]" />
        <Bulbs spinning={spinning} />
        <motion.svg viewBox="-150 -150 300 300" className="absolute inset-0 h-full w-full will-change-transform" style={{ rotate: rot }} aria-hidden>
          <WheelFace lang={lang} />
        </motion.svg>
        <div className="absolute top-1/2 left-1/2 z-[2] grid h-[26%] w-[26%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white shadow-[0_6px_16px_rgba(0,0,0,.3),inset_0_0_0_4px_#ffc83d]">
          <Hubby className="h-[78%] w-[78%]" />
        </div>
        <motion.svg
          viewBox="0 0 44 54"
          aria-hidden
          className="absolute -top-[22px] left-1/2 z-[3] -ml-[22px] h-[54px] w-11 drop-shadow-[0_4px_4px_rgba(0,0,0,.35)]"
          style={{ rotate: pointerRot, originX: 0.5, originY: 0.2 }}
        >
          <path d="M22 52 L4 14 A20 20 0 1 1 40 14 Z" fill="#ffc83d" stroke="#fff" strokeWidth="3" />
          <circle cx="22" cy="18" r="7" fill="#fff" />
        </motion.svg>
      </motion.div>

      <div className="contents md:mx-auto md:flex md:w-full md:max-w-[480px] md:flex-col md:gap-3.5 land:col-start-2 land:row-span-2 land:row-start-4 land:flex land:max-w-none land:flex-col land:gap-2.5 lg:col-start-2 lg:row-span-2 lg:row-start-4 lg:max-w-none lg:gap-4">
        <Button onClick={spin} disabled={!canSpin} breathe className="!py-[17px] !text-[22px] md:!text-[24px] land:!py-3 land:!text-[20px] lg:!py-6 lg:!text-[30px]">
          <Rich text={t('spin')} />
        </Button>
        <Button variant="ghost" onClick={onQuit}>
          {t('quit')}
        </Button>
      </div>

      <AnimatePresence>
        {modal && <QuestionModal key={spinsUsed} m={modal} last={spinsUsed >= SPINS} onPick={pick} onClose={closeModal} />}
      </AnimatePresence>
    </Screen>
  );
}

/* ============================ RESULT ============================ */

export function WheelResult({
  score,
  onAgain,
  onMemory,
  onHome,
}: {
  score: number;
  onAgain: () => void;
  onMemory: () => void;
  onHome: () => void;
}) {
  const { t } = useLang();
  const level = score >= 3 ? 1 : score >= 2 ? 2 : 3;
  const win = score >= 2;
  return (
    <ResultScreen score={score} total={3} level={level} title={t(`wT${level}`)} prize={win} lessonKey="wLearn" confetti={win ? 180 : 0}>
      <Button onClick={onAgain}>{t('again')}</Button>
      <Button variant="ghost" onClick={onMemory}>
        {t('tryM')}
      </Button>
      <Button variant="ghost" onClick={onHome}>
        {t('home')}
      </Button>
    </ResultScreen>
  );
}
