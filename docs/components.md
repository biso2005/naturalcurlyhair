# Component documentation

## ToolCTA

**Path:** `src/components/article/ToolCTA.astro`

Inline article callout that links to the diagnostic tool. Appears within the reading flow of an article body. Operator places it manually — only in articles where the tool adds genuine value beyond the article itself.

### Props

| Prop | Type | Required | Default |
|------|------|----------|---------|
| `headline` | string | yes | — |
| `body` | string | yes | — |
| `cta_href` | string | yes | — |
| `kicker` | string | no | `"Get a personalised answer"` |
| `cta_text` | string | no | `"Run the diagnostic →"` |

### Usage

In an MDX article file:

```mdx
import ToolCTA from '../../components/article/ToolCTA.astro';

<ToolCTA
  headline="Want to check if hard water is actually your issue?"
  body="The diagnostic asks four questions and tells you the most likely cause for your postcode."
  cta_href="/tool/"
/>
```

### When to embed

Use only when:
- The article diagnoses a problem the tool can personalise
- The reader has finished a diagnostic section and a postcode check would add a specific answer
- The article is about a symptom that has multiple possible causes by location (water hardness, humidity)

Do NOT embed on articles that are already conclusive (a product verdict, a how-to technique). The tool is for triage, not for every article.
