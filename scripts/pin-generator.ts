// COCKPIT TOOL 3 — Pin variant generator.
//   pnpm run pins <article-slug>
// Reads article frontmatter, asks Claude for 5 headline angles (mock fallback),
// renders each via an HTML template to a 1000x1500 PNG with Playwright, and
// writes a contact-sheet HTML for review before manual Pinterest upload.
import { basename, resolve } from 'node:path';
import { readFileSync, existsSync } from 'node:fs';
import { listArticleFiles, writeText, fromRoot, slugify } from './lib/fs.js';
import { parseFrontmatter } from './lib/frontmatter.js';
import { callClaude, warnIfMock, printCostLedger } from './lib/claude.js';
import { PIN_TEMPLATES, type PinTemplateInput } from '../src/components/pins/templates.js';

const HUB_COLORS: Record<string, string> = {
  '2A': '#e8d5c4', '2B': '#d9bfa3', '2C': '#c9a682',
  '3A': '#b88a5e', '3B': '#9c6f47', '3C': '#7d5635',
  '4A': '#5e4126', '4B': '#452f1b', '4C': '#2e1f12',
  routines: '#4a6b6f', problems: '#8a4a4a', products: '#4a5d8a',
};

async function getHeadlines(title: string, keyword: string): Promise<{ lines: string[]; mock: boolean }> {
  const angles = PIN_TEMPLATES.map((t) => t.angle).join(', ');
  const { text, mock } = await callClaude(
    `Article: "${title}" (keyword: ${keyword}).
Write 5 short Pinterest pin headlines, one per line, no numbering, max 8 words each.
Use these angles in order: ${angles}. Plain UK English, no hype, no invented claims.`,
    { maxTokens: 400, step: 'pins' },
  );
  warnIfMock('pin-generator', mock);
  if (mock || !text.trim()) {
    return {
      mock: true,
      lines: [
        `What's your real curl type?`,
        `5 fixes for ${keyword}`,
        `From frizz to defined curls`,
        `Stop wasting money on the wrong products`,
        `The ${keyword} trick nobody mentions`,
      ],
    };
  }
  return { mock, lines: text.split('\n').map((l) => l.trim()).filter(Boolean).slice(0, 5) };
}

async function main(): Promise<void> {
  const arg = (process.argv[2] || '').trim();
  if (!arg) {
    console.error('Usage: pnpm run pins <article-slug>');
    process.exit(1);
  }
  const file = listArticleFiles().find((f) => basename(f, '.mdx') === arg);
  if (!file) {
    console.error(`No article "${arg}" in src/content/articles/.`);
    process.exit(1);
  }
  const { data } = parseFrontmatter(readFileSync(file, 'utf8'));
  const title = String(data.title ?? arg);
  const keyword = String(data.keyword ?? arg);
  const hub = String(data.hub ?? 'products');
  const hubColor = HUB_COLORS[hub] ?? '#4a5d8a';

  // Optional hero image: public/images/original/<slug>.{jpg,png}
  let heroImage: string | undefined;
  for (const ext of ['jpg', 'jpeg', 'png', 'webp']) {
    const p = fromRoot(`public/images/original/${arg}.${ext}`);
    if (existsSync(p)) {
      heroImage = `file://${p}`;
      break;
    }
  }

  console.log(`\n→ Generating pins for "${title}"…`);
  const { lines } = await getHeadlines(title, keyword);

  // Lazy-load Playwright so the rest of the toolchain never requires browsers.
  let chromium: typeof import('playwright').chromium;
  try {
    ({ chromium } = await import('playwright'));
  } catch {
    console.error('Playwright not installed. Run: pnpm exec playwright install chromium');
    process.exit(1);
  }

  const outDir = `pins/${arg}`;
  let browser;
  try {
    browser = await chromium.launch();
  } catch {
    console.error('Chromium not available. Run: pnpm exec playwright install chromium');
    process.exit(1);
  }
  const page = await browser.newPage({ viewport: { width: 1000, height: 1500 } });

  const generated: { angle: string; file: string; headline: string }[] = [];
  for (let i = 0; i < PIN_TEMPLATES.length; i++) {
    const tpl = PIN_TEMPLATES[i];
    const headline = lines[i] ?? lines[0] ?? title;
    const input: PinTemplateInput = { headline, hubColor, heroImage, brand: 'naturalcurlyhair.co.uk' };
    await page.setContent(tpl.render(input), { waitUntil: 'networkidle' });
    const pngName = `${slugify(tpl.angle)}.png`;
    await page.screenshot({ path: resolve(fromRoot(outDir), pngName) });
    generated.push({ angle: tpl.angle, file: pngName, headline });
    console.log(`  ✓ ${tpl.angle}: "${headline}"`);
  }
  await browser.close();

  const sheet = `<!doctype html><html><head><meta charset="utf-8"><title>Pins: ${arg}</title>
<style>body{font-family:system-ui;padding:24px;background:#f5f5f5}
.grid{display:flex;gap:16px;flex-wrap:wrap}figure{margin:0}
img{width:250px;height:375px;object-fit:cover;border:1px solid #ccc;background:#fff}
figcaption{font-size:13px;max-width:250px;margin-top:6px}</style></head>
<body><h1>Pin contact sheet — ${title}</h1>
<p>Review, pick the best 1-2, upload via Pinterest scheduler.</p>
<div class="grid">${generated
    .map((g) => `<figure><img src="${g.file}" alt="${g.angle}"><figcaption><b>${g.angle}</b><br>${g.headline}</figcaption></figure>`)
    .join('')}</div></body></html>`;
  writeText(`${outDir}/contact-sheet.html`, sheet);

  console.log(`\n✓ ${generated.length} pins + contact sheet in ${outDir}/\n`);
  printCostLedger();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
