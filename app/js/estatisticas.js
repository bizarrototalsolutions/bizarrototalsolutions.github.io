/* ============================================================
   BTS App – estatisticas.js
   Gráficos (Chart.js) construídos a partir dos dados já em cache
   (DB.getClientes/getServicos/getCategorias/getZonas). Sem lógica
   de negócio nova — só agregações para desenhar.
   ============================================================ */

const EstatisticasPage = {
  ano: new Date().getFullYear(),
  charts: {},

  async init() {
    Auth.requireAuth();
    await DB.ready();
    UI.init('estatisticas');
    this.populateAnos();
    document.getElementById('filtro-ano-estatisticas').addEventListener('change', (e) => {
      this.ano = Number(e.target.value);
      this.renderTudo();
    });
    this.renderTudo();
  },

  populateAnos() {
    const anos = new Set(DB.getServicos().map(s => (s.data || '').slice(0, 4)).filter(Boolean));
    anos.add(String(this.ano));
    const lista = [...anos].sort().reverse();
    const select = document.getElementById('filtro-ano-estatisticas');
    select.innerHTML = lista.map(a => `<option value="${a}">${a}</option>`).join('');
    select.value = String(this.ano);
  },

  renderTudo() {
    const servicosAno = DB.getServicos().filter(s => (s.data || '').slice(0, 4) === String(this.ano));
    this.renderKpis(servicosAno);
    this.renderPorMes(servicosAno);
    this.renderPorEstado(servicosAno);
    this.renderPorCategoria(servicosAno);
    this.renderClientesPorZona();
  },

  renderKpis(servicosAno) {
    const total = servicosAno.length;
    const concluidos = servicosAno.filter(s => s.estado === 'Concluído').length;
    const cancelados = servicosAno.filter(s => s.estado === 'Cancelado').length;
    const base = total - cancelados;
    const taxa = base > 0 ? Math.round((concluidos / base) * 100) : 0;
    const area = servicosAno.reduce((soma, s) => soma + (Number(s.area) || 0), 0);

    document.getElementById('est-total-servicos').textContent = total;
    document.getElementById('est-taxa-conclusao').textContent = taxa + '%';
    document.getElementById('est-area-total').textContent = area.toLocaleString('pt-PT', { maximumFractionDigits: 1 });
    document.getElementById('est-clientes-ativos').textContent = DB.getClientes().filter(c => c.estado !== 'Inativo').length;
  },

  _criarGrafico(id, config) {
    if (this.charts[id]) this.charts[id].destroy();
    const ctx = document.getElementById(id);
    this.charts[id] = new Chart(ctx, config);
  },

  renderPorMes(servicosAno) {
    const nomesMes = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const contagem = new Array(12).fill(0);
    servicosAno.forEach(s => {
      const mes = Number((s.data || '').slice(5, 7)) - 1;
      if (mes >= 0 && mes < 12) contagem[mes]++;
    });
    this._criarGrafico('chart-por-mes', {
      type: 'bar',
      data: { labels: nomesMes, datasets: [{ label: 'Serviços', data: contagem, backgroundColor: '#2979D4', borderRadius: 6 }] },
      options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { precision: 0 } } } }
    });
  },

  renderPorEstado(servicosAno) {
    const contagem = {};
    DB.ESTADOS_SERVICO.forEach(e => contagem[e] = 0);
    servicosAno.forEach(s => contagem[s.estado] = (contagem[s.estado] || 0) + 1);
    const labels = Object.keys(contagem).filter(k => contagem[k] > 0);
    const dados = labels.map(l => contagem[l]);
    const cores = labels.map(l => DB.STATUS_CORES[l] || '#6B7280');
    this._criarGrafico('chart-por-estado', {
      type: 'doughnut',
      data: { labels, datasets: [{ data: dados, backgroundColor: cores }] },
      options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
    });
  },

  renderPorCategoria(servicosAno) {
    const contagem = {};
    servicosAno.forEach(s => { const c = s.categoria || 'Sem categoria'; contagem[c] = (contagem[c] || 0) + 1; });
    const labels = Object.keys(contagem);
    const dados = labels.map(l => contagem[l]);
    this._criarGrafico('chart-por-categoria', {
      type: 'bar',
      data: { labels, datasets: [{ label: 'Serviços', data: dados, backgroundColor: '#F5A800', borderRadius: 6 }] },
      options: { indexAxis: 'y', responsive: true, plugins: { legend: { display: false } }, scales: { x: { beginAtZero: true, ticks: { precision: 0 } } } }
    });
  },

  renderClientesPorZona() {
    const contagem = {};
    DB.getClientes().forEach(c => { const z = c.zona || 'Sem zona'; contagem[z] = (contagem[z] || 0) + 1; });
    const entradas = Object.entries(contagem).sort((a, b) => b[1] - a[1]).slice(0, 8);
    this._criarGrafico('chart-clientes-zona', {
      type: 'bar',
      data: { labels: entradas.map(e => e[0]), datasets: [{ label: 'Clientes', data: entradas.map(e => e[1]), backgroundColor: '#1A2B4A', borderRadius: 6 }] },
      options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { precision: 0 } } } }
    });
  }
};

document.addEventListener('DOMContentLoaded', () => EstatisticasPage.init());
