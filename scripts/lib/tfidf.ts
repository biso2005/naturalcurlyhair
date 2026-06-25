// Simple TF-IDF relevance scoring for the internal link injector (Tool 2).
// No external dependency — exactly the "simple TF-IDF" the handover specifies.

const STOPWORDS = new Set(
  ('a an and the is are was were be been to of for in on at by with from this that ' +
    'it its your you our we as or if then so do does how what why when which who ' +
    'about into over under more most very can will just not no yes my me i')
    .split(' '),
);

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 2 && !STOPWORDS.has(t));
}

export interface TfidfDoc {
  id: string;
  tokens: string[];
}

// Build IDF over the corpus, then score doc-to-doc cosine similarity.
export function buildSimilarity(docs: TfidfDoc[]): Map<string, Map<string, number>> {
  const df = new Map<string, number>();
  for (const doc of docs) {
    for (const term of new Set(doc.tokens)) df.set(term, (df.get(term) ?? 0) + 1);
  }
  const N = docs.length;
  const idf = (term: string) => Math.log((N + 1) / ((df.get(term) ?? 0) + 1)) + 1;

  const vectors = new Map<string, Map<string, number>>();
  for (const doc of docs) {
    const tf = new Map<string, number>();
    for (const t of doc.tokens) tf.set(t, (tf.get(t) ?? 0) + 1);
    const vec = new Map<string, number>();
    for (const [t, c] of tf) vec.set(t, (c / doc.tokens.length) * idf(t));
    vectors.set(doc.id, vec);
  }

  const sim = new Map<string, Map<string, number>>();
  for (const a of docs) {
    const row = new Map<string, number>();
    for (const b of docs) {
      if (a.id === b.id) continue;
      row.set(b.id, cosine(vectors.get(a.id)!, vectors.get(b.id)!));
    }
    sim.set(a.id, row);
  }
  return sim;
}

function cosine(a: Map<string, number>, b: Map<string, number>): number {
  let dot = 0;
  for (const [t, av] of a) {
    const bv = b.get(t);
    if (bv) dot += av * bv;
  }
  const magA = Math.sqrt([...a.values()].reduce((s, v) => s + v * v, 0));
  const magB = Math.sqrt([...b.values()].reduce((s, v) => s + v * v, 0));
  if (magA === 0 || magB === 0) return 0;
  return dot / (magA * magB);
}
