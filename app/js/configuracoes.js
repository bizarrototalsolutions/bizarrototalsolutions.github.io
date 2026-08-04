/* ============================================================
   BTS App – configuracoes.js
   Quatro secções (separadores simples, sem router): dados da
   empresa, categorias/tipos de serviço, conta e backup.
   ============================================================ */

const ConfiguracoesPage = {

  async init() {
    Auth.requireAuth();
    await DB.ready();
    UI.init('configuracoes');
    this.bindTabs();
    this.preencherEmpresa();
    this.renderCategorias();
    this.preencherConta();
    this.bindEmpresa();
    this.bindCategorias();
    this.bindConta();
    this.bindBackup();
  },

  bindTabs() {
    document.querySelectorAll('#config-tabs .nav-link').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#config-tabs .nav-link').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.querySelectorAll('.config-pane').forEach(p => p.style.display = 'none');
        document.getElementById('pane-' + btn.dataset.tab).style.display = 'block';
      });
    });
  },

  /* ---------------- Empresa ---------------- */
  preencherEmpresa() {
    const cfg = DB.getConfig();
    const campos = ['empresa', 'nif', 'website', 'morada', 'codigoPostal', 'localidade', 'pais', 'email', 'telefone', 'iban', 'logo'];
    campos.forEach(f => {
      const el = document.getElementById('cfg-' + f);
      if (el && cfg[f] !== undefined && cfg[f] !== null) el.value = cfg[f];
    });
    document.getElementById('cfg-corPrimaria').value = cfg.corPrimaria || '#F5A800';
    document.getElementById('cfg-corSecundaria').value = cfg.corSecundaria || '#1A2B4A';
    document.getElementById('cfg-tema').value = cfg.tema || 'light';
  },

  bindEmpresa() {
    document.getElementById('form-empresa').addEventListener('submit', async (e) => {
      e.preventDefault();
      const dados = {
        empresa: document.getElementById('cfg-empresa').value.trim(),
        nif: document.getElementById('cfg-nif').value.trim(),
        website: document.getElementById('cfg-website').value.trim(),
        morada: document.getElementById('cfg-morada').value.trim(),
        codigoPostal: document.getElementById('cfg-codigoPostal').value.trim(),
        localidade: document.getElementById('cfg-localidade').value.trim(),
        pais: document.getElementById('cfg-pais').value.trim(),
        email: document.getElementById('cfg-email').value.trim(),
        telefone: document.getElementById('cfg-telefone').value.trim(),
        iban: document.getElementById('cfg-iban').value.trim(),
        logo: document.getElementById('cfg-logo').value.trim(),
        corPrimaria: document.getElementById('cfg-corPrimaria').value,
        corSecundaria: document.getElementById('cfg-corSecundaria').value,
        tema: document.getElementById('cfg-tema').value
      };
      try {
        await DB.saveConfig(dados);
        Utils.toast('Configurações da empresa guardadas.', 'success');
        UI.renderSidebar('configuracoes'); // atualiza logo/nome no menu lateral
      } catch (err) {
        Utils.toast(err.message || 'Não foi possível guardar as configurações.', 'danger');
      }
    });
  },

  /* ---------------- Categorias & Tipos ---------------- */
  renderCategorias() {
    const categorias = DB.getCategorias();
    const el = document.getElementById('lista-categorias');
    if (!categorias.length) {
      el.innerHTML = `<div class="bts-empty-state bts-card"><i class="fa-solid fa-layer-group"></i><p class="mb-0">Ainda não há categorias de serviço.</p></div>`;
      return;
    }
    el.innerHTML = categorias.map(cat => `
      <div class="bts-card mb-3">
        <div class="bts-card-body">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <h6 class="mb-0">${cat.icone || '🔧'} ${Utils.escapeHtml(cat.nome)}</h6>
            <button class="btn btn-sm btn-bts-outline text-danger" onclick="ConfiguracoesPage.eliminarCategoria('${cat.id}')">
              <i class="fa-solid fa-trash me-1"></i>Eliminar categoria
            </button>
          </div>
          <div class="d-flex flex-wrap gap-2 mb-3">
            ${cat.tipos.length ? cat.tipos.map(t => `
              <span class="badge bts-badge-secondary d-inline-flex align-items-center gap-2 py-2 px-3">
                ${Utils.escapeHtml(t)}
                <i class="fa-solid fa-xmark" style="cursor:pointer" onclick="ConfiguracoesPage.eliminarTipo('${cat.id}','${Utils.escapeHtml(t).replace(/'/g, "\\'")}')"></i>
              </span>
            `).join('') : '<span class="text-muted small">Sem tipos ainda.</span>'}
          </div>
          <form class="d-flex gap-2" onsubmit="ConfiguracoesPage.adicionarTipo(event, '${cat.id}')">
            <input type="text" class="form-control form-control-sm" placeholder="Novo tipo (ex: Manutenção)" style="max-width:260px" required />
            <button type="submit" class="btn btn-sm btn-bts-outline"><i class="fa-solid fa-plus me-1"></i>Adicionar tipo</button>
          </form>
        </div>
      </div>
    `).join('');
  },

  bindCategorias() {
    document.getElementById('form-nova-categoria').addEventListener('submit', async (e) => {
      e.preventDefault();
      const nomeEl = document.getElementById('nova-categoria-nome');
      const iconeEl = document.getElementById('nova-categoria-icone');
      const nome = nomeEl.value.trim();
      if (!nome) return;
      try {
        const cat = await DB.addCategoria(nome, iconeEl.value.trim() || '🔧');
        if (!cat) { Utils.toast('Já existe uma categoria com esse nome.', 'warning'); return; }
        nomeEl.value = ''; iconeEl.value = '';
        Utils.toast('Categoria criada.', 'success');
        this.renderCategorias();
      } catch (err) {
        Utils.toast(err.message || 'Não foi possível criar a categoria.', 'danger');
      }
    });
  },

  async adicionarTipo(e, categoriaId) {
    e.preventDefault();
    const input = e.target.querySelector('input');
    const nome = input.value.trim();
    if (!nome) return;
    try {
      const resultado = await DB.addTipoACategoria(categoriaId, nome);
      if (!resultado) { Utils.toast('Esse tipo já existe nesta categoria.', 'warning'); return; }
      Utils.toast('Tipo adicionado.', 'success');
      this.renderCategorias();
    } catch (err) {
      Utils.toast(err.message || 'Não foi possível adicionar o tipo.', 'danger');
    }
  },

  async eliminarTipo(categoriaId, nomeTipo) {
    const ok = await Utils.confirmDialog(`Eliminar o tipo "${nomeTipo}"?`, 'Eliminar tipo');
    if (!ok) return;
    try {
      await DB.deleteTipo(categoriaId, nomeTipo);
      Utils.toast('Tipo eliminado.', 'success');
      this.renderCategorias();
    } catch (err) {
      Utils.toast(err.message || 'Não foi possível eliminar o tipo.', 'danger');
    }
  },

  async eliminarCategoria(categoriaId) {
    const ok = await Utils.confirmDialog('Eliminar esta categoria e todos os seus tipos?', 'Eliminar categoria');
    if (!ok) return;
    try {
      await DB.deleteCategoria(categoriaId);
      Utils.toast('Categoria eliminada.', 'success');
      this.renderCategorias();
    } catch (err) {
      Utils.toast(err.message || 'Não foi possível eliminar a categoria.', 'danger');
    }
  },

  /* ---------------- Conta ---------------- */
  preencherConta() {
    const user = Auth.currentUser() || {};
    document.getElementById('conta-email').textContent = user.username || user.name || '—';
    document.getElementById('perfil-nome').value = user.name || '';
  },

  bindConta() {
    document.getElementById('btn-terminar-sessao').addEventListener('click', async () => {
      const ok = await Utils.confirmDialog('Tens a certeza que queres terminar sessão?', 'Terminar sessão');
      if (ok) Auth.logout();
    });

    document.getElementById('form-perfil').addEventListener('submit', async (e) => {
      e.preventDefault();
      const nome = document.getElementById('perfil-nome').value.trim();
      const resultado = await Auth.updateNome(nome);
      if (!resultado.ok) { Utils.toast(resultado.error, 'danger'); return; }
      Utils.toast('Nome atualizado.', 'success');
      UI.renderTopbar(); // o nome/iniciais no topo têm de refletir já a alteração
    });

    document.getElementById('form-password').addEventListener('submit', async (e) => {
      e.preventDefault();
      const nova = document.getElementById('password-nova').value;
      const confirmar = document.getElementById('password-confirmar').value;
      const erro = document.getElementById('password-erro');
      erro.style.display = 'none';

      const resultado = await Auth.updatePassword(nova, confirmar);
      if (!resultado.ok) {
        erro.textContent = resultado.error;
        erro.style.display = 'block';
        return;
      }
      document.getElementById('form-password').reset();
      Utils.toast('Palavra-passe alterada.', 'success');
    });
  },

  /* ---------------- Backup ---------------- */
  bindBackup() {
    document.getElementById('btn-exportar-backup').addEventListener('click', () => {
      const dados = DB.exportAll();
      Utils.downloadJSON(dados, `bts_backup_${Utils.todayISO()}.json`);
      Utils.toast('Backup descarregado.', 'success');
    });

    document.getElementById('input-importar-backup').addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const progresso = document.getElementById('importar-progresso');
      progresso.style.display = 'block';
      progresso.textContent = 'A importar... isto pode demorar um pouco consoante a quantidade de dados.';
      try {
        const texto = await file.text();
        const dados = JSON.parse(texto);
        await DB.importAll(dados);
        progresso.textContent = 'Importação concluída.';
        Utils.toast('Backup importado com sucesso.', 'success');
        this.preencherEmpresa();
        this.renderCategorias();
      } catch (err) {
        console.error('Configurações: erro ao importar backup ->', err);
        progresso.textContent = 'Erro ao importar. Verifica se o ficheiro é um backup válido da BTS.';
        Utils.toast('Não foi possível importar o backup.', 'danger');
      } finally {
        e.target.value = '';
      }
    });
  }
};

document.addEventListener('DOMContentLoaded', () => ConfiguracoesPage.init());
