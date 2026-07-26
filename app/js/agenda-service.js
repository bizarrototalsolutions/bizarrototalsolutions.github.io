/* ============================================================
   BTS App – agenda-service.js
   PRIMEIRO módulo construído com a camada de serviços (Business
   Layer) que acordámos: agenda.js NUNCA chama DB.* diretamente,
   só fala com AgendaService.

   Isto separa:
     DB             → persistência (hoje LocalStorage, amanhã Supabase)
     AgendaService  → regras de negócio da Agenda
     agenda.js      → só interface (FullCalendar, DOM, popups)
   ============================================================ */

// Estados que impedem reagendar um serviço a partir do calendário.
// Nota de arquitetura: isto é, na verdade, uma regra sobre o
// ciclo de vida do SERVIÇO, não da Agenda. Fica aqui porque a
// Agenda é o primeiro (e único, por agora) sítio que precisa dela.
// Se um dia nascer um ServicoService, esta constante muda-se para
// lá — é uma linha a mover, não uma decisão a repensar.
const ESTADOS_BLOQUEIAM_REAGENDAMENTO = ['Concluído', 'Cancelado'];

const AgendaService = {

  /* Traduz o intervalo visível do calendário + filtros ativos
     num pedido a DB.consultarServicos, e devolve já no formato
     que o FullCalendar espera (via DB.servicoParaEvento).

     Nunca lê "todos os serviços" — só os do intervalo pedido.
     É isto que mantém a Agenda rápida com 100.000 serviços: em
     vez de trazer a tabela toda, filtra sempre por data_gte/
     data_lte, que o motor de consulta já suporta desde a Fase 3. */
  obterEventos({ dataInicio, dataFim, filtros, pesquisa }) {
    const opcoes = {
      filtros: {
        data_gte: dataInicio,
        data_lte: dataFim,
        clienteId: (filtros && filtros.clienteId) || undefined,
        estado: (filtros && filtros.estado) || undefined,
        categoria: (filtros && filtros.categoria) || undefined,
        tipoServico: (filtros && filtros.tipoServico) || undefined,
        prioridade: (filtros && filtros.prioridade) || undefined,
        zona: (filtros && filtros.zona) || undefined,
        funcionario_contains: (filtros && filtros.funcionario) || undefined
      }
    };
    if (pesquisa) {
      opcoes.pesquisa = { texto: pesquisa, campos: ['numero', 'clienteNome', 'tipoServico'] };
    }
    const { items } = DB.consultarServicos(opcoes);
    return items.map(servico => DB.servicoParaEvento(servico));
  },

  podeReagendar(servico) {
    return !ESTADOS_BLOQUEIAM_REAGENDAMENTO.includes(servico.estado);
  },

  /* Chamada pelo eventDrop/eventResize do FullCalendar.
     Devolve sempre { ok, erro? , servico? } — nunca lança exceção —
     para agenda.js decidir facilmente entre aceitar ou reverter
     o arrasto (info.revert()). */
  moverServico(servicoId, novaData, novaHoraInicio, novaHoraFim) {
    const servico = DB.getServico(servicoId);
    if (!servico) return { ok: false, erro: 'Serviço não encontrado.' };

    if (!this.podeReagendar(servico)) {
      return { ok: false, erro: `Não é possível reagendar: o serviço já está "${servico.estado}".` };
    }
    if (novaHoraFim <= novaHoraInicio) {
      return { ok: false, erro: 'A hora de fim deve ser depois da hora de início.' };
    }

    // DB.updateServico já regista "Data alterada" no histórico e
    // emite o evento servico:editado — a Agenda não duplica nada disso.
    const atualizado = DB.updateServico(servicoId, {
      data: novaData,
      horaInicio: novaHoraInicio,
      horaFim: novaHoraFim
    });
    return { ok: true, servico: atualizado };
  },

  obterServicoPorId(id) {
    return DB.getServico(id);
  },

  // Requisito 1: clicar num dia/hora vazio da Agenda deve abrir
  // servico.html já com data/hora preenchidas. A FORMA do link
  // (que parâmetros usar) é uma decisão do domínio, não do DOM —
  // por isso vive aqui, não em agenda.js.
  gerarLinkNovoServico(data, hora) {
    return `servico.html?data=${encodeURIComponent(data)}&hora=${encodeURIComponent(hora)}`;
  }
};
