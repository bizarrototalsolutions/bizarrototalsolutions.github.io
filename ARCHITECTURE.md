# Arquitetura — BTS App

> Última atualização: Fase 5 (Dashboard). Este documento descreve a arquitetura tal como existe hoje — deve ser atualizado no final de cada fase importante.

## 1. Visão geral

A aplicação é 100% HTML5 + CSS3 + JavaScript Vanilla (ES6+), sem build step, compatível com GitHub Pages. Persistência atual: LocalStorage. Toda a arquitetura foi desenhada para que a persistência possa ser trocada por Supabase/PostgreSQL sem alterar a interface.

## 2. As três camadas

```
┌─────────────────────────────────────────────┐
│  INTERFACE  (ex: agenda.js, dashboard.js)    │  ← DOM, eventos de clique, bibliotecas
│      conhece: a página, a biblioteca de UI    │     de terceiros (FullCalendar, Chart.js)
│      NUNCA conhece: localStorage/Supabase     │
└───────────────────┬───────────────────────────┘
                     │ chama métodos de
┌───────────────────▼───────────────────────────┐
│  SERVIÇOS (Business Layer)                    │  ← regras de negócio, validações,
│  ex: AgendaService, DashboardService          │     decisões ("pode ou não pode")
│      NUNCA conhece: DOM, HTML, FullCalendar,   │
│      Chart.js                                  │
└───────────────────┬───────────────────────────┘
                     │ chama métodos de
┌───────────────────▼───────────────────────────┐
│  DB  (storage.js)                              │  ← persistência pura
│      hoje: LocalStorage                        │
│      amanhã: Supabase/PostgreSQL               │
│      NUNCA conhece: regras de negócio, UI       │
└─────────────────────────────────────────────────┘
```

**Regra permanente:** só `storage.js` chama `localStorage` diretamente. Nenhuma outra camada sabe que tipo de armazenamento existe por baixo.

Nem todos os módulos têm ainda uma camada de Serviços própria — foi introduzida a partir da Agenda (Fase 4). Clientes e Serviços continuam a falar com `DB` diretamente, porque ainda não surgiu uma regra de negócio complexa que justificasse extrair um `ClienteService`/`ServicoService`. Ver Roadmap para quando isso deve mudar.

## 3. Princípios de arquitetura (permanentes, aplicam-se a todo o projeto)

1. **Fonte única de verdade** — nenhuma lista de estados, categorias, zonas ou configuração é escrita em mais do que um sítio. Tudo vem de `DB`.
2. **Separação entre domínio, armazenamento e interface** — ver secção 2.
3. **Modularidade** — cada módulo (Clientes, Serviços, Agenda, Dashboard...) tem os seus próprios ficheiros, sem depender da estrutura interna de outro módulo.
4. **A Agenda e o Dashboard nunca guardam dados próprios** — são sempre uma vista sobre `Serviços`/`Clientes`. Isto vale para qualquer módulo futuro que "represente" dados de outro (Relatórios, Estatísticas).
5. **Sistema de eventos para desacoplamento** — mutações emitem eventos (`DB.on`/`DB.emit`); quem precisa de reagir subscreve, em vez de quem grava ter de saber quem está a ouvir.
6. **Testes antes da interface** — a lógica de negócio (Service layer) é validada em Node, sem browser, antes de se escrever uma linha de HTML.
7. **Sem dívida técnica silenciosa** — qualquer limitação, decisão adiada ou atalho é registado no `ROADMAP.md`, nunca só na cabeça de quem escreveu o código.

## 4. Modelo de dados (resumo)

| Entidade | Chave LocalStorage | Notas |
|---|---|---|
| Utilizadores | `bts_users` | `role` já existe (`Administrador`), mas sem sistema de permissões ativo |
| Sessão | `bts_session` | utilizador autenticado |
| Clientes | `bts_clientes` | inclui `estado` (`DB.ESTADOS_CLIENTE`) |
| Zonas | `bts_zonas` | primeira "entidade de referência" completa (Fase 6): `nome`, `codigo`, `cor`, `estado` (`Ativa`/`Inativa`), `observacoes`, `dataCriacao` |
| Categorias de Serviço | `bts_categorias_servico` | coleção editável, não fixa no código |
| Serviços | `bts_servicos` | entidade principal; ver campos abaixo |
| Contadores de numeração | `bts_servico_counters` | gera `BTS-AAAA-NNNNNN`, nunca muda após criado |
| Preferências de dispositivo | `bts_preferencias_dispositivo` | tema, sidebar — nunca migra para Supabase |
| Configuração da empresa | `bts_config` | nome, logo, cor, tema |

### Cliente e Serviço — referência a Zona (Fase 6)
`Cliente.zonaId` é a única fonte (dado "vivo": o nome é sempre resolvido a partir da zona atual, nunca copiado). `Servico.zonaId` **e** `Servico.zona` (texto) coexistem: o ID é a relação real, o texto é o retrato histórico do nome no momento da criação — mesma lógica do `clienteNome`. Este é o padrão oficial para todas as futuras "entidades de referência" (Funcionários, Viaturas): entidades vivas (Cliente) referenciam por ID e refletem o estado atual; registos transacionais (Serviço) guardam ID + snapshot de texto.

### Serviço — campos reservados para módulos futuros
`fotografiasAntes`, `fotografiasDepois`, `anexos`, `assinaturaDigital`, `tempoGasto`, `observacoesTecnicas`, `materiaisUtilizados`, `orcamentoId`, `relatorioFinal`, `gpsLocalizacao`, `checklist`, `recorrencia`, `funcionarioId`, `viaturaId` — todos `null`/`[]` hoje, com a forma final já documentada nos comentários de `storage.js`.

## 5. Catálogo de eventos (`DB.on`/`DB.emit`)

| Evento | Disparado por | Dados |
|---|---|---|
| `cliente:criado` | `DB.addCliente` | cliente completo |
| `cliente:editado` | `DB.updateCliente` | cliente atualizado |
| `zona:criada` | `DB.addZona` | zona |
| `zona:editada` | `DB.updateZona` | zona atualizada |
| `zona:eliminada` | `DB.deleteZona` (só quando permitido) | `{ id }` |
| `servico:criado` | `DB.addServico` | serviço completo |
| `servico:editado` | `DB.updateServico` | serviço atualizado |
| `servico:estadoAlterado` | `DB.updateServico` (quando o estado muda) | `{ servico, de, para }` |
| `servico:eliminado` | `DB.deleteServico` | `{ id }` |

Subscritores atuais: `AgendaPage` e `DashboardPage` (ambos re-consultam os seus dados, nunca guardam o payload do evento diretamente).

## 6. Pontos fortes atuais

- Motor de consulta genérico (`aplicarQuery`) elimina duplicação de filtro/ordenação/paginação entre módulos.
- Histórico de auditoria (`historico[]`) já funciona de verdade, não é decorativo.
- Adaptadores de conversão sempre centralizados num único sítio (`DB.servicoParaEvento`, `agenda.js:extrairAlteracaoDoEvento`).
- Cobertura de testes de lógica (Node) em todos os módulos desde a Fase 3.

## 7. Pontos a melhorar (ver `ROADMAP.md` para prazos)

- Deteção de conflitos e "carga por funcionário" dependem de texto livre, não de IDs.
- Sem `ClienteService`/`ServicoService` — aceitável hoje, mas Serviços vai precisar de um quando Faturação/Orçamentos chegar.
- Sem sistema de permissões ativo (só a lista `DB.PERFIS` está planeada, não implementada).
- Dashboard recalcula tudo a cada carregamento — sem cache incremental.
