-- ============================================================
-- BTS App — Esquema Supabase/PostgreSQL (Fase 2, revisão final)
-- ============================================================
-- Decisões de arquitetura fixadas nesta revisão:
--   - Chaves primárias em TEXT (migração sem remapear IDs).
--   - Soft delete (`deleted_at`) em todas as tabelas de negócio,
--     em vez de DELETE físico — nunca se perde um registo por engano.
--   - created_at/updated_at/created_by/updated_by em todas as
--     tabelas principais.
--   - RLS ligado em todas as tabelas; políticas ficam para a Fase 7.
--   - Tabelas genéricas (auditoria, comentarios, anexos, tags) usam
--     entidade/entidade_id — flexíveis, mas SEM FK garantida pelo
--     Postgres; a validação de integridade destas passa para o
--     Repositório (Fase 5).
-- ============================================================


-- ============================================================
-- 1. PERFIS e PERMISSÕES
-- ============================================================
create table public.perfis (
  id          uuid primary key references auth.users(id) on delete cascade,
  nome        text not null,
  perfil      text not null default 'Administrador'
              check (perfil in ('Administrador', 'Gestor', 'Técnico', 'Apenas Leitura')),
  criado_em   timestamptz not null default now()
);
comment on table public.perfis is 'Perfil de acesso de cada utilizador autenticado. 1:1 com auth.users.';

-- Permissões configuráveis na BASE DE DADOS, não só num mapa fixo
-- no código — assim é possível ajustar o que cada perfil pode
-- fazer sem reimplantar a aplicação.
create table public.permissoes (
  perfil      text not null check (perfil in ('Administrador', 'Gestor', 'Técnico', 'Apenas Leitura')),
  acao        text not null,          -- ex: 'servicos:editar', 'clientes:eliminar'
  permitido   boolean not null default false,

  primary key (perfil, acao)
);


-- ============================================================
-- 2. ZONAS (entidade de referência piloto — Fase 6)
-- ============================================================
create table public.zonas (
  id            text primary key,
  nome          text not null,
  codigo        text default '',
  cor           text default '#2979D4',
  estado        text not null default 'Ativa' check (estado in ('Ativa', 'Inativa')),
  observacoes   text default '',

  criado_em     timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),
  criado_por    uuid references auth.users(id) on delete set null,
  atualizado_por uuid references auth.users(id) on delete set null,
  deleted_at    timestamptz,          -- soft delete: NULL = ativo/existente

  constraint zonas_nome_unico unique (nome)
);

create index idx_zonas_estado on public.zonas (estado);
create index idx_zonas_deleted on public.zonas (deleted_at);


-- ============================================================
-- 3. CATEGORIAS E TIPOS DE SERVIÇO
-- ============================================================
create table public.categorias_servico (
  id              text primary key,
  nome            text not null,
  icone           text default '🔧',

  criado_em       timestamptz not null default now(),
  atualizado_em   timestamptz not null default now(),
  criado_por      uuid references auth.users(id) on delete set null,
  atualizado_por  uuid references auth.users(id) on delete set null,
  deleted_at      timestamptz,

  constraint categorias_nome_unico unique (nome)
);

create table public.tipos_servico (
  id              text primary key,
  categoria_id    text not null references public.categorias_servico(id) on delete restrict,
  nome            text not null,

  criado_em       timestamptz not null default now(),
  atualizado_em   timestamptz not null default now(),
  criado_por      uuid references auth.users(id) on delete set null,
  deleted_at      timestamptz,

  constraint tipos_servico_nome_unico_por_categoria unique (categoria_id, nome)
);

create index idx_tipos_servico_categoria on public.tipos_servico (categoria_id);


-- ============================================================
-- 4. FUNCIONÁRIOS e VIATURAS
-- ============================================================
create table public.funcionarios (
  id              text primary key,
  nome            text not null,
  email           text,
  telefone        text,
  especialidade   text,
  estado          text not null default 'Ativo' check (estado in ('Ativo', 'Inativo')),
  cor             text default '#2979D4',
  observacoes     text default '',

  criado_em       timestamptz not null default now(),
  atualizado_em   timestamptz not null default now(),
  criado_por      uuid references auth.users(id) on delete set null,
  atualizado_por  uuid references auth.users(id) on delete set null,
  deleted_at      timestamptz
);

create index idx_funcionarios_estado on public.funcionarios (estado);

create table public.viaturas (
  id              text primary key,
  matricula       text not null,
  modelo          text,
  -- Se o funcionário for removido, a viatura sobrevive, só fica
  -- por atribuir — nunca faz sentido apagar uma viatura porque
  -- o condutor saiu.
  funcionario_id  text references public.funcionarios(id) on delete set null,
  estado          text not null default 'Ativa' check (estado in ('Ativa', 'Inativa')),
  observacoes     text default '',

  criado_em       timestamptz not null default now(),
  atualizado_em   timestamptz not null default now(),
  criado_por      uuid references auth.users(id) on delete set null,
  deleted_at      timestamptz,

  constraint viaturas_matricula_unica unique (matricula)
);

create index idx_viaturas_funcionario on public.viaturas (funcionario_id);


-- ============================================================
-- 5. CLIENTES (+ contactos e moradas próprias)
-- ============================================================
create table public.clientes (
  id              text primary key,
  uuid_externo    uuid unique default gen_random_uuid(),  -- para integrações externas futuras
  nome            text not null,
  nif             text,
  morada          text,
  codigo_postal   text,
  localidade      text,
  distrito        text,
  -- Zona é dado de referência de negócio: nunca eliminar zona em
  -- uso (RESTRICT), independentemente de soft-delete existir —
  -- é uma segunda camada de proteção, não uma redundância.
  zona_id         text references public.zonas(id) on delete restrict,
  telefone        text,
  telemovel       text,
  email           text,
  contacto        text,               -- contacto principal "rápido"; ver clientes_contactos para a lista completa
  observacoes     text default '',
  estado          text not null default 'Ativo' check (estado in ('Ativo', 'Inativo')),

  criado_em       timestamptz not null default now(),
  atualizado_em   timestamptz not null default now(),
  criado_por      uuid references auth.users(id) on delete set null,
  atualizado_por  uuid references auth.users(id) on delete set null,
  deleted_at      timestamptz
);

create index idx_clientes_zona on public.clientes (zona_id);
create index idx_clientes_estado on public.clientes (estado);
create index idx_clientes_nome on public.clientes (nome);
create index idx_clientes_nif on public.clientes (nif);
create index idx_clientes_deleted on public.clientes (deleted_at);

-- Um cliente pode ter vários contactos (financeiro, obra, geral...).
create table public.clientes_contactos (
  id            text primary key,
  cliente_id    text not null references public.clientes(id) on delete cascade,
  nome          text not null,
  cargo         text,
  telefone      text,
  email         text,
  principal     boolean not null default false,
  observacoes   text default '',
  criado_em     timestamptz not null default now(),
  deleted_at    timestamptz
);

create index idx_clientes_contactos_cliente on public.clientes_contactos (cliente_id);

-- Moradas independentes por tipo (faturação/instalação/correspondência).
-- Reservada: a interface continua a usar os campos de morada
-- diretos em Cliente/Serviço até esta tabela ser adotada.
create table public.moradas (
  id            text primary key,
  cliente_id    text not null references public.clientes(id) on delete cascade,
  tipo          text not null check (tipo in ('faturacao', 'instalacao', 'correspondencia')),
  morada        text,
  codigo_postal text,
  localidade    text,
  distrito      text,
  principal     boolean not null default false,
  criado_em     timestamptz not null default now(),
  deleted_at    timestamptz
);

create index idx_moradas_cliente on public.moradas (cliente_id);


-- ============================================================
-- 6. SERVIÇOS — a entidade principal
-- ============================================================
create table public.servicos (
  id                    text primary key,
  uuid_externo          uuid unique default gen_random_uuid(),
  numero                text not null,

  cliente_id            text not null references public.clientes(id) on delete restrict,
  cliente_nome          text not null,

  zona_id               text references public.zonas(id) on delete restrict,
  zona                  text,

  morada                text,
  codigo_postal         text,
  localidade            text,

  data                  date not null,
  hora_inicio           time not null,
  hora_fim              time not null,

  categoria_id          text references public.categorias_servico(id) on delete restrict,
  categoria             text,
  tipo_servico_id       text references public.tipos_servico(id) on delete restrict,
  tipo_servico          text,

  area                  numeric(10, 2),
  estado                text not null default 'Pendente'
                        check (estado in ('Pendente', 'Confirmado', 'Em Curso', 'Concluído', 'Cancelado')),
  prioridade            text not null default 'Normal'
                        check (prioridade in ('Baixa', 'Normal', 'Alta', 'Urgente')),

  -- Se o funcionário/viatura for removido do sistema, o serviço
  -- não pode ser bloqueado nem apagado — só perde a atribuição.
  -- O texto snapshot preserva quem foi historicamente.
  funcionario_id        text references public.funcionarios(id) on delete set null,
  funcionario           text,
  viatura_id            text references public.viaturas(id) on delete set null,

  observacoes           text default '',

  recorrencia           jsonb,
  tempo_gasto           numeric(10, 2),
  observacoes_tecnicas  text default '',
  materiais_utilizados  jsonb default '[]'::jsonb,
  orcamento_id          text,
  relatorio_final       text,
  gps_localizacao       jsonb,
  checklist             jsonb default '[]'::jsonb,

  criado_em             timestamptz not null default now(),
  atualizado_em         timestamptz not null default now(),
  criado_por            uuid references auth.users(id) on delete set null,
  atualizado_por        uuid references auth.users(id) on delete set null,
  deleted_at            timestamptz,

  constraint servicos_numero_unico unique (numero),
  constraint servicos_horas_coerentes check (hora_fim > hora_inicio)
);

create index idx_servicos_cliente on public.servicos (cliente_id);
create index idx_servicos_zona on public.servicos (zona_id);
create index idx_servicos_categoria on public.servicos (categoria_id);
create index idx_servicos_tipo on public.servicos (tipo_servico_id);
create index idx_servicos_funcionario on public.servicos (funcionario_id);
create index idx_servicos_viatura on public.servicos (viatura_id);
create index idx_servicos_estado on public.servicos (estado);
create index idx_servicos_prioridade on public.servicos (prioridade);
create index idx_servicos_data on public.servicos (data);
create index idx_servicos_deleted on public.servicos (deleted_at);


-- ------------------------------------------------------------
-- Numeração do Serviço — sequence atómica (sem condição de corrida)
-- ------------------------------------------------------------
create sequence public.servico_numero_seq;

create or replace function public.gerar_numero_servico()
returns trigger as $$
begin
  if new.numero is null then
    new.numero := 'BTS-' || extract(year from now()) || '-' ||
                  lpad(nextval('public.servico_numero_seq')::text, 6, '0');
  end if;
  return new;
end;
$$ language plpgsql;

create trigger trg_gerar_numero_servico
  before insert on public.servicos
  for each row execute function public.gerar_numero_servico();

-- Mantém updated_at correto automaticamente em qualquer UPDATE,
-- em todas as tabelas com essa coluna — uma função só, reutilizada.
create or replace function public.atualizar_timestamp()
returns trigger as $$
begin
  new.atualizado_em := now();
  return new;
end;
$$ language plpgsql;

create trigger trg_servicos_atualizado_em    before update on public.servicos    for each row execute function public.atualizar_timestamp();
create trigger trg_clientes_atualizado_em    before update on public.clientes    for each row execute function public.atualizar_timestamp();
create trigger trg_zonas_atualizado_em       before update on public.zonas       for each row execute function public.atualizar_timestamp();
create trigger trg_funcionarios_atualizado_em before update on public.funcionarios for each row execute function public.atualizar_timestamp();
create trigger trg_viaturas_atualizado_em    before update on public.viaturas    for each row execute function public.atualizar_timestamp();
create trigger trg_categorias_atualizado_em  before update on public.categorias_servico for each row execute function public.atualizar_timestamp();


-- ============================================================
-- 7. FICHEIROS — generalizado a QUALQUER entidade (não só Serviços)
-- ============================================================
-- Sem FK direta (entidade/entidade_id é polimórfico) — a
-- validação de que entidade_id existe fica no Repositório.
create table public.anexos (
  id              text primary key,
  entidade        text not null,        -- 'servico' | 'cliente' | 'zona' | ...
  entidade_id     text not null,
  tipo            text not null check (tipo in ('foto_antes', 'foto_depois', 'anexo', 'assinatura')),
  url             text not null,
  nome_ficheiro   text,
  tamanho_bytes   bigint,
  criado_por      uuid references auth.users(id) on delete set null,
  criado_em       timestamptz not null default now(),
  deleted_at      timestamptz
);

create index idx_anexos_entidade on public.anexos (entidade, entidade_id);
create index idx_anexos_tipo on public.anexos (tipo);


-- ============================================================
-- 8. AUDITORIA (negócio) e LOGS TÉCNICOS (operacional/segurança)
-- ============================================================
-- Auditoria = "o que mudou, quem mudou, de que valor para que valor"
-- — já existia desde a Fase 2 inicial, mantida tal e qual.
create table public.auditoria (
  id              bigint generated always as identity primary key,
  entidade        text not null,
  entidade_id     text not null,
  tipo_acao       text not null,
  detalhe         text,
  valor_anterior  jsonb,        -- ex: {"estado":"Pendente","zona":"Lisboa"} — genérico para qualquer entidade
  valor_novo      jsonb,        -- ex: {"estado":"Concluído","zona":"Setúbal"}
  utilizador_id   uuid references auth.users(id) on delete set null,
  motivo          text,
  criado_em       timestamptz not null default now()
);

create index idx_auditoria_entidade on public.auditoria (entidade, entidade_id);
create index idx_auditoria_criado_em on public.auditoria (criado_em desc);

-- Logs técnicos = erros, tentativas de login falhadas, falhas de
-- integração — telemetria operacional, não histórico de negócio.
-- Pedido explícito da Fase 7 (segurança).
create table public.logs_tecnicos (
  id            bigint generated always as identity primary key,
  nivel         text not null check (nivel in ('info', 'aviso', 'erro')),
  origem        text not null,        -- ex: 'auth', 'servicos-service', 'migracao'
  mensagem      text not null,
  contexto      jsonb,
  utilizador_id uuid references auth.users(id) on delete set null,
  criado_em     timestamptz not null default now()
);

create index idx_logs_tecnicos_nivel on public.logs_tecnicos (nivel);
create index idx_logs_tecnicos_criado_em on public.logs_tecnicos (criado_em desc);


-- ============================================================
-- 9. COMENTÁRIOS INTERNOS (genérico, mesmo padrão de auditoria)
-- ============================================================
create table public.comentarios (
  id              text primary key,
  entidade        text not null,
  entidade_id     text not null,
  utilizador_id   uuid references auth.users(id) on delete set null,
  autor_nome      text,               -- retrato histórico do autor, mesma lógica de sempre
  texto           text not null,
  criado_em       timestamptz not null default now(),
  deleted_at      timestamptz
);

create index idx_comentarios_entidade on public.comentarios (entidade, entidade_id);


-- ============================================================
-- 10. ETIQUETAS (tags) — genérico
-- ============================================================
create table public.tags (
  id      text primary key,
  nome    text not null,
  cor     text default '#6B7280',

  constraint tags_nome_unico unique (nome)
);

create table public.entidade_tags (
  entidade      text not null,
  entidade_id   text not null,
  tag_id        text not null references public.tags(id) on delete cascade,

  primary key (entidade, entidade_id, tag_id)
);

create index idx_entidade_tags_entidade on public.entidade_tags (entidade, entidade_id);


-- ============================================================
-- 11. NOTIFICAÇÕES e PREFERÊNCIAS DO UTILIZADOR
-- ============================================================
-- Reservada: hoje os alertas do Dashboard são sempre recalculados
-- ao vivo. Esta tabela prepara alertas persistentes/lidos.
create table public.notificacoes (
  id            bigint generated always as identity primary key,
  utilizador_id uuid not null references auth.users(id) on delete cascade,
  tipo          text not null,
  titulo        text not null,
  mensagem      text,
  entidade      text,
  entidade_id   text,
  lida          boolean not null default false,
  criado_em     timestamptz not null default now()
);

create index idx_notificacoes_utilizador on public.notificacoes (utilizador_id, lida);

-- Diferente de `preferencias_dispositivo` (que fica só no browser,
-- decisão já tomada na Fase 3.1): isto é conta-level, segue o
-- utilizador entre dispositivos (ex: notificações por email, idioma).
create table public.preferencias_utilizador (
  utilizador_id uuid not null references auth.users(id) on delete cascade,
  chave         text not null,
  valor         jsonb,

  primary key (utilizador_id, chave)
);


-- ============================================================
-- 12. CONFIGURAÇÕES (linha única — sem soft delete, não faz sentido aqui)
-- ============================================================
create table public.configuracoes (
  id              boolean primary key default true,
  nome_empresa    text default 'BTS – Bizarro Total Solutions',
  nif             text,
  morada          text,
  codigo_postal   text,
  localidade      text,
  pais            text default 'Portugal',
  email           text,
  telefone        text,
  website         text,
  iban            text,
  logo_url        text,
  cor_principal   text default '#F5A800',
  cor_secundaria  text default '#1A2B4A',
  tema_padrao     text default 'light',
  -- Preparado para envio de email (recuperação de password já é
  -- tratada pelo próprio Supabase Auth; isto serve para notificações
  -- da aplicação no futuro — nulo até existir essa funcionalidade).
  smtp            jsonb,

  atualizado_em   timestamptz not null default now(),
  atualizado_por  uuid references auth.users(id) on delete set null,

  constraint configuracoes_linha_unica check (id)
);

insert into public.configuracoes (id) values (true);


-- ============================================================
-- 13. ROW LEVEL SECURITY — ligado já, políticas na Fase 7
-- ============================================================
alter table public.perfis                 enable row level security;
alter table public.permissoes             enable row level security;
alter table public.zonas                  enable row level security;
alter table public.categorias_servico     enable row level security;
alter table public.tipos_servico          enable row level security;
alter table public.funcionarios           enable row level security;
alter table public.viaturas               enable row level security;
alter table public.clientes               enable row level security;
alter table public.clientes_contactos     enable row level security;
alter table public.moradas                enable row level security;
alter table public.servicos               enable row level security;
alter table public.anexos                 enable row level security;
alter table public.auditoria              enable row level security;
alter table public.logs_tecnicos          enable row level security;
alter table public.comentarios            enable row level security;
alter table public.tags                   enable row level security;
alter table public.entidade_tags          enable row level security;
alter table public.notificacoes           enable row level security;
alter table public.preferencias_utilizador enable row level security;
alter table public.configuracoes          enable row level security;
