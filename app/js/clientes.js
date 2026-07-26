/* ============================================================
   BTS App – clientes.js
   Responsabilidade única deste ficheiro: a LISTAGEM de clientes
   (pesquisa, filtros, ordenação, paginação, exportações, ações
   de linha). A criação/edição de um cliente vive em cliente.js,
   porque é um ecrã com responsabilidade diferente (um formulário,
   não uma tabela) — separar por responsabilidade é o que torna
   cada ficheiro pequeno e fácil de perceber sozinho.
   ============================================================ */

const ClientesPage = {

  // Estado da página, tudo num único objeto para ser fácil de
  // inspecionar no DevTools (basta escrever ClientesPage.state).
  state: {
    page: 1,
    perPage: 10,
    sortField: 'nome',
    sortDir: 'asc',
    search: '',
    filters: { zona: '', distrito: '', estado: '', codigoPostal: '' }
  },

  init() {
    Auth.requireAuth();
    UI.init('clientes');
    this.populateZonaFilter();
    this.bindEvents();
    this.render();
  },

  populateZonaFilter() {
    const select = document.getElementById('filtro-zona');
    const zonas = DB.getZonas();
    select.innerHTML = '<option value="">Todas as zonas</option>' +
      zonas.map(z => `<option value="${Utils.escapeHtml(z.nome)}">${Utils.escapeHtml(z.nome)}</option>`).join('');

    // Retrofit Fase 3 (regra 5): sem <option> fixas no HTML.
    const estadoSelect = document.getElementById('filtro-estado');
    estadoSelect.innerHTML = '<option value="">Todos os estados</option>' +
      DB.ESTADOS_CLIENTE.map(e => `<option value="${e}">${e}</option>`).join('');
  },

  bindEvents() {
    document.getElementById('busca-clientes').addEventListener('input', Utils.debounce((e) => {
      this.state.search = e.target.value.trim().toLowerCase();
      this.state.page = 1;
      this.render();
    }, 250));

    ['filtro-zona', 'filtro-distrito', 'filtro-estado', 'filtro-cp'].forEach(id => {
      document.getElementById(id).addEventListener('input', () => {
        this.state.filters = {
          zona: document.getElementById('filtro-zona').value,
          distrito: document.getElementById('filtro-distrito').value.trim().toLowerCase(),
          estado: document.getElementById('filtro-estado').value,
          codigoPostal: document.getElementById('filtro-cp').value.trim()
        };
        this.state.page = 1;
        this.render();
      });
    });

    document.getElementById('limpar-filtros').addEventListener('click', () => {
      this.state.search = '';
      this.state.filters = { zona: '', distrito: '', estado: '', codigoPostal: '' };
      document.getElementById('busca-clientes').value = '';
      ['filtro-zona', 'filtro-distrito', 'filtro-estado', 'filtro-cp'].forEach(id => document.getElementById(id).value = '');
      this.state.page = 1;
      this.render();
    });

    document.querySelectorAll('#tabela-clientes th[data-sort]').forEach(th => {
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

    document.getElementById('btn-export-excel').addEventListener('click', () => this.exportExcel());
    document.getElementById('btn-export-pdf').addEventListener('click', () => this.exportPDF());
  },

  // Traduz o estado da página para o formato `opcoes` que
  // DB.consultarClientes espera. `comPagina=false` é usado pelas
  // exportações, que precisam de TODAS as linhas filtradas, não
  // só da página visível no ecrã.
  construirOpcoes(comPagina) {
    const { search, filters, sortField, sortDir, page, perPage } = this.state;
    const opcoes = {
      filtros: {
        zona: filters.zona || undefined,
        estado: filters.estado || undefined,
        distrito_contains: filters.distrito || undefined,
        codigoPostal_contains: filters.codigoPostal || undefined
      },
      ordenacao: { campo: sortField, direcao: sortDir }
    };
    if (search) {
      opcoes.pesquisa = { texto: search, campos: ['nome', 'nif', 'telefone', 'telemovel', 'email'] };
    }
    if (comPagina) {
      opcoes.pagina = { numero: page, tamanho: perPage };
    }
    return opcoes;
  },

  render() {
    // Toda a lógica de filtrar/pesquisar/ordenar/paginar vive
    // agora em DB.consultarClientes (storage.js) — esta página só
    // pede os dados já prontos e desenha a tabela.
    const { items, total, pagina, totalPaginas } = DB.consultarClientes(this.construirOpcoes(true));
    this.state.page = pagina;

    const tbody = document.getElementById('tbody-clientes');
    const emptyState = document.getElementById('clientes-empty');
    const tableWrap = document.getElementById('tabela-clientes-wrap');

    document.getElementById('contador-clientes').textContent = `${total} cliente${total !== 1 ? 's' : ''}`;

    if (total === 0) {
      tableWrap.style.display = 'none';
      emptyState.style.display = 'block';
      this.renderPagination(0, 1, 1);
      return;
    }
    tableWrap.style.display = 'block';
    emptyState.style.display = 'none';

    tbody.innerHTML = items.map(c => `
      <tr>
        <td><a href="cliente.html?id=${c.id}"><strong>${Utils.escapeHtml(c.nome)}</strong></a></td>
        <td>${Utils.escapeHtml(c.nif || '—')}</td>
        <td>${Utils.escapeHtml(c.zona || '—')}</td>
        <td>${Utils.escapeHtml(c.localidade || '—')}</td>
        <td>${Utils.escapeHtml(c.telefone || c.telemovel || '—')}</td>
        <td>${UI.estadoBadge(c.estado || 'Ativo')}</td>
        <td>${Utils.formatDate(c.dataCriacao)}</td>
        <td class="text-end">
          <div class="bts-row-actions">
            <button title="Editar" onclick="location.href='cliente.html?id=${c.id}'"><i class="fa-solid fa-pen"></i></button>
            <button title="Duplicar" onclick="ClientesPage.duplicar('${c.id}')"><i class="fa-solid fa-copy"></i></button>
            <button title="Eliminar" class="danger" onclick="ClientesPage.eliminar('${c.id}')"><i class="fa-solid fa-trash"></i></button>
          </div>
        </td>
      </tr>
    `).join('');

    // Marca a coluna ativa na ordenação (seta ↑/↓ no cabeçalho)
    document.querySelectorAll('#tabela-clientes th[data-sort]').forEach(th => {
      const icon = th.querySelector('i');
      if (th.dataset.sort === this.state.sortField) {
        icon.className = `fa-solid fa-arrow-${this.state.sortDir === 'asc' ? 'up' : 'down'}`;
      } else {
        icon.className = 'fa-solid fa-sort';
      }
    });

    this.renderPagination(total, pagina, totalPaginas);
  },

  renderPagination(total, page, totalPages) {
    const el = document.getElementById('paginacao-clientes');
    const start = total === 0 ? 0 : (page - 1) * this.state.perPage + 1;
    const end = Math.min(page * this.state.perPage, total);
    el.innerHTML = `
      <span class="bts-pagination-info">${start}–${end} de ${total}</span>
      <div class="btn-group">
        <button class="btn btn-sm btn-bts-outline" ${page <= 1 ? 'disabled' : ''} onclick="ClientesPage.goToPage(${page - 1})"><i class="fa-solid fa-chevron-left"></i></button>
        <button class="btn btn-sm btn-bts-outline" disabled>Página ${page} / ${totalPages}</button>
        <button class="btn btn-sm btn-bts-outline" ${page >= totalPages ? 'disabled' : ''} onclick="ClientesPage.goToPage(${page + 1})"><i class="fa-solid fa-chevron-right"></i></button>
      </div>
    `;
  },

  goToPage(p) {
    this.state.page = p;
    this.render();
  },

  async eliminar(id) {
    const cliente = DB.getCliente(id);
    const ok = await Utils.confirmDialog(`Eliminar o cliente "${cliente.nome}"? Esta ação não pode ser desfeita.`, 'Eliminar cliente');
    if (!ok) return;
    DB.deleteCliente(id);
    Utils.toast('Cliente eliminado.', 'success');
    this.render();
  },

  duplicar(id) {
    const copy = DB.duplicateCliente(id);
    if (copy) {
      Utils.toast('Cliente duplicado. A abrir para edição...', 'info');
      setTimeout(() => window.location.href = `cliente.html?id=${copy.id}`, 600);
    }
  },

  exportExcel() {
    const { items } = DB.consultarClientes(this.construirOpcoes(false));
    const rows = items.map(c => ({
      Nome: c.nome, NIF: c.nif, Morada: c.morada, 'Código Postal': c.codigoPostal,
      Localidade: c.localidade, Distrito: c.distrito, Zona: c.zona,
      Telefone: c.telefone, Telemóvel: c.telemovel, Email: c.email,
      'Pessoa de Contacto': c.contacto, Estado: c.estado, 'Data Criação': Utils.formatDate(c.dataCriacao)
    }));
    Utils.exportToExcel(rows, `clientes_bts_${Utils.todayISO()}.xlsx`, 'Clientes');
  },

  exportPDF() {
    const { items } = DB.consultarClientes(this.construirOpcoes(false));
    const cols = ['Nome', 'NIF', 'Zona', 'Localidade', 'Telefone', 'Estado'];
    const rows = items.map(c => [c.nome, c.nif || '', c.zona || '', c.localidade || '', c.telefone || c.telemovel || '', c.estado]);
    Utils.exportToPDF('Clientes – BTS', cols, rows, `clientes_bts_${Utils.todayISO()}.pdf`);
  }
};

document.addEventListener('DOMContentLoaded', () => ClientesPage.init());
