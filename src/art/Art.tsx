import { ART, type ArtName } from './svgData';

type ArtProps = { name: ArtName; className?: string; title?: string };

/** Renders one of the prototype's hand-drawn SVGs (0 0 100 100 viewBox). */
export function Art({ name, className, title }: ArtProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      dangerouslySetInnerHTML={{ __html: ART[name] }}
    />
  );
}
