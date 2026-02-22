# Promath Pedagogical Approach

This document describes the research-based e-learning principles, lesson structure, and content guidelines used across all Promath interactive lessons. It serves as a reference for both human authors and AI assistants building future lessons.

---

## 1. Vision & Philosophy

Promath aims for **mathematical elegance** — an academic, editorial feel that treats students as capable thinkers. The core belief: understanding why something works produces deeper, more durable learning than memorizing how to apply it.

**Key principles:**
- Understanding over memorization
- Active engagement over passive reading
- Multiple representations (symbolic, visual, verbal) for every concept
- Immediate, process-oriented feedback
- Respect for the student's time and intelligence

---

## 2. Core Learning Principles

Each principle below is supported by cognitive science research and directly informs lesson design decisions.

### 2.1 Discovery-First Learning

**Research:** Van Hiele model (1959); Kapur (2008, 2014); Roediger & Butler (2011)

Students at the udskoling level (ages 13-15) benefit from **visual exploration before formalization** (Van Hiele Levels 1-2 before Level 3). Every lesson begins with an **Explore tab** that hooks the student with a real-world scenario, then guides them through interactive discovery to find the formula themselves — before it is formally presented.

**Implementation:** The `explore.tsx` component has 4 phases: hook (scenario + SVG), interact (manipulable triangle with area squares), discover (guided prompts + formula input), celebrate (success confirmation). Students experience productive failure and retrieval practice organically.

### 2.2 Spaced Repetition

**Research:** Cepeda et al. (2006); Ebbinghaus (1885/1913)

Information is retained better when practice is distributed over time. Promath's warm-up section inherently supports spacing: when a student returns to a lesson, they re-activate knowledge from previous sessions.

**Future:** localStorage-based progress tracking will enable personalized spacing reminders.

### 2.3 Interleaving

**Research:** Rohrer & Taylor (2007); Bjork & Bjork (2011)

Mixing different problem types within a practice session improves discrimination and transfer. The **exercises section** deliberately interleaves numeric calculation, multiple choice, find-the-error, and next-step problems rather than grouping them by type.

**Implementation:** The `EXERCISES` array in `data.ts` alternates between types: numeric → numeric → MC → MC → find-error → next-step → numeric → numeric.

### 2.4 Worked Example Effect

**Research:** Sweller & Cooper (1985); Atkinson et al. (2000)

Novice learners benefit more from studying worked examples than from solving equivalent problems. Promath's **examples section** reveals solutions step by step, with each step accompanied by a **narrative explanation** of *why* that step was taken — not just *what* was done.

**Implementation:** The `ExampleStep` interface requires both `math` (KaTeX) and `explanation` (plain text). The explanation appears below each revealed step in muted italic text.

### 2.5 Productive Failure

**Research:** Kapur (2008, 2014)

Allowing students to explore and potentially fail before formal instruction can deepen understanding. The **Explore tab** starts with a real-world hook, then presents an interactive triangle where c² is hidden. Students manipulate side lengths, notice the pattern, and type the formula themselves before it is confirmed.

**Implementation:** In `explore.tsx`, the `phase` state progresses through `'hook' → 'interact' → 'discover' → 'celebrate'`. The `showCSquared` state controls visibility of the c² value, and `formulaCorrect` tracks whether the student has correctly entered the formula. The formula is never shown until the student either types it or moves on.

### 2.6 Active Learning & Fill-in-the-Blank

**Research:** Chi & Wylie (2014) — ICAP framework

Constructive activities (where students generate output) produce deeper learning than active activities (which are deeper than passive). The **proof section** includes fill-in-the-blank steps where students must type an answer, converting passive reading into constructive engagement.

**Implementation:** The `ProofStep.blank` field is optional. When present, a text input replaces the passive display. Validation is soft — navigation is never blocked, so students can always proceed.

---

## 3. Lesson Structure Template

Every Promath lesson follows a **5-tab discovery-first** pedagogical flow. The tab order is deliberate and research-informed.

| # | Tab | Danish | Purpose | Principle |
|---|-----|--------|---------|-----------|
| 1 | **Explore** | Udforsk | Hook scenario → interactive discovery → student finds the formula | Productive failure, discovery learning |
| 2 | **Understand** | Forstå | Labeled diagram, terminology, formula in context, variants, applications | Advance organizer, multiple representations |
| 3 | **Proof** | Bevis | Accumulating visual proof with fill-in-the-blank | Active learning, constructivism |
| 4 | **Examples** | Eksempler | Story-based worked examples with scenario SVG diagrams | Worked example effect |
| 5 | **Practice** | Øv dig | Scaffolded exercises: visual → numeric → conceptual → error-finding → word problems | Interleaving, testing effect |

**Rationale for ordering (discovery-first):**
- Explore FIRST — students discover the pattern themselves before being told the formula. This creates curiosity and ownership. (Van Hiele: visual exploration before formalization)
- Understand SECOND — now the formula has meaning because the student already discovered it. Terminology and variants build on their insight.
- Proof THIRD — students are motivated to understand WHY the formula works because they've already seen that it does.
- Examples FOURTH — story-based worked examples show how to apply the formula in real-world contexts, scaffolding the transition to independent practice.
- Practice LAST — scaffolded from easy (visual identification) to hard (word problems), so students build confidence progressively.

---

## 4. Exercise Type Specifications

### 4.1 Numeric Input

**When to use:** Core calculation problems (find a side, find an angle, compute a value).

**Design rules:**
- Provide a `tolerance` value (typically 0.1 for exact answers, 0.5-1.0 for rounded values)
- Include a `hint` that references the relevant formula without solving the problem
- Optional `feedback` string for process-level feedback on wrong answers
- After 2 wrong attempts, reveal the correct answer

### 4.2 Multiple Choice

**When to use:** Conceptual understanding, classification problems, or when the answer space is discrete.

**Design rules:**
- Always 4 options
- Distractors must be plausible (common misconceptions, off-by-one errors, sign errors)
- `explanation` must address WHY the correct answer is right AND why common distractors are wrong
- Immediate visual feedback: correct option turns green, wrong selection turns red, all others fade

### 4.3 Find the Error

**When to use:** Developing critical analysis skills and attention to common mistakes.

**Design rules:**
- Present a multi-step solution as clickable cards
- Exactly ONE step contains an error
- Error should reflect a common student misconception (forgetting square root, sign error, wrong formula)
- `explanation` must clearly identify the error and show the correct step
- Correct steps get green borders, the error step gets a red border

### 4.4 Visual Identification (NEW)

**When to use:** Testing geometric understanding — can the student identify right triangles visually?

**Design rules:**
- Present 3 triangle SVGs side by side in a grid
- Each shows a triangle with its 3 side lengths labeled
- Student clicks the right-angled one
- Immediate green/red feedback + explanation referencing the Pythagorean test (a² + b² = c²)
- Placed FIRST in exercise order as the easiest type (scaffolding)

### 4.5 Word Problem

**When to use:** Testing transfer to real-world scenarios — the most challenging exercise type.

**Design rules:**
- Present a scenario paragraph in a visually distinct card (surface-alt background)
- Scenario provides real-world context (e.g., drone flight, building dimensions)
- Student must identify which formula variant to use and extract values from text
- Provide a `hint` that references the relevant formula
- Include a `unit` for the answer
- Placed LAST in exercise order as the hardest type (scaffolding)

---

## 5. Feedback Design

### 5.1 Immediate Feedback

All exercise types provide immediate feedback upon answer submission. Research (Hattie & Timperley, 2007) shows that immediate feedback is most effective for procedural knowledge.

### 5.2 Process vs. Task Feedback

- **Task feedback** ("Correct!" / "Wrong") — provided for all types
- **Process feedback** ("Remember to take the square root") — provided via `feedback` field on numeric exercises and `explanation` field on all other types
- Process feedback is more effective for learning transfer than simple task feedback

### 5.3 Hint Progression

For numeric exercises:
1. First attempt wrong → auto-show hint
2. Second attempt wrong → reveal correct answer
3. Hint references the formula/approach without solving the specific problem

### 5.4 Discovery Feedback (Explore Tab)

The Explore tab uses guided prompts with progressive hints. When a student enters an incorrect formula, a gentle hint appears ("Prøv igen — tænk over hvad du opdagede"). The navigation is never blocked — students can always proceed to the next tab even without entering the correct formula.

---

## 6. Content Writing Guidelines

### 6.1 Step Explanations (Examples)

Every `ExampleStep` must include:
- `math`: The mathematical expression in KaTeX notation
- `explanation`: A plain-language sentence explaining WHY this step was taken

**Good:** "Isolate b² by subtracting a² from both sides."
**Bad:** "Subtract." (too terse) / "In this step we are going to use algebra to move the a-squared term..." (too verbose)

### 6.2 Hint Writing

Hints should:
- Reference the relevant formula or technique
- NOT solve the specific problem
- Be 1-2 sentences maximum
- Use inline KaTeX where helpful: `Brug $c = \\sqrt{a^2 + b^2}$`

### 6.3 Question Wording

- Use **Danish** for all content in `data.ts` (this is the primary content language)
- UI labels go through i18n translation keys
- Questions should be concise and unambiguous
- Always specify what the student should find/calculate
- For real-world problems, clearly identify which side is the hypotenuse

### 6.4 KaTeX Notation

- Use `\\cdot` for multiplication (not `\\times` or `*`)
- Use `\\text{}` for units: `4 \\text{ m}`
- Use `\\sqrt{}` for square roots
- Use `\\begin{aligned}` for multi-line equations
- Use `\\implies` for logical implication
- Use `\\blacksquare` (QED) at the end of proofs

---

## 7. Data Structure Reference

All lesson data lives in `data.ts`. Here are the key interfaces:

### DiscoveryPrompt (Explore tab)

```typescript
interface DiscoveryPrompt {
  id: string;          // Unique ID for this prompt
  text: string;        // Guidance text shown to the student
  hint?: string;       // Optional hint button text
  successMessage?: string; // Shown when student completes this step
}
```

### ProofStep

```typescript
interface ProofStep {
  title: string;       // Step heading (e.g., "Opsætning")
  text: string;        // Explanation text (supports $inline math$)
  math?: string;       // Optional KaTeX display math
  blank?: {            // Optional fill-in-the-blank
    prompt: string;    // Question to answer
    answer: string;    // Expected answer (whitespace-insensitive)
    hint: string;      // Hint shown after wrong answer
  };
}
```

### StoryExample (Examples tab)

```typescript
interface StoryExample {
  id: string;          // Unique ID
  title: string;       // Tab label (e.g., "Genvejen")
  scenario: string;    // Story paragraph setting the scene
  question: string;    // What the student needs to find
  diagramType: 'park' | 'ladder' | 'screen'; // Which SVG to render
  steps: StoryStep[];  // Solution steps with math + explanation
  answer: string;      // Final answer in KaTeX
  answerUnit: string;  // Unit for the answer (e.g., "meter")
}

interface StoryStep {
  label: string;       // Step label (e.g., "Trin 1")
  math: string;        // KaTeX expression
  explanation: string; // WHY this step was taken (plain text)
}
```

### Exercise (Discriminated Union)

```typescript
type Exercise =
  | { type: 'visual-identify'; q: string;
      triangles: TriangleOption[]; correctIndex: number;
      explanation: string }
  | { type: 'numeric'; q: string; hint: string; answer: number;
      unit: string; tolerance: number; storyContext?: string;
      feedback?: string }
  | { type: 'multiple-choice'; q: string; options: string[];
      correctIndex: number; explanation: string }
  | { type: 'find-error'; q: string; solution: ErrorStep[];
      errorIndex: number; explanation: string }
  | { type: 'word-problem'; q: string; scenario: string;
      hint: string; answer: number; unit: string;
      tolerance: number };

interface TriangleOption {
  sides: [number, number, number]; // Three side lengths
  label: string;       // Label (e.g., "Trekant A")
}

interface ErrorStep {
  label: string;       // Step label (e.g., "Trin 1")
  math: string;        // KaTeX for this step
}
```

---

## 8. Proof Section Guidelines

### 8.1 Accumulating Steps Pattern

The proof section uses an **accumulating** display — each "Show next step" click adds a new step BELOW the previous ones. All revealed steps remain visible and scrollable. This is critical: the old pattern of hiding previous steps forced students to hold information in working memory, violating cognitive load theory.

**Implementation:** Steps are rendered as `PROOF_STEPS.slice(0, visibleSteps).map(...)`. Controls are "Vis næste trin" (show next step) and "Start forfra" (reset). There is no "previous" button.

### 8.2 Multiple Proof Approaches

When multiple proofs exist for a theorem, choose the one that:
1. Is most visual and intuitive
2. Can be illustrated with SVG diagrams
3. Connects to concepts the student already knows

For Pythagoras: the area-based rearrangement proof (4 triangles in a square) is preferred over the algebraic proof because it provides a visual "aha" moment.

### 8.3 Fill-in-the-Blank Design

- Place blanks at KEY insight moments, not routine calculation steps
- The answer should be short (1-10 characters)
- Comparison is whitespace-insensitive and case-insensitive
- Always provide a hint that guides without giving away the answer
- Navigation is NEVER blocked — "Next" always works regardless of blank state

### 8.4 SVG Requirements

- Use `viewBox` for responsive scaling
- Include `role="img"` and `aria-label` for accessibility
- Include a `<title>` element
- Use CSS custom properties (`var(--primary)`, etc.) for theming
- SVG evolves progressively based on `visibleSteps` (e.g., step 1 = triangle only, step 2+ = outer square with 4 triangles, step 4+ = inner c² square)
- SVG is `lg:sticky lg:top-4` on large screens (not sticky on mobile)
- Keep diagrams clean — avoid visual clutter

### 8.5 Evolving SVG (Proof-Specific)

The proof SVG diagram changes based on how many steps are visible:
- **Step 1:** Right triangle with labeled sides a, b, c
- **Step 2+:** Outer square (a+b)² with 4 copies of the triangle inside
- **Step 3:** Outer area highlighted, (a+b)² label
- **Step 4+:** Inner c² square highlighted, triangle areas labeled ½ab
- **Step 5:** Final equation a²+b²=c², QED

---

## 9. Grade-Level Adaptation

Content complexity should match the Danish education system grade levels:

### Indskoling (Grades 1-3)
- No proofs
- Simple numeric exercises only (no MC, find-error, or next-step)
- Concrete, real-world examples (counting, measuring)
- Warm-up: very basic arithmetic recall

### Mellemtrin (Grades 4-6)
- Simplified proofs (visual, no algebra)
- Numeric + multiple choice exercises
- Real-world examples with moderate complexity
- Warm-up: prerequisite operations

### Udskoling (Grades 7-9)
- Full proofs with fill-in-the-blank
- All 4 exercise types
- Mix of abstract and real-world problems
- This is the target level for the Pythagoras reference lesson

### Gymnasium (Grades 10-12)
- Rigorous proofs, potentially multiple approaches
- Extension exercises (proofs, generalizations)
- Abstract and applied problems
- Connection to higher concepts (e.g., dot product, norms)

---

## 10. Accessibility & i18n Requirements

### 10.1 ARIA Patterns

- Tab navigation uses `role="tablist"`, `role="tab"`, `role="tabpanel"` with proper `aria-selected`, `aria-controls`, `id` linkage
- Keyboard navigation: ArrowLeft/Right between tabs, Home/End for first/last
- All SVG diagrams: `role="img"` + `aria-label` + `<title>`
- Decorative elements: `aria-hidden="true"`
- Form inputs: `<label>` with `htmlFor` or `sr-only` class

### 10.2 Keyboard Navigation

- All interactive elements must be keyboard-accessible
- Tab order follows visual layout
- Focus indicators visible in both light and dark mode
- Fill-in-the-blank: Enter key submits answer

### 10.3 Translation Rules

- All user-facing strings go through `next-intl` translation keys
- Mathematical content in `data.ts` stays in Danish (primary language)
- Translation keys use nested objects: `lesson.pythagoras.explore.title`
- Parameterized messages use ICU format: `{score} / {total}`
- Three locales required: `da` (Danish), `en` (English), `de` (German)

### 10.4 Color & Contrast

- WCAG AA contrast ratios on all text (4.5:1 normal, 3:1 large)
- Never rely on color alone — use text labels, icons, or patterns
- Dark mode: all colors auto-adapt via CSS custom properties
- Success: green (`--success`), Error: red (`--error`), Accent: gold (`--accent`)

---

## 11. Quality Checklist

Before releasing any lesson, verify:

### Content
- [ ] Explore tab hooks the student with a compelling scenario
- [ ] Explore tab lets the student discover the formula (not just be told)
- [ ] All proof steps are mathematically correct
- [ ] All story examples have accurate calculations and relatable scenarios
- [ ] All exercise answers and tolerances are verified
- [ ] All distractors are plausible but clearly wrong
- [ ] All explanations address the WHY, not just the WHAT
- [ ] Exercises are scaffolded (easy → hard)

### Technical
- [ ] `npm run build` passes with no errors
- [ ] `npm run lint` passes with no warnings
- [ ] All 3 translation files (da/en/de) have matching key structure
- [ ] Lesson renders at `/da/lektion/[slug]`
- [ ] All 5 tabs are accessible and functional
- [ ] Dark mode renders correctly (all SVGs use CSS custom properties)
- [ ] Mobile viewport (375px) renders correctly (proof SVG not sticky on mobile)
- [ ] Keyboard navigation works for all tabs and interactions

### Pedagogical
- [ ] Tab order follows the 5-step discovery-first flow (Explore → Understand → Proof → Examples → Practice)
- [ ] Explore tab starts with a hook, not with the formula
- [ ] Understand tab provides labeled diagram + terminology AFTER discovery
- [ ] Proof steps ACCUMULATE (all visible, new steps add below)
- [ ] Proof has at least one fill-in-the-blank step
- [ ] Examples are story-based with scenario SVG diagrams
- [ ] Exercises include at least 4 different types (visual-identify, numeric, MC, find-error, word-problem)
- [ ] Feedback is immediate and process-oriented
- [ ] Tone is conversational and uses "du" (you), not academic

---

## 12. Additional Recommendations

### 12.1 Progress Tracking (Future)

Use `localStorage` to persist:
- Warm-up scores per lesson (with timestamps for spacing)
- Exercise completion state
- Best scores for motivation

### 12.2 Spacing Reminders (Future)

Based on warm-up timestamps, suggest when to revisit a lesson:
- First review: 1 day after initial completion
- Second review: 3 days later
- Third review: 7 days later
- Subsequent reviews: 14+ days (expanding intervals)

### 12.3 Adaptive Difficulty (Future)

Track error patterns to:
- Offer additional examples for concepts students struggle with
- Skip warm-up if recently aced
- Adjust exercise difficulty based on performance

### 12.4 Collaborative Features (Future)

- Teacher dashboard showing class-wide misconception patterns
- Peer comparison (anonymized) for motivation
- Shared problem sets

---

## References

- Atkinson, R. K., Derry, S. J., Renkl, A., & Wortham, D. (2000). Learning from examples: Instructional principles from the worked examples research.
- Bjork, E. L., & Bjork, R. A. (2011). Making things hard on yourself, but in a good way: Creating desirable difficulties to enhance learning.
- Cepeda, N. J., Pashler, H., Vul, E., Wixted, J. T., & Rohrer, D. (2006). Distributed practice in verbal recall tasks.
- Chi, M. T. H., & Wylie, R. (2014). The ICAP framework: Linking cognitive engagement to active learning outcomes.
- Hattie, J., & Timperley, H. (2007). The power of feedback.
- Kapur, M. (2008). Productive failure. Cognition and Instruction.
- Kapur, M. (2014). Productive failure in learning math.
- Karpicke, J. D., & Blunt, J. R. (2011). Retrieval practice produces more learning than elaborative studying.
- Roediger, H. L., & Butler, A. C. (2011). The critical role of retrieval practice in long-term retention.
- Rohrer, D., & Taylor, K. (2007). The shuffling of mathematics problems improves learning.
- Sweller, J., & Cooper, G. A. (1985). The use of worked examples as a substitute for problem solving in learning algebra.
- Van Hiele, P. M. (1959). The child's thought and geometry. In T. P. Carpenter, J. A. Dossey, & J. L. Koehler (Eds.), Classics in mathematics education research.
