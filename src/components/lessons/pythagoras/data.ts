// --- Math utilities ---

export const pythagoras = (a: number, b: number) =>
  Math.sqrt(a * a + b * b);

export const pythagorasSide = (c: number, known: number) =>
  Math.sqrt(c * c - known * known);

export const isRightTriangle = (
  a: number,
  b: number,
  c: number,
) => {
  const sides = [a, b, c].sort((x, y) => x - y);
  return (
    Math.abs(sides[0] ** 2 + sides[1] ** 2 - sides[2] ** 2) <
    0.01
  );
};

// --- Data types ---

export interface DiscoveryPrompt {
  id: string;
  text: string;
  hint?: string;
  successMessage?: string;
}

export interface ProofStep {
  title: string;
  text: string;
  math?: string;
  blank?: { prompt: string; answer: string; hint: string };
}

export interface StoryStep {
  label: string;
  math: string;
  explanation: string;
}

export interface StoryExample {
  id: string;
  title: string;
  scenario: string;
  question: string;
  diagramType: 'park' | 'ladder' | 'screen';
  steps: StoryStep[];
  answer: string;
  answerUnit: string;
}

export interface ErrorStep {
  label: string;
  math: string;
}

export interface TriangleOption {
  sides: [number, number, number];
  label: string;
}

export type Exercise =
  | {
      type: 'visual-identify';
      q: string;
      triangles: TriangleOption[];
      correctIndex: number;
      explanation: string;
    }
  | {
      type: 'numeric';
      q: string;
      hint: string;
      answer: number;
      unit: string;
      tolerance: number;
      storyContext?: string;
      feedback?: string;
    }
  | {
      type: 'multiple-choice';
      q: string;
      options: string[];
      correctIndex: number;
      explanation: string;
    }
  | {
      type: 'find-error';
      q: string;
      solution: ErrorStep[];
      errorIndex: number;
      explanation: string;
    }
  | {
      type: 'word-problem';
      q: string;
      scenario: string;
      hint: string;
      answer: number;
      unit: string;
      tolerance: number;
    };

// --- Discovery prompts ---

export const DISCOVERY_PROMPTS: DiscoveryPrompt[] = [
  {
    id: 'observe',
    text: 'Flyt rundt p\u00e5 siderne. Hvad l\u00e6gger du m\u00e6rke til om de tre arealer?',
  },
  {
    id: 'hint',
    text: 'Pr\u00f8v at l\u00e6gge a\u00b2 og b\u00b2 sammen...',
    hint: 'Sammenlign summen med c\u00b2.',
  },
  {
    id: 'reveal',
    text: 'Se v\u00e6rdien af c\u00b2!',
    successMessage: 'Pr\u00e6cis! a\u00b2 + b\u00b2 = c\u00b2',
  },
  {
    id: 'experiment',
    text: 'Pr\u00f8v med andre tal! Er det altid sandt?',
  },
  {
    id: 'formula',
    text: 'Kan du skrive det som en formel?',
    hint: 'T\u00e6nk p\u00e5 a, b og c...',
    successMessage:
      'Du har netop genopdaget Pythagoras\u2019 s\u00e6tning!',
  },
];

// --- Proof steps ---

export const PROOF_STEPS: ProofStep[] = [
  {
    title: 'Trekanten',
    text: 'Her er en retvinklet trekant med korte sider $a$ og $b$ og lang side $c$. Vi vil vise, at $a^2 + b^2 = c^2$.',
  },
  {
    title: 'Byg det store kvadrat',
    text: 'Tegn et stort kvadrat med sidelængde $(a + b)$. Placer fire kopier af trekanten indeni, så de danner et indre kvadrat med sidelængde $c$.',
    math: '\\text{Areal}_{\\text{ydre}} = (a + b)^2',
  },
  {
    title: 'Beregn det ydre areal',
    text: 'Udvid $(a + b)^2$ med kvadrats\u00e6tningen:',
    math: '(a + b)^2 = a^2 + 2ab + b^2',
    blank: {
      prompt: 'Hvad er $(a+b)^2$ udvidet?',
      answer: 'a^2+2ab+b^2',
      hint: 'Brug kvadrats\u00e6tningen: $(x+y)^2 = x^2 + 2xy + y^2$',
    },
  },
  {
    title: 'Beregn med delene',
    text: 'Det samme areal er ogs\u00e5 de fire trekanter plus det indre kvadrat:',
    math: '4 \\cdot \\tfrac{1}{2}ab + c^2 = 2ab + c^2',
  },
  {
    title: 'S\u00e6t udtrykkene lig hinanden',
    text: 'Begge udtryk beskriver det samme areal. S\u00e6t dem lig hinanden og forenkl:',
    math: '\\begin{aligned} a^2 + 2ab + b^2 &= 2ab + c^2 \\\\ a^2 + b^2 &= c^2 \\quad \\blacksquare \\end{aligned}',
    blank: {
      prompt: 'Hvad kan vi fjerne fra begge sider?',
      answer: '2ab',
      hint: '$2ab$ optr\u00e6der p\u00e5 begge sider af lighedstegnet.',
    },
  },
];

// --- Story-based examples ---

export const STORY_EXAMPLES: StoryExample[] = [
  {
    id: 'park',
    title: 'Genvejen i parken',
    scenario:
      'Sofie g\u00e5r i skole hver dag. Hendes rute: 300 m mod \u00f8st, s\u00e5 400 m mod nord. Men der er en genvej tv\u00e6rs igennem parken.',
    question: 'Hvor lang er genvejen?',
    diagramType: 'park',
    steps: [
      {
        label: 'Formlen',
        math: 'a^2 + b^2 = c^2',
        explanation:
          'Start med formlen. Hvad kender vi?',
      },
      {
        label: 'Inds\u00e6t tallene',
        math: '300^2 + 400^2 = c^2',
        explanation:
          'S\u00e6t tallene ind \u2014 vi ved at a = 300 og b = 400.',
      },
      {
        label: 'Beregn',
        math: '90\\,000 + 160\\,000 = c^2',
        explanation:
          '$300^2 = 90\\,000$ og $400^2 = 160\\,000$.',
      },
      {
        label: 'L\u00e6g sammen',
        math: 'c^2 = 250\\,000',
        explanation: 'L\u00e6g de to tal sammen.',
      },
      {
        label: 'Svar',
        math: 'c = \\sqrt{250\\,000} = 500 \\text{ m}',
        explanation:
          'Tag kvadratroden. Genvejen er 500 meter!',
      },
    ],
    answer: 'c = 500',
    answerUnit: 'm',
  },
  {
    id: 'ladder',
    title: 'Brandmandens stige',
    scenario:
      'Vinduet er 12 m oppe. Brandbilen holder 5 m fra bygningen. Stigen l\u00e6ner fra bilen op til vinduet.',
    question: 'Hvor lang skal stigen v\u00e6re?',
    diagramType: 'ladder',
    steps: [
      {
        label: 'Formlen',
        math: 'a^2 + b^2 = c^2',
        explanation:
          'Muren, jorden og stigen danner en retvinklet trekant. Stigen er hypotenusen.',
      },
      {
        label: 'Inds\u00e6t tallene',
        math: '12^2 + 5^2 = c^2',
        explanation:
          'H\u00f8jden er 12 m (a), afstanden er 5 m (b).',
      },
      {
        label: 'Beregn',
        math: '144 + 25 = c^2',
        explanation: '$12^2 = 144$ og $5^2 = 25$.',
      },
      {
        label: 'L\u00e6g sammen',
        math: 'c^2 = 169',
        explanation: 'L\u00e6g de to tal sammen.',
      },
      {
        label: 'Svar',
        math: 'c = \\sqrt{169} = 13 \\text{ m}',
        explanation:
          'Stigen skal v\u00e6re 13 meter lang.',
      },
    ],
    answer: 'c = 13',
    answerUnit: 'm',
  },
  {
    id: 'screen',
    title: "Markus' nye sk\u00e6rm",
    scenario:
      'Markus har k\u00f8bt en 27" sk\u00e6rm. Diagonalen er 68,6 cm og bredden er 60 cm.',
    question: 'Hvor h\u00f8j er sk\u00e6rmen?',
    diagramType: 'screen',
    steps: [
      {
        label: 'Formlen',
        math: 'a^2 + b^2 = c^2',
        explanation:
          'Sk\u00e6rmens bredde, h\u00f8jde og diagonal danner en retvinklet trekant. Diagonalen er c.',
      },
      {
        label: 'Isoler h\u00f8jden',
        math: 'a^2 = c^2 - b^2',
        explanation:
          'Her kender vi c (diagonalen) og b (bredden). Vi skal finde a (h\u00f8jden).',
      },
      {
        label: 'Inds\u00e6t tallene',
        math: 'a^2 = 68{,}6^2 - 60^2',
        explanation:
          'Diagonalen er 68,6 cm og bredden er 60 cm.',
      },
      {
        label: 'Beregn',
        math: 'a^2 = 4705{,}96 - 3600 = 1105{,}96',
        explanation:
          '$68{,}6^2 = 4705{,}96$ og $60^2 = 3600$.',
      },
      {
        label: 'Svar',
        math: 'a = \\sqrt{1105{,}96} \\approx 33{,}3 \\text{ cm}',
        explanation:
          'Sk\u00e6rmen er ca. 33,3 cm h\u00f8j.',
      },
    ],
    answer: 'a \\approx 33{,}3',
    answerUnit: 'cm',
  },
];

// --- Exercises (scaffolded easy → hard) ---

export const EXERCISES: Exercise[] = [
  {
    type: 'visual-identify',
    q: 'Hvilken af disse trekanter er retvinklet? Klik p\u00e5 den rigtige.',
    triangles: [
      { sides: [4, 5, 7], label: 'A' },
      { sides: [3, 4, 5], label: 'B' },
      { sides: [6, 7, 8], label: 'C' },
    ],
    correctIndex: 1,
    explanation:
      'Trekant B er retvinklet: $3^2 + 4^2 = 9 + 16 = 25 = 5^2$. De andre opfylder ikke $a^2 + b^2 = c^2$.',
  },
  {
    type: 'numeric',
    q: 'En retvinklet trekant har kateter $a = 6$ og $b = 8$. Beregn hypotenusen $c$.',
    hint: 'Brug $c = \\sqrt{a^2 + b^2} = \\sqrt{36 + 64}$.',
    answer: 10,
    unit: '',
    tolerance: 0.1,
    storyContext:
      '6-8-10 er et pythagor\u00e6isk tripel \u2014 ligesom 3-4-5, bare ganget med 2!',
  },
  {
    type: 'multiple-choice',
    q: 'Hypotenusen er altid...',
    options: [
      'Den korteste side',
      'Den l\u00e6ngste side \u2014 modsat den rette vinkel',
      'Siden der danner den rette vinkel',
      'Den lodrette side',
    ],
    correctIndex: 1,
    explanation:
      'Hypotenusen er altid den l\u00e6ngste side. Den sidder modsat den rette vinkel (90\u00b0).',
  },
  {
    type: 'find-error',
    q: 'Find fejlen i denne udregning: $a = 5$, $b = 12$. Find $c$.',
    solution: [
      { label: 'Trin 1', math: 'a^2 + b^2 = c^2' },
      { label: 'Trin 2', math: '5^2 + 12^2 = c^2' },
      { label: 'Trin 3', math: '25 + 144 = c^2' },
      { label: 'Trin 4', math: 'c^2 = 169' },
      { label: 'Trin 5', math: 'c = 169' },
    ],
    errorIndex: 4,
    explanation:
      'Fejlen er i trin 5: Man skal tage kvadratroden! Det korrekte er $c = \\sqrt{169} = 13$, ikke $c = 169$.',
  },
  {
    type: 'word-problem',
    q: 'Beregn afstanden fra start til slut.',
    scenario:
      'En drone flyver 800 m mod \u00f8st og derefter 600 m mod nord. Hvor langt er dronen fra startpunktet?',
    hint: 'De to str\u00e6kninger danner en retvinklet trekant. Afstanden er hypotenusen.',
    answer: 1000,
    unit: 'm',
    tolerance: 0.5,
  },
];
