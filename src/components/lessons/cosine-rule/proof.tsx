import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Math as Tex, MathText } from '@/components/ui/math';
import { PROOF_STEPS } from './data';

function StepIndicator({ total, current }: { total: number; current: number }) {
  return (
    <div className="flex gap-1.5 mb-4">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={`h-1 flex-1 rounded-sm transition-colors duration-400 ${
            i <= current ? 'bg-primary' : 'bg-border'
          }`}
        />
      ))}
    </div>
  );
}

export function ProofSection() {
  const t = useTranslations('lesson.cosineRule.proof');
  const [step, setStep] = useState(0);

  return (
    <div>
      <h2 className="font-display text-2xl sm:text-3xl tracking-tight mb-2">
        {t('title')}{' '}
        <span className="text-primary font-bold">{t('titleHighlight')}</span>
      </h2>
      <p className="text-muted leading-relaxed mb-5">{t('desc')}</p>

      <StepIndicator total={PROOF_STEPS.length} current={step} />

      {/* Triangle SVG */}
      <div className="bg-surface rounded-xl p-5 mb-4 border border-border">
        <svg
          viewBox="0 0 400 240"
          className="w-full h-auto"
          role="img"
          aria-label="Triangle diagram for cosine rule proof"
        >
          <title>Triangle diagram for cosine rule proof</title>
          {/* Main triangle */}
          <polygon
            points="60,200 340,200 200,40"
            className="fill-primary-subtle/20 stroke-primary"
            strokeWidth={2}
          />
          {/* Height line */}
          <line
            x1="200"
            y1="40"
            x2="200"
            y2="200"
            className="stroke-accent"
            strokeWidth={1.5}
            strokeDasharray="6,4"
          />
          {/* Right angle marker */}
          <rect
            x="200"
            y="188"
            width="12"
            height="12"
            fill="none"
            className="stroke-accent"
            strokeWidth={1}
          />
          <text
            x="206"
            y="180"
            className="fill-accent font-display"
            fontSize="13"
          >
            h
          </text>
          <text x="194" y="218" className="fill-muted" fontSize="12">
            X
          </text>
          {/* Vertex labels */}
          <text
            x="45"
            y="216"
            className="fill-foreground font-display"
            fontSize="15"
            fontWeight="700"
          >
            A
          </text>
          <text
            x="345"
            y="216"
            className="fill-foreground font-display"
            fontSize="15"
            fontWeight="700"
          >
            B
          </text>
          <text
            x="195"
            y="28"
            className="fill-foreground font-display"
            fontSize="15"
            fontWeight="700"
          >
            C
          </text>
          {/* Side labels */}
          <text
            x="115"
            y="108"
            className="fill-success font-display"
            fontSize="15"
            fontStyle="italic"
          >
            b
          </text>
          <text
            x="278"
            y="108"
            className="fill-error font-display"
            fontSize="15"
            fontStyle="italic"
          >
            a
          </text>
          {/* Bottom segment labels */}
          <text
            x="120"
            y="195"
            className="fill-primary font-display"
            fontSize="13"
            fontStyle="italic"
          >
            x
          </text>
          <text
            x="252"
            y="195"
            className="fill-primary font-display"
            fontSize="13"
            fontStyle="italic"
          >
            c &#8722; x
          </text>
          {/* Highlight active sub-triangles */}
          {step === 1 && (
            <polygon
              points="60,200 200,200 200,40"
              className="fill-success/10 stroke-success"
              strokeWidth={2}
            />
          )}
          {step === 2 && (
            <polygon
              points="200,200 340,200 200,40"
              className="fill-error/10 stroke-error"
              strokeWidth={2}
            />
          )}
          {step >= 4 && (
            <text
              x="78"
              y="187"
              className="fill-accent font-display"
              fontSize="12"
            >
              cos A = x/b
            </text>
          )}
        </svg>
      </div>

      {/* Step content */}
      <div className="bg-surface rounded-xl p-5 border border-border mb-4 min-h-[120px]">
        <Badge>
          {t('step', { current: step + 1, total: PROOF_STEPS.length })}
        </Badge>
        <h3 className="text-lg font-semibold mt-2.5 mb-2">
          {PROOF_STEPS[step].title}
        </h3>
        <p
          className={`text-muted leading-relaxed ${PROOF_STEPS[step].math ? 'mb-3' : ''}`}
        >
          <MathText>{PROOF_STEPS[step].text}</MathText>
        </p>
        {PROOF_STEPS[step].math && (
          <div className="bg-surface-alt rounded-lg p-3.5 text-primary border-l-[3px] border-primary">
            <Tex display>{PROOF_STEPS[step].math!}</Tex>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex gap-2.5">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 rounded-lg"
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
          aria-label={t('previous')}
        >
          &#8592; {t('previous')}
        </Button>
        <Button
          variant="primary"
          size="sm"
          className="flex-1 rounded-lg font-bold"
          onClick={() => setStep(Math.min(PROOF_STEPS.length - 1, step + 1))}
          disabled={step === PROOF_STEPS.length - 1}
          aria-label={t('next')}
        >
          {t('next')} &#8594;
        </Button>
      </div>
    </div>
  );
}
