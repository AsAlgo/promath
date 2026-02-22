import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MathText } from '@/components/ui/math';
import { ItemStepper, type ItemStatus } from '@/components/ui/item-stepper';
import { EXERCISES } from './data';

export function ExercisesSection() {
  const t = useTranslations('lesson.cosineRule.exercises');
  const [answers, setAnswers] = useState(EXERCISES.map(() => ''));
  const [results, setResults] = useState<(boolean | null)[]>(
    EXERCISES.map(() => null),
  );
  const [showHints, setShowHints] = useState(EXERCISES.map(() => false));
  const [attempts, setAttempts] = useState(EXERCISES.map(() => 0));

  const statuses: ItemStatus[] = results.map((r) =>
    r === true ? 'correct' : r === false ? 'incorrect' : 'pending',
  );

  const check = useCallback(
    (i: number) => {
      const val = parseFloat(answers[i]);
      if (isNaN(val)) return;
      const correct =
        Math.abs(val - EXERCISES[i].answer) <= EXERCISES[i].tolerance;
      const newResults = [...results];
      newResults[i] = correct;
      setResults(newResults);

      if (!correct) {
        const newAttempts = [...attempts];
        newAttempts[i]++;
        setAttempts(newAttempts);

        if (newAttempts[i] === 1) {
          const h = [...showHints];
          h[i] = true;
          setShowHints(h);
        }
      }
    },
    [answers, results, attempts, showHints],
  );

  const toggleHint = useCallback(
    (i: number) => {
      const h = [...showHints];
      h[i] = !h[i];
      setShowHints(h);
    },
    [showHints],
  );

  const score = results.filter((r) => r === true).length;

  return (
    <div>
      <h2 className="font-display text-2xl sm:text-3xl tracking-tight mb-2">
        {t('title')}{' '}
        <span className="text-primary font-bold">{t('titleHighlight')}</span>
      </h2>
      <p className="text-muted leading-relaxed mb-5">{t('desc')}</p>

      <ItemStepper
        count={EXERCISES.length}
        labels={EXERCISES.map((_, i) => t('exerciseN', { n: i + 1 }))}
        statuses={statuses}
        autoAdvanceOn={['correct']}
        renderSummary={() => (
          <div
            className={cn(
              'text-center p-5 rounded-xl border',
              score === EXERCISES.length
                ? 'bg-success/5 border-success/25'
                : 'bg-surface border-border',
            )}
          >
            <div className="text-4xl mb-1.5">
              {score === EXERCISES.length
                ? '\ud83c\udf89'
                : score >= EXERCISES.length / 2
                  ? '\ud83d\udc4d'
                  : '\ud83d\udcaa'}
            </div>
            <div className="text-xl font-bold">
              {t('score', { score, total: EXERCISES.length })}
            </div>
            <div className="text-xs text-muted mt-1">
              {score === EXERCISES.length ? t('perfect') : t('keepPracticing')}
            </div>
          </div>
        )}
      >
        {(activeIdx) => {
          const ex = EXERCISES[activeIdx];
          const i = activeIdx;

          return (
            <div
              className={cn(
                'bg-surface rounded-xl p-5 border transition-colors duration-300',
                results[i] === true
                  ? 'border-success/40'
                  : results[i] === false
                    ? 'border-error/40'
                    : 'border-border',
              )}
            >
              <div className="flex justify-between items-center mb-2.5">
                <Badge
                  variant={
                    results[i] === true
                      ? 'success'
                      : results[i] === false
                        ? 'error'
                        : 'default'
                  }
                >
                  {results[i] === true
                    ? t('correct')
                    : results[i] === false
                      ? t('tryAgain')
                      : t('exerciseN', { n: i + 1 })}
                </Badge>
                <button
                  onClick={() => toggleHint(i)}
                  className="bg-transparent border border-border rounded-md text-muted text-[11px] py-0.5 px-2.5 cursor-pointer font-semibold hover:border-primary/30 transition-colors"
                  aria-label={
                    showHints[i]
                      ? `${t('hideHint')} — ${t('exerciseN', { n: i + 1 })}`
                      : `${t('hint')} — ${t('exerciseN', { n: i + 1 })}`
                  }
                >
                  {showHints[i] ? t('hideHint') : t('hint')}
                </button>
              </div>

              <p className="text-sm leading-relaxed mb-2.5">
                <MathText>{ex.q}</MathText>
              </p>

              {showHints[i] && (
                <div className="bg-surface-alt rounded-lg p-2.5 mb-2.5 border-l-[3px] border-accent text-xs text-accent">
                  <MathText>{ex.hint}</MathText>
                </div>
              )}

              <div className="flex gap-2 items-center">
                <label htmlFor={`exercise-${i}`} className="sr-only">
                  {t('placeholder')}
                </label>
                <input
                  id={`exercise-${i}`}
                  type="number"
                  step="any"
                  value={answers[i]}
                  onChange={(e) => {
                    const a = [...answers];
                    a[i] = e.target.value;
                    setAnswers(a);
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && check(i)}
                  placeholder={t('placeholder')}
                  className="flex-1 py-2 px-3 rounded-lg border border-border bg-surface-alt text-[15px] outline-none focus:border-primary/50 transition-colors"
                />
                <span className="text-muted text-sm">{ex.unit}</span>
                <Button
                  variant="primary"
                  size="sm"
                  className="rounded-lg font-bold"
                  onClick={() => check(i)}
                  aria-label={`${t('check')} — ${t('exerciseN', { n: i + 1 })}`}
                >
                  {t('check')}
                </Button>
              </div>

              {results[i] === false && attempts[i] >= 2 && (
                <div className="mt-2 text-xs text-error">
                  {t('correctAnswer', {
                    answer: EXERCISES[i].answer,
                    unit: EXERCISES[i].unit,
                  })}
                </div>
              )}
            </div>
          );
        }}
      </ItemStepper>
    </div>
  );
}
