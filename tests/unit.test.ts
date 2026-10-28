import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { siteConfig, type SiteConfig } from '../src/config/site';
import { resolveLink } from '../src/lib/links';
import { isCheckoutReady, isSafeConfiguredLink, isSafePublicUrl, validatePublicConfig } from '../src/lib/validate-public-config';
import { APEX_TIMEFRAMES, calculateDemoCoverage, type DemoRecord } from '../src/lib/apex-rules';

const config = (): SiteConfig => structuredClone(siteConfig);
const previewConfig = (): SiteConfig => {
  const current = config();
  current.stage = 'preview';
  current.siteUrl = null;
  current.links.support = null;
  current.publication.productCopyApproved = false;
  current.publication.publicQuickStartApproved = false;
  current.publication.historicalExamplesApproved = false;
  current.publication.guideChartApproved = false;
  current.publication.legalAndPrivacyApproachApproved = false;
  return current;
};
const record = (timeframe: string, fields: Partial<DemoRecord> = {}): DemoRecord => ({ symbol: 'DEMO', direction: 'SELL', timeframe, hoursAgo: 24, ...fields });

test('the explicit preview fixture accepts intentionally missing business configuration', () => assert.deepEqual(validatePublicConfig(previewConfig(), 'preview'), []));
test('production rejects the preview fixture and unapproved public content', () => {
  const errors = validatePublicConfig(previewConfig(), 'production');
  assert.equal(errors.some(error => error.startsWith('links.discordInvite')), false);
  for (const key of ['stage', 'publication.productCopyApproved', 'publication.publicQuickStartApproved', 'publication.historicalExamplesApproved']) assert.ok(errors.some((error) => error.startsWith(key)), key);
});
test('the configured contact portal is deployable without an invented domain, support URL or price', () => {
  const current = config();
  current.siteUrl = null;
  current.links.support = null;
  assert.equal(current.stage, 'production');
  assert.equal(current.accessMode, 'contact');
  assert.equal(current.membership.price, null);
  assert.equal(current.publication.legalAndPrivacyApproachApproved, false);
  assert.deepEqual(validatePublicConfig(current, 'production'), []);
  assert.equal(isCheckoutReady(current), false);
});
test('an unconfigured public support destination is omitted', () => {
  const current = config();
  current.links.support = null;
  for (const locale of ['en', 'zh'] as const) {
    const link = resolveLink(current, 'support', locale);
    assert.equal(link.kind, 'unavailable');
    if (link.kind === 'unavailable') assert.equal(link.hidden, true);
  }
});
test('missing invite is unavailable and has an explicit reason', () => {
  for (const locale of ['en', 'zh'] as const) {
    const missing = config();
    missing.links.discordInvite = null;
    const link = resolveLink(missing, 'discordInvite', locale);
    assert.equal(link.kind, 'unavailable');
    if (link.kind === 'unavailable') assert.ok(link.reason.length > 10);
  }
});
test('owner-provided invitation resolves to the exact shared destination', () => {
  for (const locale of ['en', 'zh'] as const) {
    assert.deepEqual(resolveLink(config(), 'discordInvite', locale), { kind: 'external', href: 'https://discord.gg/RxEH3E73J' });
  }
});

test('console fallback preserves language and real anchor', () => {
  assert.deepEqual(resolveLink(config(), 'subscriptionConsole', 'en'), { kind: 'internal', href: '/start#existing-members' });
  assert.deepEqual(resolveLink(config(), 'subscriptionConsole', 'zh'), { kind: 'internal', href: '/zh/start#existing-members' });
});
test('other missing business information uses substantive local explanations', () => {
  assert.deepEqual(resolveLink(config(), 'tradingViewIndicator', 'zh'), { kind: 'internal', href: '/zh/start#tradingview' });
  assert.deepEqual(resolveLink(config(), 'watchlist', 'en'), { kind: 'internal', href: '/start#supported-symbols' });
});
test('missing optional social links are hidden', () => {
  for (const key of ['socialX', 'socialYoutube', 'socialReddit'] as const) {
    const link = resolveLink(config(), key, 'en');
    assert.equal(link.kind, 'unavailable');
    if (link.kind === 'unavailable') assert.equal(link.hidden, true);
  }
});
test('missing historical source shows permission explanation without href', () => {
  const link = resolveLink(config(), 'historicalSources.apex', 'en');
  assert.equal(link.kind, 'unavailable');
  assert.equal('href' in link, false);
});
test('a configured member source retains membership context', () => {
  const current = config();
  // Synthetic numeric IDs are test fixtures only, never shipped in site configuration.
  current.historicalSources.apex = 'https://discord.com/channels/123/456/789';
  assert.deepEqual(resolveLink(current, 'historicalSources.apex', 'en'), { kind: 'external', href: current.historicalSources.apex, memberOnly: true });
});
test('dangerous protocols, credentials, placeholders and webhooks are rejected', () => {
  for (const value of ['javascript:alert(1)', 'data:text/html,a', 'file:///etc/passwd', 'http://discord.com', '//discord.com', '#', 'https://example.com', 'https://user:secret@discord.com', 'https://discord.com/api/webhooks/123/secret', 'https://discord.com/api/v10/webhooks/123/secret', 'https://discord.com/%61pi/webhooks/123/secret', 'https://discord.com/\\evil', 'https://discord.com/%0aevil', 'https://discord.com/%zz']) assert.equal(isSafePublicUrl(value), false, value);
});
test('competitor destinations cannot become EMP business links', () => {
  for (const value of ['https://www.dreamtrade.com/', 'https://chartprime.com/', 'https://gapalgo.com/']) assert.equal(isSafePublicUrl(value), false);
});
test('only validated support email allows mailto', () => {
  assert.equal(isSafeConfiguredLink('support', 'mailto:support@emp-signals.test'), true);
  assert.equal(isSafeConfiguredLink('checkout', 'mailto:support@emp-signals.test'), false);
  assert.equal(isSafeConfiguredLink('support', 'mailto:support@emp-signals.test?bcc=hidden@elsewhere.test'), false);
});
test('Discord invitation and console destinations use appropriate routes', () => {
  assert.equal(isSafeConfiguredLink('discordInvite', 'https://discord.gg/test-fixture'), true);
  assert.equal(isSafeConfiguredLink('discordInvite', 'https://discord.com/channels/123/456'), false);
  assert.equal(isSafeConfiguredLink('subscriptionConsole', 'https://discord.com/channels/123/456'), true);
  assert.equal(isSafeConfiguredLink('subscriptionConsole', 'https://discord.gg/test-fixture'), false);
});
test('configured malformed URLs fail preview validation as well', () => {
  const current = previewConfig();
  current.links.support = 'javascript:alert(1)';
  assert.ok(validatePublicConfig(current, 'preview').some((error) => error.startsWith('links.support')));
  assert.equal(resolveLink(current, 'support', 'en').kind, 'unavailable');
});
test('checkout cannot expose incomplete prices or payments', () => {
  const current = config();
  current.accessMode = 'checkout';
  current.membership.price = 42;
  assert.equal(isCheckoutReady(current), false);
  const link = resolveLink(current, 'checkout', 'en');
  assert.equal(link.kind, 'unavailable');
  if (link.kind === 'unavailable') assert.equal(link.hidden, true);
  assert.ok(validatePublicConfig(current, 'production').some((error) => error.startsWith('membership / checkout')));
});
test('checkout requires every verified field and policy, even when a link exists', () => {
  const current = config();
  current.accessMode = 'checkout';
  // Syntactic test-only URL; this is never a real payment destination or product price.
  current.links.checkout = 'https://checkout.emp-signals.test/fixture';
  current.links.terms = '/terms';
  current.links.privacy = '/privacy';
  current.publication.legalAndPrivacyApproachApproved = true;
  current.membership = { verified: true, label: 'TEST FIXTURE', price: 1, currency: 'USD', billingPeriod: 'month', includesTradingViewAccess: false, includesDiscordSignals: true, renewalAndCancellationCopyApproved: true, refundCopyApproved: true };
  assert.equal(isCheckoutReady(current), true);
  for (const key of ['verified', 'renewalAndCancellationCopyApproved', 'refundCopyApproved'] as const) {
    const incomplete = structuredClone(current);
    incomplete.membership[key] = false;
    assert.equal(isCheckoutReady(incomplete), false, key);
  }
  for (const price of [0, -1, NaN, Infinity]) {
    const incomplete = structuredClone(current);
    incomplete.membership.price = price;
    assert.equal(isCheckoutReady(incomplete), false, String(price));
  }
});
test('guide permission cannot be bypassed by filling a URL', () => {
  const current = config();
  current.links.publicGuide = 'https://discord.com/guide-fixture';
  assert.equal(resolveLink(current, 'publicGuide', 'en').kind, 'unavailable');
  assert.ok(validatePublicConfig(current, 'preview').some((error) => error.startsWith('links.publicGuide')));
});
test('unknown timezones cannot silently enter configuration', () => {
  const current = config();
  current.sourceTimezone = 'Unconfirmed/Timezone';
  assert.ok(validatePublicConfig(current, 'preview').some((error) => error.startsWith('sourceTimezone')));
});
test('new capabilities cannot be enabled by configuration alone', () => {
  const current = config();
  current.coverage.timeframeFilteringByUserConfirmed = true;
  current.analytics.enabled = true;
  const errors = validatePublicConfig(current, 'preview');
  assert.ok(errors.some((error) => error.startsWith('coverage.timeframeFilteringByUserConfirmed')));
  assert.ok(errors.some((error) => error.startsWith('analytics.enabled')));
});
test('three distinct timeframes do not reach the announced threshold', () => {
  const result = calculateDemoCoverage(['1H', '2H', '1D'].map((timeframe) => record(timeframe)), 'DEMO', 'SELL');
  assert.equal(result.coverage, 3);
  assert.equal(result.reachesAnnouncedThreshold, false);
  assert.equal(result.kind, 'illustrative');
});
for (const missing of APEX_TIMEFRAMES) test(`any four distinct timeframes qualify: missing ${missing}`, () => {
  const result = calculateDemoCoverage(APEX_TIMEFRAMES.filter((timeframe) => timeframe !== missing).map((timeframe) => record(timeframe)), 'DEMO', 'SELL');
  assert.equal(result.coverage, 4);
  assert.equal(result.reachesAnnouncedThreshold, true);
});
test('all five timeframes describe coverage rather than probability', () => {
  const result = calculateDemoCoverage(APEX_TIMEFRAMES.map((timeframe) => record(timeframe)), 'DEMO', 'SELL');
  assert.equal(result.coverage, 5);
  assert.equal('confidence' in result, false);
  assert.equal('winRate' in result, false);
});
test('repeated same-timeframe signals count once', () => assert.equal(calculateDemoCoverage(Array.from({ length: 5 }, () => record('1H')), 'DEMO', 'SELL').coverage, 1));
test('opposite directions cannot combine into one coverage result', () => {
  const rows = [record('1H', { direction: 'BUY' }), record('2H', { direction: 'BUY' }), record('3H', { direction: 'BUY' }), record('4H'), record('1D')];
  assert.equal(calculateDemoCoverage(rows, 'DEMO', 'BUY').coverage, 3);
  assert.equal(calculateDemoCoverage(rows, 'DEMO', 'SELL').coverage, 2);
});
test('different symbols cannot combine coverage', () => assert.equal(calculateDemoCoverage([record('1H'), record('2H'), record('3H', { symbol: 'OTHER' }), record('4H', { symbol: 'OTHER' }), record('1D', { symbol: 'OTHER' })], 'DEMO', 'SELL').coverage, 2));
test('out-of-window, future and unsupported-timeframe records are excluded', () => assert.equal(calculateDemoCoverage([record('1H', { hoursAgo: 167 }), record('2H', { hoursAgo: 169 }), record('3H', { hoursAgo: -1 }), record('1W'), record('5m')], 'DEMO', 'SELL').coverage, 1));
test('the demo refuses to invent the exact production time boundary', () => assert.throws(() => calculateDemoCoverage([record('1H', { hoursAgo: 168 })], 'DEMO', 'SELL'), RangeError));
test('replacement NVDA message and AAPL APEX evidence remain distinct from DEMO data', () => {
  const data = JSON.parse(readFileSync(new URL('../src/data/signal-examples.json', import.meta.url), 'utf8'));
  assert.equal(data.historical.ordinarySignal.symbol, 'NVDA');
  assert.equal(data.historical.ordinarySignal.direction, 'BUY');
  assert.equal(data.historical.ordinarySignal.timeframe, '1H');
  assert.equal(data.historical.ordinarySignal.signalPrice, 214.86);
  assert.ok(data.historical.ordinarySignal.sourceId);
  assert.equal(data.historical.symbol, 'AAPL');
  assert.equal(data.historical.direction, 'SELL');
  assert.equal(data.historical.ordinarySignal.priceLabel, 'Signal Price');
  assert.equal(data.historical.ordinarySignal.triggeredDisplay, '2026-10-26 22:30');
  assert.equal(data.historical.timezone, null);
  assert.equal(data.historical.apex.coverage, 5);
  assert.deepEqual(data.historical.apex.evidence.map((item: { recordedDisplay: string }) => item.recordedDisplay), ['2026-10-24 00:30', '2026-10-24 01:30', '2026-10-17 03:30', '2026-10-20 01:30', '2026-10-21 04:01']);
  for (const demo of data.illustrativeScenarios) {
    assert.equal(demo.kind, 'illustrative');
    assert.equal(demo.symbol, 'DEMO');
    assert.equal(new Set(demo.matchedTimeframes).size, demo.coverage);
  }
});
