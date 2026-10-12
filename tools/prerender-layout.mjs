#!/usr/bin/env node
/* Pré-renderiza o cabeçalho e o rodapé (gerados por js/layout.js) para dentro do HTML,
   para que crawlers sem JavaScript (muitas IAs) vejam menu, contactos e redes sociais.
   O layout.js continua a existir: se o cabeçalho já estiver no HTML, não faz nada.
   Idempotente:  node tools/prerender-layout.mjs   (corre depois de gen-seo; ver README) */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = fs.readFileSync(path.join(root, 'js', 'layout.js'), 'utf8');

function render(file) {
  let hdr = '', ftr = '';
  const slot = (set) => ({ set outerHTML(v) { set(v); } });
  const document = {
    querySelector(sel) {
      if (sel === '[data-layout="header"]') return slot((v) => (hdr = v));
      if (sel === '[data-layout="footer"]') return slot((v) => (ftr = v));
      return null;
    },
  };
  vm.runInNewContext(src, { document, location: { pathname: '/' + file }, window: {}, Date });
  return { hdr, ftr };
}

const files = fs.readdirSync(root).filter((f) => f.endsWith('.html') && !['login.html', '404.html'].includes(f));
let n = 0;
for (const f of files) {
  const p = path.join(root, f);
  let h = fs.readFileSync(p, 'utf8');
  const o = h;
  const { hdr, ftr } = render(f);
  for (const [name, html] of [['header', hdr], ['footer', ftr]]) {
    const block = `<!--layout:${name}-->${html}<!--/layout:${name}-->`;
    const ph = `<div data-layout="${name}"></div>`;
    const re = new RegExp(String.raw`<!--layout:${name}-->[\s\S]*?<!--/layout:${name}-->`);
    if (re.test(h)) h = h.replace(re, () => block);
    else if (h.includes(ph)) h = h.replace(ph, () => block);
  }
  h = h.replace(/<main(?![^>]*\sid=)/, '<main id="main"');
  if (h !== o) { fs.writeFileSync(p, h); n++; }
}
console.log(`prerender-layout: ${n}/${files.length} páginas`);
