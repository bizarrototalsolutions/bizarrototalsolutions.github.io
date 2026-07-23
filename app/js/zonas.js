/* ============================================================
   BTS App – zonas.js
   Módulo piloto das "entidades de referência" (ver ARCHITECTURE.md).
   Mesmo padrão de clientes.js: estado num objeto, filtros via
   DB.consultarZonas (motor de consulta genérico), nunca lógica
   de filtro duplicada à mão.
   ============================================================ */

const ZonasPage = {
  state: {
    page: 1,
    perPage: 10,
    sortField: 'nome',
    sortDir: 'asc',
    search: '',
    filters: { estado: '' }
  },
  zonaEmEdicaoId: null,
  modal: null,

  async init() {
    const sessao = await Auth.requireAuth();
    if (!sessao) return; // requireAuth já redirecionou para o login
    UI.init('zonas');
    this.modal = new bootstrap.Modal(document.getElementById('modal-zona'));
    this.populateFiltros();
    this.bindEvents();
    this.render();
  },

  populateFiltros() {
    document.getElementById('filtro-estado-zona').innerHTML =
      '<option value="">Todos os estados</option>' + DB.ESTADOS_ZONA.map(e => `<option value="${e}">${e}</option>`).join('');
    document.getElementById('zona-estado').innerHTML =
      DB.ESTADOS_ZONA.map(e => `<option value="${e}">${e}</option>`).join('');
  },

  bindEvents() {
    document.getElementById('busca-zonas').addEventListener('input', Utils.debounce((e) => {
      this.state.search = e.target.value.trim();
      this.state.page = 1;
      this.render();
    }, 250));

    document.getElementById('filtro-estado-zona').addEventListener('input', () => {
      this.state.filters.estado = document.getElementById('filtro-estado-zona').value;
      this.state.page = 1;
      this.render();
    });

    document.getElementById('limpar-filtros-zonas').addEventListener('click', () => {
      this.state.search = '';
      this.state.filters = { estado: '' };
      document.getElementById('busca-zonas').value = '';
      document.getElementById('filtro-estado-zona').value = '';
      this.state.page = 1;
      this.render();
    });

    document.querySelectorAll('#tabela-zonas th[data-sort]').forEach(th => {
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

    document.getElementById('btn-nova-zona').addEventListener('click', () => this.abrirModalCriar());
    document.getElementById('form-zona').addEventListener('submit', (e) => this.guardar(e));

    // Mantém o seletor de cor e o campo de texto hexadecimal sincronizados
    document.getElementById('zona-cor').addEventListener('input', (e) => {
      document.getElementById('zona-cor-hex').value = e.target.value;
    });
    document.getElementById('zona-cor-hex').addEventListener('input', (e) => {
      if (/^#[0-9a-fA-F]{6}$/.test(e.target.value)) document.getElementById('zona-cor').value = e.target.value;
    });
  },

  construirOpcoes(comPagina) {
    const { search, filters, sortField, sortDir, page, perPage } = this.state;
    const opcoes = {
      filtros: { estado: filters.estado || undefined },
      ordenacao: { campo: sortField, direcao: sortDir }
    };
    if (search) opcoes.pesquisa = { texto: search, campos: ['nome', 'codigo'] };
    if (comPagina) opcoes.pagina = { numero: page, tamanho: perPage };
    return opcoes;
  },

  render() {
    const { items, total, pagina, totalPaginas } = DB.consultarZonas(this.construirOpcoes(true));
    this.state.page = pagina;

    document.getElementById('contador-zonas').textContent = `${total} zona${total !== 1 ? 's' : ''}`;

    const tbody = document.getElementById('tbody-zonas');
    const emptyState = document.getElementById('zonas-empty');
    const tableWrap = document.getElementById('tabela-zonas-wrap');

    if (total === 0) {
      tableWrap.style.display = 'none';
      emptyState.style.display = 'block';
      this.renderPagination(0, 1, 1);
      return;
    }
    tableWrap.style.display = 'block';
    emptyState.style.display = 'none';

    // Requisito 2: o contador de utilização aparece SEMPRE na
    // tabela, não só no momento de tentar eliminar.
    tbody.innerHTML = items.map(z => {
      const usos = DB.contarUsosZona(z.id);
      const emUso = usos.clientes > 0 || usos.servicos > 0;
      return `
      <tr>
        <td><span style="display:inline-block;width:18px;height:18px;border-radius:50%;background:${z.cor || '#6B7280'};border:1px solid var(--border)" title="${z.cor}"></span></td>
        <td><strong>${Utils.escapeHtml(z.nome)}</strong>${z.observacoes ? `<div class="small text-muted">${Utils.escapeHtml(z.observacoes)}</div>` : ''}</td>
        <td>${Utils.escapeHtml(z.codigo || '—')}</td>
        <td>${UI.estadoBadge(z.estado)}</td>
        <td class="text-center">${usos.clientes}</td>
        <td class="text-center">${usos.servicos}</td>
        <td class="text-end">
          <div class="bts-row-actions">
            <button title="Editar" onclick="ZonasPage.abrirModalEditar('${z.id}')"><i class="fa-solid fa-pen"></i></button>
            <button title="${z.estado === 'Ativa' ? 'Desativar' : 'Ativar'}" onclick="ZonasPage.alternarEstado('${z.id}')"><i class="fa-solid ${z.estado === 'Ativa' ? 'fa-toggle-on' : 'fa-toggle-off'}"></i></button>
            <button title="${emUso ? `Não pode ser eliminada: ${usos.clientes} cliente(s), ${usos.servicos} serviço(s) associados` : 'Eliminar'}"
                    class="danger" ${emUso ? 'disabled style="opacity:.4;cursor:not-allowed"' : ''}
                    onclick="ZonasPage.eliminar('${z.id}')"><i class="fa-solid fa-trash"></i></button>
          </div>
        </td>
      </tr>`;
    }).join('');

    document.querySelectorAll('#tabela-zonas th[data-sort]').forEach(th => {
      const icon = th.querySelector('i');
      if (!icon) return;
      icon.className = th.dataset.sort === this.state.sortField
        ? `fa-solid fa-arrow-${this.state.sortDir === 'asc' ? 'up' : 'down'}`
        : 'fa-solid fa-sort';
    });

    this.renderPagination(total, pagina, totalPaginas);
  },

  renderPagination(total, page, totalPages) {
    const el = document.getElementById('paginacao-zonas');
    const start = total === 0 ? 0 : (page - 1) * this.state.perPage + 1;
    const end = Math.min(page * this.state.perPage, total);
    el.innerHTML = `
      <span class="bts-pagination-info">${start}–${end} de ${total}</span>
      <div class="btn-group">
        <button class="btn btn-sm btn-bts-outline" ${page <= 1 ? 'disabled' : ''} onclick="ZonasPage.goToPage(${page - 1})"><i class="fa-solid fa-chevron-left"></i></button>
        <button class="btn btn-sm btn-bts-outline" disabled>Página ${page} / ${totalPages}</button>
        <button class="btn btn-sm btn-bts-outline" ${page >= totalPages ? 'disabled' : ''} onclick="ZonasPage.goToPage(${page + 1})"><i class="fa-solid fa-chevron-right"></i></button>
      </div>`;
  },

  goToPage(p) { this.state.page = p; this.render(); },

  abrirModalCriar() {
    this.zonaEmEdicaoId = null;
    document.getElementById('modal-zona-titulo').textContent = 'Nova Zona';
    document.getElementById('form-zona').reset();
    document.getElementById('zona-id').value = '';
    document.getElementById('zona-cor').value = '#2979D4';
    document.getElementById('zona-cor-hex').value = '#2979D4';
    document.getElementById('zona-estado').value = 'Ativa';
    document.getElementById('zona-estado').closest('.col-6').style.display = 'none'; // só faz sentido escolher estado ao editar
    document.getElementById('zona-erros').style.display = 'none';
    this.modal.show();
  },

  abrirModalEditar(id) {
    const zona = DB.getZona(id);
    if (!zona) return;
    this.zonaEmEdicaoId = id;
    document.getElementById('modal-zona-titulo').textContent = 'Editar Zona';
    document.getElementById('zona-id').value = zona.id;
    document.getElementById('zona-nome').value = zona.nome;
    document.getElementById('zona-codigo').value = zona.codigo || '';
    document.getElementById('zona-cor').value = zona.cor || '#2979D4';
    document.getElementById('zona-cor-hex').value = zona.cor || '#2979D4';
    document.getElementById('zona-estado').value = zona.estado;
    document.getElementById('zona-estado').closest('.col-6').style.display = '';
    document.getElementById('zona-observacoes').value = zona.observacoes || '';
    document.getElementById('zona-erros').style.display = 'none';
    this.modal.show();
  },

  guardar(e) {
    e.preventDefault();
    const dados = {
      nome: document.getElementById('zona-nome').value.trim(),
      codigo: document.getElementById('zona-codigo').value.trim(),
      cor: document.getElementById('zona-cor-hex').value.trim() || '#2979D4',
      observacoes: document.getElementById('zona-observacoes').value.trim()
    };
    const errorBox = document.getElementById('zona-erros');

    if (!dados.nome) {
      errorBox.textContent = 'O nome é obrigatório.';
      errorBox.style.display = 'block';
      return;
    }

    if (this.zonaEmEdicaoId) {
      dados.estado = document.getElementById('zona-estado').value;
      const atualizada = DB.updateZona(this.zonaEmEdicaoId, dados);
      if (!atualizada) {
        errorBox.textContent = 'Já existe outra zona com esse nome.';
        errorBox.style.display = 'block';
        return;
      }
      Utils.toast('Zona atualizada.', 'success');
    } else {
      const nova = DB.addZona(dados);
      if (!nova) {
        errorBox.textContent = 'Já existe uma zona com esse nome.';
        errorBox.style.display = 'block';
        return;
      }
      Utils.toast('Zona criada.', 'success');
    }

    this.modal.hide();
    this.render();
  },

  async alternarEstado(id) {
    const zona = DB.getZona(id);
    if (!zona) return;
    const novoEstado = zona.estado === 'Ativa' ? 'Inativa' : 'Ativa';
    DB.updateZona(id, { estado: novoEstado });
    Utils.toast(`Zona "${zona.nome}" ${novoEstado === 'Ativa' ? 'ativada' : 'desativada'}.`, 'success');
    this.render();
  },

  // Requisito 3: se a eliminação for bloqueada, a mensagem explica
  // exatamente porquê — quantos clientes e quantos serviços —, em
  // vez de um erro genérico. A informação vem diretamente de
  // DB.deleteZona (que já sabe os números, sem os recalcular aqui).
  async eliminar(id) {
    const zona = DB.getZona(id);
    if (!zona) return;
    const ok = await Utils.confirmDialog(`Eliminar a zona "${zona.nome}"? Esta ação não pode ser desfeita.`, 'Eliminar zona');
    if (!ok) return;

    const resultado = DB.deleteZona(id);
    if (!resultado.ok) {
      Utils.toast(resultado.erro, 'danger');
      return;
    }
    Utils.toast('Zona eliminada.', 'success');
    this.render();
  }
};

document.addEventListener('DOMContentLoaded', () => ZonasPage.init());
