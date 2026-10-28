import { test, expect, type Page, type TestInfo } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';

const locales = ['en', 'zh'] as const;
const views = [
  { width: 1440, height: 1000 }, { width: 1280, height: 900 },
  { width: 768, height: 1024 }, { width: 390, height: 844 },
  { width: 360, height: 800 }, { width: 320, height: 740 },
];
const evidence = [
  ['1H', '2026-10-24 00:30'], ['2H', '2026-10-24 01:30'],
  ['3H', '2026-10-17 03:30'], ['4H', '2026-10-20 01:30'],
  ['1D', '2026-10-21 04:01'],
];
const screenshotDirectory = path.resolve(process.env.EMP_TEST_SCREENSHOTS || 'qa/final');
const discordInvite = 'https://discord.gg/RxEH3E73J';
const chartAssets = { en: '/assets/approved/chart-en-goog.jpeg', zh: '/assets/approved/chart-zh-aapl.png' };
const home = (locale: string) => locale === 'zh' ? '/zh' : '/';
const prefix = (locale: string) => locale === 'zh' ? '/zh' : '';

async function attachJson(info: TestInfo, name: string, value: unknown) {
  await info.attach(name, { body: JSON.stringify(value, null, 2), contentType: 'application/json' });
}

function monitorPage(page: Page) {
  const errors: string[] = [];
  const failedResources: string[] = [];
  page.on('pageerror', error => errors.push(`pageerror: ${error.message}`));
  page.on('console', message => { if (message.type() === 'error') errors.push(`console.error: ${message.text()} (${message.location().url || 'unknown source'})`); });
  page.on('response', response => {
    if (response.status() >= 400 && response.url().startsWith(new URL(page.url()).origin)) {
      failedResources.push(`${response.status()} ${response.request().resourceType()} ${response.url()}`);
    }
  });
  return { errors, failedResources };
}

async function pageReady(page: Page) {
  await expect(page.locator('main h1')).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
}

async function assertNoOverflow(page: Page) {
  const overflow = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    document: document.documentElement.scrollWidth,
    offenders: [...document.querySelectorAll('main *, header *, footer *')]
      .filter(element => {
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        return rect.width > 0 && style.position !== 'absolute' && style.position !== 'fixed'
          && (rect.right > innerWidth + 1 || rect.left < -1);
      }).slice(0, 12).map(element => ({ tag: element.tagName, class: element.className, text: element.textContent?.slice(0, 90) })),
  }));
  expect(overflow.document, JSON.stringify(overflow)).toBeLessThanOrEqual(overflow.viewport + 1);
}

async function revealImages(page: Page) {
  await page.locator('#signals').scrollIntoViewIfNeeded();
  await page.waitForFunction(() => [...document.querySelectorAll<HTMLImageElement>('main img')]
    .filter(image => !image.closest('dialog')).every(image => image.complete && image.naturalWidth > 0));
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.waitForFunction(() => window.scrollY === 0);
}

test.beforeAll(async () => { await mkdir(screenshotDirectory, { recursive: true }); });

for (const locale of locales) {
  for (const viewport of views) {
    test(`${locale} ${viewport.width}x${viewport.height}: home, facts, resources and screenshots`, async ({ page, request }, info) => {
      await page.setViewportSize(viewport);
      const diagnostics = monitorPage(page);
      const response = await page.goto(home(locale));
      expect(response?.status()).toBe(200);
      await pageReady(page);
      await expect(page.locator('html')).toHaveAttribute('lang', locale === 'zh' ? 'zh-CN' : 'en');
      const raw = await request.get(home(locale));
      expect(await raw.text()).toMatch(new RegExp(`<html[^>]+lang="${locale === 'zh' ? 'zh-CN' : 'en'}"`));
      await expect(page.locator('#faq details')).toHaveCount(12);
      await expect(page.locator('.signal').first()).toContainText('BUY · NVDA · 1H');
      await expect(page.locator('.signal').first()).toContainText('Signal Price');
      await expect(page.locator('.signal').first()).toContainText('214.86');
      await expect(page.locator('.signal').first().locator('time[datetime="2026-10-26T22:30"]').first()).toBeVisible();
      await expect(page.locator('.apex-card').first()).toContainText('5/5');
      await expect(page.locator('.apex-card').first()).toContainText(/distinct timeframes|不同周期覆盖/);
      await expect(page.locator('.apex-card').first().locator('.tf > span')).toHaveText(['1H', '2H', '3H', '4H', '1D']);
      await expect(page.locator('.apex-card').first().locator('time[datetime="2026-10-17T01:30"]')).toBeVisible();
      await expect(page.locator('.apex-card').first().locator('time[datetime="2026-10-24T01:30"]').first()).toBeVisible();
      await expect(page.locator('.preview, .review-toolbar, .review-badge, .review-dialog')).toHaveCount(0);
      await expect(page.locator('.sample-label').first()).toContainText(locale === 'zh' ? '历史示例' : 'Historical example');
      await revealImages(page);
      await assertNoOverflow(page);
      await page.screenshot({ path: path.join(screenshotDirectory, `${locale}-${viewport.width}.png`), animations: 'disabled' });
      if (viewport.width === 1440 || viewport.width === 390) {
        await page.screenshot({ path: path.join(screenshotDirectory, `${locale}-${viewport.width}-full.png`), fullPage: true, animations: 'disabled' });
      }
      await attachJson(info, 'browser-diagnostics', diagnostics);
      expect(diagnostics.errors).toEqual([]);
      expect(diagnostics.failedResources).toEqual([]);
    });
  }

  test(`${locale}: evidence, illustrative coverage, FAQ and configured invitation`, async ({ page }) => {
    await page.goto(home(locale));
    await pageReady(page);
    const historicalBefore = await page.locator('.apex-card').allTextContents();
    const demo = page.locator('.rule-demo');
    for (const coverage of [3, 4, 5]) {
      const button = demo.getByRole('button', { name: `${coverage}/5`, exact: true });
      await button.click();
      await expect(button).toHaveAttribute('aria-pressed', 'true');
      await expect(demo.locator('.demo-result')).toContainText(`${coverage}/5`);
      await expect(demo.locator('.demo-tfs > span:not(.off)')).toHaveCount(coverage);
      await expect(demo).toContainText('DEMO / SELL');
      await expect(demo).toContainText(locale === 'zh' ? '不是真实历史通知' : 'not actual historical notifications');
      expect(await page.locator('.apex-card').allTextContents()).toEqual(historicalBefore);
    }
    await page.locator('#apex-evidence summary').click();
    await expect(page.locator('#apex-evidence')).toHaveAttribute('open', '');
    for (const [frame, date] of evidence) {
      const row = page.locator('.evidence-table tbody tr').filter({ has: page.getByRole('rowheader', { name: `${frame} · SELL`, exact: true }) });
      await expect(row.getByRole('cell')).toHaveText(date);
    }
    await expect(page.locator('#apex-evidence')).toContainText(locale === 'zh' ? /时区(?:尚)?未确认/ : /Timezone unconfirmed|timezone has not been confirmed/);
    await expect(page.locator('#apex-evidence')).toContainText(locale === 'zh' ? '源消息仅在成员环境中提供' : 'Source available in the member environment');
    await expect(page.locator('#apex-evidence a')).toHaveCount(0);
    const firstFaq = page.locator('#faq details').first();
    await firstFaq.locator('summary').focus();
    await page.keyboard.press('Enter');
    await expect(firstFaq).toHaveAttribute('open', '');
    await expect(firstFaq.locator('p')).toBeVisible();
    const invitations = page.locator(`a[href="${discordInvite}"]`);
    expect(await invitations.count()).toBeGreaterThanOrEqual(3);
    for (const link of await invitations.all()) {
      await expect(link).toContainText(locale === 'zh' ? '加入 Discord' : 'Join Discord');
      await expect(link).toHaveAttribute('target', '_blank');
      await expect(link).toHaveAttribute('rel', /noopener/);
      await expect(link).toHaveAttribute('rel', /noreferrer/);
    }
    await expect(page.getByRole('button', { name: locale === 'zh' ? '加入 Discord' : 'Join Discord', exact: true })).toHaveCount(0);
    await expect(page.locator('.hero .unavailable-note')).toHaveCount(0);
    await expect(page.locator('.preview')).toHaveCount(0);
    await expect(page.locator('.signal a[href^="http"], .apex-card a[href^="http"]')).toHaveCount(0);
    await expect(page.locator('a[href="#"], a[href^="javascript:"], a[href^="data:"], a[href^="file:"]')).toHaveCount(0);
    await expect(page.locator('.optional-links a')).toHaveCount(0);
    await expect(page.locator('a[href*="discord.com/api/webhooks"]')).toHaveCount(0);
  });

  test(`${locale}: mobile menu works with keyboard and Escape`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(home(locale));
    await pageReady(page);
    const menu = page.locator('.mobile-menu');
    await menu.focus();
    await page.keyboard.press('Enter');
    await expect(menu).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('#mobile-nav')).toBeVisible();
    await page.keyboard.press('Tab');
    await expect(page.locator('#mobile-nav a').first()).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(menu).toHaveAttribute('aria-expanded', 'false');
    await expect(menu).toBeFocused();
    await expect(page.locator('#mobile-nav')).toBeHidden();
    await menu.click();
    await page.locator('#mobile-nav').getByRole('link', { name: 'APEX', exact: false }).click();
    await expect(page).toHaveURL(new RegExp(`${locale === 'zh' ? '/zh' : '/'}#apex$`));
    await expect(menu).toHaveAttribute('aria-expanded', 'false');
  });

  test(`${locale}: console fallback preserves locale and reaches guidance`, async ({ page }) => {
    await page.goto(home(locale));
    const consoleLink = page.locator('#delivery').getByRole('link', { name: locale === 'zh' ? /打开订阅控制台/ : /Open subscription console/ });
    await expect(consoleLink).toHaveAttribute('href', `${prefix(locale)}/start#existing-members`);
    await consoleLink.click();
    await expect(page).toHaveURL(new RegExp(`${prefix(locale)}/start#existing-members$`));
    await expect(page.locator('#existing-members')).toBeVisible();
    await expect(page.locator('#existing-members')).toContainText('MySubscriptions');
  });

  test(`${locale}: deployed chart uses its approved local asset and native dialog`, async ({ page }) => {
    await page.goto(home(locale));
    await pageReady(page);
    const opener = page.locator('.chart-open');
    await expect(opener).toHaveAccessibleName(locale === 'zh' ? /AAPL 历史图表/ : /GOOG historical chart/);
    await expect(opener.locator('img')).toHaveAttribute('alt', locale === 'zh' ? /AAPL/ : /GOOG/);
    await expect(opener.locator('img')).toHaveAttribute('src', chartAssets[locale]);
    await opener.click();
    const dialog = page.locator('.chart-dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.locator('img')).toHaveAttribute('src', chartAssets[locale]);
    await expect(dialog).toContainText(locale === 'zh' ? '历史' : /historical/i);
    await expect(dialog).not.toContainText(/尚未批准公开|Publication not approved/);
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(opener).toBeFocused();
    await expect(page.locator('img[src^="/api/preview-chart"]')).toHaveCount(0);
  });

  test(`${locale}: reduced motion and 200 percent CSS zoom`, async ({ page }, info) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(home(locale));
    await pageReady(page);
    expect(await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches)).toBe(true);
    expect(await page.locator('html').evaluate(element => getComputedStyle(element).scrollBehavior)).toBe('auto');
    await page.evaluate(() => { document.documentElement.style.zoom = '2'; });
    await expect(page.locator('h1')).toBeVisible();
    await page.locator('#apex-evidence summary').click();
    await expect(page.locator('.evidence-table')).toBeVisible();
    await assertNoOverflow(page);
    await page.screenshot({ path: path.join(screenshotDirectory, `${locale}-css-zoom-200.png`), fullPage: true, animations: 'disabled' });
    await attachJson(info, 'zoom-method', { method: 'CSS zoom: 2', nativeBrowserZoom: 'Not measured by this automated test', limitation: 'CSS zoom checks magnified layout; it is not a claim of native browser zoom or a manual screen-reader audit.' });
  });
}

for (const route of ['', '/start', '/risk']) {
  test(`language switch keeps route ${route || '/'} and fragment`, async ({ page }) => {
    const fragment = route === '/start' ? '#existing-members' : route === '/risk' ? '#risk-1' : '#apex';
    await page.goto(`${route || '/'}${fragment}`);
    await page.locator('.lang').click();
    await expect(page).toHaveURL(new RegExp(`/zh${route}${fragment}$`));
    await expect(page.locator('html')).toHaveAttribute('lang', 'zh-CN');
    await page.locator('.lang').click();
    await expect(page).toHaveURL(new RegExp(`${route || '/'}${fragment}$`));
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });
}

for (const locale of locales) {
  for (const route of ['', '/start', '/risk']) {
    const location = `${prefix(locale)}${route}` || '/';
    test(`${location}: core content without JavaScript and unconfigured-domain SEO`, async ({ browser, baseURL }) => {
      const context = await browser.newContext({ javaScriptEnabled: false, baseURL, viewport: { width: 390, height: 844 } });
      try {
        const page = await context.newPage();
        const response = await page.goto(location);
        expect(response?.status()).toBe(200);
        await expect(page.locator('main h1')).toBeVisible();
        await expect(page.locator('html')).toHaveAttribute('lang', locale === 'zh' ? 'zh-CN' : 'en');
        await expect(page.locator('footer')).toContainText(locale === 'zh' ? '不构成投资建议' : 'not investment advice');
        await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
        await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
        await expect(page.locator('link[hreflang]')).toHaveCount(0);
        if (!route) {
          await expect(page.locator('#faq details')).toHaveCount(12);
          await page.locator('#apex-evidence summary').click();
          await expect(page.locator('.evidence-table')).toBeVisible();
          await expect(page.locator('.signal').first().locator('time[datetime="2026-10-26T22:30"]').first()).toBeVisible();
        } else {
          await expect(page.locator('.doc-section').first()).toBeVisible();
          expect((await page.locator('main').innerText()).length).toBeGreaterThan(300);
        }
        await assertNoOverflow(page);
      } finally { await context.close(); }
    });

    test(`${location}: automated accessibility audit`, async ({ page }, info) => {
      await page.goto(location);
      await pageReady(page);
      const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
      await attachJson(info, 'axe-results', { url: location, violations: result.violations, incomplete: result.incomplete, passes: result.passes.length });
      expect(result.violations, JSON.stringify(result.violations.map(item => ({ id: item.id, impact: item.impact, nodes: item.nodes.map(node => node.target) })))).toEqual([]);
    });
  }
}

test('robots await the real domain and missing routes return a genuine 404', async ({ page, request }) => {
  const robots = await request.get('/robots.txt');
  expect(robots.status()).toBe(200);
  expect(await robots.text()).toContain('Disallow: /');
  expect(await robots.text()).not.toContain('Sitemap:');
  const sitemap = await request.get('/sitemap.xml');
  expect(sitemap.status()).toBe(200);
  expect(await sitemap.text()).not.toContain('<loc>');
  const response = await page.goto('/this-route-does-not-exist');
  expect(response?.status()).toBe(404);
  await expect(page.locator('main')).toContainText('404');
  await expect(page.getByRole('link', { name: 'English home', exact: true })).toHaveAttribute('href', '/');
  await expect(page.getByRole('link', { name: '中文首页', exact: true })).toHaveAttribute('href', '/zh');
  await expect(page.getByRole('button', { name: 'Contact support', exact: true })).toHaveCount(0);
});


test('deployment serves only the selected standalone assets and has no local preview API', async ({ request }) => {
  const manifestResponse = await request.get('/assets/approved/manifest.json');
  expect(manifestResponse.status()).toBe(200);
  const manifest = await manifestResponse.json() as { assets: { path: string; sha256?: string; publicationApproved: boolean }[] };
  const english = await request.get(chartAssets.en);
  const chinese = await request.get(chartAssets.zh);
  const avatar = await request.get('/assets/approved/bot-avatar-reference.png');
  for (const [url, response] of [[chartAssets.en, english], [chartAssets.zh, chinese], ['/assets/approved/bot-avatar-reference.png', avatar]] as const) {
    expect(response.status(), url).toBe(200);
    const asset = manifest.assets.find(item => item.path === url);
    expect(asset?.publicationApproved, url).toBe(true);
    expect(createHash('sha256').update(await response.body()).digest('hex'), url).toBe(asset?.sha256);
  }
  expect(english.headers()['content-type']).toContain('image/jpeg');
  expect(chinese.headers()['content-type']).toContain('image/png');
  expect(avatar.headers()['content-type']).toContain('image/png');
  const chineseBytes = await chinese.body();
  expect(chineseBytes.subarray(0, 8).toString('hex')).toBe('89504e470d0a1a0a');
  expect([chineseBytes.readUInt32BE(16), chineseBytes.readUInt32BE(20)]).toEqual([2236, 1486]);
  expect((await english.body()).equals(chineseBytes)).toBe(false);
  for (const url of ['/api/preview-chart', '/api/preview-chart?locale=en', '/api/preview-chart?locale=zh', '/api/preview-chart?asset=signal-reference', '/qa/review-inputs/chart-zh-aapl.png', '/EMP_Portal_Handoff/assets/private-reference/guide-p7-chart.jpeg']) {
    expect((await request.get(url)).status(), url).toBe(404);
  }
});

test('all deployed pages and loaded scripts omit local annotation tools and private resource references', async ({ page, request }) => {
  const scriptUrls = new Set<string>();
  for (const location of ['/', '/zh', '/start', '/zh/start', '/risk', '/zh/risk']) {
    await page.goto(location);
    await pageReady(page);
    await expect(page.locator('.preview, .review-toolbar, .review-badge, .review-dialog, .review-optional, [data-review-id]')).toHaveCount(0);
    await expect(page.getByRole('button', { name: /替换编号|Replacement number|编号清单|隐藏编号|Show numbers|Hide numbers/ })).toHaveCount(0);
    const html = await page.content();
    expect(html).not.toMatch(/INTERNAL PREVIEW|本地预览审阅工具|Local preview review tools|\/api\/preview-chart|EMP_Portal_Handoff|\/qa\/review-inputs/);
    for (const url of await page.locator('script[src]').evaluateAll(elements => elements.map(element => (element as HTMLScriptElement).src))) scriptUrls.add(url);
    if (location === '/' || location === '/zh') {
      const images = await page.locator('main img').evaluateAll(elements => elements.map(element => element.getAttribute('src')));
      expect(images.length).toBeGreaterThan(0);
      expect(images.every(src => src?.startsWith('/assets/approved/'))).toBe(true);
      expect(await page.locator('.discord-avatar').first().evaluate(element => getComputedStyle(element).backgroundImage)).toContain('/assets/approved/bot-avatar-reference.png');
    }
  }
  expect(scriptUrls.size).toBeGreaterThan(0);
  for (const url of scriptUrls) {
    const script = await request.get(url);
    expect(script.status()).toBe(200);
    expect(await script.text(), url).not.toMatch(/review-toolbar|review-badge|本地预览审阅工具|Local preview review tools|\/api\/preview-chart|EMP_Portal_Handoff|\/qa\/review-inputs/);
  }
});
