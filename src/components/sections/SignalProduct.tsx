import { siteConfig, type Locale } from '@/config/site';
import { copy } from '@/content/copy';
import { ChartPreview } from '../product/ChartPreview';
import { SignalCard } from '../product/SignalCards';
import { ConfiguredLink } from '../site/ConfiguredLink';
import { approvedChart } from '@/lib/public-assets';

export function SignalProduct({ locale }: { locale: Locale }) {
  const zh = locale === 'zh', c = copy[locale];
  const asset = approvedChart(locale);
  const symbol = zh ? 'AAPL' : 'GOOG';
  return <section id="signals" className="section wrap chart-layout" aria-labelledby="signals-title">
    <div className="chart-figure">
      <div className="figure-top"><span>{zh ? '图表视角' : 'ON THE CHART'}</span><span>TradingView / {symbol}</span></div>
      {asset && <ChartPreview locale={locale} symbol={symbol} src={asset.path} width={asset.width} height={asset.height}/>}
      <p className="figure-caption">{zh ? '指标图表：AAPL。独立历史案例，保留原图显示值。' : 'Indicator example — GOOG. Independent historical example.'}</p>
      <div className="delivery-example">
        <span className="figure-top">{zh ? '消息视角 · NVDA' : 'IN YOUR DMS / NVDA'}</span><SignalCard locale={locale}/>
        <p className="figure-caption">{zh ? 'Discord 推送示例：NVDA。与上方 AAPL 图表及 APEX 消息是不同历史案例。' : 'Discord delivery example — NVDA. Independent of the GOOG chart and the AAPL APEX example.'}</p>
        {siteConfig.historicalSources.ordinarySignal && <ConfiguredLink linkKey="historicalSources.ordinarySignal" locale={locale}>{zh ? '源消息（需成员权限）' : 'Source message (member access required)'}</ConfiguredLink>}
      </div>
    </div>
    <div className="chart-copy"><p className="eyebrow">01 / {zh ? '从图表到提醒' : 'FROM CHART TO MESSAGE'}</p><h2 id="signals-title" className="section-title">{c.signalTitle}</h2><p className="body-copy">{c.signalBody}</p><div className="annotation">{c.signalNote}</div><p className="body-copy small-copy">{zh ? 'Buy 与 Sell 是独立参考标记，不构成一进一出的完整交易计划。' : 'Buy and Sell are independent reference points. They do not form a complete entry-and-exit plan.'}</p></div>
  </section>;
}
