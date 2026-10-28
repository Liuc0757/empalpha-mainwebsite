/**
 * EMP portal's single public configuration entry point.
 * Deployable contact-mode portal. Unknown business values remain null.
 * Complete the release checks before production. Never put secrets in this object.
 */
export type Locale = 'en' | 'zh';
export type PublicLink = string | null;
export type AccessMode = 'contact' | 'checkout';

export interface SiteConfig {
  stage: 'preview' | 'production';
  brand: { name: string; longName: string; botName: string };
  siteUrl: PublicLink;
  defaultLocale: Locale;
  locales: readonly Locale[];
  accessMode: AccessMode;
  links: {
    discordInvite: PublicLink;
    subscriptionConsole: PublicLink;
    support: PublicLink;
    tradingViewProfile: PublicLink;
    tradingViewIndicator: PublicLink;
    watchlist: PublicLink;
    checkout: PublicLink;
    billingPortal: PublicLink;
    terms: PublicLink;
    privacy: PublicLink;
    publicGuide: PublicLink;
    status: PublicLink;
    socialX: PublicLink;
    socialYoutube: PublicLink;
    socialReddit: PublicLink;
  };
  historicalSources: { ordinarySignal: PublicLink; apex: PublicLink };
  sourceTimezone: string | null; // IANA timezone only after owner confirmation.
  membership: {
    verified: boolean;
    label: string | null;
    price: number | null;
    currency: string | null;
    billingPeriod: 'month' | 'year' | 'one-time' | null;
    includesTradingViewAccess: boolean | null;
    includesDiscordSignals: boolean | null;
    renewalAndCancellationCopyApproved: boolean;
    refundCopyApproved: boolean;
  };
  coverage: {
    verifiedAt: string | null;
    displayCount: boolean;
    symbolCount: number | null;
    publicMarkets: readonly string[];
    expandedMarketDetailsApproved: boolean;
    timeframeFilteringByUserConfirmed: boolean;
  };
  apex: {
    timeframes: readonly ['1H', '2H', '3H', '4H', '1D'];
    rollingHours: 168;
    alertCoverage: readonly [4, 5];
    existingSubscribersNeedSeparatePlan: false;
    publicDescriptionOnly: true;
  };
  publication: {
    productCopyApproved: boolean;
    publicQuickStartApproved: boolean;
    historicalExamplesApproved: boolean;
    guideChartApproved: boolean;
    originalGuideDownloadApproved: boolean;
    legalAndPrivacyApproachApproved: boolean;
  };
  analytics: { enabled: boolean; provider: string | null; publicSiteId: string | null };
}

export const siteConfig: SiteConfig = {
  stage: 'production',
  brand: {
    name: 'EMP Signals',
    longName: 'Elliot Money Printer',
    botName: 'Elliot Money Printer Bot',
  },
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL?.trim() || null,
  defaultLocale: 'en',
  locales: ['en', 'zh'],
  accessMode: 'contact',
  links: {
    discordInvite: 'https://discord.gg/RxEH3E73J',
    subscriptionConsole: null,
    support: null,
    tradingViewProfile: null,
    tradingViewIndicator: null,
    watchlist: null,
    checkout: null,
    billingPortal: null,
    terms: null,
    privacy: null,
    publicGuide: null,
    status: null,
    socialX: null,
    socialYoutube: null,
    socialReddit: null,
  },
  historicalSources: { ordinarySignal: null, apex: null },
  sourceTimezone: null,
  membership: {
    verified: false,
    label: null,
    price: null,
    currency: null,
    billingPeriod: null,
    includesTradingViewAccess: null,
    includesDiscordSignals: null,
    renewalAndCancellationCopyApproved: false,
    refundCopyApproved: false,
  },
  coverage: {
    verifiedAt: null,
    displayCount: false,
    symbolCount: null,
    publicMarkets: [],
    expandedMarketDetailsApproved: false,
    timeframeFilteringByUserConfirmed: false,
  },
  apex: {
    timeframes: ['1H', '2H', '3H', '4H', '1D'],
    rollingHours: 168,
    alertCoverage: [4, 5],
    existingSubscribersNeedSeparatePlan: false,
    publicDescriptionOnly: true,
  },
  publication: {
    productCopyApproved: true,
    publicQuickStartApproved: true,
    historicalExamplesApproved: true,
    guideChartApproved: true,
    originalGuideDownloadApproved: false,
    legalAndPrivacyApproachApproved: false,
  },
  analytics: { enabled: false, provider: null, publicSiteId: null },
};
