import { siteConfig, type Locale } from '@/config/site';
import { Header } from './Header';
import { ConfiguredLink } from './ConfiguredLink';
import type { ReactNode } from 'react';

export function Shell({ locale, path = '', children }: { locale: Locale; path?: string; children: ReactNode }) {
  const zh = locale === 'zh';
  const prefix = zh ? '/zh' : '';
  const content = <>
    <a className="skip-link" href="#main">{zh ? '跳转到主要内容' : 'Skip to content'}</a>
    <Header locale={locale} path={path} brand={siteConfig.brand.name} action={<ConfiguredLink linkKey="discordInvite" locale={locale} className="button primary small">{zh ? '加入 Discord' : 'Join Discord'}</ConfiguredLink>}/>
    <main id="main">{children}</main>
    <footer className="footer"><div className="wrap"><div className="footer-top"><a className="footer-brand" href={prefix || '/'}>{siteConfig.brand.name}<small>{siteConfig.brand.longName}</small></a><nav className="footer-links" aria-label={zh ? '页脚导航' : 'Footer navigation'}><a href={`${prefix}/start`}>{zh ? '快速入门' : 'Quick start'}</a><a href={`${prefix}/risk`}>{zh ? '风险说明' : 'Risk disclosure'}</a><ConfiguredLink linkKey="support" locale={locale} explain>{zh ? '联系支持' : 'Contact support'}</ConfiguredLink><ConfiguredLink linkKey="terms" locale={locale}>{zh ? '服务条款' : 'Terms'}</ConfiguredLink><ConfiguredLink linkKey="privacy" locale={locale}>{zh ? '隐私说明' : 'Privacy'}</ConfiguredLink></nav></div>
      <p className="footer-copy">{zh ? 'EMP Signals 提供技术分析工具与参考信号，不构成投资建议，不保证收益或准确率。强单边行情中可能出现反向误报。交易存在风险。' : 'EMP Signals provides technical-analysis tools and reference signals, not investment advice. Accuracy and returns are not guaranteed. Strong one-way trends can produce false signals against the trend. Trading involves risk.'}</p>
      <p className="footer-copy">{zh ? 'EMP 为独立服务。TradingView 与 Discord 仅用于说明图表和消息交付方式，不代表这两个平台的官方背书。' : 'EMP is an independent service. TradingView and Discord describe chart and delivery tools, not an endorsement by either platform.'}</p>
      <div className="footer-bottom"><span>© 2026 {siteConfig.brand.name}</span><ConfiguredLink linkKey="subscriptionConsole" locale={locale}>{zh ? '已有用户：打开订阅控制台 ↗' : 'Existing member? Open subscription console ↗'}</ConfiguredLink></div>
      <div className="optional-links">{(['tradingViewProfile', 'billingPortal', 'publicGuide', 'status', 'socialX', 'socialYoutube', 'socialReddit'] as const).map(key => <ConfiguredLink key={key} linkKey={key} locale={locale}>{({tradingViewProfile:'TradingView',billingPortal:zh?'管理账单':'Manage billing',publicGuide:zh?'完整指南':'Full guide',status:zh?'服务状态':'Service status',socialX:'X',socialYoutube:'YouTube',socialReddit:'Reddit'})[key]}</ConfiguredLink>)}</div>
    </div></footer>
  </>;
  return content;
}
