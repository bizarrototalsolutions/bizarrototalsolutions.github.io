/* ============================================================
   BTS App – servicos.js
   Responsabilidade única: LISTAGEM de serviços.
   Segue exatamente o mesmo padrão de clientes.js (Fase 2) —
   estado num objeto, filtros aplicados sobre uma cópia dos
   dados, nunca sobre o array original de DB.getServicos().
   ============================================================ */

const ServicosPage = {

  state: {
    page: 1,
    perPage: 10,
    sortField: 'data',
    sortDir: 'desc',
    search: '',
    filters: { estado: '', categoria: '', zona: '', funcionario: '', dataInicio: '', dataFim: '' }
  },

  init() {
    Auth.requireAuth();
    UI.init('servicos');
    this.populateFiltros();
    this.bindEvents();
    this.render();
  },

  // Todos os selects de filtro vêm de coleções em DB — nada de
  // <option> escritas à mão (regra da Fase 3).
  populateFiltros() {
    document.getElementById('filtro-estado').innerHTML =
      '<option value="">Todos os estados</option>' + DB.ESTADOS_SERVICO.map(e => `<option value="${e}">${e}</option>`).join('');

    document.getElementById('filtro-categoria').innerHTML =
      '<option value="">Todas as categorias</option>' + DB.getCategorias().map(c => `<option value="${Utils.escapeHtml(c.nome)}">${c.icone} ${Utils.escapeHtml(c.nome)}</option>`).join('');

    document.getElementById('filtro-zona-servico').innerHTML =
      '<option value="">Todas as zonas</option>' + DB.getZonas().map(z => `<option value="${Utils.escapeHtml(z.nome)}">${Utils.escapeHtml(z.nome)}</option>`).join('');
  },

  bindEvents() {
    document.getElementById('busca-servicos').addEventListener('input', Utils.debounce((e) => {
      this.state.search = e.target.value.trim().toLowerCase();
      this.state.page = 1;
      this.render();
    }, 250));

    ['filtro-estado', 'filtro-categoria', 'filtro-zona-servico', 'filtro-funcionario', 'filtro-data-inicio', 'filtro-data-fim'].forEach(id => {
      document.getElementById(id).addEventListener('input', () => this.aplicarFiltros());
    });

    document.getElementById('limpar-filtros-servicos').addEventListener('click', () => {
      this.state.search = '';
      this.state.filters = { estado: '', categoria: '', zona: '', funcionario: '', dataInicio: '', dataFim: '' };
      document.getElementById('busca-servicos').value = '';
      ['filtro-estado', 'filtro-categoria', 'filtro-zona-servico', 'filtro-funcionario', 'filtro-data-inicio', 'filtro-data-fim']
        .forEach(id => document.getElementById(id).value = '');
      this.state.page = 1;
      this.render();
    });

    document.querySelectorAll('#tabela-servicos th[data-sort]').forEach(th => {
      th.addEventListener('click', () => {
        const field = th.dataset.sort;
        if (this.state.sortField === field) {
          this.state.sortDir = this.state.sortDir === 'asc' ? 'desc' : 'asc';
        } else {
          this.state.sortField = field;
          this.state.sortDir = 'asc';
        }
        this.render();
      });
    });

    document.getElementById('btn-export-excel-servicos').addEventListener('click', () => this.exportExcel());
    document.getElementById('btn-export-pdf-servicos').addEventListener('click', () => this.exportPDF());
  },

  aplicarFiltros() {
    this.state.filters = {
      estado: document.getElementById('filtro-estado').value,
      categoria: document.getElementById('filtro-categoria').value,
      zona: document.getElementById('filtro-zona-servico').value,
      funcionario: document.getElementById('filtro-funcionario').value.trim().toLowerCase(),
      dataInicio: document.getElementById('filtro-data-inicio').value,
      dataFim: document.getElementById('filtro-data-fim').value
    };
    this.state.page = 1;
    this.render();
  },

  // Mesmo padrão de clientes.js: traduz o estado da página para
  // `opcoes` e deixa DB.consultarServicos fazer o trabalho todo.
  construirOpcoes(comPagina) {
    const { search, filters, sortField, sortDir, page, perPage } = this.state;
    const opcoes = {
      filtros: {
        estado: filters.estado || undefined,
        categoria: filters.categoria || undefined,
        zona: filters.zona || undefined,
        funcionario_contains: filters.funcionario || undefined,
        data_gte: filters.dataInicio || undefined,
        data_lte: filters.dataFim || undefined
      },
      ordenacao: { campo: sortField, direcao: sortDir }
    };
    if (search) {
      opcoes.pesquisa = { texto: search, campos: ['numero', 'clienteNome', 'tipoServico'] };
    }
    if (comPagina) {
      opcoes.pagina = { numero: page, tamanho: perPage };
    }
    return opcoes;
  },

  render() {
    const { items, total, pagina, totalPaginas } = DB.consultarServicos(this.construirOpcoes(true));
    this.state.page = pagina;

    document.getElementById('contador-servicos').textContent = `${total} serviço${total !== 1 ? 's' : ''}`;

    const tbody = document.getElementById('tbody-servicos');
    const emptyState = document.getElementById('servicos-empty');
    const tableWrap = document.getElementById('tabela-servicos-wrap');

    if (total === 0) {
      tableWrap.style.display = 'none';
      emptyState.style.display = 'block';
      this.renderPagination(0, 1, 1);
      return;
    }
    tableWrap.style.display = 'block';
    emptyState.style.display = 'none';

    tbody.innerHTML = items.map(s => `
      <tr>
        <td><a href="servico.html?id=${s.id}"><strong>${Utils.escapeHtml(s.numero)}</strong></a></td>
        <td>${Utils.escapeHtml(s.clienteNome)}</td>
        <td>${Utils.formatDate(s.data)}<div class="small text-muted">${s.horaInicio} – ${s.horaFim}</div></td>
        <td>${Utils.escapeHtml(s.categoria || '—')}<div class="small text-muted">${Utils.escapeHtml(s.tipoServico || '')}</div></td>
        <td>${Utils.escapeHtml(s.zona || '—')}</td>
        <td>${s.area ? s.area + ' m²' : '—'}</td>
        <td>${UI.prioridadeBadge(s.prioridade)}</td>
        <td>${UI.estadoBadge(s.estado)}</td>
        <td class="text-end">
          <div class="bts-row-actions">
            <button title="Editar" onclick="location.href='servico.html?id=${s.id}'"><i class="fa-solid fa-pen"></i></button>
            <button title="Eliminar" class="danger" onclick="ServicosPage.eliminar('${s.id}')"><i class="fa-solid fa-trash"></i></button>
          </div>
        </td>
      </tr>
    `).join('');

    document.querySelectorAll('#tabela-servicos th[data-sort]').forEach(th => {
      const icon = th.querySelector('i');
      if (!icon) return;
      icon.className = th.dataset.sort === this.state.sortField
        ? `fa-solid fa-arrow-${this.state.sortDir === 'asc' ? 'up' : 'down'}`
        : 'fa-solid fa-sort';
    });

    this.renderPagination(total, pagina, totalPaginas);
  },

  renderPagination(total, page, totalPages) {
    const el = document.getElementById('paginacao-servicos');
    const start = total === 0 ? 0 : (page - 1) * this.state.perPage + 1;
    const end = Math.min(page * this.state.perPage, total);
    el.innerHTML = `
      <span class="bts-pagination-info">${start}–${end} de ${total}</span>
      <div class="btn-group">
        <button class="btn btn-sm btn-bts-outline" ${page <= 1 ? 'disabled' : ''} onclick="ServicosPage.goToPage(${page - 1})"><i class="fa-solid fa-chevron-left"></i></button>
        <button class="btn btn-sm btn-bts-outline" disabled>Página ${page} / ${totalPages}</button>
        <button class="btn btn-sm btn-bts-outline" ${page >= totalPages ? 'disabled' : ''} onclick="ServicosPage.goToPage(${page + 1})"><i class="fa-solid fa-chevron-right"></i></button>
      </div>
    `;
  },

  goToPage(p) { this.state.page = p; this.render(); },

  async eliminar(id) {
    const servico = DB.getServico(id);
    const ok = await Utils.confirmDialog(`Eliminar o serviço ${servico.numero}? Esta ação não pode ser desfeita.`, 'Eliminar serviço');
    if (!ok) return;
    DB.deleteServico(id);
    Utils.toast('Serviço eliminado.', 'success');
    this.render();
  },

  exportExcel() {
    const { items } = DB.consultarServicos(this.construirOpcoes(false));
    const rows = items.map(s => ({
      'Nº Serviço': s.numero, Cliente: s.clienteNome, Data: Utils.formatDate(s.data),
      'Hora Início': s.horaInicio, 'Hora Fim': s.horaFim, Categoria: s.categoria, Tipo: s.tipoServico,
      Zona: s.zona, 'Área (m²)': s.area, Prioridade: s.prioridade, Estado: s.estado, Funcionário: s.funcionario || ''
    }));
    Utils.exportToExcel(rows, `servicos_bts_${Utils.todayISO()}.xlsx`, 'Serviços');
  },

  exportPDF() {
    const { items } = DB.consultarServicos(this.construirOpcoes(false));
    const cols = ['Nº', 'Cliente', 'Data', 'Tipo', 'Área', 'Estado'];
    const rows = items.map(s => [s.numero, s.clienteNome, Utils.formatDate(s.data), s.tipoServico || '', (s.area || '') + ' m²', s.estado]);
    Utils.exportToPDF('Serviços – BTS', cols, rows, `servicos_bts_${Utils.todayISO()}.pdf`);
  }
};

document.addEventListener('DOMContentLoaded', () => ServicosPage.init());
