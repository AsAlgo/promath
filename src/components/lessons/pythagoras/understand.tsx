'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Math as Tex } from '@/components/ui/math';

type HighlightKey = 'katet' | 'hypotenuse' | 'retVinkel' | null;

const TERMINOLOGY = [
  { key: 'katet' as const, colorClass: 'border-success/40 bg-success/5', activeClass: 'border-success bg-success/15 ring-2 ring-success/30' },
  { key: 'hypotenuse' as const, colorClass: 'border-primary/40 bg-primary-subtle/30', activeClass: 'border-primary bg-primary/15 ring-2 ring-primary/30' },
  { key: 'retVinkel' as const, colorClass: 'border-accent/40 bg-accent/5', activeClass: 'border-accent bg-accent/15 ring-2 ring-accent/30' },
] as const;

const VARIANTS = [
  { key: 'findC', math: 'c = \\sqrt{a^2 + b^2}' },
  { key: 'findA', math: 'a = \\sqrt{c^2 - b^2}' },
  { key: 'findB', math: 'b = \\sqrt{c^2 - a^2}' },
] as const;

export function UnderstandSection() {
  const t = useTranslations('lesson.pythagoras.understand');
  const [highlight, setHighlight] = useState<HighlightKey>(null);

  const dimmed = highlight !== null;

  return (
    <div className="space-y-6">

      {/* --- Section 1: The triangle --- */}
      <p className="text-[15px] leading-relaxed text-muted">
        {t('diagramIntro')}
      </p>

      <div className="flex flex-col md:flex-row gap-4 items-stretch">
        <div className="bg-surface rounded-xl p-5 border border-border md:w-1/2 flex items-center justify-center">
          <svg
            viewBox="0 0 400 300"
            className="w-full h-auto max-w-[360px]"
            role="img"
            aria-label={t('diagramLabel')}
          >
            <title>{t('diagramLabel')}</title>

            {/* Triangle fill */}
            <polygon
              points="80,260 80,60 340,260"
              fill="var(--primary)"
              fillOpacity={0.06}
              stroke="none"
            />

            {/* Side a (vertical - katet) */}
            <line
              x1="80" y1="260" x2="80" y2="60"
              stroke="var(--success)"
              strokeWidth={highlight === 'katet' ? 6 : 3}
              opacity={dimmed && highlight !== 'katet' ? 0.2 : 1}
              style={{ transition: 'all 0.2s' }}
            />
            {/* Side b (horizontal - katet) */}
            <line
              x1="80" y1="260" x2="340" y2="260"
              stroke="var(--error)"
              strokeWidth={highlight === 'katet' ? 6 : 3}
              opacity={dimmed && highlight !== 'katet' ? 0.2 : 1}
              style={{ transition: 'all 0.2s' }}
            />
            {/* Side c (hypotenuse) */}
            <line
              x1="80" y1="60" x2="340" y2="260"
              stroke="var(--primary)"
              strokeWidth={highlight === 'hypotenuse' ? 6 : 3}
              opacity={dimmed && highlight !== 'hypotenuse' ? 0.2 : 1}
              style={{ transition: 'all 0.2s' }}
            />

            {/* Right angle marker */}
            <polyline
              points="80,240 100,240 100,260"
              fill="none"
              stroke="var(--accent)"
              strokeWidth={highlight === 'retVinkel' ? 4 : 2}
              opacity={dimmed && highlight !== 'retVinkel' ? 0.2 : 1}
              style={{ transition: 'all 0.2s' }}
            />
            {/* 90° glow when active */}
            {highlight === 'retVinkel' && (
              <rect
                x="80" y="240" width="20" height="20"
                fill="var(--accent)"
                fillOpacity={0.15}
                rx="2"
              />
            )}
            <text
              x="112" y="252" fontSize="12"
              className="fill-accent font-display" fontWeight="bold"
              opacity={dimmed && highlight !== 'retVinkel' ? 0.2 : 1}
              style={{ transition: 'opacity 0.2s' }}
            >
              90°
            </text>

            {/* Label a */}
            <text
              x="48" y="165" textAnchor="middle"
              className="fill-success font-display"
              fontSize={highlight === 'katet' ? 20 : 16}
              fontWeight="bold" fontStyle="italic"
              opacity={dimmed && highlight !== 'katet' ? 0.2 : 1}
              style={{ transition: 'all 0.2s' }}
            >
              a
            </text>
            <text
              x="38" y="182" textAnchor="middle"
              className="fill-success" fontSize="10"
              opacity={dimmed && highlight !== 'katet' ? 0.2 : 1}
              style={{ transition: 'opacity 0.2s' }}
            >
              (katet)
            </text>

            {/* Label b */}
            <text
              x="210" y="285" textAnchor="middle"
              className="fill-error font-display"
              fontSize={highlight === 'katet' ? 20 : 16}
              fontWeight="bold" fontStyle="italic"
              opacity={dimmed && highlight !== 'katet' ? 0.2 : 1}
              style={{ transition: 'all 0.2s' }}
            >
              b
            </text>
            <text
              x="210" y="298" textAnchor="middle"
              className="fill-error" fontSize="10"
              opacity={dimmed && highlight !== 'katet' ? 0.2 : 1}
              style={{ transition: 'opacity 0.2s' }}
            >
              (katet)
            </text>

            {/* Label c */}
            <text
              x="230" y="148" textAnchor="middle"
              className="fill-primary font-display"
              fontSize={highlight === 'hypotenuse' ? 20 : 16}
              fontWeight="bold" fontStyle="italic"
              opacity={dimmed && highlight !== 'hypotenuse' ? 0.2 : 1}
              style={{ transition: 'all 0.2s' }}
            >
              c
            </text>
            <text
              x="240" y="165" textAnchor="start"
              className="fill-primary" fontSize="10"
              opacity={dimmed && highlight !== 'hypotenuse' ? 0.2 : 1}
              style={{ transition: 'opacity 0.2s' }}
            >
              (hypotenuse)
            </text>

            {/* Vertex dots */}
            <circle cx="80" cy="260" r="4" fill="var(--foreground)" opacity={dimmed ? 0.2 : 1} style={{ transition: 'opacity 0.2s' }} />
            <circle cx="80" cy="60" r="4" fill="var(--foreground)" opacity={dimmed ? 0.2 : 1} style={{ transition: 'opacity 0.2s' }} />
            <circle cx="340" cy="260" r="4" fill="var(--foreground)" opacity={dimmed ? 0.2 : 1} style={{ transition: 'opacity 0.2s' }} />
          </svg>
        </div>

        {/* Terminology cards */}
        <div className="flex flex-col gap-3 md:w-1/2">
          {TERMINOLOGY.map((item) => (
            <div
              key={item.key}
              className={`rounded-lg p-4 border flex-1 cursor-pointer transition-all duration-200 ${
                highlight === item.key ? item.activeClass : item.colorClass
              }`}
              onMouseEnter={() => setHighlight(item.key)}
              onMouseLeave={() => setHighlight(null)}
              onClick={() => setHighlight(h => h === item.key ? null : item.key)}
            >
              <div className="font-semibold text-sm mb-1">{t(`${item.key}Title`)}</div>
              <div className="text-xs text-muted leading-relaxed">{t(`${item.key}Desc`)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* --- Section 2: The formula --- */}
      <p className="text-[15px] leading-relaxed text-muted">
        {t('formulaIntro')}
      </p>

      <div
        className="rounded-xl p-6 text-center border border-primary/20"
        style={{
          background:
            'linear-gradient(135deg, color-mix(in srgb, var(--primary-subtle) 25%, transparent), var(--surface))',
        }}
      >
        <div className="text-xs text-muted tracking-widest uppercase mb-2">
          {t('formulaLabel')}
        </div>
        <Tex display className="text-2xl">
          {'a^2 + b^2 = c^2'}
        </Tex>
        <p className="text-sm text-muted mt-3 leading-relaxed max-w-sm mx-auto">
          {t('formulaExplanation')}
        </p>
      </div>

      {/* --- Section 3: Variants --- */}
      <p className="text-[15px] leading-relaxed text-muted">
        {t('variantsIntro')}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {VARIANTS.map((v) => (
          <div key={v.key} className="bg-surface rounded-lg p-4 border border-border text-center">
            <div className="text-xs text-muted font-semibold mb-2">{t(`${v.key}Label`)}</div>
            <Tex display className="text-base">
              {v.math}
            </Tex>
            <div className="text-xs text-muted mt-1">{t(`${v.key}Desc`)}</div>
          </div>
        ))}
      </div>

    </div>
  );
}
