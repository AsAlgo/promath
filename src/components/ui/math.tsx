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
}: {
  children: string;
  className?: string;
}) {
  const parts = children.split(/(\$[^$]+\$)/g);
  return (
    <span className={className}>
      {parts.map((part, i) =>
        part.startsWith('$') && part.endsWith('$') ? (
          <Math key={i}>{part.slice(1, -1)}</Math>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </span>
  );
}
