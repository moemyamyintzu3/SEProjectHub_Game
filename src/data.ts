/* Game data copied verbatim from the prototype (PAIRS, TOPICS, QS). */
import type { ArtName, AvatarName } from './art';
import type { Lang } from './i18n';
import { glueThaiDeep } from './thaiWrap';

type L = Record<Lang, string>;

export type Pair = { k: AvatarName; c: string; en: string; th: string; say: L };

export const PAIRS: Pair[] = glueThaiDeep([
  { k: 'student', c: '#2d9c6b', en: 'Student', th: 'นักศึกษา',
    say: { en: 'Students send their project and build their team.', th: 'นักศึกษาส่งโปรเจกต์และจัดทีมของตัวเอง' } },
  { k: 'advisor', c: '#f4a100', en: 'Advisor', th: 'อาจารย์',
    say: { en: 'Advisors check the work and give fair scores.', th: 'อาจารย์ที่ปรึกษาตรวจงานและให้คะแนนอย่างยุติธรรม' } },
  { k: 'coordinator', c: '#3a86ff', en: 'Coordinator', th: 'ผู้ดูแล',
    say: { en: 'Coordinators manage classes, accounts and reports.', th: 'ผู้ดูแลหลักสูตรจัดการรายวิชา บัญชีผู้ใช้ และรายงาน' } },
  { k: 'document', c: '#8e44ad', en: 'Document', th: 'เอกสาร',
    say: { en: 'All project files are saved safely in one place.', th: 'ไฟล์โปรเจกต์ทั้งหมดถูกเก็บไว้อย่างปลอดภัยในที่เดียว' } },
  { k: 'comment', c: '#00a6a6', en: 'Comment', th: 'คอมเมนต์',
    say: { en: 'Advisors leave comments so students can improve.', th: 'อาจารย์คอมเมนต์ให้ นักศึกษาก็นำไปปรับปรุงงานได้' } },
]);

export type TopicId = 'stu' | 'adv' | 'coo' | 'arc' | 'safe' | 'bonus';
export type Topic = { id: TopicId; em: ArtName; c: string; en: string; th: string };

export const TOPICS: Topic[] = [
  { id: 'stu', em: 'student', c: '#2d6a4f', en: 'Student', th: 'นักศึกษา' },
  { id: 'adv', em: 'advisor', c: '#f4a100', en: 'Advisor', th: 'อาจารย์' },
  { id: 'coo', em: 'coordinator', c: '#3a86ff', en: 'Coordinator', th: 'ผู้ดูแล' },
  { id: 'arc', em: 'books', c: '#8e44ad', en: 'Archive', th: 'คลังงาน' },
  { id: 'safe', em: 'lock', c: '#e5484d', en: 'Safety', th: 'ความปลอดภัย' },
  { id: 'bonus', em: 'gift', c: '#ffc83d', en: 'Bonus', th: 'โบนัส' },
];

export type Question = { em: string; q: L; o: L[]; a: number; why: L };

export const QS: Record<Exclude<TopicId, 'bonus'>, Question[]> = glueThaiDeep({
  stu: [
    { em: '', q: { en: 'You finished your project. Where should you put it?', th: 'ทำโปรเจกต์เสร็จแล้ว ควรเก็บไว้ที่ไหน?' },
      o: [{ en: 'Upload it to SE Project Hub', th: 'อัปโหลดขึ้น SE Project Hub' }, { en: 'Keep it on a USB drive', th: 'เก็บไว้ในแฟลชไดรฟ์' }, { en: 'Send it in a group chat', th: 'ส่งในแชทกลุ่ม' }], a: 0,
      why: { en: 'In the Hub, your advisor and team always see the newest version.', th: 'ใน Hub อาจารย์และเพื่อนในทีมจะเห็นงานเวอร์ชันล่าสุดเสมอ' } },
    { em: '', q: { en: 'Who adds friends to the project team?', th: 'ใครเป็นคนเพิ่มเพื่อนเข้าทีมโปรเจกต์?' },
      o: [{ en: 'The student', th: 'นักศึกษา' }, { en: 'The security guard', th: 'ยามหน้ามหาลัย' }, { en: 'Nobody', th: 'ไม่มีใคร' }], a: 0,
      why: { en: 'Students build their own team in the Submit Project page.', th: 'นักศึกษาเพิ่มเพื่อนเข้าทีมได้เองในหน้าส่งโปรเจกต์' } },
  ],
  adv: [
    { em: '', q: { en: 'Who gives the project a score?', th: 'ใครเป็นคนให้คะแนนโปรเจกต์?' },
      o: [{ en: 'The student gives themselves a score', th: 'นักศึกษาให้คะแนนตัวเอง' }, { en: 'The advisor (teacher)', th: 'อาจารย์ที่ปรึกษา' }, { en: 'A robot picks a random number', th: 'หุ่นยนต์สุ่มตัวเลข' }], a: 1,
      why: { en: 'The advisor checks the work and gives the score.', th: 'อาจารย์ที่ปรึกษาตรวจงานแล้วให้คะแนน' } },
    { em: '', q: { en: 'What helps the advisor give a FAIR score?', th: 'อะไรช่วยให้อาจารย์ให้คะแนนได้อย่างยุติธรรม?' },
      o: [{ en: 'Rolling a dice ', th: 'ทอยลูกเต๋า ' }, { en: 'A score sheet with clear rules (rubric)', th: 'ตารางเกณฑ์ให้คะแนนที่ชัดเจน (Rubric)' }, { en: 'Who is the tallest', th: 'ดูว่าใครตัวสูงที่สุด' }], a: 1,
      why: { en: 'Everyone is scored with the same rules, so it is fair.', th: 'ทุกคนถูกให้คะแนนด้วยเกณฑ์เดียวกัน จึงยุติธรรม' } },
  ],
  coo: [
    { em: '', q: { en: 'How does the coordinator add 100 students FAST?', th: 'ผู้ดูแลเพิ่มนักศึกษา 100 คนให้เร็วได้อย่างไร?' },
      o: [{ en: 'Type them one by one', th: 'พิมพ์ทีละคน' }, { en: 'Upload one class list file', th: 'อัปโหลดไฟล์รายชื่อไฟล์เดียว' }, { en: 'Call every student', th: 'โทรหานักศึกษาทุกคน' }], a: 1,
      why: { en: 'One CSV file adds the whole class at once.', th: 'ไฟล์ CSV ไฟล์เดียวเพิ่มรายชื่อได้ทั้งห้อง' } },
    { em: '', q: { en: 'Who can see a report of ALL projects?', th: 'ใครดูรายงานของโปรเจกต์ทั้งหมดได้?' },
      o: [{ en: 'The coordinator', th: 'ผู้ดูแลหลักสูตร' }, { en: 'Anyone on the internet', th: 'ทุกคนบนอินเทอร์เน็ต' }, { en: 'Only the cat ', th: 'แมวเท่านั้น ' }], a: 0,
      why: { en: 'Only the coordinator sees the big picture, to keep data private.', th: 'เฉพาะผู้ดูแลที่เห็นภาพรวม เพื่อรักษาความเป็นส่วนตัวของข้อมูล' } },
  ],
  arc: [
    { em: '', q: { en: 'What is the Project Archive?', th: 'คลังโปรเจกต์ (Archive) คืออะไร?' },
      o: [{ en: 'A trash bin', th: 'ถังขยะ' }, { en: 'A library of finished projects', th: 'ห้องสมุดเก็บโปรเจกต์ที่ทำเสร็จแล้ว' }, { en: 'A music player', th: 'เครื่องเล่นเพลง' }], a: 1,
      why: { en: 'Approved projects are saved there forever.', th: 'โปรเจกต์ที่ผ่านแล้วจะถูกเก็บไว้ที่นั่นตลอดไป' } },
    { em: '', q: { en: 'Why keep old projects?', th: 'ทำไมต้องเก็บโปรเจกต์เก่าไว้?' },
      o: [{ en: 'So future students can learn from them', th: 'ให้รุ่นน้องได้เรียนรู้และหาไอเดีย' }, { en: 'To delete them later', th: 'เอาไว้ลบทีหลัง' }, { en: 'No reason', th: 'ไม่มีเหตุผล' }], a: 0,
      why: { en: 'Juniors can search past projects and get ideas.', th: 'รุ่นน้องค้นหางานของรุ่นพี่เพื่อหาไอเดียได้' } },
  ],
  safe: [
    { em: '', q: { en: 'Can a student give themselves an A?', th: 'นักศึกษาให้เกรด A ตัวเองได้ไหม?' },
      o: [{ en: 'Yes, easy!', th: 'ได้สิ ง่ายมาก!' }, { en: 'No! Each person only has buttons for their own job', th: 'ไม่ได้! แต่ละคนมีปุ่มเฉพาะงานของตัวเอง' }], a: 1,
      why: { en: 'This is called role-based access. It keeps things fair and safe.', th: 'เรียกว่า Role-Based Access ทำให้ยุติธรรมและปลอดภัย' } },
    { em: '', q: { en: 'Why do you need to log in?', th: 'ทำไมต้องล็อกอินก่อนใช้งาน?' },
      o: [{ en: 'So the website knows who you are and what you can do', th: 'ให้เว็บรู้ว่าเราเป็นใคร และทำอะไรได้บ้าง' }, { en: 'Just for fun', th: 'แค่เล่นสนุก' }, { en: 'To make it slower', th: 'ทำให้เว็บช้าลง' }], a: 0,
      why: { en: 'Login protects everyone’s projects and grades.', th: 'การล็อกอินช่วยปกป้องโปรเจกต์และคะแนนของทุกคน' } },
  ],
});

/* Rules from the prototype */
export const TIME_LIMIT = 25; // seconds to find all pairs (timer, intro text, home tag)
export const TIME_WARN = 10; // timer turns red and shakes from here
export const TIME_URGENT = 5; // stronger shake + pop from here
export const SPINS = 3;
/** Landing weights: each normal topic 2, Bonus 1 (indices into TOPICS). */
export const WHEEL_POOL = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5];
