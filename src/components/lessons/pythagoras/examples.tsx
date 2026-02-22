import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Math as Tex } from '@/components/ui/math';
import { ItemStepper, type ItemStatus } from '@/components/ui/item-stepper';
import { STORY_EXAMPLES } from './data';
import type { StoryExample } from './data';

function ParkDiagram() {
  return (
    <svg
      viewBox="0 0 400 280"
      className="w-full h-auto max-w-[380px] mx-auto"
      role="img"
      aria-label="Park shortcut diagram"
    >
      <title>Park shortcut diagram</title>
      <rect
        x="20"
        y="20"
        width="360"
        height="240"
        rx="12"
        fill="var(--surface-alt)"
        stroke="var(--border)"
        strokeWidth="1"
      />
      {/* Trees */}
      <circle
        cx="100"
        cy="100"
        r="15"
        fill="var(--success)"
        fillOpacity="0.2"
      />
      <circle
        cx="250"
        cy="80"
        r="12"
        fill="var(--success)"
        fillOpacity="0.15"
      />
      <circle
        cx="180"
        cy="150"
        r="18"
        fill="var(--success)"
        fillOpacity="0.2"
      />
      {/* Horizontal road */}
      <line
        x1="60"
        y1="220"
        x2="310"
        y2="220"
        stroke="var(--muted)"
        strokeWidth="4"
      />
      <text
        x="185"
        y="245"
        textAnchor="middle"
        className="fill-muted"
        fontSize="13"
        fontWeight="bold"
      >
        300 m
      </text>
      {/* Vertical road */}
      <line
        x1="310"
        y1="220"
        x2="310"
        y2="70"
        stroke="var(--muted)"
        strokeWidth="4"
      />
      <text
        x="345"
        y="150"
        textAnchor="middle"
        className="fill-muted"
        fontSize="13"
        fontWeight="bold"
        transform="rotate(90, 345, 150)"
      >
        400 m
      </text>
      {/* Shortcut */}
      <line
        x1="60"
        y1="220"
        x2="310"
        y2="70"
        stroke="var(--accent)"
        strokeWidth="3"
        strokeDasharray="8,5"
      />
      <text
        x="165"
        y="128"
        textAnchor="middle"
        className="fill-accent font-display"
        fontSize="16"
        fontWeight="bold"
      >
        c = ?
      </text>
      {/* Points */}
      <circle cx="60" cy="220" r="6" fill="var(--primary)" />
      <text
        x="50"
        y="215"
        textAnchor="end"
        className="fill-primary"
        fontSize="11"
        fontWeight="bold"
      >
        Sofie
      </text>
      <circle cx="310" cy="70" r="6" fill="var(--primary)" />
      <text
        x="320"
        y="62"
        className="fill-primary"
        fontSize="11"
        fontWeight="bold"
      >
        Skole
      </text>
      {/* Right angle marker */}
      <polyline
        points="310,200 290,200 290,220"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function LadderDiagram() {
  return (
    <svg
      viewBox="0 0 350 320"
      className="w-full h-auto max-w-[340px] mx-auto"
      role="img"
      aria-label="Ladder diagram"
    >
      <title>Ladder diagram</title>
      {/* Building wall */}
      <rect
        x="200"
        y="20"
        width="130"
        height="280"
        fill="var(--surface-alt)"
        stroke="var(--border)"
        strokeWidth="1"
        rx="4"
      />
      {/* Window */}
      <rect
        x="230"
        y="65"
        width="40"
        height="50"
        fill="var(--primary)"
        fillOpacity="0.15"
        stroke="var(--primary)"
        strokeWidth="1.5"
        rx="2"
      />
      <line
        x1="250"
        y1="65"
        x2="250"
        y2="115"
        stroke="var(--primary)"
        strokeWidth="1"
      />
      <line
        x1="230"
        y1="90"
        x2="270"
        y2="90"
        stroke="var(--primary)"
        strokeWidth="1"
      />
      {/* Ground */}
      <line
        x1="20"
        y1="300"
        x2="330"
        y2="300"
        stroke="var(--muted)"
        strokeWidth="2"
      />
      {/* Wall height */}
      <line
        x1="200"
        y1="90"
        x2="200"
        y2="300"
        stroke="var(--success)"
        strokeWidth="2.5"
      />
      <text
        x="185"
        y="200"
        textAnchor="end"
        className="fill-success"
        fontSize="13"
        fontWeight="bold"
      >
        12 m
      </text>
      {/* Ground distance */}
      <line
        x1="120"
        y1="300"
        x2="200"
        y2="300"
        stroke="var(--error)"
        strokeWidth="2.5"
      />
      <text
        x="160"
        y="316"
        textAnchor="middle"
        className="fill-error"
        fontSize="13"
        fontWeight="bold"
      >
        5 m
      </text>
      {/* Ladder */}
      <line
        x1="120"
        y1="300"
        x2="200"
        y2="90"
        stroke="var(--accent)"
        strokeWidth="3"
        strokeDasharray="8,5"
      />
      <text
        x="140"
        y="185"
        textAnchor="middle"
        className="fill-accent font-display"
        fontSize="15"
        fontWeight="bold"
        transform="rotate(-69, 140, 185)"
      >
        c = ?
      </text>
      {/* Right angle marker */}
      <polyline
        points="200,280 180,280 180,300"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="1.5"
      />
      {/* Fire truck */}
      <rect
        x="60"
        y="280"
        width="80"
        height="20"
        rx="3"
        fill="var(--error)"
        fillOpacity="0.2"
        stroke="var(--error)"
        strokeWidth="1"
      />
    </svg>
  );
}

function ScreenDiagram() {
  return (
    <svg
      viewBox="0 0 400 280"
      className="w-full h-auto max-w-[380px] mx-auto"
      role="img"
      aria-label="Screen diagram"
    >
      <title>Screen diagram</title>
      {/* Monitor body */}
      <rect
        x="50"
        y="30"
        width="300"
        height="190"
        rx="8"
        fill="var(--surface-alt)"
        stroke="var(--border)"
        strokeWidth="2"
      />
      {/* Screen area */}
      <rect
        x="65"
        y="45"
        width="270"
        height="160"
        rx="4"
        fill="var(--primary)"
        fillOpacity="0.05"
        stroke="var(--primary)"
        strokeWidth="1"
        strokeOpacity="0.3"
      />
      {/* Stand */}
      <rect
        x="170"
        y="220"
        width="60"
        height="10"
        rx="2"
        fill="var(--muted)"
        fillOpacity="0.3"
      />
      <rect
        x="155"
        y="230"
        width="90"
        height="5"
        rx="2"
        fill="var(--muted)"
        fillOpacity="0.3"
      />
      {/* Width label */}
      <line
        x1="65"
        y1="215"
        x2="335"
        y2="215"
        stroke="var(--error)"
        strokeWidth="2"
      />
      <text
        x="200"
        y="213"
        textAnchor="middle"
        className="fill-error"
        fontSize="13"
        fontWeight="bold"
      >
        60 cm (b)
      </text>
      {/* Height label */}
      <line
        x1="345"
        y1="45"
        x2="345"
        y2="205"
        stroke="var(--success)"
        strokeWidth="2"
        strokeDasharray="6,4"
      />
      <text
        x="365"
        y="130"
        textAnchor="middle"
        className="fill-success font-display"
        fontSize="14"
        fontWeight="bold"
        transform="rotate(90, 365, 130)"
      >
        a = ?
      </text>
      {/* Diagonal */}
      <line
        x1="65"
        y1="205"
        x2="335"
        y2="45"
        stroke="var(--accent)"
        strokeWidth="2.5"
        strokeDasharray="6,4"
      />
      <text
        x="180"
        y="110"
        textAnchor="middle"
        className="fill-accent font-display"
        fontSize="14"
        fontWeight="bold"
        transform="rotate(-31, 180, 110)"
      >
        68,6 cm (c)
      </text>
      {/* Right angle marker */}
      <polyline
        points="65,185 85,185 85,205"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function ScenarioDiagram({
  type,
}: {
  type: StoryExample['diagramType'];
}) {
  switch (type) {
    case 'park':
      return <ParkDiagram />;
    case 'ladder':
      return <LadderDiagram />;
    case 'screen':
      return <ScreenDiagram />;
  }
}

export function ExamplesSection() {
  const t = useTranslations('lesson.pythagoras.examples');
  const [revealedSteps, setRevealedSteps] = useState<number[]>(
    STORY_EXAMPLES.map(() => -1),
  );

  const statuses: ItemStatus[] = STORY_EXAMPLES.map((ex, i) =>
    revealedSteps[i] >= ex.steps.length - 1 ? 'completed' : 'pending',
  );

  const reveal = useCallback(
    (exIdx: number) => {
      const newSteps = [...revealedSteps];
      newSteps[exIdx] = Math.min(
        STORY_EXAMPLES[exIdx].steps.length - 1,
        newSteps[exIdx] + 1,
      );
      setRevealedSteps(newSteps);
    },
    [revealedSteps],
  );

  const reset = useCallback(
    (exIdx: number) => {
      const newSteps = [...revealedSteps];
      newSteps[exIdx] = -1;
      setRevealedSteps(newSteps);
    },
    [revealedSteps],
  );

  return (
    <div>
      <ItemStepper
        count={STORY_EXAMPLES.length}
        labels={STORY_EXAMPLES.map((e) => e.title)}
        statuses={statuses}
        autoAdvanceOn={['completed']}
      >
        {(activeIdx) => {
          const ex = STORY_EXAMPLES[activeIdx];
          const revealed = revealedSteps[activeIdx];

          return (
            <div>
              {/* Scenario card */}
              <div className="bg-surface rounded-xl p-5 border border-border mb-4">
                <Badge>{t('scenario')}</Badge>
                <p className="mt-2.5 text-[15px] leading-relaxed">
                  {ex.scenario}
                </p>
                <p className="text-sm font-semibold text-primary mt-2">
                  {ex.question}
                </p>
              </div>

              {/* Scenario diagram */}
              <div className="bg-surface rounded-xl p-3 border border-border mb-4">
                <ScenarioDiagram type={ex.diagramType} />
              </div>

              {/* Accumulated steps */}
              <div className="flex flex-col gap-2 mb-4">
                {ex.steps.map((s, i) => (
                  <div
                    key={i}
                    className={cn(
                      'rounded-lg py-2.5 px-4 text-[15px] transition-all duration-400 border',
                      i <= revealed
                        ? 'bg-surface border-primary/25 opacity-100'
                        : 'bg-surface-alt border-border opacity-30',
                    )}
                  >
                    <span className="text-muted text-xs mr-2 font-semibold">
                      {s.label}
                    </span>
                    {i <= revealed ? (
                      <span>
                        <Tex>{s.math}</Tex>
                        <p className="text-xs text-muted mt-1 italic">
                          {s.explanation}
                        </p>
                      </span>
                    ) : (
                      '\u2022 \u2022 \u2022'
                    )}
                  </div>
                ))}
              </div>

              {/* Controls */}
              <div className="flex gap-2.5">
                <Button
                  variant="primary"
                  size="sm"
                  className="flex-1 rounded-lg font-bold"
                  onClick={() => reveal(activeIdx)}
                  disabled={revealed >= ex.steps.length - 1}
                >
                  {t('showNext')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-lg"
                  onClick={() => reset(activeIdx)}
                >
                  {t('reset')}
                </Button>
              </div>

              {/* Answer */}
              {revealed >= ex.steps.length - 1 && (
                <div className="mt-4 rounded-lg p-4 border border-success/25 bg-success/5 text-center">
                  <div className="text-xs text-success font-bold tracking-widest uppercase mb-1">
                    {t('answer')}
                  </div>
                  <div className="text-xl text-success font-bold">
                    <Tex>{ex.answer}</Tex>{' '}
                    <span className="text-sm">{ex.answerUnit}</span>
                  </div>
                </div>
              )}
            </div>
          );
        }}
      </ItemStepper>
    </div>
  );
}
