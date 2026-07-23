/* ============================================================
   BTS App – storage.js
   Camada de dados. Tudo passa por aqui.

   Hoje: LocalStorage.
   Amanhã: troca-se o corpo destas funções por chamadas a
   Firebase/Supabase e o resto da aplicação não muda, porque
   todos os módulos (clientes.js, servicos.js, agenda.js...)
   só falam com o objeto `DB`.
   ============================================================ */

const STORAGE_KEYS = {
  USERS: 'bts_users',
  SESSION: 'bts_session',
  CLIENTES: 'bts_clientes',
  ZONAS: 'bts_zonas',
  SERVICOS: 'bts_servicos',
  CATEGORIAS: 'bts_categorias_servico',       // Fase 3: categorias/tipos de serviço editáveis, não fixas no código
  SERVICO_COUNTERS: 'bts_servico_counters',   // Fase 3: contador para gerar BTS-AAAA-NNNNNN
  PREFS: 'bts_preferencias_dispositivo',      // Fase 3.1: preferências locais (tema, sidebar) — nunca vai para Supabase
  CONFIG: 'bts_config',
  SEEDED: 'bts_seeded_v1'
};

/* ============================================================
   FONTE ÚNICA DE VERDADE — listas e cores de "estado"

   Regra do projeto: nenhum estado (Ativo/Inativo, Pendente/
   Confirmado/...) pode estar escrito à mão num HTML ou noutro
   ficheiro JS. Tudo o que precisar de mostrar ou validar estados
   lê estas constantes a partir de DB.* — se um dia quiseres
   renomear "Em Curso" para "A decorrer", muda-se UMA linha aqui
   e a aplicação inteira (badges, selects, agenda) atualiza-se.
   ============================================================ */

const ESTADOS_CLIENTE = ['Ativo', 'Inativo'];
const ESTADOS_ZONA = ['Ativa', 'Inativa'];
const ESTADOS_SERVICO = ['Pendente', 'Confirmado', 'Em Curso', 'Concluído', 'Cancelado'];
const PRIORIDADES_SERVICO = ['Baixa', 'Normal', 'Alta', 'Urgente'];

// Cor por estado/prioridade — usada nos badges (ui.js) E nos
// eventos da Agenda (DB.servicoParaEvento), para nunca haver
// duas paletas diferentes a representar a mesma coisa.
const STATUS_CORES = {
  'Ativo': '#22C55E', 'Inativo': '#6B7280',
  'Ativa': '#22C55E', 'Inativa': '#6B7280',
  'Pendente': '#F59E0B', 'Confirmado': '#2979D4', 'Em Curso': '#F5A800',
  'Concluído': '#22C55E', 'Cancelado': '#EF4444'
};
const PRIORIDADE_CORES = { 'Baixa': '#6B7280', 'Normal': '#2979D4', 'Alta': '#F59E0B', 'Urgente': '#EF4444' };

// Regra de negócio (Fase 3.1): só se pode sincronizar a morada do
// serviço a partir do cliente enquanto o trabalho ainda não começou.
// Fica como constante nomeada, e não escrito à mão dentro da função
// que a usa, para não criar uma segunda "lista de estados" escondida.
const ESTADOS_SERVICO_PERMITEM_SYNC_MORADA = ['Pendente', 'Confirmado'];

/* ============================================================
   MOTOR DE CONSULTA GENÉRICO (filtros + pesquisa + ordenação + paginação)

   Isto é a "camada equivalente" pedida: hoje filtra um array em
   memória; no dia do Supabase, esta função é substituída por uma
   que constrói uma query SQL a partir do mesmo objeto `opcoes` —
   e nenhuma página precisa de mudar, porque continua a chamar
   DB.consultarX({ filtros, pesquisa, ordenacao, pagina }).

   Suporta nos nomes dos filtros:
     campo            → igualdade exata
     campo_contains   → texto contém (case-insensitive)
     campo_gte/_lte   → comparação (datas, números)
   ============================================================ */
function aplicarQuery(lista, opcoes) {
  opcoes = opcoes || {};
  let resultado = [...lista]; // nunca mexe no array original

  if (opcoes.filtros) {
    Object.entries(opcoes.filtros).forEach(([chave, valor]) => {
      if (valor === undefined || valor === null || valor === '') return;
      if (chave.endsWith('_contains')) {
        const campo = chave.replace('_contains', '');
        resultado = resultado.filter(item => (item[campo] || '').toString().toLowerCase().includes(String(valor).toLowerCase()));
      } else if (chave.endsWith('_gte')) {
        const campo = chave.replace('_gte', '');
        resultado = resultado.filter(item => (item[campo] || '') >= valor);
      } else if (chave.endsWith('_lte')) {
        const campo = chave.replace('_lte', '');
        resultado = resultado.filter(item => (item[campo] || '') <= valor);
      } else {
        resultado = resultado.filter(item => item[chave] === valor);
      }
    });
  }

  if (opcoes.pesquisa && opcoes.pesquisa.texto && opcoes.pesquisa.campos) {
    const termo = opcoes.pesquisa.texto.toLowerCase();
    resultado = resultado.filter(item =>
      opcoes.pesquisa.campos.some(campo => (item[campo] || '').toString().toLowerCase().includes(termo))
    );
  }

  if (opcoes.ordenacao && opcoes.ordenacao.campo) {
    const { campo, direcao } = opcoes.ordenacao;
    resultado.sort((a, b) => {
      const va = (a[campo] || '').toString().toLowerCase();
      const vb = (b[campo] || '').toString().toLowerCase();
      if (va < vb) return direcao === 'desc' ? 1 : -1;
      if (va > vb) return direcao === 'desc' ? -1 : 1;
      return 0;
    });
  }

  const total = resultado.length;

  if (opcoes.pagina) {
    const tamanho = opcoes.pagina.tamanho || 10;
    const totalPaginas = Math.max(1, Math.ceil(total / tamanho));
    const numero = Math.min(Math.max(1, opcoes.pagina.numero || 1), totalPaginas);
    const inicio = (numero - 1) * tamanho;
    return { items: resultado.slice(inicio, inicio + tamanho), total, pagina: numero, totalPaginas };
  }

  return { items: resultado, total, pagina: 1, totalPaginas: 1 };
}

/* ---------- Helpers genéricos de leitura/escrita ---------- */

function lsGet(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    console.error('storage.js: erro a ler', key, e);
    return fallback;
  }
}

function lsSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.error('storage.js: erro a gravar', key, e);
    return false;
  }
}

function uid(prefix) {
  return (prefix || 'id') + '_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

/* ---------- Seed inicial (primeira visita) ---------- */

function seedIfNeeded() {
  if (lsGet(STORAGE_KEYS.SEEDED, false)) return;

  // Nota: a partir da integração com Supabase Auth, a autenticação
  // (utilizadores, sessão) deixou de viver aqui — ver app/js/auth.js.
  // STORAGE_KEYS.USERS/SESSION ficam só para compatibilidade com
  // exportAll()/importAll() de instalações antigas.

  // Zonas de exemplo
  const paletaZonas = ['#2979D4', '#F5A800', '#22C55E', '#8B5CF6', '#EF4444', '#0EA5E9', '#F97316', '#14B8A6'];
  const zonasExemplo = ['Lisboa Norte', 'Lisboa Sul', 'Sintra', 'Cascais', 'Loures', 'Margem Sul', 'Porto', 'Padrão da Légua']
    .map((nome, i) => ({
      id: uid('zona'),
      nome,
      codigo: '',
      cor: paletaZonas[i % paletaZonas.length],
      estado: 'Ativa',
      observacoes: '',
      dataCriacao: new Date().toISOString()
    }));
  lsSet(STORAGE_KEYS.ZONAS, zonasExemplo);

  lsSet(STORAGE_KEYS.CLIENTES, []);
  lsSet(STORAGE_KEYS.SERVICOS, []);

  // Categorias de serviço — reaproveitadas do conteúdo real de
  // pages/servicos.html (Eletricidade/Telecomunicações/Carpintaria).
  // Ficam gravadas como DADOS, não como <option> fixas no HTML,
  // para no futuro dar para adicionar uma categoria nova (ex:
  // "Climatização") só a partir da página de Configurações,
  // sem tocar em nenhum ficheiro .js.
  lsSet(STORAGE_KEYS.CATEGORIAS, [
    { id: uid('cat'), nome: 'Eletricidade', icone: '⚡', tipos: ['Instalação Elétrica', 'Quadro Elétrico', 'Manutenção Elétrica', 'Iluminação'] },
    { id: uid('cat'), nome: 'Telecomunicações', icone: '📡', tipos: ['CCTV / Videovigilância', 'Rede Estruturada', 'Fibra Ótica', 'Alarme'] },
    { id: uid('cat'), nome: 'Carpintaria', icone: '🪵', tipos: ['Mobiliário à Medida', 'Remodelação de Interiores', 'Trabalhos em Madeira'] }
  ]);

  lsSet(STORAGE_KEYS.CONFIG, {
    empresa: 'BTS – Bizarro Total Solutions',
    logo: '../assets/images/logo-bts.jpg',
    corPrimaria: '#F5A800',
    tema: 'light'
  });

  lsSet(STORAGE_KEYS.SEEDED, true);
}

/* ---------- API pública de dados ---------- */

const DB = {
  keys: STORAGE_KEYS,
  uid,

  /* ============================================================
     SISTEMA DE EVENTOS (pub/sub interno)

     Não implementa nada visível ainda — é só o "gancho". Serve
     para que, no futuro, um módulo de notificações, auditoria ou
     sincronização se possa inscrever (DB.on('servico:criado', cb))
     sem que addServico/updateServico precisem de o conhecer.
     Isto é o que evita o acoplamento direto que foi pedido: quem
     grava dados não sabe (nem precisa de saber) quem está a ouvir.
     ============================================================ */
  _listeners: {},
  on(evento, callback) {
    if (!this._listeners[evento]) this._listeners[evento] = [];
    this._listeners[evento].push(callback);
  },
  emit(evento, dados) {
    (this._listeners[evento] || []).forEach(cb => {
      try { cb(dados); } catch (e) { console.error('DB.emit: erro num listener de', evento, e); }
    });
  },

  /* Preferências de dispositivo (tema, sidebar recolhida...).
     Propositadamente FORA de ESTADOS_CLIENTE/etc: isto é o único
     tipo de informação que, mesmo depois de migrar tudo para
     Supabase, continua a fazer sentido ficar só neste browser.
     Ainda assim, passa sempre pelo DB — nenhuma página chama
     localStorage diretamente (regra de arquitetura). */
  getPreferenciaDispositivo(chave, padrao) {
    const prefs = lsGet(STORAGE_KEYS.PREFS, {});
    return chave in prefs ? prefs[chave] : padrao;
  },
  setPreferenciaDispositivo(chave, valor) {
    const prefs = lsGet(STORAGE_KEYS.PREFS, {});
    prefs[chave] = valor;
    return lsSet(STORAGE_KEYS.PREFS, prefs);
  },

  /* Utilizadores */
  getUsers() { return lsGet(STORAGE_KEYS.USERS, []); },
  saveUsers(list) { return lsSet(STORAGE_KEYS.USERS, list); },
  addUser(user) {
    const list = this.getUsers();
    user.id = uid('user');
    list.push(user);
    this.saveUsers(list);
    return user;
  },

  /* Sessão */
  getSession() { return lsGet(STORAGE_KEYS.SESSION, null); },
  setSession(session) { return lsSet(STORAGE_KEYS.SESSION, session); },
  clearSession() { localStorage.removeItem(STORAGE_KEYS.SESSION); },

  /* Clientes */
  getClientes() { return lsGet(STORAGE_KEYS.CLIENTES, []); },
  saveClientes(list) { return lsSet(STORAGE_KEYS.CLIENTES, list); },
  getCliente(id) { return this.getClientes().find(c => c.id === id) || null; },

  // Usada pela página de listagem (clientes.js). Ver aplicarQuery()
  // para o formato de `opcoes`.
  consultarClientes(opcoes) { return aplicarQuery(this.getClientes(), opcoes); },

  addCliente(cliente) {
    const list = this.getClientes();
    cliente.id = uid('cli');
    cliente.dataCriacao = cliente.dataCriacao || new Date().toISOString();
    cliente.estado = cliente.estado || 'Ativo';
    list.push(cliente);
    this.saveClientes(list);
    this.emit('cliente:criado', cliente);
    return cliente;
  },
  updateCliente(id, changes) {
    const list = this.getClientes();
    const idx = list.findIndex(c => c.id === id);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], ...changes, id };
    this.saveClientes(list);
    this.emit('cliente:editado', list[idx]);
    return list[idx];
  },
  deleteCliente(id) {
    this.saveClientes(this.getClientes().filter(c => c.id !== id));
    // também remove serviços associados? Não - mantemos histórico, apenas assinalamos.
  },
  duplicateCliente(id) {
    const original = this.getCliente(id);
    if (!original) return null;
    const copy = { ...original };
    delete copy.id;
    copy.nome = original.nome + ' (cópia)';
    copy.dataCriacao = new Date().toISOString();
    return this.addCliente(copy);
  },

  /* Zonas — primeira "entidade de referência" verdadeira da
     aplicação (ver ARCHITECTURE.md). Zonas têm identidade própria
     (id) e Cliente/Serviço referenciam-nas por `zonaId`, nunca
     copiando o nome como texto solto. */
  getZonas() { return lsGet(STORAGE_KEYS.ZONAS, []); },
  saveZonas(list) { return lsSet(STORAGE_KEYS.ZONAS, list); },
  getZona(id) { return this.getZonas().find(z => z.id === id) || null; },
  consultarZonas(opcoes) { return aplicarQuery(this.getZonas(), opcoes); },

  addZona(dados) {
    const nome = (typeof dados === 'string' ? dados : dados.nome || '').trim();
    if (!nome) return null;
    const list = this.getZonas();
    if (list.some(z => z.nome.toLowerCase() === nome.toLowerCase())) return null;
    const zona = {
      id: uid('zona'),
      nome,
      codigo: (typeof dados === 'object' && dados.codigo) || '',
      cor: (typeof dados === 'object' && dados.cor) || '#2979D4',
      estado: 'Ativa',
      observacoes: (typeof dados === 'object' && dados.observacoes) || '',
      dataCriacao: new Date().toISOString()
    };
    list.push(zona);
    this.saveZonas(list);
    this.emit('zona:criada', zona);
    return zona;
  },

  updateZona(id, changes) {
    const list = this.getZonas();
    const idx = list.findIndex(z => z.id === id);
    if (idx === -1) return null;
    if (changes.nome && list.some(z => z.id !== id && z.nome.toLowerCase() === changes.nome.trim().toLowerCase())) {
      return null; // nome já usado por outra zona
    }
    list[idx] = { ...list[idx], ...changes, id };
    this.saveZonas(list);
    this.emit('zona:editada', list[idx]);
    return list[idx];
  },

  // Quantos registos "vivos" referenciam esta zona — usado tanto
  // para decidir se a eliminação é permitida como para mostrar ao
  // utilizador, na página de Zonas, o porquê de estar bloqueada.
  contarUsosZona(id) {
    return {
      clientes: this.getClientes().filter(c => c.zonaId === id).length,
      servicos: this.getServicos().filter(s => s.zonaId === id).length
    };
  },

  // Integridade referencial: nunca elimina fisicamente uma zona com
  // clientes ou serviços associados — devolve {ok:false} e o motivo,
  // para a interface oferecer "Desativar" em vez de apagar.
  deleteZona(id) {
    const usos = this.contarUsosZona(id);
    if (usos.clientes > 0 || usos.servicos > 0) {
      return {
        ok: false,
        erro: `Não é possível eliminar: ${usos.clientes} cliente(s) e ${usos.servicos} serviço(s) associados. Desativa a zona em vez de eliminar.`,
        usos
      };
    }
    this.saveZonas(this.getZonas().filter(z => z.id !== id));
    this.emit('zona:eliminada', { id });
    return { ok: true };
  },

  /* Categorias e tipos de serviço (coleção editável, ver seedIfNeeded) */
  getCategorias() { return lsGet(STORAGE_KEYS.CATEGORIAS, []); },
  saveCategorias(list) { return lsSet(STORAGE_KEYS.CATEGORIAS, list); },
  addCategoria(nome, icone) {
    const list = this.getCategorias();
    if (list.some(c => c.nome.toLowerCase() === nome.toLowerCase())) return null;
    const categoria = { id: uid('cat'), nome, icone: icone || '🔧', tipos: [] };
    list.push(categoria);
    this.saveCategorias(list);
    return categoria;
  },
  addTipoACategoria(categoriaId, tipo) {
    const list = this.getCategorias();
    const cat = list.find(c => c.id === categoriaId);
    if (!cat || cat.tipos.includes(tipo)) return null;
    cat.tipos.push(tipo);
    this.saveCategorias(list);
    return cat;
  },

  /* Listas/cores centralizadas — expostas em DB para que
     nenhum outro ficheiro precise de as duplicar. */
  ESTADOS_CLIENTE,
  ESTADOS_ZONA,
  ESTADOS_SERVICO,
  PRIORIDADES_SERVICO,
  STATUS_CORES,
  PRIORIDADE_CORES,

  /* Numeração legível do serviço (BTS-AAAA-NNNNNN).
     Contador guardado por ano; nunca recua, nunca se repete,
     e é atribuído uma única vez em addServico — updateServico
     nunca o recalcula, por isso o número nunca muda. */
  gerarNumeroServico() {
    const ano = new Date().getFullYear();
    const contadores = lsGet(STORAGE_KEYS.SERVICO_COUNTERS, {});
    const proximo = (contadores[ano] || 0) + 1;
    contadores[ano] = proximo;
    lsSet(STORAGE_KEYS.SERVICO_COUNTERS, contadores);
    return `BTS-${ano}-${String(proximo).padStart(6, '0')}`;
  },

  /* Cria uma entrada de histórico. Usada internamente por
     addServico/updateServico — não precisa de ser chamada de fora. */
  _entradaHistorico(tipo, detalhe) {
    return { tipo, detalhe, data: new Date().toISOString() };
  },

  /* Serviços — a entidade principal da aplicação.

     Campos "reservados" (fotografiasAntes, anexos, checklist...)
     ficam já no objeto, vazios, propositadamente: é o pedido de
     preparar o modelo para funcionalidades futuras sem obrigar a
     re-escrever esta função nem migrar dados antigos mais tarde.
     Um serviço criado hoje já tem a mesma "forma" que vai ter
     daqui a um ano. */
  getServicos() { return lsGet(STORAGE_KEYS.SERVICOS, []); },
  saveServicos(list) { return lsSet(STORAGE_KEYS.SERVICOS, list); },
  getServico(id) { return this.getServicos().find(s => s.id === id) || null; },
  consultarServicos(opcoes) { return aplicarQuery(this.getServicos(), opcoes); },

  // Regra de negócio: só deixa sincronizar a morada a partir do
  // cliente enquanto o serviço ainda não avançou (ver constante
  // ESTADOS_SERVICO_PERMITEM_SYNC_MORADA no topo do ficheiro).
  podeSincronizarMoradaServico(servico) {
    return ESTADOS_SERVICO_PERMITEM_SYNC_MORADA.includes(servico.estado);
  },

  addServico(servico) {
    const list = this.getServicos();
    const agora = new Date().toISOString();

    const completo = {
      // Identificação
      id: uid('srv'),
      numero: this.gerarNumeroServico(),

      // Dados vindos do formulário (cliente, datas, tipo, etc.)
      ...servico,
      estado: servico.estado || 'Pendente',
      prioridade: servico.prioridade || 'Normal',

      // Reservado para fases futuras — propositadamente vazio nesta fase
      fotografiasAntes: [],
      fotografiasDepois: [],
      anexos: [],
      assinaturaDigital: null,
      tempoGasto: null,
      observacoesTecnicas: '',
      materiaisUtilizados: [],
      orcamentoId: null,
      relatorioFinal: null,
      gpsLocalizacao: null,
      checklist: [],

      // Recorrência (Fase 5): reservado, forma pretendida quando for
      // implementado — { tipo: 'diaria'|'semanal'|'quinzenal'|'mensal'
      // |'anual'|'personalizada', intervalo, diasSemana, dataFim,
      // servicoOrigemId }. `null` significa "não é recorrente".
      recorrencia: null,

      // Deteção de conflitos (Fase 5): a validação de conflito (dois
      // serviços para o mesmo funcionário/viatura, horários sobrepostos)
      // só é fiável com uma REFERÊNCIA, não com texto livre — por isso
      // já reservamos os IDs agora, mesmo que ainda não exista o módulo
      // de Funcionários/Viaturas. O campo `funcionario` (texto livre)
      // mantém-se para já como está, até haver onde escolher por ID.
      funcionarioId: null,
      viaturaId: null,

      // Auditoria
      dataCriacao: agora,
      dataAtualizacao: agora,
      historico: [this._entradaHistorico('Criado', 'Serviço criado')]
    };

    list.push(completo);
    this.saveServicos(list);
    this.emit('servico:criado', completo);
    return completo;
  },

  updateServico(id, changes) {
    const list = this.getServicos();
    const idx = list.findIndex(s => s.id === id);
    if (idx === -1) return null;
    const antigo = list[idx];

    // Regista automaticamente as alterações que a Fase 3 pediu para
    // rastrear. Isto é o "preparar a arquitetura": o histórico já
    // funciona de verdade, só ainda não existe uma página para o
    // consultar (isso pode vir a ser um separador em cliente.html
    // ou servico.html numa fase futura, sem tocar nesta função).
    const novasEntradas = [];
    let estadoMudou = false;
    if (changes.estado && changes.estado !== antigo.estado) {
      novasEntradas.push(this._entradaHistorico('Estado alterado', `${antigo.estado} → ${changes.estado}`));
      estadoMudou = true;
    }
    if (changes.funcionario !== undefined && changes.funcionario !== antigo.funcionario) {
      novasEntradas.push(this._entradaHistorico('Funcionário alterado', `${antigo.funcionario || '—'} → ${changes.funcionario || '—'}`));
    }
    if (changes.data && changes.data !== antigo.data) {
      novasEntradas.push(this._entradaHistorico('Data alterada', `${antigo.data} → ${changes.data}`));
    }
    if (changes.morada !== undefined && changes.morada !== antigo.morada) {
      novasEntradas.push(this._entradaHistorico('Morada atualizada', `${antigo.morada || '—'} → ${changes.morada || '—'}`));
    }
    if (changes.zonaId !== undefined && changes.zonaId !== antigo.zonaId) {
      novasEntradas.push(this._entradaHistorico('Zona atualizada', `${antigo.zona || '—'} → ${changes.zona || '—'}`));
    }
    if (!novasEntradas.length) {
      novasEntradas.push(this._entradaHistorico('Editado', 'Dados do serviço atualizados'));
    }

    list[idx] = {
      ...antigo,
      ...changes,
      id,                                            // nunca muda
      numero: antigo.numero,                         // nunca muda
      dataCriacao: antigo.dataCriacao,                // nunca muda
      dataAtualizacao: new Date().toISOString(),
      historico: [...(antigo.historico || []), ...novasEntradas]
    };
    this.saveServicos(list);
    this.emit('servico:editado', list[idx]);
    if (estadoMudou) this.emit('servico:estadoAlterado', { servico: list[idx], de: antigo.estado, para: changes.estado });
    return list[idx];
  },

  deleteServico(id) {
    this.saveServicos(this.getServicos().filter(s => s.id !== id));
    this.emit('servico:eliminado', { id });
  },

  servicosPorCliente(clienteId) {
    return this.getServicos().filter(s => s.clienteId === clienteId);
  },

  /* Adaptador Serviço → Evento FullCalendar.
     A Agenda (Fase 4) vai chamar DB.getServicos().map(DB.servicoParaEvento)
     sempre que desenhar o calendário. Não existe cópia guardada:
     a única fonte de verdade é sempre bts_servicos. */
  // Indicadores visuais do serviço (Fase 4): lê campos que já
  // existem desde a Fase 3 (fotografiasAntes/anexos/prioridade/
  // funcionario), hoje quase sempre vazios. Não é decoração morta —
  // no dia em que o módulo de Fotografias ou Funcionários existir e
  // começar a preencher esses arrays, os ícones aparecem sozinhos,
  // sem tocar aqui outra vez.
  indicadoresServico(servico) {
    const indicadores = [];
    if ((servico.fotografiasAntes && servico.fotografiasAntes.length) || (servico.fotografiasDepois && servico.fotografiasDepois.length)) indicadores.push('📷');
    if (servico.anexos && servico.anexos.length) indicadores.push('📎');
    if (servico.prioridade === 'Urgente') indicadores.push('⚠️');
    if (servico.funcionario) indicadores.push('👷');
    return indicadores;
  },

  servicoParaEvento(servico) {
    const indicadores = this.indicadoresServico(servico);
    const prefixo = indicadores.length ? indicadores.join(' ') + ' ' : '';
    return {
      id: servico.id,
      title: `${prefixo}${servico.numero} · ${servico.clienteNome}`,
      start: `${servico.data}T${servico.horaInicio}`,
      end: `${servico.data}T${servico.horaFim}`,
      color: STATUS_CORES[servico.estado] || '#6B7280',
      extendedProps: {
        clienteId: servico.clienteId,
        clienteNome: servico.clienteNome,
        zonaId: servico.zonaId,
        zona: servico.zona,
        morada: servico.morada,
        area: servico.area,
        estado: servico.estado,
        prioridade: servico.prioridade,
        categoria: servico.categoria,
        tipoServico: servico.tipoServico,
        funcionario: servico.funcionario,
        numero: servico.numero,
        indicadores
      }
    };
  },

  /* Configurações */
  getConfig() { return lsGet(STORAGE_KEYS.CONFIG, {}); },
  saveConfig(cfg) { return lsSet(STORAGE_KEYS.CONFIG, { ...this.getConfig(), ...cfg }); },

  /* Backup / Restauro */
  exportAll() {
    return {
      version: 2,
      exportadoEm: new Date().toISOString(),
      clientes: this.getClientes(),
      zonas: this.getZonas(),
      servicos: this.getServicos(),
      categorias: this.getCategorias(),
      config: this.getConfig(),
      users: this.getUsers()
    };
  },
  importAll(data) {
    if (!data || typeof data !== 'object') throw new Error('Ficheiro inválido');
    if (Array.isArray(data.clientes)) this.saveClientes(data.clientes);
    if (Array.isArray(data.zonas)) this.saveZonas(data.zonas);
    if (Array.isArray(data.servicos)) this.saveServicos(data.servicos);
    if (Array.isArray(data.categorias)) this.saveCategorias(data.categorias);
    if (data.config) this.saveConfig(data.config);
    if (Array.isArray(data.users)) this.saveUsers(data.users);
    return true;
  }
};

seedIfNeeded();

/* ============================================================
   MIGRAÇÃO (Fase 6): Cliente.zona / Servico.zona eram texto solto
   com o nome da zona. Passam a ter `zonaId` como referência real.

   Corre uma única vez (flag própria), associa pelo nome existente
   e — se não encontrar uma zona com esse nome — cria-a, para não
   perder nenhum dado já gravado. O texto `zona` do Serviço não é
   apagado: continua a existir como retrato histórico do nome no
   momento da criação (mesma lógica já usada para clienteNome/morada).
   ============================================================ */
(function migrarReferenciasZona() {
  const FLAG = 'bts_migracao_zonaid_v1';
  if (lsGet(FLAG, false)) return;

  function encontrarOuCriarZona(nome) {
    if (!nome) return null;
    const existente = DB.getZonas().find(z => z.nome.toLowerCase() === nome.toLowerCase());
    if (existente) return existente.id;
    const nova = DB.addZona({ nome });
    return nova ? nova.id : null;
  }

  const clientes = DB.getClientes();
  let mudouClientes = false;
  clientes.forEach(c => {
    if (!c.zonaId && c.zona) {
      c.zonaId = encontrarOuCriarZona(c.zona);
      delete c.zona; // no Cliente, zona é sempre resolvida pelo zonaId — não guardamos texto duplicado
      mudouClientes = true;
    }
  });
  if (mudouClientes) DB.saveClientes(clientes);

  const servicos = DB.getServicos();
  let mudouServicos = false;
  servicos.forEach(s => {
    if (!s.zonaId && s.zona) {
      s.zonaId = encontrarOuCriarZona(s.zona);
      // No Serviço, o texto `zona` FICA — é o retrato histórico.
      mudouServicos = true;
    }
  });
  if (mudouServicos) DB.saveServicos(servicos);

  lsSet(FLAG, true);
})();
