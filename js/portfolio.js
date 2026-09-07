/* Dizarro — portfolio.js · grelha a partir de window.PROJETOS */
(function () {
  'use strict';
  var grid = document.getElementById('pf-grid');
  if (!grid || !window.PROJETOS) return;
  var ICON = { eletricidade: 'E', telecomunicacoes: 'T', carpintaria: 'C', domotica: 'D' };
  var LABEL = { eletricidade: 'Eletricidade', telecomunicacoes: 'Telecom', carpintaria: 'Carpintaria', domotica: 'Domótica' };

  grid.innerHTML = window.PROJETOS.map(function (p) {
    var media = p.capa
      ? '<img class="img" src="' + p.capa + '" width="1200" height="900" loading="lazy" alt="' + esc(p.titulo) + '" />'
      : '<span class="img" aria-hidden="true"></span>';
    return '<a class="pf-item" href="projeto.html?slug=' + encodeURIComponent(p.slug) + '" data-cat="' + p.servico + '">' +
      media +
      '<span class="tape">' + (ICON[p.servico] || '·') + '</span>' +
      '<div class="cap"><b>' + esc(p.titulo) + '</b><span>' + esc(LABEL[p.servico] || '') + ' · ' + esc(p.local) + ' · ' + p.ano + '</span></div>' +
      '</a>';
  }).join('');

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
})();
