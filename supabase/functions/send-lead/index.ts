/* ============================================================
   Dizarro — Edge Function: send-lead
   Recebe os pedidos de orçamento / contacto do site e envia o
   email através do Brevo (SMTP transacional, via API HTTPS).

   Segredos (Supabase → Edge Functions → Secrets) — NUNCA no código:
     BREVO_API_KEY   chave API v3 do Brevo
     MAIL_FROM       remetente verificado no Brevo (ex.: geral@dizarro.pt)
     LEAD_TO         quem recebe os pedidos (ex.: geral@dizarro.pt)
   Opcional:
     MAIL_FROM_NAME  (default "Dizarro — site")

   Proteções: lista de origens permitidas, destinatário fixo no servidor
   (não vem do pedido → não serve de "open relay"), honeypot, limites de
   tamanho, escape de HTML e limite de pedidos por IP (best-effort).
   ============================================================ */

const ALLOWED_ORIGINS = [
  'https://dizarro.pt',
  'https://www.dizarro.pt',
  'https://bizarrototalsolutions.github.io',
];

const BREVO_URL = 'https://api.brevo.com/v3/smtp/email';
const MAX = { nome: 80, telefone: 30, email: 120, servico: 40, localidade: 80, assunto: 120, mensagem: 2000, pagina: 200 };

/* limite por IP: 5 pedidos / 10 min (memória da instância — best-effort) */
const hits = new Map<string, number[]>();
function limited(ip: string): boolean {
  const now = Date.now(), win = 10 * 60 * 1000;
  const arr = (hits.get(ip) || []).filter((t) => now - t < win);
  arr.push(now);
  hits.set(ip, arr);
  return arr.length > 5;
}

function cors(origin: string | null): Record<string, string> {
  const ok = origin && ALLOWED_ORIGINS.includes(origin);
  return {
    'Access-Control-Allow-Origin': ok ? origin! : ALLOWED_ORIGINS[0],
    'Access-Control-Allow-Headers': 'content-type, apikey, authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Vary': 'Origin',
  };
}

function json(body: unknown, status: number, origin: string | null): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...cors(origin) },
  });
}

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));

function clean(v: unknown, max: number): string {
  return String(v ?? '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim().slice(0, max);
}

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

Deno.serve(async (req: Request) => {
  const origin = req.headers.get('origin');

  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors(origin) });
  if (req.method !== 'POST') return json({ ok: false, error: 'method' }, 405, origin);
  if (!origin || !ALLOWED_ORIGINS.includes(origin)) return json({ ok: false, error: 'origin' }, 403, origin);

  const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'unknown';
  if (limited(ip)) return json({ ok: false, error: 'rate' }, 429, origin);

  let b: Record<string, unknown>;
  try { b = await req.json(); } catch { return json({ ok: false, error: 'json' }, 400, origin); }

  // honeypot: bots preenchem; respondemos "ok" sem enviar nada
  if (clean(b._honey, 50)) return json({ ok: true }, 200, origin);

  const tipo = b.tipo === 'contacto' ? 'contacto' : 'orcamento';
  const nome = clean(b.nome, MAX.nome);
  const telefone = clean(b.telefone, MAX.telefone);
  const email = clean(b.email, MAX.email);
  const servico = clean(b.servico, MAX.servico);
  const localidade = clean(b.localidade, MAX.localidade);
  const assunto = clean(b.assunto, MAX.assunto);
  const mensagem = clean(b.mensagem, MAX.mensagem);
  const pagina = clean(b.pagina, MAX.pagina);

  if (!nome || !mensagem || (!telefone && !email)) return json({ ok: false, error: 'campos' }, 422, origin);
  if (email && !EMAIL_RE.test(email)) return json({ ok: false, error: 'email' }, 422, origin);

  const key = Deno.env.get('BREVO_API_KEY');
  const from = Deno.env.get('MAIL_FROM');
  const to = Deno.env.get('LEAD_TO');
  if (!key || !from || !to) return json({ ok: false, error: 'config' }, 500, origin);

  const titulo = tipo === 'orcamento'
    ? `💰 Novo pedido de orçamento — ${nome}`
    : `✉️ Nova mensagem — ${assunto || nome}`;

  const linhas: [string, string][] = [
    ['Nome', nome],
    ['Telefone', telefone],
    ['Email', email],
    ['Área', servico],
    ['Localidade', localidade],
    ['Assunto', assunto],
    ['Mensagem', mensagem],
    ['Página', pagina],
  ];
  const usadas = linhas.filter(([, v]) => v);

  const html =
    `<div style="font-family:Arial,sans-serif;font-size:15px;color:#15181C">` +
    `<h2 style="margin:0 0 12px;color:#EF4A11">${esc(titulo)}</h2>` +
    `<table cellpadding="8" style="border-collapse:collapse;width:100%;max-width:560px">` +
    usadas.map(([k, v]) =>
      `<tr><td style="border-bottom:1px solid #ddd;width:120px;color:#666"><b>${esc(k)}</b></td>` +
      `<td style="border-bottom:1px solid #ddd;white-space:pre-wrap">${esc(v)}</td></tr>`).join('') +
    `</table><p style="color:#888;font-size:12px;margin-top:16px">Enviado pelo site dizarro.pt</p></div>`;
  const text = usadas.map(([k, v]) => `${k}: ${v}`).join('\n');

  const payload: Record<string, unknown> = {
    sender: { name: Deno.env.get('MAIL_FROM_NAME') || 'Dizarro — site', email: from },
    to: [{ email: to }],
    subject: titulo,
    htmlContent: html,
    textContent: text,
  };
  if (email) payload.replyTo = { email, name: nome };

  try {
    const r = await fetch(BREVO_URL, {
      method: 'POST',
      headers: { 'api-key': key, 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!r.ok) {
      console.error('brevo', r.status, await r.text());
      return json({ ok: false, error: 'envio' }, 502, origin);
    }
    return json({ ok: true }, 200, origin);
  } catch (e) {
    console.error('brevo fetch', e);
    return json({ ok: false, error: 'envio' }, 502, origin);
  }
});
