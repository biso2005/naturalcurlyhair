// Tiny YAML-frontmatter reader/writer for MDX articles. Handles the subset our
// schema uses: strings, booleans, numbers, dates, and simple string arrays
// (both inline [a, b] and block "- a" forms). Avoids a YAML dependency.

export interface ParsedDoc {
  data: Record<string, unknown>;
  body: string;
}

export function parseFrontmatter(raw: string): ParsedDoc {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return { data: {}, body: raw };
  const [, fm, body] = match;
  return { data: parseYamlish(fm), body };
}

function parseYamlish(fm: string): Record<string, unknown> {
  const data: Record<string, unknown> = {};
  const lines = fm.split('\n');
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i++;
      continue;
    }
    const m = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (!m) {
      i++;
      continue;
    }
    const key = m[1];
    const rest = m[2];
    if (rest === '') {
      // Could be a block list following on indented lines.
      const arr: string[] = [];
      let j = i + 1;
      while (j < lines.length && /^\s+-\s+/.test(lines[j])) {
        arr.push(coerceScalar(lines[j].replace(/^\s+-\s+/, '').trim()) as string);
        j++;
      }
      data[key] = arr;
      i = j;
    } else if (rest.startsWith('[')) {
      data[key] = rest
        .replace(/^\[|\]$/g, '')
        .split(',')
        .map((s) => coerceScalar(s.trim()))
        .filter((s) => s !== '');
      i++;
    } else {
      data[key] = coerceScalar(rest);
      i++;
    }
  }
  return data;
}

function coerceScalar(v: string): unknown {
  const unq = v.replace(/^["']|["']$/g, '');
  if (unq === 'true') return true;
  if (unq === 'false') return false;
  if (/^-?\d+$/.test(unq)) return Number(unq);
  return unq;
}

// Serialize a small frontmatter object back to YAML for generated briefs/drafts.
export function stringifyFrontmatter(data: Record<string, unknown>): string {
  const out: string[] = ['---'];
  for (const [k, v] of Object.entries(data)) {
    if (Array.isArray(v)) {
      if (v.length === 0) {
        out.push(`${k}: []`);
      } else {
        out.push(`${k}:`);
        for (const item of v) out.push(`  - "${String(item)}"`);
      }
    } else if (typeof v === 'string') {
      out.push(`${k}: "${v.replace(/"/g, '\\"')}"`);
    } else {
      out.push(`${k}: ${String(v)}`);
    }
  }
  out.push('---');
  return out.join('\n');
}
