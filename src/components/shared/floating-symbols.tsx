const floatingSymbols = [
  {
    char: '∫',
    top: '10%',
    left: '8%',
    size: '4rem',
    opacity: 0.14,
    duration: '22s',
    delay: '0s',
    anim: 'float',
  },
  {
    char: 'π',
    top: '18%',
    left: '82%',
    size: '5.5rem',
    opacity: 0.1,
    duration: '26s',
    delay: '-5s',
    anim: 'float-reverse',
  },
  {
    char: 'Σ',
    top: '30%',
    left: '90%',
    size: '3rem',
    opacity: 0.16,
    duration: '18s',
    delay: '-3s',
    anim: 'float',
  },
  {
    char: '√',
    top: '65%',
    left: '6%',
    size: '4.5rem',
    opacity: 0.12,
    duration: '24s',
    delay: '-8s',
    anim: 'float-reverse',
  },
  {
    char: '∞',
    top: '72%',
    left: '88%',
    size: '3.5rem',
    opacity: 0.14,
    duration: '20s',
    delay: '-12s',
    anim: 'float',
  },
  {
    char: 'θ',
    top: '42%',
    left: '94%',
    size: '2.5rem',
    opacity: 0.18,
    duration: '19s',
    delay: '-2s',
    anim: 'float-reverse',
  },
  {
    char: 'Δ',
    top: '82%',
    left: '18%',
    size: '3rem',
    opacity: 0.12,
    duration: '23s',
    delay: '-7s',
    anim: 'float',
  },
  {
    char: 'α',
    top: '55%',
    left: '4%',
    size: '3rem',
    opacity: 0.14,
    duration: '21s',
    delay: '-4s',
    anim: 'float-reverse',
  },
];

export function FloatingSymbols() {
  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      {floatingSymbols.map((s, i) => (
        <span
          key={i}
          className="absolute font-display text-primary select-none"
          style={{
            top: s.top,
            left: s.left,
            fontSize: s.size,
            opacity: s.opacity,
            animation: `${s.anim} ${s.duration} ease-in-out ${s.delay} infinite`,
          }}
        >
          {s.char}
        </span>
      ))}
    </div>
  );
}
