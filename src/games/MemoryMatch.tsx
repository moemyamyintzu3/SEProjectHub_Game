import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { AnimatePresence, motion, useAnimate, useReducedMotion } from 'framer-motion';
import { Avatar, Hubby, Icon } from '../art';
import { Button } from '../components/Button';
import { burstFrom } from '../components/Confetti';
import { GlassCard } from '../components/GlassCard';
import { ResultScreen } from '../components/ResultScreen';
import { Rich } from '../components/Rich';
import { Screen } from '../components/Screen';
import { useBump } from '../components/useBump';
import { PAIRS, TIME_LIMIT, TIME_URGENT, TIME_WARN, type Pair } from '../data';
import { useLang, type Lang } from '../i18n';
import { rise, stagger } from '../motion';

export type MemoryOutcome = { found: number; secs: number; out: boolean };

/* ============================ INTRO ============================ */

export function MemoryIntro({ onStart, onBack }: { onStart: () => void; onBack: () => void }) {
  const { t, lang } = useLang();
  return (
    <Screen label={t('gMname')} className="md:justify-center">
      <GlassCard className="md:p-7 land:grid land:grid-cols-2 land:items-center land:gap-x-6 land:gap-y-2.5 land:p-4 lg:grid lg:grid-cols-2 lg:items-center lg:gap-x-10 lg:gap-y-5 lg:p-10">
        <div className="land:col-start-1 lg:col-start-1">
        <motion.div
          className="mx-auto mb-1 block h-[84px] w-[84px] md:h-[108px] md:w-[108px] land:mb-0 land:h-12 land:w-12 lg:mb-2 lg:h-[120px] lg:w-[120px]"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Hubby wave className="h-full w-full" />
        </motion.div>
        <h2 className="text-center text-[26px] text-green md:text-[34px] land:text-[22px] lg:text-[clamp(32px,3vw,42px)]">{t('gMname')}</h2>
        <div className="bubble mt-2.5 text-center md:mt-3.5 md:px-5 md:text-lg md:text-pretty land:mt-1.5 land:px-3 land:py-2 land:text-sm lg:mt-4 lg:px-6 lg:py-4 lg:text-lg lg:text-pretty">
          <Rich text={t('mStory')} />
        </div>
        </div>
        <motion.div variants={stagger(0.08, 0.2)} className="mt-2.5 flex flex-wrap justify-center gap-1.5 md:mt-4 md:gap-2.5 land:col-start-2 land:row-span-3 land:row-start-1 land:mx-auto land:mt-0 land:max-w-[300px] land:gap-2 lg:col-start-2 lg:row-span-3 lg:row-start-1 lg:mx-auto lg:mt-0 lg:max-w-[calc(3*clamp(110px,10.5vw,140px)_+_26px)] lg:gap-3">
          {PAIRS.map((p) => (
            <motion.div
              key={p.k}
              variants={rise}
              className="w-[84px] rounded-[18px] border-2 bg-white px-1 pt-1.5 pb-1 text-center text-[12px] leading-[1.2] md:w-[116px] md:rounded-[20px] md:pt-2.5 md:pb-2 md:text-[15px] land:w-[92px] land:text-[13px] lg:w-[clamp(110px,10.5vw,140px)] lg:rounded-[22px] lg:border-[3px] lg:px-2 lg:pt-3 lg:pb-2.5 lg:text-base"
              style={{ borderColor: p.c }}
            >
              <Avatar name={p.k} className="mx-auto mb-0.5 block h-14 w-14 md:mb-1 md:h-20 md:w-20 land:h-14 land:w-14 lg:mb-1.5 lg:h-[clamp(76px,7.5vw,100px)] lg:w-[clamp(76px,7.5vw,100px)]" />
              {p[lang]}
            </motion.div>
          ))}
        </motion.div>
        <p className="mt-3 text-center text-[15px] text-[#3d5a4c] md:mt-4 md:text-[17px] md:text-pretty land:col-start-1 land:mt-0 land:text-sm lg:col-start-1 lg:mt-0 lg:text-lg lg:text-pretty">
          <Rich text={t('mHow', { s: TIME_LIMIT })} />
        </p>
        {/* desktop: buttons live inside the card, in the left column */}
        <div className="on-light hidden land:col-start-1 land:grid land:grid-cols-2 land:gap-2 lg:col-start-1 lg:grid lg:grid-cols-2 lg:gap-3">
          <Button onClick={onStart}>{t('start')}</Button>
          <Button variant="ghost" onClick={onBack}>
            {t('back')}
          </Button>
        </div>
      </GlassCard>
      <div className="contents land:hidden lg:hidden">
        <Button onClick={onStart}>{t('start')}</Button>
        <Button variant="ghost" onClick={onBack}>
          {t('back')}
        </Button>
      </div>
    </Screen>
  );
}

/* ============================ PLAY ============================ */

/** Board + HUD width: full on phones, 720px on tablets, up to 900px on desktop but never
    taller than the window (2 rows of 3:4.1 cards ≈ 0.55 × width, plus ~230px of chrome). */
const BOARD_W =
  'md:mx-auto md:w-full md:max-w-[720px] lg:max-w-[min(900px,calc((100dvh_-_250px)*1.8))] land:mx-auto land:w-full land:max-w-[calc((100dvh_-_120px)*1.8)]';

type Card = { pid: number; up: boolean; done: boolean; nope: boolean };
type Peek = 'remember' | 3 | 2 | 1 | 'go' | null;

function shuffledDeck(): Card[] {
  const deck: Card[] = [];
  PAIRS.forEach((_, i) => {
    deck.push({ pid: i, up: false, done: false, nope: false });
    deck.push({ pid: i, up: false, done: false, nope: false });
  });
  // Fisher–Yates: a fair shuffle every round
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

type CardProps = {
  card: Card;
  pair: Pair;
  index: number;
  lang: Lang;
  onFlip: (i: number) => void;
  setRef: (i: number, el: HTMLButtonElement | null) => void;
};

function MemoryCard({ card, pair, index, lang, onFlip, setRef }: CardProps) {
  const open = card.up || card.done;
  return (
    <motion.div
      initial={{ opacity: 0, y: -60, rotate: -12, scale: 0.6 }}
      animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 18, delay: index * 0.045 }}
      style={{ perspective: 900 }}
    >
      <motion.button
        ref={(el) => setRef(index, el)}
        type="button"
        disabled={card.done}
        aria-label={open ? pair[lang] : `${index + 1}`}
        onClick={() => onFlip(index)}
        className="relative block aspect-[3/4.1] w-full bg-transparent p-0"
        style={{ '--c': pair.c } as CSSProperties}
        animate={card.nope ? { x: [0, -6, 6, -6, 6, 0] } : card.done ? { scale: [1, 1.12, 1], x: 0 } : { x: 0, scale: 1 }}
        transition={card.nope ? { duration: 0.45 } : { duration: 0.5, ease: 'easeOut' }}
      >
        <motion.div
          className="absolute inset-0"
          style={{ transformStyle: 'preserve-3d' }}
          initial={false}
          animate={{ rotateY: open ? 180 : 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        >
          <div className="face face-back lg:!rounded-[22px]">
            <Hubby track={false} className="relative h-[62%] w-[62%]" />
            <span className="absolute bottom-1.5 font-mitr text-[14px] text-gold md:bottom-2 md:text-lg lg:bottom-2.5 lg:text-xl">?</span>
          </div>
          <div className={`face face-front lg:!rounded-[22px] ${card.done ? 'is-done' : ''}`}>
            <span className="flex min-h-0 w-full flex-1 items-center justify-center">
              <Avatar name={pair.k} className="h-[96%] w-[96%]" />
            </span>
            <span
              lang={lang}
              className="card-label w-full rounded-lg px-px py-0.5 text-[clamp(8.5px,2.45vw,12px)] leading-[1.15] md:rounded-[10px] md:text-[13px] land:text-[11px] lg:rounded-xl lg:py-1 lg:text-[clamp(12px,1.15vw,16px)] font-semibold text-white"
              style={{ background: pair.c }}
            >
              {pair[lang]}
            </span>
          </div>
        </motion.div>
      </motion.button>
    </motion.div>
  );
}

function Toast({ pair, lang }: { pair: Pair; lang: Lang }) {
  return (
    <motion.div
      role="status"
      initial={{ y: '140%', opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: '140%', opacity: 0 }}
      transition={{ type: 'spring', stiffness: 320, damping: 24 }}
      className="pointer-events-auto flex w-[min(92vw,520px)] items-center md:w-[min(92vw,560px)] gap-3 rounded-[20px] bg-white px-3.5 py-3 shadow-[0_16px_40px_rgba(0,0,0,.35)]"
      style={{ borderLeft: `8px solid ${pair.c}` }}
    >
      <motion.span
        className="grid h-[54px] w-[54px] shrink-0 place-items-center rounded-2xl"
        style={{ background: `color-mix(in srgb, ${pair.c} 18%, #fff)` }}
        initial={{ scale: 0.4, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 12, delay: 0.1 }}
      >
        <Avatar name={pair.k} className="h-12 w-12" />
      </motion.span>
      <div className="min-w-0">
        <b className="block font-mitr text-[16px] font-medium text-green">{pair[lang]} ×2</b>
        <span className="text-[14px] leading-[1.4] text-[#3d5a4c]">{pair.say[lang]}</span>
      </div>
    </motion.div>
  );
}

/** Countdown pill. Normal above 10 s; red, shaking and glowing at 10 s or less; stronger from 5 s. */
function TimerPill({ timeLeft, running, warn, label }: { timeLeft: number; running: boolean; warn: boolean; label: string }) {
  const reduce = useReducedMotion();
  const [pill, animatePill] = useAnimate<HTMLSpanElement>();
  const [clock, animateClock] = useAnimate<HTMLSpanElement>();

  // One shake per tick (retriggered whenever the number changes) while the clock runs in the warning zone.
  useEffect(() => {
    if (!running || !warn || reduce || !pill.current || !clock.current) return;
    const urgent = timeLeft <= TIME_URGENT;
    animatePill(
      pill.current,
      {
        x: urgent ? [0, -9, 9, -6, 6, 0] : [0, -6, 6, -4, 4, 0],
        scale: urgent ? [1, 1.1, 1] : [1, 1.03, 1],
        boxShadow: ['0 0 0 0 rgba(255,107,107,.65)', '0 0 0 10px rgba(255,107,107,0)'],
      },
      { duration: 0.4, ease: 'easeInOut', boxShadow: { duration: 0.9, ease: 'easeOut' } },
    );
    animateClock(clock.current, { rotate: [0, -12, 12, -8, 0] }, { duration: 0.4, ease: 'easeInOut' });
  }, [timeLeft, running, warn, reduce, animatePill, animateClock, pill, clock]);

  return (
    <span
      ref={pill}
      role="timer"
      aria-label={label}
      className={`hpill transition-colors duration-300 md:px-4 md:py-1.5 land:py-1 lg:px-5 lg:py-2 ${warn ? '!border-[#ffb3b3] !bg-coral' : ''}`}
    >
      <span ref={clock} className="icx !h-[1.25em] !w-[1.25em]">
        <Icon name="clock" />
      </span>
      <span className="relative inline-grid min-w-[1.3em] justify-items-end overflow-hidden tabular-nums" aria-hidden>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={timeLeft}
            className="col-start-1 row-start-1"
            initial={{ y: 12, scale: 0.6, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: -12, opacity: 0, transition: { duration: 0.18 } }}
            transition={{ type: 'spring', stiffness: 500, damping: 22 }}
          >
            {timeLeft}
          </motion.span>
        </AnimatePresence>
      </span>
      <span aria-hidden className="-ml-1">s</span>
    </span>
  );
}

export function MemoryPlay({ onDone }: { onDone: (o: MemoryOutcome) => void }) {
  const { t, lang } = useLang();
  const [cards, setCards] = useState<Card[]>(shuffledDeck);
  const cardsRef = useRef(cards);
  const [peek, setPeek] = useState<Peek>(null);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  // preview = deal + "Remember! 3-2-1-GO"; playing = clock running; over = time up or all pairs found
  const [phase, setPhase] = useState<'preview' | 'playing' | 'over'>('preview');
  const phaseRef = useRef<'preview' | 'playing' | 'over'>('preview');
  const endAtRef = useRef(0); // performance.now() deadline
  const [moves, setMoves] = useState(0);
  const [found, setFound] = useState(0);
  const [timeUp, setTimeUp] = useState(false);
  const [toast, setToast] = useState<{ pid: number; n: number } | null>(null);

  const lock = useRef(true);
  const out = useRef(false);
  const first = useRef<number | null>(null);
  const foundRef = useRef(0);
  const timers = useRef<number[]>([]);
  const interval = useRef(0);
  const toastTimer = useRef(0);
  const btns = useRef<(HTMLButtonElement | null)[]>([]);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  const pairsPill = useBump<HTMLSpanElement>(found);

  const update = useCallback((fn: (c: Card[]) => Card[]) => {
    cardsRef.current = fn(cardsRef.current);
    setCards(cardsRef.current);
  }, []);
  const later = (ms: number, fn: () => void) => {
    timers.current.push(window.setTimeout(fn, ms));
  };
  const stopClock = () => {
    window.clearInterval(interval.current);
    interval.current = 0;
  };
  const allUp = (up: boolean) => update((c) => c.map((x) => ({ ...x, up })));
  /** Seconds left, read from the deadline (never from possibly stale state). */
  const secondsLeft = () => Math.max(0, Math.ceil((endAtRef.current - performance.now()) / 1000));
  /** Ends the round exactly once. */
  const finish = () => {
    if (phaseRef.current !== 'playing') return false;
    phaseRef.current = 'over';
    setPhase('over');
    stopClock();
    lock.current = true;
    return true;
  };

  // Deal -> peek for 3 s with "Remember! 3-2-1-GO" -> flip down -> countdown starts
  useEffect(() => {
    later(800, () => {
      allUp(true);
      setPeek('remember');
    });
    ([3, 2, 1] as const).forEach((n, k) => later(1700 + k * 900, () => setPeek(n)));
    later(4400, () => {
      allUp(false);
      setPeek('go');
    });
    later(5000, () => {
      setPeek(null);
      lock.current = false;
      endAtRef.current = performance.now() + TIME_LIMIT * 1000;
      phaseRef.current = 'playing';
      setPhase('playing');
    });
    const ts = timers.current;
    return () => {
      ts.forEach(window.clearTimeout);
      timers.current = [];
      stopClock();
      window.clearTimeout(toastTimer.current);
    };
    // runs once per mounted round
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // The clock: one interval while playing, cleared when the phase changes or the screen unmounts.
  useEffect(() => {
    if (phase !== 'playing') return;
    const tick = () => {
      if (phaseRef.current !== 'playing') return;
      const left = secondsLeft();
      setTimeLeft(left);
      if (left === 0 && finish()) {
        out.current = true;
        setTimeUp(true);
        allUp(true);
        later(1600, () => doneRef.current({ found: foundRef.current, secs: TIME_LIMIT, out: true }));
      }
    };
    interval.current = window.setInterval(tick, 200);
    return stopClock;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const flip = (i: number) => {
    const c = cardsRef.current[i];
    if (lock.current || c.up || c.done) return;
    update((cs) => cs.map((x, j) => (j === i ? { ...x, up: true } : x)));
    if (first.current === null) {
      first.current = i;
      return;
    }
    setMoves((m) => m + 1);
    const a = first.current;
    const b = i;
    first.current = null;

    if (cardsRef.current[a].pid === cardsRef.current[b].pid) {
      later(350, () => {
        if (out.current) return;
        update((cs) => cs.map((x, j) => (j === a || j === b ? { ...x, done: true } : x)));
        foundRef.current += 1;
        setFound(foundRef.current);
        const pid = cardsRef.current[a].pid;
        burstFrom(btns.current[b], 35);
        setToast((prev) => ({ pid, n: (prev?.n ?? 0) + 1 }));
        window.clearTimeout(toastTimer.current);
        toastTimer.current = window.setTimeout(() => setToast(null), 2600);
        if (foundRef.current === PAIRS.length && !out.current) {
          const left = secondsLeft();
          if (finish()) {
            setTimeLeft(left);
            const secs = Math.max(1, TIME_LIMIT - left);
            later(1400, () => doneRef.current({ found: PAIRS.length, secs, out: false }));
          }
        }
      });
    } else {
      lock.current = true;
      later(450, () => update((cs) => cs.map((x, j) => (j === a || j === b ? { ...x, nope: true } : x))));
      later(1050, () => {
        update((cs) => cs.map((x, j) => (j === a || j === b ? { ...x, up: false, nope: false } : x)));
        lock.current = false;
      });
    }
  };

  const setRef = useCallback((i: number, el: HTMLButtonElement | null) => {
    btns.current[i] = el;
  }, []);

  const peekText = peek === null ? null : typeof peek === 'number' ? String(peek) : t(peek);

  return (
    <Screen label={t('gMname')} className="md:justify-center land:justify-start land:gap-2">
      <motion.div variants={rise} className={`flex items-center justify-between gap-2 px-0.5 font-mitr text-[20px] text-white md:text-[22px] land:text-base lg:text-2xl ${BOARD_W}`}>
        <TimerPill timeLeft={timeLeft} running={phase === 'playing'} warn={phase !== 'preview' && timeLeft <= TIME_WARN} label={`${timeLeft}${t('sec')}`} />
        <span ref={pairsPill} className="hpill md:px-4 md:py-1.5 land:py-1 lg:px-5 lg:py-2">
          <span className="icx !h-[1.25em] !w-[1.25em]">
            <Icon name="check" />
          </span>
          <span>{found}/5</span>
        </span>
        <span className="hpill md:px-4 md:py-1.5 land:py-1 lg:px-5 lg:py-2">
          <span className="icx !h-[1.25em] !w-[1.25em]">
            <Icon name="cards" />
          </span>
          <span>{moves}</span>
        </span>
      </motion.div>

      <div className="min-h-[30px] text-center font-mitr text-[20px] text-white md:text-[22px] land:min-h-0 land:text-lg lg:min-h-[36px] lg:text-2xl" aria-live="polite">
        <AnimatePresence>
          {timeUp && (
            <motion.div initial={{ opacity: 0, y: 20, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 15 }}>
              {t('timeUp')}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.div variants={rise} className={`relative ${BOARD_W}`}>
        <div className="grid grid-cols-5 gap-2 md:gap-2.5 lg:gap-3">
          {cards.map((c, i) => (
            <MemoryCard key={i} card={c} pair={PAIRS[c.pid]} index={i} lang={lang} onFlip={flip} setRef={setRef} />
          ))}
        </div>
        <div className="pointer-events-none absolute inset-0 z-[5] grid place-items-center" aria-live="assertive">
          <AnimatePresence mode="popLayout">
            {peekText && (
              <motion.b
                key={peekText}
                className="rounded-full bg-gold px-6 py-2.5 font-mitr text-[22px] font-semibold text-ink shadow-[0_8px_20px_rgba(0,0,0,.3)] lg:px-9 lg:py-3.5 lg:text-[32px]"
                initial={{ scale: 2.2, rotate: -8, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                exit={{ scale: 0.6, opacity: 0, transition: { duration: 0.15 } }}
                transition={{ type: 'spring', stiffness: 380, damping: 16 }}
              >
                {peekText}
              </motion.b>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <motion.p variants={rise} className="text-center text-[13px] text-[#bfe3cd] md:text-[15px] land:hidden lg:text-base">
        {t('mHint')}
      </motion.p>

      <div className="pointer-events-none fixed inset-x-0 bottom-[22px] z-40 flex justify-center px-4 land:bottom-2">
        <AnimatePresence mode="wait">{toast && <Toast key={toast.n} pair={PAIRS[toast.pid]} lang={lang} />}</AnimatePresence>
      </div>
    </Screen>
  );
}

/* ============================ RESULT ============================ */

export function MemoryResult({
  outcome,
  onAgain,
  onWheel,
  onHome,
}: {
  outcome: MemoryOutcome;
  onAgain: () => void;
  onWheel: () => void;
  onHome: () => void;
}) {
  const { t } = useLang();
  const { found, secs, out } = outcome;
  const win = found === PAIRS.length && !out;
  const level = win ? 1 : found >= 3 ? 2 : 3;
  const message = useMemo(() => (win ? t('mMsg', { s: secs }) : t('mMsgOut', { n: found })), [win, secs, found, t]);
  return (
    <ResultScreen
      score={found}
      total={5}
      level={level}
      title={t(`mT${level}`)}
      message={message}
      prize={win}
      lessonKey="mLearn"
      confetti={win ? 180 : 40}
    >
      <Button onClick={onAgain}>{t('again')}</Button>
      <Button variant="ghost" onClick={onWheel}>
        {t('tryW')}
      </Button>
      <Button variant="ghost" onClick={onHome}>
        {t('home')}
      </Button>
    </ResultScreen>
  );
}
