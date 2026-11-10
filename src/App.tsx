import { cloneElement, useCallback, useEffect, useState } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import { Hubby } from './art';
import { Background } from './components/Background';
import { LangToggle } from './components/LangToggle';
import { MemoryIntro, MemoryPlay, MemoryResult, type MemoryOutcome } from './games/MemoryMatch';
import { WheelPlay, WheelResult } from './games/SpinWheel';
import { LangProvider } from './i18n';
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
            SE Project Hub
          </motion.button>
          <LangToggle />
        </header>
        <main className="flex flex-1 flex-col">
          <AnimatePresence mode="wait">
            {cloneElement(screen, { key: `${route.name}-${round}` })}
          </AnimatePresence>
        </main>
      </div>
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
