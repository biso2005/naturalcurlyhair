**naturalcurlyhair.co.uk**
 
*Session Handover Document*
 
June 2026 — for next Claude Code session
 
# **1. Project Overview**
 
naturalcurlyhair.co.uk is an independent editorial resource for natural curly and Afro hair in the UK. No product line, no subscription box, no founder personality. Earns trust by recommending honestly across all brands, declaring affiliate links, and telling readers when to save their money.
 
Reference model: verdict-first editorial (Wirecutter), warmed for a community that values representation and lived experience.
 
Stack: Astro 4.x + MDX + Tailwind CSS + TypeScript, deployed to Cloudflare Pages. Executor: Claude Code. Local dev only — no remote/GitHub yet.
 
# **2. Build State**
 
## **Current state**
 
| **Item** | **Status** | **Notes** |
| --- | --- | --- |
| Build | Clean (exits 0) | 17 pages generated |
| Local dev | http://localhost:4328 | pnpm dev |
| GitHub | Local only | No remote in Phase 1 |
| Cloudflare Pages | Not yet deployed | Phase 2 |
 
## **Routes confirmed**
 
| **Route** | **Page** |
| --- | --- |
| / | Homepage — curl spectrum, two-pathway hero |
| /2a through /4c | Nine curl-type hub pages |
| /hair-care/ | Topic hub (merged routines + problem-solving) |
| /products/ | Topic hub |
| /parents/ | Topic hub |
| /parents/how-to-look-after-mixed-race-childs-hair-uk/ | Article 1 — Live |
| /hair-care/hair-porosity-test-natural-hair-uk/ | Article 2 — Live |
| /hair-care/why-is-my-4c-hair-always-dry-uk/ | Article 3 — Live |
 
# **3. Articles — Current Status**
 
| **Item** | **Status** | **Notes** |
| --- | --- | --- |
| Article 1 — Mixed-race child starter guide | Live | All TODOs cleared. Interlinks to Article 2 added. |
| Article 2 — Hair porosity test + quiz | Live | Porosity quiz embedded. Float test disclaimer top of result. |
| Article 3 — Why 4C hair is always dry | Live | All 10 TODOs cleared. UV angle removed. Hygral fatigue reframed. |
| Article 4 — 4C hair not growing (retention) | Next | Brief ready: pnpm brief 'why wont my 4c hair grow uk' |
 
## **Article production standard**
 
Every article must pass before publishing:
 
- Opens with concrete thing — real scene, problem, or number. Never 'In today's world...'
 
- Answers core query in first ~100 words (40-60 word featured-snippet answer)
 
- Uses reader's own language — verbatim community phrases, not industry copy
 
- Every product mention = declared affiliate link; verdict never bent to commission
 
- UK-specific where it matters — products, water, schools, pricing
 
- Interlinks: up to cluster cornerstone, across to siblings, down to commercial pillar
 
- No AI slop: no 'dive in', 'game-changer', enthusiasm padding, hollow both-sidesing
 
- Ends with concrete takeaway and email-capture prompt
 
# **4. Design ****&**** Brand — Locked Decisions**
 
## **Wordmark**
 
Direction B confirmed. NaturalCurly — no space between words.
 
- 'Natural' — Fraunces Variable, roman, opsz 18, SOFT 40, ink #2C1D17
 
- 'Curly' — Fraunces Variable, italic, opsz 18, SOFT 40, berry #A2384B
 
- Footer override: both spans → cream #F8F3EA on plum #3E2230
 
- Homepage hero: same treatment, opsz 36, SOFT 20 (display scale)
 
## **Favicon**
 
NC monogram SVG at public/favicon.svg — ink N, berry italic C, transparent background. Confirmed in browser tab.
 
## **Colour tokens (canonical)**
 
| **Token** | **Hex** | **Role** |
| --- | --- | --- |
| cream | #F8F3EA | Page background |
| cream-2 | #F1E8D9 | Secondary surface / cards-on-cream |
| ink | #2C1D17 | Primary text (warm espresso) |
| plum | #3E2230 | Anchor: masthead, footer, dark callouts |
| berry | #A2384B | Primary accent: links, eyebrows, verdict |
| ochre | #B97A2B | Quiet secondary accent, used sparingly |
| taupe | #6E6056 | Muted / secondary text |
 
## **Type stack**
 
| **Role** | **Family** | **Notes** |
| --- | --- | --- |
| Display / headlines / wordmark | Fraunces (variable) | Warm editorial serif. Italic in berry for accent words. |
| Article body / long-form | Newsreader (variable) | Reading-optimised serif. Journal register. |
| UI / labels / nav / captions | Public Sans (variable) | Clean grotesque for structure and metadata. |
 
## **Nav structure**
 
Curl types ▾ (grouped dropdown: WAVES/CURLS/COILS) · Hair Care · Products · Parents
 
## **Category taxonomy (hub enum)**
 
'2a','2b','2c','3a','3b','3c','4a','4b','4c','hair-care','products','parents'
 
*'**routines**'** renamed to **'**hair-care**'**. **'**problem-solving**'** deleted. Both absorbed into hair-care.*
 
# **5. Copy Rules — Standing Decisions**
 
## **Banned words in UI copy (not article body prose)**
 
Remove any word that describes what the site claims to be rather than what it does:
 
| **Word** | **Why banned** |
| --- | --- |
| honest / honestly | Claiming trust instead of earning it. The verdicts prove it. |
| trusted | Trust is conferred by readers, not claimed by the site. |
| independent | True, but stating it sounds defensive. Show it through disclosures. |
| transparent / unbiased | Impossible to prove. Actively suspicious. |
| genuine / authentic | Means nothing. Every site claims genuine. |
| ultimate / comprehensive | Signals low-effort SEO content. |
| definitive / proven / guaranteed | Cannot be justified without clinical evidence. |
| expert (self-label) | Credibility comes from analysis quality, not self-labelling. |
| British English | Already enacted by spelling. Badge, not fact. |
| 'UK' as title badge | Specificity belongs in content, not title labels. |
 
*'**honest**'** is fine in article body prose as a voice marker: **'**Honestly? Skip this.**'** Not in hub deks, titles, or nav.*
 
## **Four copy changes already applied**
 
- index.astro: 'Honest curl care, organised by type.' → 'Curl care, organised by type.'
 
- BaseLayout.astro: '· Made in the UK · British English' → '· Made in the UK'
 
- hubs/parents.mdx: 'Honest guidance for parents...' → 'Guidance for parents...'
 
- AffiliateDisclosure.astro: 'genuinely tested' → 'tested'
 
# **6. Key Components**
 
## **PorosityQuiz.astro**
 
Built and embedded in Article 2. Six behaviour-based questions, three result types.
 
- Float test disclaimer: top of every result page (before description, not buried)
 
- UK hard water note: personalised per porosity type
 
- CTA: 'Get product advice' fires sendPrompt with result pre-loaded
 
- 'Retake quiz' restarts from Q1
 
*Standalone /tools/ page deferred to Phase 2. Tools nav item deferred until 2-3 tools exist.*
 
## **AffiliateDisclosure.astro**
 
Renders on every article. Copy: 'This article contains affiliate links. If you buy through them we may earn a small commission, at no extra cost to you. We only recommend products we have tested.'
 
## **VerdictCallout**
 
Plum background callout for 'save your money' verdicts. Used in article body.
 
# **7. Content Queue — Priority Order**
 
| **Priority** | **Title** | **Target keyword** | **Hub** |
| --- | --- | --- | --- |
| 1 | Done — Porosity article | — | hair-care |
| 2 | Done — 4C dry hair | why is my 4c hair always dry uk | hair-care |
| 3 — NEXT | 4C hair not growing (retention) | why wont my 4c hair grow uk | hair-care |
| 4 | 3B Wash Day Routine | 3b wash day routine uk | 3b |
| 5 | Detangling a Toddler's Curls Without Tears | detangle toddler curly hair | parents |
| 6 | 4C Wash Day Guide | 4c wash day routine uk | 4c |
| 7 | Hard Water Wrecking Your Curls | hard water curly hair uk | hair-care |
| 8 | Why Products Stopped Working | natural hair products stopped working | hair-care |
| 9 | Wash-and-Go Reverting in UK Humidity | wash and go reverting uk humidity | hair-care |
| 10 | Head Lice in Coily Hair | head lice afro hair uk | hair-care |
 
## **Quick wins — low competition**
 
- head lice afro hair uk — Mumsnet threads with hundreds of replies, zero good editorial content
 
- why natural hair products stopped working — common forum question, no dedicated UK article
 
- wash and go reverting uk humidity — UK climate modifier makes this essentially uncontested
 
- detangle toddler curly hair — emotional, shareable, parent cluster
 
# **8. Sourcing Library — Confirmed Sources**
 
## **Water hardness**
 
- TapWater.uk — UK Water Hardness Map (2026): London/SE 250-350 mg/L, Manchester 60-80 mg/L, Wales <80 mg/L
 
- DWI (Drinking Water Inspectorate) — dwi.gov.uk — primary authority
 
## **Humidity / UK conditions**
 
- UK indoor winter RH: 30-45% in centrally heated homes (Guinness Homes, Sussex Damp Experts)
 
- Glycerin hygroscopicity: absorbs 25% of its weight at 50% RH — Chemists Corner (Perry Romanowski)
 
## **Hair science**
 
- Porosity in textured hair: NYSCC 'An Overview on Hair Porosity' — coils cause cuticle lifting at twist points
 
- Protein penetration: Malinauskyte et al. 2021, Int J Cosmetic Science, 43:26-37 — low/mid MW penetrates cortex, high MW surface only
 
- Pre-poo protein loss: Rele & Mohile 2003, J Cosmet Sci 54(2):175-92 — coconut oil only oil to reduce protein loss
 
- Hygral fatigue: contested. Lab Muffin Beauty Science (Jan 2026) debunks swelling-damage claim. Frame as: wet hair is vulnerable hair, handle gently.
 
## **Trichologist directories**
 
- Institute of Trichologists (IOT) — trichologists.org.uk/qualified-trichologists-united-kingdom/ — PSA-accredited, use as primary
 
- The Trichological Society — hairscientists.org/consultants/hair-consultants/trichologists/ — secondary
 
# **9. Claude Code — Standing Rules**
 
## **Hard rules (8 total — from CLAUDE.md)**
 
- Never invent content, copy, or data
 
- Never claim a feature works without confirming in actual output
 
- Never move to next phase without explicit confirmation from Darren
 
- Font rendering confirmed in production build only (not dev server)
 
- No component built until design token phase confirmed
 
- No content written until component phase confirmed
 
- Nav and body links must include visited:text-ink
 
- Tailwind JIT: add low-frequency responsive variants to safelist
 
## **Phase gate rule**
 
pnpm build && pnpm preview is the gate — not the dev server. Every phase must exit 0 before proceeding.
 
## **Verify-claims rule**
 
Anti-pattern flagged three times: Claude claimed a feature worked and hedged with 'if absent it silently no-ops.' Claims must be verified against actual implementation, not assumed.
 
## **Locked specs win**
 
Once a spec is locked, execute — do not seek approval on each step. Locked documents override conversational answers.
 
# **10. Key Decisions Log**
 
| **Decision** | **Detail** |
| --- | --- |
| Category taxonomy | hair-care replaces routines+problem-solving. growth/protective-styles Phase 2+ |
| Nav | Curl types ▾ (WAVES/CURLS/COILS grouped dropdown) · Hair Care · Products · Parents |
| Logo | Direction B — wordmark only, no spiral mark in Phase 1 |
| Wordmark | NaturalCurly, no space, ink roman + berry italic |
| Favicon | NC monogram, ink N, berry italic C |
| Tools nav | Deferred until 2-3 tools built |
| Porosity quiz | Embedded in Article 2, standalone /tools/ page Phase 2 |
| Copy audit | 'honest', 'British English', 'genuinely' removed from UI |
| 'UK' as title badge | Remove — show UK specificity in content, not titles |
| Hygral fatigue | Reframed as 'wet hair is vulnerable' — swelling-damage claim not supported |
| UV angle | Removed from Article 3 — no defensible UK-specific data |
| Platform | Astro stack confirmed — WordPress option deliberated but not actioned |
| Photography | Faceless = brand voice only. Real UK natural-hair photography required. Not decorative. |
| Distribution | Creator/influencer-led primary, SEO compounding underneath. Pinterest complementary, not sole engine. |
 
# **11. Next Session**
 
## **Immediate first task**
 
Article 4 — 4C hair retention / growth article.
 
pnpm brief "why wont my 4c hair grow uk"
 
Paste brief output to Claude for editorial review before drafting.
 
## **Sourcing pattern (same as Articles 1-3)**
 
- Step 1: Identify TODOs in draft — all sourcing gaps flagged with [TODO] markers
 
- Step 2: Research pass — clear each TODO with a named source before publish
 
- Step 3: Editorial review — apply article-writing and blog-writing-specialist skills
 
- Step 4: Claude Code patches frontmatter, pnpm build confirms clean
 
## **Pending open questions (from PRD)**
 
- Keyword validation of cornerstone titles against a real keyword tool (Ahrefs / Semrush)
 
- Realistic weekly publishing capacity — sets 6-month vs 9-month build
 
- Which 1-2 creators are confirmed, and whether ongoing partners or one-off shares
 
- Who supplies real UK natural-hair photography
 
- Social handle audit: @naturalcurly / @naturalcurlyhair across IG, TikTok, Pinterest, YouTube
 
- Trademark check in UK haircare/publishing class
 
## **Phase 2 deferred items**
 
- GitHub remote + Cloudflare Pages deployment
 
- Dark mode (Phase 1 light only)
 
- Email templates
 
- Social graphics beyond Pinterest
 
- Standalone /tools/ page for porosity quiz
 
- Tools nav item (needs 2-3 tools first)
 
- Curl type finder tool
 
- Hard water checker (postcode → hardness level) tool
 
- Regional salon guides (London, Manchester, Birmingham)
 
*— End of handover document — naturalcurlyhair.co.uk · June 2026*
