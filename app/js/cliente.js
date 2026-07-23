/* ============================================================
   BTS App – cliente.js
   Responsabilidade única: criar OU editar UM cliente, e mostrar
   o seu histórico de serviços. Ficheiro separado de clientes.js
   porque o modo de funcionamento é diferente: aqui há apenas UM
   registo em jogo, lido a partir do parâmetro ?id= da URL.

   Isto é uma página só — sem id na URL: modo "criar".
   Com id na URL: modo "editar", e o formulário vem pré-preenchido.
   ============================================================ */

const ClientePage = {
  clienteId: null, // null = a criar; string = a editar

  init() {
    Auth.requireAuth();
    UI.init('clientes');
    this.clienteId = new URLSearchParams(window.location.search).get('id');
    this.populateZonas();
    this.bindEvents();

    if (this.clienteId) {
      this.carregarParaEdicao();
    } else {
      document.getElementById('cliente-titulo').textContent = 'Novo Cliente';
      document.getElementById('cliente-subtitulo').textContent = 'Preenche os dados para adicionar um novo cliente.';
      document.getElementById('bloco-historico').style.display = 'none';
      document.getElementById('btn-eliminar').style.display = 'none';
      document.getElementById('btn-duplicar').style.display = 'none';
    }
  },

  populateZonas() {
    const select = document.getElementById('cliente-zona');
    const zonas = [...DB.getZonas()].sort((a, b) => a.nome.localeCompare(b.nome));
    // Fase 6: value passa a ser o ID da zona (referência real), não
    // o nome em texto. Zonas Inativas continuam a aparecer para não
    // "esconder" a escolha de um cliente já associado a uma zona
    // entretanto desativada — mas assinaladas, para não confundir
    // com uma escolha nova.
    select.innerHTML = '<option value="">Selecionar zona...</option>' +
      zonas.map(z => `<option value="${z.id}">${Utils.escapeHtml(z.nome)}${z.estado === 'Inativa' ? ' (Inativa)' : ''}</option>`).join('');

    // Retrofit Fase 3 (regra 5): o select de Estado deixa de ter
    // <option> escritas no HTML — vem sempre de DB.ESTADOS_CLIENTE.
    const estadoSelect = document.getElementById('cliente-estado');
    estadoSelect.innerHTML = DB.ESTADOS_CLIENTE.map(e => `<option value="${e}">${e}</option>`).join('');
  },

  carregarParaEdicao() {
    const cliente = DB.getCliente(this.clienteId);
    if (!cliente) {
      Utils.toast('Cliente não encontrado.', 'danger');
      window.location.href = 'clientes.html';
      return;
    }
    document.getElementById('cliente-titulo').textContent = cliente.nome;
    document.getElementById('cliente-subtitulo').textContent = `Cliente desde ${Utils.formatDate(cliente.dataCriacao)}`;
    document.getElementById('cliente-avatar').textContent = cliente.nome.slice(0, 2).toUpperCase();

    const fields = ['nome', 'nif', 'morada', 'codigoPostal', 'localidade', 'distrito', 'telefone', 'telemovel', 'email', 'contacto', 'observacoes', 'estado'];
    fields.forEach(f => {
      const el = document.getElementById('cliente-' + f);
      if (el && cliente[f] !== undefined) el.value = cliente[f];
    });
    document.getElementById('cliente-zona').value = cliente.zonaId || '';

    this.renderHistorico(cliente.id);
  },

  renderHistorico(clienteId) {
    const servicos = DB.servicosPorCliente(clienteId).sort((a, b) => (b.data || '').localeCompare(a.data || ''));
    const el = document.getElementById('lista-historico');
    if (!servicos.length) {
      el.innerHTML = `<div class="bts-empty-state"><i class="fa-solid fa-clock-rotate-left"></i><p>Ainda sem serviços registados para este cliente.</p></div>`;
      return;
    }
    el.innerHTML = servicos.map(s => `
      <a href="servico.html?id=${s.id}" class="d-flex justify-content-between align-items-center py-2" style="border-bottom:1px solid var(--border)">
        <div>
          <strong>${Utils.escapeHtml(s.numero || s.tipoServico || 'Serviço')}</strong>
          <div class="small text-muted">${Utils.formatDate(s.data)} · ${Utils.escapeHtml(s.zona || '')}</div>
        </div>
        ${UI.estadoBadge(s.estado)}
      </a>
    `).join('');
  },

  bindEvents() {
    document.getElementById('form-cliente').addEventListener('submit', (e) => this.guardar(e));
    document.getElementById('btn-eliminar').addEventListener('click', () => this.eliminar());
    document.getElementById('btn-duplicar').addEventListener('click', () => this.duplicar());
    document.getElementById('btn-nova-zona').addEventListener('click', () => this.criarZonaRapida());
  },

  // Pequeno atalho de produtividade: em vez de obrigar o utilizador
  // a ir à página de Zonas só para adicionar uma zona nova, permite
  // criá-la aqui mesmo e já fica selecionada. A gestão completa
  // (editar/eliminar zonas) continua a viver no módulo de Zonas.
  criarZonaRapida() {
    const nome = window.prompt('Nome da nova zona:');
    if (!nome || !nome.trim()) return;
    const zona = DB.addZona({ nome: nome.trim() });
    if (!zona) { Utils.toast('Essa zona já existe.', 'warning'); return; }
    this.populateZonas();
    document.getElementById('cliente-zona').value = zona.id;
    Utils.toast('Zona adicionada.', 'success');
  },

  validar(dados) {
    const erros = [];
    if (!dados.nome.trim()) erros.push('O nome é obrigatório.');
    if (dados.nif && !Utils.validateNIF(dados.nif)) erros.push('O NIF introduzido é inválido.');
    if (dados.codigoPostal && !Utils.validatePostalCode(dados.codigoPostal)) erros.push('O código postal deve ter o formato 0000-000.');
    if (dados.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dados.email)) erros.push('O email introduzido é inválido.');
    return erros;
  },

  guardar(e) {
    e.preventDefault();
    const dados = {
      nome: document.getElementById('cliente-nome').value,
      nif: document.getElementById('cliente-nif').value.trim(),
      morada: document.getElementById('cliente-morada').value.trim(),
      codigoPostal: document.getElementById('cliente-codigoPostal').value.trim(),
      localidade: document.getElementById('cliente-localidade').value.trim(),
      distrito: document.getElementById('cliente-distrito').value.trim(),
      zonaId: document.getElementById('cliente-zona').value || null,
      telefone: document.getElementById('cliente-telefone').value.trim(),
      telemovel: document.getElementById('cliente-telemovel').value.trim(),
      email: document.getElementById('cliente-email').value.trim(),
      contacto: document.getElementById('cliente-contacto').value.trim(),
      observacoes: document.getElementById('cliente-observacoes').value.trim(),
      estado: document.getElementById('cliente-estado').value
    };

    const erros = this.validar(dados);
    const errorBox = document.getElementById('cliente-erros');
    if (erros.length) {
      errorBox.innerHTML = erros.map(e => `<div>${Utils.escapeHtml(e)}</div>`).join('');
      errorBox.style.display = 'block';
      errorBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    errorBox.style.display = 'none';

    if (this.clienteId) {
      DB.updateCliente(this.clienteId, dados);
      Utils.toast('Cliente atualizado.', 'success');
    } else {
      const novo = DB.addCliente(dados);
      Utils.toast('Cliente criado.', 'success');
      this.clienteId = novo.id;
    }
    setTimeout(() => window.location.href = 'clientes.html', 500);
  },

  async eliminar() {
    const cliente = DB.getCliente(this.clienteId);
    const ok = await Utils.confirmDialog(`Eliminar "${cliente.nome}"? Esta ação não pode ser desfeita.`, 'Eliminar cliente');
    if (!ok) return;
    DB.deleteCliente(this.clienteId);
    Utils.toast('Cliente eliminado.', 'success');
    setTimeout(() => window.location.href = 'clientes.html', 500);
  },

  duplicar() {
    const copy = DB.duplicateCliente(this.clienteId);
    if (copy) window.location.href = `cliente.html?id=${copy.id}`;
  }
};

document.addEventListener('DOMContentLoaded', () => ClientePage.init());
