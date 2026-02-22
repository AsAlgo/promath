import katex from 'katex';

interface MathProps {
  children: string;
  display?: boolean;
  className?: string;
}

export function Math({ children, display, className }: MathProps) {
  const html = katex.renderToString(children, {
    displayMode: display,
    throwOnError: false,
  });
  return display ? (
    <div className={className} dangerouslySetInnerHTML={{ __html: html }} />
  ) : (
    <span className={className} dangerouslySetInnerHTML={{ __html: html }} />
  );
}

export function MathText({
  children,
  className,
  highlights,
  onTermHover,
}: {
  children: string;
  className?: string;
  highlights?: Record<string, { color: string }>;
  onTermHover?: (term: string, hovering: boolean) => void;
}) {
  const parts = children.split(/(\$[^$]+\$)/g);
  return (
    <span className={className}>
      {parts.map((part, i) => {
        if (part.startsWith('$') && part.endsWith('$')) {
          const formula = part.slice(1, -1);
          const hl = highlights?.[formula];
          if (hl && onTermHover) {
            return (
              <span
                key={i}
                className="cursor-help inline-block"
                style={{
                  borderBottom: `1.5px dotted var(--${hl.color})`,
                  paddingBottom: 1,
                  transition: 'border-color 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderBottomStyle =
                    'solid';
                  onTermHover(formula, true);
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderBottomStyle =
                    'dotted';
                  onTermHover(formula, false);
                }}
              >
                <Math>{formula}</Math>
              </span>
            );
          }
          return <Math key={i}>{formula}</Math>;
        }
        return <span key={i}>{part}</span>;
      })}
    </span>
  );
}
