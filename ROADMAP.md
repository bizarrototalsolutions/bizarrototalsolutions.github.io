# Roadmap — BTS App

> Última atualização: Fase 6 (Zonas) aprovada. Ordena os próximos módulos por prioridade técnica (dependências e risco), não por facilidade de implementação.

## Estado atual

### Módulos concluídos
- **Autenticação** (`login.html`, `auth.js`) — sessão via LocalStorage, proteção de página.
- **Clientes** (`clientes.html`, `cliente.html`) — CRUD completo, exportações, validação de NIF/CP, `zonaId` como referência real.
- **Serviços** (`servicos.html`, `servico.html`) — CRUD completo, numeração imutável, histórico automático, categorias editáveis, `zonaId` + retrato histórico de zona.
- **Agenda** (`agenda.html`, `agenda-service.js`, `agenda.js`) — FullCalendar isolado, drag&drop, reagendamento com regras de negócio, filtro por `zonaId`.
- **Dashboard** (`dashboard.html`, `dashboard-service.js`, `dashboard.js`) — indicadores em tempo real, alertas operacionais, 4 gráficos (incluindo cor real da zona), atualização automática via eventos.
- **Zonas** (`zonas.html`, `zonas.js`) — primeira entidade de referência completa: CRUD, ativar/desativar, integridade referencial, contagem de utilização visível na tabela.

### Módulos parcialmente cobertos (dados existem, interface não)
- **Estatísticas** — o Dashboard cobre boa parte do pedido original, mas não há ainda uma página dedicada a análises mais profundas com filtros de data e exportação de relatórios agregados.

### Módulos preparados mas não implementados
- **Funcionários** — `funcionarioId` reservado no Serviço; sem coleção `DB.getFuncionarios`, sem página. Pode reutilizar diretamente o padrão de entidade de referência criado em Zonas.
- **Viaturas** — `viaturaId` reservado; mesmo padrão.
- **Configurações** — `DB.getConfig`/`saveConfig` existem, sem página de administração.
- **Permissões** — `DB.PERFIS` planeado (decisão: Estados/Prioridades continuam fixos no código, não entidades).
- **Auditoria completa** — falta utilizador, valor anterior/novo estruturado, motivo.
- **Recorrência de serviços** — campo `recorrencia` reservado, sem lógica.
- **Conflitos de agenda fiáveis** — melhor-esforço sobre texto livre; versão correta depende de `funcionarioId`.
- **Operações em lote** — evento agregado `servicos:loteAtualizado` desenhado, não implementado.
- **Faturação/Orçamentos** — `orcamentoId` reservado; indicador "Receita" mostra "Em breve".
- **Fotografias/Anexos/Assinatura digital** — arrays reservados no Serviço, sem UI de upload.

## Mapa de dependências

```
storage.js (DB)
 ├── utils.js  (sem dependências de negócio)
 ├── auth.js  → DB
 ├── ui.js  → DB, Utils, Auth
 │
 ├── Zonas (entidade de referência completa) → DB
 │        usado por: Clientes, Serviços, Agenda, Dashboard
 ├── Categorias (dados) ← usado por: Serviços, Agenda
 │
 ├── zonas.js → DB, Auth, UI, Utils
 ├── clientes.js / cliente.js → DB, Auth, UI, Utils, Zonas (zonaId)
 │
 ├── servicos.js / servico.js → DB, Auth, UI, Utils
 │        depende de Clientes (escolher cliente existente), Zonas (zonaId) e Categorias
 │
 ├── agenda-service.js → DB (só dados; zero DOM, zero FullCalendar)
 ├── agenda.js → agenda-service.js, DB, Auth, UI, Utils, FullCalendar (externo)
 │
 ├── dashboard-service.js → DB (só dados; resolve zonaId → nome/cor)
 └── dashboard.js → dashboard-service.js, DB, Auth, UI, Utils, Chart.js (externo)
```

**Leitura prática:** Zonas deixou de ser uma dependência frágil (texto) e passou a ser uma dependência real (ID) — exatamente o padrão que **Funcionários** e **Viaturas** vão seguir a seguir, copiando a mesma estrutura (`getX/consultarX/addX/updateX/contarUsosX/deleteX` + página de gestão).

## Dívida técnica

### Curto prazo
- Nenhuma pendência curta específica de Zonas — módulo fechado nesta fase.

### Médio prazo
- Módulo de **Funcionários** (desbloqueia `funcionarioId`, conflitos fiáveis, "serviços por técnico") — agora com um padrão de referência já testado (Zonas) para copiar.
- Sistema de **Permissões** (`DB.PERFIS`, `Auth.temPermissao()`).
- **Auditoria enriquecida** (utilizador, valor anterior/novo, motivo) no histórico.
- **Operações em lote** + evento agregado `servicos:loteAtualizado`.
- **Recorrência** de serviços.
- Página de **Configurações** (empresa, utilizadores, backup/restauro).

### Longo prazo
- Migração de `storage.js` para Supabase/PostgreSQL — `zonaId` como chave estrangeira real torna isto mais direto do que seria com texto.
- Cache incremental de estatísticas.
- Módulo de **Faturação/Orçamentos**.
- Módulo de **Viaturas**.
- **Fotografias/Anexos/Assinatura digital** nos Serviços.
- Concorrência multiutilizador real.

## Roadmap proposto (por prioridade técnica)

1. **Funcionários** — desbloqueia três dívidas técnicas de uma vez só (conflitos fiáveis, carga real por técnico, `funcionarioId` deixa de ser órfão). Reutiliza diretamente o padrão de Zonas.
2. **Configurações** (empresa, utilizadores, backup/restauro) — pré-requisito natural antes de Permissões.
3. **Permissões** — só faz sentido depois de existir onde gerir utilizadores (Configurações).
4. **Viaturas** — mesmo padrão de Funcionários/Zonas, menor urgência.
5. **Faturação/Orçamentos** — desbloqueia "Receita" e fecha o ciclo operacional completo.
6. **Operações em lote + Recorrência** — fazem mais sentido depois de Funcionários existir.
7. **Migração para Supabase** — só depois de o modelo de dados estabilizar com os módulos acima.

Esta ordem prioriza **desbloquear dívidas técnicas existentes** antes de somar funcionalidade nova.
