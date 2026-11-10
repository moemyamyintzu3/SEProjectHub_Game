import { Fragment } from 'react';
import { Art } from '../art';
import { ART, type ArtName } from '../art/svgData';

/** Renders a text string that may contain light HTML and [[icon]] tokens.
    Tokens become inline drawn SVG icons. The strings are our own static copy. */
export function Rich({ text, className }: { text: string; className?: string }) {
  const parts = text.split(/\[\[(\w+)\]\]/g);
  return (
    <span className={className}>
      {parts.map((p, i) =>
        i % 2 === 1 ? (
          p in ART ? (
            <span key={i} className="icx">
              <Art name={p as ArtName} />
            </span>
          ) : null
        ) : p ? (
          <span key={i} dangerouslySetInnerHTML={{ __html: p }} />
        ) : (
          <Fragment key={i} />
        ),
      )}
    </span>
  );
}
