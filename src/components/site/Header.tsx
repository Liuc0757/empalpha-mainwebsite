'use client';
import { useRef, useState } from 'react';
import type { Locale } from '@/config/site';
import type { ReactNode } from 'react';

export function Header({ locale, path = '', action, brand }: { locale: Locale; path?: string; action: ReactNode; brand: string }) {
  const [open, setOpen] = useState(false);
  const menu = useRef<HTMLButtonElement>(null);
  const zh = locale === 'zh';
  const home = zh ? '/zh' : '/';
  const alternate = zh ? (path || '/') : `/zh${path}`;
  const items = [['signals', zh ? '产品' : 'Product'], ['apex', 'APEX'], ['access', zh ? '使用流程' : 'How it works'], ['faq', zh ? '常见问题' : 'FAQ']];
  return <header className="site-header" onKeyDown={event => { if (event.key === 'Escape' && open) { setOpen(false); menu.current?.focus(); } }}>
    <div className="wrap nav">
      <a className="wordmark" href={home} aria-label={`${brand} ${zh ? '首页' : 'home'}`}><span className="mark" aria-hidden="true"><i/><i/><i/></span><span>{brand === 'EMP Signals' ? <>EMP <small>Signals</small></> : brand}</span></a>
      <nav className="nav-links" aria-label={zh ? '主导航' : 'Main navigation'}>{items.map(([id, label]) => <a key={id} href={`${home}#${id}`}>{label}</a>)}</nav>
      <div className="nav-actions"><a className="lang" href={alternate} lang={zh ? 'en' : 'zh-CN'} aria-label={zh ? 'EN — Switch to English' : '中文 — 切换中文'} onClick={e => { e.currentTarget.href = alternate + window.location.hash; }}>{zh ? 'EN' : '中文'}</a><div className="nav-cta">{action}</div><button ref={menu} className="mobile-menu" aria-expanded={open} aria-controls="mobile-nav" onClick={() => setOpen(!open)}>{open ? (zh ? '关闭' : 'Close') : (zh ? '菜单' : 'Menu')}<span aria-hidden="true">{open ? '−' : '+'}</span></button></div>
    </div>
    <nav id="mobile-nav" className={`wrap mobile-nav ${open ? 'is-open' : ''}`} aria-label={zh ? '手机导航' : 'Mobile navigation'} hidden={!open}>{items.map(([id, label]) => <a key={id} href={`${home}#${id}`} onClick={() => setOpen(false)}>{label}<span aria-hidden="true">↗</span></a>)}{action}</nav>
    <noscript><nav className="wrap no-js-nav">{items.map(([id,label]) => <a key={id} href={`${home}#${id}`}>{label}</a>)}</nav></noscript>
  </header>;
}
