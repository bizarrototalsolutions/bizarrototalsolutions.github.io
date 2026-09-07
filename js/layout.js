/* ============================================================
   Dizarro — layout.js
   Header, footer e botão de WhatsApp gerados de UMA config.
   Cada página tem só <main> + <div data-layout="header/footer">.
   Carrega ANTES de main.js.
   ============================================================ */
(function () {
  'use strict';

  var BRAND = {
    tel: '+351932344080',
    telText: '932 344 080',
    email: 'bizarrototalsolutions@gmail.com',
    wa: 'https://wa.me/351932344080?text=Ol%C3%A1%21+Gostaria+de+um+or%C3%A7amento.',
    instagram: 'https://instagram.com/bizarrototalsolutions/'
  };

  var NAV = [
    ['index.html', 'Início', 'nav.home'],
    ['servicos.html', 'Serviços', 'nav.services'],
    ['portfolio.html', 'Trabalhos', 'nav.works'],
    ['sobre.html', 'Sobre', 'nav.about'],
    ['contactos.html', 'Contactos', 'nav.contact']
  ];

  var here = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  var SERVICE_PAGES = ['eletricidade.html','telecomunicacoes.html','carpintaria.html','domotica.html'];
  function activeFor(href) {
    if (href === here) return true;
    if (href === 'servicos.html' && SERVICE_PAGES.indexOf(here) !== -1) return true;
    if (href === 'portfolio.html' && here === 'projeto.html') return true;
    return false;
  }

  var WA_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.2-1.2-.5-2.4-1.5-.9-.8-1.5-1.8-1.6-2-.2-.3 0-.5.1-.6l.4-.5c.2-.2.2-.3.3-.5.1-.2.1-.4 0-.5 0-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.5c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3c.1.2 2.1 3.2 5 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.5-.3M12 2a10 10 0 0 0-8.5 15.3L2 22l4.8-1.3A10 10 0 1 0 12 2"/></svg>';

  function headerHTML() {
    var links = NAV.map(function (n) {
      return '<a href="' + n[0] + '"' + (activeFor(n[0]) ? ' aria-current="page"' : '') +
        ' data-i18n="' + n[2] + '">' + n[1] + '</a>';
    }).join('');
    return '' +
      '<a class="skip" href="#main" data-i18n="ui.skip">Saltar para o conteúdo</a>' +
      '<header class="site">' +
        '<div class="bar">' +
          '<a class="brand" href="index.html" aria-label="Dizarro — início"><img src="assets/brand/logo-dizarro.webp" width="384" height="384" alt="Dizarro" decoding="async" /></a>' +
          '<button class="burger" id="burger" aria-expanded="false" aria-controls="nav" data-i18n-aria="ui.menu" aria-label="Abrir menu"><span></span><span></span><span></span></button>' +
          '<nav class="nav" id="nav" aria-label="Principal">' + links + '</nav>' +
          '<div class="bar-tools">' +
            '<a class="tel" href="tel:' + BRAND.tel + '">T · ' + BRAND.telText + '</a>' +
            '<div id="lang-slot"></div>' +
            '<button class="icon-btn" id="theme-btn" data-i18n-aria="ui.theme" aria-label="Alternar tema claro/escuro" title="Tema">◐</button>' +
            '<a class="btn btn--hivis btn--sm" href="contactos.html#orcamento" data-i18n="ui.quote">Orçamento</a>' +
          '</div>' +
        '</div>' +
      '</header>';
  }

  function footerHTML() {
    var y = new Date().getFullYear();
    return '' +
      '<footer class="site"><div class="foot-in">' +
        '<div class="foot-grid">' +
          '<div>' +
            '<a class="brand brand--foot" href="index.html" aria-label="Dizarro — início"><img src="assets/brand/logo-dizarro.webp" width="384" height="384" alt="Dizarro" loading="lazy" decoding="async" /></a>' +
            '<p style="max-width:34ch" data-i18n="foot.blurb">Obras técnicas na região do Porto — eletricidade, carpintaria, telecomunicações e domótica, com um só interlocutor.</p>' +
          '</div>' +
          '<div><h4 data-i18n="foot.services">Serviços</h4>' +
            '<a href="eletricidade.html" data-i18n="foot.svc.elec">Eletricidade</a>' +
            '<a href="telecomunicacoes.html" data-i18n-html="foot.svc.tel">Telecom &amp; Redes</a>' +
            '<a href="carpintaria.html" data-i18n="foot.svc.carp">Carpintaria</a>' +
            '<a href="domotica.html" data-i18n="foot.svc.domo">Domótica</a>' +
          '</div>' +
          '<div><h4 data-i18n="foot.contact">Contacto</h4>' +
            '<a href="tel:' + BRAND.tel + '">' + BRAND.telText + '</a>' +
            '<a href="mailto:' + BRAND.email + '">' + BRAND.email + '</a>' +
            '<a href="' + BRAND.wa + '" target="_blank" rel="noopener">WhatsApp</a>' +
            '<a href="' + BRAND.instagram + '" target="_blank" rel="noopener">Instagram</a>' +
            '<p>Padrão da Légua, Matosinhos</p>' +
          '</div>' +
        '</div>' +
        '<div class="cartouche" aria-hidden="true">' +
          '<div><div class="kk" data-i18n="foot.cart.project">Projeto</div><div class="vv">Dizarro · Web</div></div>' +
          '<div><div class="kk" data-i18n="foot.cart.scale">Escala</div><div class="vv">1:1</div></div>' +
          '<div><div class="kk" data-i18n="foot.cart.area">Zona</div><div class="vv">Grande Porto</div></div>' +
          '<div><div class="kk" data-i18n="foot.cart.rev">Revisão</div><div class="vv">' + y + '</div></div>' +
        '</div>' +
        '<p class="fineprint">© ' + y + ' Dizarro — Bizarro Total Solutions · <span data-i18n="foot.slogan">Soluções Inteligentes, Resultados Excelentes</span> · <a href="politica-privacidade.html" style="box-shadow:inset 0 -1px 0 var(--hivis)" data-i18n="foot.privacy">Privacidade</a></p>' +
      '</div></footer>' +
      '<a class="wa" href="' + BRAND.wa + '" target="_blank" rel="noopener" data-i18n-aria="ui.wa" aria-label="Contactar por WhatsApp">' + WA_SVG + '</a>';
  }

  var h = document.querySelector('[data-layout="header"]');
  var f = document.querySelector('[data-layout="footer"]');
  if (h) h.outerHTML = headerHTML();
  if (f) f.outerHTML = footerHTML();

  var main = document.querySelector('main');
  if (main && !main.id) main.id = 'main';

  window.DIZARRO = BRAND;
})();
