/* Dizarro — portfolio.js · grelha a partir de window.PROJETOS (multilíngue) */
(function () {
  'use strict';
  var grid = document.getElementById('pf-grid');
  if (!grid || !window.PROJETOS) return;

  var ICON = { eletricidade: 'E', telecomunicacoes: 'T', carpintaria: 'C', domotica: 'D' };
  var LKEY = {
    eletricidade: 'pf.filter.elec', telecomunicacoes: 'pf.filter.tel',
    carpintaria: 'pf.filter.carp', domotica: 'pf.filter.domo'
  };

  function pick(v) {
    if (window.i18n && window.i18n.pick) return window.i18n.pick(v);
    return v && typeof v === 'object' ? (v.pt || '') : (v || '');
  }
  function label(servico) {
    var k = LKEY[servico];
    var s = (window.i18n && k) ? window.i18n.t(k) : null;
    return s || servico; /* string controlada (pode conter &amp;) — sem esc */
  }

  function render() {
    grid.innerHTML = window.PROJETOS.map(function (p) {
      var titulo = pick(p.titulo), local = pick(p.local);
      var media = p.capa
        ? '<img class="img" src="' + p.capa + '" width="1200" height="900" loading="lazy" alt="' + esc(titulo) + '" />'
        : '<span class="img" aria-hidden="true"></span>';
      return '<a class="pf-item" href="projeto.html?slug=' + encodeURIComponent(p.slug) + '" data-cat="' + p.servico + '">' +
        media +
        '<span class="tape">' + (ICON[p.servico] || '·') + '</span>' +
        '<div class="cap"><b>' + esc(titulo) + '</b><span>' + label(p.servico) + ' · ' + esc(local) + ' · ' + p.ano + '</span></div>' +
        '</a>';
    }).join('');
    reapplyFilter();
  }

  /* mantém o filtro ativo depois de uma re-renderização (troca de idioma) */
  function reapplyFilter() {
    var active = document.querySelector('.pf-filters button[aria-pressed="true"]');
    var f = active ? active.getAttribute('data-filter') : 'all';
    if (!f || f === 'all') return;
    grid.querySelectorAll('.pf-item').forEach(function (it) {
      it.style.display = (it.getAttribute('data-cat') === f) ? '' : 'none';
    });
  }

  render();
  document.addEventListener('i18n:change', render);

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
})();
