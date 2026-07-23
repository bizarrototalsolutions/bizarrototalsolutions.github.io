# Changelog — BTS App

Registo de evolução do projeto, fase a fase. Atualizado no final de cada fase importante.

## Fase 6 — Zonas (entidade de referência) + normalização
- Novo: `zonas.html`, `zonas.js` — módulo piloto de "entidade de referência": listar, pesquisar, filtrar, criar, editar, ativar/desativar, eliminar com integridade referencial.
- Zona ganha modelo completo: `codigo`, `cor`, `estado` (`Ativa`/`Inativa`), `observacoes`, `dataCriacao`.
- `DB.contarUsosZona()` / `DB.deleteZona()` — nunca elimina fisicamente uma zona com clientes/serviços associados; devolve o motivo exato (quantos clientes, quantos serviços), mostrado na interface em vez de um erro genérico.
- Contador de utilização (clientes/serviços) visível diretamente na tabela de Zonas, sempre, não só ao tentar eliminar.
- **Normalização:** Cliente e Serviço passam a referenciar `zonaId` (relação real) em vez de copiar o nome da zona como texto. Cliente resolve o nome sempre ao vivo (dado "vivo"); Serviço mantém `zonaId` **e** `zona` (retrato histórico do nome, mesma lógica já usada para `clienteNome`/morada).
- Migração automática, única, dos dados existentes (`zona` texto → `zonaId`), com criação automática de zonas "órfãs" encontradas em registos antigos sem perder dados.
- `servico.html`: campo Zona passa de texto livre a `<select>` controlado.
- Agenda e Dashboard atualizados para filtrar/agrupar por `zonaId`; Dashboard passa a mostrar a cor oficial da zona no gráfico "Serviços por Zona".
- Ambos reagem também a `zona:criada/editada/eliminada` via `DB.on()`, sem recarregar página.

## Fase 5 — Dashboard
- Novo: `DashboardService` (business layer, testável sem browser), `dashboard.js`, `dashboard.html`.
- Indicadores em tempo real: totais, hoje, pendentes, concluídos, clientes novos.
- Bloco "Alertas" (centro de decisão): conflitos de agenda, urgentes em aberto, atrasados.
- 4 gráficos Chart.js (Estado, Zona, Categoria, últimos 12 meses) — atualizados via `.update()`, nunca recriados.
- Indicadores avançados reais a partir de dados já existentes: Área Total Intervencionada, Tempo Médio de Execução, Tempo Médio Pedido→Conclusão.
- Atualização automática via `DB.on()` — sem botão de refresh.
- Widgets isolados (`executarWidget`) — uma falha não arrasta os restantes.
- `login.html` volta a redirecionar para `dashboard.html` (Login → Dashboard).

## Fase 4.1 — Preparação de modelo (recorrência, conflitos, lote)
- Novo: campos reservados no Serviço — `recorrencia`, `funcionarioId`, `viaturaId`.
- Decisão registada: operações em lote não exigem alteração de esquema; evento agregado `servicos:loteAtualizado` desenhado para essa fase futura.

## Fase 4 — Agenda
- Novo: `AgendaService` (primeiro módulo com Business Layer), `agenda.js`, `agenda.html`.
- FullCalendar totalmente isolado em `agenda.js` — `AgendaService` não conhece FullCalendar, DOM ou HTML.
- Vistas: Dia, 3 Dias, Semana, Mês, Lista.
- Drag & drop / resize com validação (`podeReagendar`) e reversão automática quando bloqueado.
- Clique em serviço existente → ficha completa (`servico.html`); clique em dia/hora vazio → novo serviço pré-preenchido.
- Indicadores visuais no evento (📷📎⚠️👷) a partir de campos já reservados desde a Fase 3.
- Atualização automática via `DB.on()`.
- `DB.deleteServico` passa a emitir `servico:eliminado`.

## Fase 3.1 — Endurecimento de arquitetura
- Novo: motor de consulta genérico `aplicarQuery` + `DB.consultarClientes/Servicos/Zonas(opcoes)`.
- Novo: sistema de eventos `DB.on()`/`DB.emit()`.
- Novo: `DB.getPreferenciaDispositivo/setPreferenciaDispositivo` — `ui.js` deixa de chamar `localStorage` diretamente.
- Novo: regra de sincronização de morada (`podeSincronizarMoradaServico`) com bloqueio por estado do serviço.
- `clientes.js`/`servicos.js` deixam de duplicar lógica de filtro/ordenação/paginação.
- Retrofit: estados de Cliente deixam de estar escritos em HTML (`DB.ESTADOS_CLIENTE`).

## Fase 3 — Serviços
- Novo: `servicos.html`, `servico.html`, `servico.js`, `servicos.js`.
- Serviço como entidade principal: numeração legível e imutável (`BTS-AAAA-NNNNNN`), categorias editáveis (não fixas no código), histórico automático de alterações.
- Campos reservados para módulos futuros: fotografias, anexos, assinatura digital, tempo gasto, materiais, orçamento, relatório final, GPS, checklist.
- `DB.servicoParaEvento` — adaptador Serviço → Evento, preparado para a Agenda sem coleção própria de eventos.

## Fase 2 — Clientes
- Novo: `clientes.html`, `cliente.html`, `clientes.js`, `cliente.js`.
- CRUD completo, validação de NIF (dígito de controlo oficial) e código postal.
- Exportação Excel/PDF, filtros, pesquisa, paginação.
- Zona rápida a partir do formulário de Cliente.

## Fase 1 — Fundação
- Novo: `login.html`, `storage.js` (camada `DB`), `auth.js`, `utils.js`, `ui.js`, `app.css`.
- Autenticação via LocalStorage, proteção de página.
- Layout admin (sidebar recolhível, topo, tema claro/escuro) construído sobre os tokens visuais já existentes do site institucional.
- Sidebar/topbar partilhados, gerados a partir de configuração, não duplicados por página.
