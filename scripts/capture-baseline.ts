#!/usr/bin/env tsx
/**
 * Capture baseline screenshots for all key page types.
 * Run after `pnpm build && pnpm preview` is running on port 4321.
 * Outputs to docs/dev-screenshots/baseline/
 *
 * Usage: pnpm exec tsx scripts/capture-baseline.ts
 */
import { chromium } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const BASE_URL = process.env.SITE_URL ?? 'http://localhost:4321';
const OUT_DIR = path.join(process.cwd(), 'docs/dev-screenshots/baseline');
fs.mkdirSync(OUT_DIR, { recursive: true });

const VIEWPORTS = [
  { name: 'mobile', width: 390,  height: 844 },
  { name: 'desktop', width: 1280, height: 800 },
];

const PAGES = [
  { slug: 'home',             path: '/' },
  { slug: 'hub-3b',           path: '/3b' },
  { slug: 'hub-routines',     path: '/routines' },
  { slug: 'hub-problems',     path: '/problems' },
  { slug: 'hub-products',     path: '/products' },
  { slug: 'article-spoke',    path: '/3b/best-leave-in-low-porosity-3b' },
  { slug: 'article-routines', path: '/routines/how-to-refresh-curls-day-2' },
  { slug: 'about',            path: '/about' },
  { slug: 'review-process',   path: '/review-process' },
  { slug: 'dev-variants',     path: '/dev/verdict-variants' },
];

(async () => {
  const browser = await chromium.launch();
  let count = 0;
  for (const vp of VIEWPORTS) {
    const ctx = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
    });
    const page = await ctx.newPage();
    for (const pg of PAGES) {
      try {
        await page.goto(`${BASE_URL}${pg.path}`, { waitUntil: 'networkidle' });
        const file = path.join(OUT_DIR, `${pg.slug}--${vp.name}.png`);
        await page.screenshot({ path: file, fullPage: true });
        console.log(`✓  ${pg.slug} @ ${vp.name} → ${path.relative(process.cwd(), file)}`);
        count++;
      } catch (e) {
        console.error(`✗  ${pg.slug} @ ${vp.name}: ${(e as Error).message}`);
      }
    }
    await ctx.close();
  }
  await browser.close();
  console.log(`\n${count} screenshots saved to docs/dev-screenshots/baseline/`);
})();
