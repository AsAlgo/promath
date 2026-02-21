# CLAUDE.md

## Project Overview

Promath — Next.js 16 math education app (Danish content, i18n for da/en/de). App Router, no Pages Router.

## Commands

- `npm run dev` — Dev server (Turbopack)
- `npm run build` — Production build
- `npm run lint` — ESLint
- `npm run format` — Prettier auto-format

## Architecture

- **Framework**: Next.js 16 (App Router), React 19, TypeScript 5 (strict)
- **Styling**: Tailwind CSS v4 via PostCSS; lesson components use inline styles with shared color palette
- **Fonts**: Geist Sans (body), Geist Mono (code), Instrument Serif (display) — `next/font/google`
- **i18n**: next-intl — locales da/en/de, config in `src/i18n/`, all routes under `[locale]` prefix
- **Education systems**: Multi-system (DK/DE/UK/US) via `EdSystemProvider` context + cookie
- **Path alias**: `@/*` → `./src/*`

### Source layout

- `src/app/[locale]/(marketing)/` — Landing, om, kontakt, faq (MarketingHeader + Footer)
- `src/app/[locale]/(app)/` — Learning app: trin, emne, omraader, lektion, pensum (AppHeader + Footer)
- `src/app/globals.css` — Tailwind v4, CSS custom properties, keyframes, dark mode via `prefers-color-scheme`
- `src/components/nav/` — site-header, main-nav, mobile-nav, sub-nav, breadcrumb-nav, grade-sidebar, category-sidebar, grade-selector, topic-selector, grade-filter, language-selector, ed-system-selector, theme-toggle
- `src/components/layout/` — app-header, footer
- `src/components/ui/` — Primitive UI (button, badge, card)
- `src/components/lessons/` — Interactive lesson components (cosine-rule/ with modular files)
- `src/components/` — topic-lessons, pensum-grid, ed-system-provider
- `src/lib/` — curriculum (data + queries), education-systems, grade-labels, grade-parsers, ed-system-cookie, constants, utils
- `src/types/` — education-system, grade, topic
- `src/i18n/` — routing, config, request (next-intl setup)

### Routing

All routes are prefixed with `[locale]` (handled by next-intl middleware).

| Route                    | Content                         | Sidebar            |
| ------------------------ | ------------------------------- | ------------------ |
| `/`                      | Landing page (marketing)        | —                  |
| `/om` `/kontakt` `/faq`  | Info pages (marketing)          | —                  |
| `/trin`                  | Grade overview grid             | —                  |
| `/trin/[klasse]`         | Topics for a grade              | GradeSidebar       |
| `/emne/[emne]`           | Lessons for a topic             | CategorySidebar    |
| `/omraader`              | All categories overview         | —                  |
| `/omraader/[kategori]`   | Topics in a category            | CategorySidebar    |
| `/lektion/[lektion]`     | Individual lesson               | —                  |
| `/pensum`                | Curriculum overview             | —                  |

### Client vs Server components

Server components by default. Client components (`'use client'`): all nav components (main-nav, mobile-nav, sidebars, selectors, theme-toggle), topic-lessons, pensum-grid, ed-system-provider, lesson components.

## Design System

### Color Palette

All colors are defined as CSS custom properties in `globals.css` and exposed as Tailwind tokens via `@theme inline`. Light/dark mode switches automatically via `prefers-color-scheme`.

| Token            | Light                | Dark               | Usage                               |
| ---------------- | -------------------- | ------------------ | ----------------------------------- |
| `background`     | #faf8f5 (warm paper) | #0a0818 (midnight) | Page background                     |
| `foreground`     | #1c1917              | #f5f4f0            | Body text                           |
| `primary`        | #312e81 (ink indigo) | #818cf8 (luminous) | Brand color, headings, buttons      |
| `primary-hover`  | #3730a3              | #a5b4fc            | Interactive hover states            |
| `primary-fg`     | #ffffff              | #0a0818            | Text on primary-colored backgrounds |
| `primary-subtle` | #eef2ff              | #1e1b4b            | Subtle backgrounds, badges          |
| `accent`         | #d97706 (warm gold)  | #fbbf24            | Highlights, decorative dots         |
| `surface`        | #ffffff              | #110e2b            | Card backgrounds                    |
| `surface-alt`    | #f5f0ff              | #0f0c24            | Alternating section backgrounds     |
| `muted`          | #78716c              | #a8a29e            | Secondary text, descriptions        |
| `border`         | #e7e5e4              | #2d2a5e            | Borders, dividers                   |

### Typography

- **Display** (`font-display`): Instrument Serif — used for hero headings, section titles, math symbols, nav logo
- **Body** (`font-sans`): Geist Sans — used for all body text, descriptions, buttons
- **Mono** (`font-mono`): Geist Mono — available for code snippets

### Animations

Defined as CSS `@keyframes` in `globals.css`:

- `float` / `float-reverse` — organic floating motion for decorative math symbols
- `fade-in-up` — staggered entrance animation for hero content (uses `animationDelay` inline styles)
- `.graph-paper` — subtle grid background using `color-mix()` with 10% primary color

### Component Patterns (Landing Page)

- Server components by default — all animations are CSS-only, no client JS needed
- Floating math symbols: absolute-positioned `<span>` elements with varying `fontSize`, `opacity`, and `animation` durations/delays for organic motion
- Feature cards: `group` + `group-hover:` pattern for coordinated hover effects (icon bg transitions from subtle to primary)
- Responsive: `sm:` / `md:` / `lg:` breakpoints; stacked on mobile, grid on larger screens
- Sections alternate between `bg-background` and `bg-surface-alt` for visual rhythm

### Design Principles

- **Aesthetic**: "Mathematical elegance" — academic/editorial feel, not generic tech-purple
- **Tone**: Premium, refined, intellectual but approachable for students
- **Content language**: Danish (lang="da")
- **Dark mode**: Full support, colors auto-adapt — primary shifts from deep ink to luminous glow
- **Accessibility**: `aria-hidden` on decorative elements, WCAG AA contrast ratios on all text

### Lesson component pattern (`src/components/lessons/`)

- Tab-based sections (Intro, Proof, Interactive, Examples, Exercises)
- Dark theme color palette as `C` object constant
- SVG diagrams, Canvas for real-time rendering, custom `Katex` math component
- Local state only (useState/useRef/useCallback) — no external state management
- Tolerance-based validation for exercises

### Navigation active states

Nav components use `usePathname()` from `@/i18n/routing` to highlight the current route. Active style: `text-primary font-medium bg-primary-subtle`. Sidebar headers (CategorySidebar → `/omraader/[id]`, GradeSidebar → `/trin/[klasse]`) are clickable links.

## Code Style

Prettier: semicolons, single quotes, 2-space indent, trailing commas, 80-char width. ESLint: `next/core-web-vitals` + `next/typescript`.

## Notes

- No test framework configured
- No database or API routes
- Curriculum data loaded from JSON (`src/lib/curriculum.ts`)
