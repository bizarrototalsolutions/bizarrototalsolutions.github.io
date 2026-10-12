#!/usr/bin/env node
/* Junta e minifica o CSS num único ficheiro por tipo de página (menos pedidos, menos bytes):
     css/site-home.min.css = fonts + tokens + base + home + fx
     css/site-page.min.css = fonts + tokens + base + page + fx
   Os ficheiros-fonte (tokens/base/home/page/fx/fonts.css) continuam a ser os que se editam.
   Corre:  node tools/build-css.mjs   (o apply-fx.mjs passa a ligar o bundle nas páginas) */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const css = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'css');
const read = (f) => fs.readFileSync(path.join(css, f), 'utf8');

function min(s) {
  return s
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{};,>])\s*/g, '$1')
    .replace(/;}/g, '}')
    .replace(/\s*:\s*(?=[^{}]*[;}])/g, ':')   // espaços à volta de ':' só em declarações
    .trim();
}

for (const [name, parts] of [
  ['site-home.min.css', ['fonts.css', 'tokens.css', 'base.css', 'home.css', 'fx.css']],
  ['site-page.min.css', ['fonts.css', 'tokens.css', 'base.css', 'page.css', 'fx.css']],
]) {
  const out = parts.map((p) => min(read(p))).join('\n');
  fs.writeFileSync(path.join(css, name), out + '\n');
  console.log(name, (out.length / 1024).toFixed(1), 'KB (de', (parts.reduce((n, p) => n + read(p).length, 0) / 1024).toFixed(1), 'KB)');
}
