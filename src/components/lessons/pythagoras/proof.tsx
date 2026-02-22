import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Math as Tex, MathText } from '@/components/ui/math';
import { PROOF_STEPS } from './data';

export function ProofSection() {
  const t = useTranslations('lesson.pythagoras.proof');
  const [visibleSteps, setVisibleSteps] = useState(1);
  const [blankInputs, setBlankInputs] = useState<Record<number, string>>({});
  const [blankResults, setBlankResults] = useState<
    Record<number, boolean | null>
  >({});

  const checkBlank = (stepIdx: number) => {
    const blank = PROOF_STEPS[stepIdx].blank;
    if (!blank) return;
    const input = (blankInputs[stepIdx] ?? '').replace(/\s/g, '');
    const answer = blank.answer.replace(/\s/g, '');
    setBlankResults((prev) => ({
      ...prev,
      [stepIdx]: input.toLowerCase() === answer.toLowerCase(),
    }));
  };

  const addStep = () => {
    setVisibleSteps((v) => Math.min(v + 1, PROOF_STEPS.length));
  };

  const resetProof = () => {
    setVisibleSteps(1);
    setBlankInputs({});
    setBlankResults({});
  };

  // SVG: area-based proof evolving with steps
  const renderProofSVG = () => {
    const S = 300;
    const pad = 30;
    const outer = S - 2 * pad;
    const aFrac = 0.4;
    const aLen = outer * aFrac;
    const bLen = outer * (1 - aFrac);

    const TL = { x: pad, y: pad };
    const TR = { x: pad + outer, y: pad };
    const BR = { x: pad + outer, y: pad + outer };
    const BL = { x: pad, y: pad + outer };

    const pTop = { x: TL.x + aLen, y: TL.y };
    const pRight = { x: TR.x, y: TR.y + aLen };
    const pBottom = { x: BR.x - aLen, y: BR.y };
    const pLeft = { x: BL.x, y: BL.y - aLen };

    const showOuter = visibleSteps >= 2;
    const highlightOuter = visibleSteps === 3;
    const showInner = visibleSteps >= 4;
    const showFinal = visibleSteps >= 5;

    return (
      <svg
        viewBox={`0 0 ${S} ${S}`}
        className="w-full h-auto max-w-[300px] mx-auto"
        role="img"
        aria-label={t('svgLabel')}
      >
        <title>{t('svgLabel')}</title>

        {/* Step 1: Just the triangle */}
        {visibleSteps === 1 && (
          <>
            <polygon
              points={`${TL.x},${TL.y} ${pTop.x},${pTop.y} ${pLeft.x},${pLeft.y}`}
              fill="var(--primary)"
              fillOpacity={0.15}
              stroke="var(--primary)"
              strokeWidth={2}
            />
            <text
              x={TL.x + aLen / 3 - 10}
              y={(TL.y + pLeft.y) / 2}
              className="fill-success font-display"
              fontSize="14"
              fontStyle="italic"
            >
              a
            </text>
            <text
              x={(TL.x + pTop.x) / 2}
              y={TL.y - 8}
              textAnchor="middle"
              className="fill-error font-display"
              fontSize="14"
              fontStyle="italic"
            >
              b
            </text>
            <text
              x={(pTop.x + pLeft.x) / 2 + 8}
              y={(pTop.y + pLeft.y) / 2}
              className="fill-primary font-display"
              fontSize="14"
              fontWeight="bold"
              fontStyle="italic"
            >
              c
            </text>
            <polyline
              points={`${TL.x},${TL.y + 12} ${TL.x + 12},${TL.y + 12} ${TL.x + 12},${TL.y}`}
              fill="none"
              stroke="var(--accent)"
              strokeWidth={1.5}
            />
          </>
        )}

        {/* Steps 2+: Outer square with 4 triangles */}
        {showOuter && (
          <>
            <rect
              x={pad}
              y={pad}
              width={outer}
              height={outer}
              fill="none"
              stroke={
                highlightOuter ? 'var(--accent)' : 'var(--muted)'
              }
              strokeWidth={highlightOuter ? 3 : 1.5}
            />
            {[
              `${TL.x},${TL.y} ${pTop.x},${pTop.y} ${pLeft.x},${pLeft.y}`,
              `${TR.x},${TR.y} ${pRight.x},${pRight.y} ${pTop.x},${pTop.y}`,
              `${BR.x},${BR.y} ${pBottom.x},${pBottom.y} ${pRight.x},${pRight.y}`,
              `${BL.x},${BL.y} ${pLeft.x},${pLeft.y} ${pBottom.x},${pBottom.y}`,
            ].map((pts, i) => (
              <polygon
                key={i}
                points={pts}
                className="stroke-primary"
                fill="var(--primary)"
                fillOpacity={0.15}
                strokeWidth={1.5}
              />
            ))}
          </>
        )}

        {/* Step 3: Outer area highlight */}
        {highlightOuter && (
          <text
            x={pad + outer / 2}
            y={pad + outer + 18}
            textAnchor="middle"
            className="fill-accent font-display"
            fontSize="12"
            fontWeight="bold"
          >
            (a + b)&sup2;
          </text>
        )}

        {/* Steps 4+: Inner c&sup2; square */}
        {showInner && (
          <>
            <polygon
              points={`${pTop.x},${pTop.y} ${pRight.x},${pRight.y} ${pBottom.x},${pBottom.y} ${pLeft.x},${pLeft.y}`}
              fill="var(--accent)"
              fillOpacity={0.1}
              stroke="var(--accent)"
              strokeWidth={2.5}
            />
            <text
              x={S / 2}
              y={S / 2 + 5}
              textAnchor="middle"
              className="fill-accent font-display"
              fontSize="16"
              fontWeight="bold"
            >
              c&sup2;
            </text>
            <text
              x={TL.x + 15}
              y={TL.y + 25}
              className="fill-muted"
              fontSize="9"
            >
              &frac12;ab
            </text>
            <text
              x={TR.x - 25}
              y={TR.y + 20}
              className="fill-muted"
              fontSize="9"
            >
              &frac12;ab
            </text>
            <text
              x={BR.x - 25}
              y={BR.y - 10}
              className="fill-muted"
              fontSize="9"
            >
              &frac12;ab
            </text>
            <text
              x={BL.x + 8}
              y={BL.y - 14}
              className="fill-muted"
              fontSize="9"
            >
              &frac12;ab
            </text>
          </>
        )}

        {/* Step 5: Final result */}
        {showFinal && (
          <text
            x={pad + outer / 2}
            y={pad + outer + 18}
            textAnchor="middle"
            className="fill-primary font-display"
            fontSize="11"
            fontWeight="bold"
          >
            a&sup2; + b&sup2; = c&sup2; &#9724;
          </text>
        )}

        {/* Side labels on outer square (steps 2-5) */}
        {showOuter && (
          <>
            <text
              x={TL.x + aLen / 2}
              y={TL.y - 8}
              textAnchor="middle"
              className="fill-success font-display"
              fontSize="12"
              fontStyle="italic"
            >
              a
            </text>
            <text
              x={pTop.x + bLen / 2}
              y={TL.y - 8}
              textAnchor="middle"
              className="fill-error font-display"
              fontSize="12"
              fontStyle="italic"
            >
              b
            </text>
            {!showFinal && (
              <text
                x={(pTop.x + pRight.x) / 2 + 10}
                y={(pTop.y + pRight.y) / 2}
                className="fill-primary font-display"
                fontSize="12"
                fontWeight="bold"
                fontStyle="italic"
              >
                c
              </text>
            )}
          </>
        )}
      </svg>
    );
  };

  return (
    <div>
      {/* Proof SVG — sticky on large screens only */}
      <div className="bg-surface rounded-xl p-5 mb-4 border border-border lg:sticky lg:top-20 lg:z-10">
        {renderProofSVG()}
      </div>

      {/* Accumulated steps */}
      <div className="flex flex-col gap-3 mb-4">
        {PROOF_STEPS.slice(0, visibleSteps).map((step, i) => (
          <div
            key={i}
            className="bg-surface rounded-xl p-5 border border-border"
          >
            <Badge>
              {t('step', {
                current: i + 1,
                total: PROOF_STEPS.length,
              })}
            </Badge>
            <h3 className="text-lg font-semibold mt-2.5 mb-2">
              {step.title}
            </h3>
            <p
              className={`text-muted leading-relaxed ${step.math || step.blank ? 'mb-3' : ''}`}
            >
              <MathText>{step.text}</MathText>
            </p>

            {step.math && (
              <div className="bg-surface-alt rounded-lg p-3.5 text-primary border-l-[3px] border-primary mb-3">
                <Tex display>{step.math}</Tex>
              </div>
            )}

            {/* Fill-in-the-blank */}
            {step.blank && (
              <div className="bg-surface-alt rounded-lg p-4 border border-border">
                <p className="text-sm font-semibold mb-2">
                  <MathText>{step.blank.prompt}</MathText>
                </p>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={blankInputs[i] ?? ''}
                    onChange={(e) =>
                      setBlankInputs((prev) => ({
                        ...prev,
                        [i]: e.target.value,
                      }))
                    }
                    onKeyDown={(e) =>
                      e.key === 'Enter' && checkBlank(i)
                    }
                    placeholder={t('fillBlank')}
                    className="flex-1 py-2 px-3 rounded-lg border border-border bg-surface text-[15px] outline-none focus:border-primary/50 transition-colors"
                  />
                  <Button
                    variant="primary"
                    size="sm"
                    className="rounded-lg font-bold"
                    onClick={() => checkBlank(i)}
                  >
                    {t('checkBlank')}
                  </Button>
                </div>
                {blankResults[i] === true && (
                  <p className="text-xs text-success mt-2 font-semibold">
                    {t('blankCorrect')}
                  </p>
                )}
                {blankResults[i] === false && (
                  <div className="mt-2">
                    <p className="text-xs text-error font-semibold">
                      {t('blankWrong')}
                    </p>
                    <p className="text-xs text-muted mt-1 italic">
                      <MathText>{step.blank.hint}</MathText>
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Celebration card */}
      {visibleSteps >= PROOF_STEPS.length && (
        <div className="rounded-xl p-6 text-center border border-success/25 bg-success/5 mb-4">
          <div className="text-3xl mb-2">&#9989;</div>
          <h3 className="text-lg font-bold text-success mb-1">
            {t('provedTitle')}
          </h3>
          <p className="text-sm text-muted">{t('provedDesc')}</p>
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-2.5">
        {visibleSteps < PROOF_STEPS.length && (
          <Button
            variant="primary"
            size="sm"
            className="flex-1 rounded-lg font-bold"
            onClick={addStep}
          >
            {t('showNext')}
          </Button>
        )}
        <Button
          variant="outline"
          size="sm"
          className="rounded-lg"
          onClick={resetProof}
        >
          {t('reset')}
        </Button>
      </div>
    </div>
  );
}
