/* ============================================================
   BTS – supabase-public.js
   Cliente Supabase para as páginas públicas do site (contacto e
   orçamento). Usa apenas a chave "anon/public", que é segura para
   correr no browser — só permite inserir pedidos novos, nunca ler,
   alterar ou apagar (ver políticas RLS da tabela pedidos_site).

   Diferente do cliente usado em /app: aqui não há sessão de
   utilizador a persistir, é só um canal de escrita anónimo.
   ============================================================ */

const BTS_SUPABASE_URL = 'https://vjbvjzmxbeoyflhrwrpy.supabase.co';
const BTS_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqYnZqem14YmVveWZsaHJ3cnB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ4MzAzMjcsImV4cCI6MjEwMDQwNjMyN30.XC7m4KXLqdif6AeoskiAckjvTpKCZIiI3Nza_FoY0qY';

const btsPublicClient = window.supabase.createClient(BTS_SUPABASE_URL, BTS_SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false
  }
});
