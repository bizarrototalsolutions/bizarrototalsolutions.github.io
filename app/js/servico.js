/* ============================================================
   BTS App – servico.js
   Responsabilidade única: criar OU editar UM serviço.
   Espelha a estrutura de cliente.js (Fase 2): ?id= na URL decide
   o modo. Sem id = criar; com id = editar.
   ============================================================ */

const ServicoPage = {
  servicoId: null,

  init() {
    Auth.requireAuth();
    UI.init('servicos');
    this.servicoId = new URLSearchParams(window.location.search).get('id');
    this.populateClientes();
    this.populateCategorias();
    this.populateSelects();
    this.bindEvents();

    if (this.servicoId) {
      this.carregarParaEdicao();
      document.getElementById('btn-sincronizar-cliente').style.display = 'inline-block';
    } else {
      document.getElementById('servico-titulo').textContent = 'Novo Serviço';
      document.getElementById('servico-subtitulo').textContent = 'Escolhe um cliente existente para começar.';
      document.getElementById('servico-numero-badge').style.display = 'none';
      document.getElementById('bloco-historico-servico').style.display = 'none';
      document.getElementById('btn-eliminar-servico').style.display = 'none';
      document.getElementById('servico-estado').value = 'Pendente';
      document.getElementById('servico-prioridade').value = 'Normal';

      // Vindo da Agenda (clique num dia/hora vazio): pré-preenche
      // data/hora. Ver AgendaService.gerarLinkNovoServico().
      const params = new URLSearchParams(window.location.search);
      const dataPre = params.get('data');
      const horaPre = params.get('hora');
      if (dataPre) document.getElementById('servico-data').value = dataPre;
      if (horaPre) document.getElementById('servico-hora-inicio').value = horaPre;
    }
  },

  // Select de clientes: mostra os inativos identificados, mas não
  // os esconde — pode haver um serviço antigo a editar cujo cliente
  // entretanto ficou inativo, e o utilizador precisa de o continuar a ver.
  populateClientes() {
    const select = document.getElementById('servico-cliente');
    const clientes = [...DB.getClientes()].sort((a, b) => a.nome.localeCompare(b.nome));
    select.innerHTML = '<option value="">Selecionar cliente...</option>' +
      clientes.map(c => `<option value="${c.id}">${Utils.escapeHtml(c.nome)}${c.estado === 'Inativo' ? ' (Inativo)' : ''}</option>`).join('');
  },

  // Categoria → Tipo é uma cascata: a lista de "tipos" depende da
  // categoria escolhida. Os dados vêm de DB.getCategorias() (Fase 3),
  // nunca de <option> fixas no HTML.
  populateCategorias() {
    const select = document.getElementById('servico-categoria');
    const categorias = DB.getCategorias();
    select.innerHTML = '<option value="">Selecionar categoria...</option>' +
      categorias.map(c => `<option value="${Utils.escapeHtml(c.nome)}">${c.icone} ${Utils.escapeHtml(c.nome)}</option>`).join('');
  },

  populateTipos(nomeCategoria) {
    const select = document.getElementById('servico-tipo');
    const categoria = DB.getCategorias().find(c => c.nome === nomeCategoria);
    const tipos = categoria ? categoria.tipos : [];
    select.disabled = !categoria;
    select.innerHTML = tipos.length
      ? '<option value="">Selecionar tipo...</option>' + tipos.map(t => `<option value="${Utils.escapeHtml(t)}">${Utils.escapeHtml(t)}</option>`).join('')
      : '<option value="">Escolhe primeiro a categoria</option>';
  },

  populateSelects() {
    document.getElementById('servico-estado').innerHTML = DB.ESTADOS_SERVICO.map(e => `<option value="${e}">${e}</option>`).join('');
    document.getElementById('servico-prioridade').innerHTML = DB.PRIORIDADES_SERVICO.map(p => `<option value="${p}">${p}</option>`).join('');
  },

  bindEvents() {
    document.getElementById('servico-cliente').addEventListener('change', (e) => this.autoPreencherCliente(e.target.value));
    document.getElementById('servico-categoria').addEventListener('change', (e) => this.populateTipos(e.target.value));
    document.getElementById('form-servico').addEventListener('submit', (e) => this.guardar(e));
    document.getElementById('btn-eliminar-servico').addEventListener('click', () => this.eliminar());
    document.getElementById('btn-sincronizar-cliente').addEventListener('click', () => this.sincronizarComCliente());
  },

  // Botão "Atualizar a partir do cliente": só disponível em edição.
  // A permissão vem de DB.podeSincronizarMoradaServico (regra de
  // negócio centralizada) — este ficheiro só pergunta e reage,
  // nunca decide sozinho quais os estados que bloqueiam.
  async sincronizarComCliente() {
    const servico = DB.getServico(this.servicoId);
    if (!DB.podeSincronizarMoradaServico(servico)) {
      Utils.toast(`Não é possível sincronizar: o serviço já está "${servico.estado}". O histórico fica preservado.`, 'warning');
      return;
    }
    const cliente = DB.getCliente(servico.clienteId);
    if (!cliente) {
      Utils.toast('Cliente não encontrado.', 'danger');
      return;
    }
    const ok = await Utils.confirmDialog(
      `Substituir a morada/zona atuais deste serviço pelos dados mais recentes de "${cliente.nome}"? Só é gravado quando guardares o formulário.`,
      'Sincronizar dados do cliente'
    );
    if (!ok) return;
    document.getElementById('servico-zona').value = cliente.zona || '';
    document.getElementById('servico-morada').value = cliente.morada || '';
    document.getElementById('servico-cp').value = cliente.codigoPostal || '';
    document.getElementById('servico-localidade').value = cliente.localidade || '';
    Utils.toast('Dados atualizados no formulário — não te esqueças de guardar.', 'info');
  },

  // Ao escolher um cliente, copia zona/morada/CP/localidade para o
  // formulário — mas os campos continuam editáveis (ex: o serviço
  // pode ser feito numa segunda morada do mesmo cliente).
  autoPreencherCliente(clienteId) {
    if (!clienteId) return;
    const cliente = DB.getCliente(clienteId);
    if (!cliente) return;
    document.getElementById('servico-zona').value = cliente.zona || '';
    document.getElementById('servico-morada').value = cliente.morada || '';
    document.getElementById('servico-cp').value = cliente.codigoPostal || '';
    document.getElementById('servico-localidade').value = cliente.localidade || '';
  },

  carregarParaEdicao() {
    const servico = DB.getServico(this.servicoId);
    if (!servico) {
      Utils.toast('Serviço não encontrado.', 'danger');
      window.location.href = 'servicos.html';
      return;
    }
    document.getElementById('servico-titulo').textContent = servico.clienteNome;
    document.getElementById('servico-subtitulo').textContent = `Criado em ${Utils.formatDate(servico.dataCriacao, true)}`;
    document.getElementById('servico-numero-badge').textContent = servico.numero;

    document.getElementById('servico-cliente').value = servico.clienteId;
    document.getElementById('servico-zona').value = servico.zona || '';
    document.getElementById('servico-morada').value = servico.morada || '';
    document.getElementById('servico-cp').value = servico.codigoPostal || '';
    document.getElementById('servico-localidade').value = servico.localidade || '';
    document.getElementById('servico-data').value = servico.data || '';
    document.getElementById('servico-hora-inicio').value = servico.horaInicio || '';
    document.getElementById('servico-hora-fim').value = servico.horaFim || '';
    document.getElementById('servico-categoria').value = servico.categoria || '';
    this.populateTipos(servico.categoria);
    document.getElementById('servico-tipo').value = servico.tipoServico || '';
    document.getElementById('servico-area').value = servico.area || '';
    document.getElementById('servico-estado').value = servico.estado;
    document.getElementById('servico-prioridade').value = servico.prioridade || 'Normal';
    document.getElementById('servico-funcionario').value = servico.funcionario || '';
    document.getElementById('servico-observacoes').value = servico.observacoes || '';

    this.renderHistorico(servico.historico || []);
  },

  renderHistorico(historico) {
    const el = document.getElementById('lista-historico-servico');
    if (!historico.length) {
      el.innerHTML = `<p class="text-muted small mb-0">Sem alterações registadas.</p>`;
      return;
    }
    el.innerHTML = [...historico].reverse().map(h => `
      <div class="d-flex justify-content-between align-items-start py-2" style="border-bottom:1px solid var(--border)">
        <div>
          <strong class="small">${Utils.escapeHtml(h.tipo)}</strong>
          <div class="small text-muted">${Utils.escapeHtml(h.detalhe)}</div>
        </div>
        <span class="small text-muted">${Utils.formatDate(h.data, true)}</span>
      </div>
    `).join('');
  },

  validar(dados) {
    const erros = [];
    if (!dados.clienteId) erros.push('Escolhe um cliente.');
    if (!dados.data) erros.push('A data é obrigatória.');
    if (!dados.horaInicio) erros.push('A hora de início é obrigatória.');
    if (!dados.horaFim) erros.push('A hora de fim é obrigatória.');
    if (dados.horaInicio && dados.horaFim && dados.horaFim <= dados.horaInicio) {
      erros.push('A hora de fim deve ser depois da hora de início.');
    }
    if (!dados.categoria || !dados.tipoServico) erros.push('Escolhe a categoria e o tipo de serviço.');
    if (!dados.area || Number(dados.area) <= 0) erros.push('A área (m²) deve ser um número maior que zero.');
    if (!dados.estado) erros.push('O estado é obrigatório.');
    return erros;
  },

  guardar(e) {
    e.preventDefault();
    const clienteId = document.getElementById('servico-cliente').value;
    const cliente = DB.getCliente(clienteId);

    const dados = {
      clienteId,
      clienteNome: cliente ? cliente.nome : '',
      zona: document.getElementById('servico-zona').value.trim(),
      morada: document.getElementById('servico-morada').value.trim(),
      codigoPostal: document.getElementById('servico-cp').value.trim(),
      localidade: document.getElementById('servico-localidade').value.trim(),
      data: document.getElementById('servico-data').value,
      horaInicio: document.getElementById('servico-hora-inicio').value,
      horaFim: document.getElementById('servico-hora-fim').value,
      categoria: document.getElementById('servico-categoria').value,
      tipoServico: document.getElementById('servico-tipo').value,
      area: Number(document.getElementById('servico-area').value),
      estado: document.getElementById('servico-estado').value,
      prioridade: document.getElementById('servico-prioridade').value,
      funcionario: document.getElementById('servico-funcionario').value.trim(),
      observacoes: document.getElementById('servico-observacoes').value.trim()
    };

    const erros = this.validar(dados);
    const errorBox = document.getElementById('servico-erros');
    if (erros.length) {
      errorBox.innerHTML = erros.map(e => `<div>${Utils.escapeHtml(e)}</div>`).join('');
      errorBox.style.display = 'block';
      errorBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    errorBox.style.display = 'none';

    if (this.servicoId) {
      DB.updateServico(this.servicoId, dados);
      Utils.toast('Serviço atualizado.', 'success');
    } else {
      const novo = DB.addServico(dados);
      // O serviço já está automaticamente disponível na Agenda:
      // DB.servicoParaEvento(novo) vai gerar o evento a partir
      // destes mesmos dados quando a Agenda (Fase 4) os pedir.
      Utils.toast(`Serviço ${novo.numero} criado.`, 'success');
    }
    setTimeout(() => window.location.href = 'servicos.html', 500);
  },

  async eliminar() {
    const servico = DB.getServico(this.servicoId);
    const ok = await Utils.confirmDialog(`Eliminar o serviço ${servico.numero}? Esta ação não pode ser desfeita.`, 'Eliminar serviço');
    if (!ok) return;
    DB.deleteServico(this.servicoId);
    Utils.toast('Serviço eliminado.', 'success');
    setTimeout(() => window.location.href = 'servicos.html', 500);
  }
};

document.addEventListener('DOMContentLoaded', () => ServicoPage.init());
