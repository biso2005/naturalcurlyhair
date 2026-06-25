// Shared filesystem helpers. All paths resolve from the repo root.
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { ROOT } from './env.js';

export function fromRoot(...parts: string[]): string {
  return resolve(ROOT, ...parts);
}

export function readJson<T>(relPath: string): T {
  return JSON.parse(readFileSync(fromRoot(relPath), 'utf8')) as T;
}

export function writeJson(relPath: string, data: unknown): void {
  const p = fromRoot(relPath);
  mkdirSync(resolve(p, '..'), { recursive: true });
  writeFileSync(p, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

export function writeText(relPath: string, text: string): void {
  const p = fromRoot(relPath);
  mkdirSync(resolve(p, '..'), { recursive: true });
  writeFileSync(p, text, 'utf8');
}

export function readText(relPath: string): string {
  return readFileSync(fromRoot(relPath), 'utf8');
}

export const ARTICLES_DIR = 'src/content/articles';

// Returns absolute paths to every .mdx article.
export function listArticleFiles(): string[] {
  const dir = fromRoot(ARTICLES_DIR);
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => join(dir, f));
}

// kebab-case slug from a keyword or title.
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
