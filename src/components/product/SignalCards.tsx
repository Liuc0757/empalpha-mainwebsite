import { siteConfig, type Locale } from '@/config/site';
import examples from '@/data/signal-examples.json';
import { timezoneLabel } from '@/lib/display-time';
import { ConfiguredLink } from '../site/ConfiguredLink';
import './discord-messages.css';

export const historical = examples.historical;

export function HistoricalLabel({ locale }: { locale: Locale }) {
  return <span className="sample-label">{locale === 'zh' ? '历史示例 · 非实时数据' : 'Historical example · Not live'}</span>;
}

export function Coverage({ matched = historical.apex.matchedTimeframes, locale }: { matched?: readonly string[]; locale: Locale }) {
  return <div className="timeframes" aria-label={locale === 'zh' ? '周期覆盖' : 'Timeframe coverage'}>{siteConfig.apex.timeframes.map(frame => <div className={`tf ${matched.includes(frame) ? 'matched' : 'unmatched'}`} key={frame}><span>{frame}</span><small>{matched.includes(frame) ? 'SELL ✓' : '—'}</small></div>)}</div>;
}

/** Date strings are reformatted for display only; no timezone is inferred. */
function dateLabel(value: string, locale: Locale) {
  if (locale !== 'zh') return value;
  const [date, time] = value.split(' ');
  const [year, month, day] = date.split('-');
  return `${year}年${Number(month)}月${Number(day)}日 ${time}`;
}

function SourceMessage({ locale, apex = false }: { locale: Locale; apex?: boolean }) {
  return <ConfiguredLink linkKey={apex ? 'historicalSources.apex' : 'historicalSources.ordinarySignal'} locale={locale} className="discord-source-link">View source message</ConfiguredLink>;
}

function BotAuthor({ locale }: { locale: Locale }) {
  const time = historical.ordinarySignal.triggeredDisplay;
  return <div className="discord-author-row">
    <span className="discord-avatar discord-avatar--reference" aria-hidden="true"/>
    <div className="discord-author-meta"><strong>{siteConfig.brand.botName}</strong><span className="discord-app">APP</span><time dateTime={time.replace(' ', 'T')} aria-label={locale === 'zh' ? '消息截图显示时间' : 'Supplied message time'}>{historical.ordinarySignal.messageSentDisplay}</time></div>
  </div>;
}

export function SignalCard({ locale }: { locale: Locale }) {
  const signal = historical.ordinarySignal;
  return <div className="discord-message discord-message--signal">
    <BotAuthor locale={locale}/>
    <div className="discord-message-body">
      <p className="discord-message-intro">A new signal is available for your <strong>{signal.symbol}</strong> subscription · <SourceMessage locale={locale}/></p>
      <article className="signal discord-embed" aria-label={locale === 'zh' ? `${signal.symbol} 历史普通信号` : `${signal.symbol} historical ordinary signal`} data-kind="historical">
        <h3 className="discord-signal-title"><span className="discord-buy-dot" aria-hidden="true"/>{signal.direction} · {signal.symbol} · {signal.timeframe}</h3>
        <p className="discord-import-note">Imported from the approved watchlist signal channel</p>
        <div className="discord-signal-fields numeric">
          <div><strong>Signal Price</strong><code>{signal.signalPrice.toFixed(2)}</code></div>
          <div><strong>Timeframe</strong><code>{signal.timeframe}</code></div>
          <div><strong>Triggered</strong><time className="discord-timestamp" dateTime={signal.triggeredDisplay.replace(' ', 'T')}>{locale === 'zh' ? signal.triggeredDisplayChinese : signal.triggeredDisplay}</time></div>
        </div>
        <p className="discord-embed-footer">EMP• This is not financial advice</p>
      </article>
    </div>
  </div>;
}

function Alignment({ locale }: { locale: Locale }) {
  return <div className="discord-alignment timeframes" aria-label={locale === 'zh' ? '周期覆盖' : 'Timeframe coverage'}>{siteConfig.apex.timeframes.map(frame => <div className="discord-match tf matched" key={frame}><i aria-hidden="true">✓</i><span>{frame}</span></div>)}</div>;
}

function ApexBanner() {
  return <div className="discord-apex-banner" role="img" aria-label="EMP multi-timeframe signal. APEX Confluence. 5/5 distinct timeframes. 7-day alignment.">
    <div className="apex-banner-inner" aria-hidden="true">
      <span className="apex-banner-kicker">EMP / MULTI-TIMEFRAME SIGNAL</span>
      <div className="apex-banner-wordmark"><strong>APEX</strong><b>CONFLUENCE</b></div>
      <span className="apex-banner-window">7-DAY ALIGNMENT</span>
      <div className="apex-banner-score"><span>5/5</span></div>
      <div className="apex-banner-bars"><i/><i/><i/><i/><i/><small>5 / 5 DISTINCT TIMEFRAMES</small></div>
      <i className="apex-banner-corner apex-banner-corner--tl"/><i className="apex-banner-corner apex-banner-corner--tr"/><i className="apex-banner-corner apex-banner-corner--bl"/><i className="apex-banner-corner apex-banner-corner--br"/>
    </div>
  </div>;
}

function ApexWindow({ locale }: { locale: Locale }) {
  const apex = historical.apex;
  return <div className="discord-window"><strong>Rolling 7-day window</strong><div className="numeric"><time className="discord-timestamp" dateTime={apex.windowStartDisplay.replace(' ', 'T')}>{dateLabel(apex.windowStartDisplay, locale)}</time><span> — </span><time className="discord-timestamp" dateTime={apex.windowEndDisplay.replace(' ', 'T')}>{dateLabel(apex.windowEndDisplay, locale)}</time></div></div>;
}

export function ApexCard({ locale, compact = false }: { locale: Locale; compact?: boolean }) {
  const apex = historical.apex;
  return <div className={`discord-message discord-message--apex${compact ? ' discord-message--compact' : ''}`}>
    {!compact && <p className="discord-message-intro"><strong>APEX CONFLUENCE</strong> detected for your <strong>{historical.symbol}</strong> subscription · <SourceMessage locale={locale} apex/></p>}
    <article className="apex-card discord-embed" data-kind="historical" aria-label={locale === 'zh' ? 'AAPL 历史 APEX 消息' : 'AAPL historical APEX message'}>
      <h3 className="discord-apex-title">APEX CONFLUENCE</h3>
      <p className="discord-apex-summary"><strong>{historical.symbol} · {historical.direction}</strong>{!compact && <><br/><strong>Matched timeframes: {apex.matchedTimeframes.join(' · ')}</strong><br/><span>Signals recorded within the rolling 7-day window.</span></>}</p>
      <div className="discord-apex-fields"><div><strong>Timeframe coverage</strong><span><b>{apex.coverage}/{apex.totalTimeframes}</b> distinct timeframes</span></div><div><strong>Direction</strong><b>▼ {historical.direction}</b></div></div>
      <div className="discord-alignment-group"><strong>Timeframe alignment</strong><Alignment locale={locale}/></div>
      <ApexWindow locale={locale}/>
      {!compact && <>
        <div className="discord-evidence"><strong>Signal evidence</strong><ul>{apex.evidence.map(item => <li key={item.timeframe}><span className="discord-evidence-timeframe">{item.timeframe}</span><span> · </span><time className="discord-timestamp" dateTime={item.recordedDisplay.replace(' ', 'T')}>{dateLabel(item.recordedDisplay, locale)}</time></li>)}</ul></div>
        <ApexBanner/>
      </>}
      <p className="discord-embed-footer">EMP• This is not financial advice{!compact && <> · <time dateTime={apex.windowEndDisplay.replace(' ', 'T')}>{apex.windowEndDisplay.replaceAll('-', '/')}</time></>}</p>
      {compact && <a className="discord-full-message" href="#apex">{locale === 'zh' ? '查看完整消息与周期证据' : 'View the full message and evidence'} ↗</a>}
    </article>
  </div>;
}

export function ProductShowcase({ locale }: { locale: Locale }) {
  const zh = locale === 'zh';
  return <div className="showcase discord-showcase">
    <div className="sample-top"><span>{zh ? '看看 EMP 实际交付什么' : 'A look inside EMP'}</span><HistoricalLabel locale={locale}/></div>
    <div className="discord-message-stack"><SignalCard locale={locale}/><ApexCard locale={locale} compact/></div>
    <p className="sample-caption">{zh ? '根据提供的 NVDA 与 AAPL 历史消息重建。' : 'Recreated from the supplied NVDA and AAPL historical messages. '} {timezoneLabel(locale)}. <a href="#apex-evidence">{zh ? '查看证据 ↗' : 'View evidence ↗'}</a></p>
  </div>;
}
