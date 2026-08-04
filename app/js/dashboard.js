/* ============================================================
   BTS App – dashboard.js
   Visão geral: KPIs, próximos serviços, clientes recentes e
   duas repartições rápidas (por estado / por zona). Só lê dados
   já carregados em cache por DB.ready() — nenhuma escrita aqui.
   ============================================================ */

const DashboardPage = {

  async init() {
    Auth.requireAuth();
    await DB.ready();
    UI.init('dashboard');
    this.saudacao();
    this.renderKpis();
    this.renderProximosServicos();
    this.renderClientesRecentes();
    this.renderPorEstado();
    this.renderPorZona();

    // Se algo mudar (criar/editar/eliminar serviço ou cliente) enquanto
    // o dashboard está aberto, os números atualizam-se sozinhos.
    ['servico:criado', 'servico:editado', 'servico:eliminado', 'servico:estadoAlterado'].forEach(ev =>
      DB.on(ev, () => { this.renderKpis(); this.renderProximosServicos(); this.renderPorEstado(); this.renderPorZona(); })
    );
    ['cliente:criado', 'cliente:editado', 'cliente:eliminado'].forEach(ev =>
      DB.on(ev, () => { this.renderKpis(); this.renderClientesRecentes(); })
    );
  },

  saudacao() {
    const user = Auth.currentUser() || {};
    const hora = new Date().getHours();
    const periodo = hora < 12 ? 'Bom dia' : hora < 20 ? 'Boa tarde' : 'Boa noite';
    document.getElementById('dash-saudacao').textContent = `${periodo}, ${(user.name || 'BTS').split(' ')[0]}!`;
  },

  renderKpis() {
    const clientes = DB.getClientes();
    const servicos = DB.getServicos();
    const hoje = Utils.todayISO();
    const mesAtual = hoje.slice(0, 7);

    document.getElementById('kpi-clientes').textContent = clientes.filter(c => c.estado !== 'Inativo').length;
    document.getElementById('kpi-hoje').textContent = servicos.filter(s => s.data === hoje).length;
    document.getElementById('kpi-pendentes').textContent = servicos.filter(s => s.estado === 'Pendente').length;
    document.getElementById('kpi-concluidos-mes').textContent = servicos.filter(s => s.estado === 'Concluído' && (s.data || '').slice(0, 7) === mesAtual).length;
  },

  renderProximosServicos() {
    const hoje = Utils.todayISO();
    const proximos = DB.getServicos()
      .filter(s => s.data >= hoje && s.estado !== 'Concluído' && s.estado !== 'Cancelado')
      .sort((a, b) => (a.data + a.horaInicio).localeCompare(b.data + b.horaInicio))
      .slice(0, 6);

    const el = document.getElementById('dash-proximos');
    if (!proximos.length) {
      el.innerHTML = `<div class="bts-empty-state py-3"><i class="fa-solid fa-calendar-check"></i><p class="mb-0">Sem serviços agendados a chegar.</p></div>`;
      return;
    }
    el.innerHTML = proximos.map(s => `
      <a href="servico.html?id=${s.id}" class="d-flex justify-content-between align-items-center py-2" style="border-bottom:1px solid var(--border)">
        <div>
          <strong class="small">${Utils.escapeHtml(s.clienteNome)}</strong>
          <div class="small text-muted">${Utils.formatDate(s.data)} · ${s.horaInicio} · ${Utils.escapeHtml(s.zona || '—')}</div>
        </div>
        ${UI.estadoBadge(s.estado)}
      </a>
    `).join('');
  },

  renderClientesRecentes() {
    const recentes = [...DB.getClientes()]
      .sort((a, b) => (b.dataCriacao || '').localeCompare(a.dataCriacao || ''))
      .slice(0, 5);

    const el = document.getElementById('dash-clientes-recentes');
    if (!recentes.length) {
      el.innerHTML = `<div class="bts-empty-state py-3"><i class="fa-solid fa-user-plus"></i><p class="mb-0">Ainda não há clientes registados.</p></div>`;
      return;
    }
    el.innerHTML = recentes.map(c => `
      <a href="cliente.html?id=${c.id}" class="d-flex justify-content-between align-items-center py-2" style="border-bottom:1px solid var(--border)">
        <div>
          <strong class="small">${Utils.escapeHtml(c.nome)}</strong>
          <div class="small text-muted">${Utils.escapeHtml(c.zona || c.localidade || '—')}</div>
        </div>
        <span class="small text-muted">${Utils.formatDate(c.dataCriacao)}</span>
      </a>
    `).join('');
  },

  barraLista(entradas, corPorChave) {
    const total = entradas.reduce((soma, [, n]) => soma + n, 0) || 1;
    return entradas.map(([chave, n]) => {
      const pct = Math.round((n / total) * 100);
      const cor = (corPorChave && corPorChave[chave]) || '#2979D4';
      return `
        <div class="mb-2">
          <div class="d-flex justify-content-between small mb-1">
            <span>${Utils.escapeHtml(chave)}</span>
            <span class="text-muted">${n}</span>
          </div>
          <div style="height:8px;border-radius:99px;background:var(--bg2);overflow:hidden">
            <div style="height:100%;width:${pct}%;background:${cor};border-radius:99px"></div>
          </div>
        </div>`;
    }).join('');
  },

  renderPorEstado() {
    const servicos = DB.getServicos();
    const contagem = {};
    DB.ESTADOS_SERVICO.forEach(e => contagem[e] = 0);
    servicos.forEach(s => { contagem[s.estado] = (contagem[s.estado] || 0) + 1; });
    const entradas = Object.entries(contagem).filter(([, n]) => n > 0);
    const el = document.getElementById('dash-por-estado');
    el.innerHTML = entradas.length ? this.barraLista(entradas, DB.STATUS_CORES) : `<p class="text-muted small mb-0">Sem serviços ainda.</p>`;
  },

  renderPorZona() {
    const servicos = DB.getServicos();
    const contagem = {};
    servicos.forEach(s => { const z = s.zona || 'Sem zona'; contagem[z] = (contagem[z] || 0) + 1; });
    const entradas = Object.entries(contagem).sort((a, b) => b[1] - a[1]).slice(0, 6);
    const el = document.getElementById('dash-por-zona');
    el.innerHTML = entradas.length ? this.barraLista(entradas) : `<p class="text-muted small mb-0">Sem serviços ainda.</p>`;
  }
};

document.addEventListener('DOMContentLoaded', () => DashboardPage.init());
