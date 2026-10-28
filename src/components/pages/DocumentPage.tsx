import type { Locale } from '@/config/site';
import { siteConfig } from '@/config/site';
import { copy } from '@/content/copy';
import { ConfiguredLink } from '@/components/site/ConfiguredLink';
import { Shell } from '@/components/site/Shell';
import { timezoneLabel } from '@/lib/display-time';
import './documents.css';

type DocumentKind = 'start' | 'risk';

export function DocumentPage({ locale, kind }: { locale: Locale; kind: DocumentKind }) {
  const zh = locale === 'zh';
  const isStart = kind === 'start';
  const content = copy[locale];
  const displayParagraph = (text: string) => siteConfig.sourceTimezone ? text.replace('the source timezone is unconfirmed', timezoneLabel(locale)).replace('来源时区尚未确认', timezoneLabel(locale)) : text;
  const prefix = zh ? '/zh' : '';
  const sections = isStart
    ? content.quickStart.map(section => ({ ...section, id: section.id === 'subscribe' ? 'supported-symbols' : section.id }))
    : content.risks.map((section, index) => ({ ...section, id: `risk-${index + 1}` }));
  const title = isStart
    ? (zh ? '开通访问，建立你的关注列表。' : 'Set up access. Follow your symbols.')
    : (zh ? '理解信号，也理解它的边界。' : 'Know the signal. Know its limits.');
  const introduction = isStart
    ? (zh ? '从图表访问到 Discord 提醒，按实际流程开始使用 EMP。订阅与权限在相应平台办理。' : 'From chart access to Discord delivery, follow the actual steps to use EMP. Subscriptions and permissions are managed in their respective platforms.')
    : (zh ? '使用 EMP 前，了解收盘信号、周期覆盖、消息交付与历史示例的含义和局限。' : 'Before using EMP, understand what bar-close signals, timeframe coverage, delivery and historical examples can tell you.');

  return <Shell locale={locale} path={`/${kind}`}>
    <div className="wrap doc-page">
      <header className="doc-hero">
        <div>
          <p className="doc-eyebrow">{isStart ? (zh ? '公共快速入门' : 'PUBLIC QUICK START') : (zh ? '产品风险说明' : 'PRODUCT RISK DISCLOSURE')}</p>
          <h1>{title}</h1>
        </div>
        <div className="doc-hero-copy">
          <p>{introduction}</p>
          <a className="doc-back-link" href={prefix || '/'}><span aria-hidden="true">←</span>{zh ? '返回 EMP Signals' : 'Back to EMP Signals'}</a>
        </div>
      </header>

      <div className="doc-layout">
        <aside className="doc-sidebar">
          <nav className="doc-toc" aria-label={zh ? '本页目录' : 'On this page'}>
            <h2>{zh ? '本页内容' : 'On this page'}</h2>
            <ol>
              {sections.map(section => <li key={section.id}><a href={`#${section.id}`}>{section.title.replace(/^\d+\.\s*/, '')}</a></li>)}
            </ol>
          </nav>
          {isStart && <div className="doc-resources">
            <h2>{zh ? '访问与控制台' : 'Access & console'}</h2>
            <ConfiguredLink linkKey="subscriptionConsole" locale={locale}>{zh ? '打开订阅控制台' : 'Open subscription console'}<span aria-hidden="true">↗</span></ConfiguredLink>
            <ConfiguredLink linkKey="tradingViewIndicator" locale={locale}>{zh ? 'TradingView 指标访问' : 'TradingView indicator access'}<span aria-hidden="true">↗</span></ConfiguredLink>
            <ConfiguredLink linkKey="watchlist" locale={locale}>{zh ? '支持的标的' : 'Supported symbols'}<span aria-hidden="true">↗</span></ConfiguredLink>
            <p>{zh ? '成员频道与支持列表可能需要相应访问权限。' : 'Member channels and watchlists may require the appropriate access.'}</p>
          </div>}
          {!isStart && <div className="doc-resources">
            <h2>{zh ? '了解接入方式' : 'Understand the setup'}</h2>
            <a className="text-link" href={`${prefix}/start`}>{zh ? '查看快速入门' : 'Read the quick start'}<span aria-hidden="true">→</span></a>
            <p>{zh ? '网站介绍产品，实际订阅操作在 Discord 内完成。' : 'This website explains the product. Actual subscriptions are managed in Discord.'}</p>
          </div>}
        </aside>

        <div className="doc-body">
          {sections.map((section, index) => <section className="doc-section" id={section.id} key={section.id} aria-labelledby={`${section.id}-heading`}>
            <span className="doc-section-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
            <div>
              <h2 id={`${section.id}-heading`}>{section.title.replace(/^\d+\.\s*/, '')}</h2>
              {section.body.map(paragraph => <p key={paragraph}>{displayParagraph(paragraph)}</p>)}
              {isStart && section.id === 'access' && <div className="doc-section-action"><ConfiguredLink linkKey="discordInvite" locale={locale} className="button primary" explain>{zh ? '加入 Discord' : 'Join Discord'}</ConfiguredLink></div>}
            </div>
          </section>)}
          <div className="doc-help">
            <p className="doc-eyebrow">{zh ? '下一步' : 'NEXT STEP'}</p>
            <h2>{zh ? '有访问或交付问题？' : 'Questions about access or delivery?'}</h2>
            <p>{zh ? '先检查支持列表、订阅、DM 与 Access，以及设备通知；仍有疑问时，再联系支持。' : 'Check the supported watchlist, your subscription, DM and Access, and device notifications. Contact support if you still need help.'}</p>
            <div className="doc-help-actions">
              <ConfiguredLink linkKey="support" locale={locale} className="button" explain>{zh ? '联系支持' : 'Contact support'}</ConfiguredLink>
              <a className="text-link" href={isStart ? `${prefix}/risk` : `${prefix}/start`}>{isStart ? (zh ? '阅读风险说明' : 'Read the risk disclosure') : (zh ? '查看快速入门' : 'Read the quick start')}<span aria-hidden="true">→</span></a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Shell>;
}
