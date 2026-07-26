/* ============================================================
   BTS App – auth.js
   Autenticação e proteção de páginas via LocalStorage.
   ============================================================ */

const Auth = {
  isLoggedIn() {
    const session = DB.getSession();
    return !!(session && session.username);
  },

  currentUser() {
    return DB.getSession();
  },

  login(username, password) {
    const users = DB.getUsers();
    const user = users.find(u => u.username.toLowerCase() === String(username).toLowerCase() && u.password === password);
    if (!user) return { ok: false, error: 'Utilizador ou palavra-passe incorretos.' };
    DB.setSession({ username: user.username, name: user.name, role: user.role, loginAt: new Date().toISOString() });
    return { ok: true };
  },

  logout() {
    DB.clearSession();
    window.location.href = getLoginPath();
  },

  /* Impede acesso às páginas da app sem sessão ativa */
  requireAuth() {
    if (!this.isLoggedIn()) {
      window.location.replace(getLoginPath());
    }
  },

  /* Impede voltar ao login estando autenticado */
  redirectIfLoggedIn(dashboardPath) {
    if (this.isLoggedIn()) {
      window.location.replace(dashboardPath || 'app/dashboard.html');
    }
  }
};

function getLoginPath() {
  // As páginas da app vivem em /app/, o login vive na raiz.
  const inApp = window.location.pathname.includes('/app/');
  return inApp ? '../login.html' : 'login.html';
}
