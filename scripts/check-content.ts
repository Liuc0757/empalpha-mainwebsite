import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = process.cwd();
const data = JSON.parse(readFileSync(join(root, 'src', 'data', 'signal-examples.json'), 'utf8'));
const historical = data.historical;
const errors: string[] = [];
const check = (name: string, run: () => void) => { try { run(); } catch (error) { errors.push(`${name}: ${String(error)}`); } };
check('Historical source and display facts', () => {
  assert.equal(historical.kind, 'historical');
  assert.equal(typeof historical.sourceId, 'string');
  assert.ok(historical.sourceId.length > 0);
  assert.equal(typeof historical.publicationApproved, 'boolean');
  assert.equal(historical.symbol, 'AAPL');
  assert.equal(historical.direction, 'SELL');
  assert.equal(historical.timezone, null, 'Keep the original sample timezone unconfirmed; verified display context belongs in configuration.');
  assert.equal(historical.ordinarySignal.symbol, 'NVDA');
  assert.equal(historical.ordinarySignal.direction, 'BUY');
  assert.equal(historical.ordinarySignal.timeframe, '1H');
  assert.equal(typeof historical.ordinarySignal.sourceId, 'string');
  assert.ok(historical.ordinarySignal.sourceId.length > 0);
  assert.equal(historical.ordinarySignal.priceLabel, 'Signal Price');
  assert.equal(historical.ordinarySignal.signalPrice, 214.86);
  assert.equal(historical.ordinarySignal.triggeredDisplay, '2026-10-26 22:30');
  assert.equal(historical.apex.coverage, 5);
  assert.equal(historical.apex.totalTimeframes, 5);
  assert.equal(historical.apex.rollingWindowHours, 168);
  assert.deepEqual(historical.apex.matchedTimeframes, ['1H', '2H', '3H', '4H', '1D']);
  assert.equal(historical.apex.windowStartDisplay, '2026-10-17 01:30');
  assert.equal(historical.apex.windowEndDisplay, '2026-10-24 01:30');
  assert.deepEqual(historical.apex.evidence.map((item: { timeframe: string; recordedDisplay: string }) => [item.timeframe, item.recordedDisplay]), [
    ['1H', '2026-10-24 00:30'], ['2H', '2026-10-24 01:30'], ['3H', '2026-10-17 03:30'], ['4H', '2026-10-20 01:30'], ['1D', '2026-10-21 04:01'],
  ]);
  assert.equal(historical.ordinarySignal.sourceUrl, null, 'Business source URLs belong in centralized configuration.');
  assert.equal(historical.apex.sourceUrl, null, 'Business source URLs belong in centralized configuration.');
});
check('Illustrative examples remain distinct', () => {
  assert.deepEqual(data.illustrativeScenarios.map((item: { coverage: number }) => item.coverage), [3, 4, 5]);
  for (const demo of data.illustrativeScenarios) {
    assert.equal(demo.kind, 'illustrative');
    assert.equal(demo.sourceId, 'D');
    assert.equal(typeof demo.publicationApproved, 'boolean');
    assert.equal(demo.timezone, null);
    assert.equal(demo.symbol, 'DEMO');
    assert.equal(demo.direction, 'SELL');
    assert.equal(new Set(demo.matchedTimeframes).size, demo.coverage);
    assert.equal(demo.reachesAnnouncedThreshold, demo.coverage >= 4);
    assert.ok(demo.matchedTimeframes.every((timeframe: string) => ['1H', '2H', '3H', '4H', '1D'].includes(timeframe)));
  }
});
const walk = (directory: string): string[] => readdirSync(directory, { withFileTypes: true }).flatMap((entry) => entry.isDirectory() ? walk(join(directory, entry.name)) : [join(directory, entry.name)]);
const sourceFiles = walk(join(root, 'src')).filter((file) => /\.(?:tsx|ts|json)$/.test(file) && !/[\\/]config[\\/]|[\\/]lib[\\/]/.test(file));
for (const file of sourceFiles) {
  const contents = readFileSync(file, 'utf8');
  const display = relative(root, file);
  if (/href\s*=\s*["'](?:https?:|mailto:)|href\s*:\s*["'](?:https?:|mailto:)/i.test(contents)) errors.push(`${display}: external destinations must come from centralized configuration.`);
  if (/href\s*=\s*["'](?:#|javascript:[^"']*)["']/i.test(contents)) errors.push(`${display}: empty or unsafe link destination.`);
  if (/https?:\/\/(?:www\.)?(?:dreamtrade\.com|chartprime\.com|gapalgo\.com)/i.test(contents)) errors.push(`${display}: research destinations are not EMP business links.`);
  if (/EMP\s+(?:guarantees\s+(?:profits|returns)|predicts\s+future\s+prices|automatically\s+executes\s+trades)|(?:99|100)%\s+win\s+rate|500\+\s+(?:symbols|members|subscribers)/i.test(contents)) errors.push(`${display}: unsupported promotional assertion.`);
  if (/\b(?:localStorage|sessionStorage)\.(?:setItem|removeItem)|\bWebSocket\s*\(|discord\.com\/api\//.test(contents)) errors.push(`${display}: persistent input or live-service integration is outside the V1 presentation scope.`);
}
if (errors.length) {
  console.error(`Content check failed (${errors.length}):\n${errors.map((error) => `- ${error}`).join('\n')}`);
  process.exitCode = 1;
} else console.log(`Content check passed: exact NVDA signal and AAPL APEX history, separated DEMO cases and ${sourceFiles.length} source files checked. This automated scan supplements manual bilingual content review.`);
