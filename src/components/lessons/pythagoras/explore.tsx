import { useTranslations } from 'next-intl';

const APPLICATIONS = [
  { key: 'shortcut', icon: '\u{1F6E4}\uFE0F' },
  { key: 'height', icon: '\u{1F4CF}' },
  { key: 'diagonal', icon: '\u{1F4D0}' },
  { key: 'rightTest', icon: '\u2714\uFE0F' },
] as const;

export function ExploreSection() {
  const t = useTranslations('lesson.pythagoras.explore');

  return (
    <div className="space-y-6">
      <p className="text-[15px] leading-relaxed text-muted">
        {t('intro')}
      </p>

      <section className="space-y-3">
        <p className="text-[15px] leading-relaxed text-muted">
          {t('hookIntro')}
        </p>
        <div
          className="rounded-xl p-5 border-2 border-accent/40"
          style={{
            background:
              'linear-gradient(135deg, color-mix(in srgb, var(--accent) 8%, transparent), var(--surface))',
          }}
        >
          <p className="text-[15px] leading-relaxed mb-4 italic">
            {t('hookScenario')}
          </p>

          <svg
            viewBox="0 0 400 250"
            className="w-full h-auto max-w-[320px] mx-auto mb-3"
            role="img"
            aria-label={t('hookDiagramLabel')}
          >
            <title>{t('hookDiagramLabel')}</title>
            <rect
              x="20"
              y="20"
              width="360"
              height="210"
              rx="12"
              fill="var(--surface-alt)"
              stroke="var(--border)"
              strokeWidth="1"
            />
            <line
              x1="60"
              y1="190"
              x2="300"
              y2="190"
              stroke="var(--muted)"
              strokeWidth="3"
              strokeDasharray="8,4"
            />
            <text
              x="180"
              y="210"
              textAnchor="middle"
              className="fill-muted"
              fontSize="12"
              fontWeight="bold"
            >
              300 m &rarr;
            </text>
            <line
              x1="300"
              y1="190"
              x2="300"
              y2="60"
              stroke="var(--muted)"
              strokeWidth="3"
              strokeDasharray="8,4"
            />
            <text
              x="330"
              y="130"
              textAnchor="middle"
              className="fill-muted"
              fontSize="12"
              fontWeight="bold"
              transform="rotate(90, 330, 130)"
            >
              400 m &uarr;
            </text>
            <line
              x1="60"
              y1="190"
              x2="300"
              y2="60"
              stroke="var(--accent)"
              strokeWidth="3"
              strokeDasharray="6,6"
            />
            <text
              x="160"
              y="110"
              textAnchor="middle"
              className="fill-accent font-display"
              fontSize="18"
              fontWeight="bold"
            >
              ?
            </text>
            <circle cx="60" cy="190" r="5" fill="var(--primary)" />
            <circle cx="300" cy="190" r="5" fill="var(--muted)" />
            <circle cx="300" cy="60" r="5" fill="var(--muted)" />
          </svg>

          <p className="text-sm text-muted text-center">
            {t('hookQuestion')}
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <p className="text-[15px] leading-relaxed text-muted">
          {t('applicationsIntro')}
        </p>
        <h3 className="font-semibold text-sm text-muted tracking-widest uppercase">
          {t('applicationsTitle')}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {APPLICATIONS.map((app) => (
            <div
              key={app.key}
              className="bg-surface rounded-lg p-4 border border-border transition-colors hover:border-primary/30"
            >
              <div className="text-xl mb-1.5" aria-hidden="true">
                {app.icon}
              </div>
              <div className="font-semibold text-sm mb-1">
                {t(`${app.key}Title`)}
              </div>
              <div className="text-xs text-muted leading-relaxed">
                {t(`${app.key}Desc`)}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
