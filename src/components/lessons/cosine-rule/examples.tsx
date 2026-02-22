import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import { Math as Tex, MathText } from '@/components/ui/math';
import { ItemStepper } from '@/components/ui/item-stepper';
import { EXAMPLES } from './data';

export function ExamplesSection() {
  const t = useTranslations('lesson.cosineRule.examples');

  return (
    <div>
      <h2 className="font-display text-2xl sm:text-3xl tracking-tight mb-2">
        {t('title')}{' '}
        <span className="text-primary font-bold">{t('titleHighlight')}</span>
      </h2>
      <p className="text-muted leading-relaxed mb-4">{t('desc')}</p>

      <ItemStepper
        count={EXAMPLES.length}
        labels={EXAMPLES.map((e) => e.title)}
      >
        {(activeIdx) => {
          const ex = EXAMPLES[activeIdx];

          return (
            <div>
              {/* Problem */}
              <div className="bg-surface rounded-xl p-5 border border-border mb-4">
                <Badge>{t('task')}</Badge>
                <p className="mt-2.5 text-[15px] leading-relaxed">
                  <MathText>{ex.desc}</MathText>
                </p>
              </div>

              {/* Steps */}
              <div className="flex flex-col gap-2 mb-4">
                {ex.steps.map((s, i) => (
                  <div
                    key={i}
                    className="rounded-lg py-2.5 px-4 text-[15px] border bg-surface border-primary/25"
                  >
                    <span className="text-muted text-xs mr-2">
                      #{i + 1}
                    </span>
                    <Tex>{s}</Tex>
                  </div>
                ))}
              </div>

              {/* Answer */}
              <div className="rounded-lg p-4 border border-success/25 bg-success/5 text-center">
                <div className="text-xs text-success font-bold tracking-widest uppercase mb-1">
                  {t('answer')}
                </div>
                <div className="text-xl text-success font-bold">
                  <Tex>{ex.answer}</Tex>
                </div>
              </div>
            </div>
          );
        }}
      </ItemStepper>
    </div>
  );
}
