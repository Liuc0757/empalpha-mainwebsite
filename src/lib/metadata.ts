import type { Metadata } from 'next';
import { siteConfig, type Locale } from '@/config/site';

export function pageMetadata(locale: Locale, page: 'home' | 'start' | 'risk'): Metadata {
  const zh = locale === 'zh';
  const labels = zh ? {home:'TradingView 图表信号，Discord 私信送达',start:'公共快速入门',risk:'产品风险说明'} : {home:'TradingView Signals, Delivered in Discord',start:'Public Quick Start',risk:'Product Risk Disclosure'};
  const description = zh ? '了解 EMP 收盘确认的 Buy/Sell 参考信号、Discord 按标的订阅与 APEX 五周期信号证据。' : 'Explore EMP bar-close Buy/Sell reference signals, symbol subscriptions in Discord, and multi-timeframe evidence with APEX Confluence.';
  const route = page === 'home' ? '' : `/${page}`;
  const base = siteConfig.siteUrl ? new URL(siteConfig.siteUrl).origin : null;
  return {
    title: `${siteConfig.brand.name} | ${labels[page]}`, description,
    icons: { icon: '/assets/approved/favicon.svg' },
    robots: { index: siteConfig.stage === 'production' && Boolean(base), follow: siteConfig.stage === 'production' && Boolean(base) },
    ...(base ? { alternates: { canonical: `${base}${zh?'/zh':''}${route || (zh?'':'/')}`, languages: {en:`${base}${route || '/'}`,'zh-CN':`${base}/zh${route}`,'x-default':`${base}${route || '/'}`} }, openGraph:{title:`${siteConfig.brand.name} | ${labels[page]}`,description,locale:zh?'zh_CN':'en_US',type:'website',url:`${base}${zh?'/zh':''}${route}`} } : {})
  };
}
