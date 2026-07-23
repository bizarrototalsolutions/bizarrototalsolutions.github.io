-- ============================================================
-- BTS App — Migração 02: Autenticação Supabase + public.profiles + RLS
-- ============================================================
-- Este ficheiro completa a Fase 7 já prevista no schema_1.sql
-- ("políticas ficam para a Fase 7"). Corre DEPOIS do schema_1.sql
-- num projeto novo, ou isolado num projeto que já tenha o
-- schema_1.sql aplicado.
--
-- O que este ficheiro faz:
--   1. Cria a tabela public.profiles (perfil de conta, 1:1 com
--      auth.users), exatamente como pedido: id, email, full_name,
--      avatar_url, created_at, updated_at.
--   2. Substitui a tabela public.perfis (schema_1.sql, secção 1),
--      que tinha o mesmo propósito (1:1 com auth.users) mas nomes
--      diferentes e sem ligação a Auth nenhuma — nunca chegou a ser
--      povoada porque não havia Sign Up real. Se já tiveres dados
--      em public.perfis, o bloco abaixo copia-os para profiles antes
--      de remover a tabela antiga; se a tabela não existir, o bloco
--      é ignorado sem erro.
--   3. Cria o trigger que cria automaticamente um registo em
--      profiles sempre que nasce um novo auth.users (Sign Up).
--   4. Ativa RLS e cria as policies em TODAS as tabelas do
--      schema_1.sql.
--
-- IMPORTANTE sobre o modelo de RLS escolhido:
--   - profiles, notificacoes, preferencias_utilizador → dados
--     PESSOAIS: cada utilizador só vê/edita os SEUS próprios.
--   - zonas, clientes, servicos, funcionarios, viaturas,
--     categorias_servico, tipos_servico, anexos, comentarios,
--     tags, entidade_tags, auditoria, configuracoes → dados da
--     EMPRESA (CRM interno partilhado pela equipa). Qualquer
--     utilizador autenticado pode ler/escrever — é assim que uma
--     ferramenta de gestão interna (agenda, clientes, serviços)
--     tem de funcionar: não faria sentido um técnico não conseguir
--     ver os serviços que outro colega criou. O isolamento "cada
--     um só vê o que é seu" aplica-se aos dados de CONTA, não aos
--     dados de NEGÓCIO — mantemos os dois modelos claramente
--     separados e comentados abaixo.
--   - logs_tecnicos → apenas leitura/escrita pelo backend (service
--     role); nenhuma policy para o cliente autenticado (fica
--     bloqueada por omissão, que é o comportamento correto).
--   - permissoes → tabela de configuração de roles; leitura para
--     qualquer utilizador autenticado, escrita reservada ao
--     service role (é gerida por quem administra o sistema, não
--     pela aplicação cliente).
-- ============================================================


-- ============================================================
-- 1. TABELA public.profiles
-- ============================================================
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null,
  full_name   text,
  avatar_url  text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table public.profiles is 'Perfil de conta de cada utilizador autenticado. Criado automaticamente pelo trigger on_auth_user_created.';

create index if not exists idx_profiles_email on public.profiles (email);

-- Mantém updated_at correto em qualquer UPDATE (reaproveita a
-- mesma função já definida no schema_1.sql; recriada aqui com
-- "or replace" para este ficheiro também funcionar sozinho).
create or replace function public.atualizar_timestamp_generico()
returns trigger as $$
begin
  new.updated_at := now();
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
  before update on public.profiles
  for each row execute function public.atualizar_timestamp_generico();


-- ------------------------------------------------------------
-- 1.1 Migração best-effort de public.perfis (se existir) → profiles
-- ------------------------------------------------------------
do $$
begin
  if exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'perfis') then
    insert into public.profiles (id, email, full_name, created_at, updated_at)
    select p.id,
           coalesce(u.email, ''),
           p.nome,
           coalesce(p.criado_em, now()),
           now()
    from public.perfis p
    join auth.users u on u.id = p.id
    on conflict (id) do nothing;

    drop table public.perfis cascade;
  end if;
end $$;


-- ============================================================
-- 2. TRIGGER: criar profile automaticamente após Sign Up
-- ============================================================
-- SECURITY DEFINER é obrigatório aqui: o INSERT em public.profiles
-- corre no momento em que auth.users está a ser criado, antes de o
-- novo utilizador ter qualquer sessão/JWT — sem SECURITY DEFINER a
-- RLS bloquearia esta escrita.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    nullif(new.raw_user_meta_data ->> 'avatar_url', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Mantém o email em profiles sincronizado se o utilizador alterar
-- o email de login diretamente no Auth (auth.users.email muda).
create or replace function public.handle_user_email_updated()
returns trigger as $$
begin
  if new.email is distinct from old.email then
    update public.profiles set email = new.email, updated_at = now() where id = new.id;
  end if;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_auth_user_email_updated on auth.users;
create trigger on_auth_user_email_updated
  after update of email on auth.users
  for each row execute function public.handle_user_email_updated();


-- ============================================================
-- 3. RLS — public.profiles (dados pessoais)
-- ============================================================
alter table public.profiles enable row level security;

drop policy if exists "profiles: ver o próprio perfil" on public.profiles;
create policy "profiles: ver o próprio perfil"
  on public.profiles for select
  to authenticated
  using (id = auth.uid());

drop policy if exists "profiles: editar o próprio perfil" on public.profiles;
create policy "profiles: editar o próprio perfil"
  on public.profiles for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- Sem policy de INSERT/DELETE para o cliente: a criação é feita
-- exclusivamente pelo trigger (SECURITY DEFINER, ignora RLS) e não
-- deve existir eliminação de perfil pela aplicação (segue o
-- auth.users via "on delete cascade").


-- ============================================================
-- 4. RLS — dados pessoais (notificações e preferências)
-- ============================================================
alter table public.notificacoes enable row level security;

drop policy if exists "notificacoes: apenas o próprio utilizador" on public.notificacoes;
create policy "notificacoes: apenas o próprio utilizador"
  on public.notificacoes for all
  to authenticated
  using (utilizador_id = auth.uid())
  with check (utilizador_id = auth.uid());

alter table public.preferencias_utilizador enable row level security;

drop policy if exists "preferencias_utilizador: apenas o próprio utilizador" on public.preferencias_utilizador;
create policy "preferencias_utilizador: apenas o próprio utilizador"
  on public.preferencias_utilizador for all
  to authenticated
  using (utilizador_id = auth.uid())
  with check (utilizador_id = auth.uid());


-- ============================================================
-- 5. RLS — dados de negócio partilhados (qualquer utilizador
--    autenticado lê e escreve; sem acesso anónimo)
-- ============================================================
-- Função auxiliar para não repetir "to authenticated using (true)"
-- policy a policy — mantém a intenção explícita em cada tabela na
-- mesma, para ficar fácil de auditar tabela a tabela.

alter table public.zonas enable row level security;
drop policy if exists "zonas: leitura da equipa autenticada" on public.zonas;
create policy "zonas: leitura da equipa autenticada" on public.zonas for select to authenticated using (true);
drop policy if exists "zonas: escrita da equipa autenticada" on public.zonas;
create policy "zonas: escrita da equipa autenticada" on public.zonas for insert to authenticated with check (true);
drop policy if exists "zonas: atualização da equipa autenticada" on public.zonas;
create policy "zonas: atualização da equipa autenticada" on public.zonas for update to authenticated using (true) with check (true);
drop policy if exists "zonas: eliminação da equipa autenticada" on public.zonas;
create policy "zonas: eliminação da equipa autenticada" on public.zonas for delete to authenticated using (true);

alter table public.categorias_servico enable row level security;
drop policy if exists "categorias_servico: leitura equipa" on public.categorias_servico;
create policy "categorias_servico: leitura equipa" on public.categorias_servico for select to authenticated using (true);
drop policy if exists "categorias_servico: escrita equipa" on public.categorias_servico;
create policy "categorias_servico: escrita equipa" on public.categorias_servico for insert to authenticated with check (true);
drop policy if exists "categorias_servico: atualização equipa" on public.categorias_servico;
create policy "categorias_servico: atualização equipa" on public.categorias_servico for update to authenticated using (true) with check (true);
drop policy if exists "categorias_servico: eliminação equipa" on public.categorias_servico;
create policy "categorias_servico: eliminação equipa" on public.categorias_servico for delete to authenticated using (true);

alter table public.tipos_servico enable row level security;
drop policy if exists "tipos_servico: leitura equipa" on public.tipos_servico;
create policy "tipos_servico: leitura equipa" on public.tipos_servico for select to authenticated using (true);
drop policy if exists "tipos_servico: escrita equipa" on public.tipos_servico;
create policy "tipos_servico: escrita equipa" on public.tipos_servico for insert to authenticated with check (true);
drop policy if exists "tipos_servico: atualização equipa" on public.tipos_servico;
create policy "tipos_servico: atualização equipa" on public.tipos_servico for update to authenticated using (true) with check (true);
drop policy if exists "tipos_servico: eliminação equipa" on public.tipos_servico;
create policy "tipos_servico: eliminação equipa" on public.tipos_servico for delete to authenticated using (true);

alter table public.funcionarios enable row level security;
drop policy if exists "funcionarios: leitura equipa" on public.funcionarios;
create policy "funcionarios: leitura equipa" on public.funcionarios for select to authenticated using (true);
drop policy if exists "funcionarios: escrita equipa" on public.funcionarios;
create policy "funcionarios: escrita equipa" on public.funcionarios for insert to authenticated with check (true);
drop policy if exists "funcionarios: atualização equipa" on public.funcionarios;
create policy "funcionarios: atualização equipa" on public.funcionarios for update to authenticated using (true) with check (true);
drop policy if exists "funcionarios: eliminação equipa" on public.funcionarios;
create policy "funcionarios: eliminação equipa" on public.funcionarios for delete to authenticated using (true);

alter table public.viaturas enable row level security;
drop policy if exists "viaturas: leitura equipa" on public.viaturas;
create policy "viaturas: leitura equipa" on public.viaturas for select to authenticated using (true);
drop policy if exists "viaturas: escrita equipa" on public.viaturas;
create policy "viaturas: escrita equipa" on public.viaturas for insert to authenticated with check (true);
drop policy if exists "viaturas: atualização equipa" on public.viaturas;
create policy "viaturas: atualização equipa" on public.viaturas for update to authenticated using (true) with check (true);
drop policy if exists "viaturas: eliminação equipa" on public.viaturas;
create policy "viaturas: eliminação equipa" on public.viaturas for delete to authenticated using (true);

alter table public.clientes enable row level security;
drop policy if exists "clientes: leitura equipa" on public.clientes;
create policy "clientes: leitura equipa" on public.clientes for select to authenticated using (true);
drop policy if exists "clientes: escrita equipa" on public.clientes;
create policy "clientes: escrita equipa" on public.clientes for insert to authenticated with check (true);
drop policy if exists "clientes: atualização equipa" on public.clientes;
create policy "clientes: atualização equipa" on public.clientes for update to authenticated using (true) with check (true);
drop policy if exists "clientes: eliminação equipa" on public.clientes;
create policy "clientes: eliminação equipa" on public.clientes for delete to authenticated using (true);

alter table public.clientes_contactos enable row level security;
drop policy if exists "clientes_contactos: leitura equipa" on public.clientes_contactos;
create policy "clientes_contactos: leitura equipa" on public.clientes_contactos for select to authenticated using (true);
drop policy if exists "clientes_contactos: escrita equipa" on public.clientes_contactos;
create policy "clientes_contactos: escrita equipa" on public.clientes_contactos for insert to authenticated with check (true);
drop policy if exists "clientes_contactos: atualização equipa" on public.clientes_contactos;
create policy "clientes_contactos: atualização equipa" on public.clientes_contactos for update to authenticated using (true) with check (true);
drop policy if exists "clientes_contactos: eliminação equipa" on public.clientes_contactos;
create policy "clientes_contactos: eliminação equipa" on public.clientes_contactos for delete to authenticated using (true);

alter table public.moradas enable row level security;
drop policy if exists "moradas: leitura equipa" on public.moradas;
create policy "moradas: leitura equipa" on public.moradas for select to authenticated using (true);
drop policy if exists "moradas: escrita equipa" on public.moradas;
create policy "moradas: escrita equipa" on public.moradas for insert to authenticated with check (true);
drop policy if exists "moradas: atualização equipa" on public.moradas;
create policy "moradas: atualização equipa" on public.moradas for update to authenticated using (true) with check (true);
drop policy if exists "moradas: eliminação equipa" on public.moradas;
create policy "moradas: eliminação equipa" on public.moradas for delete to authenticated using (true);

alter table public.servicos enable row level security;
drop policy if exists "servicos: leitura equipa" on public.servicos;
create policy "servicos: leitura equipa" on public.servicos for select to authenticated using (true);
drop policy if exists "servicos: escrita equipa" on public.servicos;
create policy "servicos: escrita equipa" on public.servicos for insert to authenticated with check (true);
drop policy if exists "servicos: atualização equipa" on public.servicos;
create policy "servicos: atualização equipa" on public.servicos for update to authenticated using (true) with check (true);
drop policy if exists "servicos: eliminação equipa" on public.servicos;
create policy "servicos: eliminação equipa" on public.servicos for delete to authenticated using (true);

alter table public.anexos enable row level security;
drop policy if exists "anexos: leitura equipa" on public.anexos;
create policy "anexos: leitura equipa" on public.anexos for select to authenticated using (true);
drop policy if exists "anexos: escrita equipa" on public.anexos;
create policy "anexos: escrita equipa" on public.anexos for insert to authenticated with check (true);
drop policy if exists "anexos: atualização equipa" on public.anexos;
create policy "anexos: atualização equipa" on public.anexos for update to authenticated using (true) with check (true);
drop policy if exists "anexos: eliminação equipa" on public.anexos;
create policy "anexos: eliminação equipa" on public.anexos for delete to authenticated using (true);

alter table public.comentarios enable row level security;
drop policy if exists "comentarios: leitura equipa" on public.comentarios;
create policy "comentarios: leitura equipa" on public.comentarios for select to authenticated using (true);
drop policy if exists "comentarios: escrita equipa" on public.comentarios;
create policy "comentarios: escrita equipa" on public.comentarios for insert to authenticated with check (true);
drop policy if exists "comentarios: atualização do autor" on public.comentarios;
create policy "comentarios: atualização do autor" on public.comentarios for update to authenticated using (utilizador_id = auth.uid()) with check (utilizador_id = auth.uid());
drop policy if exists "comentarios: eliminação do autor" on public.comentarios;
create policy "comentarios: eliminação do autor" on public.comentarios for delete to authenticated using (utilizador_id = auth.uid());

alter table public.tags enable row level security;
drop policy if exists "tags: leitura equipa" on public.tags;
create policy "tags: leitura equipa" on public.tags for select to authenticated using (true);
drop policy if exists "tags: escrita equipa" on public.tags;
create policy "tags: escrita equipa" on public.tags for insert to authenticated with check (true);
drop policy if exists "tags: atualização equipa" on public.tags;
create policy "tags: atualização equipa" on public.tags for update to authenticated using (true) with check (true);
drop policy if exists "tags: eliminação equipa" on public.tags;
create policy "tags: eliminação equipa" on public.tags for delete to authenticated using (true);

alter table public.entidade_tags enable row level security;
drop policy if exists "entidade_tags: leitura equipa" on public.entidade_tags;
create policy "entidade_tags: leitura equipa" on public.entidade_tags for select to authenticated using (true);
drop policy if exists "entidade_tags: escrita equipa" on public.entidade_tags;
create policy "entidade_tags: escrita equipa" on public.entidade_tags for insert to authenticated with check (true);
drop policy if exists "entidade_tags: eliminação equipa" on public.entidade_tags;
create policy "entidade_tags: eliminação equipa" on public.entidade_tags for delete to authenticated using (true);

-- Auditoria: qualquer utilizador autenticado pode CRIAR entradas
-- (é a app a registar o que aconteceu) e LER o histórico; nunca
-- UPDATE/DELETE — auditoria é imutável por definição.
alter table public.auditoria enable row level security;
drop policy if exists "auditoria: leitura equipa" on public.auditoria;
create policy "auditoria: leitura equipa" on public.auditoria for select to authenticated using (true);
drop policy if exists "auditoria: escrita equipa" on public.auditoria;
create policy "auditoria: escrita equipa" on public.auditoria for insert to authenticated with check (true);

-- Configurações: linha única da empresa; qualquer utilizador
-- autenticado lê, só pode atualizar (nunca inserir/eliminar — já
-- existe 1 linha fixa por causa da constraint configuracoes_linha_unica).
alter table public.configuracoes enable row level security;
drop policy if exists "configuracoes: leitura equipa" on public.configuracoes;
create policy "configuracoes: leitura equipa" on public.configuracoes for select to authenticated using (true);
drop policy if exists "configuracoes: atualização equipa" on public.configuracoes;
create policy "configuracoes: atualização equipa" on public.configuracoes for update to authenticated using (true) with check (true);

-- Permissões (mapa role → ação): leitura para a equipa (a app
-- precisa de saber o que cada perfil pode fazer); escrita reservada
-- ao service role (chave de serviço, nunca à chave anon/cliente) —
-- por isso não existe nenhuma policy de insert/update/delete aqui.
alter table public.permissoes enable row level security;
drop policy if exists "permissoes: leitura equipa" on public.permissoes;
create policy "permissoes: leitura equipa" on public.permissoes for select to authenticated using (true);

-- logs_tecnicos: sem policies — fica inacessível ao cliente
-- (anon/authenticated), só o service role (backend/Edge Functions)
-- consegue escrever ou ler. É o comportamento de segurança correto
-- para logs de erro/tentativas falhadas de login.
alter table public.logs_tecnicos enable row level security;

-- ============================================================
-- FIM — depois de correr este ficheiro:
--   1. Confirma em Authentication > Providers que "Email" está
--      ativo e "Enable Email Signups" está ligado.
--   2. Decide em Authentication > Settings se queres "Confirm
--      email" ativo (mais seguro) ou desativado (login imediato
--      após registo). O código da aplicação já suporta os dois
--      casos automaticamente.
--   3. Em Authentication > URL Configuration, adiciona o URL do
--      site (e o caminho /atualizar-password.html) à lista de
--      Redirect URLs, senão o link de "Esqueci-me da password"
--      não funciona.
-- ============================================================
