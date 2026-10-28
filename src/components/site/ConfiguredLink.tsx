import { siteConfig, type Locale } from '@/config/site';
import { resolveLink, type LinkKey } from '@/lib/links';
import type { ReactNode } from 'react';

export function ConfiguredLink({ linkKey, locale, children, className = 'text-link', explain = false }: {
  linkKey: LinkKey; locale: Locale; children: ReactNode; className?: string; explain?: boolean;
}) {
  const link = resolveLink(siteConfig, linkKey, locale);
  if (link.kind === 'unavailable') {
    if (link.hidden) return null;
    return <span className="configured-unavailable"><button className={className} disabled title={link.reason}>{children}</button>{explain && <small className="unavailable-note">{link.reason}</small>}</span>;
  }
  return <a className={className} href={link.href} {...(link.kind === 'external' ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{children}{link.kind === 'external' && <span className="sr-only">{locale === 'zh' ? '（在新标签页打开）' : ' (opens in a new tab)'}</span>}</a>;
}
