// Serper.dev client with a mock fallback. When SERPER_API_KEY is unset, returns
// a deterministic mock SERP so the brief generator runs end-to-end offline.
import { env, bannerMockMode } from './env.js';
import { recordSerper } from './claude.js';

export interface SerpResult {
  title: string;
  link: string;
  snippet: string;
  position: number;
}

export interface SerpData {
  keyword: string;
  organic: SerpResult[];
  peopleAlsoAsk: string[];
  mock: boolean;
}

export async function fetchSerp(keyword: string): Promise<SerpData> {
  if (!env.serperKey) {
    bannerMockMode('brief-generator', 'SERPER_API_KEY not set');
    return mockSerp(keyword);
  }
  const res = await fetch('https://google.serper.dev/search', {
    method: 'POST',
    headers: { 'X-API-KEY': env.serperKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({ q: keyword, gl: 'gb', hl: 'en', num: 10 }),
  });
  if (!res.ok) {
    throw new Error(`Serper request failed: ${res.status} ${res.statusText}`);
  }
  recordSerper('brief', 1);
  const json = (await res.json()) as {
    organic?: Array<{ title: string; link: string; snippet?: string; position?: number }>;
    peopleAlsoAsk?: Array<{ question: string }>;
  };
  return {
    keyword,
    organic: (json.organic ?? []).slice(0, 10).map((r, idx) => ({
      title: r.title,
      link: r.link,
      snippet: r.snippet ?? '',
      position: r.position ?? idx + 1,
    })),
    peopleAlsoAsk: (json.peopleAlsoAsk ?? []).map((p) => p.question),
    mock: false,
  };
}

function mockSerp(keyword: string): SerpData {
  const organic: SerpResult[] = Array.from({ length: 10 }, (_, i) => ({
    title: `${keyword} — result ${i + 1} (mock)`,
    link: `https://example.com/${i + 1}`,
    snippet: `Placeholder snippet about ${keyword}. Top results average ~1,800 words and most include a comparison table and an FAQ.`,
    position: i + 1,
  }));
  return {
    keyword,
    organic,
    peopleAlsoAsk: [
      `What is the best way to handle ${keyword}?`,
      `How often should you ${keyword}?`,
      `Is ${keyword} different for fine hair?`,
      `What products help with ${keyword}?`,
    ],
    mock: true,
  };
}
