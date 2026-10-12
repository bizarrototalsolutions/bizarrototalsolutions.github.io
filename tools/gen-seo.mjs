#!/usr/bin/env node
/* Dizarro — tools/gen-seo.mjs
   Gera, a partir de js/portfolio-data.js e js/i18n.js (PT):
     1. obra-<slug>.html  — uma página estática e indexável por trabalho
                            (o Google e as IAs leem o texto sem correr JavaScript)
     2. sitemap.xml
     3. JSON-LD da home (negócio local + site + FAQ iguais ao texto visível)
   Uso:  node tools/gen-seo.mjs        (depois: node tools/sync-pt.mjs --check) */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://dizarro.pt';
const TODAY = new Date().toISOString().slice(0, 10);

/* ---- dados ---- */
const w = {};
new Function('window', fs.readFileSync(path.join(root, 'js/portfolio-data.js'), 'utf8'))(w);
const P = w.PROJETOS;
const dw = {};
new Function('window', 'document', 'localStorage', 'navigator', fs.readFileSync(path.join(root, 'js/i18n.js'), 'utf8'))(
  dw, { readyState: 'complete', documentElement: { setAttribute() {} }, querySelectorAll: () => [], getElementById: () => null, addEventListener() {}, dispatchEvent() {} },
  { getItem: () => 'pt', setItem() {} }, { language: 'pt' });
const t = (k) => dw.i18n.t(k);
const pt = (o) => (o && typeof o === 'object' ? o.pt : o) || '';
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const plain = (s) => String(s).replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ');
const LABEL = { eletricidade: 'Eletricidade', telecomunicacoes: 'Telecom & Redes', carpintaria: 'Carpintaria', pinturas: 'Pinturas' };
const url = (slug) => 'obra-' + slug + '.html';
const trim160 = (s) => (s.length <= 158 ? s : s.slice(0, 157).replace(/\s+\S*$/, '') + '…');

/* ---- 1. páginas de trabalhos ---- */
function body(p) {
  const titulo = pt(p.titulo), resumo = pt(p.resumo), local = pt(p.local);
  const blk = (h, x) => (x ? `<div class="pj-block"><h2>${esc(h)}</h2><p>${esc(x)}</p></div>` : '');
  const ba = p.antesDepois
    ? `<h2 style="font-family:var(--f-display);font-size:var(--t-2);text-transform:uppercase;margin:2.5rem 0 1rem">${t('proj.baTitle')}</h2>` +
      `<div class="ba${p.antesDepois.tall ? ' ba--tall' : ''}" data-ba aria-label="${esc(t('svc.baBeforeAria'))}"><img src="${p.antesDepois.depois}" alt="${esc(t('ba.after'))}" />` +
      `<div class="ba-before"><img src="${p.antesDepois.antes}" alt="${esc(t('ba.before'))}" /></div>` +
      `<input class="ba-range" type="range" min="0" max="100" value="50" aria-label="${esc(t('svc.baBeforeAria'))}" />` +
      `<span class="ba-handle" aria-hidden="true"></span><span class="lbl l">${t('ba.before')}</span><span class="lbl r">${t('ba.after')}</span></div>`
    : '';
  const gal = p.galeria && p.galeria.length
    ? '<div class="pj-gal">' + p.galeria.map((s) => `<img src="${s}" loading="lazy" alt="${esc(titulo)}" />`).join('') + '</div>' : '';
  const q = p.testemunho
    ? `<blockquote class="quote" style="margin-top:2.5rem;max-width:60ch"><div class="stars" style="color:var(--hivis);letter-spacing:.15em;font-size:.8rem;margin-bottom:.5rem">★★★★★</div>` +
      `<p style="font-size:1.05rem">“${esc(pt(p.testemunho.texto))}”</p><cite style="display:block;margin-top:.9rem;font-family:var(--f-mono);font-size:.66rem;text-transform:uppercase;letter-spacing:.05em;color:var(--graphite)">— ${esc(p.testemunho.autor)} · ${esc(pt(p.testemunho.papel))}</cite></blockquote>` : '';
  const rel = P.filter((x) => x.servico === p.servico && x.slug !== p.slug).slice(0, 3);
  const relH = rel.length
    ? `<section class="sh"><div class="sh-head"><span class="sh-no">→</span><h2 class="sh-title">${t('proj.related')}</h2></div><div class="pf-grid">` +
      rel.map((r) => `<a class="pf-item" href="${url(r.slug)}"><img class="img" src="${r.capa}" width="1200" height="900" loading="lazy" alt="${esc(pt(r.titulo))}" /><div class="cap"><b>${esc(pt(r.titulo))}</b><span>${esc(pt(r.local))}</span></div></a>`).join('') + '</div></section>' : '';
  return `<div class="phead"><nav class="crumb"><a href="index.html">${esc(t('nav.home'))}</a><span aria-hidden="true">/</span><a href="portfolio.html">${t('pf.crumb')}</a><span aria-hidden="true">/</span>${esc(titulo)}</nav>` +
    `<h1>${esc(titulo)}</h1><p>${esc(resumo)}</p><ul class="pj-meta"><li>📍 ${esc(local)}</li>${p.ano ? `<li>📅 ${p.ano}</li>` : ''}<li>${esc(LABEL[p.servico])}</li></ul></div>` +
    `<section class="sh">${blk(t('proj.challenge'), pt(p.desafio))}${blk(t('proj.solution'), pt(p.solucao))}${blk(t('proj.result'), pt(p.resultado))}` +
    (p.destaques && p.destaques.length ? `<div class="pj-hi"><h3>${t('proj.highlights')}</h3><ul>${p.destaques.map((d) => `<li>${esc(pt(d))}</li>`).join('')}</ul></div>` : '') +
    `${ba}${gal}${q}<div class="cta-row" style="margin-top:2.5rem"><a class="btn btn--hivis" href="contactos.html?servico=${p.servico}#orcamento">${esc(t('proj.ctaWant'))}</a>` +
    `<a class="btn btn--ghost" href="portfolio.html">${esc(t('proj.viewAll'))}</a></div></section>${relH}`;
}

function page(p) {
  const titulo = pt(p.titulo), resumo = pt(p.resumo), desc = trim160(resumo + ' ' + pt(p.resultado));
  const canon = `${SITE}/${url(p.slug)}`;
  const ldWork = { '@context': 'https://schema.org', '@type': 'CreativeWork', name: titulo, about: LABEL[p.servico], inLanguage: 'pt-PT',
    ...(p.ano ? { dateCreated: String(p.ano) } : {}), locationCreated: { '@type': 'Place', name: pt(p.local) }, image: `${SITE}/${p.capa}`, url: canon,
    creator: { '@type': 'Organization', name: 'Dizarro', url: SITE + '/' }, description: resumo };
  const ldCrumb = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Início', item: SITE + '/' },
    { '@type': 'ListItem', position: 2, name: 'Trabalhos', item: SITE + '/portfolio.html' },
    { '@type': 'ListItem', position: 3, name: titulo, item: canon }] };
  return `<!DOCTYPE html>
<html lang="pt">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
<meta name="theme-color" content="#EF4A11" />
<title>${esc(trim160(titulo + ' — Dizarro').slice(0, 70))}</title>
<meta name="description" content="${esc(desc)}" />
<meta name="author" content="Dizarro" />
<link rel="canonical" href="${canon}" />
<meta property="og:type" content="article" />
<meta property="og:site_name" content="Dizarro" />
<meta property="og:title" content="${esc(titulo)} — Dizarro" />
<meta property="og:description" content="${esc(desc)}" />
<meta property="og:url" content="${canon}" />
<meta property="og:locale" content="pt_PT" />
<meta property="og:locale:alternate" content="en_GB" />
<meta property="og:locale:alternate" content="es_ES" />
<meta property="og:locale:alternate" content="fr_FR" />
<meta property="og:image" content="${SITE}/${p.capa}" />
<meta name="twitter:card" content="summary_large_image" />
<link rel="icon" type="image/png" sizes="32x32" href="assets/images/favicon-32x32.png" />
<link rel="icon" type="image/png" sizes="16x16" href="assets/images/favicon-16x16.png" />
<link rel="icon" href="favicon.ico" sizes="any" />
<link rel="apple-touch-icon" href="assets/images/apple-touch-icon.png" />
<link rel="manifest" href="site.webmanifest" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wght@600;700;800&family=IBM+Plex+Mono:wght@400;500&family=Public+Sans:ital,wght@0,400;0,500;1,400&display=swap" />
<link rel="stylesheet" href="css/tokens.css" />
<link rel="stylesheet" href="css/base.css" />
<link rel="stylesheet" href="css/page.css" />
<script>try{var t=localStorage.getItem('dizarro-theme');if(t)document.documentElement.setAttribute('data-theme',t);}catch(e){}</script>
<script type="application/ld+json">
${JSON.stringify(ldWork)}
</script>
<script type="application/ld+json">
${JSON.stringify(ldCrumb)}
</script>
</head>
<body>
<div data-layout="header"></div>

<main>
<div class="sheet">
  <div id="projeto" data-slug="${p.slug}" aria-live="polite">${body(p)}</div>
</div>
</main>

<div data-layout="footer"></div>
<script src="js/layout.js" defer></script>
<script src="js/i18n.js" defer></script>
<script src="js/main.js" defer></script>
<script src="js/portfolio-data.js" defer></script>
<script src="js/projeto.js" defer></script>
</body>
</html>
`;
}

for (const f of fs.readdirSync(root).filter((x) => /^obra-.*\.html$/.test(x))) fs.unlinkSync(path.join(root, f));
for (const p of P) fs.writeFileSync(path.join(root, url(p.slug)), page(p));
console.log('páginas de trabalhos:', P.length);

/* ---- 2. sitemap ---- */
const core = [['', 1.0, 'monthly'], ['servicos.html', 0.8, 'monthly'], ['eletricidade.html', 0.9, 'monthly'], ['telecomunicacoes.html', 0.9, 'monthly'],
  ['carpintaria.html', 0.9, 'monthly'], ['pinturas.html', 0.8, 'monthly'], ['portfolio.html', 0.8, 'weekly'], ['sobre.html', 0.6, 'monthly'], ['contactos.html', 0.9, 'monthly']];
const sm = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
  .concat(core.map(([u, pr, cf]) => `  <url><loc>${SITE}/${u}</loc><lastmod>${TODAY}</lastmod><changefreq>${cf}</changefreq><priority>${pr.toFixed(1)}</priority></url>`))
  .concat(P.map((p) => `  <url><loc>${SITE}/${url(p.slug)}</loc><lastmod>${TODAY}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>`))
  .concat(['</urlset>', '']).join('\n');
fs.writeFileSync(path.join(root, 'sitemap.xml'), sm);
console.log('sitemap:', core.length + P.length, 'urls');

/* ---- 3. JSON-LD da home ---- */
const svc = [['Eletricidade', 'eletricidade.html', 'Troca de tomadas, interruptores, luminárias e disjuntores, e pequenas reparações elétricas em casa.'],
  ['Redes, Wi-Fi e sites', 'telecomunicacoes.html', 'Passagem de cabos de internet e TV, otimização do Wi-Fi, montagem e ligação de televisões e criação de sites simples.'],
  ['Carpintaria e montagem', 'carpintaria.html', 'Montagem de móveis e prateleiras, reparação de madeira, troca de dobradiças e montagem de exaustores.'],
  ['Pinturas', 'pinturas.html', 'Pintura de móveis, janelas e portas, caixilharia de castanho para branco e pequenos retoques.']];
const graph = { '@context': 'https://schema.org', '@graph': [
  { '@type': 'HomeAndConstructionBusiness', '@id': SITE + '/#negocio', name: 'Dizarro', url: SITE + '/',
    description: plain(t('home.desc')), logo: SITE + '/assets/brand/logo-dizarro.png', image: SITE + '/assets/brand/og-dizarro.jpg',
    telephone: '+351932344080', email: 'dizarro.pt@gmail.com',
    foundingDate: '2026-10-13',
    address: { '@type': 'PostalAddress', addressLocality: 'Porto', addressRegion: 'Porto', addressCountry: 'PT' },
    areaServed: { '@type': 'GeoCircle', geoMidpoint: { '@type': 'GeoCoordinates', latitude: 41.1579, longitude: -8.6291 }, geoRadius: '100000' },
    founder: { '@type': 'Person', name: 'Diogo Bizarro' }, sameAs: ['https://www.facebook.com/Dizarro.PT', 'https://www.tiktok.com/@dizarro.pt'],
    contactPoint: { '@type': 'ContactPoint', telephone: '+351932344080', contactType: 'customer service', areaServed: 'PT', availableLanguage: ['pt'] },
    hasOfferCatalog: { '@type': 'OfferCatalog', name: 'Serviços', itemListElement: svc.map(([n, u, d]) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: n, description: d, url: `${SITE}/${u}`, areaServed: 'Grande Porto' } })) } },
  { '@type': 'WebSite', '@id': SITE + '/#site', url: SITE + '/', name: 'Dizarro', inLanguage: 'pt-PT', publisher: { '@id': SITE + '/#negocio' } }] };
const faq = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [1, 2, 3, 4].map((n) => ({ '@type': 'Question', name: plain(t(`home.faq${n}.q`)), acceptedAnswer: { '@type': 'Answer', text: plain(t(`home.faq${n}.a`)) } })) };
let idx = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
let n = 0;
idx = idx.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g, (m) => {
  n++; return `<script type="application/ld+json">\n${JSON.stringify(n === 1 ? graph : faq)}\n</script>`;
});
fs.writeFileSync(path.join(root, 'index.html'), idx);
console.log('JSON-LD da home:', n, 'blocos');
