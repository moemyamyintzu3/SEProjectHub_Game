import { motion } from 'framer-motion';
import { useLang, type Lang } from '../i18n';

const OPTIONS: { id: Lang; label: string }[] = [
  { id: 'th', label: 'ไทย' },
  { id: 'en', label: 'EN' },
];

/** TH / EN switch with a sliding gold pill (shared layoutId). */
export function LangToggle() {
  const { lang, setLang } = useLang();
  return (
    <div
      role="group"
      aria-label="Language"
      className="flex rounded-full border border-white/15 bg-white/10 p-[3px] backdrop-blur-md"
    >
      {OPTIONS.map((o) => {
        const on = lang === o.id;
        return (
          <motion.button
            key={o.id}
            type="button"
            aria-pressed={on}
            onClick={() => setLang(o.id)}
            whileTap={{ scale: 0.92 }}
            className={`relative min-h-[44px] min-w-[56px] rounded-full px-4 font-mitr text-[14px] transition-colors duration-300 ${on ? 'text-ink' : 'text-white'}`}
          >
            {on && (
              <motion.span
                layoutId="lang-pill"
                className="absolute inset-0 rounded-full bg-gold shadow-[0_4px_14px_rgba(255,200,61,.5)]"
                transition={{ type: 'spring', stiffness: 420, damping: 28 }}
              />
            )}
            <span className="relative">{o.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
