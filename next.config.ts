import type { NextConfig } from 'next';
import { siteConfig } from './src/config/site';
import { validatePublicConfig } from './src/lib/validate-public-config';
const configErrors = validatePublicConfig(siteConfig, siteConfig.stage);
if (configErrors.length) throw new Error(`EMP configuration blocked:\n${configErrors.join('\n')}`);
const nextConfig: NextConfig = {
  poweredByHeader: false,
  experimental: { globalNotFound: true },
  devIndicators: false,
  async headers() {
    return [{ source: '/:path*', headers: [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'X-Frame-Options', value: 'DENY' }
    ] }];
  }
};
export default nextConfig;
