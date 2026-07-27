/* ============================================================
   BTS App – auth.js
   Autenticação REAL via Supabase Auth (e-mail + palavra-passe).

   Mantém-se a mesma API síncrona que o resto da app já usa
   (Auth.isLoggedIn / Auth.currentUser / Auth.requireAuth), para
   nenhum outro ficheiro (ui.js, agenda.js, clientes.js...)
   precisar de mudar — só se troca o "motor" por dentro:
   um pequeno marcador de sessão em localStorage (bts_session)
   que é criado/apagado a partir da sessão real do Supabase.

   Não existe nenhum formulário de registo público. As contas
   são criadas apenas pelo dono do site, diretamente no painel
   do Supabase (Authentication → Users) — exatamente como pedido.
   ============================================================ */

const Auth = {
  isLoggedIn() {
    const session = DB.getSession();
    return !!(session && session.username);
  },

  currentUser() {
    return DB.getSession();
  },

  /* username aqui é o e-mail da conta Supabase. */
  async login(username, password) {
    let result;
    try {
      result = await supabaseClient.auth.signInWithPassword({
        email: String(username).trim(),
        password: String(password)
      });
    } catch (e) {
      return { ok: false, error: 'Não foi possível ligar ao servidor. Verifica a tua ligação à internet.' };
    }

    const { data, error } = result;
    if (error || !data || !data.session) {
      return { ok: false, error: mapAuthError(error) };
    }

    const user = data.user;
    const meta = user.user_metadata || {};
    DB.setSession({
      username: user.email,
      name: meta.full_name || meta.name || user.email,
      role: 'Administrador',
      loginAt: new Date().toISOString()
    });
    return { ok: true };
  },

  async logout() {
    try { await supabaseClient.auth.signOut(); } catch (e) { /* ignora - limpamos localmente na mesma */ }
    DB.clearSession();
    window.location.href = getLoginPath();
  },

  /* Impede acesso às páginas da app sem sessão ativa.
     Verificação imediata (marcador local, síncrono) + confirmação
     em segundo plano contra o Supabase, para expulsar também quem
     tiver uma sessão local "forjada" ou expirada. */
  requireAuth() {
    if (!this.isLoggedIn()) {
      window.location.replace(getLoginPath());
      return;
    }
    supabaseClient.auth.getSession().then(({ data }) => {
      if (!data || !data.session) {
        DB.clearSession();
        window.location.replace(getLoginPath());
      }
    }).catch(() => { /* sem rede: mantém a sessão local por agora */ });
  },

  /* Impede voltar ao login estando autenticado */
  redirectIfLoggedIn(dashboardPath) {
    if (this.isLoggedIn()) {
      window.location.replace(dashboardPath || 'app/dashboard.html');
    }
  }
};

/* Se a sessão Supabase terminar (expirou, foi revogada, ou fez
   logout noutro separador), limpa também o marcador local — as
   duas nunca devem ficar dessincronizadas. */
if (typeof supabaseClient !== 'undefined') {
  supabaseClient.auth.onAuthStateChange((event) => {
    if (event === 'SIGNED_OUT') DB.clearSession();
  });
}

function getLoginPath() {
  // As páginas da app vivem em /app/, o login vive na raiz.
  const inApp = window.location.pathname.includes('/app/');
  return inApp ? '../login.html' : 'login.html';
}

/* Traduz os erros mais comuns do Supabase Auth para mensagens
   claras em português. Mostra sempre o texto original também
   (consola + fallback), para nunca ficarmos "às cegas" quando
   o problema não é mesmo a password (ex: login por e-mail
   desativado no projeto, captcha exigido, demasiadas tentativas). */
function mapAuthError(error) {
  const msg = (error && error.message) || '';
  console.error('BTS Auth: erro no login ->', error);

  if (/invalid login credentials/i.test(msg)) {
    return 'Utilizador ou palavra-passe incorretos.';
  }
  if (/email logins? (is|are) disabled/i.test(msg)) {
    return 'O login por e-mail/password está desativado nas definições do projeto Supabase (Authentication → Providers → Email).';
  }
  if (/email not confirmed/i.test(msg)) {
    return 'Este e-mail ainda não foi confirmado.';
  }
  if (/captcha/i.test(msg)) {
    return 'O Supabase está a exigir captcha para este login (Authentication → Settings → Bot/Captcha Protection). Desativa essa opção ou configura o captcha no site.';
  }
  if (/rate limit|too many requests/i.test(msg)) {
    return 'Demasiadas tentativas seguidas. Espera um minuto e tenta novamente.';
  }
  if (!msg) {
    return 'Não foi possível contactar o Supabase (verifica a ligação à internet ou se a chave/URL do projeto está correta).';
  }
  return 'Erro no login: ' + msg;
}
