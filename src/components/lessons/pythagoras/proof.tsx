import { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Math as Tex, MathText } from '@/components/ui/math';
import { PROOF_STEPS } from './data';

export function ProofSection() {
  const t = useTranslations('lesson.pythagoras.proof');

  // SVG step driven by hover (desktop) or IO (mobile)
  const [activeSvgStep, setActiveSvgStep] = useState(0);

  // Inline term → SVG element highlighting
  const [highlightedTargets, setHighlightedTargets] = useState<string[]>([]);

  // Section refs for IntersectionObserver
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const proofFlowRef = useRef<HTMLDivElement | null>(null);

  // Conditional IO — only when content overflows viewport (mobile/small screens)
  useEffect(() => {
    const flow = proofFlowRef.current;
    if (!flow) return;

    // Check if the proof flow extends beyond the viewport
    const flowRect = flow.getBoundingClientRect();
    if (flowRect.bottom <= window.innerHeight * 0.95) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = sectionRefs.current.indexOf(
              entry.target as HTMLElement,
            );
            if (idx >= 0) setActiveSvgStep(idx);
          }
        });
      },
      { threshold: 0.3, rootMargin: '-20% 0px -40% 0px' },
    );
    sectionRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Hover handler for sections (desktop — mouse follows eyes)
  const handleSectionHover = useCallback((idx: number) => {
    setActiveSvgStep(idx);
  }, []);

  // Hover handler for inline math terms
  const handleTermHover = useCallback(
    (stepIdx: number, formula: string, hovering: boolean) => {
      const step = PROOF_STEPS[stepIdx];
      const hl = step.highlights?.[formula];
      if (!hl) return;
      setHighlightedTargets(hovering ? hl.svgTargets : []);
    },
    [],
  );

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* SVG panel — sticky on desktop (right), sticky on mobile (top) */}
      <div className="order-first md:order-last md:w-2/5">
        <div className="sticky top-20 z-10">
          <div className="bg-surface rounded-xl p-5 border border-border">
            <ProofSVG
              activeSvgStep={activeSvgStep}
              svgLabel={t('svgLabel')}
              highlightedTargets={highlightedTargets}
            />
          </div>
        </div>
      </div>

      {/* Proof flow — left column */}
      <div className="md:w-3/5" ref={proofFlowRef}>
        {PROOF_STEPS.map((step, i) => {
          const isActive = activeSvgStep === i;

          // Build highlights prop for MathText
          const mathHighlights = step.highlights
            ? Object.fromEntries(
                Object.entries(step.highlights).map(([k, v]) => [
                  k,
                  { color: v.color },
                ]),
              )
            : undefined;

          return (
            <section
              key={i}
              ref={(el) => {
                sectionRefs.current[i] = el;
              }}
              onMouseEnter={() => handleSectionHover(i)}
              className={`py-4 pl-3 border-l-2 rounded-r-lg transition-all duration-200 ${
                isActive
                  ? 'border-primary bg-primary/[0.03]'
                  : 'border-transparent hover:border-border hover:bg-surface-alt/50'
              }`}
            >
              {/* Step header */}
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-xs font-bold text-primary bg-primary-subtle rounded-full w-6 h-6 flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                <h3 className="font-semibold text-base">{step.title}</h3>
              </div>

              {/* Step text with interactive math terms */}
              <p className="text-[15px] leading-relaxed text-muted mb-3">
                <MathText
                  highlights={mathHighlights}
                  onTermHover={(formula, hovering) =>
                    handleTermHover(i, formula, hovering)
                  }
                >
                  {step.text}
                </MathText>
              </p>

              {/* Math formula box */}
              {step.math && (
                <div className="bg-surface-alt rounded-lg p-3.5 border-l-[3px] border-primary mb-3">
                  <Tex display>{step.math}</Tex>
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}

// --- Proof SVG component ---

interface ProofSVGProps {
  activeSvgStep: number;
  svgLabel: string;
  highlightedTargets: string[];
}

function ProofSVG({
  activeSvgStep,
  svgLabel,
  highlightedTargets,
}: ProofSVGProps) {
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

  const reducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  const transition = reducedMotion
    ? 'none'
    : 'opacity 0.5s ease, transform 0.4s ease';

  const isHl = (id: string) => highlightedTargets.includes(id);

  const glowStyle = (id: string, color: string) => ({
    filter: isHl(id)
      ? `drop-shadow(0 0 6px var(--${color}))`
      : 'none',
    animation:
      isHl(id) && !reducedMotion
        ? 'highlight-glow 1.5s ease-in-out infinite'
        : 'none',
    transition: 'filter 0.3s ease',
    color: `var(--${color})`,
  });

  const trianglePoints = [
    `${TL.x},${TL.y} ${pTop.x},${pTop.y} ${pLeft.x},${pLeft.y}`,
    `${TR.x},${TR.y} ${pRight.x},${pRight.y} ${pTop.x},${pTop.y}`,
    `${BR.x},${BR.y} ${pBottom.x},${pBottom.y} ${pRight.x},${pRight.y}`,
    `${BL.x},${BL.y} ${pLeft.x},${pLeft.y} ${pBottom.x},${pBottom.y}`,
  ];

  return (
    <svg
      viewBox={`0 0 ${S} ${S}`}
      className="w-full h-auto max-h-[180px] md:max-h-[300px] mx-auto"
      role="img"
      aria-label={svgLabel}
    >
      <title>{svgLabel}</title>

      {/* Step 1: Solo triangle — fades out when step >= 1 */}
      <g
        style={{
          opacity: activeSvgStep === 0 ? 1 : 0,
          transition,
          pointerEvents: activeSvgStep === 0 ? 'auto' : 'none',
        }}
      >
        <polygon
          points={`${TL.x},${TL.y} ${pTop.x},${pTop.y} ${pLeft.x},${pLeft.y}`}
          fill="var(--primary)"
          fillOpacity={0.15}
          stroke="var(--primary)"
          strokeWidth={2}
        />
        <text
          data-highlight="side-a"
          x={TL.x + aLen / 3 - 10}
          y={(TL.y + pLeft.y) / 2}
          className="fill-success font-display"
          fontSize="14"
          fontStyle="italic"
          style={glowStyle('side-a', 'success')}
        >
          a
        </text>
        <text
          data-highlight="side-b"
          x={(TL.x + pTop.x) / 2}
          y={TL.y - 8}
          textAnchor="middle"
          className="fill-error font-display"
          fontSize="14"
          fontStyle="italic"
          style={glowStyle('side-b', 'error')}
        >
          b
        </text>
        <text
          data-highlight="side-c"
          x={(pTop.x + pLeft.x) / 2 + 8}
          y={(pTop.y + pLeft.y) / 2}
          className="fill-primary font-display"
          fontSize="14"
          fontWeight="bold"
          fontStyle="italic"
          style={glowStyle('side-c', 'primary')}
        >
          c
        </text>
        <polyline
          points={`${TL.x},${TL.y + 12} ${TL.x + 12},${TL.y + 12} ${TL.x + 12},${TL.y}`}
          fill="none"
          stroke="var(--accent)"
          strokeWidth={1.5}
        />
      </g>

      {/* Steps 2+: Outer square + 4 triangles */}
      <g
        style={{
          opacity: activeSvgStep >= 1 ? 1 : 0,
          transform: `scale(${activeSvgStep >= 1 ? 1 : 0.92})`,
          transformOrigin: 'center',
          transition,
          pointerEvents: activeSvgStep >= 1 ? 'auto' : 'none',
        }}
      >
        <rect
          data-highlight="outer-rect"
          x={pad}
          y={pad}
          width={outer}
          height={outer}
          fill="none"
          style={{
            stroke:
              isHl('outer-rect') || activeSvgStep === 2
                ? 'var(--accent)'
                : 'var(--muted)',
            strokeWidth:
              isHl('outer-rect') || activeSvgStep === 2 ? 3 : 1.5,
            filter: isHl('outer-rect')
              ? 'drop-shadow(0 0 6px var(--accent))'
              : 'none',
            animation:
              isHl('outer-rect') && !reducedMotion
                ? 'highlight-glow 1.5s ease-in-out infinite'
                : 'none',
            transition:
              'stroke 0.3s ease, stroke-width 0.3s ease, filter 0.3s ease',
            color: 'var(--accent)',
          }}
        />
        {trianglePoints.map((pts, i) => (
          <polygon
            key={i}
            data-highlight={`tri-${i}`}
            points={pts}
            className="stroke-primary"
            fill="var(--primary)"
            fillOpacity={isHl(`tri-${i}`) ? 0.3 : 0.15}
            strokeWidth={1.5}
            style={glowStyle(`tri-${i}`, 'primary')}
          />
        ))}

        {/* Side labels */}
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
        <text
          data-highlight="side-c"
          x={(pTop.x + pRight.x) / 2 + 10}
          y={(pTop.y + pRight.y) / 2}
          className="fill-primary font-display"
          fontSize="12"
          fontWeight="bold"
          fontStyle="italic"
          style={{
            opacity: activeSvgStep < 4 ? 1 : 0,
            filter: isHl('side-c')
              ? 'drop-shadow(0 0 6px var(--primary))'
              : 'none',
            animation:
              isHl('side-c') && !reducedMotion
                ? 'highlight-glow 1.5s ease-in-out infinite'
                : 'none',
            color: 'var(--primary)',
            transition: reducedMotion
              ? 'none'
              : 'opacity 0.5s ease, transform 0.4s ease, filter 0.3s ease',
          }}
        >
          c
        </text>
      </g>

      {/* Step 3: (a+b)² label */}
      <text
        x={pad + outer / 2}
        y={pad + outer + 18}
        textAnchor="middle"
        className="fill-accent font-display"
        fontSize="12"
        fontWeight="bold"
        style={{
          opacity: activeSvgStep === 2 ? 1 : 0,
          transition,
        }}
      >
        (a + b)&sup2;
      </text>

      {/* Steps 4+: Inner c² square + ½ab labels */}
      <g
        style={{
          opacity: activeSvgStep >= 3 ? 1 : 0,
          transform: `scale(${activeSvgStep >= 3 ? 1 : 0.92})`,
          transformOrigin: 'center',
          transition,
          pointerEvents: activeSvgStep >= 3 ? 'auto' : 'none',
        }}
      >
        <polygon
          data-highlight="inner-square"
          points={`${pTop.x},${pTop.y} ${pRight.x},${pRight.y} ${pBottom.x},${pBottom.y} ${pLeft.x},${pLeft.y}`}
          fill="var(--accent)"
          fillOpacity={isHl('inner-square') ? 0.25 : 0.1}
          stroke="var(--accent)"
          strokeWidth={2.5}
          style={glowStyle('inner-square', 'accent')}
        />
        <text
          data-highlight="c-sq-label"
          x={S / 2}
          y={S / 2 + 5}
          textAnchor="middle"
          className="fill-accent font-display"
          fontSize="16"
          fontWeight="bold"
          style={glowStyle('c-sq-label', 'accent')}
        >
          c&sup2;
        </text>
        <text
          data-highlight="tri-0"
          x={TL.x + 15}
          y={TL.y + 25}
          className="fill-muted"
          fontSize="9"
          style={glowStyle('tri-0', 'primary')}
        >
          &frac12;ab
        </text>
        <text
          data-highlight="tri-1"
          x={TR.x - 25}
          y={TR.y + 20}
          className="fill-muted"
          fontSize="9"
          style={glowStyle('tri-1', 'primary')}
        >
          &frac12;ab
        </text>
        <text
          data-highlight="tri-2"
          x={BR.x - 25}
          y={BR.y - 10}
          className="fill-muted"
          fontSize="9"
          style={glowStyle('tri-2', 'primary')}
        >
          &frac12;ab
        </text>
        <text
          data-highlight="tri-3"
          x={BL.x + 8}
          y={BL.y - 14}
          className="fill-muted"
          fontSize="9"
          style={glowStyle('tri-3', 'primary')}
        >
          &frac12;ab
        </text>
      </g>

      {/* Step 5: Final result */}
      <text
        x={pad + outer / 2}
        y={pad + outer + 18}
        textAnchor="middle"
        className="fill-primary font-display"
        fontSize="11"
        fontWeight="bold"
        style={{
          opacity: activeSvgStep >= 4 ? 1 : 0,
          transition,
        }}
      >
        a&sup2; + b&sup2; = c&sup2; &#9724;
      </text>
    </svg>
  );
}
