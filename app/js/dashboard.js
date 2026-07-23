/* ============================================================
   BTS App – dashboard.js
   Adaptador de interface. Só isto: pede dados ao DashboardService,
   decide como mostrar (cartões, listas, gráficos Chart.js) e
   atualiza-se sozinho quando os Serviços/Clientes mudam.

   Cada bloco (Resumo, Agenda, Operação, Atividade, Avançados) tem
   a sua própria função de render, sem depender das outras — isto
   é o que torna cada widget independente: esconder, reordenar ou
   adicionar um novo bloco não obriga a tocar nos restantes.
   ============================================================ */

const DashboardPage = {
  graficos: {}, // instâncias Chart.js guardadas para ATUALIZAR em vez de recriar

  init() {
    Auth.requireAuth();
    UI.init('dashboard');
    this.carregarEAtualizarTudo();
    this.ligarAtualizacoesAutomaticas();
  },

  // Requisito permanente: nenhuma atualização manual. Qualquer
  // mutação relevante (criar/editar/eliminar cliente ou serviço,
  // mudar estado, criar zona) faz o Dashboard recalcular-se sozinho.
  // O debounce evita recalcular várias vezes se vários eventos
  // chegarem em sequência muito próxima.
  ligarAtualizacoesAutomaticas() {
    const atualizar = Utils.debounce(() => this.carregarEAtualizarTudo(), 150);
    ['cliente:criado', 'cliente:editado', 'servico:criado', 'servico:editado', 'servico:estadoAlterado', 'servico:eliminado', 'zona:criada', 'zona:editada', 'zona:eliminada']
      .forEach(evento => DB.on(evento, atualizar));
  },

  carregarEAtualizarTudo() {
    const resumo = DashboardService.obterResumo();

    // Cada widget corre isolado: se um falhar, os outros continuam
    // a atualizar-se normalmente — um gráfico com dados inesperados
    // não pode impedir a lista de "serviços hoje" de aparecer.
    this.executarWidget('Alertas', () => this.renderAlertas(resumo.alertas, resumo.agenda));
    this.executarWidget('Resumo Geral', () => this.renderResumoGeral(resumo.resumoGeral));
    this.executarWidget('Agenda', () => this.renderAgenda(resumo.agenda));
    this.executarWidget('Operação', () => this.renderOperacao(resumo.operacao));
    this.executarWidget('Atividade Recente', () => this.renderAtividadeRecente(resumo.atividadeRecente));
    this.executarWidget('Avançados', () => this.renderAvancados(resumo.avancados));
  },

  executarWidget(nome, fn) {
    try {
      fn();
    } catch (erro) {
      console.error(`Dashboard: widget "${nome}" falhou e foi ignorado`, erro);
    }
  },

  /* ---------- Bloco: Alertas (o "centro de decisão") ----------
     Estrutura pensada para crescer: cada aviso novo (ex: "documentação
     em falta", quando o módulo de Anexos existir) é só mais um
     `if` a acrescentar aqui — nunca uma mudança de estrutura. */
  renderAlertas(alertas, agenda) {
    const el = document.getElementById('bloco-alertas');
    const itens = [];
    if (alertas.conflitos.length) {
      itens.push(`<div class="alert alert-danger py-2 mb-2"><i class="fa-solid fa-triangle-exclamation me-2"></i><strong>${alertas.conflitos.length}</strong> conflito(s) de agenda — mesmo funcionário com horários sobrepostos.</div>`);
    }
    if (alertas.totalUrgentes) {
      itens.push(`<div class="alert alert-warning py-2 mb-2"><i class="fa-solid fa-bolt me-2"></i><strong>${alertas.totalUrgentes}</strong> serviço(s) urgente(s) ainda em aberto.</div>`);
    }
    if (agenda.totalAtrasados) {
      itens.push(`<div class="alert alert-warning py-2 mb-2"><i class="fa-solid fa-clock me-2"></i><strong>${agenda.totalAtrasados}</strong> serviço(s) em atraso.</div>`);
    }
    el.innerHTML = itens.join('');
    el.style.display = itens.length ? 'block' : 'none';
  },

  /* ---------- Componente reutilizável: grelha de cartões de estatística ---------- */
  // Usado por Resumo Geral E por Indicadores Avançados — um único
  // template, para nunca haver dois HTMLs de "cartão com número"
  // ligeiramente diferentes a precisarem de manutenção em paralelo.
  renderGrelhaCartoes(containerId, cartoes) {
    document.getElementById(containerId).innerHTML = cartoes.map(c => `
      <div class="col-6 col-md-4 col-xl-2">
        <div class="bts-card ${c.icone ? 'bts-stat-card' : 'bts-card-body'}">
          ${c.icone ? `<div class="bts-stat-icon bts-icon-${c.cor || 'navy'}"><i class="fa-solid ${c.icone}"></i></div>` : ''}
          <div>
            <div class="bts-stat-value" style="${c.icone ? '' : 'font-size:1.3rem'}">${c.valor}</div>
            <div class="bts-stat-label">${c.label}</div>
            ${c.nota ? `<div class="small text-muted mt-1">${c.nota}</div>` : ''}
          </div>
        </div>
      </div>`).join('');
  },

  /* ---------- Bloco: Resumo Geral ---------- */
  renderResumoGeral(r) {
    this.renderGrelhaCartoes('bloco-resumo-geral', [
      { label: 'Total Clientes', valor: r.totalClientes, icone: 'fa-users', cor: 'navy' },
      { label: 'Total Serviços', valor: r.totalServicos, icone: 'fa-screwdriver-wrench', cor: 'blue' },
      { label: 'Serviços Hoje', valor: r.servicosHoje, icone: 'fa-calendar-day', cor: 'gold' },
      { label: 'Pendentes', valor: r.pendentes, icone: 'fa-hourglass-half', cor: 'warning' },
      { label: 'Concluídos', valor: r.concluidos, icone: 'fa-circle-check', cor: 'success' },
      { label: 'Clientes Novos (30d)', valor: r.clientesNovos, icone: 'fa-user-plus', cor: 'blue' }
    ]);
  },

  /* ---------- Bloco: Agenda (o que fazer hoje / atrasado / a seguir) ---------- */
  renderAgenda(agenda) {
    this.renderListaServicos('lista-servicos-hoje', agenda.hoje, 'Sem serviços para hoje.');
    this.renderListaServicos('lista-proximos-servicos', agenda.proximos, 'Sem próximos serviços agendados.');
    this.renderListaServicos('lista-atrasados', agenda.atrasados, 'Sem serviços em atraso. 🎉');
  },

  renderListaServicos(containerId, servicos, mensagemVazio) {
    const el = document.getElementById(containerId);
    if (!servicos.length) {
      el.innerHTML = `<p class="text-muted small mb-0">${mensagemVazio}</p>`;
      return;
    }
    el.innerHTML = servicos.map(s => `
      <a href="servico.html?id=${s.id}" class="d-flex justify-content-between align-items-center py-2" style="border-bottom:1px solid var(--border)">
        <div>
          <strong>${Utils.escapeHtml(s.numero)}</strong>
          <div class="small text-muted">${Utils.escapeHtml(s.clienteNome)} · ${Utils.formatDate(s.data)} ${s.horaInicio}</div>
        </div>
        ${UI.estadoBadge(s.estado)}
      </a>`).join('');
  },

  /* ---------- Bloco: Operação (gráficos + carga por funcionário) ---------- */
  renderOperacao(op) {
    this.atualizarGraficoDoughnut('estado', op.porEstado.map(d => d.estado), op.porEstado.map(d => d.total),
      op.porEstado.map(d => DB.STATUS_CORES[d.estado] || '#6B7280'));

    this.atualizarGraficoBarras('zona', op.porZona.map(d => d.zona), op.porZona.map(d => d.total), op.porZona.map(d => d.cor));
    this.atualizarGraficoBarras('categoria', op.porCategoria.map(d => d.categoria), op.porCategoria.map(d => d.total));
    this.atualizarGraficoLinha('mes', op.porMes.map(d => d.mes), op.porMes.map(d => d.total));

    const elFunc = document.getElementById('lista-por-funcionario');
    elFunc.innerHTML = op.porFuncionario.length
      ? op.porFuncionario.map(f => `<div class="d-flex justify-content-between py-1"><span>${Utils.escapeHtml(f.nome)}</span><strong>${f.total}</strong></div>`).join('')
      : '<p class="text-muted small mb-0">Sem funcionários atribuídos ainda.</p>';

    document.getElementById('bloco-viaturas').innerHTML = op.porViatura === null
      ? '<p class="text-muted small mb-0">Em breve — aguarda o módulo de Viaturas.</p>'
      : '';
  },

  corMarca() {
    return getComputedStyle(document.documentElement).getPropertyValue('--gold').trim() || '#F5A800';
  },

  atualizarGraficoDoughnut(chave, labels, valores, cores) {
    const g = this.graficos[chave];
    if (!g) {
      this.graficos[chave] = new Chart(document.getElementById(`chart-${chave}`), {
        type: 'doughnut',
        data: { labels, datasets: [{ data: valores, backgroundColor: cores }] },
        options: { plugins: { legend: { position: 'bottom', labels: { boxWidth: 12 } } }, maintainAspectRatio: false }
      });
      return;
    }
    g.data.labels = labels;
    g.data.datasets[0].data = valores;
    g.data.datasets[0].backgroundColor = cores;
    g.update();
  },

  atualizarGraficoBarras(chave, labels, valores, cores) {
    const coresFinais = cores || this.corMarca();
    const g = this.graficos[chave];
    if (!g) {
      this.graficos[chave] = new Chart(document.getElementById(`chart-${chave}`), {
        type: 'bar',
        data: { labels, datasets: [{ data: valores, backgroundColor: coresFinais }] },
        options: { plugins: { legend: { display: false } }, maintainAspectRatio: false, scales: { y: { beginAtZero: true, ticks: { precision: 0 } } } }
      });
      return;
    }
    g.data.labels = labels;
    g.data.datasets[0].data = valores;
    g.data.datasets[0].backgroundColor = coresFinais;
    g.update();
  },

  atualizarGraficoLinha(chave, labels, valores) {
    const g = this.graficos[chave];
    if (!g) {
      this.graficos[chave] = new Chart(document.getElementById(`chart-${chave}`), {
        type: 'line',
        data: { labels, datasets: [{ data: valores, borderColor: this.corMarca(), backgroundColor: this.corMarca() + '33', fill: true, tension: 0.3 }] },
        options: { plugins: { legend: { display: false } }, maintainAspectRatio: false, scales: { y: { beginAtZero: true, ticks: { precision: 0 } } } }
      });
      return;
    }
    g.data.labels = labels;
    g.data.datasets[0].data = valores;
    g.update();
  },

  /* ---------- Bloco: Atividade Recente ---------- */
  renderAtividadeRecente(a) {
    const elClientes = document.getElementById('lista-ultimos-clientes');
    elClientes.innerHTML = a.ultimosClientes.length
      ? a.ultimosClientes.map(c => `<a href="cliente.html?id=${c.id}" class="d-flex justify-content-between py-1"><span>${Utils.escapeHtml(c.nome)}</span><span class="small text-muted">${Utils.formatDate(c.dataCriacao)}</span></a>`).join('')
      : '<p class="text-muted small mb-0">Sem clientes ainda.</p>';

    this.renderListaServicos('lista-ultimos-servicos', a.ultimosServicos, 'Sem serviços ainda.');

    const elAlteracoes = document.getElementById('lista-ultimas-alteracoes');
    elAlteracoes.innerHTML = a.ultimasAlteracoes.length
      ? a.ultimasAlteracoes.map(h => `
          <a href="servico.html?id=${h.servicoId}" class="d-flex justify-content-between align-items-start py-1">
            <span><strong class="small">${Utils.escapeHtml(h.tipo)}</strong><div class="small text-muted">${Utils.escapeHtml(h.servicoNumero)} · ${Utils.escapeHtml(h.detalhe)}</div></span>
            <span class="small text-muted">${Utils.formatDate(h.data, true)}</span>
          </a>`).join('')
      : '<p class="text-muted small mb-0">Sem alterações registadas.</p>';
  },

  /* ---------- Bloco: Indicadores Avançados ---------- */
  renderAvancados(av) {
    const fonteLabel = { real: 'dados reais', mista: 'parcialmente estimado', estimado: 'estimado do horário' }[av.horasTrabalhadas.fonte];
    this.renderGrelhaCartoes('bloco-avancados', [
      { label: 'Área Total Intervencionada', valor: `${av.areaTotalIntervencionada} m²` },
      { label: 'Horas Trabalhadas', valor: `${av.horasTrabalhadas.valor} h`, nota: fonteLabel },
      { label: 'Tempo Médio de Execução', valor: av.tempoMedioExecucaoHoras !== null ? `${av.tempoMedioExecucaoHoras} h` : '—' },
      { label: 'Tempo Médio Pedido → Conclusão', valor: av.tempoMedioPedidoConclusaoDias !== null ? `${av.tempoMedioPedidoConclusaoDias} dias` : '—' },
      { label: 'Receita', valor: 'Em breve', nota: 'aguarda módulo de Faturação' }
    ]);
  }
};

document.addEventListener('DOMContentLoaded', () => DashboardPage.init());
