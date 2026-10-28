import { spawnSync } from 'node:child_process';
import { siteConfig } from '../src/config/site';
import { validatePublicConfig } from '../src/lib/validate-public-config';

const issues = validatePublicConfig(siteConfig,'production');
if (issues.length) {
  console.error(`Release blocked (${issues.length} requirements):\n${issues.map(x=>`- ${x}`).join('\n')}`);
  process.exit(1);
}
const npm = process.platform==='win32'?'npm.cmd':'npm';
for(const name of ['typecheck','lint','test','check:content','build']) {
  const result=spawnSync(npm,['run',name],{stdio:'inherit',shell:process.platform==='win32'});
  if(result.status!==0) process.exit(result.status??1);
}
console.log('Release build prepared. Nothing has been uploaded, published or charged. Run browser QA on this exact build before deployment.');
