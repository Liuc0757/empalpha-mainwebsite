import { siteConfig } from '../src/config/site';
import { validatePublicConfig } from '../src/lib/validate-public-config';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const index = process.argv.indexOf('--mode');
const requested = index >= 0 ? process.argv[index + 1] : siteConfig.stage;
if (requested !== 'preview' && requested !== 'production') throw new Error('Use --mode preview or --mode production.');
const errors = validatePublicConfig(siteConfig, requested);
for (const key of ['terms','privacy'] as const) {
  const value=siteConfig.links[key];
  if(value?.startsWith('/')) {
    const route=value.split('#')[0].replace(/\/$/,'');
    const file=route.startsWith('/zh/')?join('src','app','(zh)',route.slice(1),'page.tsx'):join('src','app','(en)',route.slice(1),'page.tsx');
    if(!existsSync(file)) errors.push(`links.${key}: approved internal page does not exist: ${route}`);
  }
}
if (errors.length) {
  console.error(`${requested} configuration check failed (${errors.length}):\n${errors.map((error) => `- ${error}`).join('\n')}`);
  process.exitCode = 1;
} else {
  console.log(`${requested} configuration check passed.`);
  if (requested === 'preview') {
    const pending = validatePublicConfig(siteConfig, 'production');
    console.log(`Preview only; ${pending.length} release requirements remain:\n${pending.map((error) => `- ${error}`).join('\n')}`);
  }
}
