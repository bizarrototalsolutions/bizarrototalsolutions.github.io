/* ============================================================
   BTS – cookie-consent.js
   Banner de consentimento de cookies (RGPD/ePrivacy). A escolha
   fica guardada em localStorage. O único elemento do site que usa
   cookies de terceiros é o mapa incorporado do Google Maps — só
   carrega depois de o visitante aceitar; se rejeitar, fica um
   link direto para o Google Maps em vez do iframe.

   Corre ANTES do i18n.js (ver ordem dos <script> em cada página)
   para que os elementos injetados aqui, marcados com data-i18n,
   sejam traduzidos automaticamente pelo apply() do i18n.js.
   ============================================================ */

(function () {
  'use strict';

  var CONSENT_KEY = 'bts-cookie-consent'; // 'accepted' | 'rejected'

  function getConsent() {
    try { return localStorage.getItem(CONSENT_KEY); } catch (e) { return null; }
  }

  function t(key, fallback) {
    if (window.BTSi18n && window.BTSi18n.translate) {
      var lang = window.BTSi18n.getLang ? window.BTSi18n.getLang() : 'pt';
      var val = window.BTSi18n.translate(key, lang);
      if (val != null) return val;
    }
    return fallback;
  }

  function policyPath() {
    return window.location.pathname.indexOf('/pages/') !== -1
      ? 'politica-privacidade.html'
      : 'pages/politica-privacidade.html';
  }

  function loadMap(wrapper) {
    if (!wrapper || wrapper.querySelector('iframe')) return;
    var src = wrapper.getAttribute('data-map-src');
    if (!src) return;
    var iframe = document.createElement('iframe');
    iframe.src = src;
    iframe.loading = 'lazy';
    iframe.title = wrapper.getAttribute('data-map-title') || 'Mapa';
    iframe.referrerPolicy = 'no-referrer-when-downgrade';
    iframe.setAttribute('allowfullscreen', '');
    wrapper.innerHTML = '';
    wrapper.appendChild(iframe);
  }

  function showMapPlaceholder(wrapper) {
    if (!wrapper) return;
    var externalUrl = wrapper.getAttribute('data-map-external') || 'https://maps.google.com/';
    wrapper.innerHTML =
      '<div class="map-consent-placeholder">' +
        '<p data-i18n="cookies.map.placeholder">' + t('cookies.map.placeholder', 'Aceite os cookies para ver o mapa do Google Maps.') + '</p>' +
        '<div class="map-consent-actions">' +
          '<button type="button" class="btn btn-primary btn-sm" data-map-accept data-i18n="cookies.accept">' + t('cookies.accept', 'Aceitar') + '</button>' +
          '<a href="' + externalUrl + '" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm" data-i18n="cookies.map.openExternal">' + t('cookies.map.openExternal', 'Abrir no Google Maps') + '</a>' +
        '</div>' +
      '</div>';
    var btn = wrapper.querySelector('[data-map-accept]');
    if (btn) btn.addEventListener('click', function () { setConsent('accepted'); });
  }

  function applyConsent(value) {
    document.querySelectorAll('[data-map-embed]').forEach(function (wrapper) {
      if (value === 'accepted') loadMap(wrapper);
      else showMapPlaceholder(wrapper);
    });
    var banner = document.getElementById('cookie-banner');
    if (banner) banner.hidden = !!value;
  }

  function setConsent(value) {
    try { localStorage.setItem(CONSENT_KEY, value); } catch (e) {}
    applyConsent(value);
  }

  function openBanner() {
    var banner = document.getElementById('cookie-banner');
    if (banner) banner.hidden = false;
  }

  function buildBanner() {
    if (document.getElementById('cookie-banner')) return;
    var el = document.createElement('div');
    el.id = 'cookie-banner';
    el.className = 'cookie-banner';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-label', 'Consentimento de cookies');
    el.hidden = !!getConsent();
    el.innerHTML =
      '<div class="cookie-banner-inner">' +
        '<p>' +
          '<span data-i18n="cookies.text">' + t('cookies.text', 'Usamos apenas cookies essenciais para o site funcionar. O mapa incorporado só carrega com o seu consentimento —') + '</span>' +
          ' <a href="' + policyPath() + '" data-i18n="cookies.policyLinkText">' + t('cookies.policyLinkText', 'Política de Privacidade e Cookies') + '</a>.' +
        '</p>' +
        '<div class="cookie-banner-actions">' +
          '<button type="button" class="btn btn-outline btn-sm" data-cookie-reject data-i18n="cookies.reject">' + t('cookies.reject', 'Rejeitar') + '</button>' +
          '<button type="button" class="btn btn-primary btn-sm" data-cookie-accept data-i18n="cookies.accept">' + t('cookies.accept', 'Aceitar') + '</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(el);
    el.querySelector('[data-cookie-accept]').addEventListener('click', function () { setConsent('accepted'); });
    el.querySelector('[data-cookie-reject]').addEventListener('click', function () { setConsent('rejected'); });
  }

  function wireManageLinks() {
    document.querySelectorAll('[data-cookie-manage]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        openBanner();
      });
    });
  }

  buildBanner();
  wireManageLinks();
  applyConsent(getConsent());

  window.BTSCookies = { open: openBanner, getConsent: getConsent, setConsent: setConsent };
})();
