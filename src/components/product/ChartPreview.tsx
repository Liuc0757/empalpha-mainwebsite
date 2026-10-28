'use client';
import { useRef, useState } from 'react';
import type { Locale } from '@/config/site';
export function ChartPreview({locale,src,width=1146,height=777,symbol=locale==='zh'?'AAPL':'GOOG'}:{locale:Locale;src:string;width?:number;height?:number;symbol?:string}) {
  const dialog=useRef<HTMLDialogElement>(null);
  const opener=useRef<HTMLButtonElement>(null);
  const [unavailable,setUnavailable]=useState(false);
  const zh=locale==='zh';
  const alt=zh?`用户提供的 ${symbol} 中文历史图表，白色背景上的 K 线及 EMP 买入/卖出标记。与消息卡片是独立历史案例。`:`${symbol} historical chart from the original guide, with candlesticks and EMP Buy/Sell markers on a white background. Independent of the message examples.`;
  if(unavailable) return <div className="asset-placeholder"><strong>{zh?'图表暂时无法加载':'Chart temporarily unavailable'}</strong><p>{zh?'请刷新页面后重试。':'Please refresh the page to try again.'}</p></div>;
  return <><button ref={opener} className="chart-open" onClick={()=>dialog.current?.showModal()} aria-label={zh?`查看原始尺寸：${symbol} 历史图表`:`View original size: ${symbol} historical chart`}><img src={src} alt={alt} width={width} height={height} loading="lazy" onError={()=>setUnavailable(true)}/><span>{zh?'查看原始尺寸 ↗':'View original size ↗'}</span></button><dialog ref={dialog} className="chart-dialog" onClose={()=>opener.current?.focus()} onClick={e=>{if(e.target===e.currentTarget)dialog.current?.close();}}><div className="modal-head"><strong>{zh?`${symbol} · 独立历史案例`:`${symbol} · Independent historical example`}</strong><button className="button small" onClick={()=>dialog.current?.close()}>{zh?'关闭':'Close'} ×</button></div><img src={src} alt={alt} width={width} height={height}/><p className="source-note">{zh?'历史图表示例，非实时行情；不代表收益或未来表现。':'Historical chart example, not live market data or evidence of future performance.'}</p></dialog></>;
}
