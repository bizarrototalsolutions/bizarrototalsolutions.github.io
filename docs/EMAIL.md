# Email do site — ROTA 100% GRATUITA (recomendada)

Sem Brevo, sem Supabase, sem pagar caixas de email. Custo: 0 €.

**Receber em `geral@dizarro.pt`** (reencaminha para o teu Gmail) — ImprovMX, plano gratuito:
1. Criar conta em <https://improvmx.com> e adicionar o domínio `dizarro.pt`.
2. No dominios.pt (DNS → Gerir zona), criar os 2 registos **MX** que o ImprovMX indicar (`mx1.improvmx.com` prioridade 10 e `mx2.improvmx.com` prioridade 20) e o **TXT** de SPF: `v=spf1 include:spf.improvmx.com ~all`.
3. No ImprovMX, alias `geral` → `bizarrototalsolutions@gmail.com`.

**Enviar como `geral@dizarro.pt`** (a partir do Gmail, grátis):
1. Conta Google → Segurança → ativar verificação em 2 passos → **Palavras-passe de aplicações** → gerar uma.
2. Gmail → Definições → Contas → *Enviar email como* → adicionar `geral@dizarro.pt` com SMTP `smtp.gmail.com`, porta `587`, TLS, utilizador = o teu Gmail, password = a palavra-passe de aplicação (não a normal).
3. Para o SPF não falhar, junta no mesmo registo SPF: `v=spf1 include:spf.improvmx.com include:_spf.google.com ~all`.

**Formulário do site:** já funciona e é grátis (FormSubmit) — não é preciso mexer em nada. O `mailUrl` fica vazio.

> As secções abaixo (Brevo + função no Supabase) são **opcionais** e ficam só como alternativa futura.

---

# Email do site (SMTP com Brevo) — guia de montagem

Objetivo: (1) ter emails `@dizarro.pt`; (2) os pedidos do formulário chegarem por email enviado pelo Brevo, sem depender do FormSubmit.

> O site é estático (GitHub Pages) e **não pode guardar passwords/chaves no browser**. Por isso o formulário chama uma função no Supabase (`supabase/functions/send-lead`) que guarda a chave do Brevo como *segredo* e envia o email.

O DNS de `dizarro.pt` está no **dominios.pt** (servidores `dns*.host-redirect.com`). Hoje o domínio **não tem MX, SPF nem DMARC** — parte do zero.

---

## Parte A — Conta Brevo e domínio (tu fazes, ~15 min)

1. Criar conta em <https://www.brevo.com> (plano gratuito: 300 emails/dia).
2. **Senders, Domains & Dedicated IPs → Domains → Add a domain** → `dizarro.pt`.
3. O Brevo mostra os registos a criar. Copia **exatamente** os valores que ele indicar para o dominios.pt (DNS → Gerir zona):
   - 1× **TXT** `brevo-code:…` (verificação)
   - 2× **CNAME** `brevo1._domainkey` / `brevo2._domainkey` (DKIM)
   - 1× **TXT** `_dmarc` → `v=DMARC1; p=none; rua=mailto:geral@dizarro.pt` (começa em `p=none`)
   - **SPF** (TXT em `@`): `v=spf1 include:spf.brevo.com ~all`
     Só pode existir **um** registo SPF. Se também usares outro fornecedor de email, junta os `include:` no mesmo registo.
4. Voltar ao Brevo → **Authenticate**. Pode demorar de minutos até 24 h.
5. **Senders → Add a sender**: `geral@dizarro.pt`, nome "Dizarro".
6. **SMTP & API → API Keys → Generate a new API key** (nome: `site-dizarro`).
   🔐 **Não a coloques no chat nem no código.** Guarda-a só no passo B2.

## Parte B — Função de envio (Supabase)

> ⚠️ O projeto Supabase do site (`bizarrototalsolutions`, ref `vjbvjzmxbeoyflhrwrpy`) está **pausado**. Tem de ser restaurado (Dashboard → Restore project) antes de a função funcionar.

1. Restaurar o projeto.
2. **Edge Functions → Secrets** (Dashboard) — criar:
   | Nome | Valor |
   |---|---|
   | `BREVO_API_KEY` | a chave do passo A6 |
   | `MAIL_FROM` | `geral@dizarro.pt` (tem de ser o sender verificado) |
   | `LEAD_TO` | para onde chegam os pedidos (ex.: `bizarrototalsolutions@gmail.com` ou `geral@dizarro.pt`) |
3. Publicar a função (ou pedir ao Claude Code para a publicar depois de os segredos existirem):
   ```bash
   supabase functions deploy send-lead --no-verify-jwt --project-ref vjbvjzmxbeoyflhrwrpy
   ```
   (`--no-verify-jwt` porque é chamada por visitantes anónimos; a função protege-se sozinha: origens permitidas, destinatário fixo, honeypot, limites e escape de HTML.)
4. Ativar no site — em `js/layout.js`:
   ```js
   mailUrl: 'https://vjbvjzmxbeoyflhrwrpy.supabase.co/functions/v1/send-lead'
   ```
   Enquanto `mailUrl` estiver vazio, o site continua a usar o FormSubmit (nada parte). Com `mailUrl` preenchido o formulário envia pelo Brevo e usa o FormSubmit só como reserva.
5. Testar: enviar um pedido pelo formulário e confirmar que chega a `LEAD_TO`.

## Parte C — Caixa `geral@dizarro.pt` (receber)

O Brevo **envia**, não tem caixa de entrada. Para **receber** em `@dizarro.pt`, o caminho mais simples e gratuito:

1. No dominios.pt, criar um **reencaminhamento** `geral@dizarro.pt → bizarrototalsolutions@gmail.com` (se o plano tiver "Email forwarding"; ele cria os registos MX).
   - Alternativa: caixa Zoho Mail gratuita no domínio (MX + SPF do Zoho no mesmo registo SPF).
2. No Gmail → **Definições → Contas → Enviar email como → Adicionar outro endereço**:
   - Email: `geral@dizarro.pt`
   - Servidor SMTP: `smtp-relay.brevo.com` · porta `587` · TLS
   - Utilizador: o *SMTP login* do Brevo · Password: a *SMTP key* (Brevo → SMTP & API → SMTP) — **não** é a API key.
   Assim respondes a partir do Gmail com o remetente `@dizarro.pt`.

## Verificação final

- <https://mxtoolbox.com/SuperTool.aspx> → `dizarro.pt`: ver MX, SPF e DKIM.
- Enviar um email teste para um Gmail e abrir "Mostrar original": **SPF = PASS, DKIM = PASS, DMARC = PASS**.
- Depois de uma semana sem problemas, subir o DMARC de `p=none` para `p=quarantine`.
