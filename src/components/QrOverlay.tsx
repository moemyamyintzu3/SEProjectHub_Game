import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { Hubby, Icon } from '../art';
import { HUBBY_LOGO_URI } from '../art/hubbyLogo';
import { CloseIcon, CopyIcon } from '../art/UiIcons';
import { SITE_LABEL, SITE_URL } from '../config';
import { useLang } from '../i18n';
import { Button } from './Button';

/** Internal drawing size of the QR. It is scaled with CSS, so this only sets the logo proportion. */
const QR_PX = 512;
const LOGO_PX = Math.round(QR_PX * 0.22); // level "H" tolerates ~30% damage; 22% keeps a safe margin

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // older browsers / non-secure context: fall back to a hidden textarea
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand('copy');
      ta.remove();
      return ok;
    } catch {
      return false;
    }
  }
}

const CORNERS = [
  'top-0 left-0 border-t-[5px] border-l-[5px] rounded-tl-2xl',
  'top-0 right-0 border-t-[5px] border-r-[5px] rounded-tr-2xl',
  'bottom-0 left-0 border-b-[5px] border-l-[5px] rounded-bl-2xl',
  'bottom-0 right-0 border-b-[5px] border-r-[5px] rounded-br-2xl',
];
// each bracket nudges toward the centre of the code
const NUDGE = [
  { x: 5, y: 5 },
  { x: -5, y: 5 },
  { x: 5, y: -5 },
  { x: -5, y: -5 },
];

export function QrOverlay({ onClose }: { onClose: () => void }) {
  const { t } = useLang();
  const reduce = useReducedMotion();
  const [copied, setCopied] = useState(false);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const copiedTimer = useRef(0);

  // Escape closes; body scroll is locked while open; focus starts on the close button.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeBtn.current?.focus();
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      window.clearTimeout(copiedTimer.current);
    };
  }, [onClose]);

  const copy = async () => {
    if (await copyText(SITE_URL)) {
      setCopied(true);
      window.clearTimeout(copiedTimer.current);
      copiedTimer.current = window.setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(4,28,20,0.7)] p-3 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="qr-title"
        className="glass relative max-h-[calc(100dvh-24px)] w-[92vw] max-w-[560px] overflow-y-auto text-center md:p-7 land:grid land:max-w-[820px] land:grid-cols-[auto_1fr] land:items-center land:gap-x-6 land:p-4 land:text-left lg:max-w-[720px] lg:p-9"
        initial={{ scale: 0.7, y: 40, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.85, y: 20, opacity: 0, transition: { duration: 0.18 } }}
        transition={{ type: 'spring', stiffness: 320, damping: 22 }}
      >
        <motion.button
          ref={closeBtn}
          type="button"
          onClick={onClose}
          aria-label={t('qrCloseAria')}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.9 }}
          className="absolute top-3 right-3 z-10 grid h-12 w-12 place-items-center rounded-full bg-em/10 text-green"
        >
          <CloseIcon className="h-6 w-6" />
        </motion.button>

        <Hubby wave className="mx-auto -mt-1 block h-16 w-16 md:h-20 md:w-20 land:col-start-2 land:row-start-1 land:mx-0 land:mt-0 land:h-14 land:w-14 lg:h-20 lg:w-20" />

        {/* QR block: left column on landscape phones */}
        <div className="land:col-start-1 land:row-span-5 land:row-start-1">
          <div className="relative mx-auto mt-3 w-[min(70vw,max(150px,calc(100dvh_-_412px)),340px)] p-3 land:mt-0 land:w-[min(calc(100dvh_-_64px),40vw)] md:w-[min(340px,calc(100dvh_-_420px))] lg:w-[min(460px,calc(100dvh_-_400px))]">
            {CORNERS.map((c, i) => (
              <motion.span
                key={i}
                aria-hidden
                className={`absolute h-9 w-9 border-leaf ${c}`}
                animate={reduce ? undefined : { x: [0, NUDGE[i].x, 0], y: [0, NUDGE[i].y, 0], opacity: [1, 0.55, 1] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              />
            ))}
            <motion.div
              className="rounded-[22px] border-4 border-gold bg-white p-1.5"
              animate={
                reduce
                  ? undefined
                  : { boxShadow: ['0 0 0 0 rgba(255,200,61,.55)', '0 0 0 14px rgba(255,200,61,0)', '0 0 0 0 rgba(255,200,61,0)'] }
              }
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut', times: [0, 0.7, 1] }}
            >
              <QRCodeSVG
                value={SITE_URL}
                size={QR_PX}
                level="H"
                fgColor="#0f3d2e"
                bgColor="#ffffff"
                marginSize={4}
                title={SITE_URL}
                imageSettings={{ src: HUBBY_LOGO_URI, width: LOGO_PX, height: LOGO_PX, excavate: true }}
                style={{ display: 'block', width: '100%', height: 'auto' }}
              />
            </motion.div>
          </div>
        </div>

        <h2 id="qr-title" className="mt-1 text-[24px] leading-tight text-green md:text-[28px] land:col-start-2 land:mt-1 land:px-0 land:pr-12 land:text-[22px] lg:text-[34px]">
          {t('qrTitle')}
        </h2>
        <p className="mt-1 text-[15px] text-[#3d5a4c] md:text-[17px] land:col-start-2 land:text-sm lg:text-lg">{t('qrSub')}</p>

        <p className="mt-3 font-mitr text-[20px] font-medium tracking-wide break-all text-green select-all md:text-[22px] land:col-start-2 land:mt-2 land:text-lg lg:text-[26px]">
          {SITE_LABEL}
        </p>

        <div className="mt-3 grid grid-cols-2 gap-2.5 land:col-start-2 land:mt-2 on-light">
          <Button onClick={copy} stagger={false} aria-live="polite" className="!px-3 whitespace-nowrap">
            <span className="inline-flex items-center justify-center gap-2">
              {copied ? <Icon name="check" className="h-6 w-6" /> : <CopyIcon className="h-5 w-5" />}
              {copied ? t('qrCopied') : t('qrCopy')}
            </span>
          </Button>
          <Button variant="ghost" onClick={onClose} stagger={false} className="!px-3 whitespace-nowrap">
            {t('qrClose')}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
