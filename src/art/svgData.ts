/* Hand-drawn SVG artwork, copied verbatim from the prototype (index.html: AV + ICONS).
   Every piece is drawn on a 0 0 100 100 viewBox. */

const SKIN = '#f6d3b2',
  SKIN2 = '#efc39c';
const face = (ink = '#2b2118') => `<ellipse cx="42" cy="47" rx="3.2" ry="3.8" fill="${ink}"/><ellipse cx="58" cy="47" rx="3.2" ry="3.8" fill="${ink}"/>
 <circle cx="43.2" cy="45.6" r="1.2" fill="#fff"/><circle cx="59.2" cy="45.6" r="1.2" fill="#fff"/>
 <circle cx="35" cy="54" r="4" fill="#ff9e9e" opacity=".6"/><circle cx="65" cy="54" r="4" fill="#ff9e9e" opacity=".6"/>
 <path d="M44 55 Q50 61 56 55" stroke="#7a3b2e" stroke-width="2.6" fill="none" stroke-linecap="round"/>`;
const headBase = `<rect x="44" y="60" width="12" height="14" rx="4" fill="${SKIN2}"/><circle cx="28" cy="47" r="5" fill="${SKIN2}"/><circle cx="72" cy="47" r="5" fill="${SKIN2}"/><circle cx="50" cy="44" r="22" fill="${SKIN}"/>`;

export const AV = {
  student: `<path d="M16 100 Q18 74 50 72 Q82 74 84 100Z" fill="#fff" stroke="#dfe7e2" stroke-width="2"/>
  <path d="M29 78 L34 100" stroke="#2d6a4f" stroke-width="7" stroke-linecap="round"/><path d="M71 78 L66 100" stroke="#2d6a4f" stroke-width="7" stroke-linecap="round"/>
  <path d="M50 75 L46 81 L50 97 L54 81Z" fill="#1b4332"/><path d="M42 73 L50 80 L58 73" fill="none" stroke="#cfd8d2" stroke-width="2"/>
  ${headBase}
  <path d="M27 47 Q24 18 50 18 Q76 18 73 47 Q72 34 64 30 Q56 37 44 33 Q36 37 31 32 Q28 38 27 47Z" fill="#2b2118"/>
  ${face()}`,
  advisor: `<path d="M16 100 Q18 74 50 72 Q82 74 84 100Z" fill="#e9a23b"/>
  <path d="M40 73 L50 93 L60 73 Q50 70 40 73Z" fill="#fff"/><circle cx="50" cy="97" r="1.8" fill="#b8741c"/>
  <rect x="64" y="80" width="3.4" height="11" rx="1.7" fill="#e5484d"/>
  ${headBase}
  <circle cx="50" cy="17" r="9" fill="#6b4f3a"/>
  <path d="M27 48 Q24 21 50 21 Q76 21 73 48 Q70 31 50 30 Q30 31 27 48Z" fill="#6b4f3a"/>
  ${face()}
  <circle cx="42" cy="47" r="7.2" fill="rgba(255,255,255,.3)" stroke="#3b2a20" stroke-width="2.4"/><circle cx="58" cy="47" r="7.2" fill="rgba(255,255,255,.3)" stroke="#3b2a20" stroke-width="2.4"/>
  <path d="M49.2 46.5 L50.8 46.5" stroke="#3b2a20" stroke-width="2.4"/>`,
  coordinator: `<path d="M16 100 Q18 74 50 72 Q82 74 84 100Z" fill="#2f4b8c"/>
  <path d="M41 73 L50 90 L59 73 Q50 70 41 73Z" fill="#fff"/>
  <path d="M42 75 L47 89 M58 75 L53 89" stroke="#ffc83d" stroke-width="2.5"/><rect x="43" y="88" width="14" height="10" rx="2" fill="#fff" stroke="#ffc83d" stroke-width="1.8"/>
  ${headBase}
  <path d="M27 45 Q25 19 50 19 Q75 19 73 45 Q70 30 58 28 Q49 34 37 30 Q30 34 27 45Z" fill="#4a2f1f"/>
  <path d="M25 46 Q25 14 50 14 Q75 14 75 46" fill="none" stroke="#1d1d1d" stroke-width="3.6"/>
  <rect x="20" y="40" width="9" height="13" rx="3.5" fill="#1d1d1d"/><rect x="71" y="40" width="9" height="13" rx="3.5" fill="#1d1d1d"/>
  <path d="M25 52 Q28 62 39 61" stroke="#1d1d1d" stroke-width="2.5" fill="none"/><circle cx="40" cy="61" r="2.6" fill="#1d1d1d"/>
  ${face()}`,
  document: `<path d="M24 60 Q14 57 11 48" stroke="#6a3d9a" stroke-width="4" fill="none" stroke-linecap="round"/>
  <path d="M76 60 Q86 57 89 48" stroke="#6a3d9a" stroke-width="4" fill="none" stroke-linecap="round"/>
  <ellipse cx="40" cy="94" rx="7" ry="3.5" fill="#6a3d9a"/><ellipse cx="60" cy="94" rx="7" ry="3.5" fill="#6a3d9a"/>
  <path d="M32 10 H60 L76 26 V82 Q76 90 68 90 H32 Q24 90 24 82 V18 Q24 10 32 10Z" fill="#fff" stroke="#6a3d9a" stroke-width="3"/>
  <path d="M60 10 V22 Q60 26 64 26 H76" fill="#efe3fb" stroke="#6a3d9a" stroke-width="3" stroke-linejoin="round"/>
  <rect x="32" y="22" width="20" height="4" rx="2" fill="#d9c6ee"/><rect x="32" y="31" width="36" height="4" rx="2" fill="#d9c6ee"/><rect x="32" y="40" width="30" height="4" rx="2" fill="#d9c6ee"/>
  <ellipse cx="42" cy="60" rx="3.2" ry="3.8" fill="#2b2118"/><ellipse cx="58" cy="60" rx="3.2" ry="3.8" fill="#2b2118"/>
  <circle cx="43.2" cy="58.6" r="1.2" fill="#fff"/><circle cx="59.2" cy="58.6" r="1.2" fill="#fff"/>
  <circle cx="35" cy="67" r="4" fill="#ff9e9e" opacity=".6"/><circle cx="65" cy="67" r="4" fill="#ff9e9e" opacity=".6"/>
  <path d="M44 68 Q50 74 56 68" stroke="#7a3b2e" stroke-width="2.6" fill="none" stroke-linecap="round"/>`,
  comment: `<path d="M16 22 Q16 12 26 12 H74 Q84 12 84 22 V60 Q84 70 74 70 H46 L30 85 L33 70 H26 Q16 70 16 60Z" fill="#00a6a6"/>
  <path d="M24 21 Q26 18 33 18" stroke="#fff" opacity=".55" stroke-width="3.5" fill="none" stroke-linecap="round"/>
  <circle cx="40" cy="38" r="6.5" fill="#fff"/><circle cx="60" cy="38" r="6.5" fill="#fff"/>
  <circle cx="41" cy="39" r="3.4" fill="#0b2219"/><circle cx="61" cy="39" r="3.4" fill="#0b2219"/>
  <circle cx="32" cy="50" r="4" fill="#ff9e9e" opacity=".75"/><circle cx="68" cy="50" r="4" fill="#ff9e9e" opacity=".75"/>
  <path d="M42 50 Q50 59 58 50 Z" fill="#fff"/>
  <path d="M80 84 c-3.5-5-11-1.5-7.5 4.5 l7.5 7 7.5-7 c3.5-6-4-9.5-7.5-4.5z" fill="#ff6b6b"/>`,
} as const;

export const ICONS = {
  star: `<path d="M50.0 10.0 L62.3 37.0 L91.8 40.4 L70.0 60.5 L75.9 89.6 L50.0 75.0 L24.1 89.6 L30.0 60.5 L8.2 40.4 L37.7 37.0Z" fill="#ffc83d" stroke="#f0a500" stroke-width="7" stroke-linejoin="round"/><path d="M38 30 Q44 24 48 22" stroke="#fff6c9" stroke-width="4" fill="none" stroke-linecap="round" opacity=".8"/><ellipse cx="42" cy="52" rx="3.4" ry="4" fill="#2b2118"/><ellipse cx="58" cy="52" rx="3.4" ry="4" fill="#2b2118"/><circle cx="43.3" cy="50.5" r="1.3" fill="#fff"/><circle cx="59.3" cy="50.5" r="1.3" fill="#fff"/><circle cx="34" cy="60" r="4.2" fill="#ff8f8f" opacity=".6"/><circle cx="66" cy="60" r="4.2" fill="#ff8f8f" opacity=".6"/><path d="M44 60 Q50 66 56 60" stroke="#7a3b2e" stroke-width="3" fill="none" stroke-linecap="round"/>`,
  clock: `<circle cx="24" cy="20" r="11" fill="#ffc83d" stroke="#d99a00" stroke-width="3"/><circle cx="76" cy="20" r="11" fill="#ffc83d" stroke="#d99a00" stroke-width="3"/><path d="M28 86 L22 95 M72 86 L78 95" stroke="#1b4332" stroke-width="6" stroke-linecap="round"/><circle cx="50" cy="54" r="38" fill="#fff" stroke="#2d6a4f" stroke-width="7"/><path d="M50 26 V34" stroke="#2d6a4f" stroke-width="4" stroke-linecap="round"/><ellipse cx="42" cy="52" rx="3.4" ry="4" fill="#2b2118"/><ellipse cx="58" cy="52" rx="3.4" ry="4" fill="#2b2118"/><circle cx="43.3" cy="50.5" r="1.3" fill="#fff"/><circle cx="59.3" cy="50.5" r="1.3" fill="#fff"/><circle cx="34" cy="62" r="4.2" fill="#ff8f8f" opacity=".6"/><circle cx="66" cy="62" r="4.2" fill="#ff8f8f" opacity=".6"/><path d="M44 63 Q50 69 56 63" stroke="#7a3b2e" stroke-width="3" fill="none" stroke-linecap="round"/>`,
  check: `<circle cx="50" cy="50" r="42" fill="#2fb36b"/><circle cx="50" cy="50" r="42" fill="none" stroke="#1f8a50" stroke-width="5"/><path d="M30 52 L44 66 L72 36" stroke="#fff" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M24 34 Q30 22 42 17" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" opacity=".45"/>`,
  cards: `<rect x="14" y="22" width="44" height="60" rx="9" fill="#95d5b2" stroke="#2d6a4f" stroke-width="4" transform="rotate(-14 36 52)"/><rect x="42" y="16" width="44" height="62" rx="9" fill="#2d6a4f" stroke="#1b4332" stroke-width="4" transform="rotate(10 64 47)"/><g transform="rotate(10 64 47)"><rect x="50" y="34" width="28" height="20" rx="7" fill="#e6f7ea"/><circle cx="58" cy="44" r="3.2" fill="#0b2219"/><circle cx="70" cy="44" r="3.2" fill="#0b2219"/><path d="M60 62 Q64 66 68 62" stroke="#ffc83d" stroke-width="3" fill="none" stroke-linecap="round"/></g>`,
  wheel: `<circle cx="50" cy="50" r="46" fill="#0f3d2e"/><path d="M50 50 L30.0 15.4 A40 40 0 0 1 70.0 15.4Z" fill="#2d9c6b"/><path d="M50 50 L70.0 15.4 A40 40 0 0 1 90.0 50.0Z" fill="#f4a100"/><path d="M50 50 L90.0 50.0 A40 40 0 0 1 70.0 84.6Z" fill="#3a86ff"/><path d="M50 50 L70.0 84.6 A40 40 0 0 1 30.0 84.6Z" fill="#8e44ad"/><path d="M50 50 L30.0 84.6 A40 40 0 0 1 10.0 50.0Z" fill="#e5484d"/><path d="M50 50 L10.0 50.0 A40 40 0 0 1 30.0 15.4Z" fill="#ffc83d"/><circle cx="50" cy="50" r="40" fill="none" stroke="#fff" stroke-width="3"/><circle cx="50" cy="50" r="13" fill="#fff"/><circle cx="46" cy="49" r="2.4" fill="#0b2219"/><circle cx="54" cy="49" r="2.4" fill="#0b2219"/><path d="M46 54 Q50 57 54 54" stroke="#0b2219" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M42 2 L58 2 L50 16Z" fill="#ffc83d" stroke="#fff" stroke-width="2"/>`,
  gift: `<path d="M50 26 Q34 6 26 16 Q20 26 50 26 Q80 26 74 16 Q66 6 50 26Z" fill="#ffc83d" stroke="#e0a000" stroke-width="3"/><rect x="14" y="26" width="72" height="18" rx="6" fill="#ff7a7a"/><rect x="20" y="42" width="60" height="48" rx="8" fill="#ff6b6b"/><rect x="44" y="26" width="12" height="64" fill="#ffc83d"/><ellipse cx="42" cy="60" rx="3.4" ry="4" fill="#5a1414"/><ellipse cx="58" cy="60" rx="3.4" ry="4" fill="#5a1414"/><circle cx="43.3" cy="58.5" r="1.3" fill="#fff"/><circle cx="59.3" cy="58.5" r="1.3" fill="#fff"/><circle cx="34" cy="70" r="4.2" fill="#fff" opacity=".6"/><circle cx="66" cy="70" r="4.2" fill="#fff" opacity=".6"/><path d="M44 70 Q50 76 56 70" stroke="#5a1414" stroke-width="3" fill="none" stroke-linecap="round"/>`,
  bulb: `<path d="M50 4 V12 M18 18 L24 24 M82 18 L76 24 M8 48 H16 M84 48 H92" stroke="#ffc83d" stroke-width="5" stroke-linecap="round"/><path d="M50 16 Q78 16 78 46 Q78 60 66 70 V78 H34 V70 Q22 60 22 46 Q22 16 50 16Z" fill="#ffe27a" stroke="#f0a500" stroke-width="4"/><rect x="34" y="78" width="32" height="8" rx="3" fill="#8a9a92"/><rect x="38" y="86" width="24" height="8" rx="4" fill="#6b7b73"/><ellipse cx="42" cy="46" rx="3.4" ry="4" fill="#2b2118"/><ellipse cx="58" cy="46" rx="3.4" ry="4" fill="#2b2118"/><circle cx="43.3" cy="44.5" r="1.3" fill="#fff"/><circle cx="59.3" cy="44.5" r="1.3" fill="#fff"/><circle cx="34" cy="55" r="4.2" fill="#ff8f8f" opacity=".6"/><circle cx="66" cy="55" r="4.2" fill="#ff8f8f" opacity=".6"/><path d="M44 56 Q50 62 56 56" stroke="#7a3b2e" stroke-width="3" fill="none" stroke-linecap="round"/>`,
  trophy: `<path d="M28 24 H14 Q12 44 32 50 M72 24 H86 Q88 44 68 50" stroke="#f0a500" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M26 14 H74 V40 Q74 64 50 66 Q26 64 26 40Z" fill="#ffc83d" stroke="#f0a500" stroke-width="4"/><rect x="44" y="64" width="12" height="14" fill="#f0a500"/><rect x="30" y="78" width="40" height="12" rx="4" fill="#2d6a4f"/><ellipse cx="42" cy="36" rx="3.4" ry="4" fill="#2b2118"/><ellipse cx="58" cy="36" rx="3.4" ry="4" fill="#2b2118"/><circle cx="43.3" cy="34.5" r="1.3" fill="#fff"/><circle cx="59.3" cy="34.5" r="1.3" fill="#fff"/><circle cx="34" cy="45" r="4.2" fill="#ff8f8f" opacity=".6"/><circle cx="66" cy="45" r="4.2" fill="#ff8f8f" opacity=".6"/><path d="M44 46 Q50 52 56 46" stroke="#7a3b2e" stroke-width="3" fill="none" stroke-linecap="round"/>`,
  books: `<rect x="16" y="70" width="70" height="18" rx="5" fill="#ffc83d" stroke="#d99a00" stroke-width="3"/><rect x="22" y="50" width="62" height="20" rx="5" fill="#00a6a6" stroke="#007f7f" stroke-width="3"/><rect x="12" y="20" width="66" height="30" rx="6" fill="#8e44ad" stroke="#6a3d9a" stroke-width="3"/><rect x="70" y="74" width="12" height="10" rx="2" fill="#fff" opacity=".7"/><rect x="18" y="55" width="0" height="0"/><ellipse cx="42" cy="34" rx="3.4" ry="4" fill="#fff"/><ellipse cx="58" cy="34" rx="3.4" ry="4" fill="#fff"/><circle cx="43.3" cy="32.5" r="1.3" fill="#fff"/><circle cx="59.3" cy="32.5" r="1.3" fill="#fff"/><path d="M44 40 Q50 45 56 40" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="33" cy="40" r="4" fill="#ffb3e6" opacity=".7"/><circle cx="67" cy="40" r="4" fill="#ffb3e6" opacity=".7"/>`,
  lock: `<path d="M30 46 V32 Q30 12 50 12 Q70 12 70 32 V46" stroke="#8a9a92" stroke-width="9" fill="none" stroke-linecap="round"/><rect x="18" y="42" width="64" height="50" rx="14" fill="#ff6b6b" stroke="#d94848" stroke-width="4"/><ellipse cx="42" cy="62" rx="3.4" ry="4" fill="#5a1414"/><ellipse cx="58" cy="62" rx="3.4" ry="4" fill="#5a1414"/><circle cx="43.3" cy="60.5" r="1.3" fill="#fff"/><circle cx="59.3" cy="60.5" r="1.3" fill="#fff"/><circle cx="34" cy="72" r="4.2" fill="#fff" opacity=".6"/><circle cx="66" cy="72" r="4.2" fill="#fff" opacity=".6"/><path d="M44 72 Q50 78 56 72" stroke="#5a1414" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="50" cy="84" r="3" fill="#ffc83d"/>`,
  oops: `<circle cx="50" cy="52" r="40" fill="#ffd37a" stroke="#f0a500" stroke-width="4"/><path d="M80 18 Q88 30 80 36 Q72 30 80 18Z" fill="#7cc8ff"/><path d="M36 44 L44 48 M64 44 L56 48" stroke="#2b2118" stroke-width="3.5" stroke-linecap="round"/><ellipse cx="42" cy="54" rx="3.4" ry="4" fill="#2b2118"/><ellipse cx="58" cy="54" rx="3.4" ry="4" fill="#2b2118"/><ellipse cx="50" cy="70" rx="6" ry="5" fill="#7a3b2e"/><circle cx="34" cy="64" r="4.2" fill="#ff8f8f" opacity=".6"/><circle cx="66" cy="64" r="4.2" fill="#ff8f8f" opacity=".6"/>`,
  heart: `<path d="M50 88 L16 54 Q2 38 14 22 Q30 6 50 28 Q70 6 86 22 Q98 38 84 54Z" fill="#ff6b6b" stroke="#e04e4e" stroke-width="4" stroke-linejoin="round"/><ellipse cx="42" cy="48" rx="3.4" ry="4" fill="#5a1414"/><ellipse cx="58" cy="48" rx="3.4" ry="4" fill="#5a1414"/><circle cx="43.3" cy="46.5" r="1.3" fill="#fff"/><circle cx="59.3" cy="46.5" r="1.3" fill="#fff"/><path d="M44 57 Q50 63 56 57" stroke="#5a1414" stroke-width="3" fill="none" stroke-linecap="round"/>`,
} as const;

export type AvatarName = keyof typeof AV;
export type IconName = keyof typeof ICONS;
export type ArtName = AvatarName | IconName;

export const ART: Record<ArtName, string> = { ...AV, ...ICONS };
