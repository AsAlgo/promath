import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Math as Tex, MathText } from '@/components/ui/math';
import { EXAMPLES } from './data';

export function ExamplesSection() {
  const t = useTranslations('lesson.cosineRule.examples');
  const [activeEx, setActiveEx] = useState(0);
  const [revealedStep, setRevealedStep] = useState(-1);

  const reset = (idx: number) => {
    setActiveEx(idx);
    setRevealedStep(-1);
  };

  const ex = EXAMPLES[activeEx];

  return (
    <div>
      <h2 className="font-display text-2xl sm:text-3xl tracking-tight mb-2">
        {t('title')}{' '}
        <span className="text-primary font-bold">{t('titleHighlight')}</span>
      </h2>
      <p className="text-muted leading-relaxed mb-4">{t('desc')}</p>

      {/* Example tabs */}
      <div className="flex gap-1.5 mb-4" role="tablist" aria-label="Examples">
        {EXAMPLES.map((e, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={i === activeEx}
            aria-controls={`example-panel-${i}`}
            id={`example-tab-${i}`}
            onClick={() => reset(i)}
            className={cn(
              'flex-1 py-2 px-2.5 rounded-lg text-xs font-bold cursor-pointer transition-all duration-200 border',
              i === activeEx
                ? 'border-primary bg-primary-subtle/40 text-primary'
                : 'border-border bg-surface text-muted hover:border-primary/30',
            )}
          >
            {e.title}
          </button>
        ))}
      </div>

      {/* Problem */}
      <div
        role="tabpanel"
        id={`example-panel-${activeEx}`}
        aria-labelledby={`example-tab-${activeEx}`}
      >
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
              className={cn(
                'rounded-lg py-2.5 px-4 text-[15px] transition-all duration-400 border',
                i <= revealedStep
                  ? 'bg-surface border-primary/25 opacity-100'
                  : 'bg-surface-alt border-border opacity-30',
              )}
            >
              <span className="text-muted text-xs mr-2">#{i + 1}</span>
              {i <= revealedStep ? <Tex>{s}</Tex> : '\u2022 \u2022 \u2022'}
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex gap-2.5">
          <Button
            variant="primary"
            size="sm"
            className="flex-1 rounded-lg font-bold"
            onClick={() =>
              setRevealedStep(Math.min(ex.steps.length - 1, revealedStep + 1))
            }
            disabled={revealedStep >= ex.steps.length - 1}
          >
            {t('showNext')}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-lg"
            onClick={() => setRevealedStep(-1)}
          >
            {t('reset')}
          </Button>
        </div>

        {/* Answer */}
        {revealedStep >= ex.steps.length - 1 && (
          <div className="mt-4 rounded-lg p-4 border border-success/25 bg-success/5 text-center">
            <div className="text-xs text-success font-bold tracking-widest uppercase mb-1">
              {t('answer')}
            </div>
            <div className="text-xl text-success font-bold">
              <Tex>{ex.answer}</Tex>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
