import { Art } from './Art';
import type { AvatarName } from './svgData';

/** Characters: student, advisor, coordinator, document, comment. */
export function Avatar({ name, className, title }: { name: AvatarName; className?: string; title?: string }) {
  return <Art name={name} className={className} title={title} />;
}
