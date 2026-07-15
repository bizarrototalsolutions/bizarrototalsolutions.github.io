/* ============================================================
   BTS – Main JavaScript
   Navigation · Theme · Loader · Scroll · Counters · FAQ
   Music · Forms · Reveal · Hamburger
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
   Initial theme is already applied by the inline anti-flash script in <head>,
   so here we only need to sync the icon and wire up the toggle button. */
const THEME_KEY = 'bts-theme';

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
function animateCounter(el) {
  const target = parseInt(el.dataset.count, 10);
  const suffix = el.dataset.suffix || '';
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
      item.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
      item.querySelector('.faq-answer').setAttribute('aria-hidden', 'false');
    }
  });
});

/* ── Music Player ── */
const musicPlayer = document.querySelector('.music-player');
const musicBtn    = document.querySelector('.music-btn');
let audio = null;
let musicPlaying = false;
const MUSIC_KEY = 'bts-music-pref';

const PLAY_ICON  = '<polygon points="5,3 19,12 5,21" fill="currentColor"/>';
const PAUSE_ICON = '<rect x="6" y="4" width="4" height="16" fill="currentColor"/><rect x="14" y="4" width="4" height="16" fill="currentColor"/>';

function setMusicIcon(playing) {
  if (!musicBtn) return;
  musicBtn.innerHTML = `<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">${playing ? PAUSE_ICON : PLAY_ICON}</svg>`;
  if (musicPlayer) musicPlayer.classList.toggle('playing', playing);
}

if (musicBtn) {
  musicBtn.addEventListener('click', () => {
    if (!audio) {
      // Use a royalty-free ambient music URL or local file
      audio = new Audio('assets/music/ambient.mp3');
      audio.loop = true;
      audio.volume = 0.25;
    }
    if (musicPlaying) {
      audio.pause();
      musicPlaying = false;
      localStorage.setItem(MUSIC_KEY, 'off');
    } else {
      audio.play().then(() => {
        musicPlaying = true;
        localStorage.setItem(MUSIC_KEY, 'on');
      }).catch(() => {
        // Autoplay blocked or file missing
        console.info('BTS: Música ambiente não disponível');
      });
    }
    setMusicIcon(musicPlaying);
  });
}

/* ── Portfolio Filter ── */
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const filter = btn.dataset.filter;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.portfolio-item').forEach(item => {
      const match = filter === 'all' || item.dataset.category === filter;
      item.style.display = match ? '' : 'none';
    });
  });
});

/* ── Form Validation ── */
function validateForm(form) {
  let valid = true;
  form.querySelectorAll('[required]').forEach(field => {
    const err = field.parentElement.querySelector('.field-error');
    if (!field.value.trim()) {
      field.classList.add('error');
      if (err) err.classList.add('visible');
      valid = false;
    } else {
      field.classList.remove('error');
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

/* ── Contact Form (FormSubmit.co) ── */
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    if (!validateForm(contactForm)) {
      e.preventDefault();
      return;
    }
    // Let FormSubmit handle the submission naturally
    // Just show success message after a short delay
    setTimeout(() => {
      showSuccess(contactForm);
    }, 100);
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
    if (!validateForm(quoteForm)) {
      e.preventDefault();
      return;
    }
    // Let FormSubmit handle the submission naturally
    // Just show success message after a short delay
    setTimeout(() => {
      showSuccess(quoteForm);
    }, 100);
  });
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
