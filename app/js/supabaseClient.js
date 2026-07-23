/* ============================================================
   BTS App – supabaseClient.js
   Cria o cliente Supabase único, partilhado por toda a aplicação
   (window.supabaseClient). Depende de:
     1. <script src=".../@supabase/supabase-js@2">  (SDK)
     2. app/js/env.js                                (SUPABASE_URL / KEY)
   Tem de ser carregado ANTES de app/js/auth.js.
   ============================================================ */

(function () {
  if (typeof supabase === 'undefined' || !supabase.createClient) {
    console.error('BTS: SDK do Supabase não carregou. Verifica a ligação à internet / o <script> do @supabase/supabase-js.');
    return;
  }

  var url = window.SUPABASE_URL;
  var key = window.SUPABASE_ANON_KEY;

  if (!url || !key || url.indexOf('SEU-PROJETO') !== -1 || key.indexOf('SUA-CHAVE') !== -1) {
    console.warn('BTS: configura SUPABASE_URL e SUPABASE_ANON_KEY em app/js/env.js antes de usar a autenticação.');
  }

  window.supabaseClient = supabase.createClient(url, key, {
    auth: {
      persistSession: true,      // mantém a sessão após atualizar a página
      autoRefreshToken: true,    // renova o token automaticamente
      detectSessionInUrl: true,  // necessário para o link de recuperação de password
      storageKey: 'bts-auth'
    }
  });
})();
