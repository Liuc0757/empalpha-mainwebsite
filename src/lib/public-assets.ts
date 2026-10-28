import manifest from '../../public/assets/approved/manifest.json';
import { siteConfig, type Locale } from '@/config/site';
type ApprovedAsset = { path: string; source: string; purpose: string; publicationApproved: boolean; width?: number; height?: number; locale?: Locale };
export function approvedChart(locale: Locale = 'en'): ApprovedAsset | undefined {
  if (!siteConfig.publication.guideChartApproved) return undefined;
  return (manifest.assets as ApprovedAsset[]).find(asset => asset.purpose === 'indicator-chart' && (asset.locale || 'en') === locale && asset.publicationApproved && asset.width && asset.height && asset.path.startsWith('/assets/approved/'));
}
