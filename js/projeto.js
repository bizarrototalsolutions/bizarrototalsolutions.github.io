/* Dizarro — projeto.js · hidrata projeto.html a partir de ?slug= (multilíngue) */
(function () {
  'use strict';
  var root = document.getElementById('projeto');
  if (!root || !window.PROJETOS) return;

  var LKEY = {
    eletricidade: 'pf.filter.elec', telecomunicacoes: 'pf.filter.tel',
    carpintaria: 'pf.filter.carp', domotica: 'pf.filter.domo'
  };

  var slug = new URLSearchParams(location.search).get('slug');
  var p = window.PROJETOS.filter(function (x) { return x.slug === slug; })[0];

  function T(k) { var v = window.i18n && window.i18n.t(k); return v == null ? k : v; }
  function P(v) {
    if (window.i18n && window.i18n.pick) return window.i18n.pick(v);
    return v && typeof v === 'object' ? (v.pt || '') : (v || '');
  }
  function svcLabel(s) { return T(LKEY[s]).replace(/&amp;/g, '&'); }

  hydrate();
  document.addEventListener('i18n:change', hydrate);

  function hydrate() {
    /* remove o que foi injetado no <head> na render anterior */
    document.head.querySelectorAll('[data-dyn="1"]').forEach(function (n) { n.remove(); });

    if (!p) {
      document.title = T('proj.notfound') + ' — Dizarro';
      root.innerHTML = '<div class="phead"><h1>' + esc(T('proj.notfound')) + '</h1>' +
        '<p><a href="portfolio.html" style="box-shadow:inset 0 -2px 0 var(--hivis)">' + esc(T('proj.back')) + '</a></p></div>';
      return;
    }

    var titulo = P(p.titulo), resumo = P(p.resumo), local = P(p.local), dur = P(p.duracao);
    var sLabel = svcLabel(p.servico);

    document.title = titulo + ' — Dizarro';
    setMeta('description', resumo);
    setMeta('og:title', titulo + ' — Dizarro', true);
    setMeta('og:description', resumo, true);
    setLink('canonical', 'https://dizarro.pt/projeto.html?slug=' + p.slug);
    ld({
      '@context': 'https://schema.org', '@type': 'CreativeWork', name: titulo, about: sLabel,
      dateCreated: String(p.ano), locationCreated: { '@type': 'Place', name: local },
      creator: { '@type': 'Organization', name: 'Dizarro', url: 'https://dizarro.pt/' }, description: resumo
    });
    ld({
      '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: T('nav.home'), item: 'https://dizarro.pt/' },
        { '@type': 'ListItem', position: 2, name: T('pf.crumb').replace(/&amp;/g, '&'), item: 'https://dizarro.pt/portfolio.html' },
        { '@type': 'ListItem', position: 3, name: titulo, item: 'https://dizarro.pt/projeto.html?slug=' + p.slug }]
    });

    var ba = p.antesDepois ? (
      '<h2 style="font-family:var(--f-display);font-size:var(--t-2);text-transform:uppercase;margin:2.5rem 0 1rem">' + T('proj.baTitle') + '</h2>' +
      '<div class="ba" data-ba aria-label="' + esc(T('svc.baBeforeAria')) + '">' +
        '<img src="' + p.antesDepois.depois + '" alt="' + esc(T('ba.after')) + '" />' +
        '<div class="ba-before"><img src="' + p.antesDepois.antes + '" alt="' + esc(T('ba.before')) + '" /></div>' +
        '<input class="ba-range" type="range" min="0" max="100" value="50" aria-label="' + esc(T('svc.baBeforeAria')) + '" />' +
        '<span class="ba-handle" aria-hidden="true"></span>' +
        '<span class="lbl l">' + T('ba.before') + '</span><span class="lbl r">' + T('ba.after') + '</span>' +
      '</div>'
    ) : '';

    var gal = (p.galeria && p.galeria.length) ? (
      '<div class="pj-gal">' + p.galeria.map(function (s) {
        return '<img src="' + s + '" loading="lazy" alt="' + esc(titulo) + '" />';
      }).join('') + '</div>'
    ) : '';

    var quote = p.testemunho ? (
      '<blockquote class="quote" style="margin-top:2.5rem;max-width:60ch">' +
        '<div class="stars" style="color:var(--hivis);letter-spacing:.15em;font-size:.8rem;margin-bottom:.5rem">★★★★★</div>' +
        '<p style="font-size:1.05rem">“' + esc(P(p.testemunho.texto)) + '”</p>' +
        '<cite style="display:block;margin-top:.9rem;font-family:var(--f-mono);font-size:.66rem;text-transform:uppercase;letter-spacing:.05em;color:var(--graphite)">— ' + esc(p.testemunho.autor) + ' · ' + esc(P(p.testemunho.papel)) + '</cite>' +
      '</blockquote>'
    ) : '';

    var related = window.PROJETOS.filter(function (x) { return x.servico === p.servico && x.slug !== p.slug; }).slice(0, 3);
    var rel = related.length ? (
      '<section class="sh"><div class="sh-head"><span class="sh-no">→</span><h2 class="sh-title">' + T('proj.related') + '</h2></div><div class="pf-grid">' +
      related.map(function (r) {
        var rt = P(r.titulo), rl = P(r.local);
        var m = r.capa ? '<img class="img" src="' + r.capa + '" width="1200" height="900" loading="lazy" alt="' + esc(rt) + '" />' : '<span class="img" aria-hidden="true"></span>';
        return '<a class="pf-item" href="projeto.html?slug=' + encodeURIComponent(r.slug) + '">' + m +
          '<div class="cap"><b>' + esc(rt) + '</b><span>' + esc(rl) + '</span></div></a>';
      }).join('') + '</div></section>'
    ) : '';

    var capaBand = p.capa ? '<div class="photo-band"><img src="' + p.capa + '" width="1200" height="514" loading="lazy" alt="' + esc(titulo) + '" /></div>' : '';

    root.innerHTML =
      '<div class="phead">' +
        '<nav class="crumb"><a href="index.html">' + esc(T('nav.home')) + '</a><span aria-hidden="true">/</span><a href="portfolio.html">' + T('pf.crumb') + '</a><span aria-hidden="true">/</span>' + esc(titulo) + '</nav>' +
        '<h1>' + esc(titulo) + '</h1>' +
        '<p>' + esc(resumo) + '</p>' +
        '<ul class="pj-meta">' +
          li('📍 ' + esc(local)) + li('📅 ' + p.ano) + (dur ? li('⏱️ ' + esc(dur)) : '') + li(sLabel) +
        '</ul>' +
      '</div>' +
      capaBand +
      '<section class="sh">' +
        block(T('proj.challenge'), P(p.desafio)) +
        block(T('proj.solution'), P(p.solucao)) +
        block(T('proj.result'), P(p.resultado)) +
        (p.destaques && p.destaques.length ? '<div class="pj-hi"><h3>' + T('proj.highlights') + '</h3><ul>' + p.destaques.map(function (d) { return '<li>' + esc(P(d)) + '</li>'; }).join('') + '</ul></div>' : '') +
        ba + gal + quote +
        '<div class="cta-row" style="margin-top:2.5rem">' +
          '<a class="btn btn--hivis" href="contactos.html?servico=' + p.servico + '#orcamento">' + esc(T('proj.ctaWant')) + '</a>' +
          '<a class="btn btn--ghost" href="portfolio.html">' + esc(T('proj.viewAll')) + '</a>' +
        '</div>' +
      '</section>' + rel;

    if (window.__wireBA) window.__wireBA(root);
  }

  function block(t, x) { return x ? '<div class="pj-block"><h2>' + esc(t) + '</h2><p>' + esc(x) + '</p></div>' : ''; }
  function li(x) { return '<li>' + x + '</li>'; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function setMeta(n, v, prop) {
    var sel = prop ? 'meta[property="' + n + '"]' : 'meta[name="' + n + '"]';
    var el = document.head.querySelector(sel);
    if (!el) { el = document.createElement('meta'); el.setAttribute(prop ? 'property' : 'name', n); el.setAttribute('data-dyn', '1'); document.head.appendChild(el); }
    el.setAttribute('content', v);
  }
  function setLink(rel, href) {
    var el = document.head.querySelector('link[rel="' + rel + '"]');
    if (!el) { el = document.createElement('link'); el.rel = rel; el.setAttribute('data-dyn', '1'); document.head.appendChild(el); }
    el.href = href;
  }
  function ld(o) { var s = document.createElement('script'); s.type = 'application/ld+json'; s.setAttribute('data-dyn', '1'); s.textContent = JSON.stringify(o); document.head.appendChild(s); }
})();
