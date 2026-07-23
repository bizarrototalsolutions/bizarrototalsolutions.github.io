/* ============================================================
   BTS App – auth.js
   Autenticação real com Supabase Auth + tabela public.profiles.

   Substitui a versão anterior (LocalStorage / utilizadores fixos).
   Qualquer pessoa pode agora criar conta pela aplicação — não é
   preciso criar utilizadores manualmente no painel do Supabase.
   ============================================================ */

const Auth = {
  _session: null,
  _user: null,
  _profile: null,
  _listening: false,

  /* ---------- Internos ---------- */

  _client() {
    if (!window.supabaseClient) {
      throw new Error('Supabase não está configurado. Verifica app/js/env.js e app/js/supabaseClient.js.');
    }
    return window.supabaseClient;
  },

  // Caminho do login.html a partir de onde a página atual vive.
  _loginPath() {
    const inApp = window.location.pathname.includes('/app/');
    return inApp ? '../login.html' : 'login.html';
  },

  // Caminho do dashboard.html a partir da raiz do site.
  _dashboardPath() {
    return 'app/dashboard.html';
  },

  // Traduz os erros mais comuns do Supabase Auth para mensagens claras em português.
  _traduzirErro(err) {
    const msg = (err && err.message) || String(err || '');
    const mapa = [
      [/Invalid login credentials/i, 'Email ou palavra-passe incorretos.'],
      [/Email not confirmed/i, 'É necessário confirmar o email antes de entrar. Verifica a tua caixa de correio (e o spam).'],
      [/User already registered/i, 'Já existe uma conta criada com este email. Tenta entrar ou recuperar a palavra-passe.'],
      [/Password should be at least|password.*characters/i, 'A palavra-passe deve ter pelo menos 6 caracteres.'],
      [/Unable to validate email address/i, 'O email indicado não é válido.'],
      [/rate limit|too many requests/i, 'Demasiadas tentativas em pouco tempo. Aguarda um pouco e tenta novamente.'],
      [/Email link is invalid or has expired/i, 'Este link é inválido ou já expirou. Pede um novo link de recuperação.'],
      [/New password should be different/i, 'A nova palavra-passe tem de ser diferente da atual.'],
      [/session missing|Auth session missing/i, 'A tua sessão expirou. Inicia sessão novamente.'],
      [/signups.*disabled|Signups not allowed/i, 'O registo de novas contas está desativado neste momento. Contacta o administrador.']
    ];
    for (const [regex, pt] of mapa) {
      if (regex.test(msg)) return pt;
    }
    return msg || 'Ocorreu um erro inesperado. Tenta novamente.';
  },

  async _loadProfile() {
    if (!this._user) { this._profile = null; return null; }
    try {
      const { data, error } = await this._client()
        .from('profiles')
        .select('id, email, full_name, avatar_url, created_at, updated_at')
        .eq('id', this._user.id)
        .maybeSingle();
      if (error) throw error;
      this._profile = data || null;
    } catch (e) {
      console.error('Auth: erro a carregar o perfil', e);
      this._profile = null;
    }
    return this._profile;
  },

  // Liga-se uma única vez às mudanças de sessão (logout noutro separador,
  // token expirado, etc.) para manter o estado sempre correto.
  _watchAuthChanges() {
    if (this._listening) return;
    this._listening = true;
    this._client().auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        this._session = null;
        this._user = null;
        this._profile = null;
        if (window.location.pathname.includes('/app/')) {
          window.location.replace(this._loginPath());
        }
      } else {
        this._session = session;
        this._user = session.user;
      }
    });
  },

  /* ---------- Estado da sessão ---------- */

  // Síncrono: usado pelo ui.js para desenhar a topbar. Só é fiável
  // depois de requireAuth()/redirectIfLoggedIn() terem corrido.
  isLoggedIn() {
    return !!this._user;
  },

  currentUser() {
    if (!this._user) return null;
    return {
      id: this._user.id,
      email: this._user.email,
      name: (this._profile && this._profile.full_name) || this._user.email,
      avatarUrl: this._profile && this._profile.avatar_url,
      role: 'Utilizador'
    };
  },

  currentProfile() {
    return this._profile;
  },

  async getSessionState() {
    const { data, error } = await this._client().auth.getSession();
    if (error) {
      console.error('Auth: erro a obter sessão', error);
      return null;
    }
    return data.session;
  },

  /* ---------- Sign Up (registo) ---------- */
  // Qualquer pessoa pode criar conta. Funciona nos dois modos do
  // Supabase: com confirmação de email ativa (data.session vem nulo,
  // é preciso confirmar antes de entrar) ou desativada (data.session
  // já vem preenchida, login imediato).
  async signUp({ email, password, fullName }) {
    try {
      const { data, error } = await this._client().auth.signUp({
        email: String(email).trim().toLowerCase(),
        password,
        options: {
          data: { full_name: (fullName || '').trim() },
          emailRedirectTo: new URL('login.html', window.location.href).href
        }
      });
      if (error) return { ok: false, error: this._traduzirErro(error) };

      if (data.session) {
        this._session = data.session;
        this._user = data.session.user;
        await this._loadProfile();
        this._watchAuthChanges();
        return { ok: true, confirmacaoNecessaria: false };
      }
      return { ok: true, confirmacaoNecessaria: true };
    } catch (e) {
      return { ok: false, error: this._traduzirErro(e) };
    }
  },

  /* ---------- Login ---------- */
  async signIn({ email, password }) {
    try {
      const { data, error } = await this._client().auth.signInWithPassword({
        email: String(email).trim().toLowerCase(),
        password
      });
      if (error) return { ok: false, error: this._traduzirErro(error) };
      this._session = data.session;
      this._user = data.user;
      await this._loadProfile();
      this._watchAuthChanges();
      return { ok: true };
    } catch (e) {
      return { ok: false, error: this._traduzirErro(e) };
    }
  },

  /* ---------- Logout ---------- */
  async logout() {
    try {
      await this._client().auth.signOut();
    } catch (e) {
      console.error('Auth: erro ao terminar sessão', e);
    }
    this._session = null;
    this._user = null;
    this._profile = null;
    window.location.href = this._loginPath();
  },

  /* ---------- Recuperação de password ---------- */
  async sendPasswordReset(email) {
    try {
      const { error } = await this._client().auth.resetPasswordForEmail(
        String(email).trim().toLowerCase(),
        { redirectTo: new URL('atualizar-password.html', window.location.href).href }
      );
      if (error) return { ok: false, error: this._traduzirErro(error) };
      return { ok: true };
    } catch (e) {
      return { ok: false, error: this._traduzirErro(e) };
    }
  },

  /* ---------- Alteração de password ----------
     Serve tanto para a página de recuperação (após clicar no link
     do email) como para a alteração normal a partir do Perfil,
     enquanto a pessoa está autenticada. */
  async updatePassword(newPassword) {
    try {
      const { error } = await this._client().auth.updateUser({ password: newPassword });
      if (error) return { ok: false, error: this._traduzirErro(error) };
      return { ok: true };
    } catch (e) {
      return { ok: false, error: this._traduzirErro(e) };
    }
  },

  /* ---------- Perfil ---------- */
  async updateProfile({ fullName, avatarUrl }) {
    if (!this._user) return { ok: false, error: 'Sem sessão ativa.' };
    const payload = { updated_at: new Date().toISOString() };
    if (fullName !== undefined) payload.full_name = fullName;
    if (avatarUrl !== undefined) payload.avatar_url = avatarUrl;
    try {
      const { data, error } = await this._client()
        .from('profiles')
        .update(payload)
        .eq('id', this._user.id)
        .select()
        .single();
      if (error) return { ok: false, error: this._traduzirErro(error) };
      this._profile = data;
      return { ok: true, profile: data };
    } catch (e) {
      return { ok: false, error: this._traduzirErro(e) };
    }
  },

  /* ---------- Proteção de rotas ---------- */

  // Chamar no início de todas as páginas privadas (dashboard, clientes, ...).
  // Assíncrono: as páginas devem usar `await Auth.requireAuth();`.
  async requireAuth() {
    const session = await this.getSessionState();
    if (!session) {
      window.location.replace(this._loginPath());
      return null;
    }
    this._session = session;
    this._user = session.user;
    await this._loadProfile();
    this._watchAuthChanges();
    return session;
  },

  // Chamar no login/registo/recuperação: se já houver sessão, salta direto para o Dashboard.
  async redirectIfLoggedIn(dashboardPath) {
    const session = await this.getSessionState();
    if (session) {
      window.location.replace(dashboardPath || this._dashboardPath());
    }
  }
};
