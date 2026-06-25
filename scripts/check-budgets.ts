#!/usr/bin/env tsx
/**
 * Build budget gate.
 * CSS < 20 KB gzipped, JS < 30 KB gzipped, fonts ≤ 80 KB total (raw woff2).
 * Run after `pnpm build`. Exits non-zero if any budget is exceeded.
 */
import { gzipSync } from 'zlib';
import { readFileSync, statSync } from 'fs';
import { globSync } from 'fs/promises';
import path from 'path';
import { readdirSync } from 'fs';

const DIST = path.join(process.cwd(), 'dist');
const PUBLIC = path.join(process.cwd(), 'public');

function gzipSize(filePath: string): number {
  const buf = readFileSync(filePath);
  return gzipSync(buf).length;
}

function rawSize(filePath: string): number {
  return statSync(filePath).size;
}

function collectFiles(dir: string, ext: string): string[] {
  const results: string[] = [];
  const walk = (d: string) => {
    for (const entry of readdirSync(d, { withFileTypes: true })) {
      const full = path.join(d, entry.name);
      if (entry.isDirectory()) { walk(full); }
      else if (entry.name.endsWith(ext)) { results.push(full); }
    }
  };
  try { walk(dir); } catch { /* dir may not exist */ }
  return results;
}

let failed = false;

// ── CSS budget ─────────────────────────────────────────────────────────────
const cssFiles = collectFiles(DIST, '.css');
let totalCssGz = 0;
for (const f of cssFiles) {
  totalCssGz += gzipSize(f);
}
const CSS_LIMIT = 20 * 1024;
const cssKb = (totalCssGz / 1024).toFixed(1);
if (totalCssGz > CSS_LIMIT) {
  console.error(`❌ CSS budget exceeded: ${cssKb} KB gz (limit 20 KB)`);
  failed = true;
} else {
  console.log(`✓ CSS: ${cssKb} KB gz ≤ 20 KB`);
}

// ── JS budget ──────────────────────────────────────────────────────────────
const jsFiles = collectFiles(DIST, '.js').filter(f => !f.includes('/_astro/') || !f.endsWith('.mjs') === false);
// Collect all JS in dist, excluding inline scripts (too small to matter)
const allJsFiles = collectFiles(DIST, '.js');
let totalJsGz = 0;
for (const f of allJsFiles) {
  totalJsGz += gzipSize(f);
}
const JS_LIMIT = 30 * 1024;
const jsKb = (totalJsGz / 1024).toFixed(1);
if (totalJsGz > JS_LIMIT) {
  console.error(`❌ JS budget exceeded: ${jsKb} KB gz (limit 30 KB)`);
  failed = true;
} else {
  console.log(`✓ JS:  ${jsKb} KB gz ≤ 30 KB`);
}

// ── Font budget ────────────────────────────────────────────────────────────
// Check public/fonts (source of truth); dist/fonts is a copy.
const woff2Files = collectFiles(path.join(PUBLIC, 'fonts'), '.woff2');
let totalFontRaw = 0;
for (const f of woff2Files) {
  totalFontRaw += rawSize(f);
}
const FONT_LIMIT = 80 * 1024;
const fontKb = (totalFontRaw / 1024).toFixed(1);
if (totalFontRaw > FONT_LIMIT) {
  console.error(`❌ Font budget exceeded: ${fontKb} KB raw (limit 80 KB)`);
  failed = true;
} else {
  console.log(`✓ Fonts: ${fontKb} KB raw ≤ 80 KB`);
}

process.exit(failed ? 1 : 0);
