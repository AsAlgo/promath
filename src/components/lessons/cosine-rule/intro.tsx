import { useTranslations } from 'next-intl';
import { Math as Tex } from '@/components/ui/math';

const FEATURES = [
  { icon: '\ud83d\udcd0', key: 'findSide' as const },
  { icon: '\ud83d\udd3a', key: 'findAngle' as const },
  { icon: '\ud83d\udccf', key: 'pythagoras' as const },
  { icon: '\u2728', key: 'allTypes' as const },
];

export function IntroSection() {
  const t = useTranslations('lesson.cosineRule.intro');

  return (
    <div>
      <h2 className="font-display text-2xl sm:text-3xl tracking-tight mb-2">
        {t('title')}{' '}
        <span className="text-primary font-bold">{t('titleHighlight')}</span>?
      </h2>
      <p className="text-muted leading-relaxed mb-5">{t('desc')}</p>

      {/* Formula box */}
      <div
        className="rounded-xl p-6 text-center mb-6 border border-primary/20"
        style={{
          background:
            'linear-gradient(135deg, color-mix(in srgb, var(--primary-subtle) 25%, transparent), var(--surface))',
        }}
      >
        <div className="text-xs text-muted tracking-widest uppercase mb-2">
          {t('formulaLabel')}
        </div>
        <Tex display className="text-2xl">
          {'a^2 = b^2 + c^2 - 2bc \\cdot \\cos A'}
        </Tex>
      </div>

      {/* Feature cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {FEATURES.map((item) => (
          <div
            key={item.key}
            className="bg-surface rounded-lg p-4 border border-border transition-colors hover:border-primary/30"
          >
            <div className="text-xl mb-1.5">{item.icon}</div>
            <div className="font-semibold text-sm mb-1">
              {t(`${item.key}Title`)}
            </div>
            <div className="text-xs text-muted leading-relaxed">
              {t(`${item.key}Desc`)}
            </div>
          </div>
        ))}
      </div>

      {/* Angle variants */}
      <div className="bg-surface rounded-lg p-4 border border-border">
        <div className="text-xs text-muted mb-1.5 font-semibold">
          {t('variantsLabel')}
        </div>
        <Tex display className="text-[15px] leading-loose">
          {
            '\\begin{aligned} a^2 &= b^2 + c^2 - 2bc \\cdot \\cos A \\\\ b^2 &= a^2 + c^2 - 2ac \\cdot \\cos B \\\\ c^2 &= a^2 + b^2 - 2ab \\cdot \\cos C \\end{aligned}'
          }
        </Tex>
      </div>
    </div>
  );
}
