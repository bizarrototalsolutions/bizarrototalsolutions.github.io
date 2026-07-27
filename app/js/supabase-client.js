/* ============================================================
   BTS App – supabase-client.js
   Ligação ao backend Supabase (autenticação real por e-mail
   e palavra-passe).

   Só a chave "anon/public" vive aqui — é uma chave concebida
   para correr no browser (não dá acesso a nada por si só); a
   proteção real dos dados fica sempre do lado do servidor,
   nas políticas RLS de cada tabela. Nunca colocar aqui a
   service_role key.
   ============================================================ */

const SUPABASE_URL = 'https://vjbvjzmxbeoyflhrwrpy.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqYnZqem14YmVveWZsaHJ3cnB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ4MzAzMjcsImV4cCI6MjEwMDQwNjMyN30.XC7m4KXLqdif6AeoskiAckjvTpKCZIiI3Nza_FoY0qY';

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});
