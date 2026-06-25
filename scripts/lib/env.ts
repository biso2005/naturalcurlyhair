// Minimal .env loader (no dependency). Reads .env from repo root if present,
// without overwriting variables already set in the real environment (CI).
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
export const ROOT = resolve(__dirname, '..', '..');

function loadDotEnv(): void {
  const path = resolve(ROOT, '.env');
  if (!existsSync(path)) return;
  for (const raw of readFileSync(path, 'utf8').split('\n')) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    const val = line.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
    if (!(key in process.env)) process.env[key] = val;
  }
}
loadDotEnv();

export const env = {
  serperKey: process.env.SERPER_API_KEY || '',
  anthropicKey: process.env.ANTHROPIC_API_KEY || '',
  anthropicModel: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-6',
};

export function bannerMockMode(tool: string, reason: string): void {
  console.warn(
    `\n  ⚠  ${tool}: MOCK MODE — ${reason}.\n     Output is placeholder copy. Set the key in .env for live results.\n`,
  );
}
