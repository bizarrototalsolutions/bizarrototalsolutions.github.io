/* ============================================================
   BTS App – env.js
   Configuração do Supabase para este site.

   NUNCA colocar aqui a "service_role key" — apenas a "anon key"
   (chave pública), que é segura para expor no browser porque
   toda a proteção real vem das políticas de Row Level Security
   configuradas em supabase/02_auth_perfis_rls.sql.

   Como preencher:
   1. Supabase Dashboard → Project Settings → API.
   2. Copiar "Project URL"       → SUPABASE_URL
   3. Copiar "anon public" key   → SUPABASE_ANON_KEY
   ============================================================ */

window.SUPABASE_URL = 'https://vjbvjzmxbeoyflhrwrpy.supabase.co';
window.SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqYnZqem14YmVveWZsaHJ3cnB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ4MzAzMjcsImV4cCI6MjEwMDQwNjMyN30.XC7m4KXLqdif6AeoskiAckjvTpKCZIiI3Nza_FoY0qY';
