/* Thai has no spaces, so browsers break lines using a dictionary. English loanwords
   (โปรเจกต์, คอมเมนต์ ...) are missing from it and get split mid-word ("โปรเจ|กต์").
   We glue them with an invisible WORD JOINER (U+2060) between graphemes so they never split.
   The visible text is unchanged. */
const LOANWORDS = [
  'โปรเจกต์',
  'คอมเมนต์',
  'เวอร์ชัน',
  'อัปโหลด',
  'แฟลชไดรฟ์',
  'ล็อกอิน',
  'อินเทอร์เน็ต',
  'ไอเดีย',
  'ซอฟต์แวร์',
  'การ์ด',
  'วิศวกรรม',
  'มือถือ',
  'ลิงก์',
];

const WJ = '⁠';

function graphemes(s: string): string[] {
  try {
    return [...new Intl.Segmenter('th', { granularity: 'grapheme' }).segment(s)].map((x) => x.segment);
  } catch {
    return [...s];
  }
}

const GLUED = LOANWORDS.map((w) => [w, graphemes(w).join(WJ)] as const);
const cache = new Map<string, string>();

export function glueThai(s: string): string {
  const hit = cache.get(s);
  if (hit !== undefined) return hit;
  let out = s;
  for (const [w, g] of GLUED) out = out.split(w).join(g);
  cache.set(s, out);
  return out;
}

/** Glue every `th` string inside an object tree (in place). */
export function glueThaiDeep<T>(obj: T): T {
  const walk = (o: unknown) => {
    if (Array.isArray(o)) o.forEach(walk);
    else if (o && typeof o === 'object') {
      const rec = o as Record<string, unknown>;
      for (const k of Object.keys(rec)) {
        if (k === 'th' && typeof rec[k] === 'string') rec[k] = glueThai(rec[k] as string);
        else walk(rec[k]);
      }
    }
  };
  walk(obj);
  return obj;
}
