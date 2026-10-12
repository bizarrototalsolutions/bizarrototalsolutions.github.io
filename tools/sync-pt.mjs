#!/usr/bin/env node
/* Dizarro — tools/sync-pt.mjs
   Copia os textos PT de js/i18n.js para o HTML estático (o que os motores de
   busca e as IAs leem SEM correr JavaScript). Assim há uma só fonte de texto.

   Uso:  node tools/sync-pt.mjs          (reescreve os *.html da raiz)
         node tools/sync-pt.mjs --check  (só diz se há diferenças; exit 1 se houver) */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CHECK = process.argv.includes('--check');

/* --- carregar o dicionário correndo i18n.js com um DOM mínimo --- */
const win = {};
const doc = {
  readyState: 'complete', documentElement: { setAttribute() {} }, head: {},
  querySelectorAll: () => [], querySelector: () => null, getElementById: () => null,
  addEventListener() {}, dispatchEvent() {}
};
new Function('window', 'document', 'localStorage', 'navigator', fs.readFileSync(path.join(root, 'js/i18n.js'), 'utf8'))
  (win, doc, { getItem: () => 'pt', setItem() {} }, { language: 'pt' });
const t = (k) => win.i18n.t(k);

const escText = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escAttr = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');

const ATTR = { 'data-i18n-content': 'content', 'data-i18n-alt': 'alt', 'data-i18n-aria': 'aria-label', 'data-i18n-ph': 'placeholder', 'data-i18n-title': 'title' };
const VOID = new Set(['img', 'meta', 'input', 'br', 'link']);

function setAttr(tag, name, value) {
  const re = new RegExp('(\\s' + name + '=")[^"]*(")');
  if (re.test(tag)) return tag.replace(re, (_, a, b) => a + escAttr(value) + b);
  return tag.replace(/\s*\/?>$/, (end) => ' ' + name + '="' + escAttr(value) + '"' + end);
}

function sync(html) {
  let out = '', i = 0, changed = 0, missing = [];
  const tagRe = /<([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>/g;
  let m;
  while ((m = tagRe.exec(html))) {
    let tag = m[0];
    const name = m[1].toLowerCase();
    if (!/data-i18n/.test(tag)) continue;
    let newTag = tag;
    for (const [a, target] of Object.entries(ATTR)) {
      const mm = tag.match(new RegExp('\\s' + a + '="([^"]+)"'));
      if (mm) { const v = t(mm[1]); if (v == null) missing.push(mm[1]); else newTag = setAttr(newTag, target, v); }
    }
    let inner = null, mode = null, key = null;
    let mk = tag.match(/\sdata-i18n-html="([^"]+)"/); if (mk) { mode = 'html'; key = mk[1]; }
    else { mk = tag.match(/\sdata-i18n="([^"]+)"/); if (mk) { mode = 'text'; key = mk[1]; } }
    let end = m.index + tag.length, closeEnd = end;
    if (key && !VOID.has(name)) {
      const v = t(key);
      if (v == null) missing.push(key);
      else {
        // fecho correspondente (conta aninhamento do mesmo nome)
        const re = new RegExp('<(/?)' + name + '\\b[^>]*>', 'gi'); re.lastIndex = end;
        let depth = 1, c;
        while ((c = re.exec(html))) { if (c[1]) depth--; else if (!/\/>$/.test(c[0])) depth++; if (!depth) break; }
        if (c) { inner = mode === 'html' ? v : escText(v); closeEnd = c.index; }
      }
    }
    out += html.slice(i, m.index) + newTag;
    if (inner !== null) { out += inner; i = closeEnd; tagRe.lastIndex = closeEnd; }
    else i = m.index + tag.length;
    if (newTag !== tag || (inner !== null && inner !== html.slice(end, closeEnd))) changed++;
  }
  out += html.slice(i);
  return { out, changed, missing };
}

let diffs = 0;
for (const f of fs.readdirSync(root).filter((x) => x.endsWith('.html'))) {
  const p = path.join(root, f);
  const src = fs.readFileSync(p, 'utf8');
  const { out, changed, missing } = sync(src);
  if (missing.length) console.log('  chaves em falta em', f, [...new Set(missing)]);
  if (out !== src) {
    diffs++;
    console.log((CHECK ? 'diferente: ' : 'atualizado: ') + f + ' (' + changed + ' elementos)');
    if (!CHECK) fs.writeFileSync(p, out);
  }
}
console.log(diffs ? (CHECK ? diffs + ' ficheiro(s) por sincronizar' : diffs + ' ficheiro(s) atualizados') : 'tudo sincronizado');
process.exit(CHECK && diffs ? 1 : 0);
