/* ============================================================
   BTS App – agenda.js
   Adaptador de interface. Só isto: inicializa o FullCalendar,
   liga eventos do DOM, chama AgendaService, atualiza a vista.

   Nenhuma regra de negócio vive aqui. Se aparecer uma validação,
   um cálculo ou uma decisão ("isto pode ou não pode"), essa lógica
   pertence ao AgendaService — este ficheiro só pergunta e reage.
   ============================================================ */

const AgendaPage = {
  calendar: null,
  filtros: { clienteId: '', estado: '', categoria: '', tipoServico: '', prioridade: '', zonaId: '', funcionario: '' },
  pesquisa: '',

  async init() {
    const sessao = await Auth.requireAuth();
    if (!sessao) return; // requireAuth já redirecionou para o login
    UI.init('agenda');
    this.populateFiltros();
    this.bindEvents();
    this.criarCalendario();
    this.ligarAtualizacoesAutomaticas();
  },

  populateFiltros() {
    document.getElementById('filtro-cliente-agenda').innerHTML =
      '<option value="">Todos os clientes</option>' +
      [...DB.getClientes()].sort((a, b) => a.nome.localeCompare(b.nome))
        .map(c => `<option value="${c.id}">${Utils.escapeHtml(c.nome)}</option>`).join('');

    document.getElementById('filtro-estado-agenda').innerHTML =
      '<option value="">Todos os estados</option>' + DB.ESTADOS_SERVICO.map(e => `<option value="${e}">${e}</option>`).join('');

    document.getElementById('filtro-categoria-agenda').innerHTML =
      '<option value="">Todas as categorias</option>' + DB.getCategorias().map(c => `<option value="${Utils.escapeHtml(c.nome)}">${c.icone} ${Utils.escapeHtml(c.nome)}</option>`).join('');

    document.getElementById('filtro-prioridade-agenda').innerHTML =
      '<option value="">Todas as prioridades</option>' + DB.PRIORIDADES_SERVICO.map(p => `<option value="${p}">${p}</option>`).join('');

    document.getElementById('filtro-zona-agenda').innerHTML =
      '<option value="">Todas as zonas</option>' + [...DB.getZonas()].sort((a, b) => a.nome.localeCompare(b.nome)).map(z => `<option value="${z.id}">${Utils.escapeHtml(z.nome)}</option>`).join('');

    this.populateTiposFiltro('');
  },

  // Cascata Categoria → Tipo, igual à do formulário de serviço
  // (servico.js) — mesma ideia, reaproveitada, não reinventada.
  populateTiposFiltro(nomeCategoria) {
    const select = document.getElementById('filtro-tipo-agenda');
    const categoria = DB.getCategorias().find(c => c.nome === nomeCategoria);
    const tipos = categoria ? categoria.tipos : [];
    select.innerHTML = '<option value="">Todos os tipos</option>' + tipos.map(t => `<option value="${Utils.escapeHtml(t)}">${Utils.escapeHtml(t)}</option>`).join('');
  },

  bindEvents() {
    document.getElementById('busca-agenda').addEventListener('input', Utils.debounce((e) => {
      this.pesquisa = e.target.value.trim();
      this.calendar.refetchEvents();
    }, 250));

    document.getElementById('filtro-categoria-agenda').addEventListener('change', (e) => {
      this.populateTiposFiltro(e.target.value);
    });

    const idsFiltro = ['filtro-cliente-agenda', 'filtro-estado-agenda', 'filtro-categoria-agenda', 'filtro-tipo-agenda', 'filtro-prioridade-agenda', 'filtro-zona-agenda', 'filtro-funcionario-agenda'];
    idsFiltro.forEach(id => {
      document.getElementById(id).addEventListener('input', () => {
        this.filtros = {
          clienteId: document.getElementById('filtro-cliente-agenda').value,
          estado: document.getElementById('filtro-estado-agenda').value,
          categoria: document.getElementById('filtro-categoria-agenda').value,
          tipoServico: document.getElementById('filtro-tipo-agenda').value,
          prioridade: document.getElementById('filtro-prioridade-agenda').value,
          zonaId: document.getElementById('filtro-zona-agenda').value,
          funcionario: document.getElementById('filtro-funcionario-agenda').value.trim()
        };
        // Nunca filtramos em JS — pedimos ao calendário para voltar
        // a chamar `events`, que por sua vez pergunta ao AgendaService.
        this.calendar.refetchEvents();
      });
    });

    document.getElementById('limpar-filtros-agenda').addEventListener('click', () => {
      this.filtros = { clienteId: '', estado: '', categoria: '', tipoServico: '', prioridade: '', zonaId: '', funcionario: '' };
      this.pesquisa = '';
      document.getElementById('busca-agenda').value = '';
      idsFiltro.forEach(id => document.getElementById(id).value = '');
      this.populateTiposFiltro('');
      this.calendar.refetchEvents();
    });
  },

  criarCalendario() {
    const el = document.getElementById('bts-calendar');

    this.calendar = new FullCalendar.Calendar(el, {
      locale: 'pt',
      height: 'auto',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,threeDay,timeGridDay,listWeek'
      },
      views: { threeDay: { type: 'timeGrid', duration: { days: 3 }, buttonText: '3 dias' } },
      initialView: 'timeGridWeek',
      editable: true,
      selectable: true,
      eventResizableFromStartEdge: false,
      nowIndicator: true,
      firstDay: 1,

      // A ÚNICA fonte de eventos é o AgendaService, que por sua vez
      // só fala com DB.consultarServicos. Pedimos sempre pelo
      // intervalo visível (info.startStr/endStr) — nunca "tudo".
      events: (info, successCallback, failureCallback) => {
        try {
          successCallback(AgendaService.obterEventos({
            dataInicio: info.startStr.slice(0, 10),
            dataFim: info.endStr.slice(0, 10),
            filtros: this.filtros,
            pesquisa: this.pesquisa
          }));
        } catch (erro) {
          console.error('Agenda: erro ao carregar eventos', erro);
          failureCallback(erro);
        }
      },

      // Clique num serviço existente → ficha completa. Sem popup:
      // servico.html continua a ser a única interface de edição.
      eventClick: (info) => {
        window.location.href = `servico.html?id=${info.event.id}`;
      },

      // Clique num dia/hora VAZIO → cria já um serviço novo com a
      // data/hora preenchidas (requisito de navegação da Fase 4).
      dateClick: (info) => this.aoClicarDiaVazio(info),

      eventDrop: (info) => this.processarAlteracaoDeEvento(info),
      eventResize: (info) => this.processarAlteracaoDeEvento(info)
    });

    this.calendar.render();
  },

  aoClicarDiaVazio(info) {
    const data = info.dateStr.slice(0, 10);
    const hora = info.allDay ? '09:00' : Utils.formatHora(info.date);
    window.location.href = AgendaService.gerarLinkNovoServico(data, hora);
  },

  // Adaptador único e centralizado: "Evento FullCalendar → alteração
  // de Serviço". Partilhado por eventDrop e eventResize para esta
  // conversão nunca ficar duplicada nem espalhada por dois sítios.
  extrairAlteracaoDoEvento(event) {
    const inicio = event.start;
    const fim = event.end || event.start;
    const doisDigitos = n => String(n).padStart(2, '0');
    return {
      servicoId: event.id,
      novaData: `${inicio.getFullYear()}-${doisDigitos(inicio.getMonth() + 1)}-${doisDigitos(inicio.getDate())}`,
      novaHoraInicio: Utils.formatHora(inicio),
      novaHoraFim: Utils.formatHora(fim)
    };
  },

  // Sem validação aqui — só extrai os dados do evento e entrega ao
  // AgendaService, que decide se é permitido e o que fazer.
  processarAlteracaoDeEvento(info) {
    const alteracao = this.extrairAlteracaoDoEvento(info.event);
    const resultado = AgendaService.moverServico(alteracao.servicoId, alteracao.novaData, alteracao.novaHoraInicio, alteracao.novaHoraFim);

    if (!resultado.ok) {
      info.revert();
      Utils.toast(resultado.erro, 'warning');
      return;
    }
    Utils.toast(`${resultado.servico.numero} reagendado para ${Utils.formatDate(alteracao.novaData)} ${alteracao.novaHoraInicio}.`, 'success');
    // Não chamamos refetchEvents() aqui de propósito — quem trata
    // disso é o listener de DB.on('servico:editado', ...) abaixo.
    // Um único caminho de atualização, não dois a fazerem o mesmo.
  },

  // Requisito 4: a Agenda reage ao sistema de eventos em vez de ser
  // avisada manualmente depois de cada ação. Qualquer código futuro
  // que crie/edite/elimine um serviço — não só o drag&drop desta
  // página — faz o calendário atualizar-se sozinho. refetchEvents()
  // só troca os eventos, nunca destrói nem recria o calendário.
  ligarAtualizacoesAutomaticas() {
    const atualizarEventos = () => this.calendar.refetchEvents();
    DB.on('servico:criado', atualizarEventos);
    DB.on('servico:editado', atualizarEventos);
    DB.on('servico:estadoAlterado', atualizarEventos);
    DB.on('servico:eliminado', atualizarEventos);

    // O dropdown de filtro de Zona foi populado uma vez no arranque;
    // se uma zona for criada/renomeada/desativada enquanto a Agenda
    // está aberta, o dropdown tem de se atualizar sozinho também.
    const atualizarFiltroZonas = () => {
      const valorAtual = document.getElementById('filtro-zona-agenda').value;
      document.getElementById('filtro-zona-agenda').innerHTML =
        '<option value="">Todas as zonas</option>' + [...DB.getZonas()].sort((a, b) => a.nome.localeCompare(b.nome)).map(z => `<option value="${z.id}">${Utils.escapeHtml(z.nome)}</option>`).join('');
      document.getElementById('filtro-zona-agenda').value = valorAtual;
    };
    DB.on('zona:criada', atualizarFiltroZonas);
    DB.on('zona:editada', atualizarFiltroZonas);
    DB.on('zona:eliminada', atualizarFiltroZonas);
  }
};

document.addEventListener('DOMContentLoaded', () => AgendaPage.init());
