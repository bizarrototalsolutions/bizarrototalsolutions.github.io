/* ============================================================
   BTS App – storage.js
   Camada de dados. Tudo passa por aqui.

   FASE 5: já não é LocalStorage — é Supabase a sério, com uma
   linha (owner_id) a garantir que cada conta só vê e só grava
   os SEUS próprios dados (zero partilha entre contas).

   Para nenhum outro ficheiro (ui.js, agenda.js, clientes.js...)
   precisar de ser reescrito do zero, mantém-se o mesmo desenho:
   um objeto `DB` com os mesmos nomes de métodos. A única mudança
   visível para quem só LÊ dados é nenhuma — os getters continuam
   síncronos, porque leem de uma cache em memória que é carregada
   uma vez, logo no arranque da página, com `await DB.ready()`.
   Quem ESCREVE dados (criar/editar/eliminar) já espera uma
   Promise, porque agora essa escrita vai mesmo para o servidor.
   ============================================================ */

const STORAGE_KEYS = {
  SESSION: 'bts_session',
  PREFS: 'bts_preferencias_dispositivo'   // tema, sidebar recolhida... nunca vai para Supabase
};

/* ============================================================
   FONTE ÚNICA DE VERDADE — listas e cores de "estado"
   ============================================================ */

const ESTADOS_CLIENTE = ['Ativo', 'Inativo'];
const ESTADOS_SERVICO = ['Pendente', 'Confirmado', 'Em Curso', 'Concluído', 'Cancelado'];
const PRIORIDADES_SERVICO = ['Baixa', 'Normal', 'Alta', 'Urgente'];

const STATUS_CORES = {
  'Ativo': '#22C55E', 'Inativo': '#6B7280',
  'Pendente': '#F59E0B', 'Confirmado': '#2979D4', 'Em Curso': '#F5A800',
  'Concluído': '#22C55E', 'Cancelado': '#EF4444'
};
const PRIORIDADE_CORES = { 'Baixa': '#6B7280', 'Normal': '#2979D4', 'Alta': '#F59E0B', 'Urgente': '#EF4444' };

const ESTADOS_SERVICO_PERMITEM_SYNC_MORADA = ['Pendente', 'Confirmado'];

/* ============================================================
   MOTOR DE CONSULTA GENÉRICO (filtros + pesquisa + ordenação + paginação)
   Continua a operar sobre arrays em memória — a cache já carregada
   do Supabase. Nada nas páginas precisa de mudar aqui.
   ============================================================ */
function aplicarQuery(lista, opcoes) {
  opcoes = opcoes || {};
  let resultado = [...lista];

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

/* ---------- Helpers genéricos (localStorage só para prefs/sessão) ---------- */

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

function entradaHistorico(tipo, detalhe) {
  return { tipo, detalhe, data: new Date().toISOString() };
}

/* Traduz erros comuns do Postgres/Supabase para mensagens claras em
   português, em vez de deixar a página mostrar "erro genérico" quando
   a causa real (ex: registo ainda usado noutro sítio) é conhecida. */
function erroAmigavel(error, mensagemPadrao) {
  if (error && error.code === '23503') {
    return new Error('Este registo ainda está a ser usado noutro sítio (ex: serviços associados) — remove essas ligações primeiro.');
  }
  if (error && error.code === '23505') {
    return new Error('Já existe um registo com esse nome.');
  }
  console.error('storage.js: erro Supabase ->', error);
  return new Error(mensagemPadrao || 'Ocorreu um erro. Tenta novamente.');
}

/* ============================================================
   MAPEAMENTO camelCase (app) <-> snake_case (Supabase)

   Cada tabela tem um dicionário {chaveJS: coluna_bd}. As funções
   genéricas toDb()/fromDb() convertem nos dois sentidos, para as
   páginas continuarem a falar sempre em camelCase (nome, dataCriacao,
   codigoPostal...), exatamente como antes da migração.
   ============================================================ */

const MAP_CLIENTE = {
  id: 'id', nome: 'nome', nif: 'nif', morada: 'morada', codigoPostal: 'codigo_postal',
  localidade: 'localidade', distrito: 'distrito', zona: 'zona', telefone: 'telefone',
  telemovel: 'telemovel', email: 'email', contacto: 'contacto', observacoes: 'observacoes',
  estado: 'estado', dataCriacao: 'criado_em', dataAtualizacao: 'atualizado_em'
};

const MAP_ZONA = { id: 'id', nome: 'nome' };
const MAP_CATEGORIA = { id: 'id', nome: 'nome', icone: 'icone' };

const MAP_SERVICO = {
  id: 'id', numero: 'numero', clienteId: 'cliente_id', clienteNome: 'cliente_nome',
  zona: 'zona', morada: 'morada', codigoPostal: 'codigo_postal', localidade: 'localidade',
  data: 'data', horaInicio: 'hora_inicio', horaFim: 'hora_fim', categoria: 'categoria',
  tipoServico: 'tipo_servico', area: 'area', estado: 'estado', prioridade: 'prioridade',
  funcionario: 'funcionario', observacoes: 'observacoes', dataCriacao: 'criado_em',
  dataAtualizacao: 'atualizado_em', historico: 'historico', checklist: 'checklist'
};

const MAP_CONFIG = {
  empresa: 'nome_empresa', nif: 'nif', morada: 'morada', codigoPostal: 'codigo_postal',
  localidade: 'localidade', pais: 'pais', email: 'email', telefone: 'telefone',
  website: 'website', iban: 'iban', logo: 'logo_url', corPrimaria: 'cor_principal',
  corSecundaria: 'cor_secundaria', tema: 'tema_padrao'
};

function toDb(jsObj, map) {
  const row = {};
  Object.entries(map).forEach(([jsKey, dbKey]) => {
    if (jsObj[jsKey] !== undefined) row[dbKey] = jsObj[jsKey];
  });
  return row;
}
function fromDb(dbRow, map) {
  const obj = {};
  Object.entries(map).forEach(([jsKey, dbKey]) => { obj[jsKey] = dbRow[dbKey]; });
  return obj;
}

function clienteDeDb(row) { return fromDb(row, MAP_CLIENTE); }
function clienteParaDb(obj) { return toDb(obj, MAP_CLIENTE); }
function zonaDeDb(row) { return fromDb(row, MAP_ZONA); }
function servicoDeDb(row) {
  const s = fromDb(row, MAP_SERVICO);
  // Campos reservados para fases futuras (fotos, assinatura, anexos...)
  // ainda não têm coluna própria — ficam vazios, tal como no modelo antigo.
  s.fotografiasAntes = [];
  s.fotografiasDepois = [];
  s.anexos = [];
  s.assinaturaDigital = null;
  s.tempoGasto = row.tempo_gasto ?? null;
  s.observacoesTecnicas = row.observacoes_tecnicas || '';
  s.materiaisUtilizados = row.materiais_utilizados || [];
  s.orcamentoId = row.orcamento_id || null;
  s.relatorioFinal = row.relatorio_final || null;
  s.gpsLocalizacao = row.gps_localizacao || null;
  s.recorrencia = row.recorrencia || null;
  s.funcionarioId = row.funcionario_id || null;
  s.viaturaId = row.viatura_id || null;
  s.checklist = row.checklist || [];
  s.historico = row.historico || [];
  return s;
}
function servicoParaDb(obj) { return toDb(obj, MAP_SERVICO); }
function configDeDb(row) { return fromDb(row, MAP_CONFIG); }
function configParaDb(obj) { return toDb(obj, MAP_CONFIG); }

/* ============================================================
   CACHE EM MEMÓRIA + CARREGAMENTO INICIAL

   `DB.ready()` é a única chamada assíncrona que cada página faz,
   logo a seguir a Auth.requireAuth(). Depois disso, todos os
   getters (getClientes, getZonas, getServicos, getConfig...)
   continuam 100% síncronos, tal como antes — só as escritas
   (addX/updateX/deleteX) é que devolvem uma Promise agora,
   porque vão mesmo a um servidor.
   ============================================================ */

const _cache = { clientes: [], zonas: [], servicos: [], categorias: [], tipos: [], config: {} };
let _ownerId = null;
let _readyPromise = null;

async function carregarTudo() {
  const { data: userData } = await supabaseClient.auth.getUser();
  _ownerId = userData && userData.user ? userData.user.id : null;

  const [clientesRes, zonasRes, servicosRes, categoriasRes, tiposRes, configRes] = await Promise.all([
    supabaseClient.from('clientes').select('*').is('deleted_at', null),
    supabaseClient.from('zonas').select('*').is('deleted_at', null),
    supabaseClient.from('servicos').select('*').is('deleted_at', null),
    supabaseClient.from('categorias_servico').select('*').is('deleted_at', null),
    supabaseClient.from('tipos_servico').select('*').is('deleted_at', null),
    supabaseClient.from('configuracoes').select('*').maybeSingle()
  ]);

  [clientesRes, zonasRes, servicosRes, categoriasRes, tiposRes].forEach(r => {
    if (r.error) console.error('storage.js: erro ao carregar dados ->', r.error);
  });

  _cache.clientes = (clientesRes.data || []).map(clienteDeDb);
  _cache.zonas = (zonasRes.data || []).map(zonaDeDb);
  _cache.servicos = (servicosRes.data || []).map(servicoDeDb);
  _cache.tipos = tiposRes.data || [];
  _cache.categorias = (categoriasRes.data || []).map(c => ({
    id: c.id, nome: c.nome, icone: c.icone,
    tipos: _cache.tipos.filter(t => t.categoria_id === c.id).map(t => t.nome)
  }));

  // Primeira visita desta conta: sem zonas nem categorias -> semeia
  // os valores de exemplo, exatamente como a versão local fazia,
  // mas agora gravados a sério na conta do utilizador.
  if (!_cache.zonas.length && !_cache.categorias.length) {
    await semearDadosIniciais();
  }

  // Configuração da empresa: se esta conta ainda não tem linha própria,
  // cria-se uma com os valores por omissão (uma linha por conta).
  if (configRes.data) {
    _cache.config = configDeDb(configRes.data);
  } else {
    const defaults = {
      nome_empresa: 'BTS – Bizarro Total Solutions',
      logo_url: '../assets/images/logo-bts.jpg',
      cor_principal: '#F5A800',
      tema_padrao: 'light'
    };
    const { data, error } = await supabaseClient.from('configuracoes').insert(defaults).select().single();
    if (error) { console.error('storage.js: erro ao criar configuração inicial ->', error); _cache.config = configDeDb(defaults); }
    else _cache.config = configDeDb(data);
  }
}

async function semearDadosIniciais() {
  // zonas/categorias_servico/tipos_servico têm "id" texto SEM valor por
  // omissão na base de dados (ao contrário de clientes/servicos) — por
  // isso o próprio código tem de gerar sempre o id antes de inserir.
  const zonasExemplo = ['Lisboa Norte', 'Lisboa Sul', 'Sintra', 'Cascais', 'Loures', 'Margem Sul', 'Porto', 'Padrão da Légua']
    .map(nome => ({ id: uid('zona'), nome }));
  const { data: zonasInseridas, error: errZonas } = await supabaseClient.from('zonas').insert(zonasExemplo).select();
  if (errZonas) console.error('storage.js: erro ao semear zonas ->', errZonas);
  _cache.zonas = (zonasInseridas || []).map(zonaDeDb);

  const categoriasExemplo = [
    { nome: 'Eletricidade', icone: '⚡', tipos: ['Instalação Elétrica', 'Quadro Elétrico', 'Manutenção Elétrica', 'Iluminação'] },
    { nome: 'Telecomunicações', icone: '📡', tipos: ['CCTV / Videovigilância', 'Rede Estruturada', 'Fibra Ótica', 'Alarme'] },
    { nome: 'Carpintaria', icone: '🪵', tipos: ['Mobiliário à Medida', 'Remodelação de Interiores', 'Trabalhos em Madeira'] }
  ];

  const categoriasCache = [];
  for (const cat of categoriasExemplo) {
    const { data: catRow, error: errCat } = await supabaseClient.from('categorias_servico')
      .insert({ id: uid('cat'), nome: cat.nome, icone: cat.icone }).select().single();
    if (errCat) { console.error('storage.js: erro ao semear categoria ->', errCat); continue; }

    const tiposPayload = cat.tipos.map(nome => ({ id: uid('tipo'), categoria_id: catRow.id, nome }));
    const { data: tiposRows, error: errTipos } = await supabaseClient.from('tipos_servico').insert(tiposPayload).select();
    if (errTipos) console.error('storage.js: erro ao semear tipos ->', errTipos);

    categoriasCache.push({ id: catRow.id, nome: catRow.nome, icone: catRow.icone, tipos: (tiposRows || []).map(t => t.nome) });
    _cache.tipos.push(...(tiposRows || []));
  }
  _cache.categorias = categoriasCache;
}

/* ---------- API pública de dados ---------- */

const DB = {
  keys: STORAGE_KEYS,
  uid,

  /* Espera a carga inicial (uma só vez por página) antes de qualquer
     leitura síncrona. Chamar sempre logo a seguir a Auth.requireAuth(). */
  ready() {
    if (!_readyPromise) _readyPromise = carregarTudo();
    return _readyPromise;
  },

  /* Sistema de eventos (pub/sub interno) — inalterado. */
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

  /* Preferências de dispositivo — continuam só neste browser. */
  getPreferenciaDispositivo(chave, padrao) {
    const prefs = lsGet(STORAGE_KEYS.PREFS, {});
    return chave in prefs ? prefs[chave] : padrao;
  },
  setPreferenciaDispositivo(chave, valor) {
    const prefs = lsGet(STORAGE_KEYS.PREFS, {});
    prefs[chave] = valor;
    return lsSet(STORAGE_KEYS.PREFS, prefs);
  },

  /* Utilizadores: já não existem aqui (Supabase Auth trata disto).
     Mantido só para nenhuma chamada antiga rebentar. */
  getUsers() { return []; },
  saveUsers() { return true; },
  addUser() { throw new Error('Contas só são criadas pelo dono, no painel do Supabase.'); },

  /* Sessão (marcador local sincronizado com a sessão real do Supabase — ver auth.js) */
  getSession() { return lsGet(STORAGE_KEYS.SESSION, null); },
  setSession(session) { return lsSet(STORAGE_KEYS.SESSION, session); },
  clearSession() { localStorage.removeItem(STORAGE_KEYS.SESSION); },

  /* ---------------- Clientes ---------------- */
  getClientes() { return [..._cache.clientes]; },
  getCliente(id) { return _cache.clientes.find(c => c.id === id) || null; },
  consultarClientes(opcoes) { return aplicarQuery(this.getClientes(), opcoes); },

  async addCliente(dados) {
    const payload = clienteParaDb({
      id: uid('cli'),
      estado: 'Ativo',
      ...dados
    });
    const { data, error } = await supabaseClient.from('clientes').insert(payload).select().single();
    if (error) throw erroAmigavel(error, 'Não foi possível criar o cliente.');
    const cliente = clienteDeDb(data);
    _cache.clientes.push(cliente);
    this.emit('cliente:criado', cliente);
    return cliente;
  },

  async updateCliente(id, changes) {
    const payload = clienteParaDb(changes);
    const { data, error } = await supabaseClient.from('clientes').update(payload).eq('id', id).select().single();
    if (error) throw erroAmigavel(error, 'Não foi possível guardar as alterações do cliente.');
    const cliente = clienteDeDb(data);
    const idx = _cache.clientes.findIndex(c => c.id === id);
    if (idx !== -1) _cache.clientes[idx] = cliente; else _cache.clientes.push(cliente);
    this.emit('cliente:editado', cliente);
    return cliente;
  },

  async deleteCliente(id) {
    const { error } = await supabaseClient.from('clientes').delete().eq('id', id);
    if (error) throw erroAmigavel(error, 'Não foi possível eliminar o cliente.');
    _cache.clientes = _cache.clientes.filter(c => c.id !== id);
    this.emit('cliente:eliminado', { id });
  },

  async duplicateCliente(id) {
    const original = this.getCliente(id);
    if (!original) return null;
    const copy = { ...original };
    delete copy.id;
    delete copy.dataCriacao;
    delete copy.dataAtualizacao;
    copy.nome = original.nome + ' (cópia)';
    return this.addCliente(copy);
  },

  /* ---------------- Zonas ---------------- */
  getZonas() { return [..._cache.zonas]; },
  consultarZonas(opcoes) { return aplicarQuery(this.getZonas(), opcoes); },

  async addZona(nome) {
    if (_cache.zonas.some(z => z.nome.toLowerCase() === nome.toLowerCase())) return null;
    const { data, error } = await supabaseClient.from('zonas').insert({ id: uid('zona'), nome }).select().single();
    if (error) throw erroAmigavel(error, 'Não foi possível criar a zona.');
    const zona = zonaDeDb(data);
    _cache.zonas.push(zona);
    this.emit('zona:criada', zona);
    return zona;
  },

  async updateZona(id, nome) {
    const { data, error } = await supabaseClient.from('zonas').update({ nome }).eq('id', id).select().single();
    if (error) throw erroAmigavel(error, 'Não foi possível guardar a zona.');
    const zona = zonaDeDb(data);
    const idx = _cache.zonas.findIndex(z => z.id === id);
    if (idx !== -1) _cache.zonas[idx] = zona;
    this.emit('zona:editada', zona);
    return zona;
  },

  async deleteZona(id) {
    const { error } = await supabaseClient.from('zonas').delete().eq('id', id);
    if (error) throw erroAmigavel(error, 'Não foi possível eliminar a zona.');
    _cache.zonas = _cache.zonas.filter(z => z.id !== id);
    this.emit('zona:eliminada', { id });
  },

  /* ---------------- Categorias / Tipos de serviço ---------------- */
  getCategorias() { return _cache.categorias.map(c => ({ ...c, tipos: [...c.tipos] })); },

  async addCategoria(nome, icone) {
    if (_cache.categorias.some(c => c.nome.toLowerCase() === nome.toLowerCase())) return null;
    const { data, error } = await supabaseClient.from('categorias_servico').insert({ id: uid('cat'), nome, icone: icone || '🔧' }).select().single();
    if (error) throw erroAmigavel(error, 'Não foi possível criar a categoria.');
    const categoria = { id: data.id, nome: data.nome, icone: data.icone, tipos: [] };
    _cache.categorias.push(categoria);
    this.emit('categoria:criada', categoria);
    return categoria;
  },

  async addTipoACategoria(categoriaId, tipo) {
    const cat = _cache.categorias.find(c => c.id === categoriaId);
    if (!cat || cat.tipos.includes(tipo)) return null;
    const { data, error } = await supabaseClient.from('tipos_servico').insert({ id: uid('tipo'), categoria_id: categoriaId, nome: tipo }).select().single();
    if (error) throw erroAmigavel(error, 'Não foi possível adicionar o tipo.');
    cat.tipos.push(data.nome);
    _cache.tipos.push(data);
    return cat;
  },

  async deleteCategoria(categoriaId) {
    // Elimina primeiro os tipos desta categoria — senão a ligação
    // tipos_servico -> categorias_servico bloqueia a eliminação.
    const { error: errTipos } = await supabaseClient.from('tipos_servico').delete().eq('categoria_id', categoriaId);
    if (errTipos) throw erroAmigavel(errTipos, 'Não foi possível eliminar os tipos desta categoria.');

    const { error } = await supabaseClient.from('categorias_servico').delete().eq('id', categoriaId);
    if (error) throw erroAmigavel(error, 'Não foi possível eliminar a categoria.');
    _cache.categorias = _cache.categorias.filter(c => c.id !== categoriaId);
    _cache.tipos = _cache.tipos.filter(t => t.categoria_id !== categoriaId);
    this.emit('categoria:eliminada', { id: categoriaId });
  },

  async deleteTipo(categoriaId, tipoNome) {
    const linha = _cache.tipos.find(t => t.categoria_id === categoriaId && t.nome === tipoNome);
    if (!linha) return;
    const { error } = await supabaseClient.from('tipos_servico').delete().eq('id', linha.id);
    if (error) throw erroAmigavel(error, 'Não foi possível eliminar o tipo.');
    _cache.tipos = _cache.tipos.filter(t => t.id !== linha.id);
    const cat = _cache.categorias.find(c => c.id === categoriaId);
    if (cat) cat.tipos = cat.tipos.filter(t => t !== tipoNome);
  },

  /* Listas/cores centralizadas */
  ESTADOS_CLIENTE,
  ESTADOS_SERVICO,
  PRIORIDADES_SERVICO,
  STATUS_CORES,
  PRIORIDADE_CORES,

  /* Numeração legível do serviço (BTS-AAAA-NNNNNN), agora calculada
     no servidor a partir dos serviços já gravados desta conta —
     nunca duas contas (nem dois dispositivos da mesma conta) geram
     o mesmo número, porque já não depende de um contador local. */
  async _gerarNumeroServico() {
    const ano = new Date().getFullYear();
    const prefixo = `BTS-${ano}-`;
    const { data, error } = await supabaseClient.from('servicos')
      .select('numero').ilike('numero', prefixo + '%').order('numero', { ascending: false }).limit(1);
    let proximo = 1;
    if (!error && data && data.length) {
      const n = parseInt(String(data[0].numero).slice(prefixo.length), 10);
      if (!isNaN(n)) proximo = n + 1;
    }
    return prefixo + String(proximo).padStart(6, '0');
  },

  /* ---------------- Serviços ---------------- */
  getServicos() { return [..._cache.servicos]; },
  getServico(id) { return _cache.servicos.find(s => s.id === id) || null; },
  consultarServicos(opcoes) { return aplicarQuery(this.getServicos(), opcoes); },

  podeSincronizarMoradaServico(servico) {
    return ESTADOS_SERVICO_PERMITEM_SYNC_MORADA.includes(servico.estado);
  },

  async addServico(servico) {
    const numero = await this._gerarNumeroServico();
    const payload = servicoParaDb({
      id: uid('srv'),
      numero,
      estado: servico.estado || 'Pendente',
      prioridade: servico.prioridade || 'Normal',
      historico: [entradaHistorico('Criado', 'Serviço criado')],
      ...servico
    });
    const { data, error } = await supabaseClient.from('servicos').insert(payload).select().single();
    if (error) throw erroAmigavel(error, 'Não foi possível criar o serviço.');
    const completo = servicoDeDb(data);
    _cache.servicos.push(completo);
    this.emit('servico:criado', completo);
    return completo;
  },

  async updateServico(id, changes) {
    const antigo = this.getServico(id);
    if (!antigo) return null;

    const novasEntradas = [];
    let estadoMudou = false;
    if (changes.estado && changes.estado !== antigo.estado) {
      novasEntradas.push(entradaHistorico('Estado alterado', `${antigo.estado} → ${changes.estado}`));
      estadoMudou = true;
    }
    if (changes.funcionario !== undefined && changes.funcionario !== antigo.funcionario) {
      novasEntradas.push(entradaHistorico('Funcionário alterado', `${antigo.funcionario || '—'} → ${changes.funcionario || '—'}`));
    }
    if (changes.data && changes.data !== antigo.data) {
      novasEntradas.push(entradaHistorico('Data alterada', `${antigo.data} → ${changes.data}`));
    }
    if (changes.morada !== undefined && changes.morada !== antigo.morada) {
      novasEntradas.push(entradaHistorico('Morada atualizada', `${antigo.morada || '—'} → ${changes.morada || '—'}`));
    }
    if (!novasEntradas.length) novasEntradas.push(entradaHistorico('Editado', 'Dados do serviço atualizados'));

    const payload = servicoParaDb({
      ...changes,
      historico: [...(antigo.historico || []), ...novasEntradas]
    });
    delete payload.numero; // nunca muda
    delete payload.criado_em; // nunca muda

    const { data, error } = await supabaseClient.from('servicos').update(payload).eq('id', id).select().single();
    if (error) throw erroAmigavel(error, 'Não foi possível guardar as alterações do serviço.');
    const atualizado = servicoDeDb(data);
    const idx = _cache.servicos.findIndex(s => s.id === id);
    if (idx !== -1) _cache.servicos[idx] = atualizado;
    this.emit('servico:editado', atualizado);
    if (estadoMudou) this.emit('servico:estadoAlterado', { servico: atualizado, de: antigo.estado, para: changes.estado });
    return atualizado;
  },

  async deleteServico(id) {
    const { error } = await supabaseClient.from('servicos').delete().eq('id', id);
    if (error) throw erroAmigavel(error, 'Não foi possível eliminar o serviço.');
    _cache.servicos = _cache.servicos.filter(s => s.id !== id);
    this.emit('servico:eliminado', { id });
  },

  servicosPorCliente(clienteId) {
    return _cache.servicos.filter(s => s.clienteId === clienteId);
  },

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

  /* ---------------- Configurações (uma linha por conta) ---------------- */
  getConfig() { return { ..._cache.config }; },

  async saveConfig(changes) {
    const payload = configParaDb(changes);
    const { data, error } = await supabaseClient.from('configuracoes').update(payload).eq('owner_id', _ownerId).select().single();
    if (error) throw erroAmigavel(error, 'Não foi possível guardar as configurações.');
    _cache.config = configDeDb(data);
    this.emit('config:atualizada', _cache.config);
    return _cache.config;
  },

  /* ---------------- Backup / Restauro (usado em configuracoes.html) ---------------- */
  exportAll() {
    return {
      version: 3,
      exportadoEm: new Date().toISOString(),
      clientes: this.getClientes(),
      zonas: this.getZonas(),
      servicos: this.getServicos(),
      categorias: this.getCategorias(),
      config: this.getConfig()
    };
  },

  async importAll(data) {
    if (!data || typeof data !== 'object') throw new Error('Ficheiro inválido');

    if (Array.isArray(data.zonas)) {
      for (const z of data.zonas) {
        if (!_cache.zonas.some(existing => existing.nome.toLowerCase() === (z.nome || '').toLowerCase())) {
          await this.addZona(z.nome);
        }
      }
    }
    if (Array.isArray(data.categorias)) {
      for (const c of data.categorias) {
        let cat = _cache.categorias.find(existing => existing.nome.toLowerCase() === (c.nome || '').toLowerCase());
        if (!cat) cat = await this.addCategoria(c.nome, c.icone);
        if (cat && Array.isArray(c.tipos)) {
          for (const t of c.tipos) await this.addTipoACategoria(cat.id, t);
        }
      }
    }
    if (Array.isArray(data.clientes)) {
      for (const c of data.clientes) {
        const { id, dataCriacao, dataAtualizacao, ...resto } = c;
        await this.addCliente(resto);
      }
    }
    if (Array.isArray(data.servicos)) {
      for (const s of data.servicos) {
        const { id, numero, dataCriacao, dataAtualizacao, historico, ...resto } = s;
        await this.addServico(resto);
      }
    }
    if (data.config) await this.saveConfig(data.config);
    return true;
  }
};
