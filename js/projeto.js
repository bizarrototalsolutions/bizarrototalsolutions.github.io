/* Dizarro — projeto.js · hidrata projeto.html a partir de ?slug= */
(function () {
  'use strict';
  var LABEL = { eletricidade: 'Eletricidade', telecomunicacoes: 'Telecomunicações & Redes', carpintaria: 'Carpintaria', domotica: 'Domótica' };
  var root = document.getElementById('projeto');
  if (!root || !window.PROJETOS) return;

  var slug = new URLSearchParams(location.search).get('slug');
  var p = window.PROJETOS.filter(function (x) { return x.slug === slug; })[0];

  if (!p) {
    root.innerHTML = '<div class="phead"><h1>Projeto não encontrado</h1><p><a href="portfolio.html" style="box-shadow:inset 0 -2px 0 var(--hivis)">← Ver todos os trabalhos</a></p></div>';
    return;
  }

  document.title = p.titulo + ' — Dizarro';
  setMeta('description', p.resumo);
  setMeta('og:title', p.titulo + ' — Dizarro', true);
  setMeta('og:description', p.resumo, true);
  setLink('canonical', 'https://dizarro.pt/projeto.html?slug=' + p.slug);
  ld({ '@context': 'https://schema.org', '@type': 'CreativeWork', name: p.titulo, about: LABEL[p.servico],
    dateCreated: String(p.ano), locationCreated: { '@type': 'Place', name: p.local },
    creator: { '@type': 'Organization', name: 'Dizarro', url: 'https://dizarro.pt/' }, description: p.resumo });
  ld({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://dizarro.pt/' },
    { '@type': 'ListItem', position: 2, name: 'Trabalhos', item: 'https://dizarro.pt/portfolio.html' },
    { '@type': 'ListItem', position: 3, name: p.titulo, item: 'https://dizarro.pt/projeto.html?slug=' + p.slug } ] });

  var ba = p.antesDepois ? (
    '<h2 style="font-family:var(--f-display);font-size:var(--t-2);text-transform:uppercase;margin:2.5rem 0 1rem">Antes &amp; depois</h2>' +
    '<div class="ba" data-ba aria-label="Comparação antes e depois">' +
      '<img src="' + p.antesDepois.depois + '" alt="Depois" />' +
      '<div class="ba-before"><img src="' + p.antesDepois.antes + '" alt="Antes" /></div>' +
      '<input class="ba-range" type="range" min="0" max="100" value="50" aria-label="Cursor de comparação" />' +
      '<span class="ba-handle" aria-hidden="true"></span>' +
      '<span class="lbl l">Antes</span><span class="lbl r">Depois</span>' +
    '</div>'
  ) : '';

  var gal = (p.galeria && p.galeria.length) ? (
    '<div class="pj-gal">' + p.galeria.map(function (s) {
      return '<img src="' + s + '" loading="lazy" alt="' + esc(p.titulo) + '" />';
    }).join('') + '</div>'
  ) : '';

  var quote = p.testemunho ? (
    '<blockquote class="quote" style="margin-top:2.5rem;max-width:60ch">' +
      '<div class="stars" style="color:var(--hivis);letter-spacing:.15em;font-size:.8rem;margin-bottom:.5rem">★★★★★</div>' +
      '<p style="font-size:1.05rem">“' + esc(p.testemunho.texto) + '”</p>' +
      '<cite style="display:block;margin-top:.9rem;font-family:var(--f-mono);font-size:.66rem;text-transform:uppercase;letter-spacing:.05em;color:var(--graphite)">— ' + esc(p.testemunho.autor) + ' · ' + esc(p.testemunho.papel) + '</cite>' +
    '</blockquote>'
  ) : '';

  var related = window.PROJETOS.filter(function (x) { return x.servico === p.servico && x.slug !== p.slug; }).slice(0, 3);
  var rel = related.length ? (
    '<section class="sh"><div class="sh-head"><span class="sh-no">→</span><h2 class="sh-title">Relacionados</h2></div><div class="pf-grid">' +
    related.map(function (r) {
      var m = r.capa ? '<img class="img" src="' + r.capa + '" width="1200" height="900" loading="lazy" alt="' + esc(r.titulo) + '" />' : '<span class="img" aria-hidden="true"></span>';
      return '<a class="pf-item" href="projeto.html?slug=' + encodeURIComponent(r.slug) + '">' + m +
        '<div class="cap"><b>' + esc(r.titulo) + '</b><span>' + esc(r.local) + '</span></div></a>';
    }).join('') + '</div></section>'
  ) : '';

  var capaBand = p.capa ? '<div class="photo-band"><img src="' + p.capa + '" width="1200" height="514" loading="lazy" alt="' + esc(p.titulo) + '" /></div>' : '';

  root.innerHTML =
    '<div class="phead">' +
      '<nav class="crumb"><a href="index.html">Início</a><span aria-hidden="true">/</span><a href="portfolio.html">Trabalhos</a><span aria-hidden="true">/</span>' + esc(p.titulo) + '</nav>' +
      '<h1>' + esc(p.titulo) + '</h1>' +
      '<p>' + esc(p.resumo) + '</p>' +
      '<ul class="pj-meta">' +
        li('📍 ' + p.local) + li('📅 ' + p.ano) + (p.duracao ? li('⏱️ ' + p.duracao) : '') + li(LABEL[p.servico]) +
      '</ul>' +
    '</div>' +
    capaBand +
    '<section class="sh">' +
      block('O desafio', p.desafio) +
      block('A nossa solução', p.solucao) +
      block('O resultado', p.resultado) +
      (p.destaques && p.destaques.length ? '<div class="pj-hi"><h3>Destaques</h3><ul>' + p.destaques.map(function (d) { return '<li>' + esc(d) + '</li>'; }).join('') + '</ul></div>' : '') +
      ba + gal + quote +
      '<div class="cta-row" style="margin-top:2.5rem">' +
        '<a class="btn btn--hivis" href="contactos.html?servico=' + p.servico + '#orcamento">Quero algo parecido</a>' +
        '<a class="btn btn--ghost" href="portfolio.html">Ver todos os trabalhos</a>' +
      '</div>' +
    '</section>' + rel;

  if (window.__wireBA) window.__wireBA();

  function block(t, x) { return x ? '<div class="pj-block"><h2>' + esc(t) + '</h2><p>' + esc(x) + '</p></div>' : ''; }
  function li(x) { return '<li>' + esc(x) + '</li>'; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function setMeta(n, v, prop) {
    var sel = prop ? 'meta[property="' + n + '"]' : 'meta[name="' + n + '"]';
    var el = document.head.querySelector(sel);
    if (!el) { el = document.createElement('meta'); el.setAttribute(prop ? 'property' : 'name', n); document.head.appendChild(el); }
    el.setAttribute('content', v);
  }
  function setLink(rel, href) {
    var el = document.head.querySelector('link[rel="' + rel + '"]');
    if (!el) { el = document.createElement('link'); el.rel = rel; document.head.appendChild(el); }
    el.href = href;
  }
  function ld(o) { var s = document.createElement('script'); s.type = 'application/ld+json'; s.textContent = JSON.stringify(o); document.head.appendChild(s); }
})();
