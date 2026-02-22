import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Math as Tex, MathText } from '@/components/ui/math';
import type { Exercise } from './data';
import { EXERCISES } from './data';

// --- Visual Identify Exercise ---

function VisualIdentifyExercise({
  ex,
  index,
  result,
  onResult,
}: {
  ex: Extract<Exercise, { type: 'visual-identify' }>;
  index: number;
  result: boolean | null;
  onResult: (correct: boolean) => void;
}) {
  const t = useTranslations('lesson.pythagoras.exercises');
  const [selected, setSelected] = useState<number | null>(null);

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    onResult(idx === ex.correctIndex);
  };

  const renderTriangle = (
    sides: [number, number, number],
    label: string,
    idx: number,
  ) => {
    const sorted = [...sides].sort((x, y) => x - y);
    const scale = 10;
    const w = sorted[1] * scale;
    const h = sorted[0] * scale;
    const viewW = Math.max(w + 40, 100);
    const viewH = Math.max(h + 50, 90);

    let borderColor = 'border-border hover:border-primary/30';
    if (selected !== null) {
      if (idx === ex.correctIndex) {
        borderColor = 'border-success/40 bg-success/5';
      } else if (idx === selected && idx !== ex.correctIndex) {
        borderColor = 'border-error/40 bg-error/5';
      } else {
        borderColor = 'border-border opacity-50';
      }
    }

    return (
      <button
        key={idx}
        onClick={() => handleSelect(idx)}
        disabled={selected !== null}
        className={cn(
          'rounded-lg p-3 border cursor-pointer transition-all duration-200 bg-surface',
          borderColor,
          selected !== null && 'cursor-default',
        )}
      >
        <div className="text-xs font-bold text-muted mb-1">
          {label}
        </div>
        <svg
          viewBox={`0 0 ${viewW} ${viewH}`}
          className="w-full h-auto max-h-[100px]"
        >
          <polygon
            points={`20,${viewH - 20} 20,${viewH - 20 - h} ${20 + w},${viewH - 20}`}
            fill="var(--primary)"
            fillOpacity={0.08}
            stroke="var(--primary)"
            strokeWidth={1.5}
          />
          <text
            x="8"
            y={viewH - 20 - h / 2}
            textAnchor="end"
            fontSize="10"
            className="fill-muted"
            fontWeight="bold"
          >
            {sides[0]}
          </text>
          <text
            x={20 + w / 2}
            y={viewH - 5}
            textAnchor="middle"
            fontSize="10"
            className="fill-muted"
            fontWeight="bold"
          >
            {sides[1]}
          </text>
          <text
            x={20 + w / 2 + 8}
            y={viewH - 20 - h / 2 - 5}
            fontSize="10"
            className="fill-muted"
            fontWeight="bold"
          >
            {sides[2]}
          </text>
        </svg>
      </button>
    );
  };

  return (
    <div
      className={cn(
        'bg-surface rounded-xl p-5 border transition-colors duration-300',
        result === true
          ? 'border-success/40'
          : result === false
            ? 'border-error/40'
            : 'border-border',
      )}
    >
      <Badge
        variant={
          result === true
            ? 'success'
            : result === false
              ? 'error'
              : 'default'
        }
      >
        {result === true
          ? t('correct')
          : result === false
            ? t('tryAgain')
            : t('exerciseN', { n: index + 1 })}
      </Badge>

      <p className="text-sm leading-relaxed mt-2.5 mb-3">
        <MathText>{ex.q}</MathText>
      </p>

      <div className="grid grid-cols-3 gap-2">
        {ex.triangles.map((tri, i) =>
          renderTriangle(tri.sides, tri.label, i),
        )}
      </div>

      {selected !== null && (
        <p className="text-xs text-muted mt-2.5 italic">
          <MathText>{ex.explanation}</MathText>
        </p>
      )}
    </div>
  );
}

// --- Numeric Exercise ---

function NumericExercise({
  ex,
  index,
  result,
  onResult,
}: {
  ex: Extract<Exercise, { type: 'numeric' }>;
  index: number;
  result: boolean | null;
  onResult: (correct: boolean) => void;
}) {
  const t = useTranslations('lesson.pythagoras.exercises');
  const [answer, setAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const check = () => {
    const val = parseFloat(answer);
    if (isNaN(val)) return;
    const correct = Math.abs(val - ex.answer) <= ex.tolerance;
    onResult(correct);
    if (!correct) {
      setAttempts((a) => a + 1);
      if (attempts === 0) setShowHint(true);
    }
  };

  return (
    <div
      className={cn(
        'bg-surface rounded-xl p-5 border transition-colors duration-300',
        result === true
          ? 'border-success/40'
          : result === false
            ? 'border-error/40'
            : 'border-border',
      )}
    >
      <div className="flex justify-between items-center mb-2.5">
        <Badge
          variant={
            result === true
              ? 'success'
              : result === false
                ? 'error'
                : 'default'
          }
        >
          {result === true
            ? t('correct')
            : result === false
              ? t('tryAgain')
              : t('exerciseN', { n: index + 1 })}
        </Badge>
        <button
          onClick={() => setShowHint(!showHint)}
          className="bg-transparent border border-border rounded-md text-muted text-[11px] py-0.5 px-2.5 cursor-pointer font-semibold hover:border-primary/30 transition-colors"
        >
          {showHint ? t('hideHint') : t('hint')}
        </button>
      </div>

      <p className="text-sm leading-relaxed mb-2.5">
        <MathText>{ex.q}</MathText>
      </p>

      {showHint && (
        <div className="bg-surface-alt rounded-lg p-2.5 mb-2.5 border-l-[3px] border-accent text-xs text-accent">
          <MathText>{ex.hint}</MathText>
        </div>
      )}

      <div className="flex gap-2 items-center">
        <label htmlFor={`exercise-${index}`} className="sr-only">
          {t('placeholder')}
        </label>
        <input
          id={`exercise-${index}`}
          type="number"
          step="any"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && check()}
          placeholder={t('placeholder')}
          className="flex-1 py-2 px-3 rounded-lg border border-border bg-surface-alt text-[15px] outline-none focus:border-primary/50 transition-colors"
        />
        <span className="text-muted text-sm">{ex.unit}</span>
        <Button
          variant="primary"
          size="sm"
          className="rounded-lg font-bold"
          onClick={check}
        >
          {t('check')}
        </Button>
      </div>

      {result === true && ex.storyContext && (
        <div className="mt-2 text-xs text-success italic">
          {ex.storyContext}
        </div>
      )}

      {result === false && attempts >= 2 && (
        <div className="mt-2 text-xs text-error">
          {t('correctAnswer', { answer: ex.answer, unit: ex.unit })}
        </div>
      )}
    </div>
  );
}

// --- Multiple Choice Exercise ---

function MultipleChoiceExercise({
  ex,
  index,
  result,
  onResult,
}: {
  ex: Extract<Exercise, { type: 'multiple-choice' }>;
  index: number;
  result: boolean | null;
  onResult: (correct: boolean) => void;
}) {
  const t = useTranslations('lesson.pythagoras.exercises');
  const [selected, setSelected] = useState<number | null>(null);

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    onResult(idx === ex.correctIndex);
  };

  return (
    <div
      className={cn(
        'bg-surface rounded-xl p-5 border transition-colors duration-300',
        result === true
          ? 'border-success/40'
          : result === false
            ? 'border-error/40'
            : 'border-border',
      )}
    >
      <Badge
        variant={
          result === true
            ? 'success'
            : result === false
              ? 'error'
              : 'default'
        }
      >
        {result === true
          ? t('correct')
          : result === false
            ? t('tryAgain')
            : t('exerciseN', { n: index + 1 })}
      </Badge>

      <p className="text-sm leading-relaxed mt-2.5 mb-3">
        <MathText>{ex.q}</MathText>
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {ex.options.map((opt, i) => {
          let variant = 'border-border hover:border-primary/30';
          if (selected !== null) {
            if (i === ex.correctIndex)
              variant =
                'border-success/40 bg-success/10 text-success';
            else if (i === selected && i !== ex.correctIndex)
              variant =
                'border-error/40 bg-error/10 text-error';
            else variant = 'border-border opacity-50';
          }
          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={selected !== null}
              className={cn(
                'rounded-lg p-3 text-sm font-semibold border cursor-pointer transition-all duration-200 bg-surface text-left',
                variant,
                selected !== null && 'cursor-default',
              )}
            >
              <MathText>{opt}</MathText>
            </button>
          );
        })}
      </div>

      {selected !== null && (
        <p className="text-xs text-muted mt-2.5 italic">
          <MathText>{ex.explanation}</MathText>
        </p>
      )}
    </div>
  );
}

// --- Find Error Exercise ---

function FindErrorExercise({
  ex,
  index,
  result,
  onResult,
}: {
  ex: Extract<Exercise, { type: 'find-error' }>;
  index: number;
  result: boolean | null;
  onResult: (correct: boolean) => void;
}) {
  const t = useTranslations('lesson.pythagoras.exercises');
  const [selected, setSelected] = useState<number | null>(null);

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    onResult(idx === ex.errorIndex);
  };

  return (
    <div
      className={cn(
        'bg-surface rounded-xl p-5 border transition-colors duration-300',
        result === true
          ? 'border-success/40'
          : result === false
            ? 'border-error/40'
            : 'border-border',
      )}
    >
      <Badge
        variant={
          result === true
            ? 'success'
            : result === false
              ? 'error'
              : 'default'
        }
      >
        {result === true
          ? t('correct')
          : result === false
            ? t('tryAgain')
            : t('exerciseN', { n: index + 1 })}
      </Badge>

      <p className="text-sm leading-relaxed mt-2.5 mb-3">
        <MathText>{ex.q}</MathText>
      </p>

      <p className="text-xs text-muted mb-2 font-semibold">
        {t('selectStep')}
      </p>

      <div className="flex flex-col gap-1.5">
        {ex.solution.map((step, i) => {
          let variant =
            'border-border hover:border-primary/30 cursor-pointer';
          if (selected !== null) {
            if (i === ex.errorIndex)
              variant = 'border-error/40 bg-error/10';
            else if (i === selected && i !== ex.errorIndex)
              variant =
                'border-error/40 bg-error/5 opacity-60';
            else variant = 'border-success/25 bg-success/5';
          }
          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={selected !== null}
              className={cn(
                'rounded-lg py-2.5 px-4 text-left text-sm border transition-all duration-200 bg-surface',
                variant,
                selected !== null && 'cursor-default',
              )}
            >
              <span className="text-muted text-xs mr-2">
                {step.label}
              </span>
              <Tex>{step.math}</Tex>
            </button>
          );
        })}
      </div>

      {selected !== null && (
        <div className="mt-2.5">
          {result === true && (
            <p className="text-xs text-success font-semibold">
              {t('stepCorrectNote')}
            </p>
          )}
          <p className="text-xs text-muted mt-1 italic">
            <MathText>{ex.explanation}</MathText>
          </p>
        </div>
      )}
    </div>
  );
}

// --- Word Problem Exercise ---

function WordProblemExercise({
  ex,
  index,
  result,
  onResult,
}: {
  ex: Extract<Exercise, { type: 'word-problem' }>;
  index: number;
  result: boolean | null;
  onResult: (correct: boolean) => void;
}) {
  const t = useTranslations('lesson.pythagoras.exercises');
  const [answer, setAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const check = () => {
    const val = parseFloat(answer);
    if (isNaN(val)) return;
    const correct = Math.abs(val - ex.answer) <= ex.tolerance;
    onResult(correct);
    if (!correct) {
      setAttempts((a) => a + 1);
      if (attempts === 0) setShowHint(true);
    }
  };

  return (
    <div
      className={cn(
        'bg-surface rounded-xl p-5 border transition-colors duration-300',
        result === true
          ? 'border-success/40'
          : result === false
            ? 'border-error/40'
            : 'border-border',
      )}
    >
      <div className="flex justify-between items-center mb-2.5">
        <Badge
          variant={
            result === true
              ? 'success'
              : result === false
                ? 'error'
                : 'default'
          }
        >
          {result === true
            ? t('correct')
            : result === false
              ? t('tryAgain')
              : t('exerciseN', { n: index + 1 })}
        </Badge>
        <button
          onClick={() => setShowHint(!showHint)}
          className="bg-transparent border border-border rounded-md text-muted text-[11px] py-0.5 px-2.5 cursor-pointer font-semibold hover:border-primary/30 transition-colors"
        >
          {showHint ? t('hideHint') : t('hint')}
        </button>
      </div>

      {/* Scenario */}
      <div className="bg-surface-alt rounded-lg p-3 mb-3 border border-border">
        <p className="text-sm leading-relaxed italic text-muted">
          {ex.scenario}
        </p>
      </div>

      <p className="text-sm leading-relaxed mb-2.5 font-semibold">
        <MathText>{ex.q}</MathText>
      </p>

      {showHint && (
        <div className="bg-surface-alt rounded-lg p-2.5 mb-2.5 border-l-[3px] border-accent text-xs text-accent">
          <MathText>{ex.hint}</MathText>
        </div>
      )}

      <div className="flex gap-2 items-center">
        <label htmlFor={`exercise-${index}`} className="sr-only">
          {t('placeholder')}
        </label>
        <input
          id={`exercise-${index}`}
          type="number"
          step="any"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && check()}
          placeholder={t('placeholder')}
          className="flex-1 py-2 px-3 rounded-lg border border-border bg-surface-alt text-[15px] outline-none focus:border-primary/50 transition-colors"
        />
        <span className="text-muted text-sm">{ex.unit}</span>
        <Button
          variant="primary"
          size="sm"
          className="rounded-lg font-bold"
          onClick={check}
        >
          {t('check')}
        </Button>
      </div>

      {result === false && attempts >= 2 && (
        <div className="mt-2 text-xs text-error">
          {t('correctAnswer', {
            answer: ex.answer,
            unit: ex.unit,
          })}
        </div>
      )}
    </div>
  );
}

// --- Main Exercises Section ---

export function ExercisesSection() {
  const t = useTranslations('lesson.pythagoras.exercises');
  const [results, setResults] = useState<(boolean | null)[]>(
    EXERCISES.map(() => null),
  );
  const [score, setScore] = useState<number | null>(null);

  const handleResult = useCallback(
    (index: number, correct: boolean) => {
      const newResults = [...results];
      newResults[index] = correct;
      setResults(newResults);
    },
    [results],
  );

  const checkAll = useCallback(() => {
    setScore(results.filter((r) => r === true).length);
  }, [results]);

  return (
    <div>
      <div className="flex flex-col gap-3.5">
        {EXERCISES.map((ex, i) => {
          switch (ex.type) {
            case 'visual-identify':
              return (
                <VisualIdentifyExercise
                  key={i}
                  ex={ex}
                  index={i}
                  result={results[i]}
                  onResult={(c) => handleResult(i, c)}
                />
              );
            case 'numeric':
              return (
                <NumericExercise
                  key={i}
                  ex={ex}
                  index={i}
                  result={results[i]}
                  onResult={(c) => handleResult(i, c)}
                />
              );
            case 'multiple-choice':
              return (
                <MultipleChoiceExercise
                  key={i}
                  ex={ex}
                  index={i}
                  result={results[i]}
                  onResult={(c) => handleResult(i, c)}
                />
              );
            case 'find-error':
              return (
                <FindErrorExercise
                  key={i}
                  ex={ex}
                  index={i}
                  result={results[i]}
                  onResult={(c) => handleResult(i, c)}
                />
              );
            case 'word-problem':
              return (
                <WordProblemExercise
                  key={i}
                  ex={ex}
                  index={i}
                  result={results[i]}
                  onResult={(c) => handleResult(i, c)}
                />
              );
          }
        })}
      </div>

      <Button
        variant="primary"
        size="md"
        className="w-full mt-4 rounded-lg font-bold"
        onClick={checkAll}
      >
        {t('checkAll')}
      </Button>

      {score !== null && (
        <div
          className={cn(
            'mt-4 text-center p-5 rounded-xl border',
            score === EXERCISES.length
              ? 'bg-success/5 border-success/25'
              : 'bg-surface border-border',
          )}
        >
          <div className="text-xl font-bold">
            {t('score', { score, total: EXERCISES.length })}
          </div>
          <div className="text-xs text-muted mt-1">
            {score === EXERCISES.length
              ? t('perfect')
              : t('keepPracticing')}
          </div>
        </div>
      )}
    </div>
  );
}
