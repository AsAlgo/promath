import { useTranslations } from 'next-intl';

const TIMELINE_EVENTS = [
  { year: '~1800 f.Kr.', x: 60 },
  { year: '~1100 f.Kr.', x: 185 },
  { year: '~500 f.Kr.', x: 310 },
  { year: '~300 f.Kr.', x: 435 },
  { year: '2023', x: 560 },
] as const;

export function BackgroundSection() {
  const t = useTranslations('lesson.pythagoras.background');

  return (
    <div className="space-y-6">
      <p className="text-[15px] leading-relaxed text-muted">
        {t('intro')}
      </p>

      {/* Timeline SVG */}
      <div className="rounded-xl p-5 border border-border bg-surface overflow-x-auto">
        <svg
          viewBox="0 0 620 90"
          className="w-full h-auto min-w-[480px]"
          role="img"
          aria-label={t('timelineLabel')}
        >
          <title>{t('timelineLabel')}</title>

          {/* Main line */}
          <line
            x1="40"
            y1="45"
            x2="580"
            y2="45"
            stroke="var(--border)"
            strokeWidth="2"
          />

          {/* Events */}
          {TIMELINE_EVENTS.map((evt, i) => (
            <g key={i}>
              <circle
                cx={evt.x}
                cy={45}
                r={6}
                fill={i === 4 ? 'var(--accent)' : 'var(--primary)'}
              />
              <text
                x={evt.x}
                y={25}
                textAnchor="middle"
                fontSize="11"
                fontWeight="bold"
                className="fill-foreground"
              >
                {evt.year}
              </text>
              <text
                x={evt.x}
                y={72}
                textAnchor="middle"
                fontSize="9"
                className="fill-muted"
              >
                {
                  [
                    'Babylon',
                    'Kina/Indien',
                    'Pythagoras',
                    'Euklid',
                    'I dag',
                  ][i]
                }
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* Babylon */}
      <section className="space-y-3">
        <h3 className="font-semibold text-sm tracking-widest uppercase text-muted">
          {t('babylonTitle')}
        </h3>
        <p className="text-[15px] leading-relaxed text-muted">
          {t('babylonText')}
        </p>
      </section>

      {/* China & India */}
      <section className="space-y-3">
        <h3 className="font-semibold text-sm tracking-widest uppercase text-muted">
          {t('asiaTitle')}
        </h3>
        <p className="text-[15px] leading-relaxed text-muted">
          {t('asiaText')}
        </p>
      </section>

      {/* Pythagoras & Euclid */}
      <section className="space-y-3">
        <h3 className="font-semibold text-sm tracking-widest uppercase text-muted">
          {t('greeceTitle')}
        </h3>
        <p className="text-[15px] leading-relaxed text-muted">
          {t('greeceText')}
        </p>
      </section>

      {/* Today */}
      <section className="space-y-3">
        <h3 className="font-semibold text-sm tracking-widest uppercase text-muted">
          {t('todayTitle')}
        </h3>
        <p className="text-[15px] leading-relaxed text-muted">
          {t('todayText')}
        </p>
      </section>
    </div>
  );
}
