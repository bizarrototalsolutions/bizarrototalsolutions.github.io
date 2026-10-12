#!/usr/bin/env node
/* Reconstrói TUDO pela ordem certa:  node tools/build.mjs
   (fotos novas? corre antes: python tools/import-obras.py <pasta> && python tools/make-webp.py) */
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const steps = [
  ['node', 'tools/gen-seo.mjs'],
  ['node', 'tools/build-css.mjs'],
  ['node', 'tools/prerender-layout.mjs'],
  ['node', 'tools/sync-pt.mjs'],
  ['node', 'tools/apply-fx.mjs'],
  ['python', 'tools/img-attrs.py'],
  ['node', 'tools/sync-pt.mjs', '--check'],
];
for (const [cmd, ...args] of steps) {
  console.log(`\n▶ ${cmd} ${args.join(' ')}`);
  const r = spawnSync(cmd, args, { cwd: root, stdio: 'inherit' });
  if (r.status !== 0) { console.error(`✗ falhou: ${cmd} ${args.join(' ')}`); process.exit(r.status || 1); }
}
console.log('\n✓ build concluído');
