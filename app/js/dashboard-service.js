/* ============================================================
   BTS App – dashboard-service.js
   Mesma filosofia da Agenda: DashboardService só conhece dados e
   regras de negócio. Nunca devolve HTML, nunca cria um gráfico,
   nunca toca no DOM — dashboard.js é que decide como apresentar.

   Ponto central desta fase: obterResumo() faz UMA leitura de
   DB.getServicos()/DB.getClientes() e UM ciclo sobre os serviços
   que alimenta todos os cartões, listas e gráficos ao mesmo tempo
   — em vez de cada widget pedir os seus próprios dados e repetir
   o filtro/ordenação que outro widget já tinha feito.
   ============================================================ */

const ESTADOS_ABERTOS = ['Pendente', 'Confirmado', 'Em Curso'];

const DashboardService = {

  obterResumo() {
    const clientes = DB.getClientes();
    const servicos = DB.getServicos();
    const hojeISO = Utils.todayISO();

    const porEstado = {};
    const porZona = {};
    const porCategoria = {};
    const porFuncionario = {};
    const conflitosBuckets = {};
    const porMes = this._inicializarUltimosMeses(12);

    let servicosHoje = 0, pendentes = 0, concluidos = 0;
    let areaTotal = 0, somaHoras = 0, servicosComTempoReal = 0;
    const duracoesPedidoConclusao = [];
    const atrasados = [];
    const proximosCandidatos = [];
    const urgentesAbertos = [];

    // Um único ciclo — todos os agregados saem daqui, nenhum outro
    // sítio volta a percorrer `servicos` para os mesmos números.
    servicos.forEach(s => {
      porEstado[s.estado] = (porEstado[s.estado] || 0) + 1;
      // Agrega por zonaId (referência real) — o Dashboard é uma vista
      // operacional AO VIVO, por isso deve refletir o nome atual da
      // zona, mesmo que o Serviço guarde o nome histórico em `zona`.
      // Fallback ao texto só cobre o caso (não esperado, a migração
      // trata disto) de um registo sem zonaId nenhum.
      const chaveZona = s.zonaId || s.zona;
      if (chaveZona) porZona[chaveZona] = (porZona[chaveZona] || 0) + 1;
      if (s.categoria) porCategoria[s.categoria] = (porCategoria[s.categoria] || 0) + 1;

      if (s.funcionario && s.funcionario.trim()) {
        const chave = s.funcionario.trim().toLowerCase();
        if (!porFuncionario[chave]) porFuncionario[chave] = { nome: s.funcionario.trim(), total: 0 };
        porFuncionario[chave].total++;
      }

      if (s.data === hojeISO) servicosHoje++;
      if (s.estado === 'Pendente' || s.estado === 'Confirmado') pendentes++;

      if (s.estado === 'Concluído') {
        concluidos++;
        areaTotal += Number(s.area) || 0;
        if (s.tempoGasto != null) { somaHoras += s.tempoGasto / 60; servicosComTempoReal++; }
        else somaHoras += this._duracaoHoras(s.horaInicio, s.horaFim);

        const momentoConclusao = this._encontrarMomentoConclusao(s);
        if (momentoConclusao) {
          duracoesPedidoConclusao.push((new Date(momentoConclusao) - new Date(s.dataCriacao)) / 86400000);
        }
      }

      if (ESTADOS_ABERTOS.includes(s.estado) && s.data < hojeISO) atrasados.push(s);
      if (ESTADOS_ABERTOS.includes(s.estado) && s.data >= hojeISO) proximosCandidatos.push(s);
      if (s.prioridade === 'Urgente' && ESTADOS_ABERTOS.includes(s.estado)) urgentesAbertos.push(s);

      const mesChave = (s.data || '').slice(0, 7);
      if (mesChave in porMes) porMes[mesChave]++;

      // Deteção de conflitos: melhor esforço, agrupando por texto
      // livre do funcionário — fica correta de verdade quando
      // existir o módulo de Funcionários e servico.funcionarioId
      // passar a ser preenchido (ver Fase 4.1 e AgendaService).
      if (s.funcionario && s.funcionario.trim() && s.data && ESTADOS_ABERTOS.includes(s.estado)) {
        const chaveConflito = s.data + '|' + s.funcionario.trim().toLowerCase();
        (conflitosBuckets[chaveConflito] = conflitosBuckets[chaveConflito] || []).push(s);
      }
    });

    proximosCandidatos.sort((a, b) => (a.data + a.horaInicio).localeCompare(b.data + b.horaInicio));
    atrasados.sort((a, b) => a.data.localeCompare(b.data));

    const clientesNovos = clientes.filter(c => this._diasDesde(c.dataCriacao) <= 30).length;

    // Reaproveita o motor de consulta já existente em vez de
    // reordenar/filtrar os arrays outra vez à mão.
    const ultimosClientes = DB.consultarClientes({ ordenacao: { campo: 'dataCriacao', direcao: 'desc' }, pagina: { numero: 1, tamanho: 5 } }).items;
    const ultimosServicos = DB.consultarServicos({ ordenacao: { campo: 'dataCriacao', direcao: 'desc' }, pagina: { numero: 1, tamanho: 5 } }).items;

    const ultimasAlteracoes = servicos
      .flatMap(s => (s.historico || []).map(h => ({ ...h, servicoNumero: s.numero, servicoId: s.id })))
      .sort((a, b) => b.data.localeCompare(a.data))
      .slice(0, 10);

    // Resolve as chaves de zona (IDs) para nome+cor atuais — uma
    // única vez aqui, não em cada widget que consumir este resumo.
    const mapaZonas = {};
    DB.getZonas().forEach(z => { mapaZonas[z.id] = z; });

    return {
      resumoGeral: { totalClientes: clientes.length, totalServicos: servicos.length, servicosHoje, pendentes, concluidos, clientesNovos },

      agenda: {
        hoje: servicos.filter(s => s.data === hojeISO),
        proximos: proximosCandidatos.slice(0, 5),
        atrasados: atrasados.slice(0, 5),
        totalAtrasados: atrasados.length
      },

      operacao: {
        porEstado: Object.entries(porEstado).map(([estado, total]) => ({ estado, total })),
        porZona: Object.entries(porZona)
          .map(([chave, total]) => {
            const zona = mapaZonas[chave];
            return { zonaId: chave, zona: zona ? zona.nome : chave, cor: zona ? zona.cor : '#6B7280', total };
          })
          .sort((a, b) => b.total - a.total),
        porCategoria: Object.entries(porCategoria).map(([categoria, total]) => ({ categoria, total })),
        porFuncionario: Object.values(porFuncionario).sort((a, b) => b.total - a.total),
        porMes: Object.entries(porMes).map(([mes, total]) => ({ mes, total })),
        // Sem fonte de dados ainda — módulo de Viaturas não existe.
        porViatura: null
      },

      atividadeRecente: { ultimosClientes, ultimosServicos, ultimasAlteracoes },

      alertas: {
        conflitos: this._detetarSobreposicoes(conflitosBuckets),
        urgentesAbertos,
        totalUrgentes: urgentesAbertos.length
      },

      // Indicadores avançados (requisito 6): alguns já são reais
      // hoje (área, tempo médio), porque os campos já existiam;
      // outros ficam honestamente marcados como "em breve" até
      // existir o módulo que lhes dá dados (Faturação, Viaturas).
      avancados: {
        areaTotalIntervencionada: Math.round(areaTotal * 10) / 10,
        horasTrabalhadas: {
          valor: Math.round(somaHoras * 10) / 10,
          // 'real' = todos os concluídos já têm tempoGasto preenchido;
          // 'estimado' = calculado a partir do horário agendado.
          fonte: servicosComTempoReal === 0 ? 'estimado' : (servicosComTempoReal === concluidos ? 'real' : 'mista')
        },
        tempoMedioExecucaoHoras: concluidos
          ? Math.round((servicos.filter(s => s.estado === 'Concluído').reduce((acc, s) => acc + this._duracaoHoras(s.horaInicio, s.horaFim), 0) / concluidos) * 10) / 10
          : null,
        tempoMedioPedidoConclusaoDias: duracoesPedidoConclusao.length
          ? Math.round((duracoesPedidoConclusao.reduce((a, b) => a + b, 0) / duracoesPedidoConclusao.length) * 10) / 10
          : null,
        receita: null // aguarda módulo de Orçamentos/Faturação
      }
    };
  },

  /* ---------- Auxiliares privados (puros, sem estado) ---------- */

  _duracaoHoras(inicio, fim) {
    if (!inicio || !fim) return 0;
    const [hi, mi] = inicio.split(':').map(Number);
    const [hf, mf] = fim.split(':').map(Number);
    return Math.max(0, ((hf * 60 + mf) - (hi * 60 + mi)) / 60);
  },

  _diasDesde(iso) {
    return (Date.now() - new Date(iso).getTime()) / 86400000;
  },

  _inicializarUltimosMeses(n) {
    const mapa = {};
    const agora = new Date();
    for (let i = n - 1; i >= 0; i--) {
      const d = new Date(agora.getFullYear(), agora.getMonth() - i, 1);
      mapa[`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`] = 0;
    }
    return mapa;
  },

  // Procura no histórico do serviço a entrada que marcou "→ Concluído".
  _encontrarMomentoConclusao(servico) {
    const entrada = (servico.historico || []).slice().reverse()
      .find(h => h.tipo === 'Estado alterado' && h.detalhe && h.detalhe.endsWith('→ Concluído'));
    return entrada ? entrada.data : null;
  },

  // Dentro de cada grupo (mesmo dia + mesmo funcionário em texto),
  // compara pares de horários à procura de sobreposição real.
  _detetarSobreposicoes(buckets) {
    const conflitos = [];
    Object.values(buckets).forEach(grupo => {
      if (grupo.length < 2) return;
      for (let i = 0; i < grupo.length; i++) {
        for (let j = i + 1; j < grupo.length; j++) {
          const a = grupo[i], b = grupo[j];
          if (a.horaInicio < b.horaFim && a.horaFim > b.horaInicio) {
            conflitos.push({ funcionario: a.funcionario, servicoA: a, servicoB: b });
          }
        }
      }
    });
    return conflitos;
  }
};
