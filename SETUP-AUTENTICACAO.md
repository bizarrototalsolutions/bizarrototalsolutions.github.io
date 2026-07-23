# Autenticação Supabase — Guia de Configuração

Este documento descreve como pôr o sistema de autenticação 100% funcional.
Depois destes passos, **qualquer pessoa consegue criar conta pela aplicação** —
nunca é preciso criar utilizadores manualmente no painel do Supabase.

## 1. Criar/usar um projeto Supabase

Se ainda não tens um projeto: [supabase.com](https://supabase.com) → *New Project*.

## 2. Correr o SQL

No painel do Supabase → **SQL Editor**, corre os ficheiros por ordem:

1. `supabase/schema_1.sql` — schema de negócio (zonas, clientes, serviços, etc.), caso ainda não tenha sido aplicado.
2. `supabase/02_auth_perfis_rls.sql` — cria `public.profiles`, o trigger que cria o perfil automaticamente após o registo, e todas as políticas de Row Level Security.

Este segundo ficheiro é seguro correr mesmo que o primeiro já tenha sido aplicado antes (usa `if not exists` / `or replace` / `drop policy if exists`).

## 3. Configurar as chaves da aplicação

Edita `app/js/env.js`:

```js
window.SUPABASE_URL = 'https://XXXXXXXX.supabase.co';       // Project Settings → API → Project URL
window.SUPABASE_ANON_KEY = 'eyJhbGciOi...';                  // Project Settings → API → anon public key
```

Nunca coloques aqui a `service_role key` — só a `anon key`, que é pública por natureza (a segurança real vem das políticas RLS do passo 2).

## 4. Configurar o Supabase Auth no painel

Em **Authentication**:

- **Providers → Email**: confirma que está **ativo** e que **"Enable Email Signups"** está **ligado**. Sem isto, o registo pela aplicação fica bloqueado mesmo com o código todo certo.
- **Settings → "Confirm email"**:
  - **Ativo** (recomendado em produção) → depois do registo, o utilizador recebe um email e só entra depois de clicar no link. A aplicação já trata este caso (mostra a mensagem "Verifica o teu email").
  - **Desativado** → o utilizador fica autenticado imediatamente após o registo, sem precisar de confirmar nada. A aplicação também já trata este caso (login automático + redirecionamento para o Dashboard).
- **URL Configuration**:
  - **Site URL**: o domínio onde o site está publicado (ex: `https://bts.exemplo.pt`).
  - **Redirect URLs**: adiciona `https://<o-teu-domínio>/login.html` e `https://<o-teu-domínio>/atualizar-password.html` (e as versões locais, ex: `http://localhost:5500/atualizar-password.html`, se testares localmente). Sem isto, o link de "Esqueci-me da password" não vai funcionar.

## 5. Testar o fluxo completo

1. Abrir `registo.html` → criar conta → (se a confirmação estiver ativa) confirmar o email → entrar em `login.html`.
2. Confirmar que o `public.profiles` tem uma linha nova (SQL Editor → `select * from public.profiles;`).
3. Entrar, confirmar que é redirecionado para `app/dashboard.html`.
4. Atualizar a página (F5) e confirmar que a sessão se mantém.
5. Ir a **O Meu Perfil** (menu lateral) → editar nome/foto → guardar.
6. Terminar sessão (ícone no canto superior direito) → confirmar redireciona para `login.html`.
7. Em `login.html` → "Esqueceste-te da palavra-passe?" → pedir recuperação → seguir o link do email → definir nova palavra-passe em `atualizar-password.html`.

## Ficheiros relevantes

| Ficheiro | Função |
|---|---|
| `app/js/env.js` | Credenciais do projeto Supabase (URL + anon key) |
| `app/js/supabaseClient.js` | Cria o cliente Supabase único (`window.supabaseClient`) |
| `app/js/auth.js` | Toda a lógica de autenticação (signUp, signIn, logout, reset, updateProfile, requireAuth, ...) |
| `login.html` | Login |
| `registo.html` | Criar conta |
| `recuperar-password.html` | Pedir link de recuperação |
| `atualizar-password.html` | Definir nova password (a partir do link do email) |
| `app/perfil.html` + `app/js/perfil.js` | Ver/editar perfil e alterar password (autenticado) |
| `supabase/02_auth_perfis_rls.sql` | Tabela `profiles`, trigger `on_auth_user_created`, RLS/policies |

## Nota sobre o modelo de dados de negócio

As páginas de Clientes/Serviços/Zonas/Agenda continuam, por agora, a guardar os
seus dados em `localStorage` (não foram alteradas nesta entrega — o pedido era
especificamente o sistema de autenticação). O schema SQL e as políticas RLS
para essas tabelas já estão prontos em `supabase/02_auth_perfis_rls.sql`, pelo
que a app já pode ser ligada a essas tabelas reais numa fase seguinte, sem
tocar novamente na autenticação.
