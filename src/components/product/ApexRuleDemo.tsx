'use client';
import { useState } from 'react';
import type { Locale } from '@/config/site';
import examples from '@/data/signal-examples.json';
import { APEX_TIMEFRAMES, calculateDemoCoverage } from '@/lib/apex-rules';

const frames = APEX_TIMEFRAMES;
const scenarios: Record<number, string[]> = Object.fromEntries(examples.illustrativeScenarios.map(scenario => [scenario.coverage, calculateDemoCoverage(scenario.matchedTimeframes.map(timeframe => ({symbol:'DEMO',direction:'SELL' as const,timeframe,hoursAgo:24})), 'DEMO', 'SELL').matchedTimeframes]));
export function ApexRuleDemo({ locale }: { locale: Locale }) {
  const [coverage, setCoverage] = useState(4);
  const zh = locale === 'zh';
  return <section className="rule-demo" aria-label={zh ? 'APEX 规则演示' : 'APEX rule demonstration'} data-kind="illustrative" data-source-id="D"><div className="demo-toolbar"><div><strong>{zh ? '规则演示' : 'Rule demonstration'}</strong><span>DEMO / SELL</span></div><div className="segmented" role="group" aria-label={zh ? '选择示意覆盖度' : 'Choose illustrative coverage'}>{[3,4,5].map(n => <button key={n} type="button" aria-pressed={coverage === n} onClick={() => setCoverage(n)}>{n}/5</button>)}</div></div><div className="demo-tfs">{frames.map(frame => <span key={frame} className={scenarios[coverage].includes(frame) ? '' : 'off'}>{frame}<small>{scenarios[coverage].includes(frame) ? '✓' : '—'}</small></span>)}</div><p className="demo-result" aria-live="polite">{coverage}/5 · {coverage === 3 ? (zh ? '未达到公告门槛' : 'Below the announced threshold') : (zh ? '达到对应周期覆盖' : 'Matches the coverage threshold')}</p><p className="demo-disclaimer">{zh ? '规则演示，不是真实历史通知。网页不会生成或发送交易信号。' : 'Illustrative states, not actual historical notifications. This website does not generate or send trading signals.'}</p></section>;
}
