import type { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';
export default function robots(): MetadataRoute.Robots { return {rules:{userAgent:'*',...((siteConfig.stage==='preview'||!siteConfig.siteUrl)?{disallow:'/'}:{allow:'/',disallow:'/api/'})},...(siteConfig.siteUrl && siteConfig.stage==='production'?{sitemap:`${new URL(siteConfig.siteUrl).origin}/sitemap.xml`}:{})}; }
