import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Math as Tex } from '@/components/ui/math';
import { cosRule, cosAngle, toRad } from './data';

function Slider({
  label,
  value,
  set,
  min,
  max,
  step = 1,
  isAngle,
  textClass,
  accentClass,
}: {
  label: string;
  value: number;
  set: (v: number) => void;
  min: number;
  max: number;
  step?: number;
  isAngle?: boolean;
  textClass: string;
  accentClass: string;
}) {
  const id = `slider-${label.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <div className="mb-3">
      <div className="flex justify-between mb-1">
        <label htmlFor={id} className="text-xs font-semibold text-muted">
          {label}
        </label>
        <span className={cn('text-xs font-bold', textClass)}>
          {value}
          {isAngle ? '\u00b0' : ''}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => set(Number(e.target.value))}
        className={cn('w-full cursor-pointer', accentClass)}
      />
    </div>
  );
}

export function InteractiveSection() {
  const t = useTranslations('lesson.cosineRule.interactive');
  const [sideB, setSideB] = useState(7);
  const [sideC, setSideC] = useState(10);
  const [angleA, setAngleA] = useState(60);

  const sideA = cosRule(sideB, sideC, angleA);
  const angleB_val = cosAngle(sideB, sideA, sideC);
  const angleC_val = 180 - angleA - angleB_val;

  // SVG geometry
  const W = 560,
    H = 320;
  const a = sideA;
  const scale = Math.min(W * 0.7, H * 0.7) / Math.max(sideB, sideC, a);
  const Ax = W * 0.15;
  const Ay = H * 0.8;
  const Bx = Ax + sideC * scale;
  const By = Ay;
  const Cx = Ax + sideB * scale * Math.cos(toRad(angleA));
  const Cy = Ay - sideB * scale * Math.sin(toRad(angleA));

  // Edge midpoints
  const midAB = { x: (Ax + Bx) / 2, y: Ay + 22 };
  const midAC = { x: (Ax + Cx) / 2 - 12, y: (Ay + Cy) / 2 - 8 };
  const midBC = { x: (Bx + Cx) / 2 + 6, y: (By + Cy) / 2 - 8 };

  // Angle arc path
  const arcR = 28;
  const arcStartX = Ax + arcR * Math.cos(toRad(angleA));
  const arcStartY = Ay - arcR * Math.sin(toRad(angleA));
  const arcEndX = Ax + arcR;
  const arcEndY = Ay;
  const arcPath = `M ${arcStartX} ${arcStartY} A ${arcR} ${arcR} 0 ${angleA > 180 ? 1 : 0} 1 ${arcEndX} ${arcEndY}`;

  const cosVal = Math.cos(toRad(angleA));
  const aSquared = sideA * sideA;

  return (
    <div>
      <h2 className="font-display text-2xl sm:text-3xl tracking-tight mb-2">
        {t('title')}{' '}
        <span className="text-primary font-bold">{t('titleHighlight')}</span>
      </h2>
      <p className="text-muted leading-relaxed mb-4">{t('desc')}</p>

      {/* Triangle SVG */}
      <div className="bg-surface rounded-xl p-1 mb-4 border border-border">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full h-auto block"
          role="img"
          aria-label="Interactive triangle visualization"
        >
          <title>Interactive triangle visualization</title>
          {/* Triangle fill */}
          <polygon
            points={`${Ax},${Ay} ${Bx},${By} ${Cx},${Cy}`}
            className="fill-primary-subtle/30"
          />
          {/* Edges */}
          <line
            x1={Ax}
            y1={Ay}
            x2={Bx}
            y2={By}
            className="stroke-muted"
            strokeWidth={2.5}
          />
          <line
            x1={Ax}
            y1={Ay}
            x2={Cx}
            y2={Cy}
            className="stroke-success"
            strokeWidth={2.5}
          />
          <line
            x1={Bx}
            y1={By}
            x2={Cx}
            y2={Cy}
            className="stroke-error"
            strokeWidth={2.5}
          />
          {/* Edge labels */}
          <text
            x={midAB.x}
            y={midAB.y}
            textAnchor="middle"
            className="fill-muted font-display"
            fontSize="15"
            fontWeight="bold"
          >
            c = {sideC}
          </text>
          <text
            x={midAC.x}
            y={midAC.y}
            textAnchor="middle"
            className="fill-success font-display"
            fontSize="15"
            fontWeight="bold"
          >
            b = {sideB}
          </text>
          <text
            x={midBC.x}
            y={midBC.y}
            textAnchor="middle"
            className="fill-error font-display"
            fontSize="15"
            fontWeight="bold"
          >
            a = {a.toFixed(2)}
          </text>
          {/* Angle arc */}
          <path
            d={arcPath}
            fill="none"
            className="stroke-accent"
            strokeWidth={2}
          />
          <text
            x={Ax + 36}
            y={Ay - 10}
            className="fill-accent font-display"
            fontSize="13"
            fontWeight="bold"
          >
            {angleA}&deg;
          </text>
          {/* Vertex dots */}
          <circle cx={Ax} cy={Ay} r={4} className="fill-foreground" />
          <circle cx={Bx} cy={By} r={4} className="fill-foreground" />
          <circle cx={Cx} cy={Cy} r={4} className="fill-foreground" />
          {/* Vertex labels */}
          <text
            x={Ax - 16}
            y={Ay + 6}
            className="fill-foreground font-display"
            fontSize="16"
            fontWeight="bold"
          >
            A
          </text>
          <text
            x={Bx + 16}
            y={By + 6}
            className="fill-foreground font-display"
            fontSize="16"
            fontWeight="bold"
          >
            B
          </text>
          <text
            x={Cx}
            y={Cy - 14}
            textAnchor="middle"
            className="fill-foreground font-display"
            fontSize="16"
            fontWeight="bold"
          >
            C
          </text>
        </svg>
      </div>

      {/* Sliders */}
      <div className="bg-surface rounded-xl p-5 border border-border mb-4">
        <Slider
          label={t('sideB')}
          value={sideB}
          set={setSideB}
          min={2}
          max={15}
          textClass="text-success"
          accentClass="accent-success"
        />
        <Slider
          label={t('sideC')}
          value={sideC}
          set={setSideC}
          min={2}
          max={15}
          textClass="text-muted"
          accentClass="accent-muted"
        />
        <Slider
          label={t('angleA')}
          value={angleA}
          set={setAngleA}
          min={10}
          max={170}
          isAngle
          textClass="text-accent"
          accentClass="accent-accent"
        />
      </div>

      {/* Live calculation */}
      <div
        className="rounded-xl p-5 border border-primary/20"
        style={{
          background:
            'linear-gradient(135deg, color-mix(in srgb, var(--primary-subtle) 25%, transparent), var(--surface))',
        }}
      >
        <div className="text-xs text-muted tracking-widest uppercase mb-3">
          {t('calculation')}
        </div>
        <div className="text-sm leading-[2.2] space-y-0.5">
          <div>
            <Tex>{'a^2 = b^2 + c^2 - 2bc \\cdot \\cos A'}</Tex>
          </div>
          <div>
            <Tex>{`a^2 = ${sideB}^2 + ${sideC}^2 - 2 \\cdot ${sideB} \\cdot ${sideC} \\cdot \\cos(${angleA}°)`}</Tex>
          </div>
          <div>
            <Tex>{`a^2 = ${sideB * sideB} + ${sideC * sideC} - ${2 * sideB * sideC} \\cdot (${cosVal.toFixed(4)})`}</Tex>
          </div>
          <div>
            <Tex>{`a^2 = ${aSquared.toFixed(2)}`}</Tex>
          </div>
          <div className="text-primary font-bold text-base">
            <Tex>{`a = ${sideA.toFixed(4)}`}</Tex>
          </div>
        </div>
        <div className="mt-3.5 pt-3.5 border-t border-border text-xs text-muted">
          {t('allAngles')}{' '}
          <Tex>{`A = ${angleA}°,\\; B = ${angleB_val.toFixed(1)}°,\\; C = ${angleC_val.toFixed(1)}°`}</Tex>
          {Math.abs(angleA - 90) < 0.5 && (
            <Badge variant="success" className="ml-2 text-xs px-2 py-0.5">
              {t('rightAngled')}
            </Badge>
          )}
          {angleA > 90 && (
            <Badge variant="warning" className="ml-2 text-xs px-2 py-0.5">
              {t('obtuseAngled')}
            </Badge>
          )}
          {angleA < 90 && Math.abs(angleA - 90) > 0.5 && (
            <Badge className="ml-2 text-xs px-2 py-0.5">
              {t('acuteAngled')}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
