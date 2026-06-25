// Claude API client (direct fetch, no SDK dependency). Falls back to a
// template-based mock when ANTHROPIC_API_KEY is unset, so brief/pin generation
// runs offline. Model id comes from env (defaults to the latest Sonnet).
import { env, bannerMockMode } from './env.js';

const API_URL = 'https://api.anthropic.com/v1/messages';
const API_VERSION = '2023-06-01';

export interface ClaudeOptions {
  system?: string;
  maxTokens?: number;
  step?: string; // label for the cost ledger (e.g. 'brief', 'draft', 'pins')
}

export interface ClaudeResult {
  text: string;
  mock: boolean;
  inputTokens: number;
  outputTokens: number;
}

export async function callClaude(prompt: string, opts: ClaudeOptions = {}): Promise<ClaudeResult> {
  if (!env.anthropicKey) {
    return { text: '', mock: true, inputTokens: 0, outputTokens: 0 };
  }
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'x-api-key': env.anthropicKey,
      'anthropic-version': API_VERSION,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: env.anthropicModel,
      max_tokens: opts.maxTokens ?? 2048,
      system: opts.system,
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  if (!res.ok) {
    throw new Error(`Claude request failed: ${res.status} ${await res.text()}`);
  }
  const json = (await res.json()) as {
    content: Array<{ type: string; text?: string }>;
    usage?: { input_tokens?: number; output_tokens?: number };
  };
  const text = json.content
    .filter((b) => b.type === 'text')
    .map((b) => b.text ?? '')
    .join('');
  const inputTokens = json.usage?.input_tokens ?? 0;
  const outputTokens = json.usage?.output_tokens ?? 0;
  recordClaude(opts.step ?? 'claude', inputTokens, outputTokens);
  return { text, mock: false, inputTokens, outputTokens };
}

// --- Cost ledger -----------------------------------------------------------
// Accumulates per-step token usage and Serper calls across one process run so
// the Gate 2 walkthrough can report real per-article cost. Prices are the
// current Sonnet 4.6 published rates (USD per million tokens); update if rates
// change. Serper is a flat per-search credit cost.
const SONNET_INPUT_PER_MTOK = 3.0;
const SONNET_OUTPUT_PER_MTOK = 15.0;

interface StepCost {
  step: string;
  inputTokens: number;
  outputTokens: number;
  serperCalls: number;
}
const ledger: StepCost[] = [];

function entryFor(step: string): StepCost {
  let e = ledger.find((x) => x.step === step);
  if (!e) {
    e = { step, inputTokens: 0, outputTokens: 0, serperCalls: 0 };
    ledger.push(e);
  }
  return e;
}

function recordClaude(step: string, inTok: number, outTok: number): void {
  const e = entryFor(step);
  e.inputTokens += inTok;
  e.outputTokens += outTok;
}

export function recordSerper(step: string, calls = 1): void {
  entryFor(step).serperCalls += calls;
}

export function printCostLedger(): void {
  if (ledger.length === 0) return;
  console.log('\n── Cost ledger ──────────────────────────────');
  let totalUsd = 0;
  let totalSerper = 0;
  for (const e of ledger) {
    const usd =
      (e.inputTokens / 1e6) * SONNET_INPUT_PER_MTOK +
      (e.outputTokens / 1e6) * SONNET_OUTPUT_PER_MTOK;
    totalUsd += usd;
    totalSerper += e.serperCalls;
    console.log(
      `  ${e.step.padEnd(10)} in:${String(e.inputTokens).padStart(6)} ` +
        `out:${String(e.outputTokens).padStart(6)} ` +
        `serper:${e.serperCalls}  ≈ $${usd.toFixed(4)}`,
    );
  }
  console.log('  ' + '-'.repeat(42));
  console.log(
    `  Claude total ≈ $${totalUsd.toFixed(4)}  ` +
      `| Serper calls: ${totalSerper} (price per your Serper plan)`,
  );
  console.log('─────────────────────────────────────────────\n');
}

export function warnIfMock(tool: string, mock: boolean): void {
  if (mock) bannerMockMode(tool, 'ANTHROPIC_API_KEY not set');
}
