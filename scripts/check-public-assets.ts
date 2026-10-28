import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { extname, join, relative, resolve } from 'node:path';
import { siteConfig } from '../src/config/site';

const root = process.cwd();
const errors: string[] = [];
const walk = (directory: string): string[] => existsSync(directory) ? readdirSync(directory, { withFileTypes: true }).flatMap((entry) => entry.isSymbolicLink() ? (errors.push(`Symbolic links are not allowed in the asset scan: ${join(directory, entry.name)}`), []) : entry.isDirectory() ? walk(join(directory, entry.name)) : [join(directory, entry.name)]) : [];
const digest = (file: string) => createHash('sha256').update(readFileSync(file)).digest('hex');
const privateDirectory = resolve(root, '..', 'EMP_Portal_Handoff', 'assets', 'private-reference');
const suppliedReviewDirectory = join(root, 'qa', 'review-inputs');
const privateHashes = new Set([...walk(privateDirectory), ...walk(suppliedReviewDirectory)].map(digest));
const publicDirectory = join(root, 'public');
const manifestFile = join(publicDirectory, 'assets', 'approved', 'manifest.json');
type Asset = { path: string; source: string; purpose: string; publicationApproved: boolean; sha256?: string; width?:number; height?:number };
let entries: Asset[] = [];
if (!existsSync(manifestFile)) errors.push('public/assets/approved/manifest.json is required, including when assets is empty.');
else {
  try {
    const manifest = JSON.parse(readFileSync(manifestFile, 'utf8')) as { schemaVersion: number; assets: Asset[] };
    if (manifest.schemaVersion !== 1 || !Array.isArray(manifest.assets)) throw new Error('Expected schemaVersion: 1 and assets array.');
    entries = manifest.assets;
  } catch (error) { errors.push(`Asset manifest cannot be read: ${String(error)}`); }
}
const approvedPaths = new Set<string>();
for (const asset of entries) {
  if (!asset || typeof asset.path !== 'string' || !/^\/assets\/approved\/[a-zA-Z0-9_./-]+$/.test(asset.path) || asset.path.includes('..') || asset.path.endsWith('/manifest.json')) {
    errors.push('Manifest contains an invalid asset path.');
    continue;
  }
  const path = resolve(publicDirectory, `.${asset.path}`);
  if (approvedPaths.has(path)) errors.push(`Duplicate manifest entry: ${asset.path}`);
  approvedPaths.add(path);
  if (asset.publicationApproved !== true || !asset.source?.trim() || !asset.purpose?.trim()) errors.push(`Asset is not explicitly approved with source and purpose: ${asset.path}`);
  if (!existsSync(path)) errors.push(`Manifest asset does not exist: ${asset.path}`);
  else if (asset.sha256 && asset.sha256 !== digest(path)) errors.push(`Asset content differs from its approved hash: ${asset.path}`);
  if (asset.purpose==='indicator-chart' && (!siteConfig.publication.guideChartApproved || !asset.sha256 || !asset.width || !asset.height)) errors.push(`Indicator chart needs owner approval, reviewed hash and native dimensions: ${asset.path}`);
}
const publicFiles = walk(publicDirectory);
const buildFiles = [...walk(join(root, '.next', 'static')), ...walk(join(root, '.next', 'server'))];
const prohibitedNames = /(?:EMP_USER_GUIDE_original|discord-aapl-apex-original|apex-launch-announcement-original|private-reference)/i;
const textExtensions = new Set(['.js', '.css', '.html', '.json', '.txt', '.map', '.svg']);
for (const path of [...publicFiles, ...buildFiles]) {
  const display = relative(root, path);
  if (/\.pdf$/i.test(path) || prohibitedNames.test(display)) errors.push(`Private or prohibited filename in browser output: ${display}`);
  const fileHash=digest(path);
  const approvedSelectedAsset=entries.some(asset=>asset.publicationApproved && asset.sha256===fileHash && resolve(publicDirectory,`.${asset.path}`)===path && (asset.purpose!=='indicator-chart' || siteConfig.publication.guideChartApproved));
  if (privateHashes.has(fileHash) && !approvedSelectedAsset) errors.push(`Private reference bytes copied into browser output, including under a renamed file: ${display}`);
  if (publicFiles.includes(path) && path !== manifestFile && !approvedPaths.has(path)) errors.push(`Public file is missing an explicit asset approval: ${display}`);
  if (textExtensions.has(extname(path))) {
    const contents = readFileSync(path, 'utf8');
    if (/https?:\/\/(?:canary\.|ptb\.)?discord(?:app)?\.com\/api(?:\/v\d+)?\/webhooks\/[0-9]+\//i.test(contents)) errors.push(`Discord webhook endpoint found in browser output: ${display}`);
    if (/\bmfa\.[A-Za-z0-9_-]{80,}\b/.test(contents) || /(?:DISCORD_(?:BOT_)?TOKEN|BOT_TOKEN)\s*[=:]\s*["']?[A-Za-z0-9_.-]{30,}/.test(contents)) errors.push(`Possible authentication credential in browser output: ${display}`);
  }
}
if (errors.length) {
  console.error(`Public-asset check failed (${errors.length}):\n${errors.map((error) => `- ${error}`).join('\n')}`);
  process.exitCode = 1;
} else console.log(`Public-asset check passed: ${publicFiles.length} public files, ${buildFiles.length} static/server build files; no unapproved reference bytes or detected credentials. ${existsSync(privateDirectory) ? 'Private-source hash comparison completed.' : 'Private source directory unavailable: hash comparison skipped; manifest and filename/security checks completed.'}`);
