/* ============================================================
   Dizarro — fx.js
   · transição entre páginas (loader "DIZARRO" a encher)
   · barra de progresso do scroll
   · anel de cursor que segue o rato (desktop)
   · pré-carregamento das páginas ao passar o rato / tocar
   O loader de ENTRADA vive no script inline do <head> (para pintar
   antes de tudo); aqui trata-se da SAÍDA e do resto. Sem dependências.
   ============================================================ */
(function () {
  'use strict';
  var d = document, root = d.documentElement;
  var reduced = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);

  /* ---------- helpers ---------- */
  function internal(a) {
    if (!a || !a.href || a.origin !== location.origin) return false;
    if (a.target && a.target !== '_self') return false;
    if (a.hasAttribute('download') || a.hasAttribute('data-no-fx')) return false;
    var m = /\.([a-z0-9]+)$/i.exec(a.pathname);
    if (m && !/^html?$/i.test(m[1])) return false;
    return true;
  }

  /* ---------- 1. saída de página: overlay + navegação ---------- */
  var leaving = false;
  function setP(v) { root.style.setProperty('--p', v); }

  d.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest && e.target.closest('a[href]');
    if (!internal(a) || leaving) return;
    var same = a.pathname === location.pathname && a.search === location.search;
    if (same) return;                                   // âncoras / mesma página: sem loader
    if (reduced) return;                                // navega normalmente
    e.preventDefault();
    leaving = true;
    try { sessionStorage.setItem('dz-nav', String(Date.now())); } catch (_) {}
    setP(0);
    root.classList.remove('fx-off');
    root.classList.add('fx-on', 'fx-in');
    requestAnimationFrame(function () { requestAnimationFrame(function () { setP(58); }); });
    var href = a.href;
    setTimeout(function () { location.assign(href); }, 170);
    setTimeout(function () {                            // reserva: se a navegação não acontecer
      if (!leaving) return;
      leaving = false; root.classList.remove('fx-on', 'fx-in', 'fx-off'); root.style.removeProperty('--p');
    }, 9000);
  });

  window.addEventListener('pageshow', function (ev) {   // voltar atrás (bfcache)
    if (!ev.persisted) return;
    leaving = false; root.classList.remove('fx-on', 'fx-in', 'fx-off'); root.style.removeProperty('--p');
  });

  /* ---------- 2. pré-carregar páginas internas ---------- */
  var seen = {}, timer = 0;
  function prefetch(a) {
    if (!internal(a) || seen[a.href] || (a.pathname === location.pathname && a.search === location.search)) return;
    var c = navigator.connection;
    if (c && (c.saveData || /(^|-)2g$/.test(c.effectiveType || ''))) return;
    seen[a.href] = 1;
    var l = d.createElement('link'); l.rel = 'prefetch'; l.href = a.href; l.as = 'document';
    d.head.appendChild(l);
  }
  function onIntent(e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    clearTimeout(timer);
    timer = setTimeout(function () { prefetch(a); }, e.type === 'touchstart' ? 0 : 70);
  }
  d.addEventListener('mouseover', onIntent, { passive: true });
  d.addEventListener('touchstart', onIntent, { passive: true });
  d.addEventListener('mouseout', function () { clearTimeout(timer); }, { passive: true });

  function ready(fn) { if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', fn); else fn(); }

  ready(function () {
    /* ---------- 3. barra de progresso do scroll ---------- */
    var bar = d.createElement('div');
    bar.className = 'fx-scroll'; bar.setAttribute('aria-hidden', 'true');
    var fill = d.createElement('i'); bar.appendChild(fill);
    d.body.appendChild(bar);
    var tick = 0;
    function upd() {
      tick = 0;
      var max = root.scrollHeight - root.clientHeight;
      var p = max > 8 ? Math.min(1, Math.max(0, (window.pageYOffset || root.scrollTop) / max)) : 0;
      fill.style.transform = 'scaleX(' + p.toFixed(4) + ')';
      bar.classList.toggle('is-idle', max <= 8);
    }
    function req() { if (!tick) tick = requestAnimationFrame(upd); }
    window.addEventListener('scroll', req, { passive: true });
    window.addEventListener('resize', req, { passive: true });
    if ('ResizeObserver' in window) new ResizeObserver(req).observe(d.body);
    window.addEventListener('load', req);
    upd();

    /* ---------- 4. anel do cursor (só rato) ---------- */
    if (!window.matchMedia || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    var ring = d.createElement('div');
    ring.className = 'fx-ring'; ring.setAttribute('aria-hidden', 'true');
    d.body.appendChild(ring);
    var x = -100, y = -100, rx = x, ry = y, raf = 0, last = null;
    var LINK = 'a[href],button,summary,label,select,[role="button"],.plate,.btn,.burger,.icon-btn,input[type="submit"]';
    var TEXT = 'input:not([type="submit"]):not([type="checkbox"]):not([type="radio"]):not([type="range"]),textarea';
    function loop() {
      var k = reduced ? 1 : 0.2;
      rx += (x - rx) * k; ry += (y - ry) * k;
      ring.style.transform = 'translate3d(' + rx.toFixed(1) + 'px,' + ry.toFixed(1) + 'px,0)';
      raf = (Math.abs(x - rx) > 0.1 || Math.abs(y - ry) > 0.1) ? requestAnimationFrame(loop) : 0;
    }
    d.addEventListener('pointermove', function (ev) {
      if (ev.pointerType !== 'mouse') return;
      x = ev.clientX; y = ev.clientY;
      if (!ring.classList.contains('is-on')) { rx = x; ry = y; ring.classList.add('is-on'); }
      if (!raf) raf = requestAnimationFrame(loop);
      var t = ev.target;
      if (t !== last) {
        last = t;
        ring.classList.toggle('is-link', !!(t.closest && t.closest(LINK)));
        ring.classList.toggle('is-text', !!(t.closest && t.closest(TEXT)));
      }
    }, { passive: true });
    d.addEventListener('pointerdown', function (ev) { if (ev.pointerType === 'mouse') ring.classList.add('is-down'); }, { passive: true });
    d.addEventListener('pointerup', function () { ring.classList.remove('is-down'); }, { passive: true });
    d.addEventListener('mouseleave', function () { ring.classList.remove('is-on'); });
    d.addEventListener('mouseenter', function () { ring.classList.add('is-on'); });
    window.addEventListener('blur', function () { ring.classList.remove('is-on', 'is-down'); });
  });
})();
