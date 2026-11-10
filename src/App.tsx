import { cloneElement, useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import { Hubby } from './art';
import { Background } from './components/Background';
import { LangToggle } from './components/LangToggle';
import { QrOverlay } from './components/QrOverlay';
import { QrIcon } from './art/UiIcons';
import { MemoryIntro, MemoryPlay, MemoryResult, type MemoryOutcome } from './games/MemoryMatch';
import { WheelPlay, WheelResult } from './games/SpinWheel';
import { LangProvider, useLang } from './i18n';
import { Home } from './screens/Home';

type Route =
  | { name: 'home' }
  | { name: 'introM' }
  | { name: 'playM' }
  | { name: 'resM'; outcome: MemoryOutcome }
  | { name: 'playW' }
  | { name: 'resW'; score: number };

function Shell() {
  const [route, setRoute] = useState<Route>({ name: 'home' });
  // bumps on every new round so "Play again" remounts the game fresh
  const [round, setRound] = useState(0);

  const go = useCallback((r: Route) => {
    if (r.name === 'playM' || r.name === 'playW') setRound((n) => n + 1);
    setRoute(r);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [route]);

  // ---- QR overlay. Disabled while a Memory Match round runs, so its timer is never interrupted.
  const { t } = useLang();
  const [qrOpen, setQrOpen] = useState(false);
  const qrBtn = useRef<HTMLButtonElement>(null);
  const qrDisabled = route.name === 'playM';
  const qrDisabledRef = useRef(qrDisabled);
  useEffect(() => {
    qrDisabledRef.current = qrDisabled;
  }, [qrDisabled]);

  const closeQr = useCallback(() => {
    setQrOpen(false);
    if (window.location.hash === '#qr') {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    qrBtn.current?.focus();
  }, []);

  // Booth mode: https://.../#qr opens the overlay directly (on load or when the hash changes).
  useEffect(() => {
    const check = () => {
      if (window.location.hash === '#qr' && !qrDisabledRef.current) setQrOpen(true);
    };
    check();
    window.addEventListener('hashchange', check);
    return () => window.removeEventListener('hashchange', check);
  }, []);

  const home = () => go({ name: 'home' });
  const introM = () => go({ name: 'introM' });
  const playM = () => go({ name: 'playM' });
  const playW = () => go({ name: 'playW' });

  let screen;
  switch (route.name) {
    case 'home':
      screen = <Home onMemory={introM} onWheel={playW} />;
      break;
    case 'introM':
      screen = <MemoryIntro onStart={playM} onBack={home} />;
      break;
    case 'playM':
      screen = <MemoryPlay onDone={(outcome) => go({ name: 'resM', outcome })} />;
      break;
    case 'resM':
      screen = <MemoryResult outcome={route.outcome} onAgain={playM} onWheel={playW} onHome={home} />;
      break;
    case 'playW':
      screen = <WheelPlay onDone={(score) => go({ name: 'resW', score })} onQuit={home} />;
      break;
    case 'resW':
      screen = <WheelResult score={route.score} onAgain={playW} onMemory={introM} onHome={home} />;
      break;
  }

  return (
    <>
      <Background />
      <div className="relative z-[1] mx-auto flex min-h-dvh w-full overflow-x-clip max-w-[560px] flex-col px-3.5 pt-3.5 pb-7 md:max-w-[760px] md:px-8 land:max-w-[960px] land:px-6 land:pt-2 land:pb-3 lg:max-w-[1100px] xl:max-w-[1240px] 2xl:max-w-[1360px]">
        <header className="mb-3 flex items-center justify-between gap-2 land:mb-1.5">
          <motion.button
            type="button"
            onClick={home}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            className="flex min-h-[44px] items-center gap-2 rounded-full border border-white/15 bg-white/10 py-1 pr-3 pl-1.5 font-mitr text-[15px] whitespace-nowrap text-white backdrop-blur-md max-[359px]:pr-2.5 max-[359px]:text-[13px]"
          >
            <Hubby size={30} />
            <span className="max-[359px]:sr-only">SE Project Hub</span>
          </motion.button>
          <div className="flex items-center gap-2">
            <motion.button
              ref={qrBtn}
              type="button"
              onClick={() => setQrOpen(true)}
              disabled={qrDisabled}
              aria-label={t('qrAria')}
              aria-haspopup="dialog"
              whileHover={qrDisabled ? undefined : { scale: 1.05 }}
              whileTap={qrDisabled ? undefined : { scale: 0.92 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className={`flex h-[50px] min-w-[50px] items-center justify-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 font-mitr text-[14px] text-white backdrop-blur-md transition-opacity max-[399px]:px-0 ${qrDisabled ? 'opacity-40' : ''}`}
            >
              <QrIcon className="h-5 w-5" />
              <span className="max-[399px]:hidden">{t('qrBtn')}</span>
            </motion.button>
            <LangToggle />
          </div>
        </header>
        <main className="flex flex-1 flex-col">
          <AnimatePresence mode="wait">
            {cloneElement(screen, { key: `${route.name}-${round}` })}
          </AnimatePresence>
        </main>
      </div>
      <AnimatePresence>{qrOpen && <QrOverlay onClose={closeQr} />}</AnimatePresence>
    </>
  );
}

export default function App() {
  return (
    <LangProvider>
      <MotionConfig reducedMotion="user">
        <Shell />
      </MotionConfig>
    </LangProvider>
  );
}
