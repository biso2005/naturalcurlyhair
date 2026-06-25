// Gate 2 pre-flight: confirm both API keys authenticate with a single trivial
// call each, BEFORE spending a real walkthrough on auth failures.
//   pnpm run auth-test
// Exits 0 only if both keys are present AND a minimal live call succeeds.
import { env } from './lib/env.js';

async function testSerper(): Promise<boolean> {
  if (!env.serperKey) {
    console.error('✗ SERPER_API_KEY not set in .env');
    return false;
  }
  try {
    const res = await fetch('https://google.serper.dev/search', {
      method: 'POST',
      headers: { 'X-API-KEY': env.serperKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: 'test', gl: 'gb', num: 1 }),
    });
    if (!res.ok) {
      console.error(`✗ Serper auth failed: HTTP ${res.status} ${res.statusText}`);
      return false;
    }
    const json = (await res.json()) as { organic?: unknown[] };
    console.log(`✓ Serper OK (returned ${json.organic?.length ?? 0} result(s) for a 1-result probe)`);
    return true;
  } catch (e) {
    console.error('✗ Serper request threw:', e instanceof Error ? e.message : String(e));
    return false;
  }
}

async function testClaude(): Promise<boolean> {
  if (!env.anthropicKey) {
    console.error('✗ ANTHROPIC_API_KEY not set in .env');
    return false;
  }
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': env.anthropicKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: env.anthropicModel,
        max_tokens: 5,
        messages: [{ role: 'user', content: 'Reply with the single word: ok' }],
      }),
    });
    if (!res.ok) {
      console.error(`✗ Claude auth failed: HTTP ${res.status} — ${await res.text()}`);
      return false;
    }
    const json = (await res.json()) as { content: Array<{ text?: string }>; usage?: unknown };
    const text = json.content.map((b) => b.text ?? '').join('').trim();
    console.log(`✓ Claude OK (model ${env.anthropicModel}, replied: "${text}")`);
    return true;
  } catch (e) {
    console.error('✗ Claude request threw:', e instanceof Error ? e.message : String(e));
    return false;
  }
}

async function main(): Promise<void> {
  console.log('\nGate 2 pre-flight — testing API keys with trivial calls…\n');
  const [serper, claude] = await Promise.all([testSerper(), testClaude()]);
  console.log();
  if (serper && claude) {
    console.log('✓ Both keys authenticated. Cleared for the real walkthrough.\n');
    process.exit(0);
  }
  console.error('✗ One or more keys failed. Fix .env before running the walkthrough.\n');
  process.exit(1);
}

main();
