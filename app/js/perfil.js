/* ============================================================
   BTS App – perfil.js
   Página do Perfil: ver/editar dados pessoais e alterar password.
   ============================================================ */

const PerfilPage = {
  async init() {
    const sessao = await Auth.requireAuth();
    if (!sessao) return; // requireAuth já redirecionou para o login
    UI.init('perfil');
    this.preencherEcra();
    this.ligarFormularioPerfil();
    this.ligarFormularioPassword();
  },

  preencherEcra() {
    const user = Auth.currentUser();
    const profile = Auth.currentProfile();
    if (!user) return;

    document.getElementById('perfil-email').value = user.email || '';
    document.getElementById('perfil-nome').value = (profile && profile.full_name) || '';
    document.getElementById('perfil-avatar').value = (profile && profile.avatar_url) || '';

    this.atualizarPreview(profile, user);
  },

  atualizarPreview(profile, user) {
    const nome = (profile && profile.full_name) || user.email;
    const avatarUrl = profile && profile.avatar_url;
    const avatarBox = document.getElementById('perfil-avatar-preview');
    avatarBox.innerHTML = avatarUrl
      ? `<img src="${Utils.escapeHtml(avatarUrl)}" alt="" style="width:100%;height:100%;border-radius:50%;object-fit:cover" />`
      : '<i class="fa-solid fa-user"></i>';

    document.getElementById('perfil-nome-preview').textContent = nome || 'Utilizador';
    document.getElementById('perfil-email-preview').textContent = user.email || '';

    const criadoEm = profile && profile.created_at;
    document.getElementById('perfil-criado-em').textContent = criadoEm
      ? `Conta criada em ${Utils.formatDate(criadoEm)}`
      : '';
  },

  ligarFormularioPerfil() {
    const form = document.getElementById('form-perfil');
    const erroBox = document.getElementById('perfil-erro');
    const submitBtn = document.getElementById('perfil-submit');
    const submitLabel = document.getElementById('perfil-submit-label');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      erroBox.style.display = 'none';

      const fullName = document.getElementById('perfil-nome').value.trim();
      const avatarUrl = document.getElementById('perfil-avatar').value.trim();

      if (fullName.length < 2) {
        erroBox.textContent = 'Indica o teu nome completo.';
        erroBox.style.display = 'block';
        return;
      }
      if (avatarUrl && !/^https?:\/\//i.test(avatarUrl)) {
        erroBox.textContent = 'O URL da foto deve começar por http:// ou https://';
        erroBox.style.display = 'block';
        return;
      }

      submitBtn.disabled = true;
      submitLabel.textContent = 'A guardar…';
      const result = await Auth.updateProfile({ fullName, avatarUrl });
      submitBtn.disabled = false;
      submitLabel.textContent = 'Guardar alterações';

      if (!result.ok) {
        erroBox.textContent = result.error;
        erroBox.style.display = 'block';
        return;
      }

      this.atualizarPreview(result.profile, Auth.currentUser());
      UI.renderTopbar(); // atualiza nome/avatar na topbar imediatamente
      Utils.toast('Perfil atualizado com sucesso.', 'success');
    });
  },

  ligarFormularioPassword() {
    const form = document.getElementById('form-password');
    const erroBox = document.getElementById('password-erro');
    const submitBtn = document.getElementById('password-submit');
    const submitLabel = document.getElementById('password-submit-label');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      erroBox.style.display = 'none';

      const nova = document.getElementById('password-nova').value;
      const confirmar = document.getElementById('password-confirmar').value;

      if (nova.length < 6) {
        erroBox.textContent = 'A nova palavra-passe deve ter pelo menos 6 caracteres.';
        erroBox.style.display = 'block';
        return;
      }
      if (nova !== confirmar) {
        erroBox.textContent = 'As palavras-passe não coincidem.';
        erroBox.style.display = 'block';
        return;
      }

      submitBtn.disabled = true;
      submitLabel.textContent = 'A alterar…';
      const result = await Auth.updatePassword(nova);
      submitBtn.disabled = false;
      submitLabel.textContent = 'Alterar palavra-passe';

      if (!result.ok) {
        erroBox.textContent = result.error;
        erroBox.style.display = 'block';
        return;
      }

      form.reset();
      Utils.toast('Palavra-passe alterada com sucesso.', 'success');
    });
  }
};

document.addEventListener('DOMContentLoaded', () => PerfilPage.init());
