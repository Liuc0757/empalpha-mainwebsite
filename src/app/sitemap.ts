import type { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';
export default function sitemap(): MetadataRoute.Sitemap {
  if (!siteConfig.siteUrl || siteConfig.stage!=='production') return [];
  const base=new URL(siteConfig.siteUrl).origin;
  return ['', '/start', '/risk'].flatMap(path => ['', '/zh'].map(prefix => ({url:`${base}${prefix}${path || (prefix?'':'/')}`,alternates:{languages:{en:`${base}${path || '/'}`,'zh-CN':`${base}/zh${path}`}}})));
}
