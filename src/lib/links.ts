import type { Locale, SiteConfig } from '../config/site';
import { isCheckoutReady, isSafeConfiguredLink, isSafeHistoricalSource } from './validate-public-config';

export type LinkKey = keyof SiteConfig['links'] | 'historicalSources.ordinarySignal' | 'historicalSources.apex';
export type ResolvedLink =
  | { kind: 'external'; href: string; memberOnly?: boolean }
  | { kind: 'internal'; href: string }
  | { kind: 'unavailable'; reason: string; hidden?: true };

const optional = new Set<keyof SiteConfig['links']>(['tradingViewProfile', 'billingPortal', 'terms', 'privacy', 'publicGuide', 'status', 'socialX', 'socialYoutube', 'socialReddit']);
export function resolveLink(config: SiteConfig, linkKey: LinkKey, locale: Locale): ResolvedLink {
  const prefix = locale === 'zh' ? '/zh' : '';
  const unavailable = (reason: string, hidden = false): ResolvedLink => ({ kind: 'unavailable', reason, ...(hidden ? { hidden: true as const } : {}) });
  if (linkKey.startsWith('historicalSources.')) {
    const key = linkKey.slice('historicalSources.'.length) as keyof SiteConfig['historicalSources'];
    const value = config.historicalSources[key];
    if (value && isSafeHistoricalSource(value)) return { kind: 'external', href: value, memberOnly: true };
    return unavailable(locale === 'zh' ? '源消息链接在成员环境中查看。' : 'Source links are available in the member environment.');
  }
  const key = linkKey as keyof SiteConfig['links'];
  const value = config.links[key];
  if (key === 'checkout' && !isCheckoutReady(config)) return unavailable(locale === 'zh' ? '尚未确认完整会员与付款配置；请了解当前访问方式。' : 'Membership and payment details are not confirmed. Ask about current access.', true);
  if (key === 'publicGuide' && !config.publication.originalGuideDownloadApproved) return unavailable(locale === 'zh' ? '完整指南尚未获准公开，请查看公共快速入门。' : 'The full guide is not approved for publication. Read the public quick start.', true);
  if (value && isSafeConfiguredLink(key, value)) return value.startsWith('/') ? { kind: 'internal', href: value } : { kind: 'external', href: value, ...(['subscriptionConsole', 'watchlist'].includes(key) && value.includes('discord.com/channels/') ? { memberOnly: true } : {}) };
  if (key === 'subscriptionConsole') return { kind: 'internal', href: `${prefix}/start#existing-members` };
  if (key === 'tradingViewIndicator') return { kind: 'internal', href: `${prefix}/start#tradingview` };
  if (key === 'watchlist') return { kind: 'internal', href: `${prefix}/start#supported-symbols` };
  if (key === 'discordInvite') return unavailable(locale === 'zh' ? 'Discord 邀请链接尚未配置。' : 'Discord invite is not configured.');
  if (key === 'support') return unavailable(locale === 'zh' ? '公开支持入口尚未配置。' : 'A public support destination is not configured.', true);
  return unavailable(locale === 'zh' ? '此入口尚未配置。' : 'This destination is not configured.', optional.has(key));
}
