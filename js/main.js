/* ============================================================
   BTS – Main JavaScript
   Navigation · Theme · Loader · Scroll · Counters · FAQ
   Forms · Reveal · Hamburger
   ============================================================ */

'use strict';

/* ── Page Loader ── */
window.addEventListener('load', () => {
  const loader = document.getElementById('page-loader');
  if (!loader) return;
  setTimeout(() => {
    loader.classList.add('hidden');
    loader.addEventListener('transitionend', () => loader.remove(), { once: true });
  }, 900);
});

/* ── Theme ──
   Light mode is always the default on first visit. We deliberately do
   NOT read prefers-color-scheme here — dark mode only activates if the
   person explicitly clicks the toggle, and that choice is then
   remembered via localStorage. */
const THEME_KEY = 'bts-theme';
const savedTheme = localStorage.getItem(THEME_KEY) || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);

document.querySelectorAll('.btn-theme').forEach(btn => {
  updateThemeIcon(btn);
  btn.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem(THEME_KEY, next);
    document.querySelectorAll('.btn-theme').forEach(b => updateThemeIcon(b));
  });
});

function updateThemeIcon(btn) {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const span = btn.querySelector('span');
  if (span) span.textContent = isDark ? '☀️' : '🌙';
  btn.setAttribute('aria-label', isDark ? 'Modo claro' : 'Modo escuro');
}

/* ── Navbar Scroll Effect ── */
const navbar = document.getElementById('navbar');
if (navbar) {
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ── Hamburger Menu ── */
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('navMenu');
if (hamburger && navMenu) {
  hamburger.addEventListener('click', () => {
    const open = navMenu.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  // Close on link click
  navMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
  // Close on outside click
  document.addEventListener('click', e => {
    if (navMenu.classList.contains('open') &&
        !navMenu.contains(e.target) &&
        !hamburger.contains(e.target)) {
      navMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
}

/* ── Back to Top ── */
const backTop = document.querySelector('.back-top');
if (backTop) {
  window.addEventListener('scroll', () => {
    backTop.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ── Reveal on Scroll ── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── Animated Counters ── */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function animateCounter(el) {
  const target = parseInt(el.dataset.count, 10);
  const suffix = el.dataset.suffix || '';

  if (prefersReducedMotion) {
    el.textContent = target + suffix;
    return;
  }

  const duration = 1800;
  const start = performance.now();
  const step = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

/* ── FAQ Accordion ── */
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    // Close all
    document.querySelectorAll('.faq-item.open').forEach(i => {
      i.classList.remove('open');
      i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      i.querySelector('.faq-answer').setAttribute('aria-hidden', 'true');
    });
    // Open clicked (if it wasn't open)
    if (!isOpen) {
      const answer = item.querySelector('.faq-answer');
      // Size the answer to its real content height so long answers never get clipped
      answer.style.setProperty('--faq-h', answer.scrollHeight + 'px');
      item.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
      answer.setAttribute('aria-hidden', 'false');
    }
  });
});

/* ── Portfolio Filter ── */
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const filter = btn.dataset.filter;
    document.querySelectorAll('.filter-btn').forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-pressed', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-pressed', 'true');
    document.querySelectorAll('.portfolio-item').forEach(item => {
      const match = filter === 'all' || item.dataset.category === filter;
      item.style.display = match ? '' : 'none';
    });
  });
});

/* ── Envio de formulários (FormSubmit.co + cópia em Supabase) ──
   Os dois canais correm em paralelo. O pedido é dado como enviado
   com sucesso se PELO MENOS UM dos dois funcionar — assim nunca se
   perde um lead só porque um dos dois serviços teve uma falha
   pontual. Só mostramos erro ao cliente se ambos falharem. */

const FORM_SUBMIT_TIMEOUT_MS = 15000;

async function sendToFormSubmit(form) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FORM_SUBMIT_TIMEOUT_MS);
  try {
    const res = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' },
      signal: controller.signal
    });
    return res.ok || res.status === 200;
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

async function sendToSupabase(tipo, record) {
  if (typeof btsPublicClient === 'undefined') return false;
  try {
    const { error } = await btsPublicClient.from('pedidos_site').insert({
      tipo,
      pagina_origem: location.pathname,
      user_agent: navigator.userAgent.slice(0, 500),
      ...record
    });
    return !error;
  } catch {
    return false;
  }
}

async function submitLead({ form, tipo, buildRecord, sendingText }) {
  const submitBtn = form.querySelector('[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = sendingText;

  try {
    const [emailOk, dbOk] = await Promise.all([
      sendToFormSubmit(form),
      sendToSupabase(tipo, buildRecord(form))
    ]);

    if (emailOk || dbOk) {
      showSuccess(form);
      form.reset();
      if (!emailOk) {
        // O pedido ficou registado, mas o e-mail automático falhou — não é um erro fatal.
        console.warn('BTS: e-mail via FormSubmit falhou, mas o pedido foi guardado no Supabase.');
      }
    } else {
      alert('Ocorreu um erro ao enviar o seu pedido. Por favor tente novamente ou contacte-nos diretamente por WhatsApp/telefone.');
    }
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }
}

/* ── Contact Form ── */
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateForm(contactForm)) return;
    submitLead({
      form: contactForm,
      tipo: 'contacto',
      sendingText: 'A enviar…',
      buildRecord: (form) => {
        const data = new FormData(form);
        return {
          nome: data.get('Nome'),
          email: data.get('Email'),
          assunto: data.get('Assunto'),
          mensagem: data.get('Mensagem')
        };
      }
    });
  });
}

/* ── Quote Form ── */
const quoteForm = document.getElementById('quote-form');
if (quoteForm) {
  // Pre-select service from URL param
  const params = new URLSearchParams(window.location.search);
  const srv = params.get('servico');
  if (srv) {
    const sel = quoteForm.querySelector('[name="servico"]');
    if (sel) sel.value = srv;
  }

  quoteForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateForm(quoteForm)) return;
    submitLead({
      form: quoteForm,
      tipo: 'orcamento',
      sendingText: 'A enviar…',
      buildRecord: (form) => {
        const data = new FormData(form);
        return {
          nome: data.get('Nome'),
          telefone: data.get('Telefone'),
          servico: data.get('servico'),
          localidade: data.get('Localidade'),
          mensagem: data.get('Descricao')
        };
      }
    });
  });
}

/* ── Form Validation ── */
function validateForm(form) {
  let valid = true;
  form.querySelectorAll('[required]').forEach(field => {
    const err = field.parentElement.querySelector('.field-error');
    if (!field.value.trim()) {
      field.classList.add('error');
      field.setAttribute('aria-invalid', 'true');
      if (err) err.classList.add('visible');
      valid = false;
    } else {
      field.classList.remove('error');
      field.setAttribute('aria-invalid', 'false');
      if (err) err.classList.remove('visible');
    }
  });
  // Honeypot (spam protection)
  const honey = form.querySelector('[name="_honey"]');
  if (honey && honey.value) return false;
  return valid;
}

function showSuccess(form) {
  const success = form.querySelector('.form-success') || form.parentElement.querySelector('.form-success');
  if (success) {
    success.classList.add('visible');
    success.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

/* ── Smooth Anchor Links ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ── Lazy Images ── */
if ('loading' in HTMLImageElement.prototype) {
  document.querySelectorAll('img[data-src]').forEach(img => {
    img.src = img.dataset.src;
  });
} else {
  const lazyObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.src = e.target.dataset.src;
        lazyObs.unobserve(e.target);
      }
    });
  });
  document.querySelectorAll('img[data-src]').forEach(img => lazyObs.observe(img));
}
