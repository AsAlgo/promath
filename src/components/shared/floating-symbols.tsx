const floatingSymbols = [
  {
    char: '∫',
    top: '10%',
    left: '8%',
    size: '4rem',
    opacity: 0.07,
    duration: '22s',
    delay: '0s',
    anim: 'float',
  },
  {
    char: 'π',
    top: '18%',
    left: '82%',
    size: '5.5rem',
    opacity: 0.05,
    duration: '26s',
    delay: '-5s',
    anim: 'float-reverse',
  },
  {
    char: 'Σ',
    top: '30%',
    left: '90%',
    size: '3rem',
    opacity: 0.08,
    duration: '18s',
    delay: '-3s',
    anim: 'float',
  },
  {
    char: '√',
    top: '65%',
    left: '6%',
    size: '4.5rem',
    opacity: 0.06,
    duration: '24s',
    delay: '-8s',
    anim: 'float-reverse',
  },
  {
    char: '∞',
    top: '72%',
    left: '88%',
    size: '3.5rem',
    opacity: 0.07,
    duration: '20s',
    delay: '-12s',
    anim: 'float',
  },
  {
    char: 'θ',
    top: '42%',
    left: '94%',
    size: '2.5rem',
    opacity: 0.09,
    duration: '19s',
    delay: '-2s',
    anim: 'float-reverse',
  },
  {
    char: 'Δ',
    top: '82%',
    left: '18%',
    size: '3rem',
    opacity: 0.06,
    duration: '23s',
    delay: '-7s',
    anim: 'float',
  },
  {
    char: '∂',
    top: '8%',
    left: '42%',
    size: '2.5rem',
    opacity: 0.05,
    duration: '25s',
    delay: '-10s',
    anim: 'float-reverse',
  },
  {
    char: 'α',
    top: '55%',
    left: '4%',
    size: '3rem',
    opacity: 0.07,
    duration: '21s',
    delay: '-4s',
    anim: 'float',
  },
  {
    char: 'φ',
    top: '38%',
    left: '75%',
    size: '2.5rem',
    opacity: 0.06,
    duration: '20s',
    delay: '-6s',
    anim: 'float-reverse',
  },
  {
    char: 'λ',
    top: '78%',
    left: '60%',
    size: '3.5rem',
    opacity: 0.05,
    duration: '24s',
    delay: '-9s',
    anim: 'float',
  },
  {
    char: 'ε',
    top: '22%',
    left: '28%',
    size: '2.5rem',
    opacity: 0.08,
    duration: '17s',
    delay: '-1s',
    anim: 'float-reverse',
  },
  {
    char: '∇',
    top: '88%',
    left: '75%',
    size: '3rem',
    opacity: 0.06,
    duration: '22s',
    delay: '-11s',
    anim: 'float',
  },
  {
    char: '∮',
    top: '5%',
    left: '65%',
    size: '3rem',
    opacity: 0.07,
    duration: '21s',
    delay: '-3s',
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
