import { Art } from './Art';
import type { IconName } from './svgData';

/** Icons: star, clock, check, cards, wheel, gift, bulb, trophy, books, lock, oops, heart. */
export function Icon({ name, className, title }: { name: IconName; className?: string; title?: string }) {
  return <Art name={name} className={className} title={title} />;
}
