import { glueThai } from './thaiWrap';
import { createContext, createElement, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

/* All TH/EN text, copied verbatim from the prototype (object T).
   Strings may contain light HTML (<b>, <br>, <span class='hl'>) and [[icon]] tokens,
   which <Rich> renders as drawn SVG icons. */
export const T = {
  en: {
    homeTitle: "Hi! I'm Hubby",
    homeBubble:
      "Our website <b>SE Project Hub</b> is like a <span class='hl'><b>smart school bag</b></span> for university projects. It keeps every project in <b>one place</b>, so nothing gets lost!",
    s1t: 'STEP 1',
    s1: 'Students send their project',
    s2t: 'STEP 2',
    s2: 'Advisors (teachers) check & give a grade',
    s3t: 'STEP 3',
    s3: 'Saved forever for future students',
    gMname: 'Match the Pairs!',
    gMtag: '{s} sec',
    gMdesc: 'Flip the cards and find the 2 same characters.',
    gWname: 'Spin the Hub Wheel!',
    gWtag: '3 spins',
    gWdesc: 'Spin, land on a topic, answer one easy question.',
    foot: 'SE Project Hub · Software Engineering · Mae Fah Luang University · InnoFest 2026',
    mStory: 'Oh no, my friends got mixed up! <br>Find the <b>2 same cards</b> to make <b>5 pairs</b>. Meet the SE Project Hub team:',
    mHow: 'You can look at all the cards for 3 seconds first. Then you have only <b>{s} seconds</b> to find all 5 pairs!',
    mHint: 'Tap 2 cards. Same character = match!',
    start: 'Start!',
    back: 'Back',
    again: 'Play again',
    home: 'Home',
    quit: 'Quit',
    tryW: 'Play “Spin the Hub Wheel!”',
    tryM: 'Play “Match the Pairs!”',
    remember: 'Remember!',
    go: 'GO!',
    sec: ' sec',
    mT1: 'Memory Master!',
    mT2: 'So close!',
    mT3: 'Good try!',
    mMsg: 'All 5 pairs in {s} seconds!',
    mMsgOut: "Time's up! You found {n} of 5 pairs.",
    timeUp: "Time's up!",
    prize: '[[gift]] You win a prize! Show this screen to our team.',
    learnT: '[[bulb]] What did you learn?',
    mLearn:
      "In SE Project Hub, <b>everything has its place</b> and <b>everyone has their job</b>: students send projects, advisors (teachers) give scores, and the coordinator handles classes. That's why nothing gets lost!",
    spins: 'Spins',
    spin: 'SPIN! [[wheel]]',
    wReady: 'Tap SPIN and see where it stops!',
    wSpinning: 'Spinning…',
    wLeft: '{n} spin(s) left!',
    wDone: 'All done!',
    correct: '[[check]] Correct! ',
    oops: '[[oops]] Oops! ',
    nextSpin: 'Next spin ➜',
    play: 'Play ➜',
    qrBtn: 'QR',
    qrAria: 'Show QR code',
    qrTitle: 'Scan to play on your phone!',
    qrSub: 'Point your phone camera at the QR code',
    qrCopy: 'Copy link',
    qrCopied: 'Copied!',
    qrClose: 'Close',
    qrCloseAria: 'Close QR code',
    seeResult: 'See my result',
    bonusT: 'Lucky Bonus!',
    bonusS: 'Free point for you! +1',
    yay: 'Yay! ➜',
    wT1: 'Hub Champion!',
    wT2: 'Nice!',
    wT3: 'Good try!',
    wLearn:
      'Each part of the wheel is a real part of SE Project Hub. <b>Students</b> send work, <b>advisors</b> (teachers) give fair scores, the <b>coordinator</b> organizes classes, the <b>archive</b> keeps old projects, and <b>login</b> keeps everything safe.',
  },
  th: {
    homeTitle: 'สวัสดี! เราชื่อฮับบี้',
    homeBubble:
      "เว็บไซต์ <b>SE Project Hub</b> ของเรา เหมือน<span class='hl'><b>กระเป๋านักเรียนอัจฉริยะ</b></span>ของโปรเจกต์มหาวิทยาลัย เก็บทุกโปรเจกต์ไว้<b>ในที่เดียว</b> ไม่มีหายอีกแล้ว!",
    s1t: 'ขั้นที่ 1',
    s1: 'นักศึกษาส่งโปรเจกต์',
    s2t: 'ขั้นที่ 2',
    s2: 'อาจารย์ตรวจและให้คะแนน',
    s3t: 'ขั้นที่ 3',
    s3: 'เก็บไว้ให้รุ่นน้องดูได้ตลอด',
    gMname: 'จับคู่ให้ไว!',
    gMtag: '{s} วินาที',
    gMdesc: 'เปิดการ์ด หาตัวละครที่เหมือนกัน 2 ใบ',
    gWname: 'หมุนวงล้อ Hub!',
    gWtag: 'หมุน 3 ครั้ง',
    gWdesc: 'หมุนวงล้อ แล้วตอบคำถามง่าย ๆ 1 ข้อ',
    foot: 'SE Project Hub · วิศวกรรมซอฟต์แวร์ · มหาวิทยาลัยแม่ฟ้าหลวง · InnoFest 2026',
    mStory: 'แย่แล้ว เพื่อน ๆ ของเราปนกันหมด! <br>ช่วยหา<b>การ์ดที่เหมือนกัน 2 ใบ</b> ให้ครบ <b>5 คู่</b> มารู้จักทีม SE Project Hub กัน:',
    mHow: 'จะได้ดูการ์ดทั้งหมด 3 วินาทีก่อนเริ่ม แล้วมีเวลาแค่ <b>{s} วินาที</b> หาให้ครบ 5 คู่!',
    mHint: 'แตะการ์ด 2 ใบ ถ้าเป็นตัวละครเดียวกัน = ถูก!',
    start: 'เริ่มเลย!',
    back: 'ย้อนกลับ',
    again: 'เล่นอีกครั้ง',
    home: 'หน้าแรก',
    quit: 'ออก',
    tryW: 'เล่นเกม “หมุนวงล้อ Hub!”',
    tryM: 'เล่นเกม “จับคู่ให้ไว!”',
    remember: 'จำให้ดีนะ!',
    go: 'ลุย!',
    sec: ' วินาที',
    mT1: 'เซียนความจำ!',
    mT2: 'เกือบแล้ว!',
    mT3: 'พยายามได้ดี!',
    mMsg: 'จับคู่ครบ 5 คู่ ใน {s} วินาที!',
    mMsgOut: 'หมดเวลา! หาได้ {n} จาก 5 คู่',
    timeUp: 'หมดเวลา!',
    prize: '[[gift]] ได้รับรางวัล! โชว์หน้าจอนี้ให้ทีมเราดูได้เลย',
    learnT: '[[bulb]] ได้เรียนรู้อะไรบ้าง?',
    mLearn:
      'ใน SE Project Hub <b>ทุกอย่างมีที่ของมัน</b> และ<b>ทุกคนมีหน้าที่ของตัวเอง</b> นักศึกษาส่งงาน อาจารย์ให้คะแนน ผู้ดูแลจัดการรายวิชา เลยไม่มีอะไรหายเลย!',
    spins: 'หมุนได้',
    spin: 'หมุนเลย! [[wheel]]',
    wReady: 'กดปุ่มหมุน แล้วดูว่าจะหยุดที่ไหน!',
    wSpinning: 'กำลังหมุน…',
    wLeft: 'เหลืออีก {n} ครั้ง!',
    wDone: 'ครบแล้ว!',
    correct: '[[check]] ถูกต้อง! ',
    oops: '[[oops]] อุ๊ปส์! ',
    nextSpin: 'หมุนต่อ ➜',
    play: 'เล่นเลย ➜',
    qrBtn: 'QR',
    qrAria: 'แสดง QR Code',
    qrTitle: 'สแกนเพื่อเล่นบนมือถือ!',
    qrSub: 'เปิดกล้องมือถือแล้วส่องที่ QR Code ได้เลย',
    qrCopy: 'คัดลอกลิงก์',
    qrCopied: 'คัดลอกแล้ว!',
    qrClose: 'ปิด',
    qrCloseAria: 'ปิด QR Code',
    seeResult: 'ดูผลคะแนน',
    bonusT: 'โบนัสนำโชค!',
    bonusS: 'ได้คะแนนฟรี +1',
    yay: 'เย้! ➜',
    wT1: 'แชมป์แห่ง Hub!',
    wT2: 'ดีมาก!',
    wT3: 'พยายามได้ดี!',
    wLearn:
      'ทุกช่องบนวงล้อคือส่วนจริงของ SE Project Hub: <b>นักศึกษา</b>ส่งงาน <b>อาจารย์</b>ให้คะแนนอย่างยุติธรรม <b>ผู้ดูแล</b>จัดการรายวิชา <b>คลังโปรเจกต์</b>เก็บงานเก่า และ<b>การล็อกอิน</b>ทำให้ทุกอย่างปลอดภัย',
  },
} as const;

export type Lang = keyof typeof T;
export type TKey = keyof (typeof T)['en'];

const STORAGE_KEY = 'sehub_lang';

function readLang(): Lang {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === 'en' || v === 'th' ? v : 'th';
  } catch {
    return 'th';
  }
}

type LangCtx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  /** Raw string (may contain HTML + [[icon]] tokens). Replaces {placeholders}. */
  t: (key: TKey, vars?: Record<string, string | number>) => string;
};

const Ctx = createContext<LangCtx | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readLang);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* private mode: keep the choice in memory only */
    }
  }, []);

  const t = useCallback(
    (key: TKey, vars?: Record<string, string | number>) => {
      let s: string = lang === 'th' ? glueThai(T.th[key]) : T.en[key];
      if (vars) for (const [k, v] of Object.entries(vars)) s = s.replace(`{${k}}`, String(v));
      return s;
    },
    [lang],
  );

  return createElement(Ctx.Provider, { value: { lang, setLang, t } }, children);
}

export function useLang() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useLang must be used inside <LangProvider>');
  return c;
}
