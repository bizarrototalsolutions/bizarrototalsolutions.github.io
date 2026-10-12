#!/usr/bin/env node
/* Aplica (de forma idempotente) a todas as páginas públicas:
     - CSP + referrer-policy (meta; o GitHub Pages não deixa pôr cabeçalhos HTTP)
     - css/fx.css + script inline do <head> (tema + anti-iframe + loader de entrada)
     - js/fx.js
     - SRI no supabase-js (versão fixa)
   Corre depois de tools/gen-seo.mjs:   node tools/apply-fx.mjs            */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/* script inline único: tema · anti-iframe (clickjacking) · loader de entrada.
   Não mexer sem voltar a correr este ficheiro (o hash CSP muda). */
const EARLY = `(function(){var d=document,e=d.documentElement;
try{var t=localStorage.getItem('dizarro-theme');if(t)e.setAttribute('data-theme',t)}catch(_){}
try{if(top!==self)top.location=self.location}catch(_){e.style.display='none'}
var nav=0;try{var s=sessionStorage.getItem('dz-nav');sessionStorage.removeItem('dz-nav');nav=s&&Date.now()-s<8000}catch(_){}
if((window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)||(navigator.webdriver&&!nav))return;
var done=0,P=function(v){e.style.setProperty('--p',v)};
e.classList.add('fx-on');P(nav?72:6);
function R(){e.classList.remove('fx-on','fx-in','fx-off');e.style.removeProperty('--p')}
function fin(){if(done)return;done=1;P(100);setTimeout(function(){e.classList.add('fx-off');setTimeout(R,420)},nav?380:520)}
function ready(){var f=d.fonts&&d.fonts.ready,g=0;if(f){f.then(function(){g=1;fin()});setTimeout(function(){if(!g)fin()},1200)}else fin()}
if(d.readyState!=='loading')ready();else d.addEventListener('DOMContentLoaded',ready);
setTimeout(function(){if(!done)P(nav?88:42)},nav?120:160);
setTimeout(fin,5000);
addEventListener('pageshow',function(v){if(v.persisted){done=1;R()}})
})();`;

const hash = 'sha256-' + crypto.createHash('sha256').update(EARLY, 'utf8').digest('base64');

const SUPABASE_URL_RE = /https:\/\/cdn\.jsdelivr\.net\/npm\/@supabase\/supabase-js@[\d.]+\/dist\/umd\/supabase\.js"[^>]*/;
const SUPABASE_PIN = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.js';
const SUPABASE_SRI = process.env.SUPABASE_SRI || fs.readFileSync(path.join(root, 'tools', 'supabase.sri'), 'utf8').trim();

function csp(html) {
  const cdn = /cdn\.jsdelivr\.net/.test(html);
  const forms = /<form[^>]+data-lead/.test(html);
  return [
    "default-src 'self'",
    `script-src 'self' '${hash}'` + (cdn ? ' https://cdn.jsdelivr.net' : ''),
    "style-src 'self' 'unsafe-inline'",
    "font-src 'self'",
    "img-src 'self' data: https://www.zaask.pt",
    "connect-src 'self'" + (forms ? ' https://*.supabase.co https://formsubmit.co' : ''),
    "form-action 'self'" + (forms ? ' https://formsubmit.co' : ''),
    "frame-src 'none'", "object-src 'none'", "base-uri 'self'", 'upgrade-insecure-requests',
  ].join('; ');
}

const files = fs.readdirSync(root).filter((f) => f.endsWith('.html') && !['login.html', '404.html'].includes(f));
let n = 0;
for (const f of files) {
  const p = path.join(root, f);
  let h = fs.readFileSync(p, 'utf8');
  const o = h;
  // tipo de bundle CSS (home ou páginas interiores) — detetado antes de limpar
  const kind = /css\/home\.css|site-home\.min\.css/.test(h) ? 'home' : 'page';
  // limpar versões anteriores
  h = h.replace(/<!--sec:start-->[\s\S]*?<!--sec:end-->\n?/g, '').replace(/<!--fx:start-->[\s\S]*?<!--fx:end-->\n?/g, '')
       .replace(/<!--font:start-->[\s\S]*?<!--font:end-->\n?/g, '')
       .replace(/<link rel="preconnect" href="https:\/\/fonts\.(googleapis|gstatic)\.com"[^>]*>\n?/g, '')
       .replace(/<link rel="stylesheet" href="https:\/\/fonts\.googleapis\.com[^>]*>\n?/g, '')
       .replace(/<link rel="stylesheet" href="css\/(fonts|tokens|base|home|page|fx|site-home\.min|site-page\.min)\.css" \/>\n?/g, '')
       .replace(/<link rel="stylesheet" href="css\/site-(home|page)\.min\.css" \/>\n?/g, '');
  h = h.replace(/<script>try\{var t=localStorage\.getItem\('dizarro-theme'\)[^<]*<\/script>\n?/g, '');
  // 1) segurança logo a seguir ao viewport
  const sec = `<!--sec:start-->\n<meta http-equiv="Content-Security-Policy" content="${csp(h)}" />\n<meta name="referrer" content="strict-origin-when-cross-origin" />\n<!--sec:end-->\n`;
  h = h.replace(/(<meta name="viewport"[^>]*>\n?)/, `$1${sec}`);
  // 2) fim do head: script inline (corre logo, antes do CSS) + fontes + CSS único
  const fx = '<!--fx:start-->\n<script>' + EARLY + '</script>\n'
    + '<link rel="preload" as="font" type="font/woff2" href="assets/fonts/archivo-latin-600-800.woff2" crossorigin />\n'
    + '<link rel="preload" as="font" type="font/woff2" href="assets/fonts/public-sans-latin-400-500.woff2" crossorigin />\n'
    + `<link rel="stylesheet" href="css/site-${kind}.min.css" />\n<!--fx:end-->\n`;
  h = h.replace('</head>', () => fx + '</head>');
  // 2b) og:image com dimensões e texto alternativo (partilhas mais bonitas)
  h = h.replace(/<meta property="og:image:(width|height|alt|type)"[^>]*>\n?/g, '');
  h = h.replace(/(<meta property="og:image" content="([^"]+)" \/>\n?)/, (m, tag, url) => {
    const brand = /og-dizarro/.test(url);
    const t = (/<title[^>]*>([^<]*)<\/title>/.exec(h) || [, 'Dizarro'])[1].replace(/"/g, '&quot;');
    const alt = brand ? 'Dizarro — pequenos trabalhos técnicos no Grande Porto' : t;
    return `${tag}<meta property="og:image:type" content="image/jpeg" />\n<meta property="og:image:width" content="1200" />\n<meta property="og:image:height" content="${brand ? 630 : 900}" />\n<meta property="og:image:alt" content="${alt}" />\n`;
  });
  // 3) js/fx.js antes do layout.js
  if (!/js\/fx\.js/.test(h)) h = h.replace('<script src="js/layout.js"', '<script src="js/fx.js" defer></script>\n<script src="js/layout.js"');
  // 4) SRI no supabase-js
  h = h.replace(SUPABASE_URL_RE, `${SUPABASE_PIN.replace(/"$/, '')}" integrity="${SUPABASE_SRI}" crossorigin="anonymous" defer`);
  if (h !== o) { fs.writeFileSync(p, h); n++; }
}
console.log(`apply-fx: ${n}/${files.length} páginas atualizadas · hash ${hash}`);
