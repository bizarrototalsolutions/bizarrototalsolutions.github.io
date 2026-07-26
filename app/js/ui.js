/* ============================================================
   BTS App – ui.js
   Layout partilhado: menu lateral, topo, tema, notificações.
   Cada página só precisa de <div id="bts-sidebar"></div> e
   <div id="bts-topbar"></div> + <body data-page="dashboard">
   ============================================================ */

const NAV_ITEMS = [
  { page: 'dashboard',     label: 'Dashboard',     icon: 'fa-house',          href: 'dashboard.html' },
  { page: 'clientes',      label: 'Clientes',       icon: 'fa-users',          href: 'clientes.html' },
  { page: 'agenda',        label: 'Agenda',         icon: 'fa-calendar-days',  href: 'agenda.html' },
  { page: 'servicos',      label: 'Serviços',       icon: 'fa-screwdriver-wrench', href: 'servicos.html' },
  { page: 'zonas',         label: 'Zonas',          icon: 'fa-map-location-dot', href: 'zonas.html' },
  { page: 'estatisticas',  label: 'Estatísticas',   icon: 'fa-chart-pie',      href: 'estatisticas.html' },
  { page: 'configuracoes', label: 'Configurações',  icon: 'fa-gear',           href: 'configuracoes.html' }
];

const UI = {

  init(activePage) {
    this.renderSidebar(activePage);
    this.renderTopbar();
    this.applyTheme();
    this.bindGlobalEvents();
  },

  renderSidebar(activePage) {
    const el = document.getElementById('bts-sidebar');
    if (!el) return;
    const cfg = DB.getConfig();
    el.innerHTML = `
      <div class="bts-sidebar-brand">
        <img src="${cfg.logo || '../assets/images/logo-bts.jpg'}" alt="Logo" class="bts-brand-logo" />
        <span class="bts-brand-name">${Utils.escapeHtml(cfg.empresa || 'BTS')}</span>
      </div>
      <nav class="bts-sidebar-nav">
        ${NAV_ITEMS.map(item => `
          <a href="${item.href}" class="bts-nav-link ${item.page === activePage ? 'active' : ''}">
            <i class="fa-solid ${item.icon}"></i>
            <span>${item.label}</span>
          </a>
        `).join('')}
      </nav>
      <button class="bts-sidebar-collapse" id="bts-collapse-btn" title="Recolher menu">
        <i class="fa-solid fa-angles-left"></i>
      </button>
    `;
  },

  renderTopbar() {
    const el = document.getElementById('bts-topbar');
    if (!el) return;
    const user = Auth.currentUser() || { name: 'Utilizador' };
    const initials = (user.name || 'U').split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase();
    el.innerHTML = `
      <button class="bts-menu-toggle" id="bts-menu-toggle" aria-label="Alternar menu">
        <i class="fa-solid fa-bars"></i>
      </button>
      <div class="bts-search">
        <i class="fa-solid fa-magnifying-glass"></i>
        <input type="text" id="bts-global-search" placeholder="Pesquisar clientes, serviços..." autocomplete="off" />
        <div class="bts-search-results" id="bts-search-results"></div>
      </div>
      <div class="bts-topbar-actions">
        <button class="bts-icon-btn" id="bts-theme-toggle" title="Alternar tema">
          <i class="fa-solid fa-moon"></i>
        </button>
        <div class="bts-notif-wrap">
          <button class="bts-icon-btn" id="bts-notif-btn" title="Notificações">
            <i class="fa-solid fa-bell"></i>
            <span class="bts-notif-dot" id="bts-notif-dot" hidden></span>
          </button>
          <div class="bts-notif-dropdown" id="bts-notif-dropdown"></div>
        </div>
        <div class="bts-user-wrap">
          <div class="bts-user-avatar">${initials}</div>
          <div class="bts-user-meta">
            <strong>${Utils.escapeHtml(user.name || '')}</strong>
            <small>${Utils.escapeHtml(user.role || 'Utilizador')}</small>
          </div>
          <button class="bts-icon-btn" id="bts-logout-btn" title="Sair">
            <i class="fa-solid fa-right-from-bracket"></i>
          </button>
        </div>
      </div>
    `;
    this.buildNotifications();
    this.bindSearch();
  },

  bindGlobalEvents() {
    const collapseBtn = document.getElementById('bts-collapse-btn');
    const menuToggle = document.getElementById('bts-menu-toggle');
    const themeToggle = document.getElementById('bts-theme-toggle');
    const logoutBtn = document.getElementById('bts-logout-btn');
    const notifBtn = document.getElementById('bts-notif-btn');

    if (collapseBtn) collapseBtn.addEventListener('click', () => {
      document.body.classList.toggle('bts-sidebar-collapsed');
      DB.setPreferenciaDispositivo('sidebarColapsada', document.body.classList.contains('bts-sidebar-collapsed'));
    });
    if (menuToggle) menuToggle.addEventListener('click', () => {
      document.body.classList.toggle('bts-sidebar-mobile-open');
    });
    if (themeToggle) themeToggle.addEventListener('click', () => this.toggleTheme());
    if (logoutBtn) logoutBtn.addEventListener('click', async () => {
      const ok = await Utils.confirmDialog('Tens a certeza que queres terminar sessão?', 'Terminar sessão');
      if (ok) Auth.logout();
    });
    if (notifBtn) notifBtn.addEventListener('click', () => {
      document.getElementById('bts-notif-dropdown').classList.toggle('show');
    });
    document.addEventListener('click', (e) => {
      const dropdown = document.getElementById('bts-notif-dropdown');
      const wrap = document.querySelector('.bts-notif-wrap');
      if (dropdown && wrap && !wrap.contains(e.target)) dropdown.classList.remove('show');
      const results = document.getElementById('bts-search-results');
      const searchWrap = document.querySelector('.bts-search');
      if (results && searchWrap && !searchWrap.contains(e.target)) results.classList.remove('show');
    });

    if (DB.getPreferenciaDispositivo('sidebarColapsada', false)) {
      document.body.classList.add('bts-sidebar-collapsed');
    }
  },

  applyTheme() {
    const cfg = DB.getConfig();
    const saved = DB.getPreferenciaDispositivo('tema', cfg.tema || 'light');
    document.documentElement.setAttribute('data-theme', saved);
    const icon = document.querySelector('#bts-theme-toggle i');
    if (icon) icon.className = saved === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  },

  toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    DB.setPreferenciaDispositivo('tema', next);
    DB.saveConfig({ tema: next });
    const icon = document.querySelector('#bts-theme-toggle i');
    if (icon) icon.className = next === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  },

  buildNotifications() {
    const servicos = DB.getServicos();
    const today = Utils.todayISO();
    const hoje = servicos.filter(s => s.data === today && s.estado !== 'Concluído');
    const pendentes = servicos.filter(s => s.estado === 'Pendente');
    const items = [];
    hoje.forEach(s => items.push({ icon: 'fa-calendar-day', text: `Serviço hoje: ${this.clienteNome(s.clienteId)}`, href: 'agenda.html' }));
    pendentes.slice(0, 5).forEach(s => items.push({ icon: 'fa-hourglass-half', text: `Pendente: ${this.clienteNome(s.clienteId)}`, href: 'servicos.html' }));

    const dot = document.getElementById('bts-notif-dot');
    const dropdown = document.getElementById('bts-notif-dropdown');
    if (dot) dot.hidden = items.length === 0;
    if (dropdown) {
      dropdown.innerHTML = items.length
        ? items.map(i => `<a href="${i.href}" class="bts-notif-item"><i class="fa-solid ${i.icon}"></i><span>${Utils.escapeHtml(i.text)}</span></a>`).join('')
        : `<div class="bts-notif-empty">Sem notificações novas.</div>`;
    }
  },

  clienteNome(id) {
    const c = DB.getCliente(id);
    return c ? c.nome : 'Cliente removido';
  },

  bindSearch() {
    const input = document.getElementById('bts-global-search');
    const results = document.getElementById('bts-search-results');
    if (!input) return;
    input.addEventListener('input', Utils.debounce(() => {
      const q = input.value.trim().toLowerCase();
      if (!q) { results.classList.remove('show'); results.innerHTML = ''; return; }
      const clientes = DB.getClientes().filter(c => c.nome.toLowerCase().includes(q) || (c.nif || '').includes(q)).slice(0, 5);
      const servicos = DB.getServicos().filter(s => (this.clienteNome(s.clienteId) || '').toLowerCase().includes(q)).slice(0, 5);
      let html = '';
      if (clientes.length) {
        html += `<div class="bts-search-group">Clientes</div>`;
        html += clientes.map(c => `<a href="cliente.html?id=${c.id}" class="bts-search-item"><i class="fa-solid fa-user"></i> ${Utils.escapeHtml(c.nome)}</a>`).join('');
      }
      if (servicos.length) {
        html += `<div class="bts-search-group">Serviços</div>`;
        html += servicos.map(s => `<a href="servicos.html?id=${s.id}" class="bts-search-item"><i class="fa-solid fa-screwdriver-wrench"></i> ${Utils.escapeHtml(this.clienteNome(s.clienteId))} — ${Utils.formatDate(s.data)}</a>`).join('');
      }
      if (!html) html = `<div class="bts-notif-empty">Sem resultados.</div>`;
      results.innerHTML = html;
      results.classList.add('show');
    }, 200));
  },

  /* Badges de estado reutilizáveis.
     A cor NÃO está escrita aqui — vem de DB.STATUS_CORES / DB.PRIORIDADE_CORES
     (definidas uma única vez em storage.js). Isto cumpre a regra do
     projeto: nenhum estado ou cor de estado duplicado em dois ficheiros. */
  estadoBadge(estado) {
    const cor = DB.STATUS_CORES[estado] || '#6B7280';
    return `<span class="badge" style="background:${cor}22;color:${cor}">${Utils.escapeHtml(estado)}</span>`;
  },

  prioridadeBadge(prioridade) {
    const p = prioridade || 'Normal';
    const cor = DB.PRIORIDADE_CORES[p] || '#6B7280';
    return `<span class="badge" style="background:${cor}22;color:${cor}">${Utils.escapeHtml(p)}</span>`;
  }
};
