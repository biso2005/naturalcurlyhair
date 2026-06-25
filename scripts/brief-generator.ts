// COCKPIT TOOL 1 — Brief generator.
//   pnpm run brief "<keyword>"
// Pulls the top-10 SERP, extracts PAA questions, asks Claude for a structured
// brief, and writes data/briefs/<slug>.md with a verification checklist.
// Output is a BRIEF, not a draft — the draft step is deliberately separate.
import { fetchSerp } from './lib/serp.js';
import { callClaude, warnIfMock, printCostLedger } from './lib/claude.js';
import { writeText, slugify } from './lib/fs.js';

const SYSTEM = `You are a content strategist for naturalcurlyhair.co.uk, a curly-hair
site whose moat is ORIGINAL TESTING. Voice: plain, direct UK English, no hype,
no invented product claims. Briefs must force the writer to verify every claim.`;

function buildPrompt(keyword: string, serpTitles: string[], paa: string[]): string {
  return `Keyword: "${keyword}"

Top-10 result titles:
${serpTitles.map((t, i) => `${i + 1}. ${t}`).join('\n')}

People Also Ask:
${paa.map((q) => `- ${q}`).join('\n')}

Produce a content brief with these sections:
1. Target structure (H2/H3 outline)
2. Sections to include (and why)
3. Products to consider (generic — do NOT invent brand claims)
4. Gaps in the current top results to exploit (top 3)
5. Suggested meta description (150-160 chars)
Keep it tight. Markdown only.`;
}

function mockBrief(keyword: string, serp: { organic: unknown[] }, paa: string[]): string {
  return `## Target structure
- H2: What "${keyword}" actually means
- H2: Step-by-step
- H2: Common mistakes
- H2: Product picks (tested)
- H2: FAQ

## Sections to include
- Comparison table (most top results have one)
- FAQ answering the PAA questions below

## Products to consider
- (placeholder — fill in the Products to evaluate table below before drafting)

## Gaps to exploit
1. Top results are thin on original testing — lead with first-hand verdicts.
2. Few address fine vs coarse hair separately.
3. Missing day-2/day-3 maintenance detail.

## Suggested meta description
Practical, tested advice on ${keyword} — what works, what to skip, and the products we actually used.

_(MOCK brief — set ANTHROPIC_API_KEY for a real one. ${serp.organic.length} SERP results, ${paa.length} PAA questions.)_`;
}

async function main(): Promise<void> {
  const keyword = process.argv.slice(2).join(' ').trim();
  if (!keyword) {
    console.error('Usage: pnpm run brief "<keyword>"');
    process.exit(1);
  }
  const slug = slugify(keyword);

  console.log(`\n→ Fetching SERP for "${keyword}"…`);
  const serp = await fetchSerp(keyword);
  const titles = serp.organic.map((r) => r.title);
  const avgWords =
    serp.organic.length > 0
      ? Math.round(serp.organic.reduce((s, r) => s + r.snippet.split(/\s+/).length * 30, 0) / serp.organic.length)
      : 0;

  console.log('→ Generating brief…');
  const { text, mock } = await callClaude(buildPrompt(keyword, titles, serp.peopleAlsoAsk), {
    system: SYSTEM,
    maxTokens: 1500,
    step: 'brief',
  });
  warnIfMock('brief-generator', mock);
  const briefBody = mock ? mockBrief(keyword, serp, serp.peopleAlsoAsk) : text;

  const checklist = serp.peopleAlsoAsk
    .map((q) => `- [ ] Answer verified: ${q}`)
    .concat(
      '- [ ] Every product price checked against live retailer',
      '- [ ] Availability confirmed',
      '- [ ] hub value is a valid enum (2a–4c, routines, products, problem-solving)',
      '- [ ] Products to evaluate table filled before running draft',
      '- [ ] Recommendation traces to a testing note or researched-not-tested tag',
    );

  const out = `# Brief: ${keyword}

> Generated brief — review and edit the angle, then run \`pnpm run draft ${slug}\`.
> SERP source: ${serp.mock ? 'MOCK' : 'Serper.dev'} · ${serp.organic.length} results · est. avg ~${avgWords} words

## Suggested frontmatter
\`\`\`yaml
title: ""
hub: ""
category: ""
dek: ""
published: ""
readTime: ""
tested: false
\`\`\`

${briefBody}

## Products to evaluate
For each product you plan to include, fill in a row before drafting.

| name | brand | verdict (buy/skip/not-yet-tested) | price | buyUrl | claims (max 3, max 15 words each) |
|---|---|---|---|---|---|
| | | | | | |

## People Also Ask
${serp.peopleAlsoAsk.map((q) => `- ${q}`).join('\n')}

## Verification checklist (must clear before publish)
${checklist.join('\n')}
`;

  const rel = `data/briefs/${slug}.md`;
  writeText(rel, out);

  console.log(`\n✓ Brief written: ${rel}`);
  console.log(`  Top results: ${serp.organic.length}`);
  console.log(`  Est. avg word count: ~${avgWords}`);
  console.log('  Top 3 gaps: see the "Gaps to exploit" section in the brief.\n');
  printCostLedger();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
