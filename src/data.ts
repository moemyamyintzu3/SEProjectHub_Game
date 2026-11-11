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

/* Wheel quiz: 3 questions per topic, all with 3 believable choices.
   The game picks a random unused question and shuffles the A/B/C order each time. */
export const QS: Record<Exclude<TopicId, 'bonus'>, Question[]> = glueThaiDeep({
  stu: [
    { em: '', q: { en: 'You finished your project. Where should you put it?', th: 'ทำโปรเจกต์เสร็จแล้ว ควรเก็บไว้ที่ไหน?' },
      o: [{ en: 'Upload it to SE Project Hub', th: 'อัปโหลดขึ้น SE Project Hub' }, { en: 'Email it to your advisor', th: 'ส่งอีเมลหาอาจารย์ที่ปรึกษา' }, { en: 'Save it in a shared Google Drive folder', th: 'เก็บในโฟลเดอร์ Google Drive ที่แชร์กัน' }], a: 0,
      why: { en: 'In the Hub, your advisor and team always see the newest version in one place.', th: 'ใน Hub อาจารย์และเพื่อนในทีมจะเห็นงานเวอร์ชันล่าสุดในที่เดียวเสมอ' } },
    { em: '', q: { en: 'Who adds friends to the project team?', th: 'ใครเป็นคนเพิ่มเพื่อนเข้าทีมโปรเจกต์?' },
      o: [{ en: 'The student who creates the project', th: 'นักศึกษาที่สร้างโปรเจกต์' }, { en: 'The advisor', th: 'อาจารย์ที่ปรึกษา' }, { en: 'The coordinator', th: 'ผู้ดูแลหลักสูตร' }], a: 0,
      why: { en: 'Students build their own team in the Submit Project page.', th: 'นักศึกษาเพิ่มเพื่อนเข้าทีมได้เองในหน้าส่งโปรเจกต์' } },
    { em: '', q: { en: 'Your advisor left a comment on your work. What should you do next?', th: 'อาจารย์คอมเมนต์งานของเราแล้ว ควรทำอะไรต่อ?' },
      o: [{ en: 'Fix the work and upload a new version', th: 'แก้งานแล้วอัปโหลดเวอร์ชันใหม่' }, { en: 'Delete the project and start again', th: 'ลบโปรเจกต์แล้วเริ่มใหม่ทั้งหมด' }, { en: 'Wait until the final grade comes out', th: 'รอจนกว่าจะออกเกรด' }], a: 0,
      why: { en: 'Comments help you improve, and the Hub keeps every new version.', th: 'คอมเมนต์ช่วยให้งานดีขึ้น และ Hub เก็บทุกเวอร์ชันใหม่ไว้ให้' } },
  ],
  adv: [
    { em: '', q: { en: 'Who gives the project a score?', th: 'ใครเป็นคนให้คะแนนโปรเจกต์?' },
      o: [{ en: 'The teammates vote for each other', th: 'เพื่อนในทีมโหวตให้กันเอง' }, { en: 'The advisor (teacher)', th: 'อาจารย์ที่ปรึกษา' }, { en: 'The coordinator', th: 'ผู้ดูแลหลักสูตร' }], a: 1,
      why: { en: 'The advisor checks the work and gives the score.', th: 'อาจารย์ที่ปรึกษาตรวจงานแล้วให้คะแนน' } },
    { em: '', q: { en: 'What helps the advisor give a FAIR score?', th: 'อะไรช่วยให้อาจารย์ให้คะแนนได้อย่างยุติธรรม?' },
      o: [{ en: "Comparing it with last year's best project", th: 'เทียบกับโปรเจกต์ที่ดีที่สุดของปีก่อน' }, { en: 'A rubric: a score sheet with clear rules', th: 'Rubric ตารางเกณฑ์ให้คะแนนที่ชัดเจน' }, { en: 'Counting the pages in the report', th: 'นับจำนวนหน้าของรายงาน' }], a: 1,
      why: { en: 'Everyone is scored with the same rules, so it is fair.', th: 'ทุกคนถูกให้คะแนนด้วยเกณฑ์เดียวกัน จึงยุติธรรม' } },
    { em: '', q: { en: 'Besides giving a score, what else does an advisor do?', th: 'นอกจากให้คะแนนแล้ว อาจารย์ที่ปรึกษาทำอะไรอีก?' },
      o: [{ en: 'Leaves comments so students can improve', th: 'เขียนคอมเมนต์ให้นักศึกษาปรับปรุงงาน' }, { en: "Changes the students' team members", th: 'เปลี่ยนสมาชิกในทีมของนักศึกษา' }, { en: 'Uploads the project for the students', th: 'อัปโหลดโปรเจกต์แทนนักศึกษา' }], a: 0,
      why: { en: 'Advisors review the work and give feedback, not just grades.', th: 'อาจารย์ตรวจงานและให้คำแนะนำ ไม่ใช่แค่ให้คะแนน' } },
  ],
  coo: [
    { em: '', q: { en: 'How does the coordinator add 100 students FAST?', th: 'ผู้ดูแลเพิ่มนักศึกษา 100 คนให้เร็วได้อย่างไร?' },
      o: [{ en: 'Ask every student to sign up, then wait', th: 'ให้นักศึกษาสมัครเองทีละคนแล้วรอ' }, { en: 'Upload one class list file', th: 'อัปโหลดไฟล์รายชื่อไฟล์เดียว' }, { en: 'Copy the names from the group chat', th: 'คัดลอกชื่อจากแชทกลุ่ม' }], a: 1,
      why: { en: 'One CSV file adds the whole class at once.', th: 'ไฟล์ CSV ไฟล์เดียวเพิ่มรายชื่อได้ทั้งห้อง' } },
    { em: '', q: { en: 'Who can see a report of ALL projects?', th: 'ใครดูรายงานของโปรเจกต์ทั้งหมดได้?' },
      o: [{ en: 'The coordinator', th: 'ผู้ดูแลหลักสูตร' }, { en: 'Every advisor', th: 'อาจารย์ทุกคน' }, { en: 'Every student', th: 'นักศึกษาทุกคน' }], a: 0,
      why: { en: 'Only the coordinator sees the big picture, to keep data private.', th: 'เฉพาะผู้ดูแลที่เห็นภาพรวม เพื่อรักษาความเป็นส่วนตัวของข้อมูล' } },
    { em: '', q: { en: 'Who creates the courses and manages the class lists?', th: 'ใครสร้างรายวิชาและจัดการรายชื่อนักศึกษา?' },
      o: [{ en: 'The advisor', th: 'อาจารย์ที่ปรึกษา' }, { en: 'The team leader of each project', th: 'หัวหน้าทีมของแต่ละโปรเจกต์' }, { en: 'The coordinator', th: 'ผู้ดูแลหลักสูตร' }], a: 2,
      why: { en: 'The coordinator manages courses and class lists for everyone.', th: 'ผู้ดูแลหลักสูตรจัดการรายวิชาและรายชื่อนักศึกษาของทุกคน' } },
  ],
  arc: [
    { em: '', q: { en: 'What is the Project Archive?', th: 'คลังโปรเจกต์ (Archive) คืออะไร?' },
      o: [{ en: 'A folder of projects still being graded', th: 'ที่เก็บโปรเจกต์ที่ยังตรวจไม่เสร็จ' }, { en: 'A library of finished projects', th: 'ห้องสมุดเก็บโปรเจกต์ที่ทำเสร็จแล้ว' }, { en: 'A place for deleted projects', th: 'ที่เก็บโปรเจกต์ที่ถูกลบ' }], a: 1,
      why: { en: 'Approved projects are saved there forever.', th: 'โปรเจกต์ที่ผ่านแล้วจะถูกเก็บไว้ที่นั่นตลอดไป' } },
    { em: '', q: { en: 'Why keep old projects?', th: 'ทำไมต้องเก็บโปรเจกต์เก่าไว้?' },
      o: [{ en: 'So future students can learn from them', th: 'ให้รุ่นน้องได้เรียนรู้และหาไอเดีย' }, { en: 'So students can copy them as their own work', th: 'ให้รุ่นน้องคัดลอกไปส่งเป็นงานตัวเอง' }, { en: 'To make the website look bigger', th: 'ให้เว็บดูมีข้อมูลเยอะ' }], a: 0,
      why: { en: 'Juniors can search past projects and get ideas.', th: 'รุ่นน้องค้นหางานของรุ่นพี่เพื่อหาไอเดียได้' } },
    { em: '', q: { en: 'Which projects go into the archive?', th: 'โปรเจกต์แบบไหนที่ถูกเก็บในคลังงาน?' },
      o: [{ en: 'Every project, even unfinished ones', th: 'ทุกโปรเจกต์ แม้ยังทำไม่เสร็จ' }, { en: 'Only projects that got an A', th: 'เฉพาะโปรเจกต์ที่ได้เกรด A' }, { en: 'Only approved projects', th: 'เฉพาะโปรเจกต์ที่ผ่านการอนุมัติ' }], a: 2,
      why: { en: 'Only approved work is archived, so juniors see complete projects.', th: 'เฉพาะงานที่อนุมัติแล้วจึงถูกเก็บในคลัง รุ่นน้องจะได้เห็นงานที่สมบูรณ์' } },
  ],
  safe: [
    { em: '', q: { en: 'Can a student give themselves an A?', th: 'นักศึกษาให้เกรด A ตัวเองได้ไหม?' },
      o: [{ en: 'Yes, if they submit early', th: 'ได้ ถ้าส่งงานเร็ว' }, { en: 'Yes, if the advisor is busy', th: 'ได้ ถ้าอาจารย์ไม่ว่าง' }, { en: 'No! Each person only has buttons for their own job', th: 'ไม่ได้! แต่ละคนมีปุ่มเฉพาะงานของตัวเอง' }], a: 2,
      why: { en: 'This is called role-based access. It keeps things fair and safe.', th: 'เรียกว่า Role-Based Access ทำให้ยุติธรรมและปลอดภัย' } },
    { em: '', q: { en: 'Why do you need to log in?', th: 'ทำไมต้องล็อกอินก่อนใช้งาน?' },
      o: [{ en: 'So the website knows who you are and what you can do', th: 'ให้เว็บรู้ว่าเราเป็นใคร และทำอะไรได้บ้าง' }, { en: "So you can see everyone's grades", th: 'เพื่อดูเกรดของทุกคน' }, { en: 'So the website can show you ads', th: 'ให้เว็บแสดงโฆษณาให้เรา' }], a: 0,
      why: { en: 'Login protects everyone’s projects and grades.', th: 'การล็อกอินช่วยปกป้องโปรเจกต์และคะแนนของทุกคน' } },
    { em: '', q: { en: 'A friend asks for your password to upload your work. What should you do?', th: 'เพื่อนขอรหัสผ่านเพื่ออัปโหลดงานแทน ควรทำอย่างไร?' },
      o: [{ en: 'Share it, they are on your team', th: 'บอกได้ เพราะอยู่ทีมเดียวกัน' }, { en: 'Never share it. Everyone uses their own account', th: 'ห้ามบอก ทุกคนใช้บัญชีของตัวเอง' }, { en: 'Write it in the project report', th: 'เขียนไว้ในรายงานโปรเจกต์' }], a: 1,
      why: { en: 'Your account is only for you. Teammates can upload with their own accounts.', th: 'บัญชีเป็นของเราคนเดียว เพื่อนในทีมอัปโหลดได้ด้วยบัญชีของตัวเอง' } },
  ],
});

/* Rules from the prototype */
export const TIME_LIMIT = 20; // seconds to find all pairs (timer, intro text, home tag)
export const TIME_WARN = 10; // timer turns red and shakes from here
export const TIME_URGENT = 5; // stronger shake + pop from here
export const SPINS = 3;
/** Landing weights: each normal topic 2, Bonus 1 (indices into TOPICS). */
export const WHEEL_POOL = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5];
