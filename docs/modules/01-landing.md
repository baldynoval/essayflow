# EssayFlow — Module 01: Landing Page

**Module:** 01 — Landing Page (also the project foundation: design system + shared components)
**Purpose:** Marketing entry point that establishes EssayFlow's visual language and the shared foundation for every later module.
**Route:** `/`
**Next module:** 02 — Login / Authentication (`/login`)

## Run / build

```bash
npm install
cp .env.example .env.local   # optional; only NEXT_PUBLIC_APP_URL is read
npm run dev                  # http://localhost:3000
npm run typecheck            # tsc --noEmit
npm run lint                 # next lint (ESLint 9 flat config)
npm run build && npm start
```

Requires Node 20+ (developed on Node 22). No network access is needed at build time (the font is self-hosted through npm).

## Landing sections (in order)

Top navigation · Hero · Masalah/Solusi strip · Product preview (tabs) · Cara Kerja · AI showcase (animated stages) · Teacher review showcase · Fitur Unggulan + Testimoni · Manfaat (`#tentang`) · FAQ · Final CTA · Footer.

## Files created

```
src/design/tokens.ts                     design tokens (single source of truth)
tailwind.config.ts                       consumes tokens, emits colour CSS variables (light + dark)
src/app/{layout.tsx,page.tsx,globals.css,icon.svg}
src/lib/{cn.ts,format.ts,scoring.ts}
src/types/domain.ts
src/data/landing.ts                      Indonesian copy + demo criteria
src/components/ui/                       Button, Card, Badge, StatusBadge, Avatar, Logo, Container,
                                         SectionHeading, ScoreDisplay, AIIndicator, Reveal, Tabs, Accordion
src/components/ai/AIEvaluationPanel.tsx
src/components/layout/{TopNavigation,MarketingFooter}.tsx
src/components/marketing/                Hero, ProductPreview, Workflow, AIShowcase, ReviewShowcase,
                                         Features, Benefits, FAQ, FinalCTA, icons.ts, mocks/*
config: next.config.ts, tsconfig.json, postcss.config.mjs, eslint.config.mjs, .env.example
```

## Files modified
None (first module).

## Components reused
None (first module). Everything above is a **shared resource** for Modules 02–15 — extend, never duplicate.

## Dependencies added
`next@15`, `react@19`, `react-dom@19`, `framer-motion@12`, `lucide-react`, `@fontsource-variable/inter`, `clsx`;
dev: `typescript@5.9`, `tailwindcss@3.4`, `postcss`, `autoprefixer`, `eslint@9`, `eslint-config-next@15`, `@eslint/eslintrc`, `@types/*`.

## Environment variables
| Name | Used by | Notes |
|---|---|---|
| `NEXT_PUBLIC_APP_URL` | `metadataBase` in `layout.tsx` | defaults to `http://localhost:3000` |

Auth, AI and database variables are reserved (commented) in `.env.example` and are **not** read yet. No secrets are included.

## Integration instructions
- Use `Button`, `Card`, `Badge`/`StatusBadge`, `ScoreDisplay`, `AIIndicator`, `AIEvaluationPanel`, `Tabs`, `Accordion`, `Container` from `@/components/ui/*` and `@/components/ai/*`.
- Never hardcode colours, radii, shadows or font sizes. Use the Tailwind names generated from `src/design/tokens.ts` (`bg-surface`, `text-ink-2`, `border-line`, `rounded-md`, `shadow-soft`, `text-body-sm`, …). Spacing is restricted to the token scale (4/8/12/16/20/24/32/40/48/64/80/96/120).
- `text-ink-3` is for icons/placeholders/disabled only (fails AA contrast for text).
- Scores: `formatScore(87.5) → "87,5"`, `weightedScore()` and `isRubricValid()` in `src/lib`.
- Dates/times: `formatDate()` → `19 September 2026`, `formatTime()` → `15.30 WIB` (Asia/Jakarta).
- Dark mode: tokens exist under `[data-theme="dark"]`; Module 14 only needs to toggle the attribute.
- Do not add `tailwind-merge` without configuring the custom font-size tokens.

## Known limitations
- `/login` does not exist yet — all "Masuk" / "Mulai Sekarang" links point to it and 404 until Module 02.
- "Tentang" scrolls to `#tentang` (the Manfaat section); Module 15 will repoint it to `/about`.
- Testimonial, names and numbers are demo content, not real customer claims.
- Product previews are decorative React mocks (aria-hidden), not screenshots; adjacent text carries the meaning.
- Reference image is a low-resolution composite: typeface (Inter Variable used), accent (`#4C5BD4`, sampled from the swatch) and pixel sizes are approximations, verified by side-by-side review in Chromium at 1440 / 820 / 390 px, not by pixel diff.
- Footer has no social icons (reference shows them): lucide v1 has no brand icons and no real accounts exist yet.
- TypeScript is pinned to 5.9: TS 6 rejects the CSS side-effect import under Next 15.
- `next lint` is deprecated in Next 16; migrate to the ESLint CLI when upgrading.


---

## MODULE_MANIFEST — 01 Landing

MODULE
- 01 — Landing Page (+ project foundation)

ROUTES
- `/` (static)
- `/icon.svg` (favicon)

NEW COMPONENTS
- ui: Button (+`buttonClasses`), Card, Badge, StatusBadge, Avatar, Logo/LogoMark, Container, SectionHeading, ScoreDisplay, AIIndicator, Reveal, Tabs, Accordion
- ai: AIEvaluationPanel
- layout: TopNavigation (marketing), MarketingFooter
- marketing: Hero, ProductPreview, Workflow, AIShowcase, ReviewShowcase, Features, Benefits, FAQ, FinalCTA, mocks/{MockWindow, MockReview, MockDashboard, MockRubric, MockResult}

MODIFIED COMPONENTS
- none

NEW TYPES
- `Role`, `TaskStatus`, `SubmissionStatus`, `RubricCriterion`, `ScoredCriterion` (`src/types/domain.ts`)

NEW UTILITIES
- `cn` · `formatScore`, `formatDate`, `formatTime` · `totalWeight`, `isRubricValid`, `weightedScore`
- Design tokens: `palette`, `spacing`, `radius`, `shadows`, `fontSize`, `screens`, `layout`, `motionTokens`

NEW DEPENDENCIES
- next 15, react 19, framer-motion 12, lucide-react, @fontsource-variable/inter, clsx, tailwindcss 3.4, typescript 5.9, eslint 9 (+ next config)

ENVIRONMENT VARIABLES
- `NEXT_PUBLIC_APP_URL` (optional)

API/SERVICE INTERFACES
- none yet. Planned for later modules: `AuthService`, `TaskRepository`, `AIAssessmentService` (mock-first, provider-agnostic).

INTEGRATION POINTS
- Landing CTAs → `/login` (Module 02)
- `StatusBadge` + `StatusKey` cover task and submission statuses for Modules 03–13
- `AIEvaluationPanel` (stages + criteria) is reused by Modules 06, 08, 11
- `ScoreDisplay` is reused by Modules 08, 12, 13
- `Tabs`, `Accordion` reused by Modules 07, 12, 14, 15

NEXT MODULE
- 02 — Login / Authentication (`/login`)

KNOWN ISSUES
- `/login` 404s until Module 02
- "Tentang" anchors to `#tentang` until Module 15
- Demo testimonial content
