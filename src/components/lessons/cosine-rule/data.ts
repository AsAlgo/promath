// --- Math utilities ---

export const toRad = (deg: number) => (deg * Math.PI) / 180;

export const cosRule = (b: number, c: number, A_deg: number) =>
  Math.sqrt(b * b + c * c - 2 * b * c * Math.cos(toRad(A_deg)));

export const cosAngle = (a: number, b: number, c: number) =>
  (Math.acos((b * b + c * c - a * a) / (2 * b * c)) * 180) / Math.PI;

// --- Data types ---

export interface ProofStep {
  title: string;
  text: string;
  math?: string;
}

export interface Example {
  title: string;
  desc: string;
  steps: string[];
  answer: string;
}

export interface Exercise {
  q: string;
  hint: string;
  answer: number;
  unit: string;
  tolerance: number;
}

// --- Proof steps ---

export const PROOF_STEPS: ProofStep[] = [
  {
    title: 'Ops\u00e6tning',
    text: 'Betragt trekant $ABC$ med sider $a$, $b$, $c$. F\u00e6ld en h\u00f8jde $h$ fra $C$ vinkelret ned til $AB$. Fodpunktet $X$ deler $AB$ i to dele: $AX = x$ og $XB = c - x$.',
  },
  {
    title: 'Pythagoras p\u00e5 \u25b3ACX',
    text: 'I den retvinklede trekant $ACX$ g\u00e6lder:',
    math: 'b^2 = x^2 + h^2 \\implies h^2 = b^2 - x^2',
  },
  {
    title: 'Pythagoras p\u00e5 \u25b3BCX',
    text: 'I den retvinklede trekant $BCX$ g\u00e6lder:',
    math: 'a^2 = h^2 + (c - x)^2 \\implies h^2 = a^2 - (c - x)^2',
  },
  {
    title: 'S\u00e6t h\u00b2 lig hinanden',
    text: 'Da begge udtryk er lig $h^2$, kan vi s\u00e6tte dem lig hinanden og udfolde:',
    math: '\\begin{aligned} b^2 - x^2 &= a^2 - (c - x)^2 \\\\ \\implies a^2 &= b^2 - x^2 + c^2 - 2cx + x^2 \\\\ \\implies a^2 &= b^2 + c^2 - 2cx \\end{aligned}',
  },
  {
    title: 'Erstat x med b\u00b7cos A',
    text: 'Fra $\\triangle ACX$ har vi $\\cos A = x/b$, alts\u00e5 $x = b \\cdot \\cos A$. Inds\u00e6ttes:',
    math: '\\begin{aligned} a^2 &= b^2 + c^2 - 2c \\cdot (b \\cos A) \\\\ \\implies a^2 &= b^2 + c^2 - 2bc \\cdot \\cos A \\quad \\blacksquare \\end{aligned}',
  },
];

// --- Examples ---

export const EXAMPLES: Example[] = [
  {
    title: 'Find en ukendt side',
    desc: 'I trekant $ABC$ er $b = 8$, $c = 5$ og $A = 60°$. Find $a$.',
    steps: [
      'a^2 = b^2 + c^2 - 2bc \\cdot \\cos A',
      'a^2 = 8^2 + 5^2 - 2 \\cdot 8 \\cdot 5 \\cdot \\cos(60°)',
      'a^2 = 64 + 25 - 80 \\cdot 0.5',
      'a^2 = 89 - 40 = 49',
      'a = \\sqrt{49} = 7',
    ],
    answer: 'a = 7',
  },
  {
    title: 'Find en ukendt vinkel',
    desc: 'I trekant $ABC$ er $a = 10$, $b = 7$ og $c = 9$. Find vinkel $A$.',
    steps: [
      '\\cos A = \\frac{b^2 + c^2 - a^2}{2bc}',
      '\\cos A = \\frac{49 + 81 - 100}{2 \\cdot 7 \\cdot 9}',
      '\\cos A = \\frac{30}{126}',
      '\\cos A = 0.2381',
      'A = \\cos^{-1}(0.2381) \\approx 76.2°',
    ],
    answer: 'A \\approx 76.2°',
  },
  {
    title: 'Stumpvinklet trekant',
    desc: 'I trekant $ABC$ er $b = 6$, $c = 4$ og $A = 120°$. Find $a$.',
    steps: [
      'a^2 = b^2 + c^2 - 2bc \\cdot \\cos A',
      'a^2 = 36 + 16 - 48 \\cdot \\cos(120°)',
      'a^2 = 52 - 48 \\cdot (-0.5)',
      'a^2 = 52 + 24 = 76',
      'a = \\sqrt{76} \\approx 8.72',
    ],
    answer: 'a \\approx 8.72',
  },
];

// --- Exercises ---

export const EXERCISES: Exercise[] = [
  {
    q: 'I $\\triangle ABC$ er $b = 5$, $c = 8$ og $A = 45°$. Beregn $a$.',
    hint: 'Brug $a^2 = b^2 + c^2 - 2bc \\cdot \\cos(45°)$. Husk $\\cos(45°) \\approx 0.7071$.',
    answer: 5.69,
    unit: '',
    tolerance: 0.1,
  },
  {
    q: 'I $\\triangle ABC$ er $a = 12$, $b = 9$ og $c = 7$. Beregn vinkel $A$ i grader.',
    hint: 'Brug $\\cos A = \\frac{b^2 + c^2 - a^2}{2bc}$.',
    answer: 96.4,
    unit: '\u00b0',
    tolerance: 1,
  },
  {
    q: 'I $\\triangle ABC$ er $b = 10$, $c = 10$ og $A = 60°$. Beregn $a$.',
    hint: 'Ligebenet trekant! $a^2 = 100 + 100 - 200 \\cdot \\cos(60°)$.',
    answer: 10,
    unit: '',
    tolerance: 0.1,
  },
  {
    q: 'I $\\triangle ABC$ er $a = 6$, $b = 6$ og $c = 6$. Beregn vinkel $A$.',
    hint: 'Ligesidet trekant \u2014 hvad er alle vinkler?',
    answer: 60,
    unit: '\u00b0',
    tolerance: 0.5,
  },
];
