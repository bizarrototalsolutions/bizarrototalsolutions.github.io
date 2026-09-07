/* ============================================================
   Dizarro — main.js
   Tema · menu mobile · formulários · antes/depois · filtro portfólio
   Carrega DEPOIS de layout.js.
   ============================================================ */
(function () {
  'use strict';

  /* ---- tema (o data-theme inicial é posto por um script inline no <head>) ---- */
  var THEME_KEY = 'dizarro-theme';
  var btn = document.getElementById('theme-btn');
  if (btn) {
    btn.addEventListener('click', function () {
      var cur = document.documentElement.getAttribute('data-theme');
      var next = cur === 'dark' ? 'light' : (cur === 'light' ? 'dark'
        : (matchMedia('(prefers-color-scheme: dark)').matches ? 'light' : 'dark'));
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
    });
  }

  /* ---- menu mobile ---- */
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');
  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', String(open));
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') { nav.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); }
    });
  }

  /* ---- antes / depois ---- */
  function wireBA(scope) {
    (scope || document).querySelectorAll('[data-ba]').forEach(function (ba) {
      if (ba.__wired) return; ba.__wired = true;
      var range = ba.querySelector('.ba-range');
      var before = ba.querySelector('.ba-before');
      var handle = ba.querySelector('.ba-handle');
      function set(v) {
        before.style.clipPath = 'inset(0 ' + (100 - v) + '% 0 0)';
        if (handle) handle.style.left = v + '%';
      }
      range.addEventListener('input', function () { set(range.value); });
      set(50);
    });
  }
  window.__wireBA = wireBA;
  wireBA(document);

  /* ---- filtro do portfólio ---- */
  var filters = document.querySelectorAll('.pf-filters button');
  if (filters.length) {
    filters.forEach(function (b) {
      b.addEventListener('click', function () {
        filters.forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
        b.setAttribute('aria-pressed', 'true');
        var f = b.dataset.filter;
        document.querySelectorAll('.pf-item').forEach(function (it) {
          it.style.display = (f === 'all' || it.dataset.cat === f) ? '' : 'none';
        });
      });
    });
  }

  /* ---- formulários (FormSubmit.co + cópia em Supabase, em paralelo) ---- */
  var TIMEOUT = 15000;

  function validate(form) {
    var ok = true;
    form.querySelectorAll('[required]').forEach(function (f) {
      var group = f.closest('.field');
      var bad = !f.value.trim() || (f.type === 'email' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.value));
      if (group) group.classList.toggle('invalid', bad);
      if (bad) ok = false;
    });
    var honey = form.querySelector('[name="_honey"]');
    if (honey && honey.value) return false;
    return ok;
  }

  async function toFormSubmit(form) {
    var c = new AbortController();
    var t = setTimeout(function () { c.abort(); }, TIMEOUT);
    try {
      var r = await fetch(form.action, { method: 'POST', body: new FormData(form),
        headers: { Accept: 'application/json' }, signal: c.signal });
      return r.ok;
    } catch (e) { return false; } finally { clearTimeout(t); }
  }

  async function toSupabase(tipo, rec) {
    if (typeof btsPublicClient === 'undefined') return false;
    try {
      var res = await btsPublicClient.from('pedidos_site').insert(Object.assign({
        tipo: tipo, pagina_origem: location.pathname,
        user_agent: navigator.userAgent.slice(0, 400)
      }, rec));
      return !res.error;
    } catch (e) { return false; }
  }

  document.querySelectorAll('form[data-lead]').forEach(function (form) {
    var tipo = form.getAttribute('data-lead');
    var okBox = form.parentElement.querySelector('.form-ok');
    var submit = form.querySelector('[type="submit"]');
    // pré-seleção de serviço via ?servico=
    var srv = new URLSearchParams(location.search).get('servico');
    var sel = form.querySelector('[name="servico"]');
    if (srv && sel) sel.value = srv;

    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      if (!validate(form)) return;
      var label = submit.textContent;
      submit.disabled = true; submit.textContent = 'A enviar…';
      var d = new FormData(form);
      var rec = tipo === 'orcamento'
        ? { nome: d.get('Nome'), telefone: d.get('Telefone'), servico: d.get('servico'), localidade: d.get('Localidade'), mensagem: d.get('Descricao') }
        : { nome: d.get('Nome'), email: d.get('Email'), assunto: d.get('Assunto'), mensagem: d.get('Mensagem') };
      var r = await Promise.all([toFormSubmit(form), toSupabase(tipo, rec)]);
      submit.disabled = false; submit.textContent = label;
      if (r[0] || r[1]) {
        form.reset();
        if (okBox) { okBox.classList.add('show'); okBox.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
      } else {
        alert('Não foi possível enviar. Contacte-nos por WhatsApp ou telefone, por favor.');
      }
    });
  });
})();
