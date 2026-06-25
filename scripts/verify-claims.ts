// Pre-publish check (the editorial gate, automated part).
//   pnpm run verify [article-slug]   |   pnpm run verify  (all)
//
// This is the AUTOMATED half of the moat. It fails (exit 1) when:
//   1. tested=true but testedProducts is empty.
//   2. A testedProduct ID is missing from data/products-tested.json.
//   3. A tested product is not ACTUALLY tested — i.e. it is a placeholder:
//        - testedDays < MIN_TESTED_DAYS (7), or
//        - verdict is null / empty / contains a placeholder phrase, or
//        - rating is null.
//      (Gap #7: previously the gate only checked the ID existed, so an article
//       could claim tested=true while citing a zero-day placeholder product.)
//   4. An affiliate /go/<slug> used in the body is missing from data/links.json.
//
// Run by CLAUDE.md before opening any PR, and by .github/workflows/pr-checks.yml.
import { basename } from 'node:path';
import { readFileSync } from 'node:fs';
import { listArticleFiles, readJson } from './lib/fs.js';
import { parseFrontmatter } from './lib/frontmatter.js';

// The spec's minimum real-use period before a verdict may be written.
const MIN_TESTED_DAYS = 7;

// Phrases that mark a verdict as a not-yet-real placeholder.
const PLACEHOLDER_VERDICT = [/placeholder/i, /not yet tested/i, /\btodo\b/i, /^tbd$/i];

interface Product {
  id: string;
  testedDays?: number | null;
  verdict?: string | null;
  rating?: number | null;
}
interface Link {
  slug: string;
}

function isPlaceholderVerdict(verdict: string | null | undefined): boolean {
  if (!verdict || !verdict.trim()) return true;
  return PLACEHOLDER_VERDICT.some((re) => re.test(verdict));
}

function main(): void {
  const arg = (process.argv[2] || '').trim();
  const products = readJson<{ products: Product[] }>('data/products-tested.json').products;
  const links = readJson<{ links: Link[] }>('data/links.json').links;
  const productById = new Map(products.map((p) => [p.id, p]));
  const knownLinks = new Set(links.map((l) => l.slug));

  const files = listArticleFiles().filter((f) => !arg || basename(f, '.mdx') === arg);
  if (files.length === 0) {
    console.error(arg ? `No article "${arg}".` : 'No articles found.');
    process.exit(1);
  }

  const problems: string[] = [];
  for (const file of files) {
    const slug = basename(file, '.mdx');
    const raw = readFileSync(file, 'utf8');
    const { data, body } = parseFrontmatter(raw);
    const tested = data.tested === true;
    const testedProducts = Array.isArray(data.testedProducts) ? (data.testedProducts as string[]) : [];

    if (tested && testedProducts.length === 0) {
      problems.push(`${slug}: tested=true but testedProducts is empty.`);
    }

    for (const id of testedProducts) {
      const product = productById.get(id);
      if (!product) {
        problems.push(`${slug}: testedProduct "${id}" not in data/products-tested.json.`);
        continue;
      }
      // Gap #7: enforce that the product was ACTUALLY tested, not a placeholder.
      if (tested) {
        const days = product.testedDays ?? 0;
        if (days < MIN_TESTED_DAYS) {
          problems.push(
            `${slug}: product "${id}" in data/products-tested.json has testedDays=${days} (< ${MIN_TESTED_DAYS}). ` +
              `Either complete the test or set the article to tested:false.`,
          );
        }
        if (isPlaceholderVerdict(product.verdict)) {
          problems.push(
            `${slug}: product "${id}" in data/products-tested.json has a placeholder/empty verdict ` +
              `("${product.verdict ?? ''}"). Write a real verdict or set tested:false.`,
          );
        }
        if (product.rating == null) {
          problems.push(
            `${slug}: product "${id}" in data/products-tested.json has a null rating. ` +
              `Add a rating or set tested:false.`,
          );
        }
      }
    }

    // Any /go/<slug> used in the body must exist in links.json.
    for (const m of body.matchAll(/\/go\/([a-z0-9-]+)/g)) {
      if (!knownLinks.has(m[1])) {
        problems.push(`${slug}: affiliate slug "${m[1]}" not in data/links.json.`);
      }
    }
  }

  if (problems.length > 0) {
    console.error(`\n✗ verify-claims FAILED (${problems.length} issue${problems.length > 1 ? 's' : ''}):`);
    for (const p of problems) console.error(`  - ${p}`);
    console.error('\nFix these before opening a PR.\n');
    process.exit(1);
  }
  console.log(`\n✓ verify-claims passed for ${files.length} article(s).\n`);
}

main();
