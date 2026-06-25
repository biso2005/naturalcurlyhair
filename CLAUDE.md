# naturalcurlyhair.co.uk — Claude Code operating rules

## Stack
Astro 7.x + MDX + Tailwind CSS 3.x + TypeScript
Deployed to Cloudflare Pages. Static-first.

## Hard rules
1. Never invent content, copy, or data. If something is unclear,
   ask — do not fill in plausible-sounding values.
2. Never claim a feature works without confirming it exists.
   "It silently no-ops if absent" is not an acceptable answer.
3. Never move to the next phase of a build plan without explicit
   confirmation from the operator that the current phase passes.
4. Font rendering must be confirmed in a production build
   (pnpm build && pnpm preview) not in pnpm dev.
   The Vite dev server injects CSS async — fonts may not render
   correctly in dev mode even when the code is correct.
5. No component is built until the design token phase is confirmed.
6. No content is written until the component phase is confirmed.
7. Nav and body links must include visited:text-ink (or equivalent
   visited state token) to prevent browser :visited styles overriding
   the design token colour. Tailwind base reset does not cover
   a:visited.
8. Tailwind JIT can silently drop low-frequency responsive variants
   (e.g. md:hidden on elements that only appear in JS-toggled states).
   If a class is conditionally visible via JavaScript, add it to the
   safelist in tailwind.config.cjs. Document the tradeoff in a comment.

## Design tokens
All tokens live in tailwind.config.cjs.
Never use arbitrary Tailwind values (e.g. text-[#7A2120])
unless a token genuinely does not exist for the use case.
If a token is missing, add it to tailwind.config.cjs first.

## Fonts
- Fraunces: self-hosted at /public/fonts/Fraunces-Variable.woff2
- Public Sans: self-hosted at /public/fonts/PublicSans-Variable.woff2
- Newsreader: Google Fonts CDN (too large to self-host under 80KB cap)
- Fraunces MUST use axis utilities (.font-display-h1 etc) not raw
  font-family class. The opsz and SOFT axes are required.
- Font rendering is confirmed in production build, not dev server.

## Colour palette (canonical)
cream #F8F3EA · cream-2 #F1E8D9 · paper #FFFFFF
ink #2C1D17 · taupe #6E6056 · plum #3E2230
berry #A2384B · berry-dark #8A2E3F
ochre #B97A2B · danger #9C3A1A
line rgba(44,29,23,0.14) · line-strong rgba(44,29,23,0.28)

## Phase gate rule
The build follows a strict phase sequence:
Phase 0 Scaffold → Phase 1 Fonts → Phase 2 Tokens →
Phase 3 CLAUDE.md → Phase 4 Components → Phase 5 Content

Never skip or merge phases. Never start a phase without
operator confirmation that the previous phase passed.

## Phase confirmation criteria
A phase is confirmed complete when ALL three gates pass:
- Build exits 0 (pnpm build && pnpm preview)
- Visual check passes in incognito production preview
- Five-axis review finds no Critical issues
- Output is under ~150 lines for a single phase output

Report all three gates explicitly. Do not report a phase as
complete if any Critical issue is open.

## Code review gate (applies at end of every phase)
Before reporting a phase as complete, run a five-axis review:
1. Correctness — does the output do what the spec says?
2. Readability — would another session understand this without
   the author explaining it?
3. Architecture — does it follow the phase plan and project
   conventions in this file?
4. Security — no secrets in code, no untrusted input unvalidated
5. Performance — no unnecessary work at render time for a static
   site (no N+1 data fetching, no unbounded loops in build scripts)

Label any issues found:
- Critical: blocks phase completion
- Nit: optional, author may ignore
- FYI: informational only

Do not report a phase as complete if any Critical issue is open.

## Simplification rules for components (Phase 4)
Before writing any component:
1. Read CLAUDE.md and understand what the component does
2. Write the simplest version that satisfies the spec
3. No props the spec doesn't ask for
4. No abstractions the spec doesn't require
5. No conditional logic that isn't in the spec
6. After writing: check — is there anything that can be removed
   without changing behaviour? If yes, remove it.

Change size rule: each component should be ~50-150 lines.
If a component exceeds 200 lines, stop and split it.

## Component build order (Phase 4)
Build in this order, one at a time, each confirmed before next:
1. BaseLayout (nav + footer shell only — no content)
2. HubNavigation
3. ArticleLayout (shell only)
4. VerdictCallout (all four variants)
5. ProductCard
6. ComparisonTable
7. AffiliateDisclosure
8. HubLanding
9. SpokeIndex (article card grid)

## Content schema (Phase 5)
MDX frontmatter schema defined in src/content/config.ts.
Sample articles added only after all components pass review.
