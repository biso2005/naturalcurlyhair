// Draft step (intentionally separate from brief — forces human judgement first).
//   pnpm run draft <brief-slug>
// Reads an approved brief and produces a draft MDX in src/content/articles/ with
// status:"draft". Never published directly; opens for PR review.
import { callClaude, warnIfMock, printCostLedger } from './lib/claude.js';
import { readText, writeText, fromRoot } from './lib/fs.js';
import { existsSync } from 'node:fs';

const SYSTEM = `You write curly-hair articles for naturalcurlyhair.co.uk. Plain UK
English, first-hand and specific, NEVER invent product claims or prices. If a
claim needs verification, write it as a TODO the operator must confirm.

CRITICAL — testing claims: if the brief does not confirm that real testing has
happened, you MUST NOT write past-tense testing prose ("we tested", "testers
found", "a panel of people tried"). Instead, write the "How We Tested" section
as a TODO stub only. Writing fictional testing methodology is worse than
omitting it — it is a claim the reader cannot verify and the operator cannot
stand behind.`;

async function main(): Promise<void> {
  const slug = (process.argv[2] || '').trim();
  if (!slug) {
    console.error('Usage: pnpm run draft <brief-slug>');
    process.exit(1);
  }
  const briefPath = `data/briefs/${slug}.md`;
  if (!existsSync(fromRoot(briefPath))) {
    console.error(`No brief at ${briefPath}. Run: pnpm run brief "<keyword>" first.`);
    process.exit(1);
  }
  const brief = readText(briefPath);

  const { text, mock } = await callClaude(
    `Here is the approved brief. Write the article body in MDX (no frontmatter — body only). Use ## and ### headings. Mark unverified claims as {/* TODO: verify ... */} (MDX comment syntax — never HTML comments).

If the brief includes a "How We Tested" section: write it as a TODO stub only:

## How We Tested

{/* TODO: replace this section with real testing methodology once products
    have been tested for ≥7 days. Until then this section must not exist in
    published form. Do not write past-tense testing prose here. */}

Do not write any sentences asserting that testing happened ("we tested",
"our panel", "testers found") unless the brief explicitly confirms it.\n\n${brief}`,
    { system: SYSTEM, maxTokens: 4000, step: 'draft' },
  );
  warnIfMock('draft-generator', mock);

  const body = mock
    ? `## Draft pending\n\nThis is a MOCK draft scaffold. Set ANTHROPIC_API_KEY to generate the real body from the brief.\n\n{/* TODO: verify all product claims before publish */}`
    : text;

  const articlePath = `src/content/articles/${slug}.mdx`;
  const today = new Date().toISOString().slice(0, 10);
  const fm = [
    '---',
    'title: "TODO — set H1 with exact keyword"',
    'hub: "TODO — must be one of: 2a 2b 2c 3a 3b 3c 4a 4b 4c hair-care products parents"',
    'category: "TODO — e.g. Products, Routines, Problem Solving"',
    'dek: "TODO — one sentence, max 20 words"',
    `published: "${today}"`,
    'readTime: "TODO — estimated, e.g. 8 min"',
    'tested: false',
    '---',
    '',
    // The affiliate disclosure is auto-injected by ArticleLayout.
    // Do NOT import it into article bodies — that double-renders it.
    // Add products: [] array to frontmatter manually after drafting,
    // informed by the brief's "Products to evaluate" table.
  ].join('\n');

  writeText(articlePath, `${fm}\n${body}\n`);
  console.log(`\n✓ Draft written: ${articlePath} (status: draft)`);
  console.log('  Next: edit, run `pnpm run links ' + slug + '`, then open a PR.\n');
  printCostLedger();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
