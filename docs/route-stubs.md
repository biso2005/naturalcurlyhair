# Route Status

Generated after Homepage v1. Last updated: 2026-06-25.

## Live routes (build confirmed)

| Route | Status | Notes |
|-------|--------|-------|
| `/` | Live | Homepage v1 |
| `/2a/` through `/4c/` | Live | Nine curl-type hub pages |
| `/hair-care/` | Live | Topic hub |
| `/products/` | Live | Topic hub |
| `/parents/` | Live | Topic hub |
| `/parents/how-to-look-after-mixed-race-childs-hair-uk/` | Live | Article 1 |
| `/hair-care/hair-porosity-test-natural-hair-uk/` | Live | Article 2 (with porosity quiz) |
| `/hair-care/why-is-my-4c-hair-always-dry-uk/` | Live | Article 3 |
| `/hair-care/why-wont-my-4c-hair-grow-uk/` | Live | Article 4 |
| `/tool/` | Live | Diagnostic screen 1 — "what's bothering you" |
| `/tool/postcode` | Live | Diagnostic screen 2 — postcode input |
| `/tool/result` | Live | Diagnostic result screen |
| `/tool/narrow` | Live | Diagnostic narrowing screen |
| `/tools/water-hardness/` | Live | Water hardness checker tool |

## Stub routes (linked from homepage, destination is placeholder)

| Route | Linked from | Current destination | Needed for |
|-------|------------|---------------------|------------|
| `/tool/postcode?p={postcode}` | Hero tool "Check my area" button | `/tool/postcode` page exists — GET param `p` must be handled | Postcode diagnostic flow |
| `/tool/` | Hero tool alt-CTA "Tell us what's bothering you" | `/tool/` page exists | Diagnostic entry screen 1 |
| `/method/uk-humidity` | Dynamic panel CTA | **Does not exist** — placeholder stub | UK humidity explainer article |
| `/articles/` | Latest articles "All articles" CTA | **Does not exist** | Articles index page |
| `/hair-care/` (symptom cards) | Four symptom doc cards | `/hair-care/` hub exists — no symptom-specific articles yet | Hard water/protein/porosity/winter dryness articles |

## Notes

- `/method/uk-humidity` — stub URL used in `dynamicPanel.ts`. Create real article at this path or redirect when humidity explainer is written.
- `/articles/` — no articles index page built yet. CTA in LatestArticles section points here. Needs a new page or redirect to `/hair-care/`.
- Symptom doc card URLs all point to `/hair-care/` as a fallback. Update `src/data/homepage_copy.json` `symptom_doc.cards[].href` when specific articles exist.
