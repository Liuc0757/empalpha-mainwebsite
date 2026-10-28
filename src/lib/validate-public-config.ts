import type { SiteConfig } from '../config/site';

type UrlOptions = { allowMailto?: boolean; allowInternal?: boolean };
const forbiddenHosts = ['dreamtrade.com', 'chartprime.com', 'gapalgo.com'];

/** Public destinations only: never credentials, integration endpoints or research references. */
export function isSafePublicUrl(value: string, options: UrlOptions = {}): boolean {
  if (!value || value.trim() !== value || [...value].some((character) => character.charCodeAt(0) <= 32 || character.charCodeAt(0) === 127 || character === '\\')) return false;
  let decoded: string;
  try { decoded = decodeURIComponent(value); } catch { return false; }
  if ([...decoded].some((character) => character.charCodeAt(0) < 32 || character.charCodeAt(0) === 127 || character === '\\') || /\/api(?:\/v\d+)?\/webhooks\//i.test(decoded)) return false;
  if (options.allowInternal && /^\/(?:zh\/)?(?:terms|privacy)\/?(?:#[a-z0-9-]+)?$/i.test(value)) return true;
  if (options.allowMailto && /^mailto:[A-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9](?:[A-Z0-9.-]*[A-Z0-9])?\.[A-Z]{2,}$/i.test(value)) return true;
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' || url.username || url.password) return false;
    if (!url.hostname.includes('.') || /^(?:localhost|127\.|0\.|\[?::1)/i.test(url.hostname)) return false;
    if (['example.com', 'example.org', 'example.net'].some((host) => url.hostname === host || url.hostname.endsWith(`.${host}`))) return false;
    if (forbiddenHosts.some((host) => url.hostname === host || url.hostname.endsWith(`.${host}`))) return false;
    return true;
  } catch { return false; }
}

export function isSafeConfiguredLink(key: keyof SiteConfig['links'], value: string): boolean {
  if (!isSafePublicUrl(value, { allowMailto: key === 'support', allowInternal: key === 'terms' || key === 'privacy' })) return false;
  if (key === 'discordInvite') {
    const url = new URL(value);
    return (url.hostname === 'discord.gg' && /^\/[A-Za-z0-9-]+\/?$/.test(url.pathname)) ||
      (url.hostname === 'discord.com' && /^\/invite\/[A-Za-z0-9-]+\/?$/.test(url.pathname));
  }
  if (key === 'subscriptionConsole') {
    const url = new URL(value);
    return url.hostname === 'discord.com' && /^\/channels\/\d+\/\d+(?:\/\d+)?\/?$/.test(url.pathname);
  }
  return true;
}

export function isSafeHistoricalSource(value: string): boolean {
  if (!isSafePublicUrl(value)) return false;
  const url = new URL(value);
  return url.hostname === 'discord.com' && /^\/channels\/\d+\/\d+\/\d+\/?$/.test(url.pathname);
}

export function isCheckoutReady(config: SiteConfig): boolean {
  const m = config.membership;
  return config.accessMode === 'checkout' && m.verified && Boolean(m.label?.trim()) &&
    typeof m.price === 'number' && Number.isFinite(m.price) && m.price > 0 &&
    Boolean(m.currency && /^[A-Z]{3}$/.test(m.currency)) &&
    ['month', 'year', 'one-time'].includes(m.billingPeriod ?? '') &&
    typeof m.includesTradingViewAccess === 'boolean' && typeof m.includesDiscordSignals === 'boolean' &&
    (m.includesTradingViewAccess || m.includesDiscordSignals) &&
    m.renewalAndCancellationCopyApproved && m.refundCopyApproved &&
    config.publication.legalAndPrivacyApproachApproved &&
    Boolean(config.links.checkout && isSafeConfiguredLink('checkout', config.links.checkout)) &&
    Boolean(config.links.terms && isSafeConfiguredLink('terms', config.links.terms)) &&
    Boolean(config.links.privacy && isSafeConfiguredLink('privacy', config.links.privacy));
}

/** Preview tolerates missing values, never malformed URLs. Production is a release gate. */
export function validatePublicConfig(config: SiteConfig, mode: 'preview' | 'production' = 'production'): string[] {
  const errors: string[] = [];
  for (const [key, value] of Object.entries(config.links)) {
    if (value !== null && !isSafeConfiguredLink(key as keyof SiteConfig['links'], value)) errors.push(`links.${key}: unsafe, unsupported, or placeholder destination.`);
  }
  for (const [key, value] of Object.entries(config.historicalSources)) {
    if (value !== null && !isSafeHistoricalSource(value)) errors.push(`historicalSources.${key}: expected a verified Discord message URL; never a webhook.`);
  }
  if (config.siteUrl !== null) {
    if (!isSafePublicUrl(config.siteUrl)) errors.push('siteUrl: expected a real HTTPS site origin.');
    else {
      const url = new URL(config.siteUrl);
      if (!['', '/'].includes(url.pathname) || url.search || url.hash) errors.push('siteUrl: use the origin only, without a path, query, or fragment.');
    }
  }
  if (config.sourceTimezone !== null) {
    try { new Intl.DateTimeFormat('en', { timeZone: config.sourceTimezone }).format(); }
    catch { errors.push('sourceTimezone: expected an owner-confirmed IANA timezone.'); }
  }
  if (Object.values(config.brand).some((value) => !value.trim())) errors.push('brand: all three approved names must be non-empty.');
  if (config.defaultLocale !== 'en' || config.locales.join(',') !== 'en,zh') errors.push('locales: V1 requires default English and complete English/Chinese routes.');
  if (config.apex.timeframes.join(',') !== '1H,2H,3H,4H,1D' || config.apex.rollingHours !== 168 ||
      config.apex.alertCoverage.join(',') !== '4,5' || config.apex.existingSubscribersNeedSeparatePlan !== false || config.apex.publicDescriptionOnly !== true) errors.push('apex: configuration differs from the verified public rules.');
  if (config.coverage.displayCount && (!config.coverage.verifiedAt || !Number.isInteger(config.coverage.symbolCount) || (config.coverage.symbolCount ?? 0) < 1)) errors.push('coverage: a displayed count requires a verified positive integer and review date.');
  if (config.coverage.publicMarkets.length && (!config.coverage.expandedMarketDetailsApproved || !config.coverage.verifiedAt)) errors.push('coverage.publicMarkets: expanded-market copy requires review and approval.');
  if (config.coverage.timeframeFilteringByUserConfirmed) errors.push('coverage.timeframeFilteringByUserConfirmed: unsupported by this handoff; obtain new product evidence and update copy before enabling.');
  if (config.links.publicGuide && !config.publication.originalGuideDownloadApproved) errors.push('links.publicGuide: public guide approval is required before showing this link.');
  if (config.analytics.enabled) errors.push('analytics.enabled: V1 includes no analytics integration; implement and review the provider and privacy disclosure before enabling.');
  if (mode === 'production') {
    if (config.stage !== 'production') errors.push('stage: set production only after every release requirement is satisfied.');
    // A domain is optional while the site runs by IP; SEO stays noindex until configured.
    if (!config.links.discordInvite) errors.push('links.discordInvite: a valid server invitation is required.');
    // Missing optional support destinations are hidden; never invent an address.
    for (const key of ['productCopyApproved', 'publicQuickStartApproved', 'historicalExamplesApproved'] as const) {
      if (!config.publication[key]) errors.push(`publication.${key}: owner approval is required.`);
    }
    if (config.accessMode === 'checkout' && !isCheckoutReady(config)) errors.push('membership / checkout: verified price, currency, period, included rights, payment URL and approved terms/privacy/renewal/cancellation/refund information are required.');
  }
  return errors;
}
